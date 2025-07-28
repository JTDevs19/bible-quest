
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, XCircle, BrainCircuit, RotateCcw, Lock, PlayCircle, Map, Trophy, Languages, HelpCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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
    { question: "Who was the disciple known as 'the Zealot'?", options: ["Simon Peter", "Simon", "Andrew", "James"], answer: "Simon", trivia: "The Zealots were a political movement that sought to incite the people of Judea to rebel against the Roman Empire.", reference: "Luke 6:15", verseText: "Matthew, Thomas, James son of Alphaeus, Simon who was called the Zealot," },
    { question: "Who was the king of Babylon who saw the writing on the wall?", options: ["Nebuchadnezzar", "Darius", "Cyrus", "Belshazzar"], answer: "Belshazzar", trivia: "Daniel interpreted the mysterious writing, which foretold the imminent downfall of Belshazzar's kingdom to the Medes and Persians.", reference: "Daniel 5:25", verseText: "This is the inscription that was written: MENE, MENE, TEKEL, PARSIN." },
    { question: "Who were the two spies sent by Joshua who were hidden by Rahab in Jericho?", options: ["Caleb and Phinehas", "Gershon and Merari", "Only one is named", "They are unnamed"], answer: "They are unnamed", trivia: "Though their names aren't given, their mission was crucial for the Israelite victory at Jericho, thanks to Rahab's help.", reference: "Joshua 2:1", verseText: "Then Joshua son of Nun secretly sent two spies from Shittim. 'Go, look over the land,' he said, 'especially Jericho.' So they went and entered the house of a prostitute named Rahab and stayed there." },
    { question: "Who was the woman who was the first to see the resurrected Jesus?", options: ["Mary, the mother of Jesus", "Mary Magdalene", "Salome", "Joanna"], answer: "Mary Magdalene", trivia: "Mary Magdalene was a devoted follower of Jesus, and she was given the honor of being the first witness to His resurrection.", reference: "John 20:16", verseText: "Jesus said to her, 'Mary.' She turned toward him and cried out in Aramaic, 'Rabboni!' (which means 'Teacher')." },
    { question: "Who was the co-worker with Paul, a doctor by profession, who wrote a Gospel and the book of Acts?", options: ["Mark", "Luke", "Silas", "Barnabas"], answer: "Luke", trivia: "Luke was a meticulous historian and a faithful companion to Paul, providing detailed accounts of Jesus' life and the early church.", reference: "Colossians 4:14", verseText: "Our dear friend Luke, the doctor, and Demas send greetings." },
    { question: "Who was the high priest who mentored the young prophet Samuel?", options: ["Phinehas", "Ahimelech", "Eli", "Abiathar"], answer: "Eli", trivia: "Though his own sons were wicked, Eli recognized God's call on Samuel's life and guided him in his early prophetic ministry.", reference: "1 Samuel 3:9", verseText: "So Eli told Samuel, 'Go and lie down, and if he calls you, say, ‘Speak, LORD, for your servant is listening.’' So Samuel went and lay down in his place." },
    { question: "Who was the prophet that God called 'son of man' more than 90 times?", options: ["Isaiah", "Jeremiah", "Ezekiel", "Daniel"], answer: "Ezekiel", trivia: "This title emphasized Ezekiel's humanity in contrast to the divine glory of God, to whom he was a messenger during the Babylonian exile.", reference: "Ezekiel 2:1", verseText: "He said to me, 'Son of man, stand up on your feet and I will speak to you.'" }
  ],
  // Level 8
  [
    { question: "Who was the man who walked with God and was taken away without experiencing death?", options: ["Noah", "Elijah", "Methuselah", "Enoch"], answer: "Enoch", trivia: "Enoch's life was so pleasing to God that he was spared from physical death, a rare honor mentioned in both Genesis and Hebrews.", reference: "Genesis 5:24", verseText: "Enoch walked faithfully with God; then he was no more, because God took him away." },
    { question: "Who was the prophetess who led Israel with Barak to defeat the Canaanite army?", options: ["Jael", "Miriam", "Huldah", "Deborah"], answer: "Deborah", trivia: "Deborah was a prophetess and the only female judge of Israel, leading both spiritually and militarily.", reference: "Judges 4:6", verseText: "She sent for Barak son of Abinoam from Kedesh in Naphtali and said to him, 'The LORD, the God of Israel, commands you: ‘Go, take with you ten thousand men of Naphtali and Zebulun and lead them up to Mount Tabor.’'" },
    { question: "Who was the first king of the northern kingdom of Israel after the nation split?", options: ["Rehoboam", "Omri", "Ahab", "Jeroboam"], answer: "Jeroboam", trivia: "Jeroboam led the rebellion of the ten northern tribes against Rehoboam and established his own kingdom, but led Israel into idolatry.", reference: "1 Kings 12:20", verseText: "When all the Israelites heard that Jeroboam had returned, they sent and called him to the assembly and made him king over all Israel. Only the tribe of Judah remained loyal to the house of David." },
    { question: "Who was the woman who anointed Jesus' feet with expensive perfume and wiped them with her hair?", options: ["Mary of Bethany", "Mary Magdalene", "The sinful woman", "Joanna"], answer: "Mary of Bethany", trivia: "This act of lavish devotion, sister of Martha and Lazarus, was commended by Jesus as a beautiful thing done in preparation for His burial.", reference: "John 12:3", verseText: "Then Mary took about a pint of pure nard, an expensive perfume; she poured it on Jesus’ feet and wiped his feet with her hair. And the house was filled with the fragrance of the perfume." },
    { question: "Who were the three friends of Daniel who were thrown into a fiery furnace?", options: ["Shadrach, Meshach, and Abednego", "Hananiah, Mishael, and Azariah", "Both A and B", "Belteshazzar, Arioch, and Ashpenaz"], answer: "Both A and B", trivia: "Shadrach, Meshach, and Abednego were their Babylonian names, while Hananiah, Mishael, and Azariah were their Hebrew names.", reference: "Daniel 3:25", verseText: "He said, 'Look! I see four men walking around in the fire, unbound and unharmed, and the fourth looks like a son of the gods.'" },
    { question: "Who was the prominent female leader in the early church at Philippi?", options: ["Phoebe", "Priscilla", "Lydia", "Euodia"], answer: "Lydia", trivia: "Lydia was a dealer in purple cloth and a worshiper of God. After her conversion, her home became a center for the church in Philippi.", reference: "Acts 16:14", verseText: "One of those listening was a woman from the city of Thyatira named Lydia, a dealer in purple cloth. She was a worshiper of God. The Lord opened her heart to respond to Paul’s message." },
    { question: "Who was the queen who was deposed for refusing to appear before her husband, King Xerxes?", options: ["Esther", "Jezebel", "Vashti", "Athaliah"], answer: "Vashti", trivia: "Vashti's defiance led to her removal as queen, which providentially opened the way for Esther to take her place and save the Jewish people.", reference: "Esther 1:12", verseText: "But when the attendants delivered the king’s command, Queen Vashti refused to come. Then the king became furious and burned with anger." },
    { question: "Who was the disciple that Jesus saw sitting under a fig tree before calling him?", options: ["Philip", "Nathanael", "Andrew", "Thaddaeus"], answer: "Nathanael", trivia: "Jesus' supernatural knowledge of Nathanael's location convinced him that Jesus was the Son of God and the King of Israel.", reference: "John 1:48", verseText: "'How do you know me?' Nathanael asked. Jesus answered, 'I saw you while you were still under the fig tree before Philip called you.'" },
    { question: "Who was the proconsul of Cyprus who became a believer after Paul blinded a sorcerer?", options: ["Gallio", "Felix", "Sergius Paulus", "Publius"], answer: "Sergius Paulus", trivia: "When Sergius Paulus, an intelligent man, saw the miracle, he believed, for he was amazed at the teaching about the Lord.", reference: "Acts 13:12", verseText: "When the proconsul saw what had happened, he believed, for he was amazed at the teaching about the Lord." },
    { question: "Who was the farmer prophet from the southern kingdom of Judah sent to prophesy against the northern kingdom of Israel?", options: ["Hosea", "Amos", "Obadiah", "Micah"], answer: "Amos", trivia: "Amos was not a professional prophet but a shepherd and a sycamore-fig farmer. He preached a powerful message of social justice and divine judgment.", reference: "Amos 7:14", verseText: "Amos answered Amaziah, 'I was neither a prophet nor the son of a prophet, but I was a shepherd, and I also took care of sycamore-fig trees.'" }
  ],
  // Level 9
  [
    { question: "Who was the grandson of Saul whom David showed kindness to for Jonathan's sake?", options: ["Ish-Bosheth", "Mephibosheth", "Mica", "Armoni"], answer: "Mephibosheth", trivia: "Mephibosheth was lame in both feet. David restored his family's land and gave him a permanent place at the royal table.", reference: "2 Samuel 9:7", verseText: "'Don’t be afraid,' David said to him, 'for I will surely show you kindness for the sake of your father Jonathan. I will restore to you all the land that belonged to your grandfather Saul, and you will always eat at my table.'" },
    { question: "Who was the eloquent Alexandrian Jew who taught powerfully in Ephesus but knew only the baptism of John?", options: ["Aquila", "Priscilla", "Apollos", "Tychicus"], answer: "Apollos", trivia: "Priscilla and Aquila took him aside and explained the way of God more accurately, and he became a great asset to the early church.", reference: "Acts 18:24", verseText: "Meanwhile a Jew named Apollos, a native of Alexandria, came to Ephesus. He was a learned man, with a thorough knowledge of the Scriptures." },
    { question: "Who was the king of Judah who was struck with leprosy for presumptuously offering incense in the temple?", options: ["Uzziah", "Jotham", "Ahaz", "Hezekiah"], answer: "Uzziah", trivia: "Though he started his reign well, King Uzziah's pride led him to usurp the role of the priests, resulting in divine judgment.", reference: "2 Chronicles 26:19", verseText: "Uzziah, who had a censer in his hand to burn incense, became angry. While he was raging at the priests in their presence before the incense altar in the LORD’s temple, leprosy broke out on his forehead." },
    { question: "Who was the prophet whose scroll was cut up and burned by King Jehoiakim?", options: ["Isaiah", "Ezekiel", "Habakkuk", "Jeremiah"], answer: "Jeremiah", trivia: "Despite the king's defiance, God commanded Jeremiah to write all the words again on another scroll, adding many similar words.", reference: "Jeremiah 36:23", verseText: "Whenever Jehudi had read three or four columns of the scroll, the king cut them off with a scribe’s knife and threw them into the firepot, until the entire scroll was burned in the fire." },
    { question: "Who was the runaway slave from Colossae for whom Paul wrote an appeal to his master?", options: ["Philemon", "Archippus", "Tychicus", "Onesimus"], answer: "Onesimus", trivia: "Paul converted Onesimus to Christianity and sent him back to his master Philemon, not as a slave, but as a beloved brother in Christ.", reference: "Philemon 1:16", verseText: "no longer as a slave, but better than a slave, as a dear brother. He is very dear to me but even dearer to you, both as a fellow man and as a brother in the Lord." },
    { question: "Who was the man from Cyrene who was compelled to carry Jesus' cross?", options: ["Simon", "Alexander", "Rufus", "Joseph"], answer: "Simon", trivia: "Mark's gospel mentions that this Simon was the father of Alexander and Rufus, suggesting they were known to the early Christian community.", reference: "Mark 15:21", verseText: "A certain man from Cyrene, Simon, the father of Alexander and Rufus, was passing by on his way in from the country, and they forced him to carry the cross." },
    { question: "Who was the faithful friend and fellow prisoner of Paul, mentioned in the closing of Colossians?", options: ["Epaphras", "Tychicus", "Aristarchus", "Demas"], answer: "Aristarchus", trivia: "Aristarchus, a Macedonian from Thessalonica, was a loyal companion who traveled with Paul and shared in his imprisonments.", reference: "Colossians 4:10", verseText: "My fellow prisoner Aristarchus sends you his greetings, as does Mark, the cousin of Barnabas." },
    { question: "Who was the father of Methuselah and the great-grandfather of Noah?", options: ["Jared", "Lamech", "Mahalalel", "Enoch"], answer: "Enoch", trivia: "Enoch is one of only two men in the Bible (the other being Elijah) who did not experience death but was taken directly by God.", reference: "Genesis 5:22", verseText: "After he became the father of Methuselah, Enoch walked faithfully with God 300 years and had other sons and daughters." },
    { question: "Who was the prophetess who confirmed the authenticity of the Book of the Law found during King Josiah's reign?", options: ["Deborah", "Miriam", "No-adiah", "Huldah"], answer: "Huldah", trivia: "Huldah's prophecy validated the found scripture and spurred on Josiah's great religious reforms in Judah.", reference: "2 Kings 22:14", verseText: "Hilkiah the priest, Ahikam, Akbor, Shaphan and Asaiah went to speak to the prophet Huldah, who was the wife of Shallum son of Tikvah, the son of Harhas, keeper of the wardrobe. She lived in Jerusalem, in the New Quarter." },
    { question: "Who was the son of Jacob and Leah, whose descendants became the priestly tribe of Israel?", options: ["Reuben", "Simeon", "Levi", "Judah"], answer: "Levi", trivia: "Because of their zeal for the Lord, the tribe of Levi was set apart for the service of the tabernacle and temple, not receiving a territorial inheritance like the other tribes.", reference: "Numbers 3:12", verseText: "'I have taken the Levites from among the Israelites in place of the first male offspring of every Israelite woman. The Levites are mine,'" }
  ],
  // Level 10
  [
    { question: "Who was the judge who made a rash vow that resulted in sacrificing his daughter?", options: ["Gideon", "Samson", "Ibzan", "Jephthah"], answer: "Jephthah", trivia: "Jephthah vowed to sacrifice whatever came out of his house to meet him if he returned victorious. Tragically, it was his only child, his daughter.", reference: "Judges 11:34", verseText: "When Jephthah returned to his home in Mizpah, who should come out to meet him but his daughter, dancing to the sound of timbrels! She was an only child. Except for her he had neither son nor daughter." },
    { question: "Who was the first Christian convert in Europe?", options: ["The Philippian Jailer", "Dionysius", "Lydia", "Damaris"], answer: "Lydia", trivia: "Lydia, a dealer of purple cloth in Philippi, and her household were baptized by Paul, and her home became a meeting place for believers.", reference: "Acts 16:14-15", verseText: "One of those listening was a woman from the city of Thyatira named Lydia, a dealer in purple cloth. She was a worshiper of God. The Lord opened her heart to respond to Paul’s message. When she and the members of her household were baptized, she invited us to her home." },
    { question: "Who was the scribe and priest who led the second group of exiles back to Jerusalem from Babylon?", options: ["Nehemiah", "Zerubbabel", "Haggai", "Ezra"], answer: "Ezra", trivia: "Ezra was a skilled scribe, well-versed in the Law of Moses, and he was instrumental in teaching the people God's law and restoring worship in Jerusalem.", reference: "Ezra 7:6", verseText: "this Ezra came up from Babylon. He was a teacher well versed in the Law of Moses, which the LORD, the God of Israel, had given. The king had granted him everything he asked, for the hand of the LORD his God was on him." },
    { question: "Who was the disciple who was a tax collector before Jesus called him?", options: ["Matthew", "Zacchaeus", "Simon the Zealot", "Joseph of Arimathea"], answer: "Matthew", trivia: "Matthew, also called Levi, promptly left his profession to follow Jesus and later became the author of the first Gospel.", reference: "Matthew 9:9", verseText: "As Jesus went on from there, he saw a man named Matthew sitting at the tax collector’s booth. 'Follow me,' he told him, and Matthew got up and followed him." },
    { question: "Who were the two sons of Zebedee, also known as the 'Sons of Thunder'?", options: ["Peter and Andrew", "Philip and Bartholomew", "James and John", "Thomas and Matthew"], answer: "James and John", trivia: "Jesus gave them this nickname, likely due to their fiery and impetuous personalities.", reference: "Mark 3:17", verseText: "James son of Zebedee and his brother John (to them he gave the name Boanerges, which means 'sons of thunder')," },
    { question: "Who was the woman who hid two Israelite spies in Jericho?", options: ["Deborah", "Jael", "Rahab", "Zipporah"], answer: "Rahab", trivia: "For her act of faith in hiding the spies, Rahab and her family were spared when the city of Jericho was destroyed. She is listed in the lineage of Jesus.", reference: "Joshua 2:6", verseText: "But she had taken them up to the roof and hidden them under the stalks of flax she had laid out on the roof." },
    { question: "Who was the prophet that was married to a prostitute named Gomer?", options: ["Amos", "Hosea", "Joel", "Obadiah"], answer: "Hosea", trivia: "Hosea's marriage was a living parable of God's faithful love for the unfaithful nation of Israel.", reference: "Hosea 1:3", verseText: "So he went and married Gomer daughter of Diblaim, and she conceived and bore him a son." },
    { question: "Who was the elderly man who blessed the infant Jesus in the temple?", options: ["Zechariah", "Simeon", "Joseph of Arimathea", "Nicodemus"], answer: "Simeon", trivia: "The Holy Spirit had revealed to Simeon that he would not die before he had seen the Lord’s Messiah.", reference: "Luke 2:29-30", verseText: "'Sovereign Lord, as you have promised, you may now dismiss your servant in peace. For my eyes have seen your salvation,'" },
    { question: "Who was the man who owned the tomb where Jesus was buried?", options: ["Nicodemus", "Lazarus", "Simon the Cyrene", "Joseph of Arimathea"], answer: "Joseph of Arimathea", trivia: "Joseph was a wealthy member of the Sanhedrin and a secret disciple of Jesus. He bravely asked Pilate for Jesus' body for burial.", reference: "Matthew 27:59-60", verseText: "Joseph took the body, wrapped it in a clean linen cloth, and placed it in his own new tomb that he had cut out of the rock." },
    { question: "What was the name of Abraham's wife?", options: ["Rebekah", "Leah", "Rachel", "Sarah"], answer: "Sarah", trivia: "Originally named Sarai, God changed her name to Sarah, which means 'princess', when He promised that she would bear a son in her old age.", reference: "Genesis 17:15", verseText: "God also said to Abraham, 'As for Sarai your wife, you are no longer to call her Sarai; her name will be Sarah.'" }
  ],
  // Level 11
  [
    { question: "Who was the high priest who questioned Jesus before his crucifixion?", options: ["Annas", "Caiaphas", "Eli", "Abiathar"], answer: "Caiaphas", trivia: "Caiaphas was the high priest who, according to the Gospel of John, prophesied that it was better for one man to die for the people.", reference: "John 18:13-14", verseText: "and brought him first to Annas, who was the father-in-law of Caiaphas, the high priest that year. Caiaphas was the one who had advised the Jewish leaders that it would be good if one man died for the people." },
    { question: "Who was the first of the twelve apostles to be martyred?", options: ["Peter", "Stephen", "Paul", "James"], answer: "James", trivia: "James, the brother of John, was executed by the sword under the order of King Herod Agrippa I.", reference: "Acts 12:2", verseText: "He had James, the brother of John, put to death with the sword." },
    { question: "Who was the Moabite woman who became an ancestor of King David and Jesus?", options: ["Orpah", "Zilpah", "Ruth", "Tamar"], answer: "Ruth", trivia: "Ruth's loyalty to her mother-in-law, Naomi, is a central theme of the book bearing her name. She famously said, 'Where you go I will go.'", reference: "Ruth 1:16", verseText: "But Ruth replied, 'Don’t urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.'" },
    { question: "What was the name of the garden where Adam and Eve first lived?", options: ["Gethsemane", "Zion", "Eden", "Paradise"], answer: "Eden", trivia: "The Garden of Eden was a paradise where God walked with humanity before the fall.", reference: "Genesis 2:8", verseText: "Now the LORD God had planted a garden in the east, in Eden; and there he put the man he had formed." },
    { question: "Who was the father of the faithful, to whom God promised descendants as numerous as the stars?", options: ["Isaac", "Jacob", "Abraham", "Moses"], answer: "Abraham", trivia: "Originally named Abram, God changed his name to Abraham, meaning 'father of many nations', as a sign of His covenant.", reference: "Genesis 15:5", verseText: "He took him outside and said, 'Look up at the sky and count the stars—if indeed you can count them.' Then he said to him, 'So shall your offspring be.'" },
    { question: "Who was the prophet who lay on his side for 390 days to symbolize the siege of Jerusalem?", options: ["Jeremiah", "Isaiah", "Daniel", "Ezekiel"], answer: "Ezekiel", trivia: "Ezekiel performed many symbolic acts, or 'street theater,' to communicate God's messages to the exiles in Babylon.", reference: "Ezekiel 4:5", verseText: "I have assigned you the same number of days as the years of their sin. So for 390 days you will bear the sin of the people of Israel." },
    { question: "Who was the Roman governor of Judea who kept Paul in prison for two years?", options: ["Festus", "Felix", "Pilate", "Agrippa"], answer: "Felix", trivia: "Felix often listened to Paul speak but kept him imprisoned, hoping to receive a bribe for his release.", reference: "Acts 24:27", verseText: "When two years had passed, Felix was succeeded by Porcius Festus, but because Felix wanted to grant a favor to the Jews, he left Paul in prison." },
    { question: "Who was the deacon chosen to care for the widows in the early church, and also a powerful evangelist?", options: ["Stephen", "Philip", "Procorus", "Nicanor"], answer: "Philip", trivia: "After being a deacon in Jerusalem, Philip was led by the Spirit to preach in Samaria and to an Ethiopian eunuch on a desert road.", reference: "Acts 8:5", verseText: "Philip went down to a city in Samaria and proclaimed the Messiah there." },
    { question: "Who was the son of Noah who received a curse for dishonoring his father?", options: ["Shem", "Japheth", "Ham", "Canaan"], answer: "Ham", trivia: "Ham's disrespect towards his father Noah resulted in a curse on his son Canaan.", reference: "Genesis 9:24-25", verseText: "When Noah awoke from his wine and found out what his youngest son had done to him, he said, 'Cursed be Canaan! The lowest of slaves will he be to his brothers.'" },
    { question: "Who was the disciple who was in charge of the group's money and betrayed Jesus?", options: ["Matthew", "Thomas", "Judas Iscariot", "Simon the Zealot"], answer: "Judas Iscariot", trivia: "Judas betrayed Jesus to the chief priests for thirty pieces of silver.", reference: "Matthew 26:14-15", verseText: "Then one of the Twelve—the one called Judas Iscariot—went to the chief priests and asked, 'What are you willing to give me if I deliver him over to you?' So they counted out for him thirty pieces of silver." }
  ],
  // Level 12
  [
    { question: "Who was the king who built the first Temple in Jerusalem?", options: ["David", "Saul", "Hezekiah", "Solomon"], answer: "Solomon", trivia: "Though his father David had desired to build it and gathered materials, the honor of constructing the magnificent temple was given to Solomon.", reference: "1 Kings 6:1", verseText: "In the four hundred and eightieth year after the Israelites came out of Egypt, in the fourth year of Solomon’s reign over Israel, in the month of Ziv, the second month, he began to build the temple of the LORD." },
    { question: "Who was the wife of Jacob for whom he worked a total of fourteen years?", options: ["Leah", "Bilhah", "Zilpah", "Rachel"], answer: "Rachel", trivia: "Jacob was tricked into marrying her older sister Leah first, but his love for Rachel was so great that he agreed to work another seven years for her.", reference: "Genesis 29:28", verseText: "Jacob did so. He finished the week with Leah, and then Laban gave him his daughter Rachel to be his wife." },
    { question: "Who was the man who had to be lowered through a roof to be healed by Jesus?", options: ["A blind man", "A paralyzed man", "A leper", "A deaf man"], answer: "A paralyzed man", trivia: "The faith of the four friends who brought him was so great that they dug a hole in the roof to get their friend to Jesus.", reference: "Mark 2:4-5", verseText: "Since they could not get him to Jesus because of the crowd, they made an opening in the roof above Jesus by digging through it and then lowered the mat the man was lying on. When Jesus saw their faith, he said to the paralyzed man, 'Son, your sins are forgiven.'" },
    { question: "Who was the prophet from Moresheth who prophesied during the reigns of Jotham, Ahaz, and Hezekiah?", options: ["Nahum", "Micah", "Habakkuk", "Zephaniah"], answer: "Micah", trivia: "Micah is famous for summarizing God's requirement for humanity in one verse.", reference: "Micah 6:8", verseText: "He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God." },
    { question: "Who was the mother of Ishmael, Abraham's firstborn son?", options: ["Sarah", "Keturah", "Hagar", "Milcah"], answer: "Hagar", trivia: "Hagar was Sarah's Egyptian maidservant. After being mistreated, she fled but was met by an angel of the Lord who promised to multiply her descendants.", reference: "Genesis 16:15", verseText: "So Hagar bore Abram a son, and Abram gave the name Ishmael to the son she had borne." },
    { question: "Who was Paul's younger companion and 'son in the faith,' whom he sent to lead the church in Crete?", options: ["Timothy", "Titus", "Tychicus", "Luke"], answer: "Titus", trivia: "The Epistle to Titus gives instructions for church leadership and Christian living, showing Paul's trust in his protégé.", reference: "Titus 1:4", verseText: "To Titus, my true son in our common faith: Grace and peace from God the Father and Christ Jesus our Savior." },
    { question: "Who was the commander of David's army?", options: ["Abner", "Benaiah", "Joab", "Amasa"], answer: "Joab", trivia: "Joab was David's nephew and a skilled but often ruthless military commander who was loyal to David for most of his reign.", reference: "2 Samuel 8:16", verseText: "Joab son of Zeruiah was over the army; Jehoshaphat son of Ahilud was recorder;" },
    { question: "Who was the sorcerer on the island of Paphos who was struck blind by Paul?", options: ["Simon Magus", "Elymas", "Sceva", "Apollonius"], answer: "Elymas", trivia: "Elymas, also known as Bar-Jesus, tried to turn the proconsul Sergius Paulus from the faith, prompting Paul's divine judgment.", reference: "Acts 13:11", verseText: "Now the hand of the Lord is against you. You are going to be blind for a time, not even able to see the light of the sun.' Immediately mist and darkness came over him, and he groped about, seeking someone to lead him by the hand." },
    { question: "Who was the king of Persia who issued the decree allowing the Jews to return to Jerusalem and rebuild the temple?", options: ["Darius", "Artaxerxes", "Cyrus", "Xerxes"], answer: "Cyrus", trivia: "The prophet Isaiah had prophesied by name that Cyrus would be God's instrument to restore His people, almost 150 years before Cyrus was born.", reference: "Ezra 1:2", verseText: "This is what Cyrus king of Persia says: 'The LORD, the God of heaven, has given me all the kingdoms of the earth and he has appointed me to build a temple for him at Jerusalem in Judah.'" },
    { question: "Who was the author of the Book of Lamentations?", options: ["Ezekiel", "Daniel", "Baruch", "Jeremiah"], answer: "Jeremiah", trivia: "Tradition holds that the prophet Jeremiah wrote this book as a mournful lament over the destruction of Jerusalem and the temple by the Babylonians.", reference: "Lamentations 1:1", verseText: "How deserted lies the city, once so full of people! How like a widow is she, who once was great among the nations! She who was queen among the provinces has now become a slave." }
  ],
  // Level 13
  [
    { question: "Who was the son of David who rebelled against him and was killed while hanging by his hair from a tree?", options: ["Amnon", "Adonijah", "Absalom", "Solomon"], answer: "Absalom", trivia: "Absalom was known for his handsome appearance and long, thick hair. His rebellion caused a civil war in Israel.", reference: "2 Samuel 18:9", verseText: "Now Absalom happened to meet David’s men. He was riding his mule, and as the mule went under the thick branches of a large oak, Absalom’s hair got caught in the tree. He was left hanging in midair, while the mule he was riding kept on going." },
    { question: "Who was the prophet who foretold the destruction of Nineveh?", options: ["Jonah", "Obadiah", "Nahum", "Zephaniah"], answer: "Nahum", trivia: "While Jonah's earlier prophecy led to Nineveh's repentance, Nahum's prophecy, about 150 years later, declared its final and utter destruction due to its renewed wickedness.", reference: "Nahum 1:1", verseText: "A prophecy concerning Nineveh. The book of the vision of Nahum the Elkoshite." },
    { question: "Who was the woman who, along with her husband Aquila, instructed Apollos more accurately in the faith?", options: ["Phoebe", "Lydia", "Priscilla", "Chloe"], answer: "Priscilla", trivia: "Priscilla and Aquila were tentmakers, like Paul, and became important leaders and teachers in the early church, hosting a church in their home.", reference: "Acts 18:26", verseText: "He began to speak boldly in the synagogue. When Priscilla and Aquila heard him, they invited him to their home and explained to him the way of God more adequately." },
    { question: "Who was the first person mentioned in the Bible as a 'mighty hunter before the LORD'?", options: ["Esau", "Nimrod", "Lamech", "Goliath"], answer: "Nimrod", trivia: "Nimrod was a great-grandson of Noah and the founder of several ancient cities, including Babylon and Nineveh, in the land of Shinar.", reference: "Genesis 10:9", verseText: "He was a mighty hunter before the LORD; that is why it is said, 'Like Nimrod, a mighty hunter before the LORD.'" },
    { question: "Who was the king of Judah who was hidden in the temple for six years to protect him from his wicked grandmother, Athaliah?", options: ["Ahaziah", "Joash", "Amaziah", "Uzziah"], answer: "Joash", trivia: "After Queen Athaliah tried to destroy the entire royal family, the young prince Joash was rescued by his aunt Jehosheba and the high priest Jehoiada.", reference: "2 Kings 11:2-3", verseText: "But Jehosheba, the daughter of King Jehoram and sister of Ahaziah, took Joash son of Ahaziah and stole him away from among the royal princes, who were about to be murdered. She put him and his nurse in a bedroom to hide him from Athaliah; so he was not killed. He remained hidden with his nurse at the temple of the LORD for six years while Athaliah ruled the land." },
    { question: "Who was the prophet who spoke of a 'new covenant' that God would make with Israel and Judah?", options: ["Isaiah", "Ezekiel", "Jeremiah", "Hosea"], answer: "Jeremiah", trivia: "Jeremiah's prophecy of a new covenant, where the law would be written on people's hearts, is a cornerstone of Christian theology, fulfilled in Jesus Christ.", reference: "Jeremiah 31:31", verseText: "'The days are coming,' declares the LORD, 'when I will make a new covenant with the people of Israel and with the people of Judah.'" },
    { question: "Who was the first city judge, appointed by Moses at the suggestion of his father-in-law Jethro?", options: ["It is not recorded", "Caleb", "Eldad", "Medad"], answer: "It is not recorded", trivia: "The Bible states that Moses appointed capable men, but it does not name the specific individuals who first served as these lower-court judges.", reference: "Exodus 18:25", verseText: "He chose capable men from all Israel and made them leaders of the people, officials over thousands, hundreds, fifties and tens." },
    { question: "Who was the prophet who was also a priest, taken into exile in Babylon, and saw visions of God's glory by the Kebar River?", options: ["Daniel", "Haggai", "Zechariah", "Ezekiel"], answer: "Ezekiel", trivia: "Ezekiel's ministry was to the Jewish exiles in Babylon, communicating God's judgment and His ultimate promise of restoration for Israel.", reference: "Ezekiel 1:3", verseText: "the word of the LORD came to Ezekiel the priest, the son of Buzi, by the Kebar River in the land of the Babylonians. There the hand of the LORD was on him." },
    { question: "Who was the man who was struck dead for touching the Ark of the Covenant?", options: ["Uzzah", "Ahio", "Obed-Edom", "Eleazar"], answer: "Uzzah", trivia: "Uzzah touched the Ark to steady it when the oxen stumbled, but this was a violation of God's specific commands for how the holy object was to be handled.", reference: "2 Samuel 6:6-7", verseText: "When they came to the threshing floor of Nakon, Uzzah reached out and took hold of the ark of God, because the oxen stumbled. The LORD’s anger burned against Uzzah because of his irreverent act; therefore God struck him down, and he died there beside the ark of God." },
    { question: "Who was the disciple who was a member of the Sanhedrin and came to Jesus by night?", options: ["Joseph of Arimathea", "Gamaliel", "Nicodemus", "Simon the Pharisee"], answer: "Nicodemus", trivia: "Nicodemus, a Pharisee, had a famous conversation with Jesus about being 'born again.' He later helped Joseph of Arimathea bury Jesus.", reference: "John 3:1-2", verseText: "Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council. He came to Jesus at night and said, 'Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.'" }
  ],
  // Level 14
  [
    { question: "Who was the wicked son of Gideon who murdered 70 of his brothers to become king?", options: ["Jotham", "Abimelech", "Gaal", "Zebul"], answer: "Abimelech", trivia: "Abimelech's tyrannical rule ended when a woman dropped an upper millstone on his head from a tower, and he had his armor-bearer finish him off.", reference: "Judges 9:5", verseText: "He went to his father’s home in Ophrah and on one stone murdered his seventy brothers, the sons of Jerub-Baal. But Jotham, Jerub-Baal’s youngest son, escaped by hiding." },
    { question: "Who was the prophet who foretold the place of Jesus' birth in Bethlehem?", options: ["Isaiah", "Jeremiah", "Hosea", "Micah"], answer: "Micah", trivia: "Centuries before Jesus was born, Micah pinpointed the small town of Bethlehem as the birthplace of Israel's future ruler.", reference: "Micah 5:2", verseText: "'But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come for me one who will be ruler over Israel, whose origins are from of old, from ancient times.'" },
    { question: "Who was the Gentile king whom God called 'my shepherd' and 'his anointed'?", options: ["Nebuchadnezzar", "Cyrus", "Darius", "Artaxerxes"], answer: "Cyrus", trivia: "Isaiah prophesied that Cyrus the Great of Persia would be God's instrument to free the Jews from Babylon and authorize the rebuilding of the temple.", reference: "Isaiah 45:1", verseText: "'This is what the LORD says to his anointed, to Cyrus, whose right hand I take hold of to subdue nations before him and to strip kings of their armor...'" },
    { question: "Who was the man who helped his father-in-law Jacob deceive Isaac to receive the blessing?", options: ["Esau", "Laban", "This is a trick question; Jacob acted alone", "Rebekah's nurse, Deborah"], answer: "This is a trick question; Jacob acted alone", trivia: "It was Jacob's mother, Rebekah, who orchestrated the deception, not his father-in-law Laban, whom he had not yet met.", reference: "Genesis 27:6", verseText: "Rebekah said to her son Jacob, 'Look, I overheard your father say to your brother Esau...'" },
    { question: "Who was the high priest during the reign of King David who was a descendant of Eli?", options: ["Zadok", "Ahimelech", "Abiathar", "Jehoiada"], answer: "Abiathar", trivia: "Abiathar was the lone survivor of the massacre of the priests at Nob and served David faithfully, but was later banished by Solomon for supporting a rival claimant to the throne.", reference: "1 Samuel 22:20", verseText: "But Abiathar, a son of Ahimelech son of Ahitub, escaped and fled to join David." },
    { question: "Who was the 'chosen lady' to whom the Apostle John wrote his second epistle?", options: ["Mary", "Phoebe", "She is unnamed", "Electa"], answer: "She is unnamed", trivia: "Scholars debate whether the 'chosen lady' refers to a specific woman who hosted a house church or is a symbolic name for the church itself.", reference: "2 John 1:1", verseText: "The elder, To the lady chosen by God and to her children, whom I love in the truth..." },
    { question: "Who was the commander of the Syrian army who was healed of leprosy after washing in the Jordan River?", options: ["Ben-Hadad", "Hazael", "Naaman", "Rezon"], answer: "Naaman", trivia: "Initially angered by the simple instructions of the prophet Elisha, Naaman's servants persuaded him to obey, leading to his miraculous healing and conversion.", reference: "2 Kings 5:14", verseText: "So he went down and dipped himself in the Jordan seven times, as the man of God had told him, and his flesh was restored and became clean like that of a young boy." },
    { question: "Who was the prophet who was a contemporary of King Josiah and witnessed the fall of Jerusalem?", options: ["Isaiah", "Zephaniah", "Habakkuk", "Haggai"], answer: "Zephaniah", trivia: "Zephaniah, who was likely of royal descent, preached a message of impending judgment (the 'Day of the LORD') and the promise of a future remnant.", reference: "Zephaniah 1:1", verseText: "The word of the LORD that came to Zephaniah son of Cushi, the son of Gedaliah, the son of Amariah, the son of Hezekiah, during the reign of Josiah son of Amon king of Judah." },
    { question: "Who was the woman who killed the Canaanite commander Sisera with a tent peg?", options: ["Deborah", "Judith", "Jael", "Esther"], answer: "Jael", trivia: "Jael, the wife of Heber the Kenite, lured the fugitive commander Sisera into her tent and killed him in his sleep, fulfilling Deborah's prophecy.", reference: "Judges 4:21", verseText: "But Jael, Heber’s wife, picked up a tent peg and a hammer and went quietly to him while he lay fast asleep, exhausted. She drove the peg through his temple into the ground, and he died." },
    { question: "Who was the disciple that Jesus loved?", options: ["Peter", "James", "Andrew", "John"], answer: "John", trivia: "The Gospel of John uses this title to refer to its author, traditionally believed to be the Apostle John, who was part of Jesus' inner circle.", reference: "John 13:23", verseText: "One of them, the disciple whom Jesus loved, was reclining next to him." }
  ],
  // Level 15
  [
    { question: "Who was the grandfather of Noah who lived 969 years, the longest lifespan in the Bible?", options: ["Enoch", "Lamech", "Methuselah", "Jared"], answer: "Methuselah", trivia: "Methuselah's name can mean 'his death shall bring,' and some scholars believe he died in the same year as the Great Flood.", reference: "Genesis 5:27", verseText: "Altogether, Methuselah lived a total of 969 years, and then he died." },
    { question: "Who was the high priest who led the rebuilding of the temple's altar after the Babylonian exile?", options: ["Ezra", "Jeshua", "Seraiah", "Hilkiah"], answer: "Jeshua", trivia: "Jeshua (also called Joshua), along with the governor Zerubbabel, led the first group of exiles back and re-established the worship of God in Jerusalem.", reference: "Ezra 3:2", verseText: "Then Jeshua son of Jozadak and his fellow priests and Zerubbabel son of Shealtiel and his associates began to build the altar of the God of Israel to sacrifice burnt offerings on it, in accordance with what is written in the Law of Moses the man of God." },
    { question: "Who was the Roman ruler of Galilee who beheaded John the Baptist?", options: ["Pontius Pilate", "Herod the Great", "Herod Antipas", "Agrippa"], answer: "Herod Antipas", trivia: "Herod Antipas had John imprisoned for speaking out against his unlawful marriage to Herodias, his brother's wife. He reluctantly had John executed at Herodias's request.", reference: "Mark 6:27", verseText: "So he immediately sent an executioner with orders to bring John’s head. The man went, beheaded John in the prison," },
    { question: "Who was the prophet whose book is a complaint to God about the prosperity of the wicked?", options: ["Zephaniah", "Nahum", "Obadiah", "Habakkuk"], answer: "Habakkuk", trivia: "Habakkuk's book is unique as it is structured as a dialogue between the prophet and God, grappling with questions of justice and suffering.", reference: "Habakkuk 1:2", verseText: "How long, LORD, must I call for help, but you do not listen? Or cry out to you, 'Violence!' but you do not save?" },
    { question: "Who was the leader of the church in Jerusalem who presided over the Jerusalem Council?", options: ["Peter", "John", "Paul", "James"], answer: "James", trivia: "This James, known as the brother of Jesus, was a key leader who helped decide that Gentile believers did not need to be circumcised.", reference: "Acts 15:13", verseText: "When they finished, James spoke up. 'Brothers,' he said, 'listen to me.'" },
    { question: "Who was the man who, with his wife Sapphira, was struck dead for lying to the Holy Spirit?", options: ["Ananias", "Aquila", "Apollos", "Alexander"], answer: "Ananias", trivia: "Their sin was not withholding money, but deception—pretending to give the full amount from a sale of land to the apostles.", reference: "Acts 5:3", verseText: "Then Peter said, 'Ananias, how is it that Satan has so filled your heart that you have lied to the Holy Spirit and have kept for yourself some of the money you received for the land?'" },
    { question: "Who was the king of Salem and priest of God Most High who blessed Abraham?", options: ["Abimelech", "Adonizedek", "Jethro", "Melchizedek"], answer: "Melchizedek", trivia: "Melchizedek is a mysterious figure who appears without any genealogy. The book of Hebrews presents him as a type of Christ, an eternal priest-king.", reference: "Genesis 14:18", verseText: "Then Melchizedek king of Salem brought out bread and wine. He was priest of God Most High," },
    { question: "Who was the prophet from Edom whose book is the shortest in the Old Testament?", options: ["Haggai", "Malachi", "Obadiah", "Joel"], answer: "Obadiah", trivia: "The book of Obadiah is a prophecy of judgment against the nation of Edom for their pride and their mistreatment of Israel.", reference: "Obadiah 1:1", verseText: "The vision of Obadiah. This is what the Sovereign LORD says about Edom— We have heard a message from the LORD: An envoy was sent to the nations to say, 'Rise, let us go against her for battle'—" },
    { question: "Who was the left-handed judge from the tribe of Benjamin who assassinated King Eglon of Moab?", options: ["Othniel", "Shamgar", "Tola", "Ehud"], answer: "Ehud", trivia: "Ehud used his left-handedness to his advantage, concealing a sword on his right thigh where guards would not expect it, allowing him to deliver Israel from oppression.", reference: "Judges 3:16", verseText: "Now Ehud had made a double-edged sword about a cubit long, which he strapped to his right thigh under his clothing." },
    { question: "Who was the Christian from Rome mentioned by Paul as 'my dear friend, who was the first convert to Christ in the province of Asia'?", options: ["Andronicus", "Urbanus", "Epenetus", "Stachys"], answer: "Epenetus", trivia: "This personal greeting in Romans shows the deep relationships Paul formed and valued across his missionary journeys.", reference: "Romans 16:5", verseText: "Greet also the church that meets at their house. Greet my dear friend Epenetus, who was the first convert to Christ in the province of Asia." }
  ],
  // Level 16
  [
    { question: "Who was the son of David known for his great wisdom, wealth, and building the first temple?", options: ["Absalom", "Adonijah", "Solomon", "Amnon"], answer: "Solomon", trivia: "When God offered him anything he wanted, Solomon asked for wisdom to govern God's people, a request that pleased God.", reference: "1 Kings 3:9", verseText: "'So give your servant a discerning heart to govern your people and to distinguish between right and wrong. For who is able to govern this great people of yours?'" },
    { question: "Who was the prophetess who lived in the temple and recognized the infant Jesus as the Messiah?", options: ["Elizabeth", "Mary", "Anna", "Joanna"], answer: "Anna", trivia: "Anna was an elderly widow who devoted her life to worship. She gave thanks to God and spoke about Jesus to all who were looking for the redemption of Jerusalem.", reference: "Luke 2:37-38", verseText: "...and then was a widow until she was eighty-four. She never left the temple but worshiped night and day, fasting and praying. Coming up to them at that very moment, she gave thanks to God and spoke about the child to all who were looking forward to the redemption of Jerusalem." },
    { question: "Who was the father of the tribe from which the priests of Israel came?", options: ["Judah", "Joseph", "Benjamin", "Levi"], answer: "Levi", trivia: "The tribe of Levi was set apart for sacred duties and did not receive a tribal land inheritance like the other sons of Jacob.", reference: "Numbers 1:50", verseText: "Instead, appoint the Levites to be in charge of the tabernacle of the covenant law—over all its furnishings and everything belonging to it." },
    { question: "Who was the wealthy tax collector from Jericho who climbed a tree to see Jesus?", options: ["Matthew", "Simon", "Zacchaeus", "Levi"], answer: "Zacchaeus", trivia: "After his encounter with Jesus, Zacchaeus had a radical transformation, promising to give half his possessions to the poor and pay back anyone he had cheated.", reference: "Luke 19:8", verseText: "But Zacchaeus stood up and said to the Lord, 'Look, Lord! Here and now I give half of my possessions to the poor, and if I have cheated anybody out of anything, I will pay back four times the amount.'" },
    { question: "Who was the first Christian convert in the city of Corinth, according to Paul?", options: ["Crispus", "Gaius", "Stephanas", "Justus"], answer: "Crispus", trivia: "Crispus was the ruler of the synagogue in Corinth, and his conversion, along with his entire household, was a significant event for the new church there.", reference: "Acts 18:8", verseText: "Crispus, the synagogue leader, and his entire household believed in the Lord; and many of the Corinthians who heard Paul believed and were baptized." },
    { question: "Who was the woman who poured expensive perfume on Jesus' head in Bethany?", options: ["Mary Magdalene", "Mary of Bethany", "Martha", "An unnamed woman"], answer: "An unnamed woman", trivia: "In the gospels of Matthew and Mark, this act is performed by an unnamed woman at the house of Simon the Leper, just before the Passover.", reference: "Matthew 26:7", verseText: "...a woman came to him with an alabaster jar of very expensive perfume, which she poured on his head as he was reclining at the table." },
    { question: "Who was the king of Judah who, after a period of great wickedness, repented in captivity and was restored to his throne?", options: ["Amon", "Jehoiakim", "Manasseh", "Zedekiah"], answer: "Manasseh", trivia: "Manasseh's reign was one of the most idolatrous in Judah's history, but his story is a powerful testament to God's willingness to forgive even the most wicked upon their sincere repentance.", reference: "2 Chronicles 33:12-13", verseText: "In his distress he sought the favor of the LORD his God and humbled himself greatly before the God of his ancestors. And when he prayed to him, the LORD was moved by his entreaty and listened to his plea; so he brought him back to Jerusalem and to his kingdom." },
    { question: "Who was the prophet that encouraged the returning exiles to rebuild the temple?", options: ["Zechariah", "Malachi", "Haggai", "Joel"], answer: "Haggai", trivia: "Haggai's short book consists of a series of messages from God, urging the people to prioritize building God's house over their own paneled houses.", reference: "Haggai 1:4", verseText: "'Is it a time for you yourselves to be living in your paneled houses, while this house remains a ruin?'" },
    { question: "Who was the first of the seven deacons chosen by the apostles, and also the first Christian martyr?", options: ["Philip", "Procorus", "Nicanor", "Stephen"], answer: "Stephen", trivia: "Stephen, a man full of faith and the Holy Spirit, delivered a powerful sermon recounting Israel's history before he was stoned to death by the Sanhedrin.", reference: "Acts 7:59", verseText: "While they were stoning him, Stephen prayed, 'Lord Jesus, receive my spirit.'" },
    { question: "Who was the man who was raised from the dead by Jesus after being in the tomb for four days?", options: ["Jairus's son", "The widow's son", "Lazarus", "Eutychus"], answer: "Lazarus", trivia: "The raising of Lazarus of Bethany was one of Jesus' most astounding miracles, demonstrating his power over death and serving as a foreshadowing of his own resurrection.", reference: "John 11:43-44", verseText: "When he had said this, Jesus called in a loud voice, 'Lazarus, come out!' The dead man came out, his hands and feet wrapped with strips of linen, and a cloth around his face." }
  ],
  // Level 17
  [
    { question: "Who was the Jewish teacher under whom Paul studied?", options: ["Hillel", "Shammai", "Gamaliel", "Philo"], answer: "Gamaliel", trivia: "Gamaliel was a respected Pharisee and member of the Sanhedrin who advised caution in dealing with the apostles.", reference: "Acts 22:3", verseText: "'I am a Jew, born in Tarsus of Cilicia, but brought up in this city. I studied under Gamaliel and was thoroughly trained in the law of our ancestors...'" },
    { question: "Who was the husband of the prophetess Deborah?", options: ["Barak", "Heber", "Lappidoth", "Sisera"], answer: "Lappidoth", trivia: "The Bible gives very little information about Lappidoth, mentioning him only as the husband of the great prophetess and judge.", reference: "Judges 4:4", verseText: "Now Deborah, a prophet, the wife of Lappidoth, was leading Israel at that time." },
    { question: "Who was the prophet whose book contains the famous 'valley of dry bones' vision?", options: ["Isaiah", "Jeremiah", "Ezekiel", "Daniel"], answer: "Ezekiel", trivia: "This vision was a powerful symbol of hope for the exiled Israelites, representing God's promise to restore the 'dead' nation of Israel to life.", reference: "Ezekiel 37:11", verseText: "Then he said to me: 'Son of man, these bones are the people of Israel. They say, ‘Our bones are dried up and our hope is gone; we are cut off.’'" },
    { question: "Who was the man from whom Jesus cast out a legion of demons?", options: ["The Gerasene demoniac", "The boy with a spirit", "The Canaanite's daughter", "Mary Magdalene"], answer: "The Gerasene demoniac", trivia: "After being healed, the man begged to go with Jesus, but Jesus sent him home to tell his people how much the Lord had done for him.", reference: "Mark 5:9", verseText: "Then Jesus asked him, 'What is your name?' 'My name is Legion,' he replied, 'for we are many.'" },
    { question: "Who was the firstborn son of Adam and Eve?", options: ["Abel", "Seth", "Cain", "Enoch"], answer: "Cain", trivia: "Cain was a farmer who committed the first murder in the Bible by killing his brother Abel out of jealousy.", reference: "Genesis 4:1", verseText: "Adam made love to his wife Eve, and she became pregnant and gave birth to Cain. She said, 'With the help of the LORD I have brought forth a man.'" },
    { question: "Who was the prophet that prophesied that a virgin would conceive and give birth to a son?", options: ["Jeremiah", "Micah", "Hosea", "Isaiah"], answer: "Isaiah", trivia: "This prophecy in Isaiah is one of the most significant messianic prophecies, directly quoted in the Gospel of Matthew in relation to Jesus' birth.", reference: "Isaiah 7:14", verseText: "Therefore the Lord himself will give you a sign: The virgin will conceive and give birth to a son, and will call him Immanuel." },
    { question: "Who was the son of Jacob whose brothers sold him into slavery?", options: ["Reuben", "Judah", "Benjamin", "Joseph"], answer: "Joseph", trivia: "Joseph's brothers were jealous of him because he was their father's favorite. His story is a powerful example of forgiveness and God's sovereignty.", reference: "Genesis 37:28", verseText: "So when the Midianite merchants came by, his brothers pulled Joseph up out of the cistern and sold him for twenty shekels of silver to the Ishmaelites, who took him to Egypt." },
    { question: "Who was the companion of Paul on his first missionary journey?", options: ["Silas", "Barnabas", "Timothy", "Mark"], answer: "Barnabas", trivia: "Barnabas, whose name means 'son of encouragement,' was a Levite from Cyprus who vouched for Paul to the apostles in Jerusalem.", reference: "Acts 13:2", verseText: "While they were worshiping the Lord and fasting, the Holy Spirit said, 'Set apart for me Barnabas and Saul for the work to which I have called them.'" },
    { question: "Who was the king who offered to give John the Baptist anything he wanted, up to half his kingdom?", options: ["Herod the Great", "Herod Agrippa I", "Herod Antipas", "Philip the Tetrarch"], answer: "Herod Antipas", trivia: "He made this rash promise to his stepdaughter after she pleased him with her dancing, leading to the execution of John the Baptist.", reference: "Mark 6:23", verseText: "And he promised her with an oath, 'Whatever you ask I will give you, up to half my kingdom.'" },
    { question: "Who was the man who fell to his death from a third-story window during one of Paul's long sermons?", options: ["Eutychus", "Gaius", "Trophimus", "Erastus"], answer: "Eutychus", trivia: "Paul miraculously raised the young man Eutychus back to life and then continued speaking until daylight.", reference: "Acts 20:9", verseText: "Seated in a window was a young man named Eutychus, who was sinking into a deep sleep as Paul talked on and on. When he was sound asleep, he fell to the ground from the third story and was picked up dead." }
  ],
  // Level 18
  [
    { question: "Who was the Cushite who brought David the news of Absalom's death?", options: ["Ahimaaz", "Benaiah", "Ittai the Gittite", "An unnamed Cushite"], answer: "An unnamed Cushite", trivia: "Though Ahimaaz ran faster, Joab sent the Cushite with the direct news, knowing it would be painful for David to hear.", reference: "2 Samuel 18:31-32", verseText: "Then the Cushite arrived and said, 'My lord the king, hear the good news! The LORD has vindicated you today by delivering you from the hand of all who rose up against you.' The king asked the Cushite, 'Is the young man Absalom safe?'" },
    { question: "Who was the father of King Saul?", options: ["Abner", "Jesse", "Kish", "Jonathan"], answer: "Kish", trivia: "Kish was a Benjamite, a man of standing. The story of Saul's anointing begins when he is sent to look for his father's lost donkeys.", reference: "1 Samuel 9:1", verseText: "There was a Benjamite, a man of standing, whose name was Kish son of Abiel, the son of Zeror, the son of Bekorath, the son of Aphiah of Benjamin." },
    { question: "Who was the prophet whose book contains prophecies about a locust plague and the outpouring of the Spirit?", options: ["Amos", "Obadiah", "Joel", "Micah"], answer: "Joel", trivia: "The Apostle Peter quoted Joel's prophecy about the Spirit on the day of Pentecost to explain the miraculous events happening.", reference: "Joel 2:28", verseText: "'And afterward, I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams, your young men will see visions.'" },
    { question: "Who was the governor of Judea to whom Paul appealed to be tried by Caesar?", options: ["Felix", "Festus", "Agrippa", "Pilate"], answer: "Festus", trivia: "When Festus suggested sending him back to Jerusalem to be tried by the Jewish leaders, Paul, a Roman citizen, exercised his right to appeal to the emperor.", reference: "Acts 25:11", verseText: "If, however, I am guilty of doing anything deserving death, I do not refuse to die. But if the charges brought against me by these Jews are not true, no one has the right to hand me over to them. I appeal to Caesar!" },
    { question: "Who was the woman who is praised in the last chapter of Proverbs?", options: ["The Virtuous Woman", "The Wise Woman", "The Noble Wife", "All of the above"], answer: "All of the above", trivia: "Proverbs 31 describes an ideal wife and mother who is industrious, wise, and fears the Lord. The titles are different translations of the same passage.", reference: "Proverbs 31:10", verseText: "A wife of noble character who can find? She is worth far more than rubies." },
    { question: "Who was the king of Tyre who was a great friend of David and Solomon and supplied them with cedar logs?", options: ["Abibaal", "Hiram", "Ithobaal I", "Pygmalion"], answer: "Hiram", trivia: "Hiram's skilled craftsmen and quality materials were essential for building both David's palace and Solomon's Temple.", reference: "1 Kings 5:1", verseText: "When Hiram king of Tyre heard that Solomon had been anointed king to succeed his father David, he sent his envoys to Solomon, because he had always been on friendly terms with David." },
    { question: "Who was the son of Jacob from whom the kings of Judah, including David and Jesus, were descended?", options: ["Reuben", "Levi", "Judah", "Joseph"], answer: "Judah", trivia: "In his final blessing, Jacob prophesied that the 'scepter will not depart from Judah,' indicating the royal line.", reference: "Genesis 49:10", verseText: "The scepter will not depart from Judah, nor the ruler’s staff from between his feet, until he to whom it belongs shall come and the obedience of the nations shall be his." },
    { question: "Who was the man who was healed of blindness by Jesus at the Pool of Siloam?", options: ["Bartimaeus", "The man born blind", "A man from Bethsaida", "Two men from Galilee"], answer: "The man born blind", trivia: "This miracle in John's gospel sparked a major controversy with the Pharisees, as they interrogated the man and his parents about his healing on the Sabbath.", reference: "John 9:7", verseText: "'Go,' he told him, 'wash in the Pool of Siloam' (this word means 'Sent'). So the man went and washed, and came home seeing." },
    { question: "Who was the tentmaker who, with his wife Priscilla, was a close companion and co-worker of Paul?", options: ["Apollos", "Aquila", "Tychicus", "Titus"], answer: "Aquila", trivia: "Aquila and Priscilla are almost always mentioned together in the New Testament. They hosted a church in their home and helped instruct Apollos.", reference: "Acts 18:2", verseText: "There he met a Jew named Aquila, a native of Pontus, who had recently come from Italy with his wife Priscilla, because Claudius had ordered all Jews to leave Rome. Paul went to see them," },
    { question: "Who was the wife that Jacob loved more, but who was barren for many years?", options: ["Leah", "Rachel", "Bilhah", "Zilpah"], answer: "Rachel", trivia: "After years of watching her sister Leah have children, Rachel finally gave birth to Joseph and later Benjamin, but she died during Benjamin's birth.", reference: "Genesis 30:1", verseText: "When Rachel saw that she was not bearing Jacob any children, she became jealous of her sister. So she said to Jacob, 'Give me children, or I’ll die!'" }
  ],
  // Level 19
  [
    { question: "Who was the prophetess who was the wife of Isaiah the prophet?", options: ["She is unnamed", "Huldah", "Gomer", "Jezebel"], answer: "She is unnamed", trivia: "Isaiah refers to his wife simply as 'the prophetess,' indicating she also had a prophetic ministry, though its details are not recorded.", reference: "Isaiah 8:3", verseText: "Then I went to the prophetess, and she conceived and gave birth to a son. And the LORD said to me, 'Name him Maher-Shalal-Hash-Baz.'" },
    { question: "Who was the son of Jonathan and grandson of Saul, who was lame in his feet?", options: ["Ish-Bosheth", "Armoni", "Merib-Baal", "Mephibosheth"], answer: "Mephibosheth", trivia: "He was five years old when the news of his father's and grandfather's deaths came, and in the panic, his nurse dropped him, causing his lifelong injury.", reference: "2 Samuel 4:4", verseText: "(Jonathan son of Saul had a son who was lame in both feet. He was five years old when the news about Saul and Jonathan came from Jezreel. His nurse picked him up and fled, but as she hurried to leave, he fell and became disabled. His name was Mephibosheth.)" },
    { question: "Who was the silversmith in Ephesus who started a riot against Paul?", options: ["Alexander", "Demetrius", "Gaius", "Aristarchus"], answer: "Demetrius", trivia: "Demetrius was concerned that Paul's preaching against idols would ruin his business of making silver shrines for the goddess Artemis.", reference: "Acts 19:24", verseText: "A silversmith named Demetrius, who made silver shrines of Artemis, brought in a lot of business for the craftsmen there." },
    { question: "Who was the chief official of the island of Malta who showed unusual kindness to Paul after his shipwreck?", options: ["Julius", "Gallio", "Publius", "Sergius Paulus"], answer: "Publius", trivia: "Publius welcomed Paul and his companions into his home. Paul, in turn, healed Publius's father of a fever, leading to the healing of many others on the island.", reference: "Acts 28:7-8", verseText: "There was an estate nearby that belonged to Publius, the chief official of the island. He welcomed us to his home and showed us generous hospitality for three days. His father was sick in bed, suffering from fever and dysentery. Paul went in to see him and, after prayer, placed his hands on him and healed him." },
    { question: "Who was the wife of Ahab, king of Israel, who promoted Baal worship and persecuted God's prophets?", options: ["Athaliah", "Herodias", "Jezebel", "Delilah"], answer: "Jezebel", trivia: "Jezebel was a Phoenician princess who fiercely opposed the prophets of God, especially Elijah, and had many of them killed.", reference: "1 Kings 18:4", verseText: "While Jezebel was killing off the LORD’s prophets, Obadiah had taken a hundred prophets and hidden them in two caves, fifty in each, and had supplied them with food and water." },
    { question: "Who was the disciple that Jesus loved?", options: ["Peter", "James", "Andrew", "John"], answer: "John", trivia: "The Gospel of John uses this title to refer to its author, traditionally believed to be the Apostle John, who was part of Jesus' inner circle.", reference: "John 13:23", verseText: "One of them, the disciple whom Jesus loved, was reclining next to him." },
    { question: "Who was the prophet from the southern kingdom of Judah who preached during the reign of King Hezekiah?", options: ["Isaiah", "Micah", "Nahum", "Habakkuk"], answer: "Micah", trivia: "Micah prophesied during the same period as Isaiah and is known for his emphasis on social justice and his prophecy of the Messiah's birthplace in Bethlehem.", reference: "Micah 1:1", verseText: "The word of the LORD that came to Micah of Moresheth during the reigns of Jotham, Ahaz and Hezekiah, kings of Judah—the vision he saw concerning Samaria and Jerusalem." },
    { question: "Who was the man who, with his wife Priscilla, was a tentmaker and a close associate of Paul?", options: ["Apollos", "Aquila", "Barnabas", "Silas"], answer: "Aquila", trivia: "Aquila and Priscilla are almost always mentioned together in the New Testament. They hosted a church in their home and helped instruct Apollos.", reference: "Acts 18:2-3", verseText: "There he met a Jew named Aquila, a native of Pontus, who had recently come from Italy with his wife Priscilla... Paul went to see them, and because he was a tentmaker as they were, he stayed and worked with them." },
    { question: "Who was the first king of a divided Israel (the northern kingdom)?", options: ["Rehoboam", "Jeroboam", "Ahab", "Omri"], answer: "Jeroboam", trivia: "After Solomon's death, Jeroboam led the ten northern tribes to secede from the rule of Solomon's son, Rehoboam, but he also led them into idolatry.", reference: "1 Kings 12:20", verseText: "When all the Israelites heard that Jeroboam had returned, they sent and called him to the assembly and made him king over all Israel. Only the tribe of Judah remained loyal to the house of David." },
    { question: "Who was the apostle who wrote the book of Revelation?", options: ["Peter", "Paul", "James", "John"], answer: "John", trivia: "The Apostle John received this apocalyptic vision while exiled on the island of Patmos.", reference: "Revelation 1:9", verseText: "I, John, your brother and companion in the suffering and kingdom and patient endurance that are ours in Jesus, was on the island of Patmos because of the word of God and the testimony of Jesus." }
  ],
  // Level 20
  [
    { question: "Who was the wife of Ahab, king of Israel, who promoted Baal worship and persecuted God's prophets?", options: ["Athaliah", "Herodias", "Jezebel", "Delilah"], answer: "Jezebel", trivia: "Jezebel was a Phoenician princess who fiercely opposed the prophets of God, especially Elijah.", reference: "1 Kings 21:25", verseText: "There was never anyone like Ahab, who sold himself to do evil in the eyes of the LORD, urged on by Jezebel his wife." },
    { question: "Who was the mother of John the Baptist?", options: ["Mary", "Elizabeth", "Anna", "Sarah"], answer: "Elizabeth", trivia: "Elizabeth was a relative of Mary, the mother of Jesus, and her pregnancy was a miracle in her old age.", reference: "Luke 1:13", verseText: "But the angel said to him: 'Do not be afraid, Zechariah; your prayer has been heard. Your wife Elizabeth will bear you a son, and you are to call him John.'" },
    { question: "Who was sold into slavery by his brothers but became a powerful ruler in Egypt?", options: ["Esau", "Joseph", "Benjamin", "Reuben"], answer: "Joseph", trivia: "Joseph's ability to interpret dreams, given by God, led to his rise to power in Egypt.", reference: "Genesis 41:41", verseText: "So Pharaoh said to Joseph, 'I hereby put you in charge of the whole land of Egypt.'" },
    { question: "Who was the tax collector that Jesus called to be one of His disciples?", options: ["Zacchaeus", "Nicodemus", "Matthew", "Bartholomew"], answer: "Matthew", trivia: "Matthew, also known as Levi, left his tax booth immediately to follow Jesus and later wrote the Gospel of Matthew.", reference: "Matthew 9:9", verseText: "As Jesus went on from there, he saw a man named Matthew sitting at the tax collector’s booth. 'Follow me,' he told him, and Matthew got up and followed him." },
    { question: "Who was the first Christian martyr?", options: ["Paul", "Peter", "Stephen", "James"], answer: "Stephen", trivia: "Stephen was full of God's grace and power, and he performed great wonders and signs among the people before being stoned to death.", reference: "Acts 7:59", verseText: "While they were stoning him, Stephen prayed, 'Lord Jesus, receive my spirit.'" },
    { question: "Who was the wife of Isaac and mother of Jacob and Esau?", options: ["Leah", "Rachel", "Rebekah", "Sarai"], answer: "Rebekah", trivia: "Rebekah was chosen as Isaac's wife after Abraham's servant prayed for a specific sign at a well.", reference: "Genesis 25:21", verseText: "Isaac prayed to the LORD on behalf of his wife, because she was childless. The LORD answered his prayer, and his wife Rebekah became pregnant." },
    { question: "Who led the Israelites in the battle of Jericho?", options: ["Moses", "Gideon", "Joshua", "Caleb"], answer: "Joshua", trivia: "The walls of Jericho fell after the Israelites marched around the city for seven days, following God's specific instructions.", reference: "Joshua 6:20", verseText: "When the trumpets sounded, the army shouted, and at the sound of the trumpet, when the men gave a loud shout, the wall collapsed; so everyone charged straight in, and they took the city." },
    { question: "Who was the prophet taken up to heaven in a chariot of fire?", options: ["Elisha", "Elijah", "Enoch", "Isaiah"], answer: "Elijah", trivia: "Elijah did not experience a physical death; he was taken directly to heaven in a whirlwind.", reference: "2 Kings 2:11", verseText: "As they were walking along and talking together, suddenly a chariot of fire and horses of fire appeared and separated the two of them, and Elijah went up to heaven in a whirlwind." },
    { question: "Who anointed both Saul and David as kings of Israel?", options: ["Nathan", "Samuel", "Eli", "Ahijah"], answer: "Samuel", trivia: "Samuel was a prophet and the last judge of Israel, bridging the gap between the time of the judges and the monarchy.", reference: "1 Samuel 16:13", verseText: "So Samuel took the horn of oil and anointed him in the presence of his brothers, and from that day on the Spirit of the LORD came powerfully upon David. Samuel then went to Ramah." },
    { question: "Who was the apostle that replaced Judas Iscariot?", options: ["Barnabas", "Silas", "Timothy", "Matthias"], answer: "Matthias", trivia: "The apostles cast lots to choose between Joseph called Barsabbas and Matthias, and the lot fell to Matthias.", reference: "Acts 1:26", verseText: "Then they cast lots, and the lot fell to Matthias; so he was added to the eleven apostles." },
  ]
];

