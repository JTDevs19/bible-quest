
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Shuffle, Star, Trophy, Languages, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserProgress } from '@/hooks/use-user-progress';

const allBooksEnglish = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const bookTranslations: { [key: string]: string } = {
  "Genesis": "Genesis", "Exodus": "Exodo", "Leviticus": "Levitico", "Numbers": "Mga Bilang", "Deuteronomy": "Deuteronomio", "Joshua": "Josue", "Judges": "Mga Hukom", "Ruth": "Ruth", "1 Samuel": "1 Samuel", "2 Samuel": "2 Samuel", "1 Kings": "1 Mga Hari", "2 Kings": "2 Mga Hari", "1 Chronicles": "1 Mga Cronica", "2 Chronicles": "2 Mga Cronica", "Ezra": "Ezra", "Nehemiah": "Nehemias", "Esther": "Esther", "Job": "Job", "Psalms": "Mga Awit", "Proverbs": "Mga Kawikaan", "Ecclesiastes": "Eclesiastes", "Song of Solomon": "Ang Awit ni Solomon", "Isaiah": "Isaias", "Jeremiah": "Jeremias", "Lamentations": "Mga Panaghoy", "Ezekiel": "Ezekiel", "Daniel": "Daniel", "Hosea": "Oseas", "Joel": "Joel", "Amos": "Amos", "Obadiah": "Obadias", "Jonah": "Jonas", "Micah": "Mikas", "Nahum": "Nahum", "Habakkuk": "Habacuc", "Zephaniah": "Sofonias", "Haggai": "Hagai", "Zechariah": "Zacarias", "Malachi": "Malakias",
  "Matthew": "Mateo", "Mark": "Marcos", "Luke": "Lucas", "John": "Juan", "Acts": "Mga Gawa", "Romans": "Mga Taga-Roma", "1 Corinthians": "1 Mga Taga-Corinto", "2 Corinthians": "2 Mga Taga-Corinto", "Galatians": "Mga Taga-Galacia", "Ephesians": "Mga Taga-Efeso", "Philippians": "Mga Taga-Filipos", "Colossians": "Mga Taga-Colosas", "1 Thessalonians": "1 Mga Taga-Tesalonica", "2 Thessalonians": "2 Mga Taga-Tesalonica", "1 Timothy": "1 Timoteo", "2 Timothy": "2 Timoteo", "Titus": "Tito", "Philemon": "Filemon", "Hebrews": "Mga Hebreo", "James": "Santiago", "1 Peter": "1 Pedro", "2 Peter": "2 Pedro", "1 John": "1 Juan", "2 John": "2 Juan", "3 John": "3 Juan", "Jude": "Judas", "Revelation": "Pahayag"
};


const oldTestamentBooks = allBooksEnglish.slice(0, 39);
const newTestamentBooks = allBooksEnglish.slice(39);

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
    // Levels 1-5: 4 books, 5 rounds, 1 EXP/round
    for (let i = 1; i <= 5; i++) config.push({ level: i, booksToArrange: 4, rounds: 5, expPerRound: 1 });
    // Levels 6-10: 5 books, 5 rounds, 1 EXP/round
    for (let i = 6; i <= 10; i++) config.push({ level: i, booksToArrange: 5, rounds: 5, expPerRound: 1 });
    // Levels 11-15: 7 books, 5 rounds, 2 EXP/round
    for (let i = 11; i <= 15; i++) config.push({ level: i, booksToArrange: 7, rounds: 5, expPerRound: 2 });
    // Levels 16-20: 8 books, 5 rounds, 2 EXP/round
    for (let i = 16; i <= 20; i++) config.push({ level: i, booksToArrange: 8, rounds: 5, expPerRound: 2 });
    // Levels 21-25: 9 books, 5 rounds, 3 EXP/round
    for (let i = 21; i <= 25; i++) config.push({ level: i, booksToArrange: 9, rounds: 5, expPerRound: 3 });
    // Levels 26-30: 10 books, 5 rounds, 3 EXP/round
    for (let i = 26; i <= 30; i++) config.push({ level: i, booksToArrange: 10, rounds: 5, expPerRound: 3 });
    
    // Master Levels
    config.push({ level: 31, booksToArrange: oldTestamentBooks.length, rounds: 1, title: 'Master Level 1: Old Testament', books: oldTestamentBooks, expPerRound: 50 });
    config.push({ level: 32, booksToArrange: newTestamentBooks.length, rounds: 1, title: 'Master Level 2: New Testament', books: newTestamentBooks, expPerRound: 50 });
    config.push({ level: 33, booksToArrange: allBooksEnglish.length, rounds: 1, title: 'Master Level 3: All Books', books: allBooksEnglish, expPerRound: 100 });
    
    return config;
};

