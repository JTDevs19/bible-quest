import { db } from './firebase';
import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  username: string;
  avatar: string;
  ageGroup: string;
  spiritualLevel: string;
  focus: string;
};

export type GameProgress = {
  verseMemory?: any;
  characterAdventures?: any;
  bibleMastery?: any;
  dailyChallenge?: any;
};

// Function to save user profile data
export const saveUserProfile = async (userId: string, profileData: Omit<UserProfile, 'uid'>) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    console.error("Error saving user profile: ", error);
    throw new Error("Could not save user profile.");
  }
};

// Function to get user profile data
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return { uid: userId, ...docSnap.data() } as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile: ", error);
    return null;
  }
};

// Function to save game progress
export const saveGameProgress = async (userId: string, gameData: GameProgress) => {
    try {
        const progressDocRef = doc(db, 'progress', userId);
        await setDoc(progressDocRef, gameData, { merge: true });
    } catch (error) {
        console.error("Error saving game progress: ", error);
        throw new Error("Could not save game progress.");
    }
};

// Function to load game progress
export const loadGameProgress = async (userId: string): Promise<GameProgress | null> => {
    try {
        const progressDocRef = doc(db, 'progress', userId);
        const docSnap = await getDoc(progressDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as GameProgress;
        } else {
            return null; // No progress saved yet
        }
    } catch (error) {
        console.error("Error loading game progress: ", error);
        return null;
    }
};
