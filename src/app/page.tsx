'use client';

import { useState, createContext, useContext, type Dispatch, type SetStateAction, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { AgeStep } from '@/components/onboarding/AgeStep';
import { LevelStep } from '@/components/onboarding/LevelStep';
import { FocusStep } from '@/components/onboarding/FocusStep';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { FinalStep } from '@/components/onboarding/FinalStep';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { saveUserProfile } from '@/lib/firestore';


export interface OnboardingData {
  ageGroup: string;
  spiritualLevel: string;
  focus: string;
  username: string;
  avatar: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  setData: Dispatch<SetStateAction<OnboardingData>>;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  finishOnboardingAsGuest: (profileData: Pick<OnboardingData, 'username' | 'avatar'>) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

const TotalSteps = 6;

const steps = [
  { id: 1, component: <WelcomeStep /> },
  { id: 2, component: <AgeStep /> },
  { id: 3, component: <LevelStep /> },
  { id: 4, component: <FocusStep /> },
  { id: 5, component: <ProfileStep /> },
  { id: 6, component: <FinalStep /> },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    ageGroup: '',
    spiritualLevel: '',
    focus: '',
    username: '',
    avatar: 'Lion of Judah',
  });
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(!authLoading && user) {
        router.push('/dashboard');
    }
  }, [user, authLoading, router]);


  const nextStep = () => setStep((prev) => Math.min(prev + 1, TotalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const finishOnboardingAsGuest = async (profileData: Pick<OnboardingData, 'username' | 'avatar'>) => {
    setLoading(true);
    setError(null);
    try {
        const userCredential = await signInAnonymously(auth);
        const guestUser = userCredential.user;
        
        await saveUserProfile(guestUser.uid, {
            ...data,
            username: profileData.username,
            avatar: profileData.avatar,
        });
        
        localStorage.setItem('bibleQuestsUser', JSON.stringify(data));
        nextStep();

    } catch (e: any) {
        console.error("Error signing in as guest:", e);
        if (e.code === 'auth/operation-not-allowed' || e.code === 'auth/admin-restricted-operation') {
            setError("Guest sign-in failed. Please enable Anonymous Authentication in your Firebase project's Authentication > Sign-in method tab.");
        } else {
            setError(e.message);
        }
    } finally {
        setLoading(false);
    }
  }

  const contextValue = { data, setData, nextStep, prevStep, step, finishOnboardingAsGuest, error, loading };
  
  if (authLoading || user) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <OnboardingContext.Provider value={contextValue}>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <div className="w-full max-w-xl">
          {step > 1 && step < TotalSteps && (
            <div className="mb-8">
              <Progress value={(step / TotalSteps) * 100} className="w-full" />
              <p className="text-center text-sm text-muted-foreground mt-2">Step {step} of {TotalSteps}</p>
            </div>
          )}
          <AnimatePresence mode="wait">
            {steps.map(
              (item) =>
                item.id === step && (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.component}
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </OnboardingContext.Provider>
  );
}
