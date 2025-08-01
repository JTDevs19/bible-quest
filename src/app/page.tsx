
'use client';

import { useState, createContext, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { AgeStep } from '@/components/onboarding/AgeStep';
import { LevelStep } from '@/components/onboarding/LevelStep';
import { FocusStep } from '@/components/onboarding/FocusStep';
import { FinalStep } from '@/components/onboarding/FinalStep';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { OverviewWelcomeStep } from '@/components/onboarding/OverviewWelcomeStep';
import { OverviewGamesStep } from '@/components/onboarding/OverviewGamesStep';
import { OverviewBenefitsStep } from '@/components/onboarding/OverviewBenefitsStep';
import { OverviewFeaturesStep } from '@/components/onboarding/OverviewFeaturesStep';


export type UserProfile = {
  username: string;
  avatar: string;
  ageGroup: string;
  spiritualLevel: string;
  focus: string;
  language: 'en' | 'fil';
};

const defaultOnboardingData: UserProfile = {
  username: '',
  avatar: 'Lion of Judah',
  ageGroup: '',
  spiritualLevel: '',
  focus: '',
  language: 'en',
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
  audioRef: React.RefObject<HTMLAudioElement>;
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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // If user data exists in local storage, redirect to dashboard
    if (localStorage.getItem('bibleQuestUser')) {
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
        localStorage.setItem('bibleQuestUser', JSON.stringify(finalData));
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
    <OverviewWelcomeStep />,
    <OverviewGamesStep />,
    <OverviewBenefitsStep />,
    <OverviewFeaturesStep />,
    <FinalStep />,
  ];

  return (
    <OnboardingContext.Provider value={{ step, nextStep, prevStep, data, setData, finishOnboardingAsGuest, loading, error, audioRef }}>
       <audio ref={audioRef} loop>
          <source src="/bg-game-opening.mp3" type="audio/mpeg" />
        </audio>
      <div className="flex h-screen w-full items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-lg">{steps[step]}</div>
      </div>
    </OnboardingContext.Provider>
  );
}
