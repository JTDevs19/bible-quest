
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, RefreshCw, XCircle, Star, Lock, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const verses = [
  {
    reference: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    version: 'NIV'
  },
  {
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    version: 'NIV'
  },
  {
    reference: 'Philippians 4:13',
    text: 'I can do all this through him who gives me strength.',
    version: 'NIV'
  },
  {
    reference: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    version: 'NIV'
  },
  {
    reference: 'Jeremiah 29:11',
    text: 'For I know the plans I have for you,” declares the LORD, “plans to prosper you and not to harm you, plans to give you hope and a future.',
    version: 'NIV'
  },
  {
    reference: 'Matthew 6:33',
    text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    version: 'NIV'
  },
  {
    reference: 'Galatians 5:22-23',
    text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.',
    version: 'NIV'
  },
  {
    reference: 'Ephesians 2:8-9',
    text: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God— not by works, so that no one can boast.',
    version: 'NIV'
  },
  {
    reference: '2 Timothy 3:16-17',
    text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work.',
    version: 'NIV'
  },
  {
    reference: 'Psalm 23:1',
    text: 'The LORD is my shepherd, I shall not be in want.',
    version: 'NIV'
  }
];

type GameState = 'playing' | 'scored' | 'revealed';
type VerseParts = (string | null)[];

const MAX_REVEALS = 10;
const MAX_CHECKS = 10;

