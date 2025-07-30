
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
const STARTING_HINTS = 5;

const initialState = {
    level: 1,
    exp: 0,
    wisdomKeys: 5,
    hearts: MAX_HEARTS,
    hints: STARTING_HINTS,
    lastLevelUpExp: 0,
    expForNextLevel: getExpForLevel(1),
}

interface UserProgressState {
    level: number;
    exp: number;
    wisdomKeys: number;
    hearts: number;
    hints: number;
    lastLevelUpExp: number;
    expForNextLevel: number;
    addExp: (amount: number) => void;
    spendWisdomKeys: (amount: number) => void;
    spendChance: () => boolean;
    addHearts: (amount: number) => void;
    useHint: () => boolean;
    addHints: (amount: number) => void;
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
            spendWisdomKeys: (amount: number) => {
                set(state => ({ wisdomKeys: Math.max(0, state.wisdomKeys - amount) }));
            },
            spendChance: () => {
                const currentHearts = get().hearts;
                if (currentHearts > 0) {
                    set({ hearts: currentHearts - 1 });
                    return true;
                }
                return false;
            },
            addHearts: (amount: number) => {
                 set(state => ({ hearts: Math.min(MAX_HEARTS, state.hearts + amount) }));
            },
            useHint: () => {
                const currentHints = get().hints;
                if(currentHints > 0) {
                    set({ hints: currentHints - 1});
                    return true;
                }
                return false;
            },
            addHints: (amount: number) => {
                set(state => ({ hints: state.hints + amount }));
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
