'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { AgeStep } from '@/components/onboarding/AgeStep';
import { LevelStep } from '@/components/onboarding/LevelStep';
import { FocusStep } from '@/components/onboarding/FocusStep';
import { FinalStep } from '@/components/onboarding/FinalStep';
import { ProfileStep } from '@/components/onboarding/ProfileStep';

export type UserProfile = {
  username: string;
  avatar: string;
  ageGroup: string;
  spiritualLevel: string;
  focus: string;
};

const defaultOnboardingData: UserProfile = {
  username: '',
  avatar: 'Lion of Judah',
  ageGroup: '',
  spiritualLevel: '',
  focus: '',
};

type OnboardingContextType = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  data: UserProfile;
  setData: React.Dispatch<React.SetStateAction<UserProfile>>;
  finishOnboardingAsGuest: (profile: Pick<UserProfile, 'username' | 'avatar'>) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default function HomePage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<UserProfile>(defaultOnboardingData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // If user data exists in local storage, redirect to dashboard
    if (localStorage.getItem('bibleQuestsUser')) {
      router.replace('/dashboard');
    }
  }, [router]);
  
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const finishOnboardingAsGuest = async (profile: Pick<UserProfile, 'username' | 'avatar'>) => {
    setLoading(true);
    setError(null);
    try {
        const finalData = { ...data, ...profile };
        setData(finalData);
        localStorage.setItem('bibleQuestsUser', JSON.stringify(finalData));
        nextStep();
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  const steps = [
    <WelcomeStep />,
    <AgeStep />,
    <LevelStep />,
    <FocusStep />,
    <ProfileStep />,
    <FinalStep />,
  ];

  return (
    <OnboardingContext.Provider value={{ step, nextStep, prevStep, data, setData, finishOnboardingAsGuest, loading, error }}>
      <div className="flex h-screen w-full items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-lg">{steps[step]}</div>
      </div>
    </OnboardingContext.Provider>
  );
}
