
'use client';

import { useCallback, useRef, useEffect } from 'react';

// This hook uses the Web Audio API to generate sounds without needing audio files.
export const useSoundEffects = () => {
    const correctSoundRef = useRef<HTMLAudioElement | null>(null);
    const stageCompleteSoundRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Preload audio files for better performance
        if (typeof window !== 'undefined') {
            correctSoundRef.current = new Audio('/bg-correct-answer.mp3');
            stageCompleteSoundRef.current = new Audio('/bg-stage-complete.mp3');
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        return () => {
            audioContextRef.current?.close();
        }
    }, []);

    const playSound = useCallback((type: 'correct' | 'incorrect' | 'stageComplete' | 'click') => {
        // Ensure this code runs only in the browser.
        if (typeof window === 'undefined') return;

        if (type === 'correct' && correctSoundRef.current) {
            correctSoundRef.current.currentTime = 0; // Rewind to start
            correctSoundRef.current.play().catch(error => console.error("Error playing correct sound:", error));
        } else if (type === 'stageComplete' && stageCompleteSoundRef.current) {
            stageCompleteSoundRef.current.currentTime = 0; // Rewind to start
            stageCompleteSoundRef.current.play().catch(error => console.error("Error playing stage complete sound:", error));
        } else if (audioContextRef.current) {
             const audioContext = audioContextRef.current;
             const oscillator = audioContext.createOscillator();
             const gainNode = audioContext.createGain();

            // Connect the audio nodes.
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === 'incorrect') {
                // A short, dissonant, descending tone for incorrect answers.
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
                 // Play the sound and stop it after a short duration.
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            } else if (type === 'click') {
                // A short, sharp, pleasant click sound.
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
                 // Play the sound and stop it after a short duration.
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        }
    }, []);

    const playCorrectSound = useCallback(() => playSound('correct'), [playSound]);
    const playIncorrectSound = useCallback(() => playSound('incorrect'), [playSound]);
    const playStageCompleteSound = useCallback(() => playSound('stageComplete'), [playSound]);
    const playClickSound = useCallback(() => playSound('click'), [playSound]);

    return { playCorrectSound, playIncorrectSound, playStageCompleteSound, playClickSound };
};
