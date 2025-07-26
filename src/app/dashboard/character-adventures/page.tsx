'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, XCircle, BrainCircuit, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const triviaQuestions = [
    {
        question: "Who was known for his incredible strength, which was tied to his long hair?",
        options: ["David", "Goliath", "Samson", "Gideon"],
        answer: "Samson"
    },
    {
        question: "Who was swallowed by a great fish after disobeying God?",
        options: ["Jonah", "Daniel", "Elijah", "Peter"],
        answer: "Jonah"
    },
    {
        question: "Who led the Israelites out of slavery in Egypt?",
        options: ["Joshua", "Abraham", "Moses", "Jacob"],
        answer: "Moses"
    },
    {
        question: "Who was the courageous queen who saved her people from a plot of destruction?",
        options: ["Ruth", "Esther", "Mary", "Deborah"],
        answer: "Esther"
    },
    {
        question: "Who was the first king of Israel?",
        options: ["David", "Solomon", "Saul", "Samuel"],
        answer: "Saul"
    },
    {
        question: "This disciple denied Jesus three times before the rooster crowed.",
        options: ["Judas", "John", "Thomas", "Peter"],
        answer: "Peter"
    },
    {
        question: "Who was thrown into a den of lions but was protected by God?",
        options: ["Daniel", "Joseph", "Jeremiah", "Shadrach"],
        answer: "Daniel"
    }
];

export default function CharacterAdventuresPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);

    const currentQuestion = triviaQuestions[currentQuestionIndex];

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;

        setSelectedAnswer(option);
        setIsAnswered(true);

        if (option === currentQuestion.answer) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < triviaQuestions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
        } else {
            setIsGameFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setIsGameFinished(false);
    };
    
    const cardVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    if (isGameFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
                 <motion.div initial="initial" animate="animate" variants={cardVariants}>
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                               <Users className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-3xl">Trivia Complete!</CardTitle>
                            <CardDescription>You've completed the challenge.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xl font-semibold">Your Final Score:</p>
                            <p className="text-5xl font-bold text-primary">{score} / {triviaQuestions.length}</p>
                            <Button onClick={handleRestart} size="lg" className="mt-4">
                                <RotateCcw className="mr-2"/>
                                Play Again
                            </Button>
                        </CardContent>
                    </Card>
                 </motion.div>
            </div>
        );
    }

  return (
    <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="font-headline text-3xl font-bold">Bible Character Adventures</h1>
            <p className="text-muted-foreground">Test your knowledge with this character trivia!</p>
        </div>
      
        <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestionIndex}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardDescription>Question {currentQuestionIndex + 1} of {triviaQuestions.length}</CardDescription>
                        <CardTitle className="font-headline text-2xl !mt-2">{currentQuestion.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentQuestion.options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = option === currentQuestion.answer;
                                
                                return (
                                    <Button
                                        key={option}
                                        variant="outline"
                                        size="lg"
                                        className={cn(
                                            "justify-start p-6 h-auto text-base",
                                            isAnswered && isCorrect && "bg-green-100 border-green-400 text-green-800 hover:bg-green-200",
                                            isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-400 text-red-800 hover:bg-red-200",
                                            !isAnswered && "hover:bg-accent/50",
                                        )}
                                        onClick={() => handleAnswerSelect(option)}
                                        disabled={isAnswered}
                                    >
                                        {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 text-red-600"/>}
                                        {isAnswered && isCorrect && <CheckCircle className="mr-2 text-green-600"/>}
                                        {!isAnswered && <BrainCircuit className="mr-2 text-muted-foreground"/>}
                                        {option}
                                    </Button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col sm:flex-row items-center justify-between pt-4"
                            >
                                <p className={cn(
                                  "font-bold text-lg",
                                  selectedAnswer === currentQuestion.answer ? "text-green-600" : "text-red-600"
                                )}>
                                    {selectedAnswer === currentQuestion.answer
                                        ? "Correct!"
                                        : `The correct answer is ${currentQuestion.answer}.`
                                    }
                                </p>
                                <Button onClick={handleNextQuestion} className="w-full sm:w-auto mt-2 sm:mt-0">
                                    {currentQuestionIndex < triviaQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                </Button>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
         <div className="text-center mt-4 font-bold text-lg">Score: {score}</div>
    </div>
  );
}
