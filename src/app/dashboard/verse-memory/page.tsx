
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle, RefreshCw, XCircle, Star, Lock, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
    {
    reference: 'Isaiah 40:31',
    text: 'but those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    version: 'NIV'
  },
  {
    reference: 'Joshua 1:9',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.',
    version: 'NIV'
  },
  {
    reference: '1 Corinthians 10:13',
    text: 'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.',
    version: 'NIV'
  },
  {
    reference: 'Psalm 46:1',
    text: 'God is our refuge and strength, an ever-present help in trouble.',
    version: 'NIV'
  },
  {
    reference: 'Romans 12:2',
    text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.',
    version: 'NIV'
  },
    {
    reference: 'Isaiah 41:10',
    text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    version: 'NIV'
  },
  {
    reference: 'Psalm 119:105',
    text: 'Your word is a lamp for my feet, a light on my path.',
    version: 'NIV'
  },
  {
    reference: 'Matthew 11:28-30',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.',
    version: 'NIV'
  },
  {
    reference: 'John 14:6',
    text: 'Jesus answered, “I am the way and the truth and the life. No one comes to the Father except through me.”',
    version: 'NIV'
  },
  {
    reference: 'Romans 10:9',
    text: 'If you declare with your mouth, “Jesus is Lord,” and believe in your heart that God raised him from the dead, you will be saved.',
    version: 'NIV'
  },
  {
    reference: 'Hebrews 4:12',
    text: 'For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.',
    version: 'NIV'
  },
  {
    reference: '2 Corinthians 5:17',
    text: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',
    version: 'NIV'
  },
  {
    reference: 'Psalm 1:1-2',
    text: 'Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers, but whose delight is in the law of the LORD, and who meditates on his law day and night.',
    version: 'NIV'
  },
  {
    reference: 'Proverbs 4:23',
    text: 'Above all else, guard your heart, for everything you do flows from it.',
    version: 'NIV'
  },
  {
    reference: 'Matthew 28:19-20',
    text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.',
    version: 'NIV'
  }
];

type GameState = 'playing' | 'scored' | 'revealed';
type VerseParts = (string | null)[];

const MAX_CHECKS = 10;

export default function VerseMemoryPage() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [attemptScore, setAttemptScore] = useState(0); // number of stars for the current attempt
  const [checkAttempts, setCheckAttempts] = useState(MAX_CHECKS);
  const [verseScores, setVerseScores] = useState<number[]>(new Array(verses.length).fill(0));
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

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
    setAttemptScore(0);
    setCheckAttempts(MAX_CHECKS);
  }, [currentVerse, isClient]);

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

  const updateScoresAndUnlock = (newScore: number) => {
    const newScores = [...verseScores];
    if (newScore > newScores[currentVerseIndex]) {
        newScores[currentVerseIndex] = newScore;
        setVerseScores(newScores);
    }
    if (newScore >= 2 && currentVerseIndex === unlockedIndex) {
      setUnlockedIndex(unlockedIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (checkAttempts <= 0) return;
    setCheckAttempts(prev => prev - 1);
    setEditingIndex(null);
    const newScore = calculateScore(userInputs);
    setAttemptScore(newScore);
    updateScoresAndUnlock(newScore);
    setGameState('scored');
    setShowSummaryDialog(true);
  };

  const handleNext = () => {
    setShowSummaryDialog(false);
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    } else {
      // End of game
      setCurrentVerseIndex(0); // Restart for now
      setVerseScores(new Array(verses.length).fill(0));
      setUnlockedIndex(0);
    }
  };
  
  const handleReveal = () => {
    const correctInputs = [...missingWords];
    setUserInputs(correctInputs);
    const newScore = calculateScore(correctInputs);
    setAttemptScore(newScore);
    updateScoresAndUnlock(newScore);
    setGameState('revealed');
    setEditingIndex(null);
    setShowSummaryDialog(true);
  };
  
  const handleLabelClick = (index: number) => {
    if (gameState === 'playing') {
      setEditingIndex(index);
    }
  };
  
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

  const getDialogMessage = () => {
      if (gameState === 'revealed') return "Here's the full verse. Take some time to study it!";
      if (attemptScore === 3) return "Perfect score! You're a true scripture scholar!";
      if (attemptScore >= 2) return "Great job! You've unlocked the next verse.";
      if (attemptScore > 0) return "Good effort! Keep practicing to get all the stars.";
      return "Keep trying! Memorization is a journey. You can do it!";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold">Verse Memory Challenge</h1>
        <p className="text-muted-foreground">Fill in the blanks to complete the verse.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">{currentVerse.reference} ({currentVerse.version})</CardTitle>
              <CardDescription>Fill in the missing words from the verse below.</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({length: 3}).map((_, i) => (
                <Star key={i} className={cn("h-6 w-6", i < verseScores[currentVerseIndex] ? "text-yellow-500 fill-yellow-500" : "text-gray-300")}/>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg leading-loose flex flex-wrap items-center gap-x-2 gap-y-4">{renderVerse()}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleSubmit} disabled={gameState !== 'playing' || checkAttempts <= 0}>Check My Answer ({checkAttempts})</Button>
            <Button variant="outline" onClick={handleReveal} disabled={gameState !== 'playing'}>Reveal Answer</Button>
             <Button variant="secondary" onClick={handleNext} disabled={verseScores[currentVerseIndex] < 2 && gameState !== 'revealed'}>
              {currentVerseIndex === verses.length - 1 ? 'Finish & Restart' : 'Next Verse'} <RefreshCw className="ml-2 h-4 w-4" />
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
                <Star key={i} className={cn("h-10 w-10", i < attemptScore ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}/>
              ))}
            </div>
            <AlertDialogDescription className="text-center text-base">
                {getDialogMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Card className="bg-muted/50">
             <CardContent className="p-4">
               <p className="text-center font-serif italic">"{currentVerse.text}"</p>
               <p className="text-center font-bold mt-2">- {currentVerse.reference}</p>
             </CardContent>
          </Card>
          <AlertDialogFooter>
            {gameState !== 'revealed' && attemptScore < 3 && (
                 <AlertDialogCancel onClick={() => setShowSummaryDialog(false)}>Try Again</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={handleNext} disabled={verseScores[currentVerseIndex] < 2 && gameState !== 'revealed'}>
                Next Verse
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
