
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the experience required for each level
const getExpForLevel = (level: number) => {
    // Simple linear progression for now
    return 100 * level;
};

const KEYS_PER_LEVEL_UP = 5;

interface UserProgressState {
    level: number;
    exp: number;
    wisdomKeys: number;
    lastLevelUpExp: number;
    expForNextLevel: number;
    addExp: (amount: number) => void;
    setWisdomKeys: (setter: (currentKeys: number) => number) => void;
    setProgress: (progress: Partial<UserProgressState>) => void;
}

export const useUserProgress = create<UserProgressState>()(
    persist(
        (set, get) => ({
            level: 1,
            exp: 0,
            wisdomKeys: 5, // Start with some keys
            lastLevelUpExp: 0,
            expForNextLevel: getExpForLevel(1),
            addExp: (amount: number) => {
                set(state => {
                    const newExp = state.exp + amount;
                    let newLevel = state.level;
                    let newLastLevelUpExp = state.lastLevelUpExp;
                    let newExpForNextLevel = state.expForNextLevel;
                    let newWisdomKeys = state.wisdomKeys;

                    while (newExp >= newExpForNextLevel) {
                        newLevel++;
                        newLastLevelUpExp = newExpForNextLevel;
                        newExpForNextLevel += getExpForLevel(newLevel);
                        newWisdomKeys += KEYS_PER_LEVEL_UP; // Award keys on level up
                    }

                    return { 
                        exp: newExp, 
                        level: newLevel,
                        lastLevelUpExp: newLastLevelUpExp,
                        expForNextLevel: newExpForNextLevel,
                        wisdomKeys: newWisdomKeys
                    };
                });
            },
            setWisdomKeys: (setter) => {
                 set(state => ({ wisdomKeys: setter(state.wisdomKeys) }));
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