const triviaLevelsFilipino = [
    // Level 1
    [
        { question: "Sino ang kilala sa kanyang pambihirang lakas, na nakatali sa kanyang mahabang buhok?", options: ["David", "Goliath", "Samson", "Gideon"], answer: "Samson" },
        { question: "Sino ang nilamon ng malaking isda matapos sumuway sa Diyos?", options: ["Jonas", "Daniel", "Elias", "Pedro"], answer: "Jonas" },
        { question: "Sino ang namuno sa mga Israelita palabas sa pagkaalipin sa Ehipto?", options: ["Josue", "Abraham", "Moises", "Jacob"], answer: "Moises" },
        { question: "Sino ang matapang na reyna na nagligtas sa kanyang mga tao mula sa isang masamang balak?", options: ["Ruth", "Esther", "Maria", "Deborah"], answer: "Esther" },
        { question: "Sino ang unang hari ng Israel?", options: ["David", "Solomon", "Saul", "Samuel"], answer: "Saul" },
        { question: "Aling alagad ang nagkaila kay Hesus ng tatlong beses bago tumilaok ang manok?", options: ["Judas", "Juan", "Tomas", "Pedro"], answer: "Pedro" },
        { question: "Sino ang itinapon sa yungib ng mga leon ngunit pinrotektahan ng Diyos?", options: ["Daniel", "Jose", "Jeremias", "Sadrac"], answer: "Daniel" },
        { question: "Sino ang ama ng labindalawang tribo ng Israel?", options: ["Isaac", "Abraham", "Jacob", "Jose"], answer: "Jacob" },
        { question: "Sino ang pinakamatalik na kaibigan ni David at anak ni Haring Saul?", options: ["Joab", "Jonathan", "Absalom", "Nathan"], answer: "Jonathan" },
        { question: "Sino ang isang propetisa at ang tanging babaeng hukom ng Israel na nabanggit sa Bibliya?", options: ["Jael", "Miriam", "Hulda", "Deborah"], answer: "Deborah" }
    ],
    // Level 2
    [
        { question: "Sino ang propeta na kumompronta kay Haring David matapos ang kanyang kasalanan kay Bathsheba?", options: ["Elias", "Isaias", "Nathan", "Samuel"], answer: "Nathan" },
        { question: "Sino ang ina ni Juan Bautista?", options: ["Maria", "Elizabeth", "Anna", "Sarah"], answer: "Elizabeth" },
        { question: "Sino ang ipinagbili ng kanyang mga kapatid bilang alipin ngunit naging makapangyarihang pinuno sa Ehipto?", options: ["Esau", "Jose", "Benjamin", "Reuben"], answer: "Jose" },
        { question: "Sino ang maniningil ng buwis na tinawag ni Hesus para maging isa sa Kanyang mga alagad?", options: ["Zaqueo", "Nicodemo", "Mateo", "Bartolome"], answer: "Mateo" },
        { question: "Sino ang unang Kristiyanong martir?", options: ["Pablo", "Pedro", "Esteban", "Santiago"], answer: "Esteban" },
        { question: "Sino ang asawa ni Isaac at ina nina Jacob at Esau?", options: ["Leah", "Rachel", "Rebekah", "Sarai"], answer: "Rebekah" },
        { question: "Sino ang namuno sa mga Israelita sa labanan sa Jerico?", options: ["Moises", "Gideon", "Josue", "Caleb"], answer: "Josue" },
        { question: "Sino ang propetang dinala sa langit sa isang karwaheng apoy?", options: ["Eliseo", "Elias", "Enoch", "Isaias"], answer: "Elias" },
        { question: "Sino ang nagpahid ng langis kina Saul at David bilang mga hari ng Israel?", options: ["Nathan", "Samuel", "Eli", "Ahias"], answer: "Samuel" },
        { question: "Sino ang apostol na pumalit kay Judas Iscariote?", options: ["Barnabas", "Silas", "Timoteo", "Matias"], answer: "Matias" }
    ],
    // Level 3
    [
        { question: "Sino ang tagahawak ng saro ng hari ng Persia na si Artaxerxes na tumulong sa muling pagtatayo ng mga pader ng Jerusalem?", options: ["Ezra", "Zerubabel", "Nehemias", "Hagai"], answer: "Nehemias" },
        { question: "Sino ang punong saserdote ng Jerusalem noong ipinako si Hesus sa krus?", options: ["Anas", "Caifas", "Eli", "Finees"], answer: "Caifas" },
        { question: "Sino ang mayamang Pariseo na tumulong sa paglilibing kay Hesus?", options: ["Nicodemo", "Jose ng Arimatea", "Simon na taga-Cirene", "Lazaro"], answer: "Jose ng Arimatea" },
        { question: "Sino ang kaliweteng hukom na nagligtas sa Israel mula sa mga Moabita?", options: ["Otniel", "Ehud", "Samgar", "Gideon"], answer: "Ehud" },
        { question: "Sino ang asawa ni Urias na Heteo, na kung kanino nagkasala si David?", options: ["Mical", "Abigail", "Bathsheba", "Tamar"], answer: "Bathsheba" },
        { question: "Sino ang propetisang kumilala sa sanggol na si Hesus bilang Mesiyas sa Templo?", options: ["Elizabeth", "Anna", "Febe", "Priscila"], answer: "Anna" },
        { question: "Sino ang salamangkero sa Samaria na sinubukang bilhin ang kapangyarihan ng Banal na Espiritu?", options: ["Elimas", "Bar-Jesus", "Simon ang Mago", "Sceva"], answer: "Simon ang Mago" },
        { question: "Sino ang pamangkin ni Abraham na piniling manirahan sa lungsod ng Sodoma?", options: ["Lot", "Laban", "Haran", "Nahor"], answer: "Lot" },
        { question: "Sino ang kahalili ng propetang si Elias?", options: ["Eliseo", "Oseas", "Amos", "Obadias"], answer: "Eliseo" },
        { question: "Sino ang unang hentil na nakumberte sa Kristiyanismo na naitala sa aklat ng Mga Gawa?", options: ["Ang Bating na taga-Etiopia", "Cornelio", "Lidia", "Sergio Paulo"], answer: "Cornelio" }
    ],
    // Level 4
    [
        { question: "Sino ang hari ng Juda na kilala sa kanyang radikal na mga repormang panrelihiyon at pagsisisi?", options: ["Hezekias", "Josias", "Uzias", "Manases"], answer: "Josias" },
        { question: "Sino ang tumakas na alipin na ipinabalik ni Pablo sa kanyang amo na si Filemon?", options: ["Tiquico", "Epafras", "Onesimo", "Arquipo"], answer: "Onesimo" },
        { question: "Sino ang panganay na anak ni Jacob na ipinagwalang-bahala ang kanyang karapatan sa pagkapanganay?", options: ["Simeon", "Levi", "Juda", "Reuben"], answer: "Reuben" },
        { question: "Sino ang propeta na inutusan ng Diyos na magpakasal sa isang patutot bilang simbolo ng kataksilan ng Israel?", options: ["Jeremias", "Oseas", "Ezekiel", "Amos"], answer: "Oseas" },
        { question: "Sino ang artisanong puno ng Espiritu ng Diyos na nangasiwa sa pagtatayo ng Tabernakulo?", options: ["Oholiab", "Huram-abi", "Bezalel", "Hiram ng Tiro"], answer: "Bezalel" },
        { question: "Sino ang Romanong gobernador na namuno sa paglilitis kay Hesus?", options: ["Herodes Antipas", "Felix", "Festus", "Poncio Pilato"], answer: "Poncio Pilato" },
        { question: "Sino ang ina ni Haring Solomon?", options: ["Hagit", "Bathsheba", "Abisag", "Mical"], answer: "Bathsheba" },
        { question: "Sino ang lalaking kailangang makumbinsi sa muling pagkabuhay ni Hesus sa pamamagitan ng paghipo sa Kanyang mga sugat?", options: ["Felipe", "Andres", "Tomas", "Bartolome"], answer: "Tomas" },
        { question: "Sino ang kapitan ng hukbong Siria na pinagaling sa ketong ni Eliseo?", options: ["Naaman", "Ben-hadad", "Hazael", "Ziba"], answer: "Naaman" },
        { question: "Sino ang nagbebenta ng telang kulay-ube mula sa Tiatira na naging mananampalataya sa Filipos?", options: ["Dorcas", "Chloe", "Lidia", "Febe"], answer: "Lidia" }
    ],
    // Level 5
    [
        { question: "Sino ang lolo ni Haring David?", options: ["Jesse", "Boaz", "Obed", "Salmon"], answer: "Obed" },
        { question: "Sino ang pari at hari ng Salem na sumalubong kay Abraham ng tinapay at alak?", options: ["Melquisedec", "Jetro", "Adonisedec", "Abimelec"], answer: "Melquisedec" },
        { question: "Sino ang propetang nakakita ng pangitain ng isang libis ng mga tuyong buto na nabuhay?", options: ["Isaias", "Jeremias", "Ezekiel", "Daniel"], answer: "Ezekiel" },
        { question: "Sino ang masamang reyna ng Israel, asawa ni Ahab, na nagtaguyod ng pagsamba kay Baal?", options: ["Jezebel", "Atalia", "Herodias", "Delilah"], answer: "Jezebel" },
        { question: "Sino ang opisyal na Hudyo sa korte ng Persia na pumigil sa masamang balak ni Haman na patayin ang mga Hudyo?", options: ["Daniel", "Nehemias", "Ezra", "Mardoqueo"], answer: "Mardoqueo" },
        { question: "Sino ang anak ni Jonathan, na pilay ang mga paa at pinakitaan ng kabaitan ni David?", options: ["Mefiboset", "Is-boset", "Adonias", "Amnon"], answer: "Mefiboset" },
        { question: "Sino ang mag-asawang nagsinungaling sa Banal na Espiritu tungkol sa pagbebenta ng kanilang ari-arian at namatay bilang resulta?", options: ["Aquila at Priscila", "Ananias at Safira", "Filemon at Apia", "Andronico at Junia"], answer: "Ananias at Safira" },
        { question: "Sino ang ikalawang hari ng hilagang kaharian ng Israel, na kilala sa pariralang 'ang mga kasalanan ni... na nagdulot ng pagkakasala sa Israel'?", options: ["Ahab", "Omri", "Jeroboam", "Baasa"], answer: "Jeroboam" },
        { question: "Sino ang propeta mula sa Tekoa na isang pastol at tagapag-alaga ng mga puno ng sikomoro?", options: ["Mikas", "Oseas", "Joel", "Amos"], answer: "Amos" },
        { question: "Sino ang 'tunay na anak sa pananampalataya' ni Pablo na kung kanino siya sumulat ng dalawang sulat?", options: ["Tito", "Timoteo", "Silas", "Lucas"], answer: "Timoteo" }
    ],
    // Level 6
    [
        { question: "Sino ang asawa ni Moises?", options: ["Miriam", "Zifora", "Jocabed", "Eliseba"], answer: "Zifora" },
        { question: "Sino ang unang punong saserdote ng Israel?", options: ["Aaron", "Levi", "Moises", "Nadab"], answer: "Aaron" },
        { question: "Sino ang ina ni Samuel?", options: ["Penina", "Naomi", "Ana", "Ruth"], answer: "Ana" },
        { question: "Sino ang ama ni Juan Bautista?", options: ["Simeon", "Jose", "Zacarias", "Herodes"], answer: "Zacarias" },
        { question: "Sino ang sakim na lingkod ni Eliseo na tinamaan ng ketong?", options: ["Naaman", "Gehazi", "Obadias", "Ziba"], answer: "Gehazi" },
        { question: "Sino ang biyenan ni Moises na nagbigay sa kanya ng matalinong payo?", options: ["Reuel", "Laban", "Jetro", "Hobab"], answer: "Jetro" },
        { question: "Sino ang unang taong naitalang binuhay mula sa mga patay ni Hesus?", options: ["Lazaro", "Anak na babae ni Jairo", "Anak ng balo sa Nain", "Tabita"], answer: "Anak ng balo sa Nain" },
        { question: "Sino ang kapatid nina Lazaro at Maria na umupo sa paanan ni Hesus upang makinig sa kanyang turo?", options: ["Salome", "Juana", "Marta", "Susana"], answer: "Marta" },
        { question: "Sino ang Romanong senturyon sa Cesarea na isa sa mga unang Hentil na nakumberte?", options: ["Julio", "Longino", "Cornelio", "Valerio"], answer: "Cornelio" },
        { question: "Sino ang babae mula sa Joppa, na kilala sa kanyang mabubuting gawa, na binuhay ni Pedro mula sa mga patay?", options: ["Lidia", "Febe", "Dorcas", "Priscila"], answer: "Dorcas" }
    ],
    // Level 7
    [
        { question: "Sino ang anak ni Isaac na nagbenta ng kanyang pagkapanganay para sa isang mangkok ng nilaga?", options: ["Jacob", "Reuben", "Esau", "Juda"], answer: "Esau" },
        { question: "Sino ang propeta na humamon sa mga propeta ni Baal sa Bundok Carmel?", options: ["Eliseo", "Jeremias", "Isaias", "Elias"], answer: "Elias" },
        { question: "Sino ang hukom ng Israel na tumalo sa isang malaking hukbo ng mga Midianita gamit lamang ang 300 tauhan?", options: ["Jefte", "Samson", "Ehud", "Gideon"], answer: "Gideon" },
        { question: "Sino ang alagad na kilala bilang 'ang Zelote'?", options: ["Simon Pedro", "Simon", "Andres", "Santiago"], answer: "Simon" },
        { question: "Sino ang hari ng Babilonia na nakakita ng sulat sa pader?", options: ["Nabucodonosor", "Dario", "Ciro", "Belsasar"], answer: "Belsasar" },
        { question: "Sino ang dalawang espiya na ipinadala ni Josue na itinago ni Rahab sa Jerico?", options: ["Caleb at Finees", "Gerson at Merari", "Isa lang ang pinangalanan", "Sila ay walang pangalan"], answer: "Sila ay walang pangalan" },
        { question: "Sino ang babaeng unang nakakita sa muling nabuhay na si Hesus?", options: ["Maria, ina ni Hesus", "Maria Magdalena", "Salome", "Juana"], answer: "Maria Magdalena" },
        { question: "Sino ang kasama sa gawain ni Pablo, isang doktor sa propesyon, na sumulat ng isang Ebanghelyo at ang aklat ng Mga Gawa?", options: ["Marcos", "Lucas", "Silas", "Barnabas"], answer: "Lucas" },
        { question: "Sino ang punong saserdote na gumabay sa batang propeta na si Samuel?", options: ["Finees", "Ahimelec", "Eli", "Abiatar"], answer: "Eli" },
        { question: "Sino ang propeta na tinawag ng Diyos na 'anak ng tao' nang higit sa 90 beses?", options: ["Isaias", "Jeremias", "Ezekiel", "Daniel"], answer: "Ezekiel" }
    ],
    // Level 8
    [
        { question: "Sino ang taong lumakad kasama ang Diyos at kinuha nang hindi nakaranas ng kamatayan?", options: ["Noe", "Elias", "Matusalem", "Enoch"], answer: "Enoch" },
        { question: "Sino ang propetisang namuno sa Israel kasama si Barak upang talunin ang hukbong Cananeo?", options: ["Jael", "Miriam", "Hulda", "Deborah"], answer: "Deborah" },
        { question: "Sino ang unang hari ng hilagang kaharian ng Israel matapos mahati ang bansa?", options: ["Rehoboam", "Omri", "Ahab", "Jeroboam"], answer: "Jeroboam" },
        { question: "Sino ang babaeng nagbuhos ng mamahaling pabango sa mga paa ni Hesus at pinunasan ito ng kanyang buhok?", options: ["Maria ng Betania", "Maria Magdalena", "Ang makasalanang babae", "Juana"], answer: "Maria ng Betania" },
        { question: "Sino ang tatlong kaibigan ni Daniel na itinapon sa isang nagliliyab na hurno?", options: ["Sadrac, Mesac, at Abednego", "Hananias, Misael, at Azarias", "Parehong A at B", "Beltsasar, Arioc, at Aspenaz"], answer: "Parehong A at B" },
        { question: "Sino ang kilalang babaeng pinuno sa unang iglesya sa Filipos?", options: ["Febe", "Priscila", "Lidia", "Euodia"], answer: "Lidia" },
        { question: "Sino ang reyna na inalis sa pwesto dahil sa pagtangging humarap sa kanyang asawang si Haring Xerxes?", options: ["Esther", "Jezebel", "Vasti", "Atalia"], answer: "Vasti" },
        { question: "Sino ang alagad na nakita ni Hesus na nakaupo sa ilalim ng puno ng igos bago siya tawagin?", options: ["Felipe", "Natanael", "Andres", "Tadeo"], answer: "Natanael" },
        { question: "Sino ang prokonsul ng Ciprus na naging mananampalataya matapos bulagin ni Pablo ang isang salamangkero?", options: ["Galio", "Felix", "Sergio Paulo", "Publio"], answer: "Sergio Paulo" },
        { question: "Sino ang magsasakang propeta mula sa timog na kaharian ng Juda na ipinadala upang magpropesiya laban sa hilagang kaharian ng Israel?", options: ["Oseas", "Amos", "Obadias", "Mikas"], answer: "Amos" }
    ],
    // Level 9
    [
        { question: "Sino ang apo ni Saul na pinakitaan ni David ng kabaitan alang-alang kay Jonathan?", options: ["Is-boset", "Mefiboset", "Mica", "Armoni"], answer: "Mefiboset" },
        { question: "Sino ang mahusay magsalitang Hudyo mula sa Alejandria na nagturo nang may kapangyarihan sa Efeso ngunit alam lamang ang bautismo ni Juan?", options: ["Aquila", "Priscila", "Apolos", "Tiquico"], answer: "Apolos" },
        { question: "Sino ang hari ng Juda na tinamaan ng ketong dahil sa pangahas na pag-aalay ng insenso sa templo?", options: ["Uzias", "Jotam", "Ahaz", "Hezekias"], answer: "Uzias" },
        { question: "Sino ang propeta na ang balumbon ay pinutol at sinunog ni Haring Jehoiakim?", options: ["Isaias", "Ezekiel", "Habacuc", "Jeremias"], answer: "Jeremias" },
        { question: "Sino ang tumakas na alipin mula sa Colosas na kung kanino sumulat si Pablo ng isang apela sa kanyang amo?", options: ["Filemon", "Arquipo", "Tiquico", "Onesimo"], answer: "Onesimo" },
        { question: "Sino ang lalaki mula sa Cirene na pinilit na pasanin ang krus ni Hesus?", options: ["Simon", "Alejandro", "Rufo", "Jose"], answer: "Simon" },
        { question: "Sino ang tapat na kaibigan at kapwa bilanggo ni Pablo, na binanggit sa pagtatapos ng Colosas?", options: ["Epafras", "Tiquico", "Aristarco", "Demas"], answer: "Aristarco" },
        { question: "Sino ang ama ni Matusalem at lolo sa tuhod ni Noe?", options: ["Jared", "Lamec", "Mahalaleel", "Enoch"], answer: "Enoch" },
        { question: "Sino ang propetisang nagkumpirma sa pagiging tunay ng Aklat ng Kautusan na natagpuan noong panahon ni Haring Josias?", options: ["Deborah", "Miriam", "Noadias", "Hulda"], answer: "Hulda" },
        { question: "Sino ang anak nina Jacob at Lea, na ang mga inapo ay naging tribong saserdote ng Israel?", options: ["Reuben", "Simeon", "Levi", "Juda"], answer: "Levi" }
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
        { question: "Ano ang pangalan ng asawa ni Abraham?", options: ["Rebekah", "Leah", "Rachel", "Sarah"], answer: "Sarah" }
    ]
];

