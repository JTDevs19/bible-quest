
'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

const AppTour = () => {
    const [run, setRun] = useState(false);
    
    useEffect(() => {
        const tourCompleted = localStorage.getItem('bibleQuestsTourCompleted');
        if (tourCompleted !== 'true') {
            setRun(true);
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
            content: 'In Verse Memory, you can practice memorizing key Bible verses by filling in the blanks.',
            placement: 'right',
        },
        {
            target: '#nav-character-adventures',
            content: 'Test your knowledge about important figures in the Bible with Character Adventures trivia.',
            placement: 'right',
        },
        {
            target: '#nav-daily-challenge',
            content: 'Check back every day for a new puzzle or challenge to earn bonus stars!',
            placement: 'right',
        },
        {
            target: '#main-content',
            content: 'Your selected game or activity will appear here in the main content area.',
            placement: 'auto',
        },
        {
            target: '#main-header',
            content: 'Your user profile is shown here. You can find settings and other options in this area.',
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
