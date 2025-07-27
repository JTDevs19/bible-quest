
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star, CheckCircle, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const words = [
    "DAVID", "MOSES", "ABRAHAM", "ESTHER", "RUTH", "SAMSON", "GIDEON", "JONAH", "DANIEL",
    "PETER", "PAUL", "JOHN", "MARY", "MARTHA", "LUKE", "MARK", "MATTHEW", "NOAH", "ISAAC",
    "JACOB", "JOSEPH", "SAUL", "SOLOMON", "ELIJAH", "ELISHA", "ISAIAH", "JEREMIAH",
    "DEBORAH", "JOSHUA", "CALEB", "SAMUEL", "NEHEMIAH", "EZRA", "JOB", "ADAM", "EVE"
];

const GRID_SIZE = 12;
const NUM_WORDS = 6;
const BONUS_STARS = 10;

const directions = [
    { x: 1, y: 0 },   // Horizontal
    { x: 0, y: 1 },   // Vertical
    { x: 1, y: 1 },   // Diagonal down-right
    { x: -1, y: 1 },  // Diagonal down-left
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

const generateGrid = (seed: number) => {
    const random = mulberry32(seed);
    let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const placedWords: string[] = [];

    const shuffledWords = [...words].sort(() => random() - 0.5);

    for (const word of shuffledWords) {
        if (placedWords.length >= NUM_WORDS) break;

        const shuffledDirections = [...directions].sort(() => random() - 0.5);
        for (const dir of shuffledDirections) {
            const startX = Math.floor(random() * GRID_SIZE);
            const startY = Math.floor(random() * GRID_SIZE);

            let canPlace = true;
            let currentX = startX;
            let currentY = startY;

            if (
                startX + dir.x * word.length > GRID_SIZE || startX + dir.x * word.length < 0 ||
                startY + dir.y * word.length > GRID_SIZE || startY + dir.y * word.length < 0
            ) {
                canPlace = false;
            } else {
                for (let i = 0; i < word.length; i++) {
                    if (grid[currentY][currentX] !== '' && grid[currentY][currentX] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                    currentX += dir.x;
                    currentY += dir.y;
                }
            }


            if (canPlace) {
                currentX = startX;
                currentY = startY;
                for (let i = 0; i < word.length; i++) {
                    grid[currentY][currentX] = word[i];
                    currentX += dir.x;
                    currentY += dir.y;
                }
                placedWords.push(word);
                break;
            }
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

export default function DailyChallengePage() {
    const [isClient, setIsClient] = useState(false);
    const [lastPlayed, setLastPlayed] = useState<string | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState<{ start: Cell, end: Cell } | null>(null);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [foundCells, setFoundCells] = useState<Cell[]>([]);
    const [isPuzzleOpen, setIsPuzzleOpen] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { grid, words: dailyWords } = useMemo(() => {
       const dateSeed = new Date(today).getTime();
       return generateGrid(dateSeed);
    }, [today]);
    
    const isCompletedToday = lastPlayed === today && foundWords.length === dailyWords.length;
    
    const loadProgress = useCallback(() => {
        const saved = localStorage.getItem(`dailyChallengeProgress_${today}`);
        if (saved) {
            const progress = JSON.parse(saved);
            setLastPlayed(today);
            setFoundWords(progress.words || []);
            setFoundCells(progress.cells || []);
        } else {
             const anyProgress = localStorage.getItem('dailyChallengeProgress');
             if (anyProgress) {
                 const progress = JSON.parse(anyProgress);
                 if (progress.date === today) {
                    setLastPlayed(today);
                    setFoundWords(progress.words || []);
                    setFoundCells(progress.cells || []);
                 }
             }
        }
    }, [today]);

    const saveProgress = useCallback(() => {
        if (!isClient) return;
        const progress = {
            date: today,
            words: foundWords,
            cells: foundCells
        };
        localStorage.setItem(`dailyChallengeProgress_${today}`, JSON.stringify(progress));
    }, [isClient, today, foundWords, foundCells]);
    
    useEffect(() => {
        setIsClient(true);
        loadProgress();
    }, [loadProgress]);

    useEffect(() => {
        saveProgress();
    }, [foundWords, foundCells, saveProgress]);
    
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
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        
        // Lock to straight line or 45-degree diagonal
        if (dx > 0 && dy > 0 && dx !== dy) {
            if (dx > dy) {
                y1 = y0 + (dx * sy);
            } else {
                x1 = x0 + (dy * sx);
            }
        }

        const newDx = Math.abs(x1-x0);
        const newDy = -Math.abs(y1-y0);

        // Bresenham's line algorithm
        let err = newDx + newDy;

        while (true) {
            cells.push({ x: x0, y: y0 });
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 >= newDy) {
                if (x0 === x1) break; 
                err += newDy;
                x0 += sx;
            }
            if (e2 <= newDx) {
                if (y0 === y1) break;
                err += newDx;
                y0 += sy;
            }
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
            const newFoundWords = [...foundWords, wordFound];
            setFoundWords(newFoundWords);
            setFoundCells(prev => [...prev, ...currentSelectedCells]);

            if (newFoundWords.length === dailyWords.length) {
                setLastPlayed(today);
                
                const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || '{}');
                const currentStars = verseMemoryProgress.stars || 0;
                verseMemoryProgress.stars = currentStars + BONUS_STARS;
                localStorage.setItem('verseMemoryProgress', JSON.stringify(verseMemoryProgress));
                
                // Automatically close the puzzle dialog on completion
                setTimeout(() => setIsPuzzleOpen(false), 1000);
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


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isCompletedToday) return;
        const cell = getCellFromCoords(e.clientX, e.clientY);
        if (cell) {
            setIsSelecting(true);
            setSelection({ start: cell, end: cell });
        }
    };

    const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSelecting && selection) {
            const cell = getCellFromCoords(e.clientX, e.clientY);
            if (cell) {
                setSelection({ ...selection, end: cell });
            }
        }
    };
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isCompletedToday) return;
        const cell = getCellFromCoords(e.touches[0].clientX, e.touches[0].clientY);
        if (cell) {
            setIsSelecting(true);
            setSelection({ start: cell, end: cell });
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isSelecting && selection) {
            e.preventDefault();
            const cell = getCellFromCoords(e.touches[0].clientX, e.touches[0].clientY);
            if (cell) {
                setSelection({ ...selection, end: cell });
            }
        }
    };

    if (!isClient) return <div>Loading...</div>;
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="font-headline text-3xl font-bold">Daily Word Search</h1>
                <p className="text-muted-foreground">Find the hidden Bible character names to earn bonus stars!</p>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Gift className="w-10 h-10 text-primary" />
                            <div>
                                <CardTitle className="font-headline text-2xl">Today's Puzzle</CardTitle>
                                <CardDescription>Complete the puzzle for a special reward.</CardDescription>
                            </div>
                        </div>
                        {isCompletedToday ? (
                             <div className="text-right">
                                <div className="flex items-center gap-2 text-green-600 font-bold">
                                    <CheckCircle />
                                    <span>Completed!</span>
                                </div>
                                <p className="text-sm text-muted-foreground">You earned {BONUS_STARS} stars!</p>
                            </div>
                        ) : (
                             <div className="text-right">
                                <p className="font-bold text-primary">{foundWords.length} / {dailyWords.length} Found</p>
                                <p className="text-sm text-muted-foreground">Keep going!</p>
                             </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => setIsPuzzleOpen(true)} className="w-full" size="lg">
                        {isCompletedToday ? 'View Puzzle' : 'Start Puzzle'}
                        {!isCompletedToday && <Play className="ml-2"/>}
                    </Button>
                </CardContent>
            </Card>


            <Dialog open={isPuzzleOpen} onOpenChange={setIsPuzzleOpen}>
                <DialogContent className="max-w-3xl p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Daily Word Search</DialogTitle>
                        <DialogDescription>Find all {dailyWords.length} names. Click and drag to select a word.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
                        <div className="flex-grow w-full">
                             <div
                                ref={gridRef} 
                                className="grid grid-cols-12 gap-0.5 bg-muted/50 p-1 rounded-lg aspect-square select-none touch-none"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseOver}
                                onMouseUp={finishSelection}
                                onMouseLeave={finishSelection}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
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
                                                    !isCompletedToday && "cursor-pointer",
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
                             <h3 className="font-headline text-lg font-semibold mb-2">Words to Find</h3>
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
                             {isCompletedToday && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.5}}
                                    className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-center"
                                >
                                    <p className="font-bold flex items-center justify-center gap-2"><CheckCircle/> Puzzle Complete!</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
