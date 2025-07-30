
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SermonGuideOutput } from '@/ai/flows/sermon-guide-generator';


// Define the experience required for each level
const getExpForLevel = (level: number) => {
    // Simple linear progression for now
    return 100 * level;
};

export interface SavedSermonNote extends SermonGuideOutput {
    personalNotes?: string;
}

const KEYS_PER_LEVEL_UP = 5;
const MAX_SHIELDS = 10; // 5 full shields, 10 half-shields
const STARTING_HINTS = 5;
const STARTING_KEYS = 5;
const STARTING_AI_CHARGES = 10;

type TreasuresState = {
    [key: string]: boolean;
}

type TrainingState = {
    verseMemory: boolean;
    characterAdventures: boolean;
    bibleMastery: boolean;
}

const initialState = {
    level: 1,
    exp: 0,
    wisdomKeys: STARTING_KEYS,
    shields: MAX_SHIELDS,
    hints: STARTING_HINTS,
    gold: 0,
    denarius: 0,
    aiVerseCharges: STARTING_AI_CHARGES,
    lastLevelUpExp: 0,
    expForNextLevel: getExpForLevel(1),
    treasuresOpened: {} as TreasuresState,
    training: {
        verseMemory: false,
        characterAdventures: false,
        bibleMastery: false,
    } as TrainingState,
    savedNotes: [] as SavedSermonNote[],
}

interface UserProgressState {
    level: number;
    exp: number;
    wisdomKeys: number;
    shields: number;
    hints: number;
    gold: number;
    denarius: number;
    aiVerseCharges: number;
    lastLevelUpExp: number;
    expForNextLevel: number;
    treasuresOpened: TreasuresState;
    training: TrainingState;
    savedNotes: SavedSermonNote[];
    addExp: (amount: number) => void;
    spendWisdomKeys: (amount: number) => void;
    addWisdomKeys: (amount: number) => void;
    spendChance: () => boolean;
    addShields: (amount: number) => void;
    useHint: () => boolean;
    addHints: (amount: number) => void;
    addGold: (amount: number) => void;
    addDenarius: (amount: number) => void;
    openTreasure: (treasureId: string, cost: number) => void;
    completeTraining: (game: keyof TrainingState) => void;
    saveNote: (note: SavedSermonNote) => boolean;
    updateNote: (updatedNote: SavedSermonNote) => void;
    deleteNote: (noteTitle: string) => void;
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
            addWisdomKeys: (amount: number) => {
                set(state => ({ wisdomKeys: state.wisdomKeys + amount }));
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
            addDenarius: (amount: number) => {
                set(state => ({ denarius: state.denarius + amount }));
            },
            openTreasure: (treasureId: string, cost: number) => {
                set(state => {
                    if (state.wisdomKeys >= cost && !state.treasuresOpened[treasureId]) {
                        return {
                            wisdomKeys: state.wisdomKeys - cost,
                            treasuresOpened: {
                                ...state.treasuresOpened,
                                [treasureId]: true,
                            }
                        }
                    }
                    return state;
                });
            },
            completeTraining: (game: keyof TrainingState) => {
                set(state => ({
                    training: {
                        ...state.training,
                        [game]: true,
                    }
                }));
            },
            saveNote: (note: SavedSermonNote) => {
                const { savedNotes } = get();
                const isDuplicate = savedNotes.some(n => n.title.toLowerCase() === note.title.toLowerCase());
                if (isDuplicate) {
                    return false; // Indicate that save failed
                }
                set(state => ({
                    savedNotes: [...state.savedNotes, note]
                }));
                return true; // Indicate success
            },
            updateNote: (updatedNote: SavedSermonNote) => {
                set(state => ({
                    savedNotes: state.savedNotes.map(note => 
                        note.title.toLowerCase() === updatedNote.title.toLowerCase()
                            ? updatedNote 
                            : note
                    )
                }));
            },
            deleteNote: (noteTitle: string) => {
                set(state => ({
                    savedNotes: state.savedNotes.filter(n => n.title !== noteTitle)
                }));
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
