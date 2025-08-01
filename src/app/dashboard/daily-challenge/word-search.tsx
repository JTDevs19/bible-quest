
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CheckCircle, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GRID_SIZE = 12;
const TIME_LIMIT = 180; // 3 minutes in seconds

const directions = [
    { x: 1, y: 0 },   // Horizontal
    { x: -1, y: 0 },  // Horizontal-reversed
    { x: 0, y: 1 },   // Vertical
    { x: 0, y: -1 },  // Vertical-reversed
    { x: 1, y: 1 },   // Diagonal down-right
    { x: -1, y: -1 }, // Diagonal up-left
    { x: 1, y: -1 },  // Diagonal up-right
    { x: -1, y: 1 }, // Diagonal down-left
];

// Seeded random number generator
const mulberry32 = (a: number) => {
    return () => {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const generateGrid = (words: string[], seed: number) => {
    const random = mulberry32(seed);
    let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const placedWords: string[] = [];

    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
        if (placedWords.includes(word)) continue;

        const shuffledDirections = [...directions].sort(() => random() - 0.5);
        let placed = false;
        for (const dir of shuffledDirections) {
            const startPositions = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
                x: i % GRID_SIZE,
                y: Math.floor(i / GRID_SIZE)
            })).sort(() => random() - 0.5);

            for (const pos of startPositions) {
                let canPlace = true;
                if (
                    pos.x + dir.x * (word.length - 1) >= GRID_SIZE || pos.x + dir.x * (word.length - 1) < 0 ||
                    pos.y + dir.y * (word.length - 1) >= GRID_SIZE || pos.y + dir.y * (word.length - 1) < 0
                ) {
                    canPlace = false;
                } else {
                    for (let i = 0; i < word.length; i++) {
                        const cellY = pos.y + dir.y * i;
                        const cellX = pos.x + dir.x * i;
                        if (grid[cellY][cellX] !== '' && grid[cellY][cellX] !== word[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                }

                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        const cellY = pos.y + dir.y * i;
                        const cellX = pos.x + dir.x * i;
                        grid[cellY][cellX] = word[i];
                    }
                    placedWords.push(word);
                    placed = true;
                    break; 
                }
            }
            if (placed) break;
        }
    }
    
    // Fill remaining grid
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] === '') {
                grid[y][x] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(random() * 26)];
            }
        }
    }

    return { grid, words: placedWords.sort() };
};

type Cell = { x: number, y: number };

interface WordSearchProps {
    challenge: {
        words: string[];
    };
    onComplete: (timeBonus: number) => void;
    isCompleted: boolean;
    addExp: (amount: number) => void;
}

