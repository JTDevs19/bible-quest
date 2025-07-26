
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, XCircle, BrainCircuit, RotateCcw, Lock, PlayCircle, Map, Trophy, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const triviaLevels = [
  // Level 1
  [
    { question: "Who was known for his incredible strength, which was tied to his long hair?", options: ["David", "Goliath", "Samson", "Gideon"], answer: "Samson" },
    { question: "Who was swallowed by a great fish after disobeying God?", options: ["Jonah", "Daniel", "Elijah", "Peter"], answer: "Jonah" },
    { question: "Who led the Israelites out of slavery in Egypt?", options: ["Joshua", "Abraham", "Moses", "Jacob"], answer: "Moses" },
    { question: "Who was the courageous queen who saved her people from a plot of destruction?", options: ["Ruth", "Esther", "Mary", "Deborah"], answer: "Esther" },
    { question: "Who was the first king of Israel?", options: ["David", "Solomon", "Saul", "Samuel"], answer: "Saul" },
    { question: "This disciple denied Jesus three times before the rooster crowed.", options: ["Judas", "John", "Thomas", "Peter"], answer: "Peter" },
    { question: "Who was thrown into a den of lions but was protected by God?", options: ["Daniel", "Joseph", "Jeremiah", "Shadrach"], answer: "Daniel" },
    { question: "Who was the father of the twelve tribes of Israel?", options: ["Isaac", "Abraham", "Jacob", "Joseph"], answer: "Jacob" },
    { question: "Who was David's best friend and the son of King Saul?", options: ["Joab", "Jonathan", "Absalom", "Nathan"], answer: "Jonathan" },
    { question: "Who was a prophetess and the only female judge of Israel mentioned in the Bible?", options: ["Jael", "Miriam", "Huldah", "Deborah"], answer: "Deborah" },
  ],
  // Level 2
  [
    { question: "Who was the prophet that confronted King David after his sin with Bathsheba?", options: ["Elijah", "Isaiah", "Nathan", "Samuel"], answer: "Nathan" },
    { question: "Who was the mother of John the Baptist?", options: ["Mary", "Elizabeth", "Anna", "Sarah"], answer: "Elizabeth" },
    { question: "Who was sold into slavery by his brothers but became a powerful ruler in Egypt?", options: ["Esau", "Joseph", "Benjamin", "Reuben"], answer: "Joseph" },
    { question: "Who was the tax collector that Jesus called to be one of His disciples?", options: ["Zacchaeus", "Nicodemus", "Matthew", "Bartholomew"], answer: "Matthew" },
    { question: "Who was the first Christian martyr?", options: ["Paul", "Peter", "Stephen", "James"], answer: "Stephen" },
    { question: "Who was the wife of Isaac and mother of Jacob and Esau?", options: ["Leah", "Rachel", "Rebekah", "Sarai"], answer: "Rebekah" },
    { question: "Who led the Israelites in the battle of Jericho?", options: ["Moses", "Gideon", "Joshua", "Caleb"], answer: "Joshua" },
    { question: "Who was the prophet taken up to heaven in a chariot of fire?", options: ["Elisha", "Elijah", "Enoch", "Isaiah"], answer: "Elijah" },
    { question: "Who anointed both Saul and David as kings of Israel?", options: ["Nathan", "Samuel", "Eli", "Ahijah"], answer: "Samuel" },
    { question: "Who was the apostle that replaced Judas Iscariot?", options: ["Barnabas", "Silas", "Timothy", "Matthias"], answer: "Matthias" },
  ],
  // Level 3
  [
    { question: "Who was the cupbearer to the Persian king Artaxerxes and helped rebuild Jerusalem's walls?", options: ["Ezra", "Zerubbabel", "Nehemiah", "Haggai"], answer: "Nehemiah" },
    { question: "Who was the high priest of Jerusalem when Jesus was crucified?", options: ["Annas", "Caiaphas", "Eli", "Phinehas"], answer: "Caiaphas" },
    { question: "Who was the wealthy Pharisee who helped bury Jesus?", options: ["Nicodemus", "Joseph of Arimathea", "Simon the Cyrene", "Lazarus"], answer: "Joseph of Arimathea" },
    { question: "Who was the left-handed judge who delivered Israel from the Moabites?", options: ["Othniel", "Ehud", "Shamgar", "Gideon"], answer: "Ehud" },
    { question: "Who was the wife of Uriah the Hittite, with whom David committed adultery?", options: ["Michal", "Abigail", "Bathsheba", "Tamar"], answer: "Bathsheba" },
    { question: "Who was the prophetess who recognized the infant Jesus as the Messiah in the Temple?", options: ["Elizabeth", "Anna", "Phoebe", "Priscilla"], answer: "Anna" },
    { question: "Who was the sorcerer in Samaria who tried to buy the power of the Holy Spirit?", options: ["Elymas", "Bar-Jesus", "Simon Magus", "Sceva"], answer: "Simon Magus" },
    { question: "Who was Abraham's nephew, who chose to live in the city of Sodom?", options: ["Lot", "Laban", "Haran", "Nahor"], answer: "Lot" },
    { question: "Who was the successor of the prophet Elijah?", options: ["Elisha", "Hosea", "Amos", "Obadiah"], answer: "Elisha" },
    { question: "Who was the first Gentile convert to Christianity recorded in the book of Acts?", options: ["The Ethiopian Eunuch", "Cornelius", "Lydia", "Sergius Paulus"], answer: "Cornelius" },
  ],
    // Level 4
  [
    { question: "Who was the king of Judah known for his radical religious reforms and repentance?", options: ["Hezekiah", "Josiah", "Uzziah", "Manasseh"], answer: "Josiah" },
    { question: "Who was the runaway slave whom Paul sent back to his master, Philemon?", options: ["Tychicus", "Epaphras", "Onesimus", "Archippus"], answer: "Onesimus" },
    { question: "Who was the firstborn son of Jacob, who forfeited his birthright?", options: ["Simeon", "Levi", "Judah", "Reuben"], answer: "Reuben" },
    { question: "Who was the prophet commanded by God to marry a prostitute as a symbol of Israel's unfaithfulness?", options: ["Jeremiah", "Hosea", "Ezekiel", "Amos"], answer: "Hosea" },
    { question: "Who was the artisan, filled with the Spirit of God, who oversaw the construction of the Tabernacle?", options: ["Oholiab", "Huram-abi", "Bezalel", "Hiram of Tyre"], answer: "Bezalel" },
    { question: "Who was the Roman governor who presided over the trial of Jesus?", options: ["Herod Antipas", "Felix", "Festus", "Pontius Pilate"], answer: "Pontius Pilate" },
    { question: "Who was the mother of King Solomon?", options: ["Haggith", "Bathsheba", "Abishag", "Michal"], answer: "Bathsheba" },
    { question: "Who was the man who had to be convinced of Jesus' resurrection by touching His wounds?", options: ["Philip", "Andrew", "Thomas", "Bartholomew"], answer: "Thomas" },
    { question: "Who was the captain of the Syrian army, cured of leprosy by Elisha?", options: ["Naaman", "Ben-Hadad", "Hazael", "Ziba"], answer: "Naaman" },
    { question: "Who was the seller of purple cloth from Thyatira who became a believer in Philippi?", options: ["Dorcas", "Chloe", "Lydia", "Phoebe"], answer: "Lydia" },
  ],
  // Level 5
  [
    { question: "Who was the grandfather of King David?", options: ["Jesse", "Boaz", "Obed", "Salmon"], answer: "Obed" },
    { question: "Who was the priest and king of Salem who met Abraham with bread and wine?", options: ["Melchizedek", "Jethro", "Adonizedek", "Abimelech"], answer: "Melchizedek" },
    { question: "Who was the prophet who saw a vision of a valley of dry bones coming to life?", options: ["Isaiah", "Jeremiah", "Ezekiel", "Daniel"], answer: "Ezekiel" },
    { question: "Who was the wicked queen of Israel, wife of Ahab, who promoted the worship of Baal?", options: ["Jezebel", "Athaliah", "Herodias", "Delilah"], answer: "Jezebel" },
    { question: "Who was the Jewish official in the Persian court who foiled Haman's plot to kill the Jews?", options: ["Daniel", "Nehemiah", "Ezra", "Mordecai"], answer: "Mordecai" },
    { question: "Who was the son of Jonathan, who was lame in his feet and shown kindness by David?", options: ["Mephibosheth", "Ish-Bosheth", "Adonijah", "Amnon"], answer: "Mephibosheth" },
    { question: "Who were the couple who lied to the Holy Spirit about the sale of their property and died as a result?", options: ["Aquila and Priscilla", "Ananias and Sapphira", "Philemon and Apphia", "Andronicus and Junia"], answer: "Ananias and Sapphira" },
    { question: "Who was the second king of the northern kingdom of Israel, known for the phrase 'the sins of... who caused Israel to sin'?", options: ["Ahab", "Omri", "Jeroboam", "Baasha"], answer: "Jeroboam" },
    { question: "Who was the prophet from Tekoa who was a shepherd and a tender of sycamore-fig trees?", options: ["Micah", "Hosea", "Joel", "Amos"], answer: "Amos" },
    { question: "Who was Paul's 'true son in the faith' to whom he wrote two epistles?", options: ["Titus", "Timothy", "Silas", "Luke"], answer: "Timothy" },
  ]
];

