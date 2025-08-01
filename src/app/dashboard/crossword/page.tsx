
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { crosswordLevels, generateGrid } from '@/lib/crossword-puzzles';
import { Check, Lightbulb, Puzzle, Trophy, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useUserProgress } from '@/hooks/use-user-progress';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

type UserInput = { [key: string]: string };

export default function CrosswordPage() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState<UserInput>({});
  const [revealedCells, setRevealedCells] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [activeCell, setActiveCell] = useState<{x: number, y: number} | null>(null);
  const [activeClue, setActiveClue] = useState<{num: number, dir: 'across' | 'down'} | null>(null);
  const inputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  const { hints, useHint } = useUserProgress();
  const { toast } = useToast();

  const { grid, clues } = useMemo(() => generateGrid(crosswordLevels[currentLevel]), [currentLevel]);
  
  const handleInputChange = (x: number, y: number, value: string) => {
    const char = value.toUpperCase().slice(-1);
    setUserInput(prev => ({ ...prev, [`${x}-${y}`]: char }));
    
    if (char) {
      // Move to next cell in the active clue
      const dir = activeClue?.dir;
      const num = activeClue?.num;
      if (!dir || !num) return;
      
      const entry = crosswordLevels[currentLevel].entries.find(e => {
            const entryClueNumber = grid[e.y][e.x]?.number;
            return e.orientation === dir && entryClueNumber === num;
        });

      if(!entry) return;

      const currentCellIndex = dir === 'across' ? x - entry.x : y - entry.y;

      if (currentCellIndex < entry.answer.length - 1) {
          const nextX = dir === 'across' ? x + 1 : x;
          const nextY = dir === 'down' ? y + 1 : y;
          inputRefs.current[`${nextX}-${nextY}`]?.focus();
      }
    }
  };

  const handleCellClick = (x: number, y: number) => {
    setActiveCell({x, y});
    const cell = grid[y][x];
    if (!cell) return;

    // Toggle direction if clicking the same active cell
    if (activeCell && activeCell.x === x && activeCell.y === y && cell.across && cell.down) {
         if (activeClue?.dir === 'across' && cell.down) {
            setActiveClue({num: cell.down, dir: 'down'});
         } else if (activeClue?.dir === 'down' && cell.across) {
            setActiveClue({num: cell.across, dir: 'across'});
         }
         return;
    }
    
    // Default to across, or switch to down if across is already active
    if (activeClue?.dir === 'across' && activeClue.num === cell.across && cell.down) {
       setActiveClue({num: cell.down, dir: 'down'});
    } else if (cell.across) {
       setActiveClue({num: cell.across, dir: 'across'});
    } else if (cell.down) {
       setActiveClue({num: cell.down, dir: 'down'});
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, x: number, y: number) => {
    const dir = activeClue?.dir;
    let nextX = x, nextY = y;

    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextX = Math.min(grid[0].length - 1, x + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        nextX = Math.max(0, x - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextY = Math.min(grid.length - 1, y + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextY = Math.max(0, y - 1);
        break;
      case 'Backspace':
        if (!userInput[`${x}-${y}`]) {
            e.preventDefault();
            if (dir === 'across') nextX = Math.max(0, x - 1);
            if (dir === 'down') nextY = Math.max(0, y - 1);
        } else {
             setUserInput(prev => ({ ...prev, [`${x}-${y}`]: '' }));
             return;
        }
        break;
       case 'Enter': // Toggle direction on Enter
        e.preventDefault();
        const cell = grid[y][x];
        if (cell?.across && cell?.down) {
            if (activeClue?.dir === 'across' && cell.down) {
                setActiveClue({ num: cell.down, dir: 'down' });
            } else if (cell.across) {
                setActiveClue({ num: cell.across, dir: 'across' });
            }
        }
        return;
      default:
        return;
    }
    
    inputRefs.current[`${nextX}-${nextY}`]?.focus();
};

  useEffect(() => {
    if (activeCell) {
       inputRefs.current[`${activeCell.x}-${activeCell.y}`]?.focus();
    }
  }, [activeCell, activeClue]); // Also re-focus when direction changes


  const checkPuzzle = () => {
    let allCorrect = true;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x]) {
          if ((userInput[`${x}-${y}`] || '') !== grid[y][x]!.char) {
            allCorrect = false;
            break;
          }
        }
      }
      if (!allCorrect) break;
    }

    if (allCorrect) {
      setIsCompleted(true);
      toast({ title: "Congratulations!", description: `You've completed Level ${currentLevel + 1}!`});
    } else {
      toast({ variant: 'destructive', title: "Not Quite", description: "Some answers are incorrect. Keep trying!"});
    }
  };

  const revealCell = () => {
     if (!activeCell) {
      toast({ variant: 'destructive', title: 'No Cell Selected', description: 'Click on a cell to reveal it.' });
      return;
    }
    if (hints <= 0) {
      toast({ variant: 'destructive', title: 'Out of Hints', description: 'You need hints to reveal cells.' });
      return;
    }
    useHint();
    const {x, y} = activeCell;
    const correctChar = grid[y][x]?.char;
    if (correctChar) {
       setUserInput(prev => ({...prev, [`${x}-${y}`]: correctChar}));
       setRevealedCells(prev => [...prev, `${x}-${y}`]);
    }
  };
  
    const revealAnswer = () => {
    if (!activeClue) {
      toast({ variant: 'destructive', title: 'No Clue Selected', description: 'Click on a clue or a cell to select an answer to reveal.' });
      return;
    }
    
    const { num, dir } = activeClue;
    const entry = crosswordLevels[currentLevel].entries.find(e => {
        const entryClueNumber = grid[e.y][e.x]?.number;
        return e.orientation === dir && entryClueNumber === num;
    });

    if (!entry) return;

    let newUserInput = {...userInput};
    let newRevealedCells = [...revealedCells];

    for (let i = 0; i < entry.answer.length; i++) {
        const x = entry.orientation === 'across' ? entry.x + i : entry.x;
        const y = entry.orientation === 'down' ? entry.y + i : entry.y;
        
        newUserInput[`${x}-${y}`] = entry.answer[i];
        if (!newRevealedCells.includes(`${x}-${y}`)) {
            newRevealedCells.push(`${x}-${y}`);
        }
    }
    
    setUserInput(newUserInput);
    setRevealedCells(newRevealedCells);
  };


  const nextLevel = () => {
      if (currentLevel < crosswordLevels.length - 1) {
          setCurrentLevel(prev => prev + 1);
          setUserInput({});
          setRevealedCells([]);
          setIsCompleted(false);
          setActiveCell(null);
          setActiveClue(null);
      }
  };
  
  const prevLevel = () => {
      if (currentLevel > 0) {
          setCurrentLevel(prev => prev - 1);
          setUserInput({});
          setRevealedCells([]);
          setIsCompleted(false);
          setActiveCell(null);
          setActiveClue(null);
      }
  };


  return (
    <div className="container mx-auto max-w-7xl">
      <div className="text-center mb-6">
          <h1 className="font-headline text-3xl font-bold">Crossword Puzzle</h1>
          <p className="text-muted-foreground">Test your biblical knowledge in a classic way.</p>
      </div>
      
       <Card>
            <CardHeader className="text-center">
                <div className="flex justify-between items-center">
                    <Button variant="ghost" size="icon" onClick={prevLevel} disabled={currentLevel === 0}>
                        <ChevronLeft />
                    </Button>
                    <div>
                        <CardTitle className="font-headline text-2xl">{crosswordLevels[currentLevel].title}</CardTitle>
                        <CardDescription>{crosswordLevels[currentLevel].theme}</CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={nextLevel} disabled={currentLevel === crosswordLevels.length - 1}>
                        <ChevronRight />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2">
                    <div 
                        className="grid aspect-square bg-stone-400 border-2 border-stone-600 shadow-inner"
                        style={{gridTemplateColumns: `repeat(${grid.length}, 1fr)`}}
                    >
                        {grid.map((row, y) => 
                            row.map((cell, x) => (
                                <div key={`${x}-${y}`} className={cn(
                                    "relative flex items-center justify-center border border-stone-500",
                                    cell ? "bg-white" : "bg-stone-700"
                                )}>
                                    {cell && (
                                        <>
                                            {cell.number && <span className="absolute top-0 left-0.5 text-xs font-bold text-stone-500">{cell.number}</span>}
                                            <Input
                                                ref={ref => { inputRefs.current[`${x}-${y}`] = ref }}
                                                type="text"
                                                maxLength={1}
                                                value={userInput[`${x}-${y}`] || ''}
                                                onChange={e => handleInputChange(x, y, e.target.value)}
                                                onClick={() => handleCellClick(x, y)}
                                                onFocus={() => handleCellClick(x, y)}
                                                onKeyDown={(e) => handleKeyDown(e, x, y)}
                                                className={cn(
                                                    "w-full h-full text-center text-lg sm:text-xl font-bold uppercase p-0 border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                                     (activeClue?.dir === 'across' && grid[y][x]?.across === activeClue.num) && "bg-blue-100",
                                                     (activeClue?.dir === 'down' && grid[y][x]?.down === activeClue.num) && "bg-blue-100",
                                                     activeCell?.x === x && activeCell?.y === y && "bg-yellow-200",
                                                     revealedCells.includes(`${x}-${y}`) && "text-blue-600"
                                                )}
                                                disabled={isCompleted}
                                            />
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-full">
                   <Tabs defaultValue="across" className="w-full" value={activeClue?.dir || 'across'} onValueChange={(val) => setActiveClue(clues[val as 'across' | 'down'][activeClue?.num || 0] ? {num: activeClue!.num, dir: val as 'across' | 'down'} : null)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="across">Across</TabsTrigger>
                            <TabsTrigger value="down">Down</TabsTrigger>
                        </TabsList>
                        <TabsContent value="across">
                           <ScrollArea className="h-96 w-full">
                                <div className="space-y-3 p-1">
                                {Object.entries(clues.across).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([num, clue]) => (
                                    <div key={`across-${num}`} 
                                        onClick={() => {
                                            setActiveClue({num: parseInt(num), dir: 'across'});
                                            const entry = crosswordLevels[currentLevel].entries.find(e => grid[e.y][e.x]?.number === parseInt(num) && e.orientation === 'across');
                                            if (entry) setActiveCell({x: entry.x, y: entry.y});
                                        }}
                                        className={cn("text-sm cursor-pointer p-2 rounded-md", activeClue?.dir === 'across' && activeClue.num === parseInt(num) && 'bg-blue-100 font-bold')}
                                    >
                                        <strong>{num}.</strong> {clue}
                                    </div>
                                ))}
                                </div>
                           </ScrollArea>
                        </TabsContent>
                        <TabsContent value="down">
                           <ScrollArea className="h-96 w-full">
                                <div className="space-y-3 p-1">
                                {Object.entries(clues.down).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([num, clue]) => (
                                    <div key={`down-${num}`} 
                                        onClick={() => {
                                            setActiveClue({num: parseInt(num), dir: 'down'});
                                            const entry = crosswordLevels[currentLevel].entries.find(e => grid[e.y][e.x]?.number === parseInt(num) && e.orientation === 'down');
                                            if (entry) setActiveCell({x: entry.x, y: entry.y});
                                        }}
                                        className={cn("text-sm cursor-pointer p-2 rounded-md", activeClue?.dir === 'down' && activeClue.num === parseInt(num) && 'bg-blue-100 font-bold')}
                                    >
                                        <strong>{num}.</strong> {clue}
                                    </div>
                                ))}
                                </div>
                           </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
            <div className="p-6 pt-0 flex flex-wrap gap-2 justify-center">
                 <Button onClick={revealCell} variant="outline" disabled={isCompleted}>
                    <Lightbulb className="mr-2" /> Reveal Cell ({hints} Hints)
                </Button>
                <Button onClick={revealAnswer} variant="outline" disabled={isCompleted}>
                    <Eye className="mr-2" /> Reveal Answer
                </Button>
                <Button onClick={checkPuzzle} disabled={isCompleted}>
                    <Check className="mr-2" /> Check Puzzle
                </Button>
            </div>

            {isCompleted && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 pt-0">
                    <Card className="text-center bg-green-50 border-green-200 dark:bg-green-900/30">
                        <CardHeader>
                            <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-2">
                                <Trophy className="w-8 h-8 text-green-600"/>
                            </div>
                            <CardTitle className="font-headline text-2xl text-green-700 dark:text-green-300">Level Complete!</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={nextLevel} disabled={currentLevel === crosswordLevels.length - 1}>
                                Go to Next Level <ChevronRight className="ml-2"/>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

       </Card>
    </div>
  );
}
