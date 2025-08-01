
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trophy, ChevronLeft, ChevronRight, FileSearch, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { wordSearchLevels } from '@/lib/word-search-puzzles';
import { useUserProgress } from '@/hooks/use-user-progress';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const GRID_SIZE = 12;

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
    const placedWords: { word: string, cells: Cell[] }[] = [];

    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
        if (placedWords.some(p => p.word === word)) continue;

        const shuffledDirections = [...directions].sort(() => random() - 0.5);
        let placed = false;
        
        const startPositions = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
            x: i % GRID_SIZE,
            y: Math.floor(i / GRID_SIZE)
        })).sort(() => random() - 0.5);

        for (const dir of shuffledDirections) {
            for (const pos of startPositions) {
                let canPlace = true;
                const wordCells: Cell[] = [];
                
                const endX = pos.x + dir.x * (word.length - 1);
                const endY = pos.y + dir.y * (word.length - 1);

                if (endX >= GRID_SIZE || endX < 0 || endY >= GRID_SIZE || endY < 0) {
                    canPlace = false;
                } else {
                    for (let i = 0; i < word.length; i++) {
                        const cellY = pos.y + dir.y * i;
                        const cellX = pos.x + dir.x * i;
                        if (grid[cellY][cellX] !== '' && grid[cellY][cellX] !== word[i]) {
                            canPlace = false;
                            break;
                        }
                        wordCells.push({x: cellX, y: cellY});
                    }
                }

                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        const { x, y } = wordCells[i];
                        grid[y][x] = word[i];
                    }
                    placedWords.push({ word, cells: wordCells });
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
    
    const placedWordStrings = placedWords.map(p => p.word).sort();
    return { grid, words: placedWordStrings };
};

type Cell = { x: number, y: number };

export default function WordSearchPage() {
    const [currentRound, setCurrentRound] = useState(0);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    
    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState<{ start: Cell, end: Cell } | null>(null);
    const [foundCells, setFoundCells] = useState<Cell[]>([]);
    
    const gridRef = useRef<HTMLDivElement>(null);

    const { addExp } = useUserProgress();
    const { toast } = useToast();
    const router = useRouter();

    const puzzle = useMemo(() => {
        const levelData = wordSearchLevels[currentRound];
        const seed = levelData.stage * 1000 + levelData.round;
        return generateGrid(levelData.words, seed);
    }, [currentRound]);

    const isRoundComplete = useMemo(() => foundWords.length === puzzle.words.length, [foundWords, puzzle.words]);

    useEffect(() => {
        setFoundWords([]);
        setFoundCells([]);
        setSelection(null);
    }, [currentRound]);

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
            if (dx > dy) y1 = start.y; else x1 = start.x;
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

        const selectedWord = currentSelectedCells.map(cell => puzzle.grid[cell.y][cell.x]).join('');
        const reversedSelectedWord = selectedWord.split('').reverse().join('');
        
        const wordFound = puzzle.words.find(w => w === selectedWord || w === reversedSelectedWord);

        if (wordFound && !foundWords.includes(wordFound)) {
            const newFoundWords = [...foundWords, wordFound];
            setFoundWords(newFoundWords);
            setFoundCells(prev => [...prev, ...currentSelectedCells]);
            
            addExp(wordFound.length);
            toast({ title: `Found: ${wordFound}!`, description: `You earned ${wordFound.length} EXP.` });

            if (newFoundWords.length === puzzle.words.length) {
                toast({ title: "Round Complete!", description: "You found all the words!" });
            }
        }
        setSelection(null);
    };

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
        if (isRoundComplete) return;
        const cell = getCellFromCoords(e.clientX, e.clientY);
        if (cell) {
            setIsSelecting(true);
            setSelection({ start: cell, end: cell });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSelecting && selection) {
            const cell = getCellFromCoords(e.clientX, e.clientY);
            if (cell) {
                setSelection({ ...selection, end: cell });
            }
        }
    };
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isRoundComplete) return;
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
    
    const handleNextRound = () => {
      if (currentRound < wordSearchLevels.length - 1) {
          setCurrentRound(prev => prev + 1);
      }
    };
  
    const handlePrevRound = () => {
        if (currentRound > 0) {
            setCurrentRound(prev => prev - 1);
        }
    };

    const levelData = wordSearchLevels[currentRound];

    return (
        <div className="container mx-auto max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <Button variant="outline" onClick={() => router.push('/dashboard/games')}>
                    <Home className="mr-2"/> Back to Games
                </Button>
                <div className="text-center">
                    <h1 className="font-headline text-3xl font-bold">Word Search</h1>
                    <p className="text-muted-foreground">Find the hidden words in the grid.</p>
                </div>
                <div className="w-40" />
            </div>
            
            <Card>
                <CardHeader className="text-center">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" size="icon" onClick={handlePrevRound} disabled={currentRound === 0}>
                            <ChevronLeft />
                        </Button>
                        <div>
                            <CardTitle className="font-headline text-2xl">{levelData.title}</CardTitle>
                            <CardDescription>Stage {levelData.stage}, Round {levelData.round}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleNextRound} disabled={currentRound === wordSearchLevels.length - 1}>
                            <ChevronRight />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div
                            ref={gridRef}
                            className="grid grid-cols-12 gap-0 bg-stone-300 border-2 border-stone-500 shadow-inner p-1 rounded-lg aspect-square select-none touch-none"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={finishSelection}
                            onMouseLeave={finishSelection}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={finishSelection}
                            onTouchCancel={finishSelection}
                        >
                            {puzzle.grid.map((row, y) =>
                                row.map((letter, x) => {
                                    const isSelected = selectedCells.some(cell => cell.x === x && cell.y === y);
                                    const isFound = foundCells.some(cell => cell.x === x && cell.y === y);
                                    return (
                                        <div
                                            key={`${x}-${y}`}
                                            className={cn(
                                                "flex items-center justify-center w-full aspect-square rounded-sm text-sm sm:text-lg font-bold uppercase transition-colors",
                                                !isRoundComplete && "cursor-pointer",
                                                isSelected ? "bg-primary text-primary-foreground scale-110" : "",
                                                isFound ? "bg-yellow-400 text-yellow-900" : "bg-stone-50 hover:bg-primary/10",
                                            )}
                                        >
                                            {letter}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                    
                    <div className="w-full">
                        <h3 className="font-headline text-xl font-semibold mb-3">Words to Find</h3>
                        <ul className="space-y-1.5 columns-2">
                            {puzzle.words.map(word => (
                                <li key={word} className={cn(
                                    "font-medium transition-all text-sm sm:text-base flex items-center gap-2", 
                                    foundWords.includes(word) ? "text-muted-foreground" : "text-foreground"
                                )}>
                                    <div className={cn("w-4 h-4 rounded-full border-2", foundWords.includes(word) ? "bg-primary border-primary" : "border-muted-foreground/50")}/>
                                    <span className={cn(foundWords.includes(word) && "line-through")}>{word}</span>
                                </li>
                            ))}
                        </ul>
                         {isRoundComplete && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.5}}
                                className="mt-6"
                            >
                               <Card className="text-center bg-green-50 border-green-200 dark:bg-green-900/30">
                                    <CardHeader>
                                        <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-2">
                                            <Trophy className="w-8 h-8 text-green-600"/>
                                        </div>
                                        <CardTitle className="font-headline text-2xl text-green-700 dark:text-green-300">Round Complete!</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Button onClick={handleNextRound} disabled={currentRound === wordSearchLevels.length - 1}>
                                            Go to Next Round <ChevronRight className="ml-2"/>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
