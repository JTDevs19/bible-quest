'use client';

import { useState, createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { AgeStep } from '@/components/onboarding/AgeStep';
import { LevelStep } from '@/components/onboarding/LevelStep';
import { FocusStep } from '@/components/onboarding/FocusStep';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { FinalStep } from '@/components/onboarding/FinalStep';
import { Progress } from '@/components/ui/progress';

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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TotalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const contextValue = { data, setData, nextStep, prevStep, step };

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