const triviaLevelsFilipino = [
  // Level 1
  [
    { question: "Sino ang kilala sa kanyang pambihirang lakas na nakatali sa kanyang mahabang buhok?", options: ["David", "Goliath", "Samson", "Gideon"], answer: "Samson" },
    { question: "Sino ang nilamon ng malaking isda matapos sumuway sa Diyos?", options: ["Jonas", "Daniel", "Elias", "Pedro"], answer: "Jonas" },
    { question: "Sino ang namuno sa mga Israelita palabas sa pagkaalipin sa Ehipto?", options: ["Josue", "Abraham", "Moises", "Jacob"], answer: "Moises" },
    { question: "Sino ang matapang na reyna na nagligtas sa kanyang bayan mula sa isang masamang balak?", options: ["Ruth", "Esther", "Maria", "Debora"], answer: "Esther" },
    { question: "Sino ang unang hari ng Israel?", options: ["David", "Solomon", "Saul", "Samuel"], answer: "Saul" },
    { question: "Itinanggi ng disipulong ito si Jesus ng tatlong beses bago tumilaok ang manok.", options: ["Judas", "Juan", "Tomas", "Pedro"], answer: "Pedro" },
    { question: "Sino ang inihagis sa yungib ng mga leon ngunit pinrotektahan ng Diyos?", options: ["Daniel", "Jose", "Jeremias", "Sadrac"], answer: "Daniel" },
    { question: "Sino ang ama ng labindalawang tribo ng Israel?", options: ["Isaac", "Abraham", "Jacob", "Jose"], answer: "Jacob" },
    { question: "Sino ang matalik na kaibigan ni David at anak ni Haring Saul?", options: ["Joab", "Jonathan", "Absalom", "Nathan"], answer: "Jonathan" },
    { question: "Sino ang isang propetisa at ang tanging babaeng hukom ng Israel na nabanggit sa Bibliya?", options: ["Jael", "Miriam", "Hulda", "Debora"], answer: "Debora" },
  ],
  // Level 2
  [
    { question: "Sino ang propeta na humarap kay Haring David matapos ang kanyang kasalanan kay Bathsheba?", options: ["Elias", "Isaias", "Nathan", "Samuel"], answer: "Nathan" },
    { question: "Sino ang ina ni Juan na Tagapagbautismo?", options: ["Maria", "Elisabet", "Ana", "Sara"], answer: "Elisabet" },
    { question: "Sino ang ipinagbili ng kanyang mga kapatid sa pagkaalipin ngunit naging makapangyarihang pinuno sa Ehipto?", options: ["Esau", "Jose", "Benjamin", "Reuben"], answer: "Jose" },
    { question: "Sino ang maniningil ng buwis na tinawag ni Jesus upang maging isa sa Kanyang mga alagad?", options: ["Zaqueo", "Nicodemo", "Mateo", "Bartolome"], answer: "Mateo" },
    { question: "Sino ang unang Kristiyanong martir?", options: ["Pablo", "Pedro", "Esteban", "Santiago"], answer: "Esteban" },
    { question: "Sino ang asawa ni Isaac at ina nina Jacob at Esau?", options: ["Leah", "Rachel", "Rebekah", "Sarai"], answer: "Rebekah" },
    { question: "Sino ang namuno sa mga Israelita sa labanan sa Jerico?", options: ["Moises", "Gideon", "Josue", "Caleb"], answer: "Josue" },
    { question: "Sino ang propeta na dinala sa langit sa isang karwaheng apoy?", options: ["Eliseo", "Elias", "Enoc", "Isaias"], answer: "Elias" },
    { question: "Sino ang nagpahid ng langis kina Saul at David bilang mga hari ng Israel?", options: ["Nathan", "Samuel", "Eli", "Ahias"], answer: "Samuel" },
    { question: "Sino ang apostol na pumalit kay Judas Iscariote?", options: ["Barnabas", "Silas", "Timoteo", "Matias"], answer: "Matias" },
  ],
  // Level 3
  [
    { question: "Sino ang tagahawak ng saro ng Persyanong hari na si Artaxerxes at tumulong sa muling pagtatayo ng mga pader ng Jerusalem?", options: ["Ezra", "Zerubbabel", "Nehemias", "Hagai"], answer: "Nehemias" },
    { question: "Sino ang punong saserdote ng Jerusalem noong ipinako si Jesus sa krus?", options: ["Anas", "Caifas", "Eli", "Finehas"], answer: "Caifas" },
    { question: "Sino ang mayamang Pariseo na tumulong sa paglilibing kay Jesus?", options: ["Nicodemo", "Jose ng Arimatea", "Simon na Cyrene", "Lazaro"], answer: "Jose ng Arimatea" },
    { question: "Sino ang kaliweteng hukom na nagligtas sa Israel mula sa mga Moabita?", options: ["Otniel", "Ehud", "Samgar", "Gideon"], answer: "Ehud" },
    { question: "Sino ang asawa ni Urias na Heteo, na kung kanino nakiapid si David?", options: ["Mical", "Abigail", "Bathsheba", "Tamar"], answer: "Bathsheba" },
    { question: "Sino ang propetisa na kumilala sa sanggol na si Jesus bilang Mesiyas sa Templo?", options: ["Elisabet", "Ana", "Febe", "Priscila"], answer: "Ana" },
    { question: "Sino ang mangkukulam sa Samaria na sinubukang bilhin ang kapangyarihan ng Banal na Espiritu?", options: ["Elimas", "Bar-Jesus", "Simon ang Mago", "Sceva"], answer: "Simon ang Mago" },
    { question: "Sino ang pamangkin ni Abraham, na piniling manirahan sa lungsod ng Sodoma?", options: ["Lot", "Laban", "Haran", "Nahor"], answer: "Lot" },
    { question: "Sino ang kahalili ng propetang si Elias?", options: ["Eliseo", "Oseas", "Amos", "Obadias"], answer: "Eliseo" },
    { question: "Sino ang unang Hentil na nagbalik-loob sa Kristiyanismo na naitala sa aklat ng Mga Gawa?", options: ["Ang Bating na taga-Etiopia", "Cornelio", "Lidia", "Sergio Paulo"], answer: "Cornelio" },
  ],
  // Level 4
  [
    { question: "Sino ang hari ng Juda na kilala sa kanyang radikal na mga repormang panrelihiyon at pagsisisi?", options: ["Hezekias", "Josias", "Uzias", "Manases"], answer: "Josias" },
    { question: "Sino ang tumakas na alipin na ipinabalik ni Pablo sa kanyang amo na si Filemon?", options: ["Tiquico", "Epafras", "Onesimo", "Arquito"], answer: "Onesimo" },
    { question: "Sino ang panganay na anak ni Jacob, na tinalikuran ang kanyang karapatan sa pagkapanganay?", options: ["Simeon", "Levi", "Juda", "Reuben"], answer: "Reuben" },
    { question: "Sino ang propeta na inutusan ng Diyos na pakasalan ang isang patutot bilang simbolo ng kataksilan ng Israel?", options: ["Jeremias", "Oseas", "Ezekiel", "Amos"], answer: "Oseas" },
    { question: "Sino ang manggagawa, na puno ng Espiritu ng Diyos, na nangasiwa sa pagtatayo ng Tabernakulo?", options: ["Oholiab", "Huram-abi", "Bezalel", "Hiram ng Tiro"], answer: "Bezalel" },
    { question: "Sino ang Romanong gobernador na namuno sa paglilitis kay Jesus?", options: ["Herodes Antipas", "Felix", "Festus", "Poncio Pilato"], answer: "Poncio Pilato" },
    { question: "Sino ang ina ni Haring Solomon?", options: ["Hagit", "Bathsheba", "Abisag", "Mical"], answer: "Bathsheba" },
    { question: "Sino ang lalaki na kailangang makumbinsi sa muling pagkabuhay ni Jesus sa pamamagitan ng paghawak sa Kanyang mga sugat?", options: ["Felipe", "Andres", "Tomas", "Bartolome"], answer: "Tomas" },
    { question: "Sino ang kapitan ng hukbong Siria, na pinagaling sa ketong ni Eliseo?", options: ["Naaman", "Ben-Hadad", "Hazael", "Ziba"], answer: "Naaman" },
    { question: "Sino ang nagtitinda ng telang purpura mula sa Tiatira na naging mananampalataya sa Filipos?", options: ["Dorcas", "Chloe", "Lidia", "Febe"], answer: "Lidia" },
  ],
  // Level 5
  [
    { question: "Sino ang lolo ni Haring David?", options: ["Jesse", "Boaz", "Obed", "Salmon"], answer: "Obed" },
    { question: "Sino ang pari at hari ng Salem na sumalubong kay Abraham na may dalang tinapay at alak?", options: ["Melquisedec", "Jetro", "Adonizedec", "Abimelec"], answer: "Melquisedec" },
    { question: "Sino ang propeta na nakakita ng pangitain ng isang libis ng mga tuyong buto na nabuhay?", options: ["Isaias", "Jeremias", "Ezekiel", "Daniel"], answer: "Ezekiel" },
    { question: "Sino ang masamang reyna ng Israel, asawa ni Ahab, na nagtaguyod ng pagsamba kay Baal?", options: ["Jezebel", "Atalia", "Herodias", "Delila"], answer: "Jezebel" },
    { question: "Sino ang opisyal na Hudyo sa korte ng Persia na humadlang sa balak ni Haman na patayin ang mga Hudyo?", options: ["Daniel", "Nehemias", "Ezra", "Mordecai"], answer: "Mordecai" },
    { question: "Sino ang anak ni Jonathan, na pilay ang mga paa at pinakitaan ng kabutihan ni David?", options: ["Mefiboset", "Is-boset", "Adonias", "Amnon"], answer: "Mefiboset" },
    { question: "Sino ang mag-asawang nagsinungaling sa Banal na Espiritu tungkol sa pagbebenta ng kanilang ari-arian at namatay bilang resulta?", options: ["Aquila at Priscila", "Ananias at Safira", "Filemon at Apia", "Andronico at Junia"], answer: "Ananias at Safira" },
    { question: "Sino ang ikalawang hari ng hilagang kaharian ng Israel, na kilala sa pariralang 'ang mga kasalanan ni... na nagdulot ng pagkakasala sa Israel'?", options: ["Ahab", "Omri", "Jeroboam", "Baasha"], answer: "Jeroboam" },
    { question: "Sino ang propeta mula sa Tekoa na isang pastol at tagapag-alaga ng mga puno ng sikomoro?", options: ["Mikas", "Oseas", "Joel", "Amos"], answer: "Amos" },
    { question: "Sino ang 'tunay na anak sa pananampalataya' ni Pablo na kung kanino siya sumulat ng dalawang sulat?", options: ["Tito", "Timoteo", "Silas", "Lucas"], answer: "Timoteo" },
  ]
];