export default function VerseMemoryPage() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [progress, setProgress] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [score, setScore] = useState(0); // number of stars
  const [revealCount, setRevealCount] = useState(MAX_REVEALS);
  const [checkAttempts, setCheckAttempts] = useState(MAX_CHECKS);
  const [completedVerses, setCompletedVerses] = useState<boolean[]>(new Array(verses.length).fill(false));
  const [unlockedIndex, setUnlockedIndex] = useState(0);

  const [verseWithBlanks, setVerseWithBlanks] = useState<VerseParts>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentVerse = verses[currentVerseIndex];

  useEffect(() => {
    if (!isClient) return;

    const words = currentVerse.text.split(' ');
    const missing: string[] = [];
    const verseParts: VerseParts = [];
    
    // Select ~25% of words to be blanks, favoring longer words.
    const wordsToBlank = Math.floor(words.length * 0.25) || 1; // Ensure at least one blank
    const potentialBlankIndices = words
      .map((word, index) => ({ word, index }))
      .filter(item => item.word.length > 3)
      .map(item => item.index);
    
    const shuffled = potentialBlankIndices.sort(() => 0.5 - Math.random());
    const blankIndices = new Set(shuffled.slice(0, wordsToBlank));

    words.forEach((word, index) => {
      if (blankIndices.has(index)) {
        missing.push(word.replace(/[.,;!?]/g, ''));
        verseParts.push(null);
      } else {
        verseParts.push(word);
      }
    });

    setVerseWithBlanks(verseParts);
    setMissingWords(missing);
    
    // Reset state for the new verse
    setUserInputs(new Array(missing.length).fill(''));
    setGameState('playing');
    setEditingIndex(0);
    setScore(0);
    setCheckAttempts(MAX_CHECKS);
  }, [currentVerse, isClient]);


  const resetVerse = (index: number) => {
    setCurrentVerseIndex(index);
  }

  useEffect(() => {
    const completedCount = completedVerses.filter(Boolean).length;
    setProgress((completedCount / verses.length) * 100);
  }, [completedVerses]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
    if(gameState !== 'playing') setGameState('playing');
  };

  const calculateScore = (inputs: string[]) => {
    if (missingWords.length === 0) return 0;
    const correctCount = inputs.reduce((count, input, index) => {
      return input.toLowerCase().trim() === missingWords[index]?.toLowerCase().trim() ? count + 1 : count;
    }, 0);
    const accuracy = correctCount / missingWords.length;
    if (accuracy === 1) return 3;
    if (accuracy >= 0.5) return 2;
    if (accuracy > 0) return 1;
    return 0;
  };

  const handleSubmit = () => {
    if (checkAttempts <= 0) return;
    setCheckAttempts(prev => prev - 1);
    setEditingIndex(null);
    const newScore = calculateScore(userInputs);
    setScore(newScore);
    setGameState('scored');
    if (newScore >= 2) {
      const newCompleted = [...completedVerses];
      newCompleted[currentVerseIndex] = true;
      setCompletedVerses(newCompleted);
      if(currentVerseIndex === unlockedIndex) {
        setUnlockedIndex(unlockedIndex + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    } else {
      // End of game
      setCurrentVerseIndex(0); // Restart for now
      setCompletedVerses(new Array(verses.length).fill(false));
      setUnlockedIndex(0);
    }
  };
  
  const handleReveal = () => {
    if (revealCount <= 0) return;
    setRevealCount(revealCount - 1);
    const correctInputs = [...missingWords];
    setUserInputs(correctInputs);
    const newScore = calculateScore(correctInputs);
    setScore(newScore);
    setGameState('revealed');
    setEditingIndex(null);
     if (newScore >= 2) {
      const newCompleted = [...completedVerses];
      newCompleted[currentVerseIndex] = true;
      setCompletedVerses(newCompleted);
      if(currentVerseIndex === unlockedIndex) {
        setUnlockedIndex(unlockedIndex + 1);
      }
    }
  };
  
  const handleLabelClick = (index: number) => {
    if (gameState === 'playing') {
      setEditingIndex(index);
    }
  };
  
  const handleLevelSelect = (index: number) => {
    if(index <= unlockedIndex) {
      resetVerse(index);
    }
  }
  
  const isCurrentVerseCompleted = score >= 2;

  const renderVerse = () => {
    if (!isClient) {
      return <div>Loading verse...</div>;
    }
    let inputIndex = 0;
    return verseWithBlanks.map((part, index) => {
      if (part === null) {
        const currentIndex = inputIndex;
        inputIndex++;
        
        const isEditable = gameState === 'playing' && editingIndex === currentIndex;
        if (isEditable) {
           return (
            <Input
              key={`input-${currentIndex}`}
              type="text"
              value={userInputs[currentIndex] || ''}
              onChange={(e) => handleInputChange(currentIndex, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              autoFocus
              className="w-32 h-8 text-base shrink-0"
              style={{ width: `${Math.max(missingWords[currentIndex]?.length || 0, 5) + 2}ch` }}
            />
          );
        }
        
        const isWrong = gameState === 'scored' && userInputs[currentIndex]?.toLowerCase().trim() !== missingWords[currentIndex]?.toLowerCase().trim();

        return (
          <Label 
            key={`label-${currentIndex}`}
            onClick={() => handleLabelClick(currentIndex)}
            className={cn(
              "inline-block text-center border-b-2 border-dashed h-8 leading-7 cursor-pointer px-2 rounded-md",
               userInputs[currentIndex] ? "border-primary/50 text-primary-foreground bg-primary/20" : "border-muted-foreground/50",
              gameState !== 'playing' ? 'cursor-default' : '',
              isWrong ? 'bg-destructive/20 border-destructive' : '',
              gameState === 'revealed' ? 'bg-blue-500/20 border-blue-500' : ''
            )}
            style={{ minWidth: `${Math.max(missingWords[currentIndex]?.length || 0, 5) + 2}ch`}}
          >
            {userInputs[currentIndex] || '...'}
          </Label>
        )
      }
      return <span key={`word-${index}`}>{part} </span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold">Verse Memory Challenge</h1>
        <p className="text-muted-foreground">Fill in the blanks to complete the verse.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verse Journey</CardTitle>
           <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {verses.map((_, index) => (
              <React.Fragment key={index}>
                <Button
                  variant={index === currentVerseIndex ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleLevelSelect(index)}
                  disabled={index > unlockedIndex}
                  className={cn(
                    "rounded-full",
                    completedVerses[index] && "bg-green-500 hover:bg-green-600 text-white",
                    index === currentVerseIndex && "ring-2 ring-offset-2 ring-primary"
                  )}
                  aria-label={
                    index > unlockedIndex ? `Level ${index + 1} locked` :
                    completedVerses[index] ? `Level ${index + 1} completed` :
                    `Level ${index + 1}`
                  }
                >
                  {index > unlockedIndex ? <Lock className="h-4 w-4"/> : completedVerses[index] ? <CheckCircle className="h-4 w-4"/> : index === currentVerseIndex ? <PlayCircle className="h-4 w-4"/> : index + 1}
                </Button>
                {index < verses.length - 1 && <div className="flex-1 h-1 bg-border mx-2 rounded-full" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{currentVerse.reference} ({currentVerse.version})</CardTitle>
          <CardDescription>Fill in the missing words from the verse below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg leading-loose flex flex-wrap items-center gap-x-2 gap-y-4">{renderVerse()}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleSubmit} disabled={gameState !== 'playing' || checkAttempts <= 0}>Check My Answer ({checkAttempts})</Button>
            <Button variant="outline" onClick={handleReveal} disabled={revealCount <= 0 || gameState !== 'playing'}>Reveal Answer ({revealCount})</Button>
            <Button variant="secondary" onClick={handleNext} disabled={!isCurrentVerseCompleted && !completedVerses[currentVerseIndex]}>
              {currentVerseIndex === verses.length - 1 ? 'Finish & Restart' : 'Next Verse'} <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {gameState === 'scored' && (
            <Alert variant="default" className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500">
               <Star className="h-4 w-4 text-yellow-600" />
               <AlertTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                 Your Score: 
                 <div className="flex">
                  {Array.from({length: 3}).map((_, i) => (
                    <Star key={i} className={cn("h-5 w-5", i < score ? "text-yellow-500 fill-yellow-500" : "text-yellow-500/50")}/>
                  ))}
                 </div>
              </AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                {score === 3 ? "Perfect! You're a star!" : score >= 2 ? "Great job! You've unlocked the next verse." : score > 0 ? "Great effort! Keep practicing." : "Keep trying! You'll get it."}
              </AlertDescription>
            </Alert>
          )}

           {gameState === 'revealed' && (
            <Alert variant="default" className="bg-blue-100 dark:bg-blue-900/30 border-blue-500">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-300">Answer Revealed</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                The correct words are filled in. Study it, then try the next verse!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
