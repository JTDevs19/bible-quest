'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const GRID_SIZE = 12;

const directions = [
    { x: 1, y: 0 },   // Horizontal
    { x: 0, y: 1 },   // Vertical
    { x: 1, y: 1 },   // Diagonal down-right
    { x: 1, y: -1 },  // Diagonal up-right
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
    onComplete: () => void;
    isCompleted: boolean;
}

export function WordSearch({ challenge, onComplete, isCompleted }: WordSearchProps) {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState<{ start: Cell, end: Cell } | null>(null);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [foundCells, setFoundCells] = useState<Cell[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);
    const dateSeed = useMemo(() => new Date().setHours(0,0,0,0), []);

    const { grid, words: dailyWords } = useMemo(() => {
       return generateGrid(challenge.words, dateSeed);
    }, [challenge.words, dateSeed]);

     useEffect(() => {
        if (isCompleted) {
            setFoundWords(dailyWords);
        }
    }, [isCompleted, dailyWords]);
    
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
            const newFoundWords = [...foundWords, wordFound];
            setFoundWords(newFoundWords);
            setFoundCells(prev => [...prev, ...currentSelectedCells]);

            if (newFoundWords.length === dailyWords.length) {
                onComplete();
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
        if (isCompleted) return;
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
        if (isCompleted) return;
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

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-grow w-full">
                 <div
                    ref={gridRef} 
                    className="grid grid-cols-12 gap-0.5 bg-muted/50 p-1 rounded-lg aspect-square select-none touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
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
                                        !isCompleted && "cursor-pointer",
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
                 {isCompleted && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.5}}
                        className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-center"
                    >
                        <p className="font-bold flex items-center justify-center gap-2"><CheckCircle/> Puzzle Complete!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