const PERFECT_SCORE_PER_LEVEL = 10;
const MAX_LEVEL = 20; 
const STARS_TO_UNLOCK_VERSE_MEMORY_LEVEL_2 = 30; // 10 verses * 3 stars

export default function CharacterAdventuresPage() {
    const [isClient, setIsClient] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [levelScores, setLevelScores] = useState<{ [key: number]: number }>({});
    const [totalScore, setTotalScore] = useState(0);
    const [language, setLanguage] = useState<'en' | 'fil'>('en');
    const [showAdventureMap, setShowAdventureMap] = useState(true);
    const [showUnlockDialog, setShowUnlockDialog] = useState(false);
    const [showLevelCompleteDialog, setShowLevelCompleteDialog] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const loadProgress = useCallback(() => {
        if (!isClient) return;

        const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || '{}');
        if ((verseMemoryProgress.stars || 0) >= STARS_TO_UNLOCK_VERSE_MEMORY_LEVEL_2) {
            setIsUnlocked(true);
        }

        const savedProgress = localStorage.getItem('characterAdventuresProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setLevelScores(progress.scores || {});
            setTotalScore(progress.total || 0);
        }
    }, [isClient]);

    const saveProgress = useCallback(() => {
        if (!isClient) return;
        const progress = { scores: levelScores, total: totalScore };
        localStorage.setItem('characterAdventuresProgress', JSON.stringify(progress));
    }, [isClient, levelScores, totalScore]);


    useEffect(() => {
        loadProgress();
    }, [loadProgress]);

    useEffect(() => {
        saveProgress();
    }, [levelScores, totalScore, saveProgress]);

    const startLevel = (level: number) => {
        setCurrentLevel(level);
        setQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowAdventureMap(false);
    };

    const handleLevelSelect = (level: number) => {
        if (level === 1) {
            startLevel(1);
            return;
        }

        const prevLevelScore = levelScores[level - 1] || 0;
        if (prevLevelScore >= PERFECT_SCORE_PER_LEVEL) {
            startLevel(level);
        } else {
             toast({
                title: "Level Locked",
                description: `You need to get a perfect score (${PERFECT_SCORE_PER_LEVEL}/${PERFECT_SCORE_PER_LEVEL}) on Level ${level - 1} to unlock this.`,
                variant: 'destructive',
            })
        }
    };

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;

        setIsAnswered(true);
        setSelectedAnswer(option);

        const currentTrivia = language === 'en' ? triviaLevels[currentLevel - 1][questionIndex] : triviaLevelsFilipino[currentLevel - 1][questionIndex];
        const correctAnswer = currentTrivia.answer;

        if (option === correctAnswer) {
            setScore(s => s + 1);
        }

        setTimeout(() => {
            if (questionIndex < 9) {
                setQuestionIndex(q => q + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
            } else {
                const finalScore = option === correctAnswer ? score + 1 : score;
                const oldLevelScore = levelScores[currentLevel] || 0;

                if (finalScore > oldLevelScore) {
                    const scoreDifference = finalScore - oldLevelScore;
                    setTotalScore(ts => ts + scoreDifference);
                    setLevelScores(ls => ({ ...ls, [currentLevel]: finalScore }));
                }

                if (finalScore === PERFECT_SCORE_PER_LEVEL && levelScores[currentLevel] !== PERFECT_SCORE_PER_LEVEL) {
                    const completedLevels = Object.values({ ...levelScores, [currentLevel]: finalScore }).filter(s => s === PERFECT_SCORE_PER_LEVEL).length;
                    if (completedLevels === 20) {
                        setShowUnlockDialog(true);
                    }
                }
                setShowLevelCompleteDialog(true);
            }
        }, 1500);
    };

    const restartLevel = () => {
        setShowLevelCompleteDialog(false);
        startLevel(currentLevel);
    };

    const nextLevel = () => {
        setShowLevelCompleteDialog(false);
        if (currentLevel < MAX_LEVEL) {
             if ((levelScores[currentLevel] || 0) < PERFECT_SCORE_PER_LEVEL) {
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
                        <AlertDialogTitle className="font-headline text-2xl text-center">Unlock Character Adventures!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            To begin your adventure into the lives of Bible characters, you must first prove your foundational knowledge.
                            Achieve at least <strong>{STARS_TO_UNLOCK_VERSE_MEMORY_LEVEL_2} stars</strong> in the Verse Memory game.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                         <AlertDialogCancel onClick={() => router.push('/dashboard')}>Back to Dashboard</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/dashboard/verse-memory')}>
                           <BookOpen className="mr-2" /> Go to Verse Memory
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
    
    if (showAdventureMap) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="font-headline text-3xl font-bold">{language === 'en' ? 'Adventure Map' : 'Mapa ng Pakikipagsapalaran'}</h1>
                        <p className="text-muted-foreground">{language === 'en' ? 'Select a level to begin your quest.' : 'Pumili ng antas upang simulan ang iyong pakikipagsapalaran.'}</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setLanguage(l => l === 'en' ? 'fil' : 'en')}><Languages className="w-5 h-5"/></Button>
                 </div>
                 <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                            {Array.from({ length: MAX_LEVEL }).map((_, index) => {
                                const level = index + 1;
                                const isLocked = level > 1 && (levelScores[level - 1] || 0) < PERFECT_SCORE_PER_LEVEL;
                                const bestScore = levelScores[level] || 0;
                                const isPerfect = bestScore === PERFECT_SCORE_PER_LEVEL;

                                return (
                                    <div
                                        key={level}
                                        onClick={() => !isLocked && handleLevelSelect(level)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-lg border-2 text-center aspect-square",
                                            isLocked ? "bg-muted text-muted-foreground cursor-not-allowed" : "cursor-pointer hover:bg-secondary",
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

    const currentTriviaSet = language === 'en' ? triviaLevels[currentLevel - 1] : triviaLevelsFilipino[currentLevel - 1];
    const currentTrivia = currentTriviaSet[questionIndex];
    const pageTitle = language === 'en' ? 'Character Adventures' : 'Pakikipagsapalaran ng mga Tauhan';
    const pageDescription = language === 'en' ? 'Test your knowledge of biblical figures.' : 'Subukin ang iyong kaalaman sa mga tauhan sa Bibliya.';


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="font-headline text-3xl font-bold">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setShowAdventureMap(true)}><Map className="w-5 h-5"/></Button>
                    <Button variant="outline" size="icon" onClick={() => setLanguage(l => l === 'en' ? 'fil' : 'en')}><Languages className="w-5 h-5"/></Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-2xl">
                           {language === 'en' ? `Level ${currentLevel}` : `Antas ${currentLevel}`}
                        </CardTitle>
                        <div className="text-lg font-bold">
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
                            <h3 className="text-xl font-semibold text-center">{currentTrivia.question}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                             {isAnswered && currentTrivia.trivia && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="link" className="mx-auto flex items-center gap-2">
                                            <HelpCircle /> {language === 'en' ? 'Did you know?' : 'Alam mo ba?'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            {selectedAnswer === currentTrivia.answer ? (
                                                <p className="text-sm font-semibold text-green-600">Correct!</p>
                                            ) : (
                                                 <p className="text-sm font-semibold text-destructive">
                                                     {language === 'en' ? 'The correct answer was:' : 'Ang tamang sagot ay:'} {currentTrivia.answer}
                                                 </p>
                                            )}
                                            <h4 className="font-medium leading-none">{language === 'en' ? 'Extra Trivia' : 'Dagdag Kaalaman'}</h4>
                                            <p className="text-sm text-muted-foreground">{currentTrivia.trivia}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">{language === 'en' ? 'Reference' : 'Sanggunian'}</h4>
                                            <p className="text-sm font-bold">{currentTrivia.reference}</p>
                                            <p className="text-sm text-muted-foreground italic">"{currentTrivia.verseText}"</p>
                                        </div>
                                    </div>
                                    </PopoverContent>
                                </Popover>
                             )}
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
                            {score === PERFECT_SCORE_PER_LEVEL && " Perfect score!"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={restartLevel}>
                            <RotateCcw className="mr-2" />
                            {language === 'en' ? 'Play Again' : 'Ulitin'}
                        </Button>
                        <Button onClick={nextLevel} disabled={score < PERFECT_SCORE_PER_LEVEL && currentLevel < MAX_LEVEL}>
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
                        <AlertDialogCancel onClick={() => {
                            setShowUnlockDialog(false);
                            nextLevel();
                        }}>
                             {language === 'en' ? 'Continue Adventures' : 'Ipagpatuloy ang Pakikipagsapalaran'}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/dashboard/bible-mastery')}>
                            <Users className="mr-2" /> {language === 'en' ? 'Explore New Game' : 'Tuklasin ang Bagong Laro'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

    
