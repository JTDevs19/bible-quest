
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, GripVertical, Shuffle, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const levels = [
  {
    title: 'The Pentateuch',
    description: 'The first five books of the Old Testament.',
    books: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
  },
  {
    title: 'The Gospels',
    description: 'The four accounts of Jesus\' life, death, and resurrection.',
    books: ['Matthew', 'Mark', 'Luke', 'John'],
  },
  {
    title: 'Old Testament History (Part 1)',
    description: 'The story of Israel from the conquest of Canaan to the early monarchy.',
    books: ['Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel'],
  },
    {
    title: 'Pauline Epistles (Part 1)',
    description: 'Letters written by the Apostle Paul to various churches.',
    books: ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians'],
  },
  {
    title: 'General Epistles (Part 1)',
    description: 'Letters written to the church in general, not a specific audience.',
    books: ['James', '1 Peter', '2 Peter', '1 John', '2 John'],
  }
];

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

type Progress = { [levelIndex: number]: boolean };

export default function BibleMasteryPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [progress, setProgress] = useState<Progress>({});
  
  const [shuffledBooks, setShuffledBooks] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const currentLevel = levels[currentLevelIndex];
  const totalStars = Object.values(progress).filter(Boolean).length;

  const loadProgress = useCallback(() => {
    const savedProgress = localStorage.getItem('bibleMasteryProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);
  
  const saveProgress = useCallback(() => {
    localStorage.setItem('bibleMasteryProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setIsClient(true);
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    saveProgress();
  }, [progress]);

  useEffect(() => {
    startLevel(currentLevelIndex);
  }, [currentLevelIndex]);

  const startLevel = (levelIndex: number) => {
    const levelBooks = levels[levelIndex].books;
    let shuffled = shuffleArray([...levelBooks]);
    // Ensure it's not already sorted
    while (shuffled.every((book, index) => book === levelBooks[index])) {
      shuffled = shuffleArray([...levelBooks]);
    }
    setShuffledBooks(shuffled);
    setIsCorrect(null);
    setIsGameFinished(false);
  }

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(shuffledBooks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setShuffledBooks(items);
    setIsCorrect(null);
  };

  const checkOrder = () => {
    const isOrderCorrect = shuffledBooks.every((book, index) => book === currentLevel.books[index]);
    setIsCorrect(isOrderCorrect);
    if(isOrderCorrect) {
        setProgress(prev => ({...prev, [currentLevelIndex]: true}));
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setIsGameFinished(true);
    }
  };

  if (!isClient) {
    return <div>Loading...</div>; // Or a skeleton loader
  }
  
  if (isGameFinished) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="max-w-md w-full">
                      <CardHeader>
                          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                             <Trophy className="w-10 h-10 text-primary" />
                          </div>
                          <CardTitle className="font-headline text-3xl">Congratulations!</CardTitle>
                          <CardDescription>You have completed all available levels.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <p className="text-xl font-semibold">Total Stars Earned:</p>
                          <p className="text-5xl font-bold text-primary flex items-center justify-center gap-2">
                             {totalStars} <Star className="w-10 h-10 text-yellow-400 fill-yellow-400"/>
                          </p>
                          <Button onClick={() => {
                              setCurrentLevelIndex(0);
                              setIsGameFinished(false);
                          }} size="lg">
                              Play Again
                          </Button>
                      </CardContent>
                  </Card>
               </motion.div>
          </div>
      );
  }

  return (
    <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
            <h1 className="font-headline text-3xl font-bold">Books of the Bible Mastery</h1>
            <p className="text-muted-foreground">Drag and drop the books into the correct order.</p>
        </div>

        <div className="text-center mb-4 p-2 bg-muted rounded-lg font-semibold">
           Total Stars: {totalStars} / {levels.length}
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-2xl">Level {currentLevelIndex + 1}: {currentLevel.title}</CardTitle>
                        <CardDescription>{currentLevel.description}</CardDescription>
                    </div>
                    {progress[currentLevelIndex] && <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />}
                </div>
            </CardHeader>
            <CardContent>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="books">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                {shuffledBooks.map((book, index) => (
                                    <Draggable key={book} draggableId={book} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={cn(
                                                    "flex items-center p-4 rounded-lg border bg-card transition-shadow",
                                                    snapshot.isDragging && "shadow-lg",
                                                    isCorrect === true && "bg-green-100 border-green-500",
                                                    isCorrect === false && currentLevel.books[index] !== book && "bg-red-100 border-red-500 animate-shake"
                                                )}
                                            >
                                                <GripVertical className="mr-4 text-muted-foreground" />
                                                <span className="font-medium">{book}</span>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="mt-6 flex flex-col gap-2">
                    {isCorrect === null && <Button onClick={checkOrder}>Check Order</Button>}
                    {isCorrect === true && <Button onClick={handleNextLevel} className="bg-green-600 hover:bg-green-700">Correct! Next Level</Button>}
                    {isCorrect === false && <Button onClick={() => startLevel(currentLevelIndex)} variant="destructive"><Shuffle className="mr-2"/> Try Again</Button>}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
