
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, XCircle, BrainCircuit, RotateCcw, Lock, PlayCircle, Map, Trophy, Languages, HelpCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

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
  ]
];

const triviaLevelsFilipino = [
  // Level 1
  [
    { question: "Sino ang kilala sa kanyang pambihirang lakas na nakatali sa kanyang mahabang buhok?", options: ["David", "Goliath", "Samson", "Gideon"], answer: "Samson", trivia: "Ang lakas ni Samson mula sa kanyang hindi ginugupit na buhok ay bahagi ng isang panata ng Nazareo sa Diyos.", reference: "Mga Hukom 16:17", verseText: "At isinaysay niya sa kaniya ang buong niloloob niya, at sinabi sa kaniya, Walang pang-ahit na dumaan sa aking ulo: sapagka't ako'y Nazareo sa Dios mula sa tiyan ng aking ina: kung ako'y ahitin, ay hihiwalay ang aking lakas sa akin, at ako'y hihina, at magiging gaya ng sinomang ibang tao." },
    { question: "Sino ang nilamon ng malaking isda matapos sumuway sa Diyos?", options: ["Jonas", "Daniel", "Elias", "Pedro"], answer: "Jonas", trivia: "Si Jonas ay nasa tiyan ng isda sa loob ng tatlong araw at tatlong gabi bago iniluwa sa tuyong lupa.", reference: "Jonas 1:17", verseText: "At naghanda ang Panginoon ng isang malaking isda upang lamunin si Jonas; at si Jonas ay napasa tiyan ng isda na tatlong araw at tatlong gabi." },
    { question: "Sino ang namuno sa mga Israelita palabas sa pagkaalipin sa Ehipto?", options: ["Josue", "Abraham", "Moises", "Jacob"], answer: "Moises", trivia: "Tinanggap ni Moises ang Sampung Utos mula sa Diyos sa Bundok Sinai.", reference: "Exodo 3:10", verseText: "Halika nga ngayon, at ikaw ay aking susuguin kay Faraon, upang iyong ilabas ang aking bayang mga anak ni Israel sa Egipto." },
    { question: "Sino ang matapang na reyna na nagligtas sa kanyang bayan mula sa isang masamang balak?", options: ["Ruth", "Esther", "Maria", "Debora"], answer: "Esther", trivia: "Si Esther, isang ulilang Judio, ay naging reyna ng Persia at isinapanganib ang kanyang buhay upang ilantad ang masamang plano ni Haman.", reference: "Esther 4:16", verseText: "Yumaon ka, pisanin mo ang lahat na Judio na nangakaharap sa Susan, at magayuno kayo na para sa akin, at huwag kayong kumain o uminom man sa loob ng tatlong araw, gabi o araw: ako rin at ang aking mga dalaga ay mangagaayunong gayon; at sa gayo'y papasukin ko ang hari, na hindi ayon sa kautusan: at kung ako'y mamatay, ay mamatay." },
    { question: "Sino ang unang hari ng Israel?", options: ["David", "Solomon", "Saul", "Samuel"], answer: "Saul", trivia: "Pinili ng Diyos si Saul at pinahiran ng langis ni propeta Samuel, ngunit kalaunan ay sumuway sa Diyos.", reference: "1 Samuel 10:1", verseText: "Nang magkagayo'y kumuha si Samuel ng isang sisidlan ng langis, at ibinuhos sa kaniyang ulo, at hinagkan niya siya, at sinabi, Hindi ba pinahiran ka ng Panginoon ng langis upang maging pangulo sa kaniyang mana?" },
    { question: "Itinanggi ng disipulong ito si Jesus ng tatlong beses bago tumilaok ang manok.", options: ["Judas", "Juan", "Tomas", "Pedro"], answer: "Pedro", trivia: "Sa kabila ng kanyang pagtanggi, pinatawad si Pedro ni Jesus at naging pangunahing pinuno sa unang iglesya.", reference: "Mateo 26:75", verseText: "At naalaala ni Pedro ang salita na sinabi ni Jesus, Bago tumilaok ang manok, ay ikakaila mo ako na makaitlo. At siya'y lumabas at nanangis ng kapaitpaitan." },
    { question: "Sino ang inihagis sa yungib ng mga leon ngunit pinrotektahan ng Diyos?", options: ["Daniel", "Jose", "Jeremias", "Sadrac"], answer: "Daniel", trivia: "Natuwa si Haring Dario na makitang buhay si Daniel at nag-utos na dapat sambahin ng lahat ng kanyang nasasakupan ang Diyos ni Daniel.", reference: "Daniel 6:22", verseText: "Ang Dios ko'y nagsugo ng kaniyang anghel, at itinikom ang mga bibig ng mga leon, at hindi nila ako sinaktan: sapagka't sa harap niya'y kasalanan ay walang nasumpungan sa akin; at gayon din sa harap mo, Oh hari, wala akong ginawang kasamaan." },
    { question: "Sino ang ama ng labindalawang tribo ng Israel?", options: ["Isaac", "Abraham", "Jacob", "Jose"], answer: "Jacob", trivia: "Pinalitan ng Diyos ang pangalan ni Jacob at ginawang Israel, na nangangahulugang 'nakikipagbuno sa Diyos'.", reference: "Genesis 32:28", verseText: "At sinabi niya, Hindi na tatawagin ang iyong pangalan na Jacob, kundi Israel: sapagka't ikaw ay nakipagpunyagi sa Dios at sa mga tao, at ikaw ay nanaig." },
    { question: "Sino ang matalik na kaibigan ni David at anak ni Haring Saul?", options: ["Joab", "Jonathan", "Absalom", "Nathan"], answer: "Jonathan", trivia: "Ang malalim na pagkakaibigan nina Jonathan at David ay isang makapangyarihang halimbawa ng katapatan, kahit na magkalaban ang kanilang mga pamilya.", reference: "1 Samuel 18:1", verseText: "At nangyari, pagkatapos niyang makipag-usap kay Saul, na ang kaluluwa ni Jonathan ay nalakip sa kaluluwa ni David, at minahal siya ni Jonathan gaya ng kanyang sariling kaluluwa." },
    { question: "Sino ang isang propetisa at ang tanging babaeng hukom ng Israel na nabanggit sa Bibliya?", options: ["Jael", "Miriam", "Hulda", "Debora"], answer: "Debora", trivia: "Umupo si Debora sa ilalim ng isang puno ng palma at lumalapit sa kanya ang mga Israelita para sa paghatol at karunungan.", reference: "Mga Hukom 4:4-5", verseText: "Nang panahong yaon ay si Debora, na propetisa, na asawa ni Lapidoth, ay siyang humahatolsa Israel. At siya'y tumahan sa ilalim ng puno ng palma ni Debora sa pagitan ng Rama at Bethel sa lupaing maburol ng Ephraim: at ang mga anak ni Israel ay nagsisampa sa kaniya upang humingi ng kahatulan." },
  ],
  // Level 2
  [
    { question: "Sino ang propeta na humarap kay Haring David matapos ang kanyang kasalanan kay Bathsheba?", options: ["Elias", "Isaias", "Nathan", "Samuel"], answer: "Nathan", trivia: "Sinaysay ni Nathan kay David ang isang talinghaga tungkol sa isang mayaman at isang mahirap na tupa upang ilantad ang kanyang kasalanan.", reference: "2 Samuel 12:7", verseText: "At sinabi ni Nathan kay David, Ikaw ang lalaking yaon. Ganito ang sabi ng Panginoon, ng Dios ng Israel, Pinahiran kita ng langis na maging hari sa Israel, at iniligtas kita sa kamay ni Saul;" },
    { question: "Sino ang ina ni Juan na Tagapagbautismo?", options: ["Maria", "Elisabet", "Ana", "Sara"], answer: "Elisabet", trivia: "Si Elisabet ay kamag-anak ni Maria, ang ina ni Jesus, at ang kanyang pagbubuntis ay isang himala sa kanyang katandaan.", reference: "Lucas 1:13", verseText: "Datapuwa't sinabi sa kaniya ng anghel, Huwag kang matakot, Zacarias: sapagka't dininig ang iyong dalangin, at ang iyong asawang si Elisabet ay manganganak sa iyo ng isang anak na lalake, at tatawagin mong Juan ang kaniyang pangalan." },
    { question: "Sino ang ipinagbili ng kanyang mga kapatid sa pagkaalipin ngunit naging makapangyarihang pinuno sa Ehipto?", options: ["Esau", "Jose", "Benjamin", "Reuben"], answer: "Jose", trivia: "Ang kakayahan ni Jose na magpaliwanag ng mga panaginip, na bigay ng Diyos, ang nag-angat sa kanya sa kapangyarihan sa Ehipto.", reference: "Genesis 41:41", verseText: "At sinabi ni Faraon kay Jose, Tingnan mo, ipinagkatiwala kita sa buong lupain ng Egipto." },
    { question: "Sino ang maniningil ng buwis na tinawag ni Jesus upang maging isa sa Kanyang mga alagad?", options: ["Zaqueo", "Nicodemo", "Mateo", "Bartolome"], answer: "Mateo", trivia: "Si Mateo, na kilala rin bilang Levi, ay agad na iniwan ang kanyang paniningil ng buwis upang sumunod kay Jesus at kalaunan ay isinulat ang Ebanghelyo ni Mateo.", reference: "Mateo 9:9", verseText: "At sa pagdaraan ni Jesus mula roon, ay nakita niya ang isang lalake, na kung tawagi'y Mateo, na nakaupo sa paningilan ng buwis: at sinabi niya sa kaniya, Sumunod ka sa akin. At siya'y nagtindig, at sumunod sa kaniya." },
    { question: "Sino ang unang Kristiyanong martir?", options: ["Pablo", "Pedro", "Esteban", "Santiago"], answer: "Esteban", trivia: "Si Esteban ay puno ng biyaya at kapangyarihan ng Diyos, at gumawa siya ng mga dakilang kababalaghan at tanda sa mga tao bago siya batuhin hanggang mamatay.", reference: "Mga Gawa 7:59", verseText: "At kanilang pinagbatuhanan si Esteban, na tumatawag sa Panginoon at nagsasabi, Panginoong Jesus, tanggapin mo ang aking espiritu." },
    { question: "Sino ang asawa ni Isaac at ina nina Jacob at Esau?", options: ["Leah", "Rachel", "Rebekah", "Sarai"], answer: "Rebekah", trivia: "Napili si Rebekah bilang asawa ni Isaac matapos manalangin ang lingkod ni Abraham para sa isang tiyak na tanda sa isang balon.", reference: "Genesis 25:21", verseText: "At nanalangin si Isaac sa Panginoon dahil sa kaniyang asawa, sapagka't baog; at dininig siya ng Panginoon, at si Rebeka na kaniyang asawa ay naglihi." },
    { question: "Sino ang namuno sa mga Israelita sa labanan sa Jerico?", options: ["Moises", "Gideon", "Josue", "Caleb"], answer: "Josue", trivia: "Bumagsak ang mga pader ng Jerico matapos magmartsa ang mga Israelita sa paligid ng lungsod sa loob ng pitong araw, na sumusunod sa tiyak na utos ng Diyos.", reference: "Josue 6:20", verseText: "Sa gayo'y humiyaw ang bayan, at ang mga saserdote ay humihip ng mga pakakak: at nangyari, nang marinig ng bayan ang tunog ng pakakak, na humiyaw ang bayan ng malakas na hiyaw, at ang kuta ay gumuho, na ano pa't ang bayan ay sumampang biunusan sa bayan, at kanilang sinakop ang bayan." },
    { question: "Sino ang propeta na dinala sa langit sa isang karwaheng apoy?", options: ["Eliseo", "Elias", "Enoc", "Isaias"], answer: "Elias", trivia: "Hindi naranasan ni Elias ang pisikal na kamatayan; direkta siyang dinala sa langit sa isang ipo-ipo.", reference: "2 Hari 2:11", verseText: "At nangyari, samantalang sila'y nagpapatuloy, at nagsasalitaan, na, narito, napakita ang isang karong apoy, at mga kabayong apoy, na naghiwalay sa kanila kapuwa; at si Elias ay sumampa sa langit sa pamamagitan ng isang ipoipo." },
    { question: "Sino ang nagpahid ng langis kina Saul at David bilang mga hari ng Israel?", options: ["Nathan", "Samuel", "Eli", "Ahias"], answer: "Samuel", trivia: "Si Samuel ay isang propeta at ang huling hukom ng Israel, na nag-ugnay sa panahon ng mga hukom at ng monarkiya.", reference: "1 Samuel 16:13", verseText: "Nang magkagayo'y kinuha ni Samuel ang sungay ng langis, at pinahiran siya sa gitna ng kaniyang mga kapatid: at ang Espiritu ng Panginoon ay makapangyarihang suma kay David mula sa araw na yaon. Sa gayo'y bumangon si Samuel, at naparoon sa Rama." },
    { question: "Sino ang apostol na pumalit kay Judas Iscariote?", options: ["Barnabas", "Silas", "Timoteo", "Matias"], answer: "Matias", trivia: "Nagpalabunutan ang mga apostol upang pumili sa pagitan nina Jose na tinatawag na Barsabas at Matias, at ang palabunot ay napunta kay Matias.", reference: "Mga Gawa 1:26", verseText: "At sila'y pinagsapalaran nila; at nahulog ang kapalaran kay Matias; at siya'y ibinilang na kasama ng labingisang apostol." },
  ],
  // Level 3
  [
    { question: "Sino ang tagahawak ng saro ng Persyanong hari na si Artaxerxes at tumulong sa muling pagtatayo ng mga pader ng Jerusalem?", options: ["Ezra", "Zerubbabel", "Nehemias", "Hagai"], answer: "Nehemias", trivia: "Sa kabila ng malaking oposisyon, pinangunahan ni Nehemias ang mga Judio na muling itayo ang mga pader ng Jerusalem sa loob lamang ng 52 araw.", reference: "Nehemias 2:5", verseText: "At aking sinabi sa hari, Kung ikalulugod ng hari, at kung ang iyong lingkod ay nakasumpong ng biyaya sa iyong paningin, na iyong suguin ako sa Juda, sa bayan ng mga libingan ng aking mga magulang, upang aking maitayo." },
    { question: "Sino ang punong saserdote ng Jerusalem noong ipinako si Jesus sa krus?", options: ["Anas", "Caifas", "Eli", "Finehas"], answer: "Caifas", trivia: "Si Caifas ay isang pangunahing tauhan sa balak na patayin si Jesus, na nangatwirang mas mabuti para sa isang tao na mamatay para sa bayan.", reference: "Juan 11:49-50", verseText: "Nguni't ang isa sa kanila na si Caifas, na dakilang saserdote nang taong yaon, ay nagsabi sa kanila, Kayo'y walang nalalamang anoman, Ni inyong niwawari na sa inyo'y nararapat na ang isang tao ay mamatay dahil sa bayan, at hindi ang buong bansa ay mapahamak." },
    { question: "Sino ang mayamang Pariseo na tumulong sa paglilibing kay Jesus?", options: ["Nicodemo", "Jose ng Arimatea", "Simon na Cyrene", "Lazaro"], answer: "Jose ng Arimatea", trivia: "Si Jose ay isang lihim na alagad ni Jesus na buong tapang na humingi kay Pilato ng katawan ni Jesus upang bigyan Siya ng maayos na libing.", reference: "Juan 19:38", verseText: "Pagkatapos nga ng mga bagay na ito, si Jose na taga Arimatea, na palibhasa'y alagad ni Jesus, nguni't sa lihim dahil sa takot sa mga Judio, ay namanhik kay Pilato na makuha niya ang bangkay ni Jesus: at ipinahintulot ni Pilato. Siya nga'y naparoon at kinuha ang kaniyang bangkay." },
    { question: "Sino ang kaliweteng hukom na nagligtas sa Israel mula sa mga Moabita?", options: ["Otniel", "Ehud", "Samgar", "Gideon"], answer: "Ehud", trivia: "Gumawa si Ehud ng isang espada na may dalawang talim at ginamit ang kanyang pagiging kaliwete upang patayin ang matabang Haring Eglon ng Moab.", reference: "Mga Hukom 3:21", verseText: "At iniunat ni Ehud ang kaniyang kaliwang kamay, at binunot ang tabak sa kaniyang kanang hita, at isinaksak sa kaniyang tiyan:" },
    { question: "Sino ang asawa ni Urias na Heteo, na kung kanino nakiapid si David?", options: ["Mical", "Abigail", "Bathsheba", "Tamar"], answer: "Bathsheba", trivia: "Matapos magsisi si David sa kanyang kasalanan, si Bathsheba ay naging ina ni Haring Solomon.", reference: "2 Samuel 11:27", verseText: "At nang ang pagluluksa ay makaraan, ay nagsugo si David at ipinagsama siya sa kaniyang bahay, at siya'y naging kaniyang asawa, at nagkaanak sa kaniya ng isang lalake. Nguni't ang bagay na ginawa ni David ay minasama ng Panginoon." },
    { question: "Sino ang propetisa na kumilala sa sanggol na si Jesus bilang Mesiyas sa Templo?", options: ["Elisabet", "Ana", "Febe", "Priscila"], answer: "Ana", trivia: "Si Ana ay isang napakatandang biyuda na hindi umaalis sa templo, sumasamba gabi't araw na may pag-aayuno at pananalangin.", reference: "Lucas 2:38", verseText: "At pagdating niya sa oras ding yaon, siya'y nagpasalamat sa Dios, at nagsalita ng tungkol sa sanggol sa lahat ng mga nagsisipaghintay ng katubusan sa Jerusalem." },
    { question: "Sino ang mangkukulam sa Samaria na sinubukang bilhin ang kapangyarihan ng Banal na Espiritu?", options: ["Elimas", "Bar-Jesus", "Simon ang Mago", "Sceva"], answer: "Simon ang Mago", trivia: "Pinagsabihan ni Apostol Pedro si Simon dahil sa kanyang masamang hiling, sinasabi sa kanya na ang kanyang puso ay hindi matuwid sa Diyos.", reference: "Mga Gawa 8:20", verseText: "Datapuwa't sinabi sa kaniya ni Pedro, Ang iyong salapi'y mapahamak na kasama mo, sapagka't inisip mo na mabibili mo ng salapi ang kaloob ng Dios." },
    { question: "Sino ang pamangkin ni Abraham, na piniling manirahan sa lungsod ng Sodoma?", options: ["Lot", "Laban", "Haran", "Nahor"], answer: "Lot", trivia: "Iniligtas si Lot ng mga anghel bago winasak ng Diyos ang mga lungsod ng Sodoma at Gomorra dahil sa kanilang kasamaan.", reference: "Genesis 19:16", verseText: "Datapuwa't nang siya'y nagluluwat, ay tinangnan siya ng mga lalake sa kamay, at ang kamay ng kaniyang asawa, at ang kamay ng kaniyang dalawang anak; dahil sa habag ng Panginoon sa kaniya: at siya'y inilabas nila at siya'y inilagay sa labas ng bayan." },
    { question: "Sino ang kahalili ng propetang si Elias?", options: ["Eliseo", "Oseas", "Amos", "Obadias"], answer: "Eliseo", trivia: "Humingi at tumanggap si Eliseo ng dobleng bahagi ng espiritu ni Elias bago siya dinala sa langit.", reference: "2 Hari 2:9", verseText: "At nangyari, nang sila'y makatawid, na sinabi ni Elias kay Eliseo, Hingin mo kung ano ang gagawin ko sa iyo, bago ako mahiwalay sa iyo. At sinabi ni Eliseo, Isinasamo ko sa iyo na ang isang ibayong bahagi ng iyong espiritu ay sumaakin." },
    { question: "Sino ang unang Hentil na nagbalik-loob sa Kristiyanismo na naitala sa aklat ng Mga Gawa?", options: ["Ang Bating na taga-Etiopia", "Cornelio", "Lidia", "Sergio Paulo"], answer: "Cornelio", trivia: "Si Cornelio, isang senturyong Romano, at ang kanyang buong sambahayan ay napuspos ng Banal na Espiritu, na naging tanda ng isang mahalagang sandali para sa unang iglesya.", reference: "Mga Gawa 10:44-45", verseText: "Samantalang nagsasalita pa si Pedro ng mga salitang ito, ay bumaba ang Espiritu Santo sa lahat ng nangakikinig ng salita. At silang mga nasa pagtutuli na nagsisampalataya, na mga kasama ni Pedro, ay nangagtaka, sapagka't ibinuhos din naman sa mga Gentil ang kaloob ng Espiritu Santo." },
  ],
  // Level 4
  [
    { question: "Sino ang hari ng Juda na kilala sa kanyang radikal na mga repormang panrelihiyon at pagsisisi?", options: ["Hezekias", "Josias", "Uzias", "Manases"], answer: "Josias", trivia: "Si Haring Josias ay walong taong gulang lamang nang magsimula siyang maghari, at ipinanumbalik niya ang pagsamba sa Diyos matapos matagpuan ang Aklat ng Kautusan.", reference: "2 Hari 23:25", verseText: "At walang naging hari na una sa kaniya na gaya niya, na bumalik sa Panginoon ng buong puso niya, at ng buong kaluluwa niya, at ng buong kapangyarihan niya, ayon sa buong kautusan ni Moises; ni may bumangon mang sinoman pagkamatay niya na gaya niya." },
    { question: "Sino ang tumakas na alipin na ipinabalik ni Pablo sa kanyang amo na si Filemon?", options: ["Tiquico", "Epafras", "Onesimo", "Arquito"], answer: "Onesimo", trivia: "Sa kanyang sulat kay Filemon, nakiusap si Pablo na tanggapin si Onesimo hindi bilang isang alipin, kundi bilang isang minamahal na kapatid kay Kristo.", reference: "Filemon 1:15-16", verseText: "Sapagka't marahil sa ganito siya'y nahiwalay sa iyo sa sangdaling panahon, upang siya'y mapasa iyo magpakailan man; Na hindi na alipin, kundi higit sa alipin, isang kapatid na minamahal, lalo na sa akin, nguni't gaano pa kaya sa iyo, na sa laman at sa Panginoon man." },
    { question: "Sino ang panganay na anak ni Jacob, na tinalikuran ang kanyang karapatan sa pagkapanganay?", options: ["Simeon", "Levi", "Juda", "Reuben"], answer: "Reuben", trivia: "Nawala kay Reuben ang kanyang mga karapatan sa pagkapanganay matapos niyang dungisan ang higaan ng kanyang ama. Pinigilan din niya ang kanyang mga kapatid na patayin si Jose.", reference: "Genesis 49:3-4", verseText: "Ruben, ikaw ang aking panganay, ang aking kapangyarihan, at ang pasimula ng aking kalakasan; kahigitan sa karangalan at kahigitan sa kapangyarihan. Kumukulo na parang tubig, hindi ka magiging marangal; sapagka't sumampa ka sa higaan ng iyong ama; at dinungisan mo: sumampa siya sa aking higaan." },
    { question: "Sino ang propeta na inutusan ng Diyos na pakasalan ang isang patutot bilang simbolo ng kataksilan ng Israel?", options: ["Jeremias", "Oseas", "Ezekiel", "Amos"], answer: "Oseas", trivia: "Ang pagpapakasal ni Oseas sa hindi tapat na si Gomer ay isang buhay na paglalarawan ng di-nagbabagong pag-ibig ng Diyos para sa hindi tapat na bansang Israel.", reference: "Oseas 1:2", verseText: "Nang ang Panginoon ay unang magsalita sa pamamagitan ni Oseas, sinabi ng Panginoon kay Oseas, Yumaon ka, kumuha ka ng isang asawang patutot at mga anak sa patutot; sapagka't ang lupain ay gumagawa ng malaking pagpapatutot, na humihiwalay sa Panginoon." },
    { question: "Sino ang manggagawa, na puno ng Espiritu ng Diyos, na nangasiwa sa pagtatayo ng Tabernakulo?", options: ["Oholiab", "Huram-abi", "Bezalel", "Hiram ng Tiro"], answer: "Bezalel", trivia: "Espesyal na binigyan ng Diyos si Bezalel ng kasanayan, talino, at kaalaman sa lahat ng uri ng sining upang itayo ang Tabernakulo at mga kagamitan nito.", reference: "Exodo 31:2-3", verseText: "Tingnan mo, aking tinawag sa pangalan si Bezalel na anak ni Uri, na anak ni Hur, sa lipi ni Juda: At aking pinuspos siya ng Espiritu ng Dios, sa karunungan, at sa pagkakilala, at sa kaalaman, at sa lahat ng sarisaring katha," },
    { question: "Sino ang Romanong gobernador na namuno sa paglilitis kay Jesus?", options: ["Herodes Antipas", "Felix", "Festus", "Poncio Pilato"], answer: "Poncio Pilato", trivia: "Bagama't walang nakitang basehan si Pilato sa paratang laban kay Jesus, naghugas siya ng kanyang mga kamay sa harap ng mga tao at ibinigay siya upang ipako sa krus.", reference: "Mateo 27:24", verseText: "Nang makita nga ni Pilato na wala siyang magawa, kundi bagkus pa ngang nagkakagulo, ay kumuha siya ng tubig, at naghugas ng kamay sa harap ng karamihan, na nagsasabi, Wala akong kasalanan sa dugo nitong taong matuwid: bahala kayo riyan." },
    { question: "Sino ang ina ni Haring Solomon?", options: ["Hagit", "Bathsheba", "Abisag", "Mical"], answer: "Bathsheba", trivia: "Matapos maging asawa ni Urias, pagkatapos ay ni David, si Bathsheba ay naging maimpluwensyang Inang Reyna sa panahon ng paghahari ni Solomon.", reference: "1 Hari 1:31", verseText: "Nang magkagayo'y iniyukod ni Bath-sheba ang kaniyang mukha sa lupa, at sumamba sa hari, at nagsabi, Mabuhay nawa ang aking panginoong si David magpakailan man." },
    { question: "Sino ang lalaki na kailangang makumbinsi sa muling pagkabuhay ni Jesus sa pamamagitan ng paghawak sa Kanyang mga sugat?", options: ["Felipe", "Andres", "Tomas", "Bartolome"], answer: "Tomas", trivia: "Matapos hawakan ang mga sugat ni Jesus, ginawa ni Tomas ang isa sa pinakamalinaw na pagpapahayag ng pagka-Diyos ni Jesus sa Bibliya: 'Panginoon ko at Diyos ko!'", reference: "Juan 20:27-28", verseText: "Nang magkagayo'y sinabi niya kay Tomas, Idaiti mo rito ang iyong daliri, at tingnan mo ang aking mga kamay; at idaiti mo rito ang iyong kamay, at isuot mo sa aking tagiliran: at huwag kang di mapanampalatayahin, kundi mapanampalatayahin. Sumagot si Tomas, at sa kaniya'y sinabi, Panginoon ko at Dios ko." },
    { question: "Sino ang kapitan ng hukbong Siria, na pinagaling sa ketong ni Eliseo?", options: ["Naaman", "Ben-Hadad", "Hazael", "Ziba"], answer: "Naaman", trivia: "Gumaling si Naaman matapos niyang magpakumbaba at sundin ang utos ng propetang si Eliseo na lumubog ng pitong beses sa Ilog Jordan.", reference: "2 Hari 5:14", verseText: "Nang magkagayo'y lumusong siya, at sumugbong makapito sa Jordan, ayon sa sabi ng lalake ng Dios: at ang kaniyang laman ay nagsauliong gaya ng laman ng isang munting bata, at siya'y naging malinis." },
    { question: "Sino ang nagtitinda ng telang purpura mula sa Tiatira na naging mananampalataya sa Filipos?", options: ["Dorcas", "Chloe", "Lidia", "Febe"], answer: "Lidia", trivia: "Si Lydia ay itinuturing na unang dokumentadong nagbalik-loob sa Kristiyanismo sa Europa. Ang kanyang buong sambahayan ay nabautismuhan.", reference: "Mga Gawa 16:14", verseText: "At isang babaing nagngangalang Lidia, na mangangalakal ng kulay-ube, na taga bayan ng Tiatira, na isang masipag sa kabanalan, ay nakinig sa amin: na binuksan ng Panginoon ang kaniyang puso upang makinig sa mga bagay na sinasalita ni Pablo." },
  ],
  // Level 5
  [
    { question: "Sino ang lolo ni Haring David?", options: ["Jesse", "Boaz", "Obed", "Salmon"], answer: "Obed", trivia: "Si Obed ay anak nina Boaz at Ruth, kaya siya ay isang mahalagang ninuno sa lahi nina David at Jesus.", reference: "Ruth 4:17", verseText: "At tinawag ng mga babaing kalapit-bahay ng pangalan, na sinasabi, Nagkaanak ng isang lalake si Noomi; at tinawag ang kaniyang pangalan na Obed: siya ang ama ni Jesse, na ama ni David." },
    { question: "Sino ang pari at hari ng Salem na sumalubong kay Abraham na may dalang tinapay at alak?", options: ["Melquisedec", "Jetro", "Adonizedec", "Abimelec"], answer: "Melquisedec", trivia: "Si Melquisedec ay isang misteryosong pigura na nagbasbas kay Abraham. Inilalahad siya ng aklat ng Mga Hebreo bilang isang paunang paglalarawan kay Kristo.", reference: "Genesis 14:18", verseText: "At si Melquisedec na hari sa Salem ay naglabas ng tinapay at alak: at siya'y saserdote ng Kataastaasang Dios." },
    { question: "Sino ang propeta na nakakita ng pangitain ng isang libis ng mga tuyong buto na nabuhay?", options: ["Isaias", "Jeremias", "Ezekiel", "Daniel"], answer: "Ezekiel", trivia: "Ang makapangyarihang pangitain na ito ay sumasagisag sa pangako ng Diyos na ibabalik ang bansang Israel mula sa 'kamatayan' nito sa pagkatapon.", reference: "Ezekiel 37:4-5", verseText: "Muling sinabi niya sa akin, Manghula ka sa mga butong ito, at sabihin mo sa kanila, Oh kayong mga tuyong buto, pakinggan ninyo ang salita ng Panginoon. Ganito ang sabi ng Panginoong Dios sa mga butong ito; Narito, aking papapasukin ang hininga sa inyo, at kayo'y mangabubuhay." },
    { question: "Sino ang masamang reyna ng Israel, asawa ni Ahab, na nagtaguyod ng pagsamba kay Baal?", options: ["Jezebel", "Atalia", "Herodias", "Delila"], answer: "Jezebel", trivia: "Si Jezebel ay isang prinsesang taga-Fenicia na mahigpit na tumutol sa mga propeta ng Diyos, lalo na kay Elias.", reference: "1 Hari 21:25", verseText: "Nguni't walang gaya ni Achab, na nagpakabuyo na gumawa ng masama sa paningin ng Panginoon, na si Jezabel na kaniyang asawa ang humihikayat." },
    { question: "Sino ang opisyal na Hudyo sa korte ng Persia na humadlang sa balak ni Haman na patayin ang mga Hudyo?", options: ["Daniel", "Nehemias", "Ezra", "Mordecai"], answer: "Mordecai", trivia: "Si Mordecai ay pinsan at tagapag-alaga ni Reyna Esther. Tumanggi siyang yumukod kay Haman, na nag-udyok sa masamang balak.", reference: "Esther 3:2", verseText: "At lahat ng mga lingkod ng hari, na nangasa pintuang-daan ng hari, ay nagsiyukod at nagbigay galang kay Aman: sapagka't iniutos ng hari ang tungkol sa kaniya. Nguni't si Mardocheo ay hindi yumukod, o nagbigay galang man sa kaniya." },
    { question: "Sino ang anak ni Jonathan, na pilay ang mga paa at pinakitaan ng kabutihan ni David?", options: ["Mefiboset", "Is-boset", "Adonias", "Amnon"], answer: "Mefiboset", trivia: "Ibinalik ni David kay Mefiboset ang lahat ng lupain ng kanyang lolo na si Saul at pinakain siya sa mesa ng hari, na tinutupad ang kanyang tipan kay Jonathan.", reference: "2 Samuel 9:7", verseText: "At sinabi ni David sa kaniya, Huwag kang matakot: sapagka't tunay na pagpapakitaan kita ng kagandahang-loob dahil kay Jonathan na iyong ama, at isasauli ko sa iyo ang lahat ng lupain ni Saul na iyong ama; at kakain ka ng tinapay sa aking dulang na palagi." },
    { question: "Sino ang mag-asawang nagsinungaling sa Banal na Espiritu tungkol sa pagbebenta ng kanilang ari-arian at namatay bilang resulta?", options: ["Aquila at Priscila", "Ananias at Safira", "Filemon at Apia", "Andronico at Junia"], answer: "Ananias at Safira", trivia: "Ang kanilang kasalanan ay hindi sa pag-iingat ng ilan sa pera, kundi sa pagsisinungaling sa mga apostol at pagsubok sa Espiritu ng Panginoon.", reference: "Mga Gawa 5:3", verseText: "Datapuwa't sinabi ni Pedro, Ananias, bakit pinuspos ni Satanas ang iyong puso upang magsinungaling sa Espiritu Santo, at upang mag-ingat para sa iyo ng isang bahagi ng halaga ng lupa?" },
    { question: "Sino ang ikalawang hari ng hilagang kaharian ng Israel, na kilala sa pariralang 'ang mga kasalanan ni... na nagdulot ng pagkakasala sa Israel'?", options: ["Ahab", "Omri", "Jeroboam", "Baasha"], answer: "Jeroboam", trivia: "Naglagay si Jeroboam ng mga gintong guya sa Bethel at Dan upang pigilan ang mga hilagang tribo na sumamba sa Jerusalem, na nag-akay sa Israel sa idolatriya.", reference: "1 Hari 12:28-29", verseText: "Kaya't ang hari ay kumuhang payo, at gumawa ng dalawang guyang ginto; at sinabi niya sa kanila, Mahirap na totoong umahon kayo sa Jerusalem; tingnan ninyo ang inyong mga dios, Oh Israel, na nagahon sa inyo mula sa lupain ng Egipto. At inilagay niya ang isa sa Bethel, at ang isa'y inilagay sa Dan." },
    { question: "Sino ang propeta mula sa Tekoa na isang pastol at tagapag-alaga ng mga puno ng sikomoro?", options: ["Mikas", "Oseas", "Joel", "Amos"], answer: "Amos", trivia: "Si Amos ay hindi isang 'propesyonal' na propeta ngunit tinawag ng Diyos upang maghatid ng mensahe ng katarungang panlipunan at pagsisisi sa hilagang kaharian ng Israel.", reference: "Amos 7:14-15", verseText: "Nang magkagayo'y sumagot si Amos, at nagsabi kay Amasias, Ako'y hindi propeta, ni anak man ng propeta; kundi ako'y pastor, at manggagawa ng mga puno ng sikomoro: At kinuha ako ng Panginoon mula sa pagsunod sa kawan, at sinabi sa akin ng Panginoon, Yumaon ka, manghula ka sa aking bayang Israel." },
    { question: "Sino ang 'tunay na anak sa pananampalataya' ni Pablo na kung kanino siya sumulat ng dalawang sulat?", options: ["Tito", "Timoteo", "Silas", "Lucas"], answer: "Timoteo", trivia: "Si Timoteo ay isang bata at pinagkakatiwalaang kasama ni Pablo sa kanyang mga paglalakbay misyonero at naging isang lider sa iglesya sa Efeso.", reference: "1 Timoteo 1:2", verseText: "Kay Timoteo na aking tunay na anak sa pananampalataya: Biyaya, kaawaan, at kapayapaan nawang mula sa Dios Ama at kay Cristo Jesus na Panginoon natin." },
  ]
];

