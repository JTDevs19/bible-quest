
'use client';

import { createContext, useContext } from 'react';
import type { UserProfile } from '@/app/page';

export type OnboardingContextType = {
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

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