const LEVEL_PASS_SCORE = 7;
const MAX_LEVEL = 5;

type LevelScores = { [level: number]: number };

export default function CharacterAdventuresPage() {
    const [isClient, setIsClient] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [levelScores, setLevelScores] = useState<LevelScores>({});
    const [totalScore, setTotalScore] = useState(0);
    const [language, setLanguage] = useState<'en' | 'fil'>('en');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentLevelScore, setCurrentLevelScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    
    // Load progress from localStorage
    useEffect(() => {
        setIsClient(true);
        const savedProgress = localStorage.getItem('characterAdventuresProgress');
        if (savedProgress) {
            const { scores, total } = JSON.parse(savedProgress);
            setLevelScores(scores);
            setTotalScore(total);
            
            // Determine the highest unlocked level
            let highestUnlocked = 1;
            for (let i = 1; i <= MAX_LEVEL; i++) {
                if(scores[i-1] >= LEVEL_PASS_SCORE) {
                    highestUnlocked = i + 1;
                } else {
                    break;
                }
            }
            setCurrentLevel(Math.min(highestUnlocked, MAX_LEVEL));
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = useCallback(() => {
        if (!isClient) return;
        const progress = {
            scores: levelScores,
            total: totalScore,
        };
        localStorage.setItem('characterAdventuresProgress', JSON.stringify(progress));
    }, [levelScores, totalScore, isClient]);

    useEffect(() => {
        saveProgress();
    }, [saveProgress]);

    const activeTriviaLevels = language === 'en' ? triviaLevels : triviaLevelsFilipino;
    const triviaQuestions = activeTriviaLevels[currentLevel - 1] || [];
    const currentQuestion = triviaQuestions[currentQuestionIndex];
    const englishQuestion = triviaLevels[currentLevel - 1]?.[currentQuestionIndex];


    const startLevel = (level: number) => {
        setCurrentLevel(level);
        setCurrentQuestionIndex(0);
        setCurrentLevelScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setIsGameFinished(false);
        setPopoverOpen(false);
    }
    
    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;

        setSelectedAnswer(option);
        setIsAnswered(true);

        const englishOptionIndex = currentQuestion.options.indexOf(option);
        const englishOption = triviaLevels[currentLevel - 1][currentQuestionIndex].options[englishOptionIndex];
        
        if (englishOption === englishQuestion.answer) {
            setCurrentLevelScore(prevScore => prevScore + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < triviaQuestions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
        } else {
            // Update scores after finishing a level
            const oldLevelScore = levelScores[currentLevel] || 0;
            if (currentLevelScore > oldLevelScore) {
                setLevelScores(prev => ({ ...prev, [currentLevel]: currentLevelScore }));
                setTotalScore(prev => prev - oldLevelScore + currentLevelScore);
            }
            setIsGameFinished(true);
        }
    };

    const handleRestart = () => {
        startLevel(currentLevel);
    };

    const handleLevelSelect = (level: number) => {
        const isUnlocked = level === 1 || (levelScores[level - 1] >= LEVEL_PASS_SCORE);
        if (isUnlocked) {
            startLevel(level);
        }
    }
    
    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'fil' : 'en');
    }

    const cardVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };
    
    if (!isClient) {
        return <div>Loading...</div>;
    }
    
    if (isGameFinished) {
        const canUnlockNext = currentLevel < MAX_LEVEL && currentLevelScore >= LEVEL_PASS_SCORE;
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
                 <motion.div initial="initial" animate="animate" variants={cardVariants}>
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                               <Trophy className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-3xl">Level {currentLevel} Complete!</CardTitle>
                            <CardDescription>You've completed the challenge.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xl font-semibold">Your Score:</p>
                            <p className="text-5xl font-bold text-primary">{currentLevelScore} / {triviaQuestions.length}</p>
                             {currentLevelScore < LEVEL_PASS_SCORE && <p className="text-destructive">You need {LEVEL_PASS_SCORE} points to unlock the next level. Try again!</p>}
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleRestart} size="lg" variant="outline">
                                    <RotateCcw className="mr-2"/>
                                    Play Again
                                </Button>
                                {canUnlockNext && (
                                    <Button onClick={() => startLevel(currentLevel + 1)} size="lg">
                                        Next Level
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                 </motion.div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Loading Level...</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        )
    }

  return (
    <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
            <h1 className="font-headline text-3xl font-bold">Bible Character Adventures</h1>
            <p className="text-muted-foreground">Test your knowledge with this character trivia!</p>
        </div>

        <div className="flex justify-between items-center mb-4 px-4 py-2 bg-muted rounded-lg">
             <div className="font-bold text-lg">Level {currentLevel}</div>
             <div className="text-center">
                <div className="font-bold text-lg">Score: {currentLevelScore}</div>
            </div>
            <div className='flex gap-2'>
              <Button variant="outline" size="icon" onClick={toggleLanguage}><Languages className="w-5 h-5"/></Button>
             <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon"><Map className="w-5 h-5"/></Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                        <div className="text-center">
                           <h4 className="font-medium leading-none font-headline">Adventure Map</h4>
                           <p className="text-sm text-muted-foreground">Complete levels to unlock the next!</p>
                        </div>
                        <div className="space-y-3">
                           {Array.from({length: MAX_LEVEL}).map((_, i) => {
                               const levelNum = i + 1;
                               const isUnlocked = levelNum === 1 || (levelScores[levelNum - 1] >= LEVEL_PASS_SCORE);
                               const isCurrent = levelNum === currentLevel;
                               return (
                                 <div 
                                    key={levelNum} 
                                    onClick={() => isUnlocked && handleLevelSelect(levelNum)}
                                    className={cn(
                                      "flex items-center gap-4 p-2 rounded-lg transition-colors", 
                                      isCurrent ? "bg-primary/10 border border-primary/20" : "",
                                      isUnlocked ? "cursor-pointer hover:bg-muted" : "opacity-50"
                                    )}
                                  >
                                    <div className={cn("p-2 rounded-full", isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                                      {isUnlocked ? <PlayCircle className="w-6 h-6"/> : <Lock className="w-6 h-6"/>}
                                    </div>
                                    <div>
                                        <p className="font-semibold">Level {levelNum}</p>
                                        <p className="text-sm text-muted-foreground">
                                           {isUnlocked ? `Best Score: ${levelScores[levelNum] || 0}/${triviaLevels[levelNum-1].length}` : `Locked`}
                                        </p>
                                    </div>
                                 </div>
                               )
                           })}
                        </div>
                    </div>
                  </PopoverContent>
               </Popover>
            </div>
        </div>
      
        <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestionIndex}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardDescription>Question {currentQuestionIndex + 1} of {triviaQuestions.length}</CardDescription>
                        <CardTitle className="font-headline text-2xl !mt-2">{currentQuestion.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentQuestion.options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                
                                // Logic to check correctness based on English answer
                                const englishOptionIndex = currentQuestion.options.indexOf(option);
                                const isCorrect = englishQuestion.options[englishOptionIndex] === englishQuestion.answer;
                                
                                return (
                                    <Button
                                        key={option}
                                        variant="outline"
                                        size="lg"
                                        className={cn(
                                            "justify-start p-6 h-auto text-base",
                                            isAnswered && isCorrect && "bg-green-100 border-green-400 text-green-800 hover:bg-green-200",
                                            isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-400 text-red-800 hover:bg-red-200",
                                            !isAnswered && "hover:bg-accent/50",
                                        )}
                                        onClick={() => handleAnswerSelect(option)}
                                        disabled={isAnswered}
                                    >
                                        {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 text-red-600"/>}
                                        {isAnswered && isCorrect && <CheckCircle className="mr-2 text-green-600"/>}
                                        {!isAnswered && <BrainCircuit className="mr-2 text-muted-foreground"/>}
                                        {option}
                                    </Button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col sm:flex-row items-center justify-between pt-4"
                            >
                                <p className={cn(
                                  "font-bold text-lg",
                                  selectedAnswer && currentQuestion.options.indexOf(selectedAnswer) >= 0 && englishQuestion.options[currentQuestion.options.indexOf(selectedAnswer)] === englishQuestion.answer ? "text-green-600" : "text-red-600"
                                )}>
                                    {selectedAnswer && currentQuestion.options.indexOf(selectedAnswer) >= 0 && englishQuestion.options[currentQuestion.options.indexOf(selectedAnswer)] === englishQuestion.answer
                                        ? (language === 'en' ? "Correct!" : "Tama!")
                                        : (language === 'en' ? `The correct answer is ${englishQuestion.answer}.` : `Ang tamang sagot ay ${triviaLevelsFilipino[currentLevel-1][currentQuestionIndex].options[triviaLevels[currentLevel-1][currentQuestionIndex].options.indexOf(englishQuestion.answer)]}.`)
                                    }
                                </p>
                                <Button onClick={handleNextQuestion} className="w-full sm:w-auto mt-2 sm:mt-0">
                                    {currentQuestionIndex < triviaQuestions.length - 1 ? (language === 'en' ? 'Next Question' : 'Susunod na Tanong') : (language === 'en' ? 'Finish Quiz' : 'Tapusin ang Pagsusulit')}
                                </Button>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    </div>
  );
}
