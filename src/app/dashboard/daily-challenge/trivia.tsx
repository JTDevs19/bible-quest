'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TriviaProps {
    challenge: {
        question: string;
        options: string[];
        answer: string;
    };
    onComplete: () => void;
    isCompleted: boolean;
}

export function TriviaOfTheDay({ challenge, onComplete, isCompleted }: TriviaProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

     useEffect(() => {
        if (isCompleted) {
            setIsAnswered(true);
            setSelectedAnswer(challenge.answer);
        }
    }, [isCompleted, challenge.answer]);

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;
        
        setSelectedAnswer(option);
        setIsAnswered(true);

        if (option === challenge.answer) {
            onComplete();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <h3 className="text-xl font-semibold text-center">{challenge.question}</h3>

            <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-3">
                {challenge.options.map((option) => {
                    const isCorrect = option === challenge.answer;
                    const isSelected = selectedAnswer === option;

                    return (
                        <Button
                            key={option}
                            variant="outline"
                            size="lg"
                            className={cn(
                                "justify-start p-6 h-auto text-base",
                                isAnswered && "cursor-not-allowed",
                                !isAnswered && "hover:bg-accent/50",
                                isAnswered && isCorrect && "bg-green-100 border-green-500 hover:bg-green-100 text-green-800",
                                isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-500 hover:bg-red-100 text-red-800"
                            )}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isAnswered}
                        >
                            <span className="mr-2">
                                {isAnswered && isCorrect && <CheckCircle />}
                                {isAnswered && isSelected && !isCorrect && <XCircle />}
                            </span>
                            {option}
                        </Button>
                    );
                })}
            </div>
            {isAnswered && selectedAnswer !== challenge.answer && (
                 <p className="text-destructive font-semibold">The correct answer was: {challenge.answer}</p>
            )}
        </div>
    );
}