const levels = generateLevelConfig();

const VERSES_PER_STAGE = 20;
const LEVELS_PER_STAGE = 5;

// Function to check if a stage is complete
const isStageComplete = (stageNum: number, scores: any) => {
    if (!scores || !scores[stageNum]) return false;
    for (let level = 1; level <= LEVELS_PER_STAGE; level++) {
        const levelScores = scores[stageNum][level];
        if (!levelScores || Object.keys(levelScores).length < VERSES_PER_STAGE) {
            return false;
        }
    }
    return true;
};

type Progress = { [level: number]: { [round: number]: boolean } };

export default function BibleMasteryPage() {
  const [isClient, setIsClient] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [progress, setProgress] = useState<Progress>({});
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  
  const [shuffledBooks, setShuffledBooks] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const router = useRouter();
  const { addExp } = useUserProgress();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const levelConfig = levels.find(l => l.level === currentLevel)!;
  
  const totalStars = Object.values(progress).flatMap(levelProgress => Object.values(levelProgress)).filter(Boolean).length;
  const totalRounds = levels.slice(0, -3).reduce((acc, l) => acc + l.rounds, 0) + 3;

  const loadProgress = useCallback(() => {
    if(!isClient) return;
    const savedProgress = localStorage.getItem('bibleMasteryProgress');
    if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress(parsedProgress.progress || {});
        setCurrentLevel(parsedProgress.level || 1);
        setCurrentRound(parsedProgress.round || 1);
    }
  }, [isClient]);
  
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
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    saveProgress();
  }, [progress, saveProgress]);

  const startRound = useCallback((level: number, round: number) => {
    setShowSuccessDialog(false);
    const config = levels.find(l => l.level === level)!;
    let roundBooks: string[];

    if (config.books) {
        roundBooks = [...config.books];
    } else {
        const startIndex = Math.floor(Math.random() * (allBooksEnglish.length - config.booksToArrange));
        roundBooks = allBooksEnglish.slice(startIndex, startIndex + config.booksToArrange);
    }

    setCorrectOrder(roundBooks);
    
    let shuffled = shuffleArray([...roundBooks]);
    if(config.booksToArrange > 1) {
        while (JSON.stringify(shuffled) === JSON.stringify(roundBooks)) {
          shuffled = shuffleArray([...roundBooks]);
        }
    }

    setShuffledBooks(shuffled);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      startRound(currentLevel, currentRound);
    }
  }, [isUnlocked, currentLevel, currentRound, startRound]);

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
        const hasCompletedBefore = progress[currentLevel]?.[currentRound];
        if (!hasCompletedBefore) {
            addExp(levelConfig.expPerRound);
        }

        setProgress(prev => ({
            ...prev,
            [currentLevel]: {
                ...(prev[currentLevel] || {}),
                [currentRound]: true
            }
        }));
        setTimeout(() => setShowSuccessDialog(true), 300);
    }
  };

  const handleNext = () => {
    setShowSuccessDialog(false);
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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fil' : 'en');
  };

  const getTranslatedBook = (englishBook: string) => {
      if (language === 'fil') {
          return bookTranslations[englishBook] || englishBook;
      }
      return englishBook;
  };

  const isBookInOldTestament = (book: string) => oldTestamentBooks.includes(book);
  const bookListToShow = isBookInOldTestament(correctOrder[0]) ? oldTestamentBooks : newTestamentBooks;
  const bookListName = isBookInOldTestament(correctOrder[0]) ? "Old Testament" : "New Testament";


  if (!isClient) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (!isUnlocked) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <Trophy className="w-10 h-10 text-primary" />
            </div>
            <AlertDialogTitle className="font-headline text-2xl text-center">Unlock Bible Mastery!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              To unlock this ultimate challenge, you must first complete <strong>Stage 2</strong> of the Verse Memory game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel onClick={() => router.push('/dashboard')}>Back to Dashboard</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/dashboard/verse-memory')}>
              <BookOpen className="mr-2" /> Go to Verse Memory
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
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
  const pageTitle = language === 'en' ? "Books of the Bible Mastery" : "Kasanayan sa mga Aklat ng Bibliya";
  const pageDescription = language === 'en' ? "Drag and drop the books into the correct order." : "I-drag at i-drop ang mga aklat sa tamang pagkakasunod-sunod.";

  return (
    <>
    <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
            <h1 className="font-headline text-3xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
        </div>

        <div className="text-center mb-4 p-2 bg-muted rounded-lg font-semibold flex justify-around items-center">
           <div>{language === 'en' ? 'Level' : 'Antas'}: {currentLevel} / {levels.length}</div>
           <div>{language === 'en' ? 'Round' : 'Ronda'}: {currentRound} / {levelConfig.rounds}</div>
           <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500"/> {totalStars} / {totalRounds}
           </div>
           <Button variant="outline" size="icon" onClick={toggleLanguage}><Languages className="w-5 h-5"/></Button>
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-2xl">{levelConfig.title || (language === 'en' ? `Arrange ${levelConfig.booksToArrange} Books` : `Ayusin ang ${levelConfig.booksToArrange} na Aklat`)}</CardTitle>
                        <CardDescription>{language === 'en' ? 'Level' : 'Antas'} {currentLevel}, {language === 'en' ? 'Round' : 'Ronda'} {currentRound}</CardDescription>
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
                            <span className="font-medium">{getTranslatedBook(book)}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    {isCorrect === null && <Button onClick={checkOrder}>{language === 'en' ? 'Check Order' : 'Suriin ang Ayos'}</Button>}
                    {isCorrect === true && <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">{language === 'en' ? 'Correct! Next' : 'Tama! Susunod'}</Button>}
                    {isCorrect === false && <Button onClick={() => startRound(currentLevel, currentRound)} variant="destructive"><Shuffle className="mr-2"/>{language === 'en' ? 'Try Again' : 'Subukang Muli'}</Button>}
                </div>
            </CardContent>
        </Card>
    </div>
    
    <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
                <AlertDialogTitle className="font-headline text-2xl flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400"/>
                    {language === 'en' ? "Correct Order!" : "Tamang Pagkakasunod-sunod!"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {language === 'en' ? `Well done! You correctly ordered the books. Here they are in the context of the ${bookListName}.` : `Mahusay! Nakuha mo ang tamang ayos. Narito ang mga ito sa konteksto ng ${language === 'fil' && bookListName === 'Old Testament' ? 'Lumang Tipan' : 'Bagong Tipan'}.`}
                </AlertDialogDescription>
            </AlertDialogHeader>
            
            <ScrollArea className="h-60 w-full rounded-md border p-4">
                <div className="grid grid-cols-1 gap-x-8 gap-y-1">
                    {bookListToShow.map((book) => (
                        <div
                            key={book}
                            className={cn(
                                "p-1 rounded text-sm",
                                correctOrder.includes(book) && "bg-primary/20 font-bold text-primary"
                            )}
                        >
                           {getTranslatedBook(book)}
                        </div>
                    ))}
                </div>
            </ScrollArea>
            
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleNext} className="w-full">
                   {language === 'en' ? 'Next' : 'Susunod'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </>
  );
}
