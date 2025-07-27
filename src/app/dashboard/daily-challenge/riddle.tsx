'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RiddleProps {
    challenge: {
        riddle: string;
        answer: string;
    };
    onComplete: () => void;
    isCompleted: boolean;
}

export function RiddleOfTheDay({ challenge, onComplete, isCompleted }: RiddleProps) {
    const [userInput, setUserInput] = useState('');
    const [status, setStatus] = useState<'playing' | 'correct' | 'incorrect' | 'failed'>('playing');
    const [attemptsLeft, setAttemptsLeft] = useState(3);

    useEffect(() => {
        if (isCompleted) {
            setStatus('correct');
            setUserInput(challenge.answer);
        }
    }, [isCompleted, challenge.answer]);
    

    const checkAnswer = () => {
        if (status !== 'playing' && status !== 'incorrect') return;

        if (userInput.trim().toLowerCase() === challenge.answer.toLowerCase()) {
            setStatus('correct');
            onComplete();
        } else {
            const newAttemptsLeft = attemptsLeft - 1;
            setAttemptsLeft(newAttemptsLeft);
            if (newAttemptsLeft <= 0) {
                setStatus('failed');
            } else {
                setStatus('incorrect');
            }
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <p className="font-serif text-xl italic leading-relaxed">"{challenge.riddle}"</p>
            
            <div className="w-full max-w-sm space-y-2">
                 <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                        setUserInput(e.target.value)
                        if (status === 'incorrect') setStatus('playing');
                    }}
                    placeholder="Who or what am I?"
                    className={cn(
                        "text-center text-lg h-12",
                        status === 'correct' && "border-green-500 ring-green-500",
                        status === 'incorrect' && "border-destructive ring-destructive animate-shake",
                        status === 'failed' && "border-destructive bg-destructive/10"
                    )}
                    disabled={status === 'correct' || status === 'failed'}
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                />

                {status === 'playing' || status === 'incorrect' ? (
                    <Button onClick={checkAnswer}>Submit Answer ({attemptsLeft} {attemptsLeft === 1 ? 'try' : 'tries'} left)</Button>
                ) : null}
            </div>

             {status === 'correct' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert variant="default" className="bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4 !text-green-500"/>
                        <AlertTitle>Correct!</AlertTitle>
                        <AlertDescription>
                            Excellent work! The answer is indeed <strong>{challenge.answer}</strong>.
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}

            {status === 'incorrect' && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Not Quite</AlertTitle>
                        <AlertDescription>
                            That's not the right answer. Give it another thought!
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}

            {status === 'failed' && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>No Tries Left</AlertTitle>
                        <AlertDescription>
                            You've used all your attempts. The correct answer was <strong>{challenge.answer}</strong>. Better luck tomorrow!
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}

        </div>
    );
}
