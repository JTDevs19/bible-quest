

'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, RefreshCw, XCircle, Star, Lock, PlayCircle, Map, Trophy, ChevronLeft, ChevronRight, HelpCircle, GitCommitVertical, Check, Users, CheckCircle2, ChevronsUpDown, Puzzle, Feather, Clock, Eye, Key, Languages, Hammer } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const verses = [
  // Stage 1 Verses (20)
  {
    reference: 'John 3:16',
    reference_fil: 'Juan 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    text_fil: 'Sapagka\\'t gayon na lamang ang pagsinta ng Dios sa sanglibutan, na ibinigay niya ang kaniyang bugtong na Anak, upang ang sinomang sa kaniya\\'y sumampalataya ay huwag mapahamak, kundi magkaroon ng buhay na walang hanggan.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Proverbs 3:5-6',
    reference_fil: 'Mga Kawikaan 3:5-6',
    text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    text_fil: 'Tumiwala ka sa Panginoon ng buong puso mo, at huwag kang manalig sa iyong sariling kaunawaan. Sa lahat ng iyong mga lakad ay kilalanin mo siya, at kaniyang ituturo ang iyong mga landas.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Philippians 4:13',
    reference_fil: 'Mga Taga-Filipos 4:13',
    text: 'I can do all this through him who gives me strength.',
    text_fil: 'Lahat ng mga bagay ay aking magagawa doon sa nagpapalakas sa akin.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Romans 8:28',
    reference_fil: 'Mga Taga-Roma 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    text_fil: 'At nalalaman natin na ang lahat ng mga bagay ay nagkakalakip na gumagawa sa ikabubuti ng mga nagsisiibig sa Dios, sa makatuwid baga\\'y niyaong mga tinawag alinsunod sa kaniyang nais.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Jeremiah 29:11',
    reference_fil: 'Jeremias 29:11',
    text: 'For I know the plans I have for you,” declares the LORD, “plans to prosper you and not to harm you, plans to give you hope and a future.',
    text_fil: 'Sapagka\\'t nalalaman ko ang mga pag-iisip na aking iniisip sa inyo, sabi ng Panginoon, mga pag-iisip tungkol sa kapayapaan, at hindi tungkol sa kasamaan, upang bigyan kayo ng pag-asa sa inyong huling wakas.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Matthew 6:33',
    reference_fil: 'Mateo 6:33',
    text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    text_fil: 'Datapuwa\\'t hanapin muna ninyo ang kaniyang kaharian, at ang kaniyang katuwiran; at ang lahat ng mga bagay na ito ay pawang idaragdag sa inyo.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Galatians 5:22-23',
    reference_fil: 'Mga Taga-Galacia 5:22-23',
    text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.',
    text_fil: 'Datapuwa\\'t ang bunga ng Espiritu ay pagibig, katuwaan, kapayapaan, pagpapahinuhod, kagandahang-loob, kabutihan, pagtatapat, kaamuan, pagpipigil; laban sa mga gayong bagay ay walang kautusan.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Ephesians 2:8-9',
    reference_fil: 'Mga Taga-Efeso 2:8-9',
    text: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God— not by works, so that no one can boast.',
    text_fil: 'Sapagka\\'t sa biyaya kayo\\'y nangaligtas sa pamamagitan ng pananampalataya; at ito\\'y hindi sa inyong sarili, ito\\'y kaloob ng Dios; Hindi sa pamamagitan ng mga gawa, upang ang sinoman ay huwag magmapuri.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: '2 Timothy 3:16-17',
    reference_fil: '2 Timoteo 3:16-17',
    text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work.',
    text_fil: 'Ang lahat ng mga kasulatan na kinasihan ng Dios ay mapapakinabangan din naman sa pagtuturo, sa pagsansala, sa pagsaway, sa ikatututo na nasa katuwiran: Upang ang tao ng Dios ay maging sakdal, tinuruang lubos sa lahat ng mga gawang mabuti.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Psalm 23:1-2',
    reference_fil: 'Mga Awit 23:1-2',
    text: 'The LORD is my shepherd, I shall not be in want. He makes me lie down in green pastures, he leads me beside quiet waters,',
    text_fil: 'Ang Panginoon ay aking pastor; hindi ako mangangailangan. Kaniyang pinahihiga ako sa sariwang pastulan: pinapatnubayan niya ako sa siping ng mga tubig na pahingahan,',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Romans 3:23',
    reference_fil: 'Mga Taga-Roma 3:23',
    text: 'for all have sinned and fall short of the glory of God,',
    text_fil: 'Sapagka\\'t ang lahat ay nangagkasala nga, at hindi nangakaabot sa kaluwalhatian ng Dios;',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Romans 6:23',
    reference_fil: 'Mga Taga-Roma 6:23',
    text: 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.',
    text_fil: 'Sapagka\\'t ang kabayaran ng kasalanan ay kamatayan; datapuwa\\'t ang kaloob na walang bayad ng Dios ay buhay na walang hanggan kay Cristo Jesus na Panginoon natin.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'John 14:6',
    reference_fil: 'Juan 14:6',
    text: 'Jesus answered, “I am the way and the truth and the life. No one comes to the Father except through me.”',
    text_fil: 'Sinabi sa kaniya ni Jesus, Ako ang daan, at ang katotohanan, at ang buhay: sinoman ay di makaparoroon sa Ama, kundi sa pamamagitan ko.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Matthew 28:19-20',
    reference_fil: 'Mateo 28:19-20',
    text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.',
    text_fil: 'Dahil dito magsiyaon nga kayo, at gawin ninyong mga alagad ang lahat ng mga bansa, na sila\\'y inyong bautismuhan sa pangalan ng Ama at ng Anak at ng Espiritu Santo: Na ituro ninyo sa kanila na kanilang ganapin ang lahat ng mga bagay na iniutos ko sa inyo.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Hebrews 12:1-2',
    reference_fil: 'Mga Hebreo 12:1-2',
    text: 'Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.',
    text_fil: 'Kaya\\'t yamang napapalibutan tayo ng gayong kakapal na bilang ng mga saksi, itabi namang walang liwag ang bawa\\'t pasan, at ang kasalanang pumipigil sa atin, at ating takbuhing may pagtitiis ang takbuhing inilagay sa harapan natin, Na masdan natin si Jesus na gumawa at sumakdal ng ating pananampalataya,',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Joshua 1:9',
    reference_fil: 'Josue 1:9',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.',
    text_fil: 'Hindi ba kita inutusan? Ikaw ay magpakalakas at magpakatapang na mabuti; huwag kang matakot, ni manglupaypay: sapagka\\'t ang Panginoon mong Dios ay sumasaiyo saan ka man pumaroon.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Isaiah 40:31',
    reference_fil: 'Isaias 40:31',
    text: 'but those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    text_fil: 'Nguni\\'t silang nangaghihintay sa Panginoon ay mangagbabagong lakas; sila\\'y paiilanglang na may mga pakpak na parang mga agila; sila\\'y magsisitakbo, at hindi mangapapagod; sila\\'y magsisilakad, at hindi manganghihina.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Psalm 46:10',
    reference_fil: 'Mga Awit 46:10',
    text: 'He says, “Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.”',
    text_fil: 'Kayo\\'y magsitigil, at kilalanin ninyo na ako ang Dios: ako\\'y mabubunyi sa gitna ng mga bansa, ako\\'y mabubunyi sa lupa.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: '1 Peter 5:7',
    reference_fil: '1 Pedro 5:7',
    text: 'Cast all your anxiety on him because he cares for you.',
    text_fil: 'Na inyong ilagak sa kaniya ang lahat ng inyong kabalisahan, sapagka\\'t kayo\\'y ipinagmamalasakit niya.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Micah 6:8',
    reference_fil: 'Mikas 6:8',
    text: 'He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.',
    text_fil: 'Kaniyang ipinakilala sa iyo, Oh tao, kung ano ang mabuti; at ano ang hinihingi sa iyo ng Panginoon, kundi gumawa na may kaganapan, at ibigin ang kaawaan, at lumakad na may kababaan na kasama ng iyong Dios.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  // Stage 2 Verses (20 new verses)
  {
    reference: 'Genesis 1:1',
    reference_fil: 'Genesis 1:1',
    text: 'In the beginning God created the heavens and the earth.',
    text_fil: 'Nang pasimula ay nilikha ng Dios ang langit at ang lupa.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Psalm 119:105',
    reference_fil: 'Mga Awit 119:105',
    text: 'Your word is a lamp for my feet, a light on my path.',
    text_fil: 'Ang salita mo\\'y ilawan sa aking mga paa, at liwanag sa aking landas.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Isaiah 53:5',
    reference_fil: 'Isaias 53:5',
    text: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
    text_fil: 'Nguni\\'t siya\\'y nasugatan dahil sa ating mga pagsalangsang, siya\\'y nabugbog dahil sa ating mga kasamaan: ang parusa ng tungkol sa ating kapayapaan ay nasa kaniya; at sa pamamagitan ng kaniyang mga latay ay nagsigaling tayo.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'John 1:1',
    reference_fil: 'Juan 1:1',
    text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    text_fil: 'Nang pasimula siya ang Verbo, at ang Verbo ay sumasa Dios, at ang Verbo ay Dios.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Acts 1:8',
    reference_fil: 'Mga Gawa 1:8',
    text: 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.',
    text_fil: 'Datapuwa\\'t tatanggapin ninyo ang kapangyarihan, pagdating sa inyo ng Espiritu Santo: at kayo\\'y magiging mga saksi ko sa Jerusalem, at sa buong Judea at Samaria, at hanggang sa kahulihulihang hangganan ng lupa.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: '1 Corinthians 10:13',
    reference_fil: '1 Corinto 10:13',
    text: 'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.',
    text_fil: 'Hindi dumating sa inyo ang anomang tukso kundi yaong karaniwan sa tao: datapuwa\\'t tapat ang Dios, na hindi niya itutulot na kayo\\'y tuksuhin ng higit sa inyong makakaya; kundi kalakip din ng tukso ay gagawin naman ang paraan ng pagilag, upang ito\\'y inyong matiis.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Ephesians 6:11',
    reference_fil: 'Mga Taga-Efeso 6:11',
    text: 'Put on the full armor of God, so that you can take your stand against the devil’s schemes.',
    text_fil: 'Mangagbihis kayo ng buong kagayakan ng Dios, upang kayo\\'y magsitibay laban sa mga lalang ng diablo.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Hebrews 11:1',
    reference_fil: 'Mga Hebreo 11:1',
    text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    text_fil: 'Ngayon, ang pananampalataya ay siyang kapanatagan sa mga bagay na hinihintay, ang katunayan ng mga bagay na hindi nakikita.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'James 1:5',
    reference_fil: 'Santiago 1:5',
    text: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',
    text_fil: 'Nguni\\'t kung nagkukulang ng karunungan ang sinoman sa inyo, ay humingi sa Dios, na nagbibigay ng sagana sa lahat at hindi nanunumbat; at ito\\'y ibibigay sa kaniya.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Revelation 21:4',
    reference_fil: 'Pahayag 21:4',
    text: '‘He will wipe every tear from their eyes. There will be no more death’ or mourning or crying or pain, for the old order of things has passed away.',
    text_fil: 'At papahirin niya ang bawa\\'t luha sa kanilang mga mata; at hindi na magkakaroon ng kamatayan; hindi na magkakaroon pa ng dalamhati, o ng pananambitan man, o ng hirap pa man: ang mga bagay ng una ay naparam na.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Psalm 19:1',
    reference_fil: 'Mga Awit 19:1',
    text: 'The heavens declare the glory of God; the skies proclaim the work of his hands.',
    text_fil: 'Ang langit ay nagpapahayag ng kaluwalhatian ng Dios; at ipinakikilala ng kalawakan ang gawa ng kaniyang kamay.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Isaiah 9:6',
    reference_fil: 'Isaias 9:6',
    text: 'For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.',
    text_fil: 'Sapagka\\'t sa atin ay ipinanganak ang isang bata, sa atin ay ibinigay ang isang anak na lalake; at ang pamamahala ay maaatang sa kaniyang balikat: at ang kaniyang pangalan ay tatawaging Kamanghamangha, Tagapayo, Makapangyarihang Dios, Walang hanggang Ama, Pangulo ng Kapayapaan.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Matthew 11:28-30',
    reference_fil: 'Mateo 11:28-30',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.',
    text_fil: 'Magsiparito sa akin, kayong lahat na nangapapagal at nangabibigatang lubha, at kayo\\'y aking papagpapahingahin. Pasanin ninyo ang aking pamatok, at magaral kayo sa akin; sapagka\\'t ako\\'y maamo at mapagpakumbabang puso: at masusumpungan ninyo ang kapahingahan ng inyong mga kaluluwa. Sapagka\\'t malambot ang aking pamatok, at magaan ang aking pasan.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'John 15:5',
    reference_fil: 'Juan 15:5',
    text: 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.',
    text_fil: 'Ako ang puno ng ubas, kayo ang mga sanga: Ang nananatili sa akin, at ako\\'y sa kaniya, ay siyang nagbubunga ng marami: sapagka\\'t kung kayo\\'y hiwalay sa akin ay wala kayong magagawa.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Romans 10:9',
    reference_fil: 'Mga Taga-Roma 10:9',
    text: 'If you declare with your mouth, “Jesus is Lord,” and believe in your heart that God raised him from the dead, you will be saved.',
    text_fil: 'Sapagka\\'t kung ipahahayag mo ng iyong bibig si Jesus na Panginoon, at sasampalataya ka sa iyong puso na binuhay siyang maguli ng Dios sa mga patay, ay maliligtas ka.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Galatians 2:20',
    reference_fil: 'Mga Taga-Galacia 2:20',
    text: 'I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.',
    text_fil: 'Ako\\'y napako sa krus na kasama ni Cristo; at hindi na ako ang nabubuhay, kundi si Cristo ang nabubuhay sa akin: at ang buhay na ikinabubuhay ko ngayon sa laman ay ikinabubuhay ko sa pananampalataya, ang pananampalataya na ito\\'y sa Anak ng Dios, na sa akin ay umibig, at ibinigay ang kaniyang sarili dahil sa akin.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Philippians 2:3-4',
    reference_fil: 'Mga Taga-Filipos 2:3-4',
    text: 'Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.',
    text_fil: 'Huwag ninyong gawin ang anoman sa pagkakampi o sa pagpapalalo, kundi sa kababaan ng pagiisip, na ipalagay ng bawa\\'t isa ang iba na lalong mabuti kay sa kaniyang sarili; Huwag tingnan ng bawa\\'t isa sa inyo ang sa kaniyang sarili, kundi ang bawa\\'t isa naman ay sa mga iba.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Colossians 3:23',
    reference_fil: 'Mga Taga-Colosas 3:23',
    text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters,',
    text_fil: 'Anomang inyong ginagawa, ay inyong gawin ng buong puso, na gaya ng sa Panginoon, at hindi sa mga tao;',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: 'Hebrews 4:12',
    reference_fil: 'Mga Hebreo 4:12',
    text: 'For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.',
    text_fil: 'Sapagka\\'t ang salita ng Dios ay buhay, at mabisa, at matalas kay sa alin mang tabak na may dalawang talim, at bumabaon hanggang sa paghihiwalay ng kaluluwa at espiritu, ng mga kasukasuan at ng utak, at madaling kumilala ng mga pagiisip at mga haka ng puso.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  },
  {
    reference: '1 John 1:9',
    reference_fil: '1 Juan 1:9',
    text: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.',
    text_fil: 'Kung ipinahahayag natin ang ating mga kasalanan, ay tapat at banal siya na tayo\\'y patatawarin sa ating mga kasalanan, at tayo\\'y lilinisin sa lahat ng kalikuan.',
    version: 'NIV',
    version_fil: 'Ang Dating Biblia (1905)'
  }
];

