
'use client';

import { useCallback } from 'react';

// This hook uses the Web Audio API to generate sounds without needing audio files.
export const useSoundEffects = () => {
    const playSound = useCallback((type: 'correct' | 'incorrect') => {
        // Ensure this code runs only in the browser.
        if (typeof window !== 'undefined' && window.AudioContext) {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Connect the audio nodes.
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Configure sound properties based on type.
            if (type === 'correct') {
                // A short, pleasant, ascending tone.
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            } else { // incorrect
                // A short, dissonant, descending tone.
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
            }

            // Play the sound and stop it after a short duration.
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        }
    }, []);

    const playCorrectSound = useCallback(() => playSound('correct'), [playSound]);
    const playIncorrectSound = useCallback(() => playSound('incorrect'), [playSound]);

    return { playCorrectSound, playIncorrectSound };
};
