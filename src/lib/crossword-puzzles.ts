
export interface CrosswordEntry {
  clue: string;
  answer: string;
  orientation: 'across' | 'down';
  x: number; // 0-indexed from left
  y: number; // 0-indexed from top
}

export interface CrosswordLevel {
  level: number;
  title: string;
  theme: string;
  size: number; // Grid size (e.g., 10 for 10x10)
  entries: CrosswordEntry[];
}

type Cell = {
  char: string;
  number?: number;
  across?: number;
  down?: number;
};

type Grid = (Cell | null)[][];

export const generateGrid = (levelData: CrosswordLevel) => {
  const grid: Grid = Array(levelData.size).fill(null).map(() => Array(levelData.size).fill(null));
  const clues = { across: {} as Record<number, string>, down: {} as Record<number, string> };
  let clueNumber = 1;

  const numberPositions = new Map<string, number>();

  // Sort entries by position to ensure consistent numbering
  const sortedEntries = [...levelData.entries].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  // Assign clue numbers
  for (const entry of sortedEntries) {
    const posKey = `${entry.x},${entry.y}`;
    if (!numberPositions.has(posKey)) {
        numberPositions.set(posKey, clueNumber++);
    }
  }

  // Place words and clues
  for (const entry of sortedEntries) {
    const { answer, orientation, x, y, clue } = entry;
    const currentClueNumber = numberPositions.get(`${x},${y}`)!;

    if (orientation === 'across') {
      clues.across[currentClueNumber] = clue;
    } else {
      clues.down[currentClueNumber] = clue;
    }

    for (let i = 0; i < answer.length; i++) {
        const cellX = orientation === 'across' ? x + i : x;
        const cellY = orientation === 'down' ? y + i : y;
        
        // Ensure the cell object exists and assign the character
        if (!grid[cellY][cellX]) {
          grid[cellY][cellX] = { char: answer[i] };
        } else {
          grid[cellY][cellX]!.char = answer[i];
        }
        
        const cell = grid[cellY][cellX]!;

        // Assign the clue number to the first letter of the word
        if (i === 0) {
            cell.number = currentClueNumber;
        }

        // Assign the word's clue number to the cell for highlighting
        if (orientation === 'across') {
            cell.across = currentClueNumber;
        } else {
            cell.down = currentClueNumber;
        }
    }
  }

  return { grid, clues };
};


export const crosswordLevels: CrosswordLevel[] = [
  // Level 1: The Beginning
  {
    level: 1,
    title: 'Level 1: The Beginning',
    theme: 'Characters and places from the book of Genesis.',
    size: 10,
    entries: [
      { clue: 'First man', answer: 'ADAM', orientation: 'across', x: 0, y: 1 },
      { clue: 'Built an ark', answer: 'NOAH', orientation: 'across', x: 6, y: 1 },
      { clue: 'Adam\'s wife', answer: 'EVE', orientation: 'across', x: 0, y: 3 },
      { clue: 'Garden where it all started', answer: 'EDEN', orientation: 'across', x: 4, y: 5 },
      { clue: 'He was sold into slavery by his brothers', answer: 'JOSEPH', orientation: 'across', x: 2, y: 8 },
      { clue: 'First son of Adam and Eve', answer: 'CAIN', orientation: 'down', x: 8, y: 0 },
      { clue: 'Father of the faithful', answer: 'ABRAHAM', orientation: 'down', x: 2, y: 1 },
      { clue: 'Wife of Isaac', answer: 'REBEKAH', orientation: 'down', x: 4, y: 3 },
      { clue: 'He wrestled with an angel', answer: 'JACOB', orientation: 'down', x: 6, y: 5 },
    ]
  },
  // More levels can be added here
];
