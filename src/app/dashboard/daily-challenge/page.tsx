
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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


export default function DailyChallengePage() {
    const [isClient, setIsClient] = useState(false);
    const [lastPlayed, setLastPlayed] = useState<string | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { grid, words: dailyWords } = useMemo(() => {
       const dateSeed = new Date(today).getTime();
       return generateGrid(dateSeed);
    }, [today]);
    
    useEffect(() => {
        setIsClient(true);
        const savedLastPlayed = localStorage.getItem('dailyChallengeLastPlayed');
        if (savedLastPlayed) {
            setLastPlayed(savedLastPlayed);
            const savedFoundWords = JSON.parse(localStorage.getItem(`dailyChallengeProgress_${savedLastPlayed}`) || '[]');
            setFoundWords(savedFoundWords);
        }
    }, []);

    const canPlay = lastPlayed !== today || foundWords.length < dailyWords.length;
    const isCompletedToday = lastPlayed === today && foundWords.length === dailyWords.length;

    const saveProgress = useCallback(() => {
        if (!isClient || !canPlay) return;
        localStorage.setItem(`dailyChallengeProgress_${today}`, JSON.stringify(foundWords));
    }, [isClient, canPlay, today, foundWords]);
    
    useEffect(() => {
        saveProgress();
    }, [foundWords, saveProgress]);
    
    const getSelectedCells = () => {
        if (!selection) return [];
        const cells = [];
        const { start, end } = selection;
        const dx = Math.sign(end.x - start.x);
        const dy = Math.sign(end.y - start.y);
        
        let x = start.x;
        let y = start.y;

        if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) { // Straight or diagonal line
             while(true) {
                cells.push({x, y});
                if (x === end.x && y === end.y) break;
                x += dx;
                y += dy;
            }
        }
        return cells;
    };
    
    const selectedCells = useMemo(getSelectedCells, [selection]);

    const handleMouseDown = (x: number, y: number) => {
        if (!canPlay || isCompletedToday) return;
        setIsSelecting(true);
        setSelection({ start: { x, y }, end: { x, y } });
    };

    const handleMouseOver = (x: number, y: number) => {
        if (isSelecting && selection) {
            setSelection({ ...selection, end: { x, y } });
        }
    };

    const handleMouseUp = () => {
        if (!isSelecting || !selection) return;
        setIsSelecting(false);
        
        const selectedWord = selectedCells.map(cell => grid[cell.y][cell.x]).join('');
        const reversedSelectedWord = selectedWord.split('').reverse().join('');
        
        const wordFound = dailyWords.find(w => w === selectedWord || w === reversedSelectedWord);

        if (wordFound && !foundWords.includes(wordFound)) {
            setFoundWords(prev => [...prev, wordFound]);
            if (foundWords.length + 1 === dailyWords.length) {
                // Completed!
                setLastPlayed(today);
                localStorage.setItem('dailyChallengeLastPlayed', today);
                
                // Add stars
                const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || '{}');
                const currentStars = verseMemoryProgress.stars || 0;
                verseMemoryProgress.stars = currentStars + BONUS_STARS;
                localStorage.setItem('verseMemoryProgress', JSON.stringify(verseMemoryProgress));
            }
        }
        setSelection(null);
    };

    if (!isClient) return <div>Loading...</div>;

    if (isCompletedToday) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                               <CheckCircle className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-3xl">Challenge Complete!</CardTitle>
                            <CardDescription>You earned {BONUS_STARS} stars!</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="flex items-center justify-center gap-2 text-muted-foreground"><Clock className="w-5 h-5"/> Come back tomorrow for a new puzzle.</p>
                        </CardContent>
                    </Card>
                 </motion.div>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="font-headline text-3xl font-bold">Daily Word Search</h1>
                <p className="text-muted-foreground">Find the hidden Bible character names to earn bonus stars!</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <Card className="flex-grow">
                    <CardContent className="p-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                        <div className="grid grid-cols-12 gap-1 bg-muted/50 p-2 rounded-lg aspect-square select-none">
                            {grid.map((row, y) => 
                                row.map((letter, x) => {
                                    const isSelected = selectedCells.some(cell => cell.x === x && cell.y === y);
                                    return (
                                        <div
                                            key={`${x}-${y}`}
                                            onMouseDown={() => handleMouseDown(x, y)}
                                            onMouseOver={() => handleMouseOver(x, y)}
                                            className={cn(
                                                "flex items-center justify-center w-full aspect-square rounded-md text-lg font-bold uppercase cursor-pointer transition-colors",
                                                isSelected ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                                            )}
                                        >
                                            {letter}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-full md:w-64 shrink-0">
                    <CardHeader>
                        <CardTitle className="font-headline">Words to Find</CardTitle>
                        <CardDescription>Find all {dailyWords.length} names.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                           {dailyWords.map(word => (
                                <li key={word} className={cn("text-lg font-medium transition-all", foundWords.includes(word) && "line-through text-muted-foreground")}>
                                    {word}
                                </li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
