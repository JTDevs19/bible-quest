
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, XCircle, BrainCircuit, RotateCcw, Lock, PlayCircle, Map, Trophy, Languages, HelpCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { useUserProgress } from '@/hooks/use-user-progress';

const triviaLevels = [
  // Level 1
  [
    { question: "Who was known for his incredible strength, which was tied to his long hair?", options: ["David", "Goliath", "Samson", "Gideon"], answer: "Samson", trivia: "Samson's strength from his uncut hair was part of a Nazirite vow to God.", reference: "Judges 16:17", verseText: "And he told her all his heart, and said to her, 'A razor has never come upon my head, for I have been a Nazirite to God from my mother's womb. If I am shaven, then my strength will leave me, and I shall become weak and be like any other man.'" },
    { question: "Who was swallowed by a great fish after disobeying God?", options: ["Jonah", "Daniel", "Elijah", "Peter"], answer: "Jonah", trivia: "Jonah was in the belly of the fish for three days and three nights before being spit out onto dry land.", reference: "Jonah 1:17", verseText: "Now the LORD had prepared a great fish to swallow Jonah. And Jonah was in the belly of the fish three days and three nights." },
    { question: "Who led the Israelites out of slavery in Egypt?", options: ["Joshua", "Abraham", "Moses", "Jacob"], answer: "Moses", trivia: "Moses received the Ten Commandments from God on Mount Sinai.", reference: "Exodus 3:10", verseText: "So now, go. I am sending you to Pharaoh to bring my people the Israelites out of Egypt." },
    { question: "Who was the courageous queen who saved her people from a plot of destruction?", options: ["Ruth", "Esther", "Mary", "Deborah"], answer: "Esther", trivia: "Esther, a Jewish orphan, became queen of Persia and risked her life to expose Haman's evil plan.", reference: "Esther 4:16", verseText: "Go, gather together all the Jews who are in Susa, and fast for me. Do not eat or drink for three days, night or day. I and my attendants will fast as you do. When this is done, I will go to the king, even though it is against the law. And if I perish, I perish." },
    { question: "Who was the first king of Israel?", options: ["David", "Solomon", "Saul", "Samuel"], answer: "Saul", trivia: "Saul was chosen by God and anointed by the prophet Samuel, but later disobeyed God.", reference: "1 Samuel 10:1", verseText: "Then Samuel took a flask of olive oil and poured it on Saul’s head and kissed him, saying, 'Has not the LORD anointed you ruler over his inheritance?'" },
    { question: "This disciple denied Jesus three times before the rooster crowed.", options: ["Judas", "John", "Thomas", "Peter"], answer: "Peter", trivia: "Despite his denial, Peter was forgiven by Jesus and became a key leader in the early church.", reference: "Matthew 26:75", verseText: "Then Peter remembered the word Jesus had spoken: 'Before the rooster crows, you will disown me three times.' And he went outside and wept bitterly." },
    { question: "Who was thrown into a den of lions but was protected by God?", options: ["Daniel", "Joseph", "Jeremiah", "Shadrach"], answer: "Daniel", trivia: "King Darius was overjoyed to find Daniel alive and decreed that all his people should worship Daniel's God.", reference: "Daniel 6:22", verseText: "My God sent his angel, and he shut the mouths of the lions. They have not hurt me, because I was found innocent in his sight. Nor have I ever done any wrong before you, Your Majesty." },
    { question: "Who was the father of the twelve tribes of Israel?", options: ["Isaac", "Abraham", "Jacob", "Joseph"], answer: "Jacob", trivia: "God changed Jacob's name to Israel, which means 'he struggles with God'.", reference: "Genesis 32:28", verseText: "Then the man said, 'Your name will no longer be Jacob, but Israel, because you have struggled with God and with humans and have overcome.'" },
    { question: "Who was David's best friend and the son of King Saul?", options: ["Joab", "Jonathan", "Absalom", "Nathan"], answer: "Jonathan", trivia: "Jonathan and David's deep friendship is a powerful example of loyalty, even when their families were in conflict.", reference: "1 Samuel 18:1", verseText: "After David had finished talking with Saul, Jonathan became one in spirit with David, and he loved him as himself." },
    { question: "Who was a prophetess and the only female judge of Israel mentioned in the Bible?", options: ["Jael", "Miriam", "Huldah", "Deborah"], answer: "Deborah", trivia: "Deborah would sit under a palm tree and the Israelites would come to her for judgment and wisdom.", reference: "Judges 4:4-5", verseText: "Now Deborah, a prophet, the wife of Lappidoth, was leading Israel at that time. She held court under the Palm of Deborah between Ramah and Bethel in the hill country of Ephraim, and the Israelites went up to her to have their disputes decided." },
  ],
  // Level 2
  [
    { question: "Who was the prophet that confronted King David after his sin with Bathsheba?", options: ["Elijah", "Isaiah", "Nathan", "Samuel"], answer: "Nathan", trivia: "Nathan told David a parable about a rich man and a poor man's lamb to expose his sin.", reference: "2 Samuel 12:7", verseText: "Then Nathan said to David, 'You are the man! This is what the LORD, the God of Israel, says: ‘I anointed you king over Israel, and I delivered you from the hand of Saul.’'" },
    { question: "Who was the mother of John the Baptist?", options: ["Mary", "Elizabeth", "Anna", "Sarah"], answer: "Elizabeth", trivia: "Elizabeth was a relative of Mary, the mother of Jesus, and her pregnancy was a miracle in her old age.", reference: "Luke 1:13", verseText: "But the angel said to him: 'Do not be afraid, Zechariah; your prayer has been heard. Your wife Elizabeth will bear you a son, and you are to call him John.'" },
    { question: "Who was sold into slavery by his brothers but became a powerful ruler in Egypt?", options: ["Esau", "Joseph", "Benjamin", "Reuben"], answer: "Joseph", trivia: "Joseph's ability to interpret dreams, given by God, led to his rise to power in Egypt.", reference: "Genesis 41:41", verseText: "So Pharaoh said to Joseph, 'I hereby put you in charge of the whole land of Egypt.'" },
    { question: "Who was the tax collector that Jesus called to be one of His disciples?", options: ["Zacchaeus", "Nicodemus", "Matthew", "Bartholomew"], answer: "Matthew", trivia: "Matthew, also known as Levi, left his tax booth immediately to follow Jesus and later wrote the Gospel of Matthew.", reference: "Matthew 9:9", verseText: "As Jesus went on from there, he saw a man named Matthew sitting at the tax collector’s booth. 'Follow me,' he told him, and Matthew got up and followed him." },
    { question: "Who was the first Christian martyr?", options: ["Paul", "Peter", "Stephen", "James"], answer: "Stephen", trivia: "Stephen was full of God's grace and power, and he performed great wonders and signs among the people before being stoned to death.", reference: "Acts 7:59", verseText: "While they were stoning him, Stephen prayed, 'Lord Jesus, receive my spirit.'" },
    { question: "Who was the wife of Isaac and mother of Jacob and Esau?", options: ["Leah", "Rachel", "Rebekah", "Sarai"], answer: "Rebekah", trivia: "Rebekah was chosen as Isaac's wife after Abraham's servant prayed for a specific sign at a well.", reference: "Genesis 25:21", verseText: "Isaac prayed to the LORD on behalf of his wife, because she was childless. The LORD answered his prayer, and his wife Rebekah became pregnant." },
    { question: "Who led the Israelites in the battle of Jericho?", options: ["Moses", "Gideon", "Joshua", "Caleb"], answer: "Joshua", trivia: "The walls of Jericho fell after the Israelites marched around the city for seven days, following God's specific instructions.", reference: "Joshua 6:20", verseText: "When the trumpets sounded, the army shouted, and at the sound of the trumpet, when the men gave a loud shout, the wall collapsed; so everyone charged straight in, and they took the city." },
    { question: "Who was the prophet taken up to heaven in a chariot of fire?", options: ["Elisha", "Elijah", "Enoch", "Isaiah"], answer: "Elijah", trivia: "Elijah did not experience a physical death; he was taken directly to heaven in a whirlwind.", reference: "2 Kings 2:11", verseText: "As they were walking along and talking together, suddenly a chariot of fire and horses of fire appeared and separated the two of them, and Elijah went up to heaven in a whirlwind." },
    { question: "Who anointed both Saul and David as kings of Israel?", options: ["Nathan", "Samuel", "Eli", "Ahijah"], answer: "Samuel", trivia: "Samuel was a prophet and the last judge of Israel, bridging the gap between the time of the judges and the monarchy.", reference: "1 Samuel 16:13", verseText: "So Samuel took the horn of oil and anointed him in the presence of his brothers, and from that day on the Spirit of the LORD came powerfully upon David. Samuel then went to Ramah." },
    { question: "Who was the apostle that replaced Judas Iscariot?", options: ["Barnabas", "Silas", "Timothy", "Matthias"], answer: "Matthias", trivia: "The apostles cast lots to choose between Joseph called Barsabbas and Matthias, and the lot fell to Matthias.", reference: "Acts 1:26", verseText: "Then they cast lots, and the lot fell to Matthias; so he was added to the eleven apostles." },
  ],
  // Level 3
  [
    { question: "Who was the cupbearer to the Persian king Artaxerxes and helped rebuild Jerusalem's walls?", options: ["Ezra", "Zerubbabel", "Nehemiah", "Haggai"], answer: "Nehemiah", trivia: "Despite great opposition, Nehemiah led the Jews to rebuild the walls of Jerusalem in just 52 days.", reference: "Nehemiah 2:5", verseText: "and I answered the king, 'If it pleases the king and if your servant has found favor in his sight, let him send me to the city in Judah where my ancestors are buried so that I can rebuild it.'" },
    { question: "Who was the high priest of Jerusalem when Jesus was crucified?", options: ["Annas", "Caiaphas", "Eli", "Phinehas"], answer: "Caiaphas", trivia: "Caiaphas was a key figure in the plot to kill Jesus, arguing it was better for one man to die for the people.", reference: "John 11:49-50", verseText: "Then one of them, named Caiaphas, who was high priest that year, spoke up, 'You know nothing at all! You do not realize that it is better for you that one man die for the people than that the whole nation perish.'" },
    { question: "Who was the wealthy Pharisee who helped bury Jesus?", options: ["Nicodemus", "Joseph of Arimathea", "Simon the Cyrene", "Lazarus"], answer: "Joseph of Arimathea", trivia: "Joseph was a secret disciple of Jesus who bravely asked Pilate for Jesus' body to give Him a proper burial.", reference: "John 19:38", verseText: "Later, Joseph of Arimathea asked Pilate for the body of Jesus. Now Joseph was a disciple of Jesus, but secretly because he feared the Jewish leaders. With Pilate’s permission, he came and took the body away." },
    { question: "Who was the left-handed judge who delivered Israel from the Moabites?", options: ["Othniel", "Ehud", "Shamgar", "Gideon"], answer: "Ehud", trivia: "Ehud crafted a double-edged sword and used his left-handedness to assassinate the obese King Eglon of Moab.", reference: "Judges 3:21", verseText: "Ehud reached with his left hand, drew the sword from his right thigh and plunged it into the king’s belly." },
    { question: "Who was the wife of Uriah the Hittite, with whom David committed adultery?", options: ["Michal", "Abigail", "Bathsheba", "Tamar"], answer: "Bathsheba", trivia: "After David repented of his sin, Bathsheba became the mother of King Solomon.", reference: "2 Samuel 11:27", verseText: "After the time of mourning was over, David had her brought to his house, and she became his wife and bore him a son. But the thing David had done displeased the LORD." },
    { question: "Who was the prophetess who recognized the infant Jesus as the Messiah in the Temple?", options: ["Elizabeth", "Anna", "Phoebe", "Priscilla"], answer: "Anna", trivia: "Anna was a very old widow who never left the temple, worshiping night and day with fasting and prayer.", reference: "Luke 2:38", verseText: "Coming up to them at that very moment, she gave thanks to God and spoke about the child to all who were looking forward to the redemption of Jerusalem." },
    { question: "Who was the sorcerer in Samaria who tried to buy the power of the Holy Spirit?", options: ["Elymas", "Bar-Jesus", "Simon Magus", "Sceva"], answer: "Simon Magus", trivia: "The Apostle Peter rebuked Simon for his wicked request, telling him his heart was not right with God.", reference: "Acts 8:20", verseText: "Peter answered: 'May your money perish with you, because you thought you could buy the gift of God with money!'" },
    { question: "Who was Abraham's nephew, who chose to live in the city of Sodom?", options: ["Lot", "Laban", "Haran", "Nahor"], answer: "Lot", trivia: "Lot was rescued by angels before God destroyed the cities of Sodom and Gomorrah for their wickedness.", reference: "Genesis 19:16", verseText: "When he hesitated, the men grasped his hand and the hands of his wife and of his two daughters and led them safely out of the city, for the LORD was merciful to them." },
    { question: "Who was the successor of the prophet Elijah?", options: ["Elisha", "Hosea", "Amos", "Obadiah"], answer: "Elisha", trivia: "Elisha asked for and received a double portion of Elijah's spirit before he was taken to heaven.", reference: "2 Kings 2:9", verseText: "When they had crossed, Elijah said to Elisha, 'Tell me, what can I do for you before I am taken from you?' 'Let me inherit a double portion of your spirit,' Elisha replied." },
    { question: "Who was the first Gentile convert to Christianity recorded in the book of Acts?", options: ["The Ethiopian Eunuch", "Cornelius", "Lydia", "Sergius Paulus"], answer: "Cornelius", trivia: "Cornelius, a Roman centurion, and his entire household were filled with the Holy Spirit, marking a key moment for the early church.", reference: "Acts 10:44-45", verseText: "While Peter was still speaking these words, the Holy Spirit came on all who heard the message. The circumcised believers who had come with Peter were astonished that the gift of the Holy Spirit had been poured out even on Gentiles." },
  ],
  // Level 4
  [
    { question: "Who was the king of Judah known for his radical religious reforms and repentance?", options: ["Hezekiah", "Josiah", "Uzziah", "Manasseh"], answer: "Josiah", trivia: "King Josiah was only eight years old when he began to reign, and he restored the worship of God after the Book of the Law was found.", reference: "2 Kings 23:25", verseText: "Neither before nor after Josiah was there a king like him who turned to the LORD as he did—with all his heart and with all his soul and with all his strength, in accordance with all the Law of Moses." },
    { question: "Who was the runaway slave whom Paul sent back to his master, Philemon?", options: ["Tychicus", "Epaphras", "Onesimus", "Archippus"], answer: "Onesimus", trivia: "In his letter to Philemon, Paul appealed for him to welcome Onesimus back not as a slave, but as a beloved brother in Christ.", reference: "Philemon 1:15-16", verseText: "Perhaps the reason he was separated from you for a little while was that you might have him back forever— no longer as a slave, but better than a slave, as a dear brother. He is very dear to me but even dearer to you, both as a fellow man and as a brother in the Lord." },
    { question: "Who was the firstborn son of Jacob, who forfeited his birthright?", options: ["Simeon", "Levi", "Judah", "Reuben"], answer: "Reuben", trivia: "Reuben lost his birthright privileges after he defiled his father's marriage bed. He also convinced his brothers not to kill Joseph.", reference: "Genesis 49:3-4", verseText: "Reuben, you are my firstborn, my might, the first sign of my strength, excelling in honor, excelling in power. Turbulent as the waters, you will no longer excel, for you went up onto your father’s bed, onto my couch and defiled it." },
    { question: "Who was the prophet commanded by God to marry a prostitute as a symbol of Israel's unfaithfulness?", options: ["Jeremiah", "Hosea", "Ezekiel", "Amos"], answer: "Hosea", trivia: "Hosea's marriage to the unfaithful Gomer was a living illustration of God's steadfast love for the unfaithful nation of Israel.", reference: "Hosea 1:2", verseText: "When the LORD began to speak through Hosea, the LORD said to him, 'Go, marry a promiscuous woman and have children with her, for like an adulterous wife this land is guilty of unfaithfulness to the LORD.'" },
    { question: "Who was the artisan, filled with the Spirit of God, who oversaw the construction of the Tabernacle?", options: ["Oholiab", "Huram-abi", "Bezalel", "Hiram of Tyre"], answer: "Bezalel", trivia: "God specifically gifted Bezalel with skill, intelligence, and knowledge in all kinds of crafts to build the Tabernacle and its furnishings.", reference: "Exodus 31:2-3", verseText: "'See, I have chosen Bezalel son of Uri, the son of Hur, of the tribe of Judah, and I have filled him with the Spirit of God, with wisdom, with understanding, with knowledge and with all kinds of skills'" },
    { question: "Who was the Roman governor who presided over the trial of Jesus?", options: ["Herod Antipas", "Felix", "Festus", "Pontius Pilate"], answer: "Pontius Pilate", trivia: "Although Pilate found no basis for a charge against Jesus, he washed his hands before the crowd and handed him over to be crucified.", reference: "Matthew 27:24", verseText: "When Pilate saw that he was getting nowhere, but that instead an uproar was starting, he took water and washed his hands in front of the crowd. 'I am innocent of this man’s blood,' he said. 'It is your responsibility!'" },
    { question: "Who was the mother of King Solomon?", options: ["Haggith", "Bathsheba", "Abishag", "Michal"], answer: "Bathsheba", trivia: "After being the wife of Uriah, then David, Bathsheba became the influential Queen Mother during Solomon's reign.", reference: "1 Kings 1:31", verseText: "Then Bathsheba bowed down with her face to the ground, prostrating herself before the king, and said, 'May my lord King David live forever!'" },
    { question: "Who was the man who had to be convinced of Jesus' resurrection by touching His wounds?", options: ["Philip", "Andrew", "Thomas", "Bartholomew"], answer: "Thomas", trivia: "After touching Jesus' wounds, Thomas made one of the clearest declarations of Jesus' divinity in the Bible: 'My Lord and my God!'", reference: "John 20:27-28", verseText: "Then he said to Thomas, 'Put your finger here; see my hands. Reach out your hand and put it into my side. Stop doubting and believe.' Thomas said to him, 'My Lord and my God!'" },
    { question: "Who was the captain of the Syrian army, cured of leprosy by Elisha?", options: ["Naaman", "Ben-Hadad", "Hazael", "Ziba"], answer: "Naaman", trivia: "Naaman was healed after he humbled himself and obeyed the prophet Elisha's instruction to dip seven times in the Jordan River.", reference: "2 Kings 5:14", verseText: "So he went down and dipped himself in the Jordan seven times, as the man of God had told him, and his flesh was restored and became clean like that of a young boy." },
    { question: "Who was the seller of purple cloth from Thyatira who became a believer in Philippi?", options: ["Dorcas", "Chloe", "Lydia", "Phoebe"], answer: "Lydia", trivia: "Lydia is considered the first documented convert to Christianity in Europe. Her entire household was baptized.", reference: "Acts 16:14", verseText: "One of those listening was a woman from the city of Thyatira named Lydia, a dealer in purple cloth. She was a worshiper of God. The Lord opened her heart to respond to Paul’s message." },
  ],
  // Level 5
  [
    { question: "Who was the grandfather of King David?", options: ["Jesse", "Boaz", "Obed", "Salmon"], answer: "Obed", trivia: "Obed was the son of Boaz and Ruth, making him a key ancestor in the lineage of both David and Jesus.", reference: "Ruth 4:17", verseText: "The women living there said, 'Naomi has a son!' And they named him Obed. He was the father of Jesse, the father of David." },
    { question: "Who was the priest and king of Salem who met Abraham with bread and wine?", options: ["Melchizedek", "Jethro", "Adonizedek", "Abimelech"], answer: "Melchizedek", trivia: "Melchizedek is a mysterious figure who blessed Abraham. The book of Hebrews presents him as a prefigurement of Christ.", reference: "Genesis 14:18", verseText: "Then Melchizedek king of Salem brought out bread and wine. He was priest of God Most High," },
    { question: "Who was the prophet who saw a vision of a valley of dry bones coming to life?", options: ["Isaiah", "Jeremiah", "Ezekiel", "Daniel"], answer: "Ezekiel", trivia: "This powerful vision symbolized God's promise to restore the nation of Israel from its 'death' in exile.", reference: "Ezekiel 37:4-5", verseText: "Then he said to me, 'Prophesy to these bones and say to them, ‘Dry bones, hear the word of the LORD! This is what the Sovereign LORD says to these bones: I will make breath enter you, and you will come to life.'" },
    { question: "Who was the wicked queen of Israel, wife of Ahab, who promoted the worship of Baal?", options: ["Jezebel", "Athaliah", "Herodias", "Delilah"], answer: "Jezebel", trivia: "Jezebel was a Phoenician princess who fiercely opposed the prophets of God, especially Elijah.", reference: "1 Kings 21:25", verseText: "There was never anyone like Ahab, who sold himself to do evil in the eyes of the LORD, urged on by Jezebel his wife." },
    { question: "Who was the Jewish official in the Persian court who foiled Haman's plot to kill the Jews?", options: ["Daniel", "Nehemiah", "Ezra", "Mordecai"], answer: "Mordecai", trivia: "Mordecai was the cousin and guardian of Queen Esther. He refused to bow to Haman, triggering the evil plot.", reference: "Esther 3:2", verseText: "All the royal officials at the king’s gate knelt down and paid honor to Haman, for the king had commanded this concerning him. But Mordecai would not kneel down or pay him honor." },
    { question: "Who was the son of Jonathan, who was lame in his feet and shown kindness by David?", options: ["Mephibosheth", "Ish-Bosheth", "Adonijah", "Amnon"], answer: "Mephibosheth", trivia: "David restored to Mephibosheth all the land of his grandfather Saul and had him eat at the king's table, fulfilling his covenant with Jonathan.", reference: "2 Samuel 9:7", verseText: "'Don’t be afraid,' David said to him, 'for I will surely show you kindness for the sake of your father Jonathan. I will restore to you all the land that belonged to your grandfather Saul, and you will always eat at my table.'" },
    { question: "Who were the couple who lied to the Holy Spirit about the sale of their property and died as a result?", options: ["Aquila and Priscilla", "Ananias and Sapphira", "Philemon and Apphia", "Andronicus and Junia"], answer: "Ananias and Sapphira", trivia: "Their sin was not in keeping some of the money, but in lying to the apostles and testing the Spirit of the Lord.", reference: "Acts 5:3", verseText: "Then Peter said, 'Ananias, how is it that Satan has so filled your heart that you have lied to the Holy Spirit and have kept for yourself some of the money you received for the land?'" },
    { question: "Who was the second king of the northern kingdom of Israel, known for the phrase 'the sins of... who caused Israel to sin'?", options: ["Ahab", "Omri", "Jeroboam", "Baasha"], answer: "Jeroboam", trivia: "Jeroboam set up golden calves in Bethel and Dan to prevent the northern tribes from worshiping in Jerusalem, leading Israel into idolatry.", reference: "1 Kings 12:28-29", verseText: "After seeking advice, the king made two golden calves. He said to the people, 'It is too much for you to go up to Jerusalem. Here are your gods, Israel, who brought you up out of Egypt.' One he set up in Bethel, and the other in Dan." },
    { question: "Who was the prophet from Tekoa who was a shepherd and a tender of sycamore-fig trees?", options: ["Micah", "Hosea", "Joel", "Amos"], answer: "Amos", trivia: "Amos was not a 'professional' prophet but was called by God to deliver a message of social justice and repentance to the northern kingdom of Israel.", reference: "Amos 7:14-15", verseText: "Amos answered Amaziah, 'I was neither a prophet nor the son of a prophet, but I was a shepherd, and I also took care of sycamore-fig trees. But the LORD took me from tending the flock and said to me, ‘Go, prophesy to my people Israel.’'" },
    { question: "Who was Paul's 'true son in the faith' to whom he wrote two epistles?", options: ["Titus", "Timothy", "Silas", "Luke"], answer: "Timothy", trivia: "Timothy was a young and trusted companion of Paul on his missionary journeys and became a leader in the church at Ephesus.", reference: "1 Timothy 1:2", verseText: "To Timothy my true son in the faith: Grace, mercy and peace from God the Father and Christ Jesus our Lord." },
  ],
  // Level 6
  [
    { question: "Who was the wife of Moses?", options: ["Miriam", "Zipporah", "Jochebed", "Elisheba"], answer: "Zipporah", trivia: "Zipporah was the daughter of Jethro, a priest of Midian. She met Moses after he fled from Egypt.", reference: "Exodus 2:21", verseText: "Moses was content to live with the man, and he gave Moses his daughter Zipporah in marriage." },
    { question: "Who was the first high priest of Israel?", options: ["Aaron", "Levi", "Moses", "Nadab"], answer: "Aaron", trivia: "Aaron was Moses' older brother. His line of descendants became the high priests of Israel.", reference: "Exodus 28:1", verseText: "'Have Aaron your brother brought to you from among the Israelites, along with his sons Nadab and Abihu, Eleazar and Ithamar, so they may serve me as priests.'" },
    { question: "Who was the mother of Samuel?", options: ["Peninnah", "Naomi", "Hannah", "Ruth"], answer: "Hannah", trivia: "Hannah was barren and prayed earnestly to God for a son, promising to dedicate him to the Lord's service.", reference: "1 Samuel 1:20", verseText: "So in the course of time Hannah became pregnant and gave birth to a son. She named him Samuel, saying, 'Because I asked the LORD for him.'" },
    { question: "Who was the father of John the Baptist?", options: ["Simeon", "Joseph", "Zechariah", "Herod"], answer: "Zechariah", trivia: "Zechariah was a priest who was struck mute by the angel Gabriel for his disbelief, and he could not speak until John was born.", reference: "Luke 1:20", verseText: "And now you will be silent and not able to speak until the day this happens, because you did not believe my words, which will come true at their appointed time." },
    { question: "Who was the greedy servant of Elisha who was struck with leprosy?", options: ["Naaman", "Gehazi", "Obadiah", "Ziba"], answer: "Gehazi", trivia: "Gehazi secretly took payment from Naaman after he was healed, and as punishment, Naaman's leprosy was transferred to him.", reference: "2 Kings 5:27", verseText: "Naaman’s leprosy will cling to you and to your descendants forever.' Then Gehazi went from Elisha’s presence and his skin was leprous—it had become as white as snow." },
    { question: "Who was the father-in-law of Moses who gave him wise advice?", options: ["Reuel", "Laban", "Jethro", "Hobab"], answer: "Jethro", trivia: "Jethro advised Moses to appoint judges to help him bear the burden of leading the people, a foundational principle of delegation.", reference: "Exodus 18:21", verseText: "But select capable men from all the people—men who fear God, trustworthy men who hate dishonest gain—and appoint them as officials over thousands, hundreds, fifties and tens." },
    { question: "Who was the first person recorded to be raised from the dead by Jesus?", options: ["Lazarus", "Jairus's daughter", "The widow of Nain's son", "Tabitha"], answer: "The widow of Nain's son", trivia: "Jesus was filled with compassion for the grieving widow and brought her only son back to life.", reference: "Luke 7:14-15", verseText: "Then he went up and touched the bier they were carrying him on, and the bearers stood still. He said, 'Young man, I say to you, get up!' The dead man sat up and began to talk, and Jesus gave him back to his mother." },
    { question: "Who was the sister of Lazarus and Mary who sat at Jesus' feet to listen to his teaching?", options: ["Salome", "Joanna", "Martha", "Susanna"], answer: "Martha", trivia: "Jesus gently reminded her that while she was busy with many tasks, Mary had chosen what was better by listening to Him.", reference: "Luke 10:41-42", verseText: "'Martha, Martha,' the Lord answered, 'you are worried and upset about many things, but few things are needed—or indeed only one. Mary has chosen what is better, and it will not be taken away from her.'" },
    { question: "Who was the Roman centurion in Caesarea who was one of the first Gentile converts?", options: ["Julius", "Longinus", "Cornelius", "Valerius"], answer: "Cornelius", trivia: "The conversion of Cornelius and his household, following a vision given to both him and Peter, was a pivotal moment in the early church's mission to the Gentiles.", reference: "Acts 10:1-2", verseText: "At Caesarea there was a man named Cornelius, a centurion in what was known as the Italian Regiment. He and all his family were devout and God-fearing; he gave generously to those in need and prayed to God regularly." },
    { question: "Who was the woman from Joppa, known for her good deeds, whom Peter raised from the dead?", options: ["Lydia", "Phoebe", "Dorcas", "Priscilla"], answer: "Dorcas", trivia: "Dorcas, also called Tabitha, was always doing good and helping the poor. After her death, the widows showed Peter the robes and other clothing she had made.", reference: "Acts 9:40", verseText: "Peter sent them all out of the room; then he got down on his knees and prayed. Turning toward the dead woman, he said, 'Tabitha, get up.' She opened her eyes, and seeing Peter she sat up." }
  ],
  // Level 7
  [
    { question: "Who was the son of Isaac that sold his birthright for a bowl of stew?", options: ["Jacob", "Reuben", "Esau", "Judah"], answer: "Esau", trivia: "Esau, a skillful hunter, despised his birthright in a moment of hunger, a decision he later regretted bitterly.", reference: "Genesis 25:34", verseText: "Then Jacob gave Esau some bread and some lentil stew. He ate and drank, and then got up and left. So Esau despised his birthright." },
    { question: "Who was the prophet that challenged the prophets of Baal on Mount Carmel?", options: ["Elisha", "Jeremiah", "Isaiah", "Elijah"], answer: "Elijah", trivia: "God sent down fire from heaven to consume Elijah's sacrifice, proving He was the one true God in a dramatic showdown.", reference: "1 Kings 18:38", verseText: "Then the fire of the LORD fell and burned up the sacrifice, the wood, the stones and the soil, and also licked up the water in the trench." },
    { question: "Who was the judge of Israel that defeated a vast Midianite army with only 300 men?", options: ["Jephthah", "Samson", "Ehud", "Gideon"], answer: "Gideon", trivia: "God reduced Gideon's army from 32,000 to 300 to show that the victory was His alone, not by human strength.", reference: "Judges 7:7", verseText: "The LORD said to Gideon, 'With the three hundred men that lapped I will save you and give the Midianites into your hands. Let all the others go home.'" },
    { question: "Sino ang alagad na kilala bilang 'ang Zelote'?", options: ["Simon Peter", "Simon", "Andrew", "James"], answer: "Simon", trivia: "The Zealots were a political movement that sought to incite the people of Judea to rebel against the Roman Empire.", reference: "Luke 6:15", verseText: "Matthew, Thomas, James son of Alphaeus, Simon who was called the Zealot," },
    { question: "Sino ang hari ng Babilonia na nakakita ng sulat sa pader?", options: ["Nabucodonosor", "Dario", "Ciro", "Belsasar"], answer: "Belsasar", trivia: "Daniel interpreted the mysterious writing, which foretold the imminent downfall of Belshazzar's kingdom to the Medes and Persians.", reference: "Daniel 5:25", verseText: "This is the inscription that was written: MENE, MENE, TEKEL, PARSIN." },
    { question: "Sino ang dalawang espiya na ipinadala ni Josue na itinago ni Rahab sa Jerico?", options: ["Caleb at Finees", "Gerson at Merari", "Only one is named", "They are unnamed"], answer: "They are unnamed", trivia: "Though their names aren't given, their mission was crucial for the Israelite victory at Jericho, thanks to Rahab's help.", reference: "Joshua 2:1", verseText: "Then Joshua son of Nun secretly sent two spies from Shittim. 'Go, look over the land,' he said, 'especially Jericho.' So they went and entered the house of a prostitute named Rahab and stayed there." },
    { question: "Sino ang babaeng unang nakakita sa muling nabuhay na si Hesus?", options: ["Maria, ina ni Hesus", "Maria Magdalena", "Salome", "Juana"], answer: "Maria Magdalena", trivia: "Mary Magdalene was a devoted follower of Jesus, and she was given the honor of being the first witness to His resurrection.", reference: "John 20:16", verseText: "Jesus said to her, 'Mary.' She turned toward him and cried out in Aramaic, 'Rabboni!' (which means 'Teacher')." },
    { question: "Sino ang co-worker with Paul, isang doktor sa propesyon, na sumulat ng isang Ebanghelyo at ang aklat ng Mga Gawa?", options: ["Mark", "Luke", "Silas", "Barnabas"], answer: "Luke", trivia: "Luke was a meticulous historian and a faithful companion to Paul, providing detailed accounts of Jesus' life and the early church.", reference: "Colossians 4:14", verseText: "Our dear friend Luke, the doctor, and Demas send greetings." },
    { question: "Sino ang punong saserdote na gumabay sa batang propeta na si Samuel?", options: ["Phinehas", "Ahimelech", "Eli", "Abiathar"], answer: "Eli", trivia: "Though his own sons were wicked, Eli recognized God's call on Samuel's life and guided him in his early prophetic ministry.", reference: "1 Samuel 3:9", verseText: "So Eli told Samuel, 'Go and lie down, and if he calls you, say, ‘Speak, LORD, for your servant is listening.’' So Samuel went and lay down in his place." },
    { question: "Sino ang propeta na tinawag ng Diyos na 'anak ng tao' nang higit sa 90 beses?", options: ["Isaiah", "Jeremiah", "Ezekiel", "Daniel"], answer: "Ezekiel", trivia: "This title emphasized Ezekiel's humanity in contrast to the divine glory of God, to whom he was a messenger during the Babylonian exile.", reference: "Ezekiel 2:1", verseText: "He said to me, 'Son of man, stand up on your feet and I will speak to you.'" }
  ],
  // Level 8
  [
    { question: "Who was the man who walked with God and was taken away without experiencing death?", options: ["Noah", "Elijah", "Methuselah", "Enoch"], answer: "Enoch", trivia: "Enoch's life was so pleasing to God that he was spared from physical death, a rare honor mentioned in both Genesis and Hebrews.", reference: "Genesis 5:24", verseText: "Enoch walked faithfully with God; then he was no more, because God took him away." },
    { question: "Who was the prophetess who led Israel with Barak to defeat the Canaanite army?", options: ["Jael", "Miriam", "Huldah", "Deborah"], answer: "Deborah", trivia: "Deborah was a prophetess and the only female judge of Israel, leading both spiritually and militarily.", reference: "Judges 4:6", verseText: "She sent for Barak son of Abinoam from Kedesh in Naphtali and said to him, 'The LORD, the God of Israel, commands you: ‘Go, take with you ten thousand men of Naphtali and Zebulun and lead them up to Mount Tabor.’'" },
    { question: "Who was the first king of the northern kingdom of Israel after the nation split?", options: ["Rehoboam", "Omri", "Ahab", "Jeroboam"], answer: "Jeroboam", trivia: "Jeroboam led the rebellion of the ten northern tribes against Rehoboam and established his own kingdom, but led Israel into idolatry.", reference: "1 Kings 12:20", verseText: "When all the Israelites heard that Jeroboam had returned, they sent and called him to the assembly and made him king over all Israel. Only the tribe of Judah remained loyal to the house of David." },
    { question: "Who was the woman who anointed Jesus' feet with expensive perfume and wiped them with her hair?", options: ["Mary of Bethany", "Mary Magdalene", "The sinful woman", "Joanna"], answer: "Mary of Bethany", trivia: "This act of lavish devotion, sister of Martha and Lazarus, was commended by Jesus as a beautiful thing done in preparation for His burial.", reference: "John 12:3", verseText: "Then Mary took about a pint of pure nard, an expensive perfume; she poured it on Jesus’ feet and wiped his feet with her hair. And the house was filled with the fragrance of the perfume." },
    { question: "Who were the three friends of Daniel who were thrown into a fiery furnace?", options: ["Shadrach, Meshach, and Abednego", "Hananiah, Mishael, and Azariah", "Both A and B", "Belteshazzar, Arioch, and Ashpenaz"], answer: "Both A and B", trivia: "Shadrach, Meshach, and Abednego were their Babylonian names, while Hananiah, Mishael, and Azariah were their Hebrew names.", reference: "Daniel 3:25", verseText: "He said, 'Look! I see four men walking around in the fire, unbound and unharmed, and the fourth looks like a son of the gods.'" },
    { question: "Who was the prominent female leader in the early church at Philippi?", options: ["Phoebe", "Priscilla", "Lydia", "Euodia"], answer: "Lydia", trivia: "Lydia was a dealer in purple cloth and a worshiper of God. After her conversion, her home became a center for the church in Philippi.", reference: "Acts 16:14", verseText: "One of those listening was a woman from the city of Thyatira named Lydia, a dealer in purple cloth. She was a worshiper of God. The Lord opened her heart to respond to Paul’s message." },
    { question: "Sino ang reyna na inalis sa pwesto dahil sa pagtangging humarap sa kanyang asawang si Haring Xerxes?", options: ["Esther", "Jezebel", "Vashti", "Athaliah"], answer: "Vashti", trivia: "Vashti's defiance led to her removal as queen, which providentially opened the way for Esther to take her place and save the Jewish people.", reference: "Esther 1:12", verseText: "But when the attendants delivered the king’s command, Queen Vashti refused to come. Then the king became furious and burned with anger." },
    { question: "Sino ang alagad na nakita ni Hesus na nakaupo sa ilalim ng puno ng igos bago siya tawagin?", options: ["Philip", "Nathanael", "Andrew", "Thaddaeus"], answer: "Nathanael", trivia: "Jesus' supernatural knowledge of Nathanael's location convinced him that Jesus was the Son of God and the King of Israel.", reference: "John 1:48", verseText: "'How do you know me?' Nathanael asked. Jesus answered, 'I saw you while you were still under the fig tree before Philip called you.'" },
    { question: "Sino ang prokonsul ng Ciprus na naging mananampalataya matapos bulagin ni Pablo ang isang salamangkero?", options: ["Gallio", "Felix", "Sergius Paulus", "Publius"], answer: "Sergius Paulus", trivia: "When Sergius Paulus, an intelligent man, saw the miracle, he believed, for he was amazed at the teaching about the Lord.", reference: "Acts 13:12", verseText: "When the proconsul saw what had happened, he believed, for he was amazed at the teaching about the Lord." },
    { question: "Sino ang magsasakang propeta mula sa timog na kaharian ng Juda na ipinadala upang magpropesiya laban sa hilagang kaharian ng Israel?", options: ["Hosea", "Amos", "Obadiah", "Micah"], answer: "Amos", trivia: "Amos was not a professional prophet but a shepherd and a sycamore-fig farmer. He preached a powerful message of social justice and divine judgment.", reference: "Amos 7:14", verseText: "Amos answered Amaziah, 'I was neither a prophet nor the son of a prophet, but I was a shepherd, and I also took care of sycamore-fig trees.'" }
  ],
  // Level 9
  [
    { question: "Sino ang apo ni Saul na pinakitaan ni David ng kabaitan alang-alang kay Jonathan?", options: ["Is-boset", "Mefiboset", "Mica", "Armoni"], answer: "Mefiboset" },
    { question: "Sino ang mahusay magsalitang Hudyo mula sa Alejandria na nagturo nang may kapangyarihan sa Efeso ngunit alam lamang ang bautismo ni Juan?", options: ["Aquila", "Priscila", "Apolos", "Tiquico"], answer: "Apolos", trivia: "Priscilla and Aquila took him aside and explained the way of God more accurately, and he became a great asset to the early church.", reference: "Acts 18:24", verseText: "Meanwhile a Jew named Apollos, a native of Alexandria, came to Ephesus. He was a learned man, with a thorough knowledge of the Scriptures." },
    { question: "Sino ang hari ng Juda na tinamaan ng ketong dahil sa pangahas na pag-aalay ng insenso sa templo?", options: ["Uzias", "Jotam", "Ahaz", "Hezekias"], answer: "Uzias", trivia: "Though he started his reign well, King Uzziah's pride led him to usurp the role of the priests, resulting in divine judgment.", reference: "2 Chronicles 26:19", verseText: "Uzziah, who had a censer in his hand to burn incense, became angry. While he was raging at the priests in their presence before the incense altar in the LORD’s temple, leprosy broke out on his forehead." },
    { question: "Sino ang propeta na ang balumbon ay pinutol at sinunog ni Haring Jehoiakim?", options: ["Isaiah", "Ezekiel", "Habakkuk", "Jeremiah"], answer: "Jeremias", trivia: "Despite the king's defiance, God commanded Jeremiah to write all the words again on another scroll, adding many similar words.", reference: "Jeremiah 36:23", verseText: "Whenever Jehudi had read three or four columns of the scroll, the king cut them off with a scribe’s knife and threw them into the firepot, until the entire scroll was burned in the fire." },
    { question: "Sino ang tumakas na alipin mula sa Colosas na kung kanino sumulat si Pablo ng isang apela sa kanyang amo?", options: ["Philemon", "Archippus", "Tychicus", "Onesimus"], answer: "Onesimo", trivia: "Paul converted Onesimus to Christianity and sent him back to his master Philemon, not as a slave, but as a beloved brother in Christ.", reference: "Philemon 1:16", verseText: "no longer as a slave, but better than a slave, as a dear brother. He is very dear to me but even dearer to you, both as a fellow man and as a brother in the Lord." },
    { question: "Sino ang lalaki mula sa Cirene na pinilit na pasanin ang krus ni Hesus?", options: ["Simon", "Alejandro", "Rufo", "Jose"], answer: "Simon", trivia: "Mark's gospel mentions that this Simon was the father of Alexander and Rufus, suggesting they were known to the early Christian community.", reference: "Mark 15:21", verseText: "A certain man from Cyrene, Simon, the father of Alexander and Rufus, was passing by on his way in from the country, and they forced him to carry the cross." },
    { question: "Sino ang tapat na kaibigan at kapwa bilanggo ni Pablo, na binanggit sa pagtatapos ng Colosas?", options: ["Epaphras", "Tychicus", "Aristarchus", "Demas"], answer: "Aristarco", trivia: "Aristarchus, a Macedonian from Thessalonica, was a loyal companion who traveled with Paul and shared in his imprisonments.", reference: "Colossians 4:10", verseText: "My fellow prisoner Aristarchus sends you his greetings, as does Mark, the cousin of Barnabas." },
    { question: "Sino ang ama ni Matusalem at lolo sa tuhod ni Noe?", options: ["Jared", "Lamec", "Mahalalel", "Enoch"], answer: "Enoch", trivia: "Enoch is one of only two men in the Bible (the other being Elijah) who did not experience death but was taken directly by God.", reference: "Genesis 5:22", verseText: "After he became the father of Methuselah, Enoch walked faithfully with God 300 years and had other sons and daughters." },
    { question: "Sino ang propetisang nagkumpirma sa pagiging tunay ng Aklat ng Kautusan na natagpuan noong panahon ni Haring Josias?", options: ["Deborah", "Miriam", "No-adiah", "Huldah"], answer: "Hulda", trivia: "Huldah's prophecy validated the found scripture and spurred on Josiah's great religious reforms in Judah.", reference: "2 Kings 22:14", verseText: "Hilkiah the priest, Ahikam, Akbor, Shaphan and Asaiah went to speak to the prophet Huldah, who was the wife of Shallum son of Tikvah, the son of Harhas, keeper of the wardrobe. She lived in Jerusalem, in the New Quarter." },
    { question: "Sino ang anak nina Jacob at Lea, na ang mga inapo ay naging tribong saserdote ng Israel?", options: ["Reuben", "Simeon", "Levi", "Judah"], answer: "Levi", trivia: "Because of their zeal for the Lord, the tribe of Levi was set apart for the service of the tabernacle and temple, not receiving a territorial inheritance like the other tribes.", reference: "Numbers 3:12", verseText: "'I have taken the Levites from among the Israelites in place of the first male offspring of every Israelite woman. The Levites are mine,'" }
  ],
  // Level 10
  [
    { question: "Sino ang hukom na gumawa ng padalus-dalos na panata na nagresulta sa pag-aalay ng kanyang anak na babae?", options: ["Gideon", "Samson", "Ibzan", "Jefte"], answer: "Jefte" },
    { question: "Sino ang unang Kristiyanong nakumberte sa Europa?", options: ["Ang Bating na taga-Filipos", "Dionisio", "Lidia", "Damaris"], answer: "Lidia" },
    { question: "Sino ang eskriba at pari na namuno sa ikalawang grupo ng mga bihag pabalik sa Jerusalem mula sa Babilonia?", options: ["Nehemias", "Zerubabel", "Hagai", "Ezra"], answer: "Ezra" },
    { question: "Sino ang alagad na isang maniningil ng buwis bago siya tinawag ni Hesus?", options: ["Mateo", "Zaqueo", "Simon na Zelote", "Jose ng Arimatea"], answer: "Mateo" },
    { question: "Sino ang dalawang anak ni Zebedeo, na kilala rin bilang 'Mga Anak ng Kulog'?", options: ["Pedro at Andres", "Felipe at Bartolome", "Santiago at Juan", "Tomas at Mateo"], answer: "Santiago at Juan" },
    { question: "Sino ang babaeng nagtago sa dalawang espiyang Israelita sa Jerico?", options: ["Deborah", "Jael", "Rahab", "Zifora"], answer: "Rahab" },
    { question: "Sino ang propeta na ikinasal sa isang patutot na nagngangalang Gomer?", options: ["Amos", "Oseas", "Joel", "Obadias"], answer: "Oseas" },
    { question: "Sino ang matandang lalaki na nagbasbas sa sanggol na si Hesus sa templo?", options: ["Zacarias", "Simeon", "Jose ng Arimatea", "Nicodemo"], answer: "Simeon" },
    { question: "Sino ang may-ari ng libingan kung saan inilibing si Hesus?", options: ["Nicodemo", "Lazaro", "Simon na taga-Cirene", "Jose ng Arimatea"], answer: "Jose ng Arimatea" },
    { question: "What was the name of Abraham's wife?", options: ["Rebekah", "Leah", "Rachel", "Sarah"], answer: "Sarah" }
  ]
];

