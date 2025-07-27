export enum ChallengeType {
    WordSearch = 'Word Search',
    Riddle = 'Riddle',
    Trivia = 'Trivia',
    Jumble = 'Jumble',
}

export interface Challenge {
    type: ChallengeType;
    description: string;
    data: any;
}

export const dailyChallenges: Challenge[] = [
    // Day 1
    {
        type: ChallengeType.WordSearch,
        description: "Find the names of the 12 disciples.",
        data: { words: ["PETER", "ANDREW", "JAMES", "JOHN", "PHILIP", "BARTHOLOMEW", "THOMAS", "MATTHEW", "THADDAEUS", "SIMON", "JUDAS", "JAMES"] }
    },
    // Day 2
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I was a shepherd boy who became a king. I defeated a giant with a sling and a stone. Who am I?", answer: "David" }
    },
    // Day 3
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge on the book of Genesis.",
        data: {
            question: "Who was the first man created by God?",
            options: ["Moses", "Adam", "Noah", "Abraham"],
            answer: "Adam"
        }
    },
    // Day 4
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find a book of the Bible.",
        data: { jumbled: "ENESISG", answer: "GENESIS", hint: "The first book of the Bible." }
    },
    // Day 5
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I built an ark to save my family and the animals from a great flood. Who am I?", answer: "Noah" }
    },
    // Day 6
    {
        type: ChallengeType.WordSearch,
        description: "Find the fruits of the Spirit.",
        data: { words: ["LOVE", "JOY", "PEACE", "PATIENCE", "KINDNESS", "GOODNESS", "FAITHFULNESS", "GENTLENESS", "SELFCONTROL"] }
    },
    // Day 7
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge of the Exodus story.",
        data: {
            question: "How many plagues did God send on Egypt?",
            options: ["7", "12", "10", "3"],
            answer: "10"
        }
    },
     // Day 8
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find a well-known prophet.",
        data: { jumbled: "HIAJEL", answer: "ELIJAH", hint: "He was taken to heaven in a chariot of fire." }
    },
    // Day 9
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I was sold into slavery by my brothers but became a great ruler in Egypt. Who am I?", answer: "Joseph" }
    },
    // Day 10
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge about Jesus's miracles.",
        data: {
            question: "How many loaves and fish did Jesus use to feed the 5,000?",
            options: ["7 loaves and 2 fish", "2 loaves and 5 fish", "5 loaves and 2 fish", "10 loaves and 10 fish"],
            answer: "5 loaves and 2 fish"
        }
    },
    // Day 11
    {
        type: ChallengeType.WordSearch,
        description: "Find characters from the book of Ruth.",
        data: { words: ["RUTH", "NAOMI", "BOAZ", "ORPAH", "BETHLEHEM", "MOAB"] }
    },
    // Day 12
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find the city where Jesus was born.",
        data: { jumbled: "HMEBELHTE", answer: "BETHLEHEM", hint: "Also known as the City of David." }
    },
    // Day 13
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I parted the Red Sea and led the Israelites out of Egypt. Who am I?", answer: "Moses" }
    },
    // Day 14
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge about the Apostle Paul.",
        data: {
            question: "What was Paul's original name?",
            options: ["Saul", "Peter", "Silas", "Timothy"],
            answer: "Saul"
        }
    },
    // Day 15
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find a book of prophecy.",
        data: { jumbled: "HASIAI", answer: "ISAIAH", hint: "Contains many prophecies about the coming Messiah." }
    },
     // Day 16
    {
        type: ChallengeType.WordSearch,
        description: "Find places mentioned in the New Testament.",
        data: { words: ["JERUSALEM", "GALILEE", "NAZARETH", "CAPERNAUM", "BETHANY", "JUDEA", "EPHESUS", "ROME"] }
    },
    // Day 17
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I am a collection of 66 books, telling one unified story of God's love. What am I?", answer: "The Bible" }
    },
    // Day 18
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge on the book of Daniel.",
        data: {
            question: "Who was thrown into the lion's den?",
            options: ["David", "Daniel", "Samson", "Shadrach"],
            answer: "Daniel"
        }
    },
    // Day 19
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find a disciple.",
        data: { jumbled: "TREPE", answer: "PETER", hint: "He denied Jesus three times." }
    },
    // Day 20
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "My strength was in my long hair. A woman betrayed my secret. Who am I?", answer: "Samson" }
    },
    // Day 21
    {
        type: ChallengeType.WordSearch,
        description: "Find the items in the Armor of God.",
        data: { words: ["BELT", "TRUTH", "BREASTPLATE", "RIGHTEOUSNESS", "SHOES", "GOSPEL", "SHIELD", "FAITH", "HELMET", "SALVATION", "SWORD", "SPIRIT"] }
    },
    // Day 22
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge about King Solomon.",
        data: {
            question: "What was King Solomon most famous for?",
            options: ["Strength", "Wisdom", "Bravery", "Wealth"],
            answer: "Wisdom"
        }
    },
     // Day 23
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find the garden where Adam and Eve lived.",
        data: { jumbled: "NEDE", answer: "EDEN", hint: "A paradise with two special trees." }
    },
    // Day 24
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I was swallowed by a great fish for disobeying God. Who am I?", answer: "Jonah" }
    },
    // Day 25
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge of the Gospels.",
        data: {
            question: "Which of these is NOT one of the four Gospels?",
            options: ["Matthew", "Acts", "Luke", "John"],
            answer: "Acts"
        }
    },
    // Day 26
    {
        type: ChallengeType.WordSearch,
        description: "Find some of the kings of Israel.",
        data: { words: ["SAUL", "DAVID", "SOLOMON", "REHOBOAM", "JEROBOAM", "AHAB", "JEHOSHAPHAT", "HEZEKIAH", "JOSIAH"] }
    },
    // Day 27
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find the location of the Ten Commandments.",
        data: { jumbled: "AINIS", answer: "SINAI", hint: "Moses received the law on this mountain." }
    },
    // Day 28
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I am the disciple who doubted Jesus' resurrection until I saw his wounds. Who am I?", answer: "Thomas" }
    },
    // Day 29
    {
        type: ChallengeType.Trivia,
        description: "Test your knowledge on the early church.",
        data: {
            question: "On what day did the Holy Spirit descend on the apostles?",
            options: ["Passover", "Pentecost", "Sabbath", "Easter"],
            answer: "Pentecost"
        }
    },
    // Day 30
    {
        type: ChallengeType.Jumble,
        description: "Unscramble the letters to find the last book of the Bible.",
        data: { jumbled: "EVLERATION", answer: "REVELATION", hint: "It describes the end times and the new heaven and earth." }
    },
    // Day 31
    {
        type: ChallengeType.Riddle,
        description: "Guess the person or object from the riddle.",
        data: { riddle: "I was the first woman, created from the rib of the first man. Who am I?", answer: "Eve" }
    },
];
