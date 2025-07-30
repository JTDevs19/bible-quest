
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the experience required for each level
const getExpForLevel = (level: number) => {
    // Simple linear progression for now
    return 100 * level;
};

const KEYS_PER_LEVEL_UP = 5;
const MAX_SHIELDS = 10; // 5 full shields, 10 half-shields
const STARTING_HINTS = 5;

const initialState = {
    level: 1,
    exp: 0,
    wisdomKeys: 5,
    shields: MAX_SHIELDS,
    hints: STARTING_HINTS,
    gold: 0,
    lastLevelUpExp: 0,
    expForNextLevel: getExpForLevel(1),
}

interface UserProgressState {
    level: number;
    exp: number;
    wisdomKeys: number;
    shields: number;
    hints: number;
    gold: number;
    lastLevelUpExp: number;
    expForNextLevel: number;
    addExp: (amount: number) => void;
    spendWisdomKeys: (amount: number) => void;
    spendChance: () => boolean;
    addShields: (amount: number) => void;
    useHint: () => boolean;
    addHints: (amount: number) => void;
    addGold: (amount: number) => void;
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
                    let newShields = state.shields;

                    while (newExp >= newExpForNextLevel) {
                        newLevel++;
                        newLastLevelUpExp = newExpForNextLevel;
                        newExpForNextLevel += getExpForLevel(newLevel);
                        newWisdomKeys += KEYS_PER_LEVEL_UP; // Award keys on level up
                        newShields = MAX_SHIELDS; // Refill shields on level up
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
                        shields: newShields
                    };
                });
            },
            spendWisdomKeys: (amount: number) => {
                set(state => ({ wisdomKeys: Math.max(0, state.wisdomKeys - amount) }));
            },
            spendChance: () => {
                const currentShields = get().shields;
                if (currentShields > 0) {
                    set({ shields: currentShields - 1 });
                    return true;
                }
                return false;
            },
            addShields: (amount: number) => {
                 set(state => ({ shields: Math.min(MAX_SHIELDS, state.shields + amount) }));
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
            addGold: (amount: number) => {
                set(state => ({ gold: state.gold + amount }));
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