const LEVEL_PASS_SCORE = 7;
const MAX_LEVEL = 5;
const STARS_PER_VERSE = 3;
const NUM_VERSES = 10;
const MAX_VERSE_STARS = MAX_LEVEL * NUM_VERSES * STARS_PER_VERSE;


type LevelScores = { [level: number]: number };

export default function CharacterAdventuresPage() {
    const [isClient, setIsClient] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [levelScores, setLevelScores] = useState<LevelScores>({});
    const [totalScore, setTotalScore] = useState(0);
    const [language, setLanguage] = useState<'en' | 'fil'>('en');
    const [showTour, setShowTour] = useState(false);
    const [verseMemoryCompleted, setVerseMemoryCompleted] = useState(false);


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentLevelScore, setCurrentLevelScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [showTriviaDialog, setShowTriviaDialog] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    
    const router = useRouter();

    const saveProgress = useCallback(() => {
        if (!isClient) return;
        const progress = {
            scores: levelScores,
            total: totalScore,
        };
        localStorage.setItem('characterAdventuresProgress', JSON.stringify(progress));
    }, [levelScores, totalScore, isClient]);

    useEffect(() => {
        setIsClient(true);
        const savedProgress = localStorage.getItem('characterAdventuresProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setLevelScores(progress.scores || {});
            setTotalScore(progress.total || 0);

            let highestUnlocked = 1;
            for (let i = 1; i <= MAX_LEVEL; i++) {
                if((progress.scores?.[i-1] || 0) >= LEVEL_PASS_SCORE) {
                    highestUnlocked = i + 1;
                } else {
                    break;
                }
            }
            setCurrentLevel(Math.min(highestUnlocked, MAX_LEVEL));
        }
        
        const tourSeen = localStorage.getItem('characterAdventuresTourSeen');
        if (!tourSeen) {
            setShowTour(true);
        }

        const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || '{}');
        const verseStars = verseMemoryProgress.stars || 0;
        if(verseStars === MAX_VERSE_STARS) {
            setVerseMemoryCompleted(true);
        }

    }, [isClient]);

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
        const englishOption = englishQuestion.options[englishOptionIndex];
        const isCorrect = englishOption === englishQuestion.answer;
        
        setIsCorrectAnswer(isCorrect);
        
        if (isCorrect) {
            setCurrentLevelScore(prevScore => prevScore + 1);
        }
        setShowTriviaDialog(true);
    };

    const handleNextQuestion = () => {
        setShowTriviaDialog(false);

        setTimeout(() => {
            if (currentQuestionIndex < triviaQuestions.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setIsAnswered(false);
                setSelectedAnswer(null);
            } else {
                const oldLevelScore = levelScores[currentLevel] || 0;
                if (currentLevelScore > oldLevelScore) {
                    setLevelScores(prev => ({ ...prev, [currentLevel]: currentLevelScore }));
                    setTotalScore(prev => prev - oldLevelScore + currentLevelScore);
                }
                setIsGameFinished(true);
            }
        }, 150);
    };

    const handleRestart = () => {
        startLevel(currentLevel);
    };

    const handleLevelSelect = (level: number) => {
        let isUnlocked = level === 1 || ((levelScores[level - 1] || 0) >= LEVEL_PASS_SCORE);
        if (level > 1) {
            isUnlocked = isUnlocked && verseMemoryCompleted;
        }

        if (isUnlocked) {
            startLevel(level);
        } else {
            // Optional: show a toast or alert telling the user what's required
            if (!verseMemoryCompleted) {
                const alert = document.createElement('div');
                alert.innerHTML = `
                    <div
                        role="alert"
                        class="fixed top-5 right-5 w-auto rounded-lg border bg-background text-foreground p-4 shadow-lg animate-in fade-in-0 zoom-in-95"
                    >
                        <h5 class="mb-1 font-medium leading-none tracking-tight">Level Locked</h5>
                        <div class="text-sm [&_p]:leading-relaxed">
                            You must master all verses in the Verse Memory game first!
                        </div>
                    </div>
                `;
                document.body.appendChild(alert.firstChild!);
                setTimeout(() => {
                    alert.firstChild?.remove();
                }, 3000);
            }
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
    
    const closeTour = () => {
        setShowTour(false);
        localStorage.setItem('characterAdventuresTourSeen', 'true');
    };

    if (!isClient) {
        return <div>Loading...</div>;
    }
    
    if (isGameFinished) {
        const canUnlockNext = currentLevel < MAX_LEVEL && currentLevelScore >= LEVEL_PASS_SCORE && verseMemoryCompleted;
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
    <>
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
                               let isUnlocked = levelNum === 1 || ((levelScores[levelNum - 1] || 0) >= LEVEL_PASS_SCORE);
                                if (levelNum > 1) {
                                  isUnlocked = isUnlocked && verseMemoryCompleted;
                                }
                               const isCurrent = levelNum === currentLevel;
                               return (
                                 <div 
                                    key={levelNum} 
                                    onClick={() => handleLevelSelect(levelNum)}
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
                                const englishOptionIndex = currentQuestion.options.indexOf(option);
                                const englishOption = englishQuestion.options[englishOptionIndex];
                                const isCorrect = englishOption === englishQuestion.answer;
                                const isSelected = selectedAnswer === option;

                                return (
                                <Button
                                    key={option}
                                    variant="outline"
                                    size="lg"
                                    className={cn(
                                        "justify-start p-6 h-auto text-base",
                                        isAnswered && "cursor-not-allowed",
                                        !isAnswered && "hover:bg-accent/50",
                                        isAnswered && isCorrect && "bg-green-100 border-green-500 hover:bg-green-100 text-green-800",
                                        isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-500 hover:bg-red-100 text-red-800"
                                    )}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={isAnswered}
                                >
                                    <BrainCircuit className="mr-2 text-muted-foreground"/>
                                    {option}
                                </Button>
                            )})}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>

        <AlertDialog open={showTriviaDialog} onOpenChange={setShowTriviaDialog}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <div className="flex items-center gap-2">
                     {isCorrectAnswer ? <CheckCircle className="w-8 h-8 text-green-500"/> : <XCircle className="w-8 h-8 text-destructive"/>}
                     <AlertDialogTitle className={cn("font-headline text-3xl", isCorrectAnswer ? "text-green-600" : "text-destructive")}>
                        {isCorrectAnswer ? (language === 'en' ? "Correct!" : "Tama!") : (language === 'en' ? "Incorrect" : "Mali")}
                     </AlertDialogTitle>
                  </div>
                   <AlertDialogDescription className="text-base text-left">
                     {language === 'en' 
                        ? `The correct answer is ${englishQuestion.answer}.`
                        : `Ang tamang sagot ay ${triviaLevelsFilipino[currentLevel-1][currentQuestionIndex].options[triviaLevels[currentLevel-1][currentQuestionIndex].options.indexOf(englishQuestion.answer)]}.`
                     }
                   </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4 py-4 text-left">
                  <div className="space-y-1">
                      <h3 className="font-semibold flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary"/>{language === 'en' ? 'Did you know?' : 'Alam mo ba?'}</h3>
                      <p className="text-muted-foreground">{currentQuestion.trivia}</p>
                  </div>
                   <div className="space-y-1">
                      <h3 className="font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary"/>{language === 'en' ? 'Bible Reference' : 'Sangguniang Biblikal'}</h3>
                      <p className="text-muted-foreground font-semibold">{currentQuestion.reference}</p>
                      <p className="text-muted-foreground italic">"{currentQuestion.verseText}"</p>
                  </div>
              </div>

              <AlertDialogFooter>
                  <AlertDialogAction onClick={handleNextQuestion} className="w-full">
                     {currentQuestionIndex < triviaQuestions.length - 1 ? (language === 'en' ? 'Next Question' : 'Susunod na Tanong') : (language === 'en' ? 'Finish Quiz' : 'Tapusin ang Pagsusulit')}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
    <AlertDialog open={showTour} onOpenChange={setShowTour}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    <Users className="w-10 h-10 text-primary" />
                </div>
                <AlertDialogTitle className="font-headline text-2xl text-center">Welcome to Character Adventures!</AlertDialogTitle>
                <AlertDialogDescription className="text-center space-y-2">
                    <p>This game tests your knowledge of the people in the Bible.</p>
                    <p>For each question, select the character you believe is the correct answer. You need a score of <strong>7 out of 10</strong> to unlock the next level.</p>
                    <p>Master all 5 levels to unlock the final challenge: <strong>Bible Mastery</strong>!</p>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={closeTour} className="w-full">
                    Let's Go!
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
