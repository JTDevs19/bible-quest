
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, RefreshCw, XCircle, Star, Lock, PlayCircle, Map, Trophy, ChevronLeft, ChevronRight, HelpCircle, GitCommitVertical, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  },
];

type GameState = 'playing' | 'checking' | 'scored' | 'revealed' | 'incorrect' | 'incomplete';
type VerseParts = (string | null)[];
type VerseScores = { [level: number]: { [verseIndex: number]: number } };

const MAX_LEVEL = 5;
const STARS_PER_VERSE = 3;
const INITIAL_HINTS = 5;
const INITIAL_REVEALS = 3;

function VerseReview({ verse, verseWithBlanks, userInputs, missingWords, showCorrectAnswer = false }: { verse: typeof verses[number], verseWithBlanks: VerseParts, userInputs: string[], missingWords: string[], showCorrectAnswer?: boolean }) {
  let blankCounter = 0;
  const originalWordsWithPunctuation = verse.text.split(/(\s+|[.,;!?“”"])/).filter(p => p.length > 0);
  let originalWordIndex = 0;

  return (
    <div className="text-center font-serif italic text-lg leading-relaxed">
      <p>
        {verseWithBlanks.map((part, index) => {
          if (part === null) {
            const currentBlankIndex = blankCounter;
            blankCounter++;

            let correctWordWithPunctuation = missingWords[currentBlankIndex];
            for (let i = originalWordIndex; i < originalWordsWithPunctuation.length; i++) {
                const word = originalWordsWithPunctuation[i];
                if (word.trim().toLowerCase().replace(/[.,;!?“”"]/g, '') === missingWords[currentBlankIndex].toLowerCase()) {
                    correctWordWithPunctuation = word;
                    originalWordIndex = i + 1;
                    break;
                }
            }

            const userInput = userInputs[currentBlankIndex]?.trim() ?? '';
            const isCorrect = userInput.toLowerCase() === missingWords[currentBlankIndex].toLowerCase();

            if (isCorrect) {
              return <strong key={`review-blank-${index}`} className="text-green-600 dark:text-green-400">{correctWordWithPunctuation}</strong>;
            }

            return (
              <span key={`review-blank-${index}`} className="inline-block text-center mx-1 relative -top-2">
                {showCorrectAnswer && <span className="text-xs text-red-500 font-sans font-semibold block">{correctWordWithPunctuation}</span>}
                <s className="text-red-500">{userInput || '...'}</s>
              </span>
            );
          }
          
          for (let i = originalWordIndex; i < originalWordsWithPunctuation.length; i++) {
              if (originalWordsWithPunctuation[i] === part) {
                  originalWordIndex = i + 1;
                  break;
              }
          }

          return <span key={`review-text-${index}`}>{part}</span>;
        })}
      </p>
      <p className="text-center font-bold mt-2 text-base not-italic">- {verse.reference}</p>
    </div>
  );
}


export default function VerseMemoryPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [verseScores, setVerseScores] = useState<VerseScores>({});
  const [totalStars, setTotalStars] = useState(0);
  const [revealsRemaining, setRevealsRemaining] = useState(INITIAL_REVEALS);
  const [hintsRemaining, setHintsRemaining] = useState(INITIAL_HINTS);
  const [tradeAmount, setTradeAmount] = useState(1);

  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [attemptScore, setAttemptScore] = useState(0);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showPerfectScoreDialog, setShowPerfectScoreDialog] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isVerseMastered, setIsVerseMastered] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState<null | 'current' | 'all'>(null);
  const [showTradeDialog, setShowTradeDialog] = useState<null | 'hints' | 'reveals'>(null);


  const [verseWithBlanks, setVerseWithBlanks] = useState<VerseParts>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  
  const findFirstUnfinishedVerse = (level: number, scores: VerseScores) => {
    const levelScores = scores[level] || {};
    for (let i = 0; i < verses.length; i++) {
        if ((levelScores[i] || 0) < STARS_PER_VERSE) {
            return i;
        }
    }
    return 0; // Default to first verse if all are complete
  };

  const loadProgress = useCallback(() => {
    if (!isClient) return;
    const savedProgress = localStorage.getItem('verseMemoryProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const loadedLevel = progress.level || 1;
      const loadedScores = progress.scores || {};
      
      setCurrentLevel(loadedLevel);
      setVerseScores(loadedScores);
      setTotalStars(progress.stars || 0);
      setRevealsRemaining(progress.reveals ?? INITIAL_REVEALS);
      setHintsRemaining(progress.hints ?? INITIAL_HINTS);

      const firstUnfinished = findFirstUnfinishedVerse(loadedLevel, loadedScores);
      setCurrentVerseIndex(firstUnfinished);
    }
  }, [isClient]);

  const saveProgress = useCallback(() => {
    if (!isClient) return;
    const progress = {
      level: currentLevel,
      scores: verseScores,
      stars: totalStars,
      reveals: revealsRemaining,
      hints: hintsRemaining,
    };
    localStorage.setItem('verseMemoryProgress', JSON.stringify(progress));
  }, [isClient, currentLevel, verseScores, totalStars, revealsRemaining, hintsRemaining]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    saveProgress();
  }, [verseScores, totalStars, revealsRemaining, hintsRemaining, saveProgress]);

  const recalculateTotalStars = (scores: VerseScores) => {
    return Object.values(scores).flatMap(level => Object.values(level)).reduce((sum, score) => sum + score, 0);
  };
  
  const resetAllProgress = () => {
    setCurrentLevel(1);
    setCurrentVerseIndex(0);
    setVerseScores({});
    setTotalStars(0);
    setRevealsRemaining(INITIAL_REVEALS);
    setHintsRemaining(INITIAL_HINTS);
    localStorage.removeItem('verseMemoryProgress');
    setPopoverOpen(false);
    setShowResetConfirm(null);
    setupRound();
  };
  
  const resetCurrentLevelProgress = () => {
      const newScores = { ...verseScores };
      delete newScores[currentLevel];
      
      const newTotalStars = recalculateTotalStars(newScores);
      
      setVerseScores(newScores);
      setTotalStars(newTotalStars);
      setCurrentVerseIndex(0);
      setShowResetConfirm(null);
  };

  const setupRoundLogic = (verse: typeof verses[number], level: number, scores: VerseScores, verseIdx: number) => {
    const currentVerseScore = scores[level]?.[verseIdx] ?? 0;
    const isMastered = currentVerseScore === STARS_PER_VERSE;
    setIsVerseMastered(isMastered);

    setGameState('playing');
    setEditingIndex(isMastered ? null : 0);
    setAttemptScore(0);
    setShowSummaryDialog(false);
    setShowPerfectScoreDialog(false);

    if (isMastered || !verse) {
        setVerseWithBlanks(verse ? verse.text.split(/(\s+|[.,;!?“”"])/).filter(p => p.length > 0) : []);
        setMissingWords([]);
        setUserInputs([]);
    } else {
        const words = verse.text.split(/(\s+|[.,;!?“”"])/).filter(p => p.length > 0);
        const missing: string[] = [];
        const verseParts: VerseParts = [];
        
        const wordsToBlank = level;
        const potentialBlankIndices = words
            .map((word, index) => ({ word, index }))
            .filter(item => item.word.trim().length > 3 && /^[a-zA-Z]+$/.test(item.word.trim()))
            .map(item => item.index);
        
        const seedString = `${verse.reference}-${level}`;
        let h = 1779033703 ^ seedString.length;
        for (let i = 0; i < seedString.length; i++) {
            h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
            h = h << 13 | h >>> 19;
        }
        const pseudoRandom = () => {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return ((h ^= h >>> 16) >>> 0) / 4294967296;
        };

        const shuffled = [...potentialBlankIndices].sort(() => pseudoRandom() - 0.5);
        const blankIndices = new Set(shuffled.slice(0, wordsToBlank));

        words.forEach((word, index) => {
            if (blankIndices.has(index)) {
                missing.push(word.replace(/[.,;!?“”"]/g, ''));
                verseParts.push(null);
            } else {
                verseParts.push(word);
            }
        });

        setVerseWithBlanks(verseParts);
        setMissingWords(missing);
        setUserInputs(new Array(missing.length).fill(''));
    }
  }

  const setupRound = useCallback(() => {
    if (!isClient) return;
    const verse = verses[currentVerseIndex];
    if (verse) {
      setupRoundLogic(verse, currentLevel, verseScores, currentVerseIndex);
    }
  }, [currentVerseIndex, currentLevel, isClient, verseScores]);

  useEffect(() => {
    setupRound();
  }, [setupRound]);


  const calculateScore = useCallback((inputs: string[]) => {
    if (missingWords.length === 0) return 0;
    
    const correctCount = inputs.reduce((count, input, index) => {
      const isCorrect = input.toLowerCase().trim() === missingWords[index]?.toLowerCase().trim();
      return isCorrect ? count + 1 : count;
    }, 0);
    
    if (correctCount === missingWords.length) return 3;

    const accuracy = correctCount / missingWords.length;

    if (accuracy >= 0.5) return 2;
    if (accuracy > 0) return 1;
    return 0;
  }, [missingWords]);
  
 const tryAgain = () => {
    setShowSummaryDialog(false);
    setGameState('playing');
    setEditingIndex(0);
 }

  const handleSubmit = () => {
    if (isVerseMastered) return;

    if (userInputs.some(input => input.trim() === '')) {
      setGameState('incomplete');
      return;
    }

    const score = calculateScore(userInputs);
    setAttemptScore(score);

    const oldScore = verseScores[currentLevel]?.[currentVerseIndex] ?? 0;

    if (score > oldScore) {
      const scoreDifference = score - oldScore;
      setVerseScores(prevScores => {
        const newScores = { ...prevScores };
        if (!newScores[currentLevel]) newScores[currentLevel] = {};
        newScores[currentLevel][currentVerseIndex] = score;
        return newScores;
      });
      setTotalStars(prevStars => prevStars + scoreDifference);
    }
    
    if (score === 3) {
      setGameState('scored');
      setIsVerseMastered(true);
      setShowPerfectScoreDialog(true);
    } else if (score > 0) {
      setGameState('scored');
      setShowSummaryDialog(true);
    } else {
      setGameState('incorrect');
      setShowSummaryDialog(true);
    }
  };
  
  const handleNext = () => {
    setShowSummaryDialog(false);
    setShowPerfectScoreDialog(false);
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    } else {
       const starsForNextLevel = currentLevel * verses.length * STARS_PER_VERSE;
       if (totalStars >= starsForNextLevel && currentLevel < MAX_LEVEL) {
          setCurrentLevel(l => {
            const newLevel = l + 1;
            const firstUnfinished = findFirstUnfinishedVerse(newLevel, verseScores);
            setCurrentVerseIndex(firstUnfinished);
            return newLevel;
          });
       } else {
        const firstUnfinished = findFirstUnfinishedVerse(currentLevel, verseScores);
        setCurrentVerseIndex(firstUnfinished); 
       }
    }
  };

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    }
  };
  
  const handleReveal = () => {
    if (isVerseMastered) return;
    if (revealsRemaining > 0) {
        setRevealsRemaining(r => r - 1);
        performReveal();
    } else {
        setTradeAmount(1);
        setShowTradeDialog('reveals');
    }
  };

  const performReveal = () => {
    setUserInputs([...missingWords]);
    setAttemptScore(0);
    setGameState('revealed');
    setShowSummaryDialog(true);
    setEditingIndex(null);
  }

  const handleTradeForReveals = () => {
    if (totalStars >= tradeAmount && tradeAmount > 0) {
        setTotalStars(s => s - tradeAmount);
        setRevealsRemaining(r => r + tradeAmount);
        setShowTradeDialog(null);
    }
  };
  
  const handleTradeForHints = () => {
    if (totalStars >= tradeAmount && tradeAmount > 0) {
        setTotalStars(s => s - tradeAmount);
        setHintsRemaining(r => r + tradeAmount);
        setShowTradeDialog(null);
    }
  };

  const handleHintClick = () => {
    if(isVerseMastered) return;
    if (hintsRemaining > 0) {
        setShowTradeDialog('hints');
    } else {
        setTradeAmount(1);
        setShowTradeDialog('hints');
    }
  };
  
  const useHint = () => {
    if (hintsRemaining > 0 && !isVerseMastered) {
      const firstEmptyIndex = userInputs.findIndex(input => input === '');
      if (firstEmptyIndex !== -1) {
        const newInputs = [...userInputs];
        newInputs[firstEmptyIndex] = missingWords[firstEmptyIndex];
        setUserInputs(newInputs);
        setHintsRemaining(h => h - 1);
      }
    }
    setShowTradeDialog(null);
  };
  
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
    if(gameState === 'checking' || gameState === 'incorrect' || gameState === 'incomplete') {
      setGameState('playing');
    }
  };

  const handleLabelClick = (index: number) => {
    if (isVerseMastered) return;
    if (gameState === 'playing' || gameState === 'checking' || gameState === 'incomplete') {
      setEditingIndex(index);
    }
  };

  const handleLevelSelect = (level: number) => {
    const requiredStars = (level - 1) * verses.length * STARS_PER_VERSE;
    if (level === 1 || totalStars >= requiredStars) {
      setCurrentLevel(level);
      const firstUnfinished = findFirstUnfinishedVerse(level, verseScores);
      setCurrentVerseIndex(firstUnfinished);
      setPopoverOpen(false);
    }
  };
  
  const currentVerse = verses[currentVerseIndex];

  const renderVerse = () => {
    if (!isClient || !currentVerse) {
      return <div>Loading verse...</div>;
    }
    
    if (isVerseMastered) {
      return <p className="font-serif italic text-lg leading-relaxed">"{currentVerse.text}"</p>;
    }

    if (verseWithBlanks.length === 0) {
      return <div>Loading verse...</div>;
    }

    let inputIndex = 0;
    return verseWithBlanks.map((part, index) => {
      if (part === null) {
        const currentIndex = inputIndex;
        inputIndex++;
        
        const isEditable = (gameState === 'playing' || gameState === 'checking' || gameState === 'incomplete') && editingIndex === currentIndex && !isVerseMastered;

        if (isEditable) {
           return (
            <Input
              key={`input-${currentIndex}`}
              type="text"
              value={userInputs[currentIndex] || ''}
              onChange={(e) => handleInputChange(currentIndex, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              autoFocus
              className={cn("w-32 h-8 text-base shrink-0 inline-block", (gameState === 'incorrect' || gameState === 'incomplete') && 'border-destructive ring-destructive')}
              style={{ width: `${Math.max(missingWords[currentIndex]?.length || 0, 5) + 2}ch` }}
              disabled={isVerseMastered}
            />
          );
        }
        
        const userInput = userInputs[currentIndex]?.trim().toLowerCase();
        const correctWord = missingWords[currentIndex]?.trim().toLowerCase();
        const isCorrect = userInput === correctWord;
        const isWrong = (gameState === 'checking' || gameState === 'incorrect') && !isCorrect;
        const isCheckingAndCorrect = gameState === 'checking' && isCorrect;

        return (
          <Label 
            key={`label-${currentIndex}`}
            onClick={() => handleLabelClick(currentIndex)}
            className={cn(
              "inline-block text-center border-b-2 border-dashed h-8 leading-7 cursor-pointer px-2 rounded-md",
               userInputs[currentIndex] ? "border-primary/50 text-primary-foreground bg-primary/20" : "border-muted-foreground/50",
              (gameState === 'scored' || gameState === 'revealed' || isVerseMastered) ? 'cursor-default' : '',
              isWrong ? 'bg-destructive/20 border-destructive' : '',
              isCheckingAndCorrect ? 'bg-green-500/20 border-green-500' : '',
              gameState === 'revealed' ? 'bg-blue-500/20 border-blue-500' : '',
              isVerseMastered ? 'bg-green-500/20 border-green-500 !cursor-default' : ''
            )}
            style={{ minWidth: `${Math.max(missingWords[currentIndex]?.length || 0, 5) + 2}ch`}}
          >
            {userInputs[currentIndex] || '...'}
          </Label>
        )
      }
      return <span key={`word-${index}`}>{part}</span>;
    });
  };

  const getDialogMessage = () => {
      if (gameState === 'revealed') return "Here's the full verse. Take some time to study it!";
      if (attemptScore === 3) return "Perfect score! You're a true scripture scholar!";
      if (attemptScore >= 2) return "Great job! Keep going!";
      if (attemptScore > 0) return "Good effort! Keep practicing to get all the stars.";
      return "Keep trying! Memorization is a journey. You can do it!";
  }

  const starsForNextLevel = currentLevel * verses.length * STARS_PER_VERSE;
  const currentVerseScore = verseScores[currentLevel]?.[currentVerseIndex] ?? 0;

  if (!isClient || !currentVerse) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:px-0 px-4">
       <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold">Verse Memory Challenge</h1>
        <p className="text-muted-foreground">Fill in the blanks to complete the verse.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevVerse} disabled={currentVerseIndex === 0}>
                    <ChevronLeft className="w-5 h-5"/>
                </Button>
                <div>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    {currentVerse.reference} ({currentVerse.version})
                    <div className="flex">
                    {Array.from({length: STARS_PER_VERSE}).map((_, i) => (
                        <Star key={i} className={cn("w-5 h-5", i < currentVerseScore ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600")} />
                    ))}
                    </div>
                </CardTitle>
                <CardDescription>Fill in the missing words from the verse below.</CardDescription>
                </div>
                 <Button variant="outline" size="icon" onClick={handleNextVerse} disabled={currentVerseIndex === verses.length - 1}>
                    <ChevronRight className="w-5 h-5"/>
                </Button>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                <div className="font-bold">Level {currentLevel}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500"/> {totalStars}
                </div>
               </div>
               <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon"><Map className="w-5 h-5"/></Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                        <div className="text-center">
                           <h4 className="font-medium leading-none font-headline">Verse Journey</h4>
                           <p className="text-sm text-muted-foreground">Complete all levels to become a master!</p>
                        </div>
                        <div className="space-y-3">
                           {Array.from({length: MAX_LEVEL}).map((_, i) => {
                               const levelNum = i + 1;
                               const requiredStars = (levelNum - 1) * verses.length * STARS_PER_VERSE;
                               const isUnlocked = levelNum === 1 || totalStars >= requiredStars;
                               const isCurrent = levelNum === currentLevel;
                               const levelScoresData = verseScores[levelNum] || {};
                               const masteredInLevel = Object.values(levelScoresData).filter(score => score === STARS_PER_VERSE).length;
                               const isLevelComplete = masteredInLevel === verses.length;

                               return (
                                 <div 
                                    key={levelNum} 
                                    onClick={() => isUnlocked && handleLevelSelect(levelNum)}
                                    className={cn(
                                      "flex items-center gap-4 p-2 rounded-lg transition-colors", 
                                      isCurrent ? "bg-primary/10 border border-primary/20" : "",
                                      isUnlocked ? "cursor-pointer hover:bg-muted" : "opacity-50"
                                    )}
                                  >
                                    <div className={cn("p-2 rounded-full", isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                                      {isUnlocked ? <PlayCircle className="w-6 h-6"/> : <Lock className="w-6 h-6"/>}
                                    </div>
                                    <div>
                                        <p className="font-semibold">Level {levelNum}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                           {isUnlocked ? (
                                             isLevelComplete ? (
                                                <>
                                                  <CheckCircle className="w-4 h-4 text-green-500"/> Level Complete!
                                                </>
                                             ) : (
                                                `${masteredInLevel}/${verses.length} Mastered`
                                             )
                                           ) : (
                                            `Requires ${requiredStars} stars`
                                           )}
                                        </p>
                                    </div>
                                 </div>
                               )
                           })}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Progress
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem onSelect={() => setShowResetConfirm('current')}>
                                    Reset Current Level
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setShowResetConfirm('all')} className="text-destructive">
                                    Reset All Progress
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </PopoverContent>
               </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg leading-loose flex flex-wrap items-center gap-x-1 gap-y-4">{renderVerse()}</div>
           {gameState === 'incomplete' && <p className="text-destructive text-center font-semibold">Please fill in all the blanks before checking.</p>}
          <div className="flex flex-wrap gap-2 justify-center">
            {gameState !== 'incorrect' ? (
                <Button disabled={isVerseMastered || gameState === 'scored' || gameState === 'revealed'} onClick={handleSubmit}>
                    Check My Answer
                </Button>
            ) : (
                <Button onClick={tryAgain} variant="destructive">
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
            )}
            <Button variant="outline" onClick={handleHintClick} disabled={isVerseMastered || gameState === 'scored' || gameState === 'revealed'}>
                <HelpCircle className="mr-2 h-4 w-4"/>
                Hint ({hintsRemaining})
            </Button>
            
            <Button variant="outline" onClick={handleReveal} disabled={isVerseMastered}>
                Reveal Answer ({revealsRemaining})
            </Button>
             <Button variant="secondary" onClick={handleNext}>
              {currentVerseIndex === verses.length - 1 ? 'Finish Level' : 'Next Verse'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl text-center">
              {gameState === 'revealed' ? "Verse Revealed" : "Rating"}
            </AlertDialogTitle>
            <div className="flex justify-center py-4">
              {Array.from({length: 3}).map((_, i) => (
                <Star key={i} className={cn("h-10 w-10", i < attemptScore ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
              ))}
            </div>
            <AlertDialogDescription className="text-center text-base">
                {getDialogMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Card className="bg-muted/50">
             <CardContent className="p-4">
                {(gameState === 'scored' || gameState === 'incorrect') && (
                    <VerseReview 
                        verse={currentVerse} 
                        verseWithBlanks={verseWithBlanks} 
                        userInputs={userInputs} 
                        missingWords={missingWords}
                        showCorrectAnswer={false} 
                    />
                )}
                {gameState === 'revealed' && (
                    <>
                        <p className="text-center font-serif italic">"{currentVerse.text}"</p>
                        <p className="text-center font-bold mt-2">- {currentVerse.reference}</p>
                    </>
                )}
             </CardContent>
          </Card>
          <AlertDialogFooter>
            {(gameState === 'scored' && attemptScore < 3) || gameState === 'incorrect' ? (
                 <AlertDialogAction onClick={tryAgain}>Try Again</AlertDialogAction>
            ) : null}
            <AlertDialogAction onClick={handleNext}>
                {currentVerseIndex === verses.length - 1 ? (
                    totalStars >= starsForNextLevel && currentLevel < MAX_LEVEL ? "Start Next Level!" : "Finish Level"
                ) : "Next Verse"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showPerfectScoreDialog} onOpenChange={setShowPerfectScoreDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    <Trophy className="w-10 h-10 text-primary" />
                </div>
                <AlertDialogTitle className="font-headline text-3xl text-center">Verse Mastered!</AlertDialogTitle>
                <div className="flex justify-center py-2">
                    {Array.from({length: 3}).map((_, i) => (
                        <Star key={i} className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                    ))}
                </div>
                <AlertDialogDescription className="text-center text-base pt-2">
                    Congratulations! You earned 3 stars and perfected {currentVerse.reference}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleNext} className="w-full">
                    {currentVerseIndex === verses.length - 1 ? "Finish Level" : "Next Verse"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetConfirm !== null} onOpenChange={(open) => !open && setShowResetConfirm(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {showResetConfirm === 'current'
                            ? "This will reset all your scores and stars for the current level. This action cannot be undone."
                            : "This will permanently delete all your progress, including all scores and stars across all levels. This action cannot be undone."
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowResetConfirm(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={showResetConfirm === 'current' ? resetCurrentLevelProgress : resetAllProgress}
                      className={cn(showResetConfirm === 'all' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showTradeDialog !== null} onOpenChange={(open) => !open && setShowTradeDialog(null)}>
            <AlertDialogContent>
                {showTradeDialog === 'hints' && hintsRemaining > 0 ? (
                     <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Use a Hint?</AlertDialogTitle>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <div>Using a hint will reveal the next missing word in the verse. This can help you learn the verse without revealing the entire answer.</div>
                                <div className="font-bold">You have {hintsRemaining} hint(s) remaining.</div>
                                <div>Are you sure you want to use a hint?</div>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setShowTradeDialog(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={useHint}>Use Hint</AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                ) : (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>No {showTradeDialog ? `${showTradeDialog.charAt(0).toUpperCase()}${showTradeDialog.slice(1)}` : ''} Remaining</AlertDialogTitle>
                            <AlertDialogDescription>
                                You can trade your stars for more {showTradeDialog}. You currently have {totalStars} star(s).
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex items-center gap-2">
                            <Input 
                                type="number"
                                value={tradeAmount}
                                onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                max={totalStars}
                            />
                            <Label>Star(s) for {tradeAmount} {showTradeDialog}</Label>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setShowTradeDialog(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={showTradeDialog === 'hints' ? handleTradeForHints : handleTradeForReveals} disabled={totalStars < tradeAmount || tradeAmount <= 0}>
                                Trade {tradeAmount} <Star className="w-4 h-4 ml-1" />
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                )}
            </AlertDialogContent>
        </AlertDialog>


    </div>
  );
}
