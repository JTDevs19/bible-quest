
export interface WordSearchLevel {
    stage: number;
    round: number;
    title: string;
    words: string[];
}

export const wordSearchLevels: WordSearchLevel[] = [
    // Stage 1: Easy
    { stage: 1, round: 1, title: 'The Creation', words: ['ADAM', 'EVE', 'GARDEN', 'EDEN', 'TREE', 'LIGHT', 'DAY', 'NIGHT'] },
    { stage: 1, round: 2, title: 'Noah and the Ark', words: ['NOAH', 'ARK', 'FLOOD', 'RAIN', 'DOVE', 'ANIMALS', 'BOAT'] },
    { stage: 1, round: 3, title: 'Patriarchs', words: ['ABRAHAM', 'ISAAC', 'JACOB', 'SARAH', 'FAITH', 'NATION'] },
    { stage: 1, round: 4, title: 'Joseph in Egypt', words: ['JOSEPH', 'COAT', 'DREAM', 'EGYPT', 'FAMINE', 'BROTHERS'] },
    { stage: 1, round: 5, title: 'Moses and Exodus', words: ['MOSES', 'BUSH', 'PLAGUE', 'SEA', 'LAW', 'TEN'] },
    // Will add more rounds and stages later
];
