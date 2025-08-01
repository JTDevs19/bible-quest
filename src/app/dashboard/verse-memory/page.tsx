

'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle, RefreshCw, XCircle, Star, Lock, PlayCircle, Map, Trophy, ChevronLeft, ChevronRight, HelpCircle, GitCommitVertical, Check, Users, CheckCircle2, ChevronsUpDown, Puzzle, Feather, Clock, Eye, Key, Languages, Hammer, GripVertical, Home } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Badge } from '@/components/ui/badge';

const easyVerses1 = [
  { reference: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son.', version: 'NIV' },
  { reference: 'Genesis 1:1', text: 'In the beginning God created the heavens and the earth.', version: 'NIV' },
  { reference: '1 Peter 5:7', text: 'Cast all your anxiety on him because he cares for you.', version: 'NIV' },
  { reference: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.', version: 'NIV' },
  { reference: 'Romans 3:23', text: 'for all have sinned and fall short of the glory of God,', version: 'NIV' },
  { reference: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.', version: 'NIV' },
  { reference: 'James 1:5', text: 'If any of you lacks wisdom, you should ask God,', version: 'NIV' },
  { reference: 'Psalm 46:10', text: 'He says, “Be still, and know that I am God;', version: 'NIV' },
  { reference: 'John 1:1', text: 'In the beginning was the Word, and the Word was with God', version: 'NIV' },
  { reference: 'Psalm 23:1', text: 'The LORD is my shepherd, I shall not be in want.', version: 'NIV' },
  { reference: 'Proverbs 16:9', text: 'In their hearts humans plan their course, but the LORD establishes their steps.', version: 'NIV' },
  { reference: '1 John 4:19', text: 'We love because he first loved us.', version: 'NIV' },
  { reference: 'Psalm 37:4', text: 'Take delight in the LORD, and he will give you the desires of your heart.', version: 'NIV' },
  { reference: 'Matthew 7:7', text: '“Ask and it will be given to you; seek and you will find;', version: 'NIV' },
  { reference: 'Romans 5:8', text: 'But God demonstrates his own love for us in this:', version: 'NIV' },
  { reference: 'John 11:35', text: 'Jesus wept.', version: 'NIV' },
  { reference: 'Psalm 56:3', text: 'When I am afraid, I put my trust in you.', version: 'NIV' },
  { reference: '1 Thessalonians 5:17', text: 'pray continually,', version: 'NIV' },
  { reference: 'Ephesians 4:32', text: 'Be kind and compassionate to one another, forgiving each other,', version: 'NIV' },
  { reference: 'Psalm 1:1', text: 'Blessed is the one who does not walk in step with the wicked', version: 'NIV' },
  { reference: 'Matthew 6:21', text: 'For where your treasure is, there your heart will be also.', version: 'NIV' },
  { reference: 'Proverbs 1:7', text: 'The fear of the LORD is the beginning of knowledge,', version: 'NIV' },
  { reference: 'Psalm 119:11', text: 'I have hidden your word in my heart that I might not sin against you.', version: 'NIV' },
  { reference: 'Mark 1:17', text: '“Come, follow me,” Jesus said, “and I will send you out to fish for people.”', version: 'NIV' },
  { reference: 'Matthew 11:28', text: '“Come to me, all you who are weary and burdened, and I will give you rest.', version: 'NIV' },
  { reference: 'John 14:27', text: 'Peace I leave with you; my peace I give you.', version: 'NIV' },
  { reference: 'Psalm 27:1', text: 'The LORD is my light and my salvation— whom shall I fear?', version: 'NIV' },
  { reference: 'Isaiah 26:3', text: 'You will keep in perfect peace those whose minds are steadfast,', version: 'NIV' },
  { reference: '1 John 4:8', text: 'Whoever does not love does not know God, because God is love.', version: 'NIV' },
  { reference: 'Romans 10:17', text: 'Consequently, faith comes from hearing the message,', version: 'NIV' },
  { reference: 'Proverbs 15:1', text: 'A gentle answer turns away wrath, but a harsh word stirs up anger.', version: 'NIV' },
  { reference: 'Matthew 5:14', text: '“You are the light of the world. A town built on a hill cannot be hidden.', version: 'NIV' },
  { reference: 'Galatians 5:13', text: 'You, my brothers and sisters, were called to be free.', version: 'NIV' },
  { reference: 'Psalm 107:1', text: 'Give thanks to the LORD, for he is good;', version: 'NIV' },
  { reference: 'John 8:12', text: 'When Jesus spoke again to the people, he said, “I am the light of the world.', version: 'NIV' },
  { reference: 'Ephesians 2:10', text: 'For we are God’s handiwork, created in Christ Jesus to do good works,', version: 'NIV' },
  { reference: 'Psalm 62:1', text: 'Truly my soul finds rest in God; my salvation comes from him.', version: 'NIV' },
  { reference: 'Proverbs 17:17', text: 'A friend loves at all times,', version: 'NIV' },
  { reference: 'Colossians 3:20', text: 'Children, obey your parents in everything, for this pleases the Lord.', version: 'NIV' },
  { reference: 'James 1:17', text: 'Every good and perfect gift is from above,', version: 'NIV' },
  { reference: 'Psalm 100:2', text: 'Worship the LORD with gladness; come before him with joyful songs.', version: 'NIV' },
  { reference: '1 John 3:1', text: 'See what great love the Father has lavished on us,', version: 'NIV' },
  { reference: 'Matthew 21:22', text: 'If you believe, you will receive whatever you ask for in prayer.”', version: 'NIV' },
  { reference: 'Psalm 145:9', text: 'The LORD is good to all; he has compassion on all he has made.', version: 'NIV' },
  { reference: 'Proverbs 3:3', text: 'Let love and faithfulness never leave you;', version: 'NIV' },
  { reference: 'Philippians 2:14', text: 'Do everything without grumbling or arguing,', version: 'NIV' },
  { reference: 'Psalm 103:2', text: 'Praise the LORD, my soul, and forget not all his benefits—', version: 'NIV' },
  { reference: '1 Peter 4:10', text: 'Each of you should use whatever gift you have received to serve others,', version: 'NIV' },
  { reference: 'Matthew 5:8', text: 'Blessed are the pure in heart, for they will see God.', version: 'NIV' },
  { reference: 'Romans 12:10', text: 'Be devoted to one another in love. Honor one another above yourselves.', version: 'NIV' },
];
const easyVerses2 = [
  { reference: 'Proverbs 18:10', text: 'The name of the LORD is a fortified tower; the righteous run to it and are safe.', version: 'NIV' },
  { reference: 'Matthew 5:16', text: 'In the same way, let your light shine before others, that they may see your good deeds', version: 'NIV' },
  { reference: 'Romans 12:2', text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.', version: 'NIV' },
  { reference: 'Psalm 139:14', text: 'I praise you because I am fearfully and wonderfully made;', version: 'NIV' },
  { reference: 'John 8:32', text: 'Then you will know the truth, and the truth will set you free.”', version: 'NIV' },
  { reference: 'Deuteronomy 6:5', text: 'Love the LORD your God with all your heart and with all your soul and with all your strength.', version: 'NIV' },
  { reference: 'Psalm 118:24', text: 'The LORD has done it this very day; let us rejoice today and be glad.', version: 'NIV' },
  { reference: '1 Corinthians 10:31', text: 'So whether you eat or drink or whatever you do, do it all for the glory of God.', version: 'NIV' },
  { reference: 'Proverbs 22:6', text: 'Start children off on the way they should go,', version: 'NIV' },
  { reference: 'Mark 12:30', text: 'Love the Lord your God with all your heart and with all your soul and with all your mind', version: 'NIV' },
  { reference: 'Hebrews 13:8', text: 'Jesus Christ is the same yesterday and today and forever.', version: 'NIV' },
  { reference: 'Psalm 34:8', text: 'Taste and see that the LORD is good;', version: 'NIV' },
  { reference: 'Matthew 5:9', text: 'Blessed are the peacemakers, for they will be called children of God.', version: 'NIV' },
  { reference: 'Romans 15:13', text: 'May the God of hope fill you with all joy and peace as you trust in him,', version: 'NIV' },
  { reference: 'Colossians 3:16', text: 'Let the message of Christ dwell among you richly', version: 'NIV' },
  { reference: 'Psalm 150:6', text: 'Let everything that has breath praise the LORD. Praise the LORD.', version: 'NIV' },
  { reference: 'John 16:33', text: '“I have told you these things, so that in me you may have peace.', version: 'NIV' },
  { reference: 'Proverbs 4:23', text: 'Above all else, guard your heart, for everything you do flows from it.', version: 'NIV' },
  { reference: 'Luke 6:31', text: 'Do to others as you would have them do to you.', version: 'NIV' },
  { reference: '1 Peter 3:15', text: 'But in your hearts revere Christ as Lord.', version: 'NIV' },
  { reference: 'Luke 11:9', text: '“So I say to you: Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.', version: 'NIV' },
  { reference: 'Galatians 6:9', text: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.', version: 'NIV' },
  { reference: 'Psalm 51:10', text: 'Create in me a pure heart, O God, and renew a steadfast spirit within me.', version: 'NIV' },
  { reference: '1 Corinthians 6:19-20', text: 'Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own;', version: 'NIV' },
  { reference: 'Psalm 9:10', text: 'Those who know your name trust in you, for you, LORD, have never forsaken those who seek you.', version: 'NIV' },
  { reference: 'John 14:15', text: '“If you love me, keep my commands.', version: 'NIV' },
  { reference: 'Matthew 6:24', text: '“No one can serve two masters. Either you will hate the one and love the other, or you will be devoted to the one and despise the other.', version: 'NIV' },
  { reference: 'Proverbs 8:33', text: 'Listen to my instruction and be wise; do not disregard it.', version: 'NIV' },
  { reference: 'Hebrews 10:24-25', text: 'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together,', version: 'NIV' },
  { reference: 'Psalm 105:4', text: 'Look to the LORD and his strength; seek his face always.', version: 'NIV' },
  { reference: '1 John 5:3', text: 'In fact, this is love for God: to keep his commands.', version: 'NIV' },
  { reference: 'Proverbs 10:12', text: 'Hatred stirs up conflict, but love covers over all wrongs.', version: 'NIV' },
  { reference: 'Psalm 1:6', text: 'For the LORD watches over the way of the righteous, but the way of the wicked leads to destruction.', version: 'NIV' },
  { reference: 'Ephesians 6:1', text: 'Children, obey your parents in the Lord, for this is right.', version: 'NIV' },
  { reference: 'John 1:12', text: 'Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God—', version: 'NIV' },
  { reference: 'Psalm 32:8', text: 'I will instruct you and teach you in the way you should go;', version: 'NIV' },
  { reference: 'Proverbs 13:20', text: 'Walk with the wise and become wise, for a companion of fools suffers harm.', version: 'NIV' },
  { reference: 'Colossians 4:2', text: 'Devote yourselves to prayer, being watchful and thankful.', version: 'NIV' },
  { reference: '1 John 2:15', text: 'Do not love the world or anything in the world.', version: 'NIV' },
  { reference: 'James 1:22', text: 'Do not merely listen to the word, and so deceive yourselves. Do what it says.', version: 'NIV' },
  { reference: 'Psalm 86:5', text: 'You, Lord, are forgiving and good, abounding in love to all who call to you.', version: 'NIV' },
  { reference: 'Proverbs 29:25', text: 'Fear of man will prove to be a snare, but whoever trusts in the LORD is kept safe.', version: 'NIV' },
  { reference: '2 Timothy 1:7', text: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.', version: 'NIV' },
  { reference: 'Psalm 119:9', text: 'How can a young person stay on the path of purity? By living according to your word.', version: 'NIV' },
  { reference: 'John 14:1', text: '“Do not let your hearts be troubled. You believe in God; believe also in me.', version: 'NIV' },
  { reference: 'Matthew 6:34', text: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself.', version: 'NIV' },
  { reference: 'Psalm 138:8', text: 'The LORD will vindicate me; your love, LORD, endures forever—', version: 'NIV' },
  { reference: 'Romans 12:1', text: 'Therefore, I urge you, brothers and sisters, in view of God’s mercy, to offer your bodies as a living sacrifice,', version: 'NIV' },
  { reference: 'Philippians 1:6', text: 'being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.', version: 'NIV' },
  { reference: 'Psalm 119:114', text: 'You are my refuge and my shield; I have put my hope in your word.', version: 'NIV' },
];
const hardVerses1 = [
  { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him,', version: 'NIV' },
  { reference: 'Matthew 6:33', text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.', version: 'NIV' },
  { reference: 'John 14:6', text: 'Jesus answered, “I am the way and the truth and the life. No one comes to the Father except through me.”', version: 'NIV' },
  { reference: 'Romans 6:23', text: 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.', version: 'NIV' },
  { reference: 'Ephesians 6:11', text: 'Put on the full armor of God, so that you can take your stand against the devil’s schemes.', version: 'NIV' },
  { reference: 'Hebrews 11:1', text: 'Now faith is confidence in what we hope for and assurance about what we do not see.', version: 'NIV' },
  { reference: 'Romans 10:9', text: 'If you declare with your mouth, “Jesus is Lord,” and believe in your heart that God raised him from the dead, you will be saved.', version: 'NIV' },
  { reference: 'Colossians 3:23', text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters,', version: 'NIV' },
  { reference: '1 John 1:9', text: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.', version: 'NIV' },
  { reference: 'Psalm 19:1', text: 'The heavens declare the glory of God; the skies proclaim the work of his hands.', version: 'NIV' },
  { reference: '2 Corinthians 5:17', text: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!', version: 'NIV' },
  { reference: 'James 4:7', text: 'Submit yourselves, then, to God. Resist the devil, and he will flee from you.', version: 'NIV' },
  { reference: 'Matthew 22:37', text: 'Jesus replied: “‘Love the Lord your God with all your heart and with all your soul and with all your mind.’', version: 'NIV' },
  { reference: 'Romans 8:38-39', text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future,', version: 'NIV' },
  { reference: 'Hebrews 11:6', text: 'And without faith it is impossible to please God, because anyone who comes to him must believe that he exists', version: 'NIV' },
  { reference: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God.', version: 'NIV' },
  { reference: 'Psalm 46:1', text: 'God is our refuge and strength, an ever-present help in trouble.', version: 'NIV' },
  { reference: 'John 10:10', text: 'The thief comes only to steal and kill and destroy; I have come that they may have life,', version: 'NIV' },
  { reference: 'Galatians 5:1', text: 'It is for freedom that Christ has set us free. Stand firm, then, and do not let yourselves be burdened again by a yoke of slavery.', version: 'NIV' },
  { reference: 'Romans 1:16', text: 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes:', version: 'NIV' },
  { reference: '2 Corinthians 5:20', text: 'We are therefore Christ’s ambassadors, as though God were making his appeal through us.', version: 'NIV' },
  { reference: 'Psalm 119:10-11', text: 'I seek you with all my heart; do not let me stray from your commands. I have hidden your word in my heart', version: 'NIV' },
  { reference: 'Matthew 7:24', text: '“Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock.', version: 'NIV' },
  { reference: 'John 14:21', text: 'Whoever has my commands and keeps them is the one who loves me.', version: 'NIV' },
  { reference: '1 Corinthians 15:58', text: 'Therefore, my dear brothers and sisters, stand firm. Let nothing move you.', version: 'NIV' },
  { reference: 'Ephesians 5:1-2', text: 'Follow God’s example, therefore, as dearly loved children and walk in the way of love,', version: 'NIV' },
  { reference: 'Philippians 3:14', text: 'I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.', version: 'NIV' },
  { reference: 'Colossians 1:16', text: 'For in him all things were created: things in heaven and on earth, visible and invisible,', version: 'NIV' },
  { reference: '2 Timothy 2:15', text: 'Do your best to present yourself to God as one approved, a worker who does not need to be ashamed', version: 'NIV' },
  { reference: 'Hebrews 13:5', text: 'Keep your lives free from the love of money and be content with what you have,', version: 'NIV' },
  { reference: 'James 1:19', text: 'My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry,', version: 'NIV' },
  { reference: '1 Peter 5:8', text: 'Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour.', version: 'NIV' },
  { reference: 'Revelation 3:11', text: 'I am coming soon. Hold on to what you have, so that no one will take your crown.', version: 'NIV' },
  { reference: 'Psalm 18:2', text: 'The LORD is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge,', version: 'NIV' },
  { reference: 'Proverbs 16:3', text: 'Commit to the LORD whatever you do, and he will establish your plans.', version: 'NIV' },
  { reference: 'Isaiah 43:2', text: 'When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you.', version: 'NIV' },
  { reference: 'Lamentations 3:22-23', text: 'Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning;', version: 'NIV' },
  { reference: 'Mark 10:45', text: 'For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.”', version: 'NIV' },
  { reference: 'Luke 9:23', text: 'Then he said to them all: “Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.', version: 'NIV' },
  { reference: 'John 4:24', text: 'God is spirit, and his worshipers must worship in the Spirit and in truth.”', version: 'NIV' },
  { reference: 'Acts 4:12', text: 'Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.”', version: 'NIV' },
  { reference: 'Romans 12:9', text: 'Love must be sincere. Hate what is evil; cling to what is good.', version: 'NIV' },
  { reference: '1 Corinthians 1:18', text: 'For the message of the cross is foolishness to those who are perishing, but to us who are being saved it is the power of God.', version: 'NIV' },
  { reference: 'Galatians 5:16', text: 'So I say, walk by the Spirit, and you will not gratify the desires of the flesh.', version: 'NIV' },
  { reference: 'Ephesians 4:29', text: 'Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up', version: 'NIV' },
  { reference: 'Philippians 4:8', text: 'Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure,', version: 'NIV' },
  { reference: '1 Thessalonians 5:16-18', text: 'Rejoice always, pray continually, give thanks in all circumstances;', version: 'NIV' },
  { reference: 'Titus 2:11-12', text: 'For the grace of God has appeared that offers salvation to all people. It teaches us to say “No” to ungodliness', version: 'NIV' },
  { reference: 'Hebrews 4:14', text: 'Therefore, since we have a great high priest who has ascended into heaven, Jesus the Son of God,', version: 'NIV' },
  { reference: 'James 3:17', text: 'But the wisdom that comes from heaven is first of all pure; then peace-loving, considerate, submissive,', version: 'NIV' },
];
const difficultVerses1 = [
  { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you,” declares the LORD, “plans to prosper you and not to harm you, plans to give you hope and a future.', version: 'NIV' },
  { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', version: 'NIV' },
  { reference: 'Ephesians 2:8-9', text: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God— not by works, so that no one can boast.', version: 'NIV' },
  { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.', version: 'NIV' },
  { reference: 'Isaiah 40:31', text: 'but those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', version: 'NIV' },
  { reference: 'Micah 6:8', text: 'He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.', version: 'NIV' },
  { reference: 'John 15:5', text: 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.', version: 'NIV' },
  { reference: 'Galatians 2:20', text: 'I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God,', version: 'NIV' },
  { reference: 'Isaiah 53:5', text: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.', version: 'NIV' },
  { reference: 'Revelation 21:4', text: '‘He will wipe every tear from their eyes. There will be no more death’ or mourning or crying or pain, for the old order of things has passed away.', version: 'NIV' },
  { reference: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', version: 'NIV' },
  { reference: 'Psalm 91:1-2', text: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the LORD, “He is my refuge and my fortress,', version: 'NIV' },
  { reference: '2 Corinthians 12:9', text: 'But he said to me, “My grace is sufficient for you, for my power is made perfect in weakness.” Therefore I will boast all the more gladly about my weaknesses,', version: 'NIV' },
  { reference: 'Hebrews 12:11', text: 'No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace for those who have been trained by it.', version: 'NIV' },
  { reference: '1 Peter 2:9', text: 'But you are a chosen people, a royal priesthood, a holy nation, God’s special possession, that you may declare the praises of him who called you out of darkness', version: 'NIV' },
  { reference: 'Matthew 7:12', text: 'So in everything, do to others what you would have them do to you, for this sums up the Law and the Prophets.', version: 'NIV' },
  { reference: 'Psalm 136:1', text: 'Give thanks to the LORD, for he is good. His love endures forever.', version: 'NIV' },
  { reference: 'John 13:34-35', text: '“A new command I give you: Love one another. As I have loved you, so you must love one another. By this everyone will know that you are my disciples,', version: 'NIV' },
  { reference: 'James 1:12', text: 'Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life that the Lord has promised to those who love him.', version: 'NIV' },
  { reference: 'Psalm 19:14', text: 'May these words of my mouth and this meditation of my heart be pleasing in your sight, LORD, my Rock and my Redeemer.', version: 'NIV' },
  { reference: 'Proverbs 27:17', text: 'As iron sharpens iron, so one person sharpens another.', version: 'NIV' },
  { reference: 'Isaiah 55:8-9', text: '“For my thoughts are not your thoughts, neither are your ways my ways,” declares the LORD. “As the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts.', version: 'NIV' },
  { reference: 'Habakkuk 3:17-18', text: 'Though the fig tree does not bud and there are no grapes on the vines, though the olive crop fails and the fields produce no food, though there are no sheep in the pen and no cattle in the stalls, yet I will rejoice in the LORD,', version: 'NIV' },
  { reference: 'John 15:13', text: 'Greater love has no one than this: to lay down one’s life for one’s friends.', version: 'NIV' },
  { reference: 'Acts 17:28', text: '‘For in him we live and move and have our being.’ As some of your own poets have said, ‘We are his offspring.’', version: 'NIV' },
  { reference: 'Romans 14:12', text: 'So then, each of us will give an account of ourselves to God.', version: 'NIV' },
  { reference: '1 Corinthians 2:9', text: 'However, as it is written: “What no eye has seen, what no ear has heard, and what no human mind has conceived”', version: 'NIV' },
  { reference: '2 Corinthians 4:17-18', text: 'For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all. So we fix our eyes not on what is seen, but on what is unseen,', version: 'NIV' },
  { reference: 'Galatians 6:2', text: 'Carry each other’s burdens, and in this way you will fulfill the law of Christ.', version: 'NIV' },
  { reference: 'Philippians 3:7-8', text: 'But whatever were gains to me I now consider loss for the sake of Christ. What is more, I consider everything a loss because of the surpassing worth of knowing Christ Jesus my Lord,', version: 'NIV' },
  { reference: 'Colossians 3:1-2', text: 'Since, then, you have been raised with Christ, set your hearts on things above, where Christ is, seated at the right hand of God. Set your minds on things above, not on earthly things.', version: 'NIV' },
  { reference: '1 Timothy 6:6-7', text: 'But godliness with contentment is great gain. For we brought nothing into the world, and we can take nothing out of it.', version: 'NIV' },
  { reference: 'Titus 3:5', text: 'he saved us, not because of righteous things we had done, but because of his mercy. He saved us through the washing of rebirth and renewal by the Holy Spirit,', version: 'NIV' },
  { reference: 'Hebrews 10:23', text: 'Let us hold unswervingly to the hope we profess, for he who promised is faithful.', version: 'NIV' },
  { reference: 'James 2:17', text: 'In the same way, faith by itself, if it is not accompanied by action, is dead.', version: 'NIV' },
  { reference: '1 Peter 1:6-7', text: 'In all this you greatly rejoice, though now for a little while you may have had to suffer grief in all kinds of trials. These have come so that the proven genuineness of your faith—', version: 'NIV' },
  { reference: '2 Peter 1:3', text: 'His divine power has given us everything we need for a godly life through our knowledge of him who called us by his own glory and goodness.', version: 'NIV' },
  { reference: '1 John 4:18', text: 'There is no fear in love. But perfect love drives out fear, because fear has to do with punishment.', version: 'NIV' },
  { reference: 'Jude 1:24-25', text: 'To him who is able to keep you from stumbling and to present you before his glorious presence without fault and with great joy— to the only God our Savior be glory, majesty, power and authority,', version: 'NIV' },
  { reference: 'Revelation 1:8', text: '“I am the Alpha and the Omega,” says the Lord God, “who is, and who was, and who is to come, the Almighty.”', version: 'NIV' },
  { reference: 'Psalm 24:3-4', text: 'Who may ascend the mountain of the LORD? Who may stand in his holy place? The one who has clean hands and a pure heart,', version: 'NIV' },
  { reference: 'Proverbs 14:29', text: 'Whoever is patient has great understanding, but one who is quick-tempered displays folly.', version: 'NIV' },
  { reference: 'Isaiah 64:8', text: 'Yet you, LORD, are our Father. We are the clay, you are the potter; we are all the work of your hand.', version: 'NIV' },
  { reference: 'Daniel 12:3', text: 'Those who are wise will shine like the brightness of the heavens, and those who lead many to righteousness, like the stars for ever and ever.', version: 'NIV' },
  { reference: 'Hosea 6:6', text: 'For I desire mercy, not sacrifice, and acknowledgment of God rather than burnt offerings.', version: 'NIV' },
  { reference: 'Amos 5:24', text: 'But let justice roll on like a river, righteousness like a never-failing stream!', version: 'NIV' },
  { reference: 'Mark 8:36', text: 'What good is it for someone to gain the whole world, yet forfeit their soul?', version: 'NIV' },
  { reference: 'Luke 12:34', text: 'For where your treasure is, there your heart will be also.', version: 'NIV' },
  { reference: 'John 8:36', text: 'So if the Son sets you free, you will be free indeed.', version: 'NIV' },
  { reference: 'Acts 20:24', text: 'However, I consider my life worth nothing to me; my only aim is to finish the race and complete the task the Lord Jesus has given me—', version: 'NIV' },
];
const expertVerses1 = [
  { reference: 'Galatians 5:22-23', text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.', version: 'NIV' },
  { reference: '2 Timothy 3:16-17', text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work.', version: 'NIV' },
  { reference: 'Matthew 28:19-20', text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.', version: 'NIV' },
  { reference: 'Hebrews 12:1-2', text: 'Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.', version: 'NIV' },
  { reference: '1 Corinthians 10:13', text: 'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.', version: 'NIV' },
  { reference: 'Hebrews 4:12', text: 'For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.', version: 'NIV' },
  { reference: 'Matthew 11:28-30', text: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.', version: 'NIV' },
  { reference: 'Philippians 2:3-4', text: 'Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.', version: 'NIV' },
  { reference: 'Acts 1:8', text: 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.', version: 'NIV' },
  { reference: 'Isaiah 9:6', text: 'For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.', version: 'NIV' },
  { reference: 'Ephesians 4:2-3', text: 'Be completely humble and gentle; be patient, bearing with one another in love. Make every effort to keep the unity of the Spirit through the bond of peace.', version: 'NIV' },
  { reference: 'Romans 12:1-2', text: 'Therefore, I urge you, brothers and sisters, in view of God’s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship. Do not conform to the pattern of this world,', version: 'NIV' },
  { reference: 'James 1:2-4', text: 'Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance. Let perseverance finish its work so that you may be mature and complete, not lacking anything.', version: 'NIV' },
  { reference: 'Psalm 1:1-3', text: 'Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers, but whose delight is in the law of the LORD, and who meditates on his law day and night. That person is like a tree planted by streams of water,', version: 'NIV' },
  { reference: 'Hebrews 4:15-16', text: 'For we do not have a high priest who is unable to empathize with our weaknesses, but we have one who has been tempted in every way, just as we are—yet he did not sin. Let us then approach God’s throne of grace with confidence,', version: 'NIV' },
  { reference: 'Matthew 5:3-5', text: '“Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they will be comforted. Blessed are the meek, for they will inherit the earth.', version: 'NIV' },
  { reference: '1 Corinthians 13:4-7', text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth.', version: 'NIV' },
  { reference: 'Ephesians 6:12-13', text: 'For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms. Therefore put on the full armor of God,', version: 'NIV' },
  { reference: 'Revelation 3:20', text: 'Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in and eat with that person, and they with me.', version: 'NIV' },
  { reference: '2 Corinthians 5:21', text: 'God made him who had no sin to be sin for us, so that in him we might become the righteousness of God.', version: 'NIV' },
  { reference: 'Romans 8:31-32', text: 'What, then, shall we say in response to these things? If God is for us, who can be against us? He who did not spare his own Son, but gave him up for us all—how will he not also, along with him, graciously give us all things?', version: 'NIV' },
  { reference: 'Psalm 37:23-24', text: 'The LORD makes firm the steps of the one who delights in him; though he may stumble, he will not fall, for the LORD upholds him with his hand.', version: 'NIV' },
  { reference: 'Isaiah 26:3-4', text: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you. Trust in the LORD forever, for the LORD, the LORD himself, is the Rock eternal.', version: 'NIV' },
  { reference: 'Matthew 6:25-26', text: '“Therefore I tell you, do not worry about your life, what you will eat or drink; or about your body, what you will wear. Is not life more than food, and the body more than clothes? Look at the birds of the air;', version: 'NIV' },
  { reference: 'John 14:2-3', text: 'My Father’s house has many rooms; if that were not so, would I have told you that I am going there to prepare a place for you? And if I go and prepare a place for you, I will come back and take you to be with me', version: 'NIV' },
  { reference: 'Acts 2:38-39', text: 'Peter replied, “Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins. And you will receive the gift of the Holy Spirit. The promise is for you and your children', version: 'NIV' },
  { reference: '1 Corinthians 15:51-52', text: 'Listen, I tell you a mystery: We will not all sleep, but we will all be changed— in a flash, in the twinkling of an eye, at the last trumpet. For the trumpet will sound, the dead will be raised imperishable,', version: 'NIV' },
  { reference: '2 Corinthians 1:3-4', text: 'Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble', version: 'NIV' },
  { reference: 'Philippians 2:5-8', text: 'In your relationships with one another, have the same mindset as Christ Jesus: Who, being in very nature God, did not consider equality with God something to be used to his own advantage; rather, he made himself nothing', version: 'NIV' },
  { reference: 'Colossians 3:12-14', text: 'Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience. Bear with each other and forgive one another if any of you has a grievance against someone.', version: 'NIV' },
  { reference: '1 Timothy 4:12', text: 'Don’t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.', version: 'NIV' },
  { reference: 'Titus 2:7-8', text: 'In everything set them an example by doing what is good. In your teaching show integrity, seriousness and soundness of speech that cannot be condemned, so that those who oppose you may be ashamed', version: 'NIV' },
  { reference: 'Philemon 1:6', text: 'I pray that your partnership with us in the faith may be effective in deepening your understanding of every good thing we share for the sake of Christ.', version: 'NIV' },
  { reference: 'Hebrews 13:15-16', text: 'Through Jesus, therefore, let us continually offer to God a sacrifice of praise—the fruit of lips that openly profess his name. And do not forget to do good and to share with others, for with such sacrifices God is pleased.', version: 'NIV' },
  { reference: 'James 1:27', text: 'Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress and to keep oneself from being polluted by the world.', version: 'NIV' },
  { reference: '1 Peter 2:2-3', text: 'Like newborn babies, crave pure spiritual milk, so that by it you may grow up in your salvation, now that you have tasted that the Lord is good.', version: 'NIV' },
  { reference: '2 Peter 1:5-7', text: 'For this very reason, make every effort to add to your faith goodness; and to goodness, knowledge; and to knowledge, self-control; and to self-control, perseverance; and to perseverance, godliness;', version: 'NIV' },
  { reference: '1 John 3:16', text: 'This is how we know what love is: Jesus Christ laid down his life for us. And we ought to lay down our lives for our brothers and sisters.', version: 'NIV' },
  { reference: 'Revelation 22:12-13', text: '“Look, I am coming soon! My reward is with me, and I will give to each person according to what they have done. I am the Alpha and the Omega, the First and the Last, the Beginning and the End.', version: 'NIV' },
  { reference: 'Psalm 121:1-2', text: 'I lift up my eyes to the mountains— where does my help come from? My help comes from the LORD, the Maker of heaven and earth.', version: 'NIV' },
  { reference: 'Proverbs 4:7', text: 'The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.', version: 'NIV' },
  { reference: 'Ecclesiastes 12:13-14', text: 'Now all has been heard; here is the conclusion of the matter: Fear God and keep his commandments, for this is the duty of all mankind. For God will bring every deed into judgment,', version: 'NIV' },
  { reference: 'Song of Solomon 8:7', text: 'Many waters cannot quench love; rivers cannot sweep it away. If one were to give all the wealth of one’s house for love, it would be utterly scorned.', version: 'NIV' },
  { reference: 'Isaiah 40:8', text: 'The grass withers and the flowers fall, but the word of our God endures forever.”', version: 'NIV' },
  { reference: 'Jeremiah 17:7-8', text: '“But blessed is the one who trusts in the LORD, whose confidence is in him. They will be like a tree planted by the water that sends out its roots by the stream.', version: 'NIV' },
  { reference: 'Ezekiel 36:26-27', text: 'I will give you a new heart and put a new spirit in you; I will remove from you your heart of stone and give you a heart of flesh. And I will put my Spirit in you and move you to follow my decrees', version: 'NIV' },
  { reference: 'Joel 2:28', text: '“And afterward, I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams, your young men will see visions.', version: 'NIV' },
  { reference: 'Nahum 1:7', text: 'The LORD is good, a refuge in times of trouble. He cares for those who trust in him,', version: 'NIV' },
  { reference: 'Zephaniah 3:17', text: 'The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.”', version: 'NIV' },
  { reference: 'Haggai 2:9', text: '‘The glory of this present house will be greater than the glory of the former house,’ says the LORD Almighty. ‘And in this place I will grant peace,’ declares the LORD Almighty.”', version: 'NIV' },
];

const allVerses = [
  // Easy (100 verses = 2 stages of 50)
  ...easyVerses1,
  ...easyVerses2,

  // Hard (100 verses = 2 stages of 50)
  ...hardVerses1, 
  ...hardVerses1, // Repeat for now

  // Difficult (100 verses = 2 stages of 50)
  ...difficultVerses1,
  ...difficultVerses1, // Repeat for now

  // Expert (100 verses = 2 stages of 50)
  ...expertVerses1,
  ...expertVerses1, // Repeat for now
];


const difficulties = [
    { name: 'Easy', name_fil: 'Madali', verseCount: 100, expPerWord: 1, stages: 2, versesPerStage: 50 },
    { name: 'Hard', name_fil: 'Mahirap', verseCount: 100, expPerWord: 2, stages: 2, versesPerStage: 50 },
    { name: 'Difficult', name_fil: 'Mas Mahirap', verseCount: 100, expPerWord: 3, stages: 2, versesPerStage: 50 },
    { name: 'Expert', name_fil: 'Dalubhasa', verseCount: 100, expPerWord: 5, stages: 2, versesPerStage: 50 },
];

type GameState = 'playing' | 'checking' | 'scored' | 'incorrect' | 'incomplete';
type ViewState = 'difficultySelection' | 'stageSelection' | 'verseGrid' | 'game';
type VerseParts = (string | null)[];
type VerseScores = { [difficulty: number]: { [stage: number]: { [verseIndex: number]: number } } };

const isStageComplete = (difficultyIndex: number, stageIndex: number, scores: VerseScores) => {
    const difficultyConfig = difficulties[difficultyIndex];
    const stageScores = scores[difficultyIndex]?.[stageIndex] || {};
    return Object.keys(stageScores).length === difficultyConfig.versesPerStage;
}

const KEYS_FOR_HINTS = 1;

export default function VerseMemoryPage() {
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [currentDifficulty, setCurrentDifficulty] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [verseScores, setVerseScores] = useState<VerseScores>({});
  const { addExp, hints, useHint: spendHint, wisdomKeys, addHints, spendWisdomKeys, verseMemoryMaxVerse, setProgress, lastPlayedDate } = useUserProgress();
  const [language, setLanguage] = useState<'en' | 'fil'>('en');

  const [viewState, setViewState] = useState<ViewState>('difficultySelection');

  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [attemptScore, setAttemptScore] = useState(0);

  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showStageCompleteDialog, setShowStageCompleteDialog] = useState(false);
  const [isVerseMastered, setIsVerseMastered] = useState(false);
  const [showNoHintsDialog, setShowNoHintsDialog] = useState(false);
  const [showHintConfirmDialog, setShowHintConfirmDialog] = useState(false);
  const [stageToReset, setStageToReset] = useState<{difficulty: number, stage: number} | null>(null);
  const [showLockedVerseDialog, setShowLockedVerseDialog] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();
  const { playCorrectSound, playIncorrectSound, playStageCompleteSound } = useSoundEffects();
  
  const [verseWithBlanks, setVerseWithBlanks] = useState<VerseParts>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const loadProgress = useCallback(() => {
    const savedProgress = localStorage.getItem('verseMemoryProgressV2');
    const profileStr = localStorage.getItem('bibleQuestUser');
    if (profileStr) {
        const profile = JSON.parse(profileStr);
        setLanguage(profile.language || 'en');
        setIsAdmin(ADMIN_USERS.includes(profile.username));
    }
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setVerseScores(progress.scores || {});
    }
  }, []);

  const saveProgress = useCallback(() => {
    if (!isClient) return;
    const progress = {
      scores: verseScores,
    };
    localStorage.setItem('verseMemoryProgressV2', JSON.stringify(progress));
  }, [isClient, verseScores]);

  useEffect(() => {
    setIsClient(true);
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
      if (isClient) {
          const today = new Date().toISOString().split('T')[0];
          if (lastPlayedDate !== today) {
              setProgress({
                  lastPlayedDate: today,
                  verseMemoryMaxVerse: verseMemoryMaxVerse + 5,
              });
          }
      }
  }, [isClient, lastPlayedDate, setProgress, verseMemoryMaxVerse]);
  
  useEffect(() => {
    saveProgress();
  }, [verseScores, saveProgress]);

  const handleMastery = (score: number) => {
    const oldScore = verseScores[currentDifficulty]?.[currentStage]?.[currentVerseIndex] ?? 0;
    
    if (score > oldScore) {
        
        const scoreDifference = score - oldScore;
        addExp(scoreDifference);
        
        const newScores = JSON.parse(JSON.stringify(verseScores)); 
        if (!newScores[currentDifficulty]) newScores[currentDifficulty] = {};
        if (!newScores[currentDifficulty][currentStage]) newScores[currentDifficulty][currentStage] = {};
        newScores[currentDifficulty][currentStage][currentVerseIndex] = score;
        setVerseScores(newScores);

        const wasStageCompleteBefore = isStageComplete(currentDifficulty, currentStage, verseScores);
        const isStageCompleteNow = isStageComplete(currentDifficulty, currentStage, newScores);

        if (isStageCompleteNow && !wasStageCompleteBefore) {
            setTimeout(() => {
                setShowStageCompleteDialog(true);
                playStageCompleteSound();
            }, 500);
        } else if (score > 0) {
            playCorrectSound();
        } else {
            playIncorrectSound();
        }

        setIsVerseMastered(true);

        toast({
            title: language === 'fil' ? 'Nakuha ang Puntos!' : 'Verse Attempt Scored!',
            description: language === 'fil' ? `Binabati kita! Nakakuha ka ng ${score} EXP!` : `Congratulations! You earned ${score} EXP!`,
        });
    } else if (score <= 0 && !isVerseMastered) {
        playIncorrectSound();
    }
  };

  const setupRound = useCallback((difficulty: number, stage: number, verseIndex: number) => {
    if (!isClient) return;
    const difficultyConfig = difficulties[difficulty];
    const difficultyVerseStartIndex = difficulties.slice(0, difficulty).reduce((acc, diff) => acc + diff.verseCount, 0);
    const verse = allVerses[difficultyVerseStartIndex + (stage * difficultyConfig.versesPerStage) + verseIndex];

    if (!verse) return;
    
    const mastered = (verseScores[difficulty]?.[stage]?.[verseIndex] ?? 0) > 0;
    setIsVerseMastered(mastered);

    setGameState('playing');
    setEditingIndex(mastered ? null : 0);
    setAttemptScore(0);
    setShowSummaryDialog(false);

    const verseText = verse.text;
    const words = verseText.split(/(\s+|[.,;!?“”"])/).filter(p => p.length > 0);
    
    const missing: string[] = [];
    const verseParts: VerseParts = [];
    
    const wordsToBlank = difficulties[difficulty].expPerWord;
    const potentialBlankIndices = words
        .map((word, index) => ({ word, index }))
        .filter(item => item.word.trim().length > 3 && /^[a-zA-Z\u00C0-\u017F']+$/.test(item.word.trim()))
        .map(item => item.index);
    
    const shuffled = [...potentialBlankIndices].sort(() => Math.random() - 0.5);
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
    inputRefs.current = new Array(missing.length).fill(null);

  }, [isClient, verseScores, language]);

  useEffect(() => {
    if (viewState === 'game') {
      setupRound(currentDifficulty, currentStage, currentVerseIndex);
    }
  }, [viewState, currentDifficulty, currentStage, currentVerseIndex, setupRound]);
  
   useEffect(() => {
    if (editingIndex !== null && inputRefs.current[editingIndex]) {
      inputRefs.current[editingIndex]?.focus();
    }
  }, [editingIndex]);


  const calculateScore = useCallback(() => {
    if (missingWords.length === 0) return 0;
    const correctCount = userInputs.reduce((count, input, index) => {
      const isCorrect = input.toLowerCase().trim() === missingWords[index]?.toLowerCase().trim();
      return isCorrect ? count + 1 : count;
    }, 0);
    
    return Math.min(correctCount, difficulties[currentDifficulty].expPerWord);
  }, [missingWords, userInputs, currentDifficulty]);
  
  const tryAgain = () => {
    const newInputs = userInputs.map((input, index) => {
        const isCorrect = input.toLowerCase().trim() === (missingWords[index] || '').toLowerCase().trim();
        return isCorrect ? input : '';
    });
    setUserInputs(newInputs);

    const firstIncorrectIndex = userInputs.findIndex((input, index) => {
        return input.toLowerCase().trim() !== (missingWords[index] || '').toLowerCase().trim();
    });

    setEditingIndex(firstIncorrectIndex !== -1 ? firstIncorrectIndex : 0);
    setGameState('playing');
    setShowSummaryDialog(false);
  };

  const handleSubmit = () => {
    if (isVerseMastered) return;

    if (userInputs.some(input => input.trim() === '')) {
      setGameState('incomplete');
      playIncorrectSound();
      return;
    }

    const score = calculateScore();
    setGameState(score === missingWords.length ? 'scored' : 'incorrect');
    setEditingIndex(null); // Stop auto-focusing after check
    handleMastery(score);
    setAttemptScore(score);
    setShowSummaryDialog(true);
  };
  
  const handleHintClick = () => {
    if (hints > 0) {
      setShowHintConfirmDialog(true);
    } else {
      setShowNoHintsDialog(true);
    }
  };

  const useAHint = () => {
    if (isVerseMastered) return;
    const success = spendHint();
    if (success) {
      const firstEmptyIndex = userInputs.findIndex(input => input === '');
      if (firstEmptyIndex !== -1) {
        const newInputs = [...userInputs];
        newInputs[firstEmptyIndex] = missingWords[firstEmptyIndex];
        setUserInputs(newInputs);
      }
    }
    setShowHintConfirmDialog(false);
  };
  
  const handleConvertKeys = () => {
    const HINTS_PER_KEY = 7;
    if (wisdomKeys >= KEYS_FOR_HINTS) {
        spendWisdomKeys(KEYS_FOR_HINTS);
        addHints(HINTS_PER_KEY);
        setShowNoHintsDialog(false);
        toast({
            title: language === 'en' ? 'Hints Added!' : 'Mga Pahiwatig Nadagdag!',
            description: language === 'en' ? `You have converted ${KEYS_FOR_HINTS} key for ${HINTS_PER_KEY} new hints.` : `Nagpalit ka ng ${KEYS_FOR_HINTS} susi para sa ${HINTS_PER_KEY} bagong pahiwatig.`
        });
    } else {
         toast({
            variant: 'destructive',
            title: language === 'en' ? 'Not Enough Keys' : 'Kulang ang mga Susi',
            description: language === 'en' ? 'Go to the Forge to get more Wisdom Keys.' : 'Pumunta sa Forge para kumuha pa ng mga Susi ng Karunungan.'
        });
        setShowNoHintsDialog(false);
        router.push('/dashboard/forge');
    }
  };

  const handleSelectDifficulty = (index: number) => {
      setCurrentDifficulty(index);
      setViewState('stageSelection');
  }

  const handleSelectStage = (index: number) => {
      setCurrentStage(index);
      setViewState('verseGrid');
  }
  
  const handleSelectVerse = (index: number) => {
      const globalVerseNumber = (currentDifficulty * 100) + (currentStage * 50) + index + 1;
      
      if (globalVerseNumber > verseMemoryMaxVerse && !isAdmin) {
          setShowLockedVerseDialog(true);
          return;
      }
      setCurrentVerseIndex(index);
      setViewState('game');
  }
  
  const resetStageProgress = (difficulty: number, stage: number) => {
        setVerseScores(prevScores => {
            const newScores = JSON.parse(JSON.stringify(prevScores));
            if (newScores[difficulty] && newScores[difficulty][stage]) {
                delete newScores[difficulty][stage];
            }
            return newScores;
        });
        toast({
            title: `Stage ${stage + 1} progress has been reset.`,
        });
        setStageToReset(null);
    };

 const renderFillInTheBlankVerse = () => {
    if (isVerseMastered) {
      const verseText = currentVerse.text;
      return <p className="font-serif italic text-lg leading-relaxed">{verseText}</p>;
    }

    if (!verseWithBlanks || verseWithBlanks.length === 0) {
      return <div>Loading verse...</div>;
    }

    let inputIndex = -1;
    return (
      <p className="font-serif italic text-lg leading-relaxed">
        {verseWithBlanks.map((part, index) => {
          if (part === null) {
            inputIndex++;
            const currentIndex = inputIndex;
            const isCorrect =
              (gameState === 'scored' || gameState === 'incorrect') &&
              userInputs[currentIndex]?.toLowerCase().trim() ===
                missingWords[currentIndex]?.toLowerCase().trim();

            return (
              <Input
                key={`input-${currentIndex}`}
                ref={(el) => {
                  inputRefs.current[currentIndex] = el;
                }}
                type="text"
                value={userInputs[currentIndex] || ''}
                onClick={() => setEditingIndex(currentIndex)}
                onChange={(e) => {
                  setUserInputs((prev) => {
                    const newInputs = [...prev];
                    newInputs[currentIndex] = e.target.value;
                    return newInputs;
                  });
                  if (gameState === 'incomplete') setGameState('playing');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    setEditingIndex((currentIndex + 1) % missingWords.length);
                  }
                }}
                className={cn(
                  'h-auto p-0 border-0 border-b-2 border-dashed rounded-none focus-visible:ring-0 focus:border-primary bg-transparent text-lg text-center inline-block font-serif italic',
                  gameState === 'incorrect' && !isCorrect && 'border-destructive',
                  isCorrect && 'border-green-500'
                )}
                style={{
                  width: `${Math.max(
                    missingWords[currentIndex]?.length || 0,
                    5
                  ) + 2}ch`,
                }}
                disabled={isVerseMastered}
              />
            );
          }
          return <span key={`word-${index}`}>{part}</span>;
        })}
      </p>
    );
  };
  

  if (!isClient) return null;

  const currentDifficultyData = difficulties[currentDifficulty];
  const difficultyVerseStartIdx = difficulties.slice(0, currentDifficulty).reduce((acc, diff) => acc + diff.verseCount, 0);
  const currentVerse = allVerses[difficultyVerseStartIdx + (currentStage * currentDifficultyData.versesPerStage) + currentVerseIndex];
  const totalMasteredVerses = Object.values(verseScores).flatMap(stage => Object.values(stage).flatMap(verse => Object.keys(verse))).length;

  if (viewState === 'difficultySelection') {
      return (
        <div className="container mx-auto max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                 <Button variant="outline" onClick={() => router.push('/dashboard/games')}>
                    <Home className="mr-2"/> Back to Games
                </Button>
                <div className="text-center">
                    <h1 className="font-headline text-3xl font-bold">{language === 'en' ? 'Verse Memory Challenge' : 'Hamon sa Pagmemorya ng Talata'}</h1>
                    <p className="text-muted-foreground">{language === 'en' ? 'Choose a difficulty to begin.' : 'Pumili ng hirap para magsimula.'}</p>
                </div>
                 <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/forge')}>
                    <Hammer />
                    <span className="sr-only">The Forge</span>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {difficulties.map((diff, index) => (
                    <Card key={diff.name} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectDifficulty(index)}>
                        <CardHeader className="bg-primary/10 rounded-t-lg">
                            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Puzzle />{language === 'en' ? diff.name : diff.name_fil}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="font-bold">{language === 'en' ? `${diff.stages} Stages` : `${diff.stages} Yugto`}</p>
                            <p className="text-sm text-muted-foreground">{language === 'en' ? `${diff.versesPerStage} verses per stage` : `${diff.versesPerStage} talata bawat yugto`}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      )
  }

  if (viewState === 'stageSelection') {
      return (
        <>
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-6 relative">
                    <Button variant="outline" onClick={() => setViewState('difficultySelection')} className="absolute left-0 top-1/2 -translate-y-1/2">
                        <ChevronLeft className="mr-2"/> {language === 'en' ? 'Back' : 'Bumalik'}
                    </Button>
                    <h1 className="font-headline text-3xl font-bold">{language === 'en' ? currentDifficultyData.name : currentDifficultyData.name_fil}</h1>
                    <p className="text-muted-foreground">{language === 'en' ? 'Select a stage to continue.' : 'Pumili ng yugto para magpatuloy.'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: currentDifficultyData.stages}).map((_, index) => {
                        const isCompleted = isStageComplete(currentDifficulty, index, verseScores);
                        return (
                             <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectStage(index)}>
                                <CardHeader className="bg-primary/10 rounded-t-lg p-4">
                                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                                        <Trophy /> {language === 'en' ? `Stage ${index + 1}` : `Yugto ${index + 1}`}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 p-4">
                                     <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm">{`${Object.keys(verseScores[currentDifficulty]?.[index] || {}).length} / ${currentDifficultyData.versesPerStage} ${language === 'en' ? 'Verses Mastered' : 'Talata ang Kabisado'}`}</p>
                                        {isAdmin && (
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setStageToReset({difficulty: currentDifficulty, stage: index})}}>
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {isCompleted && <Badge className="mt-2 bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="mr-2" />{language === 'en' ? 'Stage Complete' : 'Yugto Kumpleto'}</Badge>}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
            {stageToReset && (
                 <AlertDialog open={!!stageToReset} onOpenChange={() => setStageToReset(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to reset this stage?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will erase all your progress for {currentDifficultyData.name} Stage {stageToReset.stage + 1}. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => resetStageProgress(stageToReset.difficulty, stageToReset.stage)}>
                                Yes, Reset
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
      )
  }
  
  if (viewState === 'verseGrid') {
      const difficultyVerseStartIndex = difficulties.slice(0, currentDifficulty).reduce((acc, diff) => acc + diff.verseCount, 0);
      const stageVerseStartIndex = currentStage * currentDifficultyData.versesPerStage;
      const versesForStage = allVerses.slice(difficultyVerseStartIndex + stageVerseStartIndex, difficultyVerseStartIndex + stageVerseStartIndex + currentDifficultyData.versesPerStage);
      
      return (
        <>
        <div className="container mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-center mb-4">
                <Button variant="outline" onClick={() => setViewState('stageSelection')}>
                    <ChevronLeft className="mr-2" /> {language === 'en' ? 'Back to Stages' : 'Balik sa mga Yugto'}
                </Button>
                 <div className="text-center">
                    <h1 className="font-headline text-2xl font-bold">{language === 'en' ? `Stage ${currentStage + 1}` : `Yugto ${currentStage + 1}`}</h1>
                    <p className="text-muted-foreground">{language === 'en' ? currentDifficultyData.name : currentDifficultyData.name_fil}</p>
                </div>
                 <Button variant="outline" size="icon" onClick={() => setLanguage(l => l === 'en' ? 'fil' : 'en')}><Languages className="w-5 h-5"/></Button>
            </div>
             <div className="text-center text-sm text-muted-foreground mb-4">{`You have mastered ${totalMasteredVerses} of ${verseMemoryMaxVerse} available verses. 5 more unlock tomorrow!`}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {versesForStage.map((verse, index) => {
                    const globalVerseNumber = (currentDifficulty * 100) + (currentStage * 50) + index + 1;
                    const score = verseScores[currentDifficulty]?.[currentStage]?.[index] ?? 0;
                    const isMastered = score > 0;
                    const isLocked = globalVerseNumber > verseMemoryMaxVerse && !isMastered && !isAdmin;
                    
                    return (
                        <Card 
                            key={index}
                            onClick={() => handleSelectVerse(index)}
                            className={cn(
                                "hover:shadow-lg hover:-translate-y-1 transition-transform relative overflow-hidden",
                                isLocked ? "bg-muted text-muted-foreground cursor-not-allowed" : "cursor-pointer",
                                isMastered && "border-primary bg-primary/5 text-primary"
                            )}
                        >
                            <CardHeader className="p-4 text-center">
                                <CardTitle className="font-headline text-lg">{verse.reference}</CardTitle>
                            </CardHeader>
                             <CardContent className="p-4 pt-0 text-center">
                                {isLocked ? (
                                    <Lock className="w-6 h-6 mx-auto text-muted-foreground" />
                                ) : isMastered ? (
                                    <div className="flex items-center justify-center gap-1 font-bold text-yellow-500">
                                        <Star className="w-5 h-5 fill-current" /> {score} EXP
                                    </div>
                                ) : (
                                    <PlayCircle className="w-6 h-6 mx-auto text-muted-foreground" />
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
        <AlertDialog open={showLockedVerseDialog} onOpenChange={setShowLockedVerseDialog}>
             <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Lock className="w-10 h-10 text-primary" />
                        </div>
                        <AlertDialogTitle className="font-headline text-2xl text-center">{language === 'en' ? "Verse Locked" : "Naka-lock ang Talata"}</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {language === 'en' ? "You can unlock 5 new verses to master each day. Keep up your daily practice!" : "Maaari kang mag-unlock ng 5 bagong talata bawat araw. Ipagpatuloy ang iyong pang-araw-araw na pagsasanay!"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction onClick={() => setShowLockedVerseDialog(false)}>
                             {language === 'en' ? 'Okay' : 'Sige'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
        </AlertDialog>
        </>
      )
  }
  
  if (viewState === 'game' && currentVerse) {
    return (
        <>
            <div className="container mx-auto max-w-4xl px-4">
                <Button variant="outline" onClick={() => setViewState('verseGrid')} className="mb-4">
                    <ChevronLeft className="mr-2" />
                    {language === 'en' ? 'Back to Level Grid' : 'Balik sa Grid ng Antas'}
                </Button>
                <div className="relative">
                    {isVerseMastered && (
                        <div className="pointer-events-none">
                            <div className="absolute -top-3 -left-3.5 w-16 h-16 overflow-hidden z-10">
                                <div className="absolute transform -rotate-45 bg-primary text-primary-foreground text-center flex items-center justify-center p-1" style={{ width: '150%', left: '-35%', top: '25%' }}>
                                    <CheckCircle2 className="w-4 h-4"/>
                                </div>
                            </div>
                        </div>
                    )}
                    <Card id="verse-memory-card">
                        <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-grow text-center space-y-2">
                                <CardTitle className="font-headline text-2xl">
                                {currentVerse.reference} ({currentVerse.version})
                                </CardTitle>
                                    <CardDescription>{language === 'fil' ? `Talata ${currentVerseIndex + 1} ng ${currentDifficultyData.versesPerStage}` : `Verse ${currentVerseIndex + 1} of ${currentDifficultyData.versesPerStage}`}</CardDescription>
                                <div className="flex justify-center items-center">
                                    {isVerseMastered ? (
                                        <div className="flex items-center gap-1 font-bold text-yellow-500">
                                            <Star className="w-5 h-5 fill-current" /> {verseScores[currentDifficulty]?.[currentStage]?.[currentVerseIndex]} EXP
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Star className="w-5 h-5" /> {language === 'fil' ? 'Hindi pa Kabisado' : 'Not Mastered'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-lg leading-loose text-center">{renderFillInTheBlankVerse()}</div>
                            {gameState === 'incomplete' && <p className="text-destructive text-center font-semibold">{language === 'fil' ? 'Pakiusap, punan ang lahat ng patlang bago suriin.' : 'Please fill in all the blanks before checking.'}</p>}
                            <div className="flex flex-wrap gap-2 justify-center pt-6">
                                {isVerseMastered ? (
                                    <Button onClick={() => handleSelectVerse(currentVerseIndex + 1)} className="w-full" disabled={currentVerseIndex >= currentDifficultyData.versesPerStage - 1}>
                                        {language === 'en' ? 'Next Verse' : 'Susunod na Talata'}
                                    </Button>
                                ) : (
                                    <>
                                    <Button id="check-answer-button" onClick={handleSubmit}>
                                        {language === 'fil' ? 'Suriin ang Sagot' : 'Check My Answer'}
                                    </Button>
                                    <Button id="hint-button" variant="outline" onClick={handleHintClick}>
                                        <HelpCircle className="mr-2 h-4 w-4"/>
                                        {language === 'fil' ? `Pahiwatig (${hints})` : `Hint (${hints})`}
                                    </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <AlertDialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline text-2xl text-center">
                        {language === 'fil' ? 'Puntos' : 'Score'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-base">
                        {language === 'fil' ? `Nakuha mo ang ${attemptScore} sa ${missingWords.length} na mga salita nang tama!` : `You got ${attemptScore} out of ${missingWords.length} words correct!`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {!isVerseMastered && attemptScore < missingWords.length ? (
                        <AlertDialogAction onClick={tryAgain}>{language === 'fil' ? 'Subukang Muli' : 'Try Again'}</AlertDialogAction>
                    ) : null}
                        <AlertDialogAction onClick={() => { setShowSummaryDialog(false); handleSelectVerse(currentVerseIndex + 1);}} disabled={currentVerseIndex >= currentDifficultyData.versesPerStage - 1}>
                        {language === 'en' ? 'Next Verse' : 'Susunod na Talata'}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showStageCompleteDialog} onOpenChange={setShowStageCompleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Trophy className="w-10 h-10 text-primary" />
                        </div>
                        <AlertDialogTitle className="font-headline text-2xl text-center">
                            {language === 'en' ? `Stage ${currentStage + 1} Complete!` : `Yugto ${currentStage + 1} Kumpleto!`}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {language === 'en' ? 'Congratulations! You have mastered all verses in this stage. Keep up the great work!' : 'Binabati kita! Kabisado mo na ang lahat ng talata sa yugtong ito. Ipagpatuloy ang magandang gawain!'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction onClick={() => {
                            setShowStageCompleteDialog(false);
                            setViewState('verseGrid');
                        }}>
                            {language === 'en' ? 'Back to Stage Selection' : 'Balik sa Pagpili ng Yugto'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
    
            <AlertDialog open={showHintConfirmDialog} onOpenChange={setShowHintConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{language === 'en' ? 'Use a Hint?' : 'Gamitin ang Pahiwatig?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {language === 'en' ? 'Are you sure you want to use one of your hints? The first empty blank will be filled in.' : 'Sigurado ka bang gusto mong gamitin ang isa sa iyong mga pahiwatig? Mapupunan ang unang blankong patlang.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{language === 'en' ? 'Cancel' : 'Kanselahin'}</AlertDialogCancel>
                        <AlertDialogAction onClick={useAHint}>
                            {language === 'en' ? 'Yes, Use Hint' : 'Oo, Gamitin'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showNoHintsDialog} onOpenChange={setShowNoHintsDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{language === 'en' ? 'Out of Hints!' : 'Wala nang Pahiwatig!'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {language === 'en' 
                                ? `Would you like to convert ${KEYS_FOR_HINTS} Wisdom Key for 7 new hints? You currently have ${wisdomKeys} keys.` 
                                : `Nais mo bang ipagpalit ang ${KEYS_FOR_HINTS} Susi ng Karunungan para sa 7 bagong pahiwatig? Kasalukuyan kang may ${wisdomKeys} na susi.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{language === 'en' ? 'Maybe Later' : 'Mamaya na lang'}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConvertKeys} disabled={wisdomKeys < KEYS_FOR_HINTS}>
                            <Key className="mr-2 h-4 w-4" /> {language === 'en' ? 'Convert' : 'Ipagpalit'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
  }

  return <div>Loading...</div>
}

const ADMIN_USERS = ['Kaya', 'Scassenger'];