export function WordSearch({ challenge, onComplete, isCompleted, addExp }: WordSearchProps) {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState<{ start: Cell, end: Cell } | null>(null);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [foundCells, setFoundCells] = useState<Cell[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);
    const dateSeed = useMemo(() => new Date().setHours(0,0,0,0), []);
    const { toast } = useToast();

    const { grid, words: dailyWords } = useMemo(() => {
       return generateGrid(challenge.words, dateSeed);
    }, [challenge.words, dateSeed]);
    
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [isTimeUp, setIsTimeUp] = useState(false);
    
    const isPuzzleComplete = foundWords.length === dailyWords.length;
    
    useEffect(() => {
        if (isCompleted) {
            setFoundWords(dailyWords);
            setIsTimeUp(true); // Stop timer if already completed
        }
    }, [isCompleted, dailyWords]);

     useEffect(() => {
        if (isCompleted || isPuzzleComplete || isTimeUp) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsTimeUp(true);
                    toast({
                        variant: 'destructive',
                        title: "Time's Up!",
                        description: "You ran out of time. Good effort!",
                    });
                    // Finalize score with no bonus
                    onComplete(0); 
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isCompleted, isPuzzleComplete, isTimeUp, onComplete, toast]);
    
    const getSelectedCells = useCallback(() => {
        if (!selection) return [];
        const cells: Cell[] = [];
        let { start, end } = selection;

        let x0 = start.x;
        let y0 = start.y;
        let x1 = end.x;
        let y1 = end.y;

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);

        // Lock to straight line or 45-degree diagonal
        if (dx > 0 && dy > 0 && dx !== dy) {
            if (dx > dy) {
                y1 = y0 + Math.round(dx * (y1 > y0 ? 1 : -1) * (dy / dx));
            } else {
                x1 = x0 + Math.round(dy * (x1 > x0 ? 1 : -1) * (dx / dy));
            }
        }
        
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            cells.push({ x: x0, y: y0 });
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
        
        return cells;
    }, [selection]);
    
    const selectedCells = useMemo(getSelectedCells, [selection, getSelectedCells]);
    
    const finishSelection = () => {
        if (!isSelecting || !selection) return;
        setIsSelecting(false);
        
        const currentSelectedCells = getSelectedCells();
        if (currentSelectedCells.length === 0) {
            setSelection(null);
            return;
        }

        const selectedWord = currentSelectedCells.map(cell => grid[cell.y][cell.x]).join('');
        const reversedSelectedWord = selectedWord.split('').reverse().join('');
        
        const wordFound = dailyWords.find(w => w === selectedWord || w === reversedSelectedWord);

        if (wordFound && !foundWords.includes(wordFound)) {
            addExp(1); // Give 1 EXP per word found
            const newFoundWords = [...foundWords, wordFound];
            setFoundWords(newFoundWords);
            setFoundCells(prev => [...prev, ...currentSelectedCells]);

            if (newFoundWords.length === dailyWords.length) {
                const timeBonus = Math.floor(timeLeft / 10); // 1 bonus point for every 10 seconds left
                onComplete(timeBonus);
                toast({
                    title: 'Puzzle Complete!',
                    description: `You earned a time bonus of ${timeBonus} EXP!`
                });
            }
        }
        setSelection(null);
    }
    
    const getCellFromCoords = (clientX: number, clientY: number): Cell | null => {
        if (!gridRef.current) return null;

        const rect = gridRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            return null;
        }

        const cellWidth = rect.width / GRID_SIZE;
        const cellHeight = rect.height / GRID_SIZE;

        const cellX = Math.floor(x / cellWidth);
        const cellY = Math.floor(y / cellHeight);

        if (cellX >= 0 && cellX < GRID_SIZE && cellY >= 0 && cellY < GRID_SIZE) {
            return { x: cellX, y: cellY };
        }
        return null;
    }

    const handleInteractionStart = (clientX: number, clientY: number) => {
        if (isCompleted || isTimeUp) return;
        const cell = getCellFromCoords(clientX, clientY);
        if (cell) {
            setIsSelecting(true);
            setSelection({ start: cell, end: cell });
        }
    };

    const handleInteractionMove = (clientX: number, clientY: number, e?: React.TouchEvent<HTMLDivElement>) => {
        if (isSelecting && selection) {
            e?.preventDefault();
            const cell = getCellFromCoords(clientX, clientY);
            if (cell) {
                setSelection({ ...selection, end: cell });
            }
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-grow w-full">
                 <div
                    ref={gridRef} 
                    className={cn(
                        "grid grid-cols-12 gap-0.5 bg-muted/50 p-1 rounded-lg aspect-square select-none touch-none",
                        (isTimeUp || isCompleted) && "opacity-50 pointer-events-none"
                    )}
                    onMouseDown={(e) => handleInteractionStart(e.clientX, e.clientY)}
                    onMouseMove={(e) => handleInteractionMove(e.clientX, e.clientY)}
                    onMouseUp={finishSelection}
                    onMouseLeave={finishSelection}
                    onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY, e)}
                    onTouchEnd={finishSelection}
                    onTouchCancel={finishSelection}
                 >
                    {grid.map((row, y) => 
                        row.map((letter, x) => {
                            const isSelected = selectedCells.some(cell => cell.x === x && cell.y === y);
                            const isFound = foundCells.some(cell => cell.x === x && cell.y === y);
                            return (
                                <div
                                    key={`${x}-${y}`}
                                    className={cn(
                                        "flex items-center justify-center w-full aspect-square rounded-sm text-xs sm:text-base font-bold uppercase transition-colors",
                                        !isCompleted && !isTimeUp && "cursor-pointer",
                                        isSelected ? "bg-primary text-primary-foreground" : "",
                                        isFound ? "bg-accent text-accent-foreground" : "bg-background hover:bg-primary/10",
                                    )}
                                >
                                    {letter}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            <div className="w-full md:w-52 shrink-0">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="font-headline text-lg font-semibold">Words to Find</h3>
                    <div className={cn(
                        "flex items-center gap-1 font-mono font-bold text-lg bg-background/80 px-2 py-0.5 rounded-md",
                        timeLeft < 120 && "text-yellow-500",
                        timeLeft < 60 && "text-destructive",
                        timeLeft >= 120 && "text-primary"
                    )}>
                        <Clock className="w-5 h-5" />
                        {timeDisplay}
                    </div>
                 </div>
                <ul className="space-y-1.5 columns-2">
                   {dailyWords.map(word => (
                        <li key={word} className={cn(
                            "font-medium transition-all text-sm sm:text-base", 
                            foundWords.includes(word) && "line-through text-muted-foreground"
                        )}>
                            {word}
                        </li>
                   ))}
                </ul>
                 {isPuzzleComplete && !isCompleted && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.5}}
                        className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-center"
                    >
                        <p className="font-bold flex items-center justify-center gap-2"><CheckCircle/> Puzzle Complete!</p>
                    </motion.div>
                )}
                {isTimeUp && !isPuzzleComplete && (
                     <Alert variant="destructive" className="mt-4">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Time's Up!</AlertTitle>
                        <AlertDescription>Good effort! You found {foundWords.length} out of {dailyWords.length} words.</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