type GameState = 'playing' | 'checking' | 'scored' | 'incorrect' | 'incomplete';
type VerseParts = (string | null)[];
type VerseScores = { [stage: number]: { [level: number]: { [verseIndex: number]: number } } };
type BonusStatus = 'completed' | 'attempted';
type BonusProgress = { [stage: number]: { [level: number]: BonusStatus } };


const VERSES_PER_STAGE = 20;
const LEVELS_PER_STAGE = 5;
const MAX_STAGES = 2;
const BONUS_ROUND_TIME = 180; // 3 minutes

// Bonus verses for each level in Stage 1, selected based on length
// Level 1: <10 words, Level 2: <=15, Level 3: <=20, Level 4: <=25, Level 5: >30
const stage1BonusVerseIndices = [
    2,  // Philippians 4:13 (9 words)
    5,  // Matthew 6:33 (15 words)
    12, // John 14:6 (18 words)
    9,  // Psalm 23:1-2 (21 words)
    8,  // 2 Timothy 3:16-17 (32 words)
]; 

const stage1BonusRewards = [10, 20, 30, 40, 50];


function VerseReview({ verse, verseWithBlanks, userInputs, missingWords, showCorrectAnswer = false, language }: { 
    verse: typeof verses[number], 
    verseWithBlanks: VerseParts, 
    userInputs: string[], 
    missingWords: string[], 
    showCorrectAnswer?: boolean,
    language: 'en' | 'fil'
}) {
  let blankCounter = 0;
  
  const verseText = language === 'en' ? verse.text : verse.text_fil;
  const verseRef = language === 'en' ? verse.reference : verse.reference_fil;

  const originalWordsWithPunctuation = useMemo(() => {
      return verseText.split(/(\\s+|[.,;!?“”"])/).filter(p => p.length > 0);
  }, [verseText]);

  const reviewContent = useMemo(() => {
      let wordComponentIndex = 0;
      return verseWithBlanks.map((part, index) => {
          if (part === null) {
              const currentBlankIndex = blankCounter;
              blankCounter++;
              
              const correctWord = missingWords[currentBlankIndex];
              if (!correctWord) return null;


              let correctWordWithPunctuation = correctWord;
              
              for (let i = wordComponentIndex; i < originalWordsWithPunctuation.length; i++) {
                  const word = originalWordsWithPunctuation[i];
                  const cleanWord = word.trim().toLowerCase().replace(/[.,;!?“”"]/g, '');
                  if (cleanWord === correctWord.toLowerCase()) {
                      correctWordWithPunctuation = word;
                      wordComponentIndex = i + 1;
                      break;
                  }
              }

              const userInput = userInputs[currentBlankIndex]?.trim() ?? '';
              const isCorrect = userInput.toLowerCase() === correctWord.toLowerCase();

              if (isCorrect) {
                  return <strong key={`review-blank-${index}`} className="text-green-600 dark:text-green-400">{correctWordWithPunctuation}</strong>;
              }

              return (
                  <span key={`review-blank-${index}`} className="inline-block text-center mx-1 relative -top-2">
                      {showCorrectAnswer && <span className="text-xs text-red-500 font-sans font-semibold block">{correctWordWithPunctuation}</span>}
                      <s className="text-red-500">{userInput || '...'}</s>
                  </span>
              );
          }
          
          let partFound = false;
          for (let i = wordComponentIndex; i < originalWordsWithPunctuation.length; i++) {
              if (originalWordsWithPunctuation[i] === part) {
                  wordComponentIndex = i + 1;
                  partFound = true;
                  break;
              }
          }
          return <span key={`review-text-${index}`}>{part}</span>;
      });
  }, [verseWithBlanks, missingWords, userInputs, showCorrectAnswer, originalWordsWithPunctuation]);

  return (
      <div className="text-center font-serif italic text-lg leading-relaxed">
          <p>{reviewContent}</p>
          <p className="text-center font-bold mt-2 text-base not-italic">- {verseRef}</p>
      </div>
  );
}


function VersePuzzle({ verse, onComplete, onBonusFail, initialTimer, viewOnly = false, language }: {
    verse: typeof verses[number];
    onComplete: (timeRemaining: number) => void;
    onBonusFail: () => void;
    initialTimer: number;
    viewOnly?: boolean;
    language: 'en' | 'fil';
}) {
    const [solution, setSolution] = useState<string[]>([]);
    const [shuffledWords, setShuffledWords] = useState<string[]>([]);
    const [status, setStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');
    const [timer, setTimer] = useState(initialTimer);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const verseText = language === 'en' ? verse.text : verse.text_fil;
    const originalWords = useMemo(() => verseText.replace(/[.,;!?“”"]/g, '').split(' ').filter(Boolean), [verseText]);

    const { playCorrectSound, playIncorrectSound } = useSoundEffects();

    useEffect(() => {
        if (viewOnly) {
            setSolution(originalWords);
            setShuffledWords([]);
            setStatus('correct');
            return;
        }

        let words = [...originalWords];
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }
        setShuffledWords(words);
        setSolution([]);
        setStatus('playing');
        setTimer(initialTimer);

        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    onBonusFail();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [verse, initialTimer, originalWords, viewOnly, onBonusFail]);


    const handleWordSelect = (word: string, index: number) => {
        setSolution([...solution, word]);
        setShuffledWords(shuffledWords.filter((_, i) => i !== index));
        setStatus('playing');
    };

    const handleSolutionWordSelect = (word: string, index: number) => {
        setShuffledWords([...shuffledWords, word]);
        setSolution(solution.filter((_, i) => i !== index));
        setStatus('playing');
    };
    
    const dragWord = useRef<number | null>(null);
    const dragOverWord = useRef<number | null>(null);

    const handleDragSort = () => {
        if (viewOnly || dragWord.current === null || dragOverWord.current === null) return;
        
        const solutionWords = [...solution];
        const [reorderedItem] = solutionWords.splice(dragWord.current, 1);
        solutionWords.splice(dragOverWord.current, 0, reorderedItem);
        
        dragWord.current = null;
        dragOverWord.current = null;
        
        setSolution(solutionWords);
        setStatus('playing');
    };

    const checkAnswer = () => {
        if (solution.join(' ') === originalWords.join(' ')) {
            setStatus('correct');
            playCorrectSound();
            if(timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => onComplete(timer), 1500);
        } else {
            setStatus('incorrect');
            playIncorrectSound();
        }
    };

    const handleTryAgain = () => {
        setShuffledWords([...shuffledWords, ...solution]);
        setSolution([]);
        setStatus('playing');
    }
    
    const puzzleTitle = language === 'fil' ? 'Buuin ang Talata' : 'Construct the Verse';
    const timerUpText = language === 'fil' ? 'Oras na!' : "Time's up!";
    const timerUpSubtext = language === 'fil' ? 'Subukan sa susunod na bonus round.' : "Better luck on the next level's bonus round.";
    const backButtonText = language === 'fil' ? 'Bumalik sa Laro' : 'Back to Game';

    if (!viewOnly && timer <= 0 && status !== 'correct') {
        return (
            <div className="text-center py-10">
                <p className="text-destructive font-bold text-2xl mb-4">{timerUpText}</p>
                <p>{timerUpSubtext}</p>
                <Button onClick={onBonusFail} className="mt-4">{backButtonText}</Button>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {!viewOnly && (
                 <div className="text-center font-bold text-primary text-xl flex items-center justify-center gap-2">
                    <Clock /> {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</div>
            )}
            
            <div className="p-4 border-2 border-dashed rounded-lg min-h-[120px] bg-muted/50 flex flex-wrap items-start content-start gap-2">
                {solution.length === 0 && !viewOnly && <p className="text-center text-muted-foreground p-8 w-full">{language === 'fil' ? 'I-click o i-drag ang mga salita mula sa word bank dito.' : 'Click or drag words from the word bank to build the verse here.'}</p>}
                {solution.map((word, index) => (
                    <motion.button
                        key={`${word}-${index}`}
                        onClick={() => status === 'playing' && !viewOnly && handleSolutionWordSelect(word, index)}
                        draggable={!viewOnly}
                        onDragStart={() => (dragWord.current = index)}
                        onDragEnter={() => (dragOverWord.current = index)}
                        onDragEnd={handleDragSort}
                        onDragOver={(e) => e.preventDefault()}
                        className={cn(
                            "p-2 rounded-lg font-medium",
                            status === 'playing' && !viewOnly && "cursor-move bg-primary/20 text-primary-foreground",
                            (status === 'correct' || viewOnly) && "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
                            status === 'incorrect' && "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 animate-shake"
                        )}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {word}
                    </motion.button>
                ))}
            </div>

            {!viewOnly && (
                <>
                    <div className="p-4 border-2 rounded-lg min-h-[120px] flex flex-wrap items-start content-start gap-2">
                        {shuffledWords.length === 0 && status !== 'correct' && <p className="text-center text-muted-foreground p-8 w-full">{language === 'fil' ? 'Lahat ng salita ay nagamit na. Suriin ang iyong sagot!' : 'All words used. Check your answer!'}</p>}
                        {status === 'correct' && <p className="text-center font-bold text-green-600 p-8 w-full">{language === 'fil' ? 'Perpektong nabuo ang talata!' : 'Verse constructed perfectly!'}</p>}
                        {shuffledWords.map((word, index) => (
                            <motion.button
                                key={`${word}-${index}`}
                                onClick={() => status === 'playing' && handleWordSelect(word, index)}
                                className="p-2 rounded-lg font-medium bg-secondary hover:bg-secondary/80 cursor-pointer"
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {word}
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {status === 'playing' && <Button onClick={checkAnswer} disabled={shuffledWords.length > 0}>{language === 'fil' ? 'Suriin ang Sagot' : 'Check My Answer'}</Button>}
                        {status === 'incorrect' && <Button variant="destructive" onClick={handleTryAgain}>{language === 'fil' ? 'Subukang Muli' : 'Try Again'}</Button>}
                        {status === 'correct' && (
                            <div className="text-green-600 font-bold flex flex-col items-center gap-2">
                                <p className="flex items-center gap-2"><CheckCircle/> {language === 'fil' ? 'Tapos na ang Bonus!' : 'Bonus Complete!'}</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}


export default function VerseMemoryPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [verseScores, setVerseScores] = useState<VerseScores>({});
  const [bonusProgress, setBonusProgress] = useState<BonusProgress>({});
  const { addExp, wisdomKeys, hints, setProgress, spendWisdomKeys, useHint: spendHint } = useUserProgress();
  const [gameMode, setGameMode] = useState<'fillInTheBlank' | 'puzzle'>('fillInTheBlank');
  const [language, setLanguage] = useState<'en' | 'fil'>('en');

  // Fill in the blank state
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [attemptScore, setAttemptScore] = useState(0);

  // Bonus round state
  const [activeBonusLevel, setActiveBonusLevel] = useState<number | null>(null);
  const [viewOnlyBonusLevel, setViewOnlyBonusLevel] = useState<number | null>(null);

  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [isVerseMastered, setIsVerseMastered] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState<null | 'current' | 'all'>(null);
  const [showNoHintsDialog, setShowNoHintsDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState<null | 'stage1' | 'stage2'>(null);
  const [showLevelCompleteDialog, setShowLevelCompleteDialog] = useState(false);
  
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { playCorrectSound, playIncorrectSound } = useSoundEffects();


  const [verseWithBlanks, setVerseWithBlanks] = useState<VerseParts>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  
  const findFirstUnfinishedVerse = (stage: number, level: number, scores: VerseScores) => {
    const levelScores = scores[stage]?.[level] || {};
    for (let i = 0; i < VERSES_PER_STAGE; i++) {
        if (!levelScores[i]) {
            return i;
        }
    }
    return 0; // Default to first verse if all are complete
  };

  const loadProgress = useCallback(() => {
    if (!isClient) return;
    const savedProgress = localStorage.getItem('verseMemoryProgress');
    const profileStr = localStorage.getItem('bibleQuestsUser');
    if (profileStr) {
        const profile = JSON.parse(profileStr);
        setLanguage(profile.language || 'en');
    }
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const loadedStage = progress.stage || 1;
      const loadedLevel = progress.level || 1;
      const loadedScores = progress.scores || {};
      
      setCurrentStage(loadedStage);
      setCurrentLevel(loadedLevel);
      setVerseScores(loadedScores);
      setBonusProgress(progress.bonusProgress || {});

      const firstUnfinished = findFirstUnfinishedVerse(loadedStage, loadedLevel, loadedScores);
      setCurrentVerseIndex(firstUnfinished);
    }
  }, [isClient]);

  const saveProgress = useCallback(() => {
    if (!isClient) return;
    const progress = {
      stage: currentStage,
      level: currentLevel,
      scores: verseScores,
      bonusProgress: bonusProgress,
    };
    localStorage.setItem('verseMemoryProgress', JSON.stringify(progress));
  }, [isClient, currentStage, currentLevel, verseScores, bonusProgress]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    saveProgress();
  }, [verseScores, bonusProgress, saveProgress]);

  useEffect(() => {
    if (highlightNextButton) {
      const timer = setTimeout(() => {
        setHighlightNextButton(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [highlightNextButton]);
  
  const resetAllProgress = () => {
    setCurrentStage(1);
    setCurrentLevel(1);
    setCurrentVerseIndex(0);
    setVerseScores({});
    setBonusProgress({});
    setProgress({ level: 1, exp: 0, wisdomKeys: 5, lastLevelUpExp: 0 });
    localStorage.removeItem('verseMemoryProgress');
    localStorage.removeItem('userProgress');
    setIsJourneyOpen(false);
    setShowResetConfirm(null);
    setupRound();
  };
  
  const resetCurrentLevelProgress = () => {
      const newScores = { ...verseScores };
      const newBonusProgress = { ...bonusProgress };

      const starsToSubtract = Object.values(newScores[currentStage]?.[currentLevel] || {}).reduce((sum: number, score: number) => sum + score, 0);
      let bonusExpToSubtract = 0;
      if (newBonusProgress[currentStage]?.[currentLevel] === 'completed') {
        // Note: This won't subtract the time bonus, only the base reward. This is a simplification.
        bonusExpToSubtract = stage1BonusRewards[currentLevel - 1] || 0;
      }
      addExp(-(starsToSubtract + bonusExpToSubtract));

      if(newScores[currentStage]?.[currentLevel]) {
        delete newScores[currentStage][currentLevel];
      }
      
       if(newBonusProgress[currentStage]?.[currentLevel]) {
        delete newBonusProgress[currentStage][currentLevel];
      }

      setVerseScores(newScores);
      setBonusProgress(newBonusProgress);
      setCurrentVerseIndex(0);
      setShowResetConfirm(null);
  };
  
  const handleMastery = (score: number) => {
    const oldScore = verseScores[currentStage]?.[currentLevel]?.[currentVerseIndex] ?? 0;
    
    if (score > oldScore) {
        const scoreDifference = score - oldScore;
        addExp(scoreDifference);
        
        setVerseScores(prevScores => {
            const newScores = JSON.parse(JSON.stringify(prevScores)); // Deep copy
            if (!newScores[currentStage]) {
                newScores[currentStage] = {};
            }
            if (!newScores[currentStage][currentLevel]) {
                newScores[currentStage][currentLevel] = {};
            }
            if (typeof newScores[currentStage][currentLevel] === 'number') {
                newScores[currentStage][currentLevel] = {};
            }
            newScores[currentStage][currentLevel][currentVerseIndex] = score;
            return newScores;
        });

        setIsVerseMastered(true);
        setHighlightNextButton(true);

        const updatedScores = JSON.parse(JSON.stringify(verseScores));
        if (!updatedScores[currentStage]) {
            updatedScores[currentStage] = {};
        }
        if (!updatedScores[currentStage][currentLevel]) {
            updatedScores[currentStage][currentLevel] = {};
        }
        if (typeof updatedScores[currentStage][currentLevel] === 'number') {
            updatedScores[currentStage][currentLevel] = {};
        }
        updatedScores[currentStage][currentLevel][currentVerseIndex] = score;


        if(!localStorage.getItem('stage1UnlockShown') && isStageComplete(1, updatedScores)) {
            setShowUnlockDialog('stage1');
            localStorage.setItem('stage1UnlockShown', 'true');
        }
        
        if(!localStorage.getItem('stage2UnlockShown') && isStageComplete(2, updatedScores)) {
            setShowUnlockDialog('stage2');
            localStorage.setItem('stage2UnlockShown', 'true');
        }

        toast({
            title: (
                <div className="flex items-center gap-2 font-headline">
                    <Trophy className="text-primary" />
                    {language === 'fil' ? 'Nakuha ang Puntos!' : 'Verse Attempt Scored!'}
                </div>
            ),
            description: (
                 <div className="flex items-center gap-2">
                    {language === 'fil' ? `Binabati kita! Nakakuha ka ng ${score} EXP!` : `Congratulations! You earned ${score} EXP!`}
                 </div>
            ),
        });
    }

    if (score > 0) {
        playCorrectSound();
    } else {
        playIncorrectSound();
    }
  };

  const setupRoundLogic = (verse: typeof verses[number], stage: number, level: number, scores: VerseScores, verseIdx: number, lang: 'en' | 'fil') => {
    const currentVerseScore = scores[stage]?.[level]?.[verseIdx] ?? 0;
    const isMastered = currentVerseScore > 0;
    setIsVerseMastered(isMastered);

    setGameState('playing');
    setEditingIndex(isMastered ? null : 0);
    setAttemptScore(0);
    setShowSummaryDialog(false);

    const verseText = lang === 'en' ? verse.text : verse.text_fil;

    if (isMastered || !verse) {
        setVerseWithBlanks(verse ? verseText.split(/(\\s+|[.,;!?“”"])/).filter(p => p.length > 0) : []);
        setMissingWords([]);
        setUserInputs([]);
    } else {
        const words = verseText.split(/(\\s+|[.,;!?“”"])/).filter(p => p.length > 0);
        const missing: string[] = [];
        const verseParts: VerseParts = [];
        
        const wordsToBlank = level;
        const potentialBlankIndices = words
            .map((word, index) => ({ word, index }))
            .filter(item => item.word.trim().length > 3 && /^[a-zA-Z]+$/.test(item.word.trim()))
            .map(item => item.index);
        
        const seedString = `${verse.reference}-${level}`;
        let h = 1779033703 ^ seedString.length;
        for (let i = 0; i < seedString.length; i++) {
            h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
            h = h << 13 | h >>> 19;
        }
        const pseudoRandom = () => {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return ((h ^= h >>> 16) >>> 0) / 4294967296;
        };

        const shuffled = [...potentialBlankIndices].sort(() => pseudoRandom() - 0.5);
        const blankIndices = new Set(shuffled.slice(0, wordsToBlank));

        words.forEach((word, index) => {
            if (blankIndices.has(index)) {
                missing.push(word.replace(/[.,;!?“”"]/g, ''));
                verseParts.push(null);
            } else {
                verseParts.push(word);
            }
        });

        setVerseWithBlanks(verseParts);
        setMissingWords(missing);
        setUserInputs(new Array(missing.length).fill(''));
    }
  }

  const setupRound = useCallback(() => {
    if (!isClient) return;
    const verseSetIndex = (currentStage - 1) * VERSES_PER_STAGE;
    const verse = verses[verseSetIndex + currentVerseIndex];
    if (verse) {
      setupRoundLogic(verse, currentStage, currentLevel, verseScores, currentVerseIndex, language);
    }
  }, [currentVerseIndex, currentStage, currentLevel, isClient, verseScores, language]);

  useEffect(() => {
    if (gameMode === 'fillInTheBlank') {
      setupRound();
    }
  }, [setupRound, gameMode]);


  const calculateScore = useCallback((inputs: string[]) => {
    if (missingWords.length === 0) return 0;
    const correctCount = inputs.reduce((count, input, index) => {
      const isCorrect = input.toLowerCase().trim() === missingWords[index]?.toLowerCase().trim();
      return isCorrect ? count + 1 : count;
    }, 0);
    
    // Score is number of correct words, up to the level number
    return Math.min(correctCount, currentLevel);

  }, [missingWords, currentLevel]);
  
  const tryAgain = () => {
    const newInputs = userInputs.map((input, index) => {
        const isCorrect = input.toLowerCase().trim() === (missingWords[index] || '').toLowerCase().trim();
        return isCorrect ? input : '';
    });
    setUserInputs(newInputs);

    const firstIncorrectIndex = userInputs.findIndex((input, index) => {
        return input.toLowerCase().trim() !== (missingWords[index] || '').toLowerCase().trim();
    });

    setGameState('playing');
    setEditingIndex(firstIncorrectIndex !== -1 ? firstIncorrectIndex : 0);
    setShowSummaryDialog(false);
  };

  const handleSubmit = () => {
    if (isVerseMastered) return;

    if (userInputs.some(input => input.trim() === '')) {
      setGameState('incomplete');
      playIncorrectSound();
      return;
    }

    const score = calculateScore(userInputs);
    handleMastery(score);
    setAttemptScore(score);
    setShowSummaryDialog(true);
  };
  
  const handleNext = () => {
    setShowSummaryDialog(false);

    const isLevelNowComplete = Object.keys(verseScores[currentStage]?.[currentLevel] || {}).length === VERSES_PER_STAGE;
    if (isLastVerseInSet && isLevelNowComplete) {
       setShowLevelCompleteDialog(true);
    }
    else if (currentVerseIndex < VERSES_PER_STAGE - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    } else {
        const firstUnfinished = findFirstUnfinishedVerse(currentStage, currentLevel, verseScores);
        setCurrentVerseIndex(firstUnfinished);
    }
  };

  const startNextLevel = () => {
    setShowLevelCompleteDialog(false);
    if (currentLevel < LEVELS_PER_STAGE) {
        setCurrentLevel(l => l + 1);
        setCurrentVerseIndex(0);
    } else { 
        if(currentStage < MAX_STAGES) {
            setCurrentStage(s => s + 1);
            setCurrentLevel(1);
            setCurrentVerseIndex(0);
        } else {
             setIsJourneyOpen(true);
        }
    }
  };

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < VERSES_PER_STAGE - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    }
  };
  
  const handleHintClick = () => {
    if(isVerseMastered) return;
    if (hints > 0) {
        useHint();
    } else {
        setShowNoHintsDialog(true);
    }
  };
  
  const useHint = () => {
    if (hints > 0 && !isVerseMastered) {
      const firstEmptyIndex = userInputs.findIndex(input => input === '');
      if (firstEmptyIndex !== -1) {
        const newInputs = [...userInputs];
        newInputs[firstEmptyIndex] = missingWords[firstEmptyIndex];
        setUserInputs(newInputs);
        spendHint();
      }
    }
    setShowNoHintsDialog(false);
  };
  
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
    if(gameState === 'checking' || gameState === 'incorrect' || gameState === 'incomplete') {
      setGameState('playing');
    }
  };

  const handleLabelClick = (index: number) => {
    if (isVerseMastered) return;
    if (gameState === 'playing' || gameState === 'checking' || gameState === 'incomplete') {
      setEditingIndex(index);
    }
  };

  const handleLevelSelect = (stage: number, level: number) => {
      setCurrentStage(stage);
      setCurrentLevel(level);
      const firstUnfinished = findFirstUnfinishedVerse(stage, level, verseScores);
      setCurrentVerseIndex(firstUnfinished);
      setIsJourneyOpen(false);
  };
  
  const isLevelComplete = (stage: number, level: number, scores: VerseScores) => {
      const levelScores = scores[stage]?.[level] || {};
      return Object.keys(levelScores).length === VERSES_PER_STAGE;
  };
  
  const isStageComplete = (stage: number, scores: VerseScores) => {
    for(let level=1; level <= LEVELS_PER_STAGE; level++) {
        if(!isLevelComplete(stage, level, scores)) {
            return false;
        }
    }
    return true;
  };
  
  const startBonusRound = (level: number) => {
    setActiveBonusLevel(level);
    setViewOnlyBonusLevel(null);
    setGameMode('puzzle');
  };
  
    const handleBonusComplete = (timeRemaining: number) => {
        if (activeBonusLevel === null) return;

        const timeTaken = BONUS_ROUND_TIME - timeRemaining;

        let timeBonus = 0;
        
        const levelBonusBrackets = [
            { level: 1, tiers: [{ time: 30, points: 15 }, { time: 60, points: 10 }, { time: 90, points: 5 }] },
            { level: 2, tiers: [{ time: 45, points: 20 }, { time: 75, points: 15 }, { time: 105, points: 10 }] },
            { level: 3, tiers: [{ time: 60, points: 25 }, { time: 90, points: 20 }, { time: 120, points: 15 }] },
            { level: 4, tiers: [{ time: 75, points: 30 }, { time: 105, points: 25 }, { time: 135, points: 20 }] },
            { level: 5, tiers: [{ time: 90, points: 35 }, { time: 120, points: 30 }, { time: 150, points: 25 }] },
        ];
        
        const currentLevelBrackets = levelBonusBrackets.find(b => b.level === activeBonusLevel);

        if (currentLevelBrackets) {
            for (const tier of currentLevelBrackets.tiers) {
                if (timeTaken <= tier.time) {
                    timeBonus = tier.points;
                    break;
                }
            }
        }
    
    const baseReward = stage1BonusRewards[activeBonusLevel - 1] || 0;
    const totalReward = baseReward + timeBonus;
    
    addExp(totalReward);
    setBonusProgress(prev => {
        const newProgress = {...prev};
        if (!newProgress[currentStage]) newProgress[currentStage] = {};
        newProgress[currentStage][activeBonusLevel!] = 'completed';
        return newProgress;
    });
    
    toast({
        title: <div className="flex items-center gap-2 font-headline"><Trophy className="text-primary" /> {language === 'fil' ? 'Bonus, Kumpleto!' : 'Bonus Complete!'}</div>,
        description: `${language === 'fil' ? 'Nakakuha ka ng' : 'You earned'} ${baseReward} + ${timeBonus} (time bonus) = ${totalReward} ${language === 'fil' ? 'dagdag na EXP!' : 'extra EXP!'}`,
    });
    
    setActiveBonusLevel(null);
    setGameMode('fillInTheBlank');
  };

  const handleBonusFail = () => {
      if(activeBonusLevel === null) return;
      setBonusProgress(prev => {
        const newProgress = {...prev};
        if (!newProgress[currentStage]) newProgress[currentStage] = {};
        newProgress[currentStage][activeBonusLevel] = 'attempted';
        return newProgress;
    });
      setActiveBonusLevel(null);
      setGameMode('fillInTheBlank');
  }

  const viewBonusRound = (level: number) => {
      setViewOnlyBonusLevel(level);
      setActiveBonusLevel(null);
      setGameMode('puzzle');
  }

  const verseSetIndex = (currentStage - 1) * VERSES_PER_STAGE;
  const verseIdx = activeBonusLevel !== null ? stage1BonusVerseIndices[activeBonusLevel - 1] : (viewOnlyBonusLevel !== null ? stage1BonusVerseIndices[viewOnlyBonusLevel - 1] : -1);
  const bonusVerse = verseIdx !== -1 ? verses[verseSetIndex + verseIdx] : null;

  const currentVerse = verses[verseSetIndex + currentVerseIndex];
  
  const isLastVerseInSet = currentVerseIndex === (VERSES_PER_STAGE - 1);
  
  const renderFillInTheBlankVerse = () => {
    if (!isClient || !currentVerse) {
      return <div>{language === 'fil' ? 'Nagloload ng talata...' : 'Loading verse...'}</div>;
    }
    
    const verseText = language === 'en' ? currentVerse.text : currentVerse.text_fil;
    if (isVerseMastered) {
      return <p className="font-serif italic text-lg leading-relaxed">"{verseText}"</p>;
    }

    if (verseWithBlanks.length === 0) {
      return <div>{language === 'fil' ? 'Nagloload ng talata...' : 'Loading verse...'}</div>;
    }

    let inputIndex = 0;
    return verseWithBlanks.map((part, index) => {
      if (part === null) {
        const currentIndex = inputIndex;
        inputIndex++;
        
        const isEditable = (gameState === 'playing' || gameState === 'checking' || gameState === 'incomplete') && editingIndex === currentIndex && !isVerseMastered;

        if (isEditable) {
           return (
            <Input
              key={`input-${currentIndex}`}
              type="text"
              value={userInputs[currentIndex] || ''}
              onChange={(e) => handleInputChange(currentIndex, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              autoFocus
              className={cn("w-32 h-8 text-base shrink-0 inline-block", (gameState === 'incorrect' || gameState === 'incomplete') && 'border-destructive ring-destructive')}
              style={{ width: `${Math.max(missingWords[currentIndex]?.length || 0, 5) + 2}ch` }}
              disabled={isVerseMastered}
            />
          );
        }
        
        const userInput = userInputs[currentIndex]?.trim().toLowerCase();
        const correctWord = missingWords[currentIndex]?.trim().toLowerCase();
        const isCorrect = userInput === correctWord;
        const isWrong = (gameState === 'checking' || gameState === 'incorrect') && !isCorrect;
        const isCheckingAndCorrect = gameState === 'checking' && isCorrect;

        return (
          <Label 
            key={`label-${currentIndex}`}
            onClick={() => handleLabelClick(currentIndex)}
            className={cn(
              "inline-block text-center border-b-2 border-dashed h-8 leading-7 cursor-pointer px-2 rounded-md",
               userInputs[currentIndex] ? "border-primary/50 bg-primary/20 text-primary" : "border-muted-foreground/50",
              (isVerseMastered) ? 'cursor-default' : '',
              isWrong ? 'bg-destructive/20 border-destructive' : '',
              isCheckingAndCorrect ? 'bg-green-500/20 border-green-500' : '',
              isVerseMastered ? 'bg-green-500/20 border-green-500 !cursor-default' : ''
            )}
            style={{ minWidth: `${Math.max(missingWords[currentIndex]?.length || 0, 5) + 2}ch`}}
          >
            {userInputs[currentIndex] || '...'}
          </Label>
        )
      }
      return <span key={`word-${index}`}>{part}</span>;
    });
  };

  const getDialogMessage = () => {
      return language === 'fil' 
        ? `Nakuha mo ang ${attemptScore} sa ${currentLevel} na mga salita nang tama!`
        : `You got ${attemptScore} out of ${currentLevel} words correct!`;
  }

  const currentVerseScore = verseScores[currentStage]?.[currentLevel]?.[currentVerseIndex] ?? 0;
  
  if (!isClient || !currentVerse) {
    return <div>{language === 'fil' ? 'Nagloload...' : 'Loading...'}</div>;
  }
  
    const allStagesAndLevels = Array.from({length: MAX_STAGES}).map((_, i) => {
        const stageNum = i + 1;
        const levels = Array.from({length: LEVELS_PER_STAGE}).map((_, j) => {
            const levelNum = j + 1;
            const isCurrent = stageNum === currentStage && levelNum === currentLevel;
            const levelScoresData = verseScores[stageNum]?.[levelNum] || {};
            const masteredInLevel = Object.keys(levelScoresData).length;
            const totalVersesInLevel = VERSES_PER_STAGE;
            const isLvlComplete = masteredInLevel === totalVersesInLevel;
            return { levelNum, isUnlocked: true, isCurrent, masteredInLevel, totalVersesInLevel, isLevelComplete: isLvlComplete };
        });
        return { stageNum, isUnlocked: true, levels };
    });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4 md:px-0">
       <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold">{language === 'fil' ? 'Hamon sa Pagmemorya ng Talata' : 'Verse Memory Challenge'}</h1>
        <p className="text-muted-foreground">{language === 'fil' ? 'Kabisaduhin ang mga talata sa iba\\'t ibang laro at hamon.' : 'Master verses through different games and challenges.'}</p>
      </div>
      
       <Tabs value={gameMode} onValueChange={(value) => setGameMode(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fillInTheBlank" className="gap-2" disabled={activeBonusLevel !== null || viewOnlyBonusLevel !== null}><Feather/>{language === 'fil' ? 'Punan ang Patlang' : 'Fill in the Blanks'}</TabsTrigger>
                <TabsTrigger value="puzzle" className="gap-2"><Puzzle />{language === 'fil' ? 'Mga Bonus na Puzzle' : 'Bonus Puzzles'}</TabsTrigger>
            </TabsList>
            <div className="mt-4">
                <TabsContent value="fillInTheBlank">
                    <div className="flex justify-between items-center mb-4 px-4 py-2 bg-muted rounded-lg font-semibold">
                        <div>{language === 'fil' ? `Yugto ${currentStage} - Antas ${currentLevel}` : `Stage ${currentStage} - Level ${currentLevel}`}</div>
                         <Button variant="outline" size="icon" onClick={() => setLanguage(l => l === 'en' ? 'fil' : 'en')}><Languages className="w-5 h-5"/></Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer" role="button">
                                    <Key className="w-5 h-5 text-yellow-500"/> {wisdomKeys}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">{language === 'fil' ? 'Mga Susi ng Karunungan' : 'Wisdom Keys'}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'fil' ? 'Gamitin ang mga susing ito para sa mga pahiwatig sa mga laro. Makakakuha ka ng mas maraming Susi ng Karunungan sa tuwing tataas ang iyong antas!' : 'Use these keys for hints in games. You earn more Wisdom Keys every time you level up!'}
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Dialog open={isJourneyOpen} onOpenChange={setIsJourneyOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon"><Map className="w-5 h-5"/></Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md w-full">
                                <DialogHeader>
                                    <DialogTitle className="font-headline text-2xl text-center">{language === 'fil' ? 'Paglalakbay sa Talata' : 'Verse Journey'}</DialogTitle>
                                    <CardDescription className="text-center">{language === 'fil' ? 'Kumpletuhin ang lahat ng yugto upang maging isang dalubhasa!' : 'Complete all stages to become a master!'}</CardDescription>
                                </DialogHeader>
                                <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
                                   {allStagesAndLevels.map(stage => (
                                       <Collapsible key={stage.stageNum} defaultOpen={stage.stageNum === currentStage} className={cn(!stage.isUnlocked && "opacity-50")}>
                                           <CollapsibleTrigger className="flex justify-between items-center w-full p-2 rounded-lg hover:bg-muted font-semibold disabled:cursor-not-allowed" disabled={!stage.isUnlocked}>
                                               <span>{language === 'fil' ? `Yugto ${stage.stageNum}` : `Stage ${stage.stageNum}`} {isStageComplete(stage.stageNum, verseScores) && <CheckCircle className="inline w-4 h-4 ml-1 text-green-500"/>}</span>
                                               <ChevronsUpDown className="w-4 h-4" />
                                           </CollapsibleTrigger>
                                           <CollapsibleContent className="space-y-2 pt-2 pl-4 border-l ml-4">
                                                {stage.levels.map(level => (
                                                    <div 
                                                        key={`${stage.stageNum}-${level.levelNum}`} 
                                                        onClick={() => stage.isUnlocked && handleLevelSelect(stage.stageNum, level.levelNum)}
                                                        className={cn("flex items-center gap-4 p-2 rounded-lg transition-colors", 
                                                        level.isCurrent ? "bg-primary/10 border border-primary/20" : "",
                                                        stage.isUnlocked ? "cursor-pointer hover:bg-muted" : "cursor-not-allowed"
                                                        )}
                                                    >
                                                        <div className={cn("p-2 rounded-full", stage.isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                                                            {level.isLevelComplete ? <CheckCircle className="w-6 h-6 text-green-500"/> : <PlayCircle className="w-6 h-6"/>}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{language === 'fil' ? `Antas ${level.levelNum}` : `Level ${level.levelNum}`}</p>
                                                            <p className="text-sm text-muted-foreground">{`${level.masteredInLevel}/${level.totalVersesInLevel} ${language === 'fil' ? 'Talata ang Kabisado' : 'Verses Mastered'}`}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                           </CollapsibleContent>
                                       </Collapsible>
                                   ))}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <RefreshCw className="mr-2 h-4 w-4" /> {language === 'fil' ? 'I-reset ang Progreso' : 'Reset Progress'}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuItem onSelect={() => setShowResetConfirm('current')}>
                                            {language === 'fil' ? 'I-reset ang Kasalukuyang Antas' : 'Reset Current Level'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setShowResetConfirm('all')} className="text-destructive">
                                            {language === 'fil' ? 'I-reset Lahat ng Progreso' : 'Reset All Progress'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </DialogContent>
                        </Dialog>
                    </div>
                        <div className="relative">
                            {isVerseMastered && (
                                <div className="pointer-events-none">
                                    <div className="absolute -top-3 -left-3.5 w-16 h-16 overflow-hidden z-10">
                                        <div className="absolute transform -rotate-45 bg-primary text-primary-foreground text-center flex items-center justify-center p-1" style={{ width: '150%', left: '-35%', top: '25%' }}>
                                            <CheckCircle2 className="w-4 h-4"/>
                                        </div>
                                    </div>
                                    <div className="absolute -top-3 -right-3.5 w-16 h-16 overflow-hidden z-10">
                                        <div className="absolute transform rotate-45 bg-primary text-primary-foreground text-center flex items-center justify-center p-1" style={{ width: '150%', right: '-35%', top: '25%' }}>
                                            <CheckCircle2 className="w-4 h-4"/>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Card>
                                <CardHeader>
                                <div className="flex justify-between items-start gap-4">
                                    <Button variant="outline" size="icon" onClick={handlePrevVerse} disabled={currentVerseIndex === 0}>
                                        <ChevronLeft className="w-5 h-5"/>
                                    </Button>
                                    <div className="flex-grow text-center space-y-2">
                                        <CardTitle className="font-headline text-2xl">
                                        {language === 'en' ? currentVerse.reference : currentVerse.reference_fil} ({language === 'en' ? currentVerse.version : currentVerse.version_fil})
                                        </CardTitle>
                                         <CardDescription>{language === 'fil' ? `Talata ${currentVerseIndex + 1} ng ${VERSES_PER_STAGE}` : `Verse ${currentVerseIndex + 1} of ${VERSES_PER_STAGE}`}</CardDescription>
                                        <div className="flex justify-center items-center">
                                           {currentVerseScore > 0 ? (
                                               <div className="flex items-center gap-1 font-bold text-yellow-500">
                                                   <Star className="w-5 h-5 fill-current" /> {currentVerseScore} {language === 'fil' ? 'Bituin' : 'Star(s)'}
                                               </div>
                                           ) : (
                                               <div className="flex items-center gap-1 text-muted-foreground">
                                                   <Star className="w-5 h-5" /> {language === 'fil' ? 'Hindi pa Kabisado' : 'Not Mastered'}
                                               </div>
                                           )}
                                        </div>
                                    </div>
                                    <Button variant="outline" size="icon" onClick={handleNextVerse} disabled={currentVerseIndex === VERSES_PER_STAGE - 1}>
                                        <ChevronRight className="w-5 h-5"/>
                                    </Button>
                                </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="text-lg leading-loose flex flex-wrap items-center gap-x-1 gap-y-4">{renderFillInTheBlankVerse()}</div>
                                    {gameState === 'incomplete' && <p className="text-destructive text-center font-semibold">{language === 'fil' ? 'Pakiusap, punan ang lahat ng patlang bago suriin.' : 'Please fill in all the blanks before checking.'}</p>}
                                    <div className="flex flex-wrap gap-2 justify-center pt-6">
                                        {isVerseMastered ? (
                                            <Button
                                                variant="default"
                                                onClick={handleNext}
                                                className={cn(
                                                    "w-full relative overflow-hidden",
                                                    highlightNextButton && "animate-border-fade-out"
                                                )}
                                                >
                                                <span className={cn(highlightNextButton && "animate-fade-in opacity-0")}>
                                                    {isLastVerseInSet ? (language === 'fil' ? 'Pumunta sa Susunod na Antas' : 'Go to Next Level') : (language === 'fil' ? 'Susunod na Talata' : 'Next Verse')}
                                                </span>
                                            </Button>
                                        ) : (
                                            <>
                                            <Button onClick={handleSubmit}>
                                                {language === 'fil' ? 'Suriin ang Sagot' : 'Check My Answer'}
                                            </Button>
                                            <Button variant="outline" onClick={handleHintClick}>
                                                <HelpCircle className="mr-2 h-4 w-4"/>
                                                {language === 'fil' ? `Pahiwatig (${hints})` : `Hint (${hints})`}
                                            </Button>
                                            <Button variant="default" onClick={handleNext}>
                                                {isLastVerseInSet ? (language === 'fil' ? 'Tapusin ang Antas' : 'Finish Level') : (language === 'fil' ? 'Laktawan ang Talata' : 'Skip Verse')}
                                            </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                </TabsContent>
                <TabsContent value="puzzle">
                     <div className="space-y-4">
                        <div className="text-center">
                            <h2 className="font-headline text-2xl">{language === 'fil' ? 'Mga Bonus na Puzzle' : 'Bonus Puzzles'}</h2>
                            <p className="text-muted-foreground">{language === 'fil' ? 'Kumpletuhin ang isang antas sa \\'Punan ang Patlang\\' para mabuksan ang bonus puzzle nito.' : 'Complete a level in \\'Fill in the Blanks\\' to unlock its bonus puzzle.'}</p>
                        </div>
                        {(activeBonusLevel !== null || viewOnlyBonusLevel !== null) && bonusVerse ? (
                             <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-center font-headline">{language === 'en' ? bonusVerse.reference : bonusVerse.reference_fil}</CardTitle>
                                        <Button size="sm" variant="ghost" onClick={() => { setActiveBonusLevel(null); setViewOnlyBonusLevel(null); setGameMode('fillInTheBlank'); }}>{language === 'fil' ? 'Bumalik' : 'Back'}</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <VersePuzzle 
                                        verse={bonusVerse}
                                        onComplete={handleBonusComplete}
                                        onBonusFail={handleBonusFail}
                                        initialTimer={BONUS_ROUND_TIME}
                                        viewOnly={viewOnlyBonusLevel !== null}
                                        language={language}
                                    />
                                </CardContent>
                             </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: LEVELS_PER_STAGE }).map((_, i) => {
                                    const level = i + 1;
                                    const isUnlocked = true; // All bonus puzzles unlocked for now
                                    const bonusStatus = bonusProgress[currentStage]?.[level];
                                    const bonusReward = stage1BonusRewards[i] || 0;

                                    return (
                                        <Card 
                                            key={`bonus-${level}`}
                                            className={cn("text-center", !isUnlocked && "bg-muted/50")}
                                        >
                                            <CardHeader>
                                                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
                                                    {isUnlocked ? <Puzzle className="w-8 h-8 text-primary"/> : <Lock className="w-8 h-8 text-muted-foreground"/>}
                                                </div>
                                                <CardTitle className="font-headline">{language === 'fil' ? `Bonus sa Antas ${level}` : `Level ${level} Bonus`}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                 <div className="text-center">
                                                    <p className="text-xs text-muted-foreground">{language === 'fil' ? 'Gantimpala' : 'Reward'}: {bonusReward} EXP</p>
                                                 </div>
                                                 {bonusStatus === 'completed' ? (
                                                    <Button disabled className="w-full bg-green-600 hover:bg-green-600"><CheckCircle className="mr-2"/>{language === 'fil' ? 'Natapos' : 'Completed'}</Button>
                                                ) : bonusStatus === 'attempted' ? (
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-sm font-semibold text-destructive">{language === 'fil' ? 'Oras na!' : 'Time\\'s up!'}</p>
                                                        <Button onClick={() => viewBonusRound(level)} variant="secondary" className="w-full"><Eye className="mr-2"/>{language === 'fil' ? 'Tingnan ang Puzzle' : 'View Puzzle'}</Button>
                                                    </div>
                                                ) : isUnlocked ? (
                                                    <Button onClick={() => startBonusRound(level)} className="w-full">
                                                        <PlayCircle className="mr-2"/>{language === 'fil' ? 'Simulan ang Hamon' : 'Start Challenge'}
                                                    </Button>
                                                ) : (
                                                     <p className="text-sm text-muted-foreground">{language === 'fil' ? `Kumpletuhin ang Antas ${level} para mabuksan` : `Complete Level ${level} to unlock`}</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </TabsContent>
          </div>
        </Tabs>

      <AlertDialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl text-center">
                {language === 'fil' ? 'Puntos' : 'Score'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
                {getDialogMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Card className="bg-muted/50">
             <CardContent className="p-4">
                {(gameState === 'scored' || gameState === 'incorrect') && (
                    <VerseReview 
                        verse={currentVerse} 
                        verseWithBlanks={verseWithBlanks} 
                        userInputs={userInputs} 
                        missingWords={missingWords}
                        showCorrectAnswer={true}
                        language={language}
                    />
                )}
             </CardContent>
          </Card>
          <AlertDialogFooter>
            {(gameState === 'scored' || gameState === 'incorrect' ) && !isVerseMastered ? (
                 <AlertDialogAction onClick={tryAgain}>{language === 'fil' ? 'Subukang Muli' : 'Try Again'}</AlertDialogAction>
            ) : null}
            <AlertDialogAction onClick={handleNext}>
                {isLastVerseInSet ? (language === 'fil' ? 'Tapusin ang Antas' : 'Finish Level') : (language === 'fil' ? 'Susunod na Talata' : 'Next Verse')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLevelCompleteDialog} onOpenChange={setShowLevelCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <Trophy className="w-10 h-10 text-primary" />
            </div>
            <AlertDialogTitle className="font-headline text-2xl text-center">{language === 'fil' ? `Natapos ang Antas ${currentLevel}!` : `Level ${currentLevel} Complete!`}</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {language === 'fil' ? 'Magaling! Nakuha mo na ang lahat ng talata sa antas na ito. Ang bonus puzzle ay bukas na sa tab na \\'Mga Bonus na Puzzle\\'.' : 'Excellent work! You\\'ve mastered all the verses in this level. The bonus puzzle is now unlocked in the \\'Bonus Puzzles\\' tab.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={startNextLevel} className="w-full">
                {currentLevel < LEVELS_PER_STAGE ? `${language === 'fil' ? 'Simulan ang Antas' : 'Start Level'} ${currentLevel + 1}` : `${language === 'fil' ? 'Simulan ang Yugto' : 'Start Stage'} ${currentStage + 1}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetConfirm !== null} onOpenChange={(open) => !open && setShowResetConfirm(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{language === 'fil' ? 'Sigurado ka ba?' : 'Are you sure?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {showResetConfirm === 'current'
                            ? (language === 'fil' ? "Ire-reset nito ang lahat ng iyong mga score at EXP para sa kasalukuyang antas. Hindi na maibabalik ang aksyon na ito." : "This will reset all your scores and EXP for the current level. This action cannot be undone.")
                            : (language === 'fil' ? "Permanente nitong tatanggalin ang lahat ng iyong progreso, kasama ang lahat ng score at EXP sa lahat ng antas. Hindi na maibabalik ang aksyon na ito." : "This will permanently delete all your progress, including all scores and EXP across all levels. This action cannot be undone.")
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowResetConfirm(null)}>{language === 'fil' ? 'Kanselahin' : 'Cancel'}</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={showResetConfirm === 'current' ? resetCurrentLevelProgress : resetAllProgress}
                      className={cn(showResetConfirm === 'all' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}
                    >
                        {language === 'fil' ? 'Kumpirmahin' : 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showNoHintsDialog} onOpenChange={setShowNoHintsDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{language === 'fil' ? 'Kulang ang mga pahiwatig' : 'Not Enough Hints'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {language === 'fil' ? 'Wala ka nang natitirang mga pahiwatig. Pumunta sa forge upang bumili pa.' : 'You have no hints left. Go to the forge to buy more.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{language === 'fil' ? 'Mamaya na lang' : 'Maybe Later'}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => router.push('/dashboard/forge')}>
                        <Hammer className="mr-2 h-4 w-4" /> {language === 'fil' ? 'Pumunta sa Forge' : 'Go to Forge'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showUnlockDialog !== null} onOpenChange={(open) => !open && setShowUnlockDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    <Trophy className="w-10 h-10 text-primary" />
                </div>
              <AlertDialogTitle className="font-headline text-2xl text-center">
                {showUnlockDialog === 'stage1' ? (language === 'fil' ? "Natapos ang Yugto 1!" : "Stage 1 Complete!") : (language === 'fil' ? "Natapos ang Yugto 2!" : "Stage 2 Complete!")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                {language === 'fil' ? 'Binabati kita! Na-unlock mo ang ' : 'Congratulations! You\\'ve unlocked '} 
                {showUnlockDialog === 'stage1' ? (language === 'fil' ? 'Yugto 2 at ang larong' : 'Stage 2 and the') : (language === 'fil' ? 'larong' : 'the')} 
                <strong> {showUnlockDialog === 'stage1' ? (language === 'fil' ? "Pakikipagsapalaran ng mga Tauhan" : "Character Adventures") : (language === 'fil' ? "Kasanayan sa Bibliya" : "Bible Mastery")}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center flex-col sm:flex-row gap-2">
              <AlertDialogCancel onClick={() => {
                  setShowUnlockDialog(null);
                  handleNext();
                }}>
                    {language === 'fil' ? 'Ipagpatuloy ang Paglalakbay' : 'Continue Journey'}
                </AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push(showUnlockDialog === 'stage1' ? '/dashboard/character-adventures' : '/dashboard/bible-mastery')}>
                <Users className="mr-2" /> {language === 'fil' ? 'Tuklasin ang Bagong Laro' : 'Explore New Game'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
