
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the experience required for each level
const getExpForLevel = (level: number) => {
    // Simple linear progression for now
    return 100 * level;
};

const KEYS_PER_LEVEL_UP = 5;
const MAX_HEARTS = 10; // 5 full hearts, 10 half-hearts

const initialState = {
    level: 1,
    exp: 0,
    wisdomKeys: 5,
    hearts: MAX_HEARTS,
    lastLevelUpExp: 0,
    expForNextLevel: getExpForLevel(1),
}

interface UserProgressState {
    level: number;
    exp: number;
    wisdomKeys: number;
    hearts: number;
    lastLevelUpExp: number;
    expForNextLevel: number;
    addExp: (amount: number) => void;
    setWisdomKeys: (setter: (currentKeys: number) => number) => void;
    spendChance: () => boolean;
    refillHearts: () => void;
    setProgress: (progress: Partial<UserProgressState>) => void;
    reset: () => void;
}

export const useUserProgress = create<UserProgressState>()(
    persist(
        (set, get) => ({
            ...initialState,
            addExp: (amount: number) => {
                set(state => {
                    let newExp = state.exp + amount;
                    let newLevel = state.level;
                    let newLastLevelUpExp = state.lastLevelUpExp;
                    let newExpForNextLevel = state.expForNextLevel;
                    let newWisdomKeys = state.wisdomKeys;
                    let newHearts = state.hearts;

                    while (newExp >= newExpForNextLevel) {
                        newLevel++;
                        newLastLevelUpExp = newExpForNextLevel;
                        newExpForNextLevel += getExpForLevel(newLevel);
                        newWisdomKeys += KEYS_PER_LEVEL_UP; // Award keys on level up
                        newHearts = MAX_HEARTS; // Refill hearts on level up
                    }
                    
                    // Prevent EXP from going negative
                    if (newExp < 0) {
                        newExp = 0;
                    }

                    return { 
                        exp: newExp, 
                        level: newLevel,
                        lastLevelUpExp: newLastLevelUpExp,
                        expForNextLevel: newExpForNextLevel,
                        wisdomKeys: newWisdomKeys,
                        hearts: newHearts
                    };
                });
            },
            setWisdomKeys: (setter) => {
                 set(state => ({ wisdomKeys: setter(state.wisdomKeys) }));
            },
            spendChance: () => {
                const currentHearts = get().hearts;
                if (currentHearts > 0) {
                    set({ hearts: currentHearts - 1 });
                    return true;
                }
                return false;
            },
            refillHearts: () => {
                set({ hearts: MAX_HEARTS });
            },
            setProgress: (progress) => {
                set(state => ({ ...state, ...progress }));
            },
            reset: () => {
                set(initialState);
            }
        }),
        {
            name: 'userProgress', 
            storage: createJSONStorage(() => localStorage),
        }
    )
);
