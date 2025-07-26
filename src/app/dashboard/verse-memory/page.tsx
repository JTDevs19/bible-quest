'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const verses = [
  {
    reference: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  },
  {
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
  },
  {
    reference: 'Philippians 4:13',
    text: 'I can do all this through him who gives me strength.',
  },
  {
    reference: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
  },
  {
    reference: 'Jeremiah 29:11',
    text: 'For I know the plans I have for you,” declares the LORD, “plans to prosper you and not to harm you, plans to give you hope and a future.',
  },
];

type GameState = 'playing' | 'correct' | 'incorrect' | 'revealed';

export default function VerseMemoryPage() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [progress, setProgress] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(0); // Start with the first input focused

  const currentVerse = verses[currentVerseIndex];
  const { verseWithBlanks, missingWords } = useMemo(() => {
    const words = currentVerse.text.split(' ');
    const missing: string[] = [];
    const verseParts: (string | null)[] = [];
    
    // Select ~25% of words to be blanks, favoring longer words.
    const wordsToBlank = Math.floor(words.length * 0.25);
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

    return { verseWithBlanks: verseParts, missingWords: missing };
  }, [currentVerse]);

  useEffect(() => {
    setUserInputs(new Array(missingWords.length).fill(''));
    setGameState('playing');
    setEditingIndex(0); // Focus the first input on new verse
  }, [currentVerse, missingWords.length]);
  
  useEffect(() => {
    setProgress((currentVerseIndex / verses.length) * 100);
  }, [currentVerseIndex]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
    if(gameState !== 'playing') setGameState('playing');
  };

  const handleSubmit = () => {
    setEditingIndex(null); // Remove focus from any input
    const isCorrect = userInputs.every(
      (input, index) => input.toLowerCase().trim() === missingWords[index].toLowerCase().trim()
    );
    setGameState(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    } else {
      // End of game
      setCurrentVerseIndex(0); // Restart for now
    }
  };
  
  const handleReveal = () => {
    setUserInputs([...missingWords]);
    setGameState('revealed');
    setEditingIndex(null);
  };
  
  const handleLabelClick = (index: number) => {
    if (gameState !== 'revealed') {
      setEditingIndex(index);
    }
  };


  const renderVerse = () => {
    let inputIndex = 0;
    return verseWithBlanks.map((part, index) => {
      if (part === null) {
        const currentIndex = inputIndex;
        inputIndex++;
        
        if (editingIndex === currentIndex && gameState !== 'revealed') {
           return (
            <Input
              key={`input-${currentIndex}`}
              type="text"
              value={userInputs[currentIndex] || ''}
              onChange={(e) => handleInputChange(currentIndex, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              autoFocus
              className="w-32 h-8 text-base shrink-0"
              style={{ width: `${Math.max(missingWords[currentIndex].length, 5) + 2}ch` }}
              disabled={gameState === 'revealed'}
            />
          );
        }

        const isFilled = userInputs[currentIndex] && userInputs[currentIndex].length > 0;
        return (
          <Label 
            key={`label-${currentIndex}`}
            onClick={() => handleLabelClick(currentIndex)}
            className={cn(
              "inline-block text-center border-b-2 border-dashed h-8 leading-7 cursor-pointer px-2 rounded-md",
              isFilled ? "border-primary/50 text-primary-foreground bg-primary/20" : "border-muted-foreground/50",
              gameState === 'revealed' ? "cursor-default text-foreground bg-transparent border-b-0" : "",
              userInputs[currentIndex]?.toLowerCase().trim() !== missingWords[currentIndex]?.toLowerCase().trim() && (gameState === 'correct' || gameState === 'incorrect') ? 'bg-destructive/20 border-destructive' : ''
            )}
            style={{ minWidth: `${Math.max(missingWords[currentIndex].length, 5) + 2}ch`}}
          >
            {userInputs[currentIndex] || '...'}
          </Label>
        )
      }
      return <span key={`word-${index}`}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold">Verse Memory Challenge</h1>
        <p className="text-muted-foreground">Fill in the blanks to complete the verse.</p>
      </div>

      <Progress value={progress} className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{currentVerse.reference}</CardTitle>
          <CardDescription>Fill in the missing words from the verse below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg leading-loose flex flex-wrap items-center gap-x-2 gap-y-4">{renderVerse()}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleSubmit} disabled={gameState === 'revealed'}>Check My Answer</Button>
            <Button variant="outline" onClick={handleReveal}>Reveal Answer</Button>
            <Button variant="secondary" onClick={handleNext}>
              {currentVerseIndex === verses.length - 1 ? 'Finish & Restart' : 'Next Verse'} <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {gameState === 'correct' && (
            <Alert variant="default" className="bg-green-100 dark:bg-green-900/30 border-green-500">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-300">Correct!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                Excellent! You've got it right. Keep going!
              </AlertDescription>
            </Alert>
          )}
          {gameState === 'incorrect' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Not Quite</AlertTitle>
              <AlertDescription>
                Some words are incorrect. Give it another try!
              </AlertDescription>
            </Alert>
          )}
           {gameState === 'revealed' && (
            <Alert variant="default" className="bg-blue-100 dark:bg-blue-900/30 border-blue-500">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-300">Answer Revealed</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                The correct words are filled in. Study it, then try the next verse!
              </Aler tDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
