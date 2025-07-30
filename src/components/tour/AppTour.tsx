

'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useUserProgress } from '@/hooks/use-user-progress';
import { useRouter } from 'next/navigation';

const AppTour = () => {
    const { training, completeTraining } = useUserProgress();
    const [run, setRun] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const isTourCompleted = Object.values(training).every(t => t === true);
        if (!isTourCompleted) {
             setTimeout(() => {
                setRun(true);
            }, 1000);
        }
    }, []);
    
    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, step, type, action } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            return;
        }

        if (type === 'step:after' || action === 'next') {
            if (step.target === '#nav-verse-memory') {
                router.push('/dashboard/verse-memory');
            } else if (step.target === '#nav-character-adventures') {
                router.push('/dashboard/character-adventures');
            } else if (step.target === '#nav-bible-mastery') {
                router.push('/dashboard/bible-mastery');
            }
        }
    };
    
    const tourSteps: Step[] = [
        {
            target: '#sidebar-header',
            content: 'Welcome to Bible Quests! This is your main navigation panel.',
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '#main-header',
            content: "Here you can track your Level, EXP, Shields (your 'lives' in games), and Wisdom Keys. Keep an eye on these as you play!",
            placement: 'bottom',
        },
        {
            target: '#nav-treasures',
            content: 'As a new adventurer, you have a special chest waiting for you. Click this to open the treasures page!',
            placement: 'right',
            title: 'Your First Quest!'
        },
        {
            target: '#new-adventurer-chest',
            content: 'It costs 1 Wisdom Key to open (you start with 5!). Click it to see the rewards and open it!',
            placement: 'bottom',
        },
        ...(training.verseMemory === false ? [{
            target: '#nav-verse-memory',
            content: "Let's learn how to play Verse Memory. Click here to start the training.",
            placement: 'right',
        }] : []),
         ...(training.characterAdventures === false ? [{
            target: '#nav-character-adventures',
            content: "Great! Now let's try Character Adventures.",
            placement: 'right',
        }] : []),
         ...(training.bibleMastery === false ? [{
            target: '#nav-bible-mastery',
            content: 'Finally, let\'s look at Bible Mastery, a tougher challenge!',
            placement: 'right',
        }] : []),
    ];

    return (
        <Joyride
            run={run}
            steps={tourSteps}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: 'hsl(var(--primary))',
                    textColor: 'hsl(var(--foreground))',
                    arrowColor: 'hsl(var(--card))',
                    backgroundColor: 'hsl(var(--card))',
                },
                buttonClose: {
                    color: 'hsl(var(--muted-foreground))',
                },
                buttonNext: {
                    backgroundColor: 'hsl(var(--primary))',
                },
                buttonBack: {
                    color: 'hsl(var(--muted-foreground))'
                },
            }}
        />
    );
};

export default AppTour;