const PERFECT_SCORE_PER_LEVEL = 10;
const MAX_LEVEL = 50;

const VERSES_PER_STAGE = 20;
const LEVELS_PER_STAGE = 5;

// Function to check if a stage is complete
const isStageComplete = (stageNum: number, scores: any) => {
    if (!scores || !scores[stageNum]) return false;
    for (let level = 1; level <= LEVELS_PER_STAGE; level++) {
        const levelScores = scores[stageNum]?.[level];
        if (!levelScores || Object.keys(levelScores).length < VERSES_PER_STAGE) {
            return false;
        }
    }
    return true;
};

export default function CharacterAdventuresPage() {
    const [isClient, setIsClient] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [levelScores, setLevelScores] = useState<{ [key: number]: number }>({});
    const [language, setLanguage] = useState<'en' | 'fil'>('en');
    const [showAdventureMap, setShowAdventureMap] = useState(true);
    const [showUnlockDialog, setShowUnlockDialog] = useState(false);
    const [showLevelCompleteDialog, setShowLevelCompleteDialog] = useState(false);
    const [showTriviaDialog, setShowTriviaDialog] = useState(false);
    const [showUnlockAlert, setShowUnlockAlert] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { playCorrectSound, playIncorrectSound } = useSoundEffects();
    const { addExp, training, completeTraining, characterAdventuresMaxLevel, setProgress, lastPlayedDate } = useUserProgress();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const verseMemoryProgress = localStorage.getItem('verseMemoryProgress');
            let isStage1Done = false;
            if(verseMemoryProgress) {
                const progress = JSON.parse(verseMemoryProgress);
                if(progress.scores) {
                    isStage1Done = isStageComplete(1, progress.scores);
                }
            }
            setIsUnlocked(isStage1Done);
        }
    }, [isClient]);

    const loadProgress = useCallback(() => {
        if (!isClient) return;
        const savedProgress = localStorage.getItem('characterAdventuresProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setLevelScores(progress.scores || {});
        }
    }, [isClient]);

    const saveProgress = useCallback(() => {
        if (!isClient) return;
        const progress = { scores: levelScores };
        localStorage.setItem('characterAdventuresProgress', JSON.stringify(progress));
    }, [isClient, levelScores]);

    useEffect(() => {
        loadProgress();
        const profileStr = localStorage.getItem('bibleQuestUser');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            setLanguage(profile.language || 'en');
        }
    }, [isClient, loadProgress]);

    useEffect(() => {
        if (isClient) {
            
            const today = new Date().toISOString().split('T')[0];
            if (lastPlayedDate !== today) {
                const completedLevels = Object.keys(levelScores).filter(level => levelScores[parseInt(level)] === PERFECT_SCORE_PER_LEVEL).length;
                if (characterAdventuresMaxLevel <= completedLevels) {
                    setProgress({ 
                        lastPlayedDate: today, 
                        characterAdventuresMaxLevel: Math.min(MAX_LEVEL, characterAdventuresMaxLevel + 2) 
                    });
                }
            }

            if (training.characterAdventures === false) {
                setShowAdventureMap(false);
                // Auto-start tour logic can go here
            }
        }
    }, [isClient, training.characterAdventures, lastPlayedDate, setProgress, characterAdventuresMaxLevel, levelScores]);
    
    useEffect(() => {
        if (isClient) {
            saveProgress();
        }
    }, [isClient, levelScores, saveProgress]);

    const startLevel = (level: number) => {
        setCurrentLevel(level);
        setQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowAdventureMap(false);
    };

    const handleLevelSelect = (level: number) => {
        if (level > characterAdventuresMaxLevel) {
            toast({
                title: language === 'en' ? "Level Locked" : "Naka-lock ang Antas",
                description: language === 'en' ? "You can unlock 2 new levels each day. Come back tomorrow for more!" : "Maaari kang mag-unlock ng 2 bagong antas bawat araw. Bumalik bukas para sa iba pa!",
                variant: 'default',
            });
            return;
        }
        startLevel(level);
    };

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;

        setIsAnswered(true);
        setSelectedAnswer(option);

        const currentTrivia = triviaLevels[currentLevel - 1][questionIndex];
        const correctAnswer = currentTrivia.answer;

        if (option === correctAnswer) {
            setScore(s => s + 1);
            addExp(1); // Add 1 EXP for each correct answer
            playCorrectSound();
            if (currentTrivia.trivia) {
                setTimeout(() => {
                    setShowTriviaDialog(true);
                }, 500);
            } else {
                 setTimeout(() => {
                    handleNextQuestion();
                }, 1000);
            }
        } else {
            playIncorrectSound();
            setTimeout(() => {
                handleNextQuestion();
            }, 1000);
        }
    };

    const handleNextQuestion = () => {
        setShowTriviaDialog(false);
        if (questionIndex < 9) {
            setQuestionIndex(q => q + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            const finalScore = score + (selectedAnswer === triviaLevels[currentLevel - 1][questionIndex].answer ? 1 : 0);
            const oldLevelScore = levelScores[currentLevel] || 0;

            if (finalScore > oldLevelScore) {
                setLevelScores(ls => ({ ...ls, [currentLevel]: finalScore }));
            }
            
            const verseMemoryScores = JSON.parse(localStorage.getItem('verseMemoryProgress') || '{}').scores;

            if (finalScore === PERFECT_SCORE_PER_LEVEL && levelScores[currentLevel] !== PERFECT_SCORE_PER_LEVEL) {
                const completedLevels = Object.values({ ...levelScores, [currentLevel]: finalScore }).filter(s => s === PERFECT_SCORE_PER_LEVEL).length;
                if (completedLevels === 20 && verseMemoryScores && isStageComplete(2, verseMemoryScores)) {
                    setShowUnlockDialog(true);
                }
            }
            setShowLevelCompleteDialog(true);
        }
    };

    const restartLevel = () => {
        setShowLevelCompleteDialog(false);
        startLevel(currentLevel);
    };

    const nextLevel = () => {
        setShowLevelCompleteDialog(false);
        if (currentLevel < MAX_LEVEL) {
             if ((levelScores[currentLevel] || 0) < PERFECT_SCORE_PER_LEVEL || currentLevel + 1 > characterAdventuresMaxLevel) {
                setShowAdventureMap(true);
             } else {
                startLevel(currentLevel + 1);
             }
        } else {
            setShowAdventureMap(true);
        }
    };

    if (!isClient) {
        return <div>Loading...</div>; // Or a skeleton loader
    }
    
    if (!isUnlocked) {
        return (
            <AlertDialog open={true}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                         <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Lock className="w-10 h-10 text-primary" />
                        </div>
                        <AlertDialogTitle className="font-headline text-2xl text-center">{language === 'en' ? 'Unlock Character Adventures!' : 'I-unlock ang Pakikipagsapalaran ng mga Tauhan!'}</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {language === 'en' ? "To begin your adventure into the lives of Bible characters, you must first complete <strong>Stage 1</strong> of the Verse Memory game." : "Para simulan ang iyong pakikipagsapalaran sa buhay ng mga tauhan sa Bibliya, kailangan mo munang kumpletuhin ang <strong>Stage 1</strong> ng larong Verse Memory."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                         <AlertDialogAction onClick={() => router.push('/dashboard')}>{language === 'en' ? 'Back to Dashboard' : 'Balik sa Dashboard'}</AlertDialogAction>
                        <AlertDialogAction onClick={() => router.push('/dashboard/verse-memory')}>
                           <BookOpen className="mr-2" /> {language === 'en' ? 'Go to Verse Memory' : 'Pumunta sa Verse Memory'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
    
    if (showAdventureMap) {
        return (
            <div className="container mx-auto max-w-4xl space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="font-headline text-3xl font-bold">{language === 'en' ? 'Adventure Map' : 'Mapa ng Pakikipagsapalaran'}</h1>
                        <p className="text-muted-foreground">{language === 'en' ? 'Select a level to begin your quest. You can unlock 2 new levels each day.' : 'Pumili ng antas upang simulan ang iyong pakikipagsapalaran. Maaari kang mag-unlock ng 2 bagong antas bawat araw.'}</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setLanguage(l => l === 'en' ? 'fil' : 'en')}><Languages className="w-5 h-5"/></Button>
                 </div>
                 <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                            {Array.from({ length: MAX_LEVEL }).map((_, index) => {
                                const level = index + 1;
                                const isLocked = level > characterAdventuresMaxLevel;
                                const bestScore = levelScores[level] || 0;
                                const isPerfect = bestScore === PERFECT_SCORE_PER_LEVEL;

                                return (
                                    <div
                                        key={level}
                                        onClick={() => handleLevelSelect(level)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-lg border-2 text-center aspect-square",
                                            isLocked ? "bg-muted text-muted-foreground cursor-not-allowed border-dashed" : "cursor-pointer hover:bg-secondary",
                                            isPerfect && "border-yellow-400 bg-yellow-50"
                                        )}
                                    >
                                        {isLocked ? (
                                            <Lock className="w-8 h-8 mb-2" />
                                        ) : (
                                            isPerfect ? <Trophy className="w-8 h-8 mb-2 text-yellow-500" /> : <PlayCircle className="w-8 h-8 mb-2 text-primary" />
                                        )}
                                        <p className="font-bold">{language === 'en' ? `Level ${level}` : `Antas ${level}`}</p>
                                        <p className="text-sm">
                                            {isLocked
                                                ? (language === 'en' ? 'Locked' : 'Nakasara')
                                                : `${language === 'en' ? 'Best Score' : 'Pinakamataas'}: ${bestScore}/${PERFECT_SCORE_PER_LEVEL}`
                                            }
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                 </Card>
            </div>
        )
    }

    const currentTrivia = triviaLevels[currentLevel - 1]?.[questionIndex];
    
    if (!currentTrivia) {
      return <div>Loading level...</div>;
    }

    const pageTitle = language === 'en' ? 'Character Adventures' : 'Pakikipagsapalaran ng mga Tauhan';
    const pageDescription = language === 'en' ? 'Test your knowledge of biblical figures.' : 'Subukin ang iyong kaalaman sa mga tauhan sa Bibliya.';


    return (
        <div className="container mx-auto max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="font-headline text-3xl font-bold">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
                <div className="flex gap-2">
                    <Button id="adventure-map-button" variant="outline" size="icon" onClick={() => setShowAdventureMap(true)}><Map className="w-5 h-5"/></Button>
                    <Button variant="outline" size="icon" onClick={() => setLanguage(l => l === 'en' ? 'fil' : 'en')}><Languages className="w-5 h-5"/></Button>
                </div>
            </div>

            <Card id="character-adventures-card">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-2xl">
                           {language === 'en' ? `Level ${currentLevel}` : `Antas ${currentLevel}`}
                        </CardTitle>
                        <div id="score-display" className="text-lg font-bold">
                           {language === 'en' ? 'Score' : 'Puntos'}: {score}
                        </div>
                    </div>
                    <CardDescription>{language === 'en' ? `Question ${questionIndex + 1} of 10` : `Tanong ${questionIndex + 1} ng 10`}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={questionIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <h3 id="question-text" className="text-xl font-semibold text-center">{currentTrivia.question}</h3>
                            <div id="answer-options" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentTrivia.options.map((option, index) => {
                                    const isCorrect = option === currentTrivia.answer;
                                    const isSelected = selectedAnswer === option;
                                    return (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="lg"
                                            className={cn(
                                                "justify-start p-6 h-auto text-base whitespace-normal text-left",
                                                isAnswered && "cursor-not-allowed",
                                                !isAnswered && "hover:bg-accent/50",
                                                isAnswered && isCorrect && "bg-green-100 border-green-500 hover:bg-green-100 text-green-800",
                                                isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-500 hover:bg-red-100 text-red-800"
                                            )}
                                            onClick={() => handleAnswerSelect(option)}
                                            disabled={isAnswered}
                                        >
                                            <span className="mr-4">
                                                {isAnswered && isCorrect && <CheckCircle />}
                                                {isAnswered && isSelected && !isCorrect && <XCircle />}
                                                {!isAnswered && <BrainCircuit />}
                                            </span>
                                            {option}
                                        </Button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            <AlertDialog open={showLevelCompleteDialog} onOpenChange={setShowLevelCompleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                         <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Trophy className="w-10 h-10 text-primary" />
                        </div>
                        <AlertDialogTitle className="font-headline text-2xl text-center">
                            {language === 'en' ? `Level ${currentLevel} Complete!` : `Natapos ang Antas ${currentLevel}!`}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {language === 'en' ? `You scored ${score} out of 10.` : `Nakuha mo ang ${score} sa 10.`}
                            {score === PERFECT_SCORE_PER_LEVEL && (language === 'en' ? " Perfect score!" : " Perpektong iskor!")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={restartLevel}>
                            <RotateCcw className="mr-2" />
                            {language === 'en' ? 'Play Again' : 'Ulitin'}
                        </Button>
                        <Button onClick={nextLevel} disabled={(score < PERFECT_SCORE_PER_LEVEL || currentLevel >= characterAdventuresMaxLevel) && currentLevel < MAX_LEVEL}>
                           {language === 'en' ? 'Next Level' : 'Susunod na Antas'}
                        </Button>
                         <Button variant="secondary" onClick={() => setShowAdventureMap(true)}>
                            {language === 'en' ? 'Back to Map' : 'Balik sa Mapa'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                         <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Trophy className="w-10 h-10 text-primary" />
                        </div>
                        <AlertDialogTitle className="font-headline text-2xl text-center">{language === 'en' ? 'New Game Unlocked!' : 'Bagong Laro, Bukas Na!'}</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {language === 'en' ? 'Congratulations! Your knowledge has grown. You\'ve unlocked the' : 'Binabati kita! Lumago na ang iyong kaalaman. Nabuksan mo na ang larong'} <strong>{language === 'en' ? 'Bible Mastery' : 'Kasanayan sa Bibliya'}</strong> game.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                     <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction onClick={() => {
                            setShowUnlockDialog(false);
                            nextLevel();
                        }}>
                             {language === 'en' ? 'Continue Adventures' : 'Ipagpatuloy ang Pakikipagsapalaran'}
                        </AlertDialogAction>
                        <AlertDialogAction onClick={() => router.push('/dashboard/bible-mastery')}>
                            <Users className="mr-2" /> {language === 'en' ? 'Explore New Game' : 'Tuklasin ang Bagong Laro'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={showTriviaDialog} onOpenChange={setShowTriviaDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-center">
                            Did you know?
                        </DialogTitle>
                        <DialogDescription className="text-center font-bold text-lg text-primary">
                            {triviaLevels[currentLevel - 1][questionIndex].answer}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h4 className="font-semibold">Extra Trivia</h4>
                            <p className="text-sm text-muted-foreground">{currentTrivia.trivia}</p>
                        </div>
                        {currentTrivia.reference && (
                            <div className="space-y-1">
                                <h4 className="font-semibold">Reference</h4>
                                <p className="text-sm font-bold">{currentTrivia.reference}</p>
                                <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                                    "{currentTrivia.verseText}"
                                </blockquote>
                            </div>
                        )}
                    </div>
                     <DialogClose asChild>
                        <Button onClick={handleNextQuestion}>
                           {questionIndex < 9 ? (language === 'en' ? 'Next Question' : 'Susunod na Tanong') : (language === 'en' ? 'Finish Level' : 'Tapusin ang Antas')}
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
}

    