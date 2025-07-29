
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the experience required for each level
const getExpForLevel = (level: number) => {
    return 100;
};

interface UserProgressState {
    level: number;
    exp: number;
    stars: number;
    lastLevelUpExp: number;
    expForNextLevel: number;
    addExp: (amount: number) => void;
    setStars: (setter: (currentStars: number) => number) => void;
    setProgress: (progress: Partial<UserProgressState>) => void;
}

export const useUserProgress = create<UserProgressState>()(
    persist(
        (set, get) => ({
            level: 1,
            exp: 0,
            stars: 0,
            lastLevelUpExp: 0,
            expForNextLevel: getExpForLevel(1),
            addExp: (amount: number) => {
                set(state => {
                    const newExp = state.exp + amount;
                    const newStars = state.stars + amount;
                    let newLevel = state.level;
                    let newLastLevelUpExp = state.lastLevelUpExp;
                    let newExpForNextLevel = state.expForNextLevel;

                    while (newExp >= newExpForNextLevel) {
                        newLevel++;
                        newLastLevelUpExp = newExpForNextLevel;
                        newExpForNextLevel += getExpForLevel(newLevel);
                    }

                    return { 
                        exp: newExp, 
                        stars: newStars,
                        level: newLevel,
                        lastLevelUpExp: newLastLevelUpExp,
                        expForNextLevel: newExpForNextLevel
                    };
                });
            },
            setStars: (setter) => {
                 set(state => ({ stars: setter(state.stars) }));
            },
            setProgress: (progress) => {
                set(state => ({ ...state, ...progress }));
            }
        }),
        {
            name: 'userProgress', 
            storage: createJSONStorage(() => localStorage),
        }
    )
);
