
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Shuffle, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const allBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];
const oldTestamentBooks = allBooks.slice(0, 39);
const newTestamentBooks = allBooks.slice(39);

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const generateLevelConfig = () => {
    const config = [];
    // Levels 1-5: 4 books, 5 rounds
    for (let i = 1; i <= 5; i++) config.push({ level: i, booksToArrange: 4, rounds: 5 });
    // Levels 6-10: 5 books, 5 rounds
    for (let i = 6; i <= 10; i++) config.push({ level: i, booksToArrange: 5, rounds: 5 });
    // Levels 11-15: 7 books, 5 rounds
    for (let i = 11; i <= 15; i++) config.push({ level: i, booksToArrange: 7, rounds: 5 });
    // Levels 16-20: 8 books, 5 rounds
    for (let i = 16; i <= 20; i++) config.push({ level: i, booksToArrange: 8, rounds: 5 });
    // Levels 21-25: 9 books, 5 rounds
    for (let i = 21; i <= 25; i++) config.push({ level: i, booksToArrange: 9, rounds: 5 });
    // Levels 26-30: 10 books, 5 rounds
    for (let i = 26; i <= 30; i++) config.push({ level: i, booksToArrange: 10, rounds: 5 });
    
    // Master Levels
    config.push({ level: 31, booksToArrange: oldTestamentBooks.length, rounds: 1, title: 'Master Level 1: Old Testament', books: oldTestamentBooks });
    config.push({ level: 32, booksToArrange: newTestamentBooks.length, rounds: 1, title: 'Master Level 2: New Testament', books: newTestamentBooks });
    config.push({ level: 33, booksToArrange: allBooks.length, rounds: 1, title: 'Master Level 3: All Books', books: allBooks });
    
    return config;
};

const levels = generateLevelConfig();

type Progress = { [level: number]: { [round: number]: boolean } };

export default function BibleMasteryPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [progress, setProgress] = useState<Progress>({});
  
  const [shuffledBooks, setShuffledBooks] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const levelConfig = levels.find(l => l.level === currentLevel)!;
  
  const totalStars = Object.values(progress).flatMap(levelProgress => Object.values(levelProgress)).filter(Boolean).length;
  const totalRounds = levels.reduce((acc, l) => acc + l.rounds, 0);

  const loadProgress = useCallback(() => {
    const savedProgress = localStorage.getItem('bibleMasteryProgress');
    if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed.progress || {});
        setCurrentLevel(parsed.level || 1);
        setCurrentRound(parsed.round || 1);
    }
  }, []);
  
  const saveProgress = useCallback(() => {
    if(!isClient) return;
    const dataToSave = {
        progress,
        level: currentLevel,
        round: currentRound
    };
    localStorage.setItem('bibleMasteryProgress', JSON.stringify(dataToSave));
  }, [progress, currentLevel, currentRound, isClient]);

  useEffect(() => {
    setIsClient(true);
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    saveProgress();
  }, [progress, saveProgress]);

  const startRound = useCallback((level: number, round: number) => {
    const config = levels.find(l => l.level === level)!;
    let roundBooks: string[];

    if (config.books) {
        roundBooks = [...config.books];
    } else {
        const startIndex = Math.floor(Math.random() * (allBooks.length - config.booksToArrange));
        roundBooks = allBooks.slice(startIndex, startIndex + config.booksToArrange);
    }

    setCorrectOrder(roundBooks);
    
    let shuffled = shuffleArray([...roundBooks]);
    // Ensure it's not already correct
    if(config.booksToArrange > 1) {
        while (JSON.stringify(shuffled) === JSON.stringify(roundBooks)) {
          shuffled = shuffleArray([...roundBooks]);
        }
    }

    setShuffledBooks(shuffled);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    startRound(currentLevel, currentRound);
  }, [currentLevel, currentRound, startRound]);


  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const items = [...shuffledBooks];
    const [reorderedItem] = items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, reorderedItem);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setShuffledBooks(items);
    setIsCorrect(null);
  };

  const checkOrder = () => {
    const isOrderCorrect = shuffledBooks.every((book, index) => book === correctOrder[index]);
    setIsCorrect(isOrderCorrect);
    if(isOrderCorrect) {
        setProgress(prev => ({
            ...prev,
            [currentLevel]: {
                ...(prev[currentLevel] || {}),
                [currentRound]: true
            }
        }));
    }
  };

  const handleNext = () => {
    if (currentRound < levelConfig.rounds) {
        setCurrentRound(prev => prev + 1);
    } else {
        if (currentLevel < levels.length) {
            setCurrentLevel(prev => prev + 1);
            setCurrentRound(1);
        } else {
            setIsGameFinished(true);
        }
    }
  };
  
  const resetGame = () => {
      setCurrentLevel(1);
      setCurrentRound(1);
      setProgress({});
      setIsGameFinished(false);
      localStorage.removeItem('bibleMasteryProgress');
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
                          <CardDescription>You have mastered all the books of the Bible!</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <p className="text-xl font-semibold">Total Stars Earned:</p>
                          <p className="text-5xl font-bold text-primary flex items-center justify-center gap-2">
                             {totalStars} <Star className="w-10 h-10 text-yellow-400 fill-yellow-400"/>
                          </p>
                          <Button onClick={resetGame} size="lg">
                              Play Again
                          </Button>
                      </CardContent>
                  </Card>
               </motion.div>
          </div>
      );
  }
  
  const hasCompletedRound = progress[currentLevel]?.[currentRound];

  return (
    <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
            <h1 className="font-headline text-3xl font-bold">Books of the Bible Mastery</h1>
            <p className="text-muted-foreground">Drag and drop the books into the correct order.</p>
        </div>

        <div className="text-center mb-4 p-2 bg-muted rounded-lg font-semibold flex justify-around items-center">
           <div>Level: {currentLevel} / {levels.length}</div>
           <div>Round: {currentRound} / {levelConfig.rounds}</div>
           <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500"/> {totalStars} / {totalRounds}
           </div>
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-2xl">{levelConfig.title || `Arrange ${levelConfig.booksToArrange} Books`}</CardTitle>
                        <CardDescription>Level {currentLevel}, Round {currentRound}</CardDescription>
                    </div>
                    {hasCompletedRound && <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {shuffledBooks.map((book, index) => (
                         <div
                            key={book}
                            draggable
                            onDragStart={() => (dragItem.current = index)}
                            onDragEnter={() => (dragOverItem.current = index)}
                            onDragEnd={handleDragSort}
                            onDragOver={(e) => e.preventDefault()}
                            className={cn(
                                "flex items-center p-4 rounded-lg border bg-card transition-all cursor-move",
                                dragItem.current === index && "shadow-lg opacity-50",
                                isCorrect === true && "bg-green-100 dark:bg-green-900/50 border-green-500",
                                isCorrect === false && correctOrder[index] !== book && "bg-red-100 dark:bg-red-900/50 border-red-500 animate-shake"
                            )}
                        >
                            <GripVertical className="mr-4 text-muted-foreground" />
                            <span className="font-medium">{book}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    {isCorrect === null && <Button onClick={checkOrder}>Check Order</Button>}
                    {isCorrect === true && <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">Correct! Next</Button>}
                    {isCorrect === false && <Button onClick={() => startRound(currentLevel, currentRound)} variant="destructive"><Shuffle className="mr-2"/> Try Again</Button>}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
