
'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

const AppTour = () => {
    const [run, setRun] = useState(false);
    
    useEffect(() => {
        const tourCompleted = localStorage.getItem('bibleQuestsTourCompleted');
        if (tourCompleted !== 'true') {
            // Use a timeout to ensure the dashboard has mounted
            setTimeout(() => {
                setRun(true);
            }, 500);
        }
    }, []);
    
    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = ['finished', 'skipped'];

        if (finishedStatuses.includes(status)) {
            localStorage.setItem('bibleQuestsTourCompleted', 'true');
            setRun(false);
        }
    };
    
    const tourSteps: Step[] = [
        {
            target: '#sidebar-header',
            content: 'Welcome to Bible Quests! This is your main navigation panel.',
            placement: 'right',
        },
        {
            target: '#nav-dashboard',
            content: 'Your Dashboard gives you a summary of your profile and progress.',
            placement: 'right',
        },
        {
            target: '#nav-verse-memory',
            content: 'In Verse Memory, you can practice memorizing key Bible verses.',
            placement: 'right',
        },
        {
            target: '#nav-character-adventures',
            content: 'Test your knowledge about important figures in the Bible with Character Adventures trivia.',
            placement: 'right',
        },
        {
            target: '#nav-daily-challenge',
            content: 'Check back every day for a new puzzle or challenge to earn bonus EXP!',
            placement: 'right',
        },
        {
            target: '#nav-treasures',
            content: 'Visit the Treasures page to unlock special rewards.',
            placement: 'right',
            title: 'Your First Quest!'
        },
        {
            target: '#new-adventurer-chest',
            content: 'As a new adventurer, you have a special chest waiting for you. It costs 1 Wisdom Key to open (you start with 5!). Click it to see the rewards and open it!',
            placement: 'bottom',
        },
        {
            target: '#main-header',
            content: "Here you can track your Level, EXP, Shields (your 'lives' in games), and Wisdom Keys. Keep an eye on these as you play!",
            placement: 'bottom',
        },
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
