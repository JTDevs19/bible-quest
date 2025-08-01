'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Lightbulb, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface JumbleProps {
    challenge: {
        jumbled: string;
        answer: string;
        hint: string;
    };
    onComplete: () => void;
    isCompleted: boolean;
}

export function JumbleOfTheDay({ challenge, onComplete, isCompleted }: JumbleProps) {
    const [userInput, setUserInput] = useState('');
    const [status, setStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        if (isCompleted) {
            setStatus('correct');
            setUserInput(challenge.answer);
        }
    }, [isCompleted, challenge.answer]);

    const checkAnswer = () => {
        if (userInput.trim().toLowerCase() === challenge.answer.toLowerCase()) {
            setStatus('correct');
            onComplete();
        } else {
            setStatus('incorrect');
        }
    };

    const reset = () => {
        setUserInput('');
        setStatus('playing');
        setShowHint(false);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-muted-foreground text-center">Unscramble the letters below to reveal a significant biblical word.</p>
            
            <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-4xl font-bold tracking-widest font-headline">{challenge.jumbled}</p>
            </div>

            <div className="w-full max-w-sm space-y-2">
                <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                        setUserInput(e.target.value);
                        if (status === 'incorrect') setStatus('playing');
                    }}
                    placeholder="Your guess..."
                    className={cn(
                        "text-center text-lg h-12",
                        status === 'correct' && "border-green-500 ring-green-500",
                        status === 'incorrect' && "border-destructive ring-destructive animate-shake"
                    )}
                    disabled={status === 'correct'}
                />
            </div>
            
            {status === 'playing' && (
                <div className="flex gap-2">
                    <Button onClick={checkAnswer}>Check Answer</Button>
                    <Button variant="outline" onClick={() => setShowHint(true)}>
                        <Lightbulb className="mr-2" />
                        Show Hint
                    </Button>
                </div>
            )}

            {status === 'incorrect' && (
                <div className="flex gap-2">
                    <Button onClick={checkAnswer}>Try Again</Button>
                    <Button variant="destructive" onClick={reset}>
                        <RefreshCw className="mr-2" /> Reset
                    </Button>
                </div>
            )}

            {showHint && status !== 'correct' && (
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Hint</AlertTitle>
                    <AlertDescription>{challenge.hint}</AlertDescription>
                </Alert>
            )}

            {status === 'correct' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert variant="default" className="bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4 !text-green-500" />
                        <AlertTitle>Correct!</AlertTitle>
                        <AlertDescription>
                            Well done! You've unscrambled the word.
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}
        </div>
    );
}
