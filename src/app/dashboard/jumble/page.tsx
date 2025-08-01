
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserProgress } from '@/hooks/use-user-progress';
import { CheckCircle, Lightbulb, RefreshCw, Sparkles, Trophy, Shuffle, ChevronLeft, ChevronRight, CheckCircle2, Home, Lock, PlayCircle, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

const jumbleWords = [
  // Stage 1: Beginner (4-5 letters) - 100 words
  { word: "ADAM", hint: "The first man created by God." },
  { word: "NOAH", hint: "Built a large boat to save his family from a flood." },
  { word: "RUTH", hint: "A Moabite woman who showed great loyalty to her mother-in-law." },
  { word: "DAVID", hint: "A shepherd boy who became king and defeated a giant." },
  { word: "MOSES", hint: "Led the Israelites out of Egypt and received the Ten Commandments." },
  { word: "JESUS", hint: "The Son of God, Savior of the world." },
  { word: "PETER", hint: "A disciple who was a fisherman and walked on water." },
  { word: "MARY", hint: "The mother of Jesus." },
  { word: "JOHN", hint: "The disciple whom Jesus loved." },
  { word: "PAUL", hint: "Wrote many letters in the New Testament after his conversion." },
  { word: "MARK", hint: "Author of the second Gospel." },
  { word: "LUKE", hint: "A doctor who wrote a Gospel and the book of Acts." },
  { word: "ABEL", hint: "Adam and Eve's second son, murdered by his brother." },
  { word: "CAIN", hint: "Adam and Eve's first son, who killed his brother." },
  { word: "SETH", hint: "Adam and Eve's third son." },
  { word: "ENOCH", hint: "Walked with God and was taken to heaven without dying." },
  { word: "LOT", hint: "Abraham's nephew, who lived in Sodom." },
  { word: "ESAU", hint: "Jacob's twin brother, who sold his birthright." },
  { word: "JACOB", hint: "Father of the twelve tribes of Israel." },
  { word: "ISAAC", hint: "Son of Abraham and Sarah." },
  { word: "AARON", hint: "Moses' brother and the first high priest." },
  { word: "JONAH", hint: "A prophet who was swallowed by a great fish." },
  { word: "JAMES", hint: "A disciple, brother of John." },
  { word: "JUDE", hint: "Author of a short epistle, brother of James." },
  { word: "SAUL", hint: "The first king of Israel." },
  { word: "DOVE", hint: "A symbol of the Holy Spirit." },
  { word: "LAMB", hint: "A symbol of Jesus Christ." },
  { word: "LION", hint: "The tribe of Judah is compared to this animal." },
  { word: "FISH", hint: "A symbol used by early Christians." },
  { word: "BREAD", hint: "Jesus called himself the 'Bread of Life'." },
  { word: "WATER", hint: "Used in baptism, and Jesus offered 'living water'." },
  { word: "LIGHT", hint: "God said, 'Let there be ___'." },
  { word: "GRACE", hint: "God's unmerited favor." },
  { word: "FAITH", hint: "Trust and belief in God." },
  { word: "HOPE", hint: "A confident expectation." },
  { word: "LOVE", hint: "The greatest commandment." },
  { word: "SOUL", hint: "The spiritual part of a human being." },
  { word: "KING", hint: "A title for God and for rulers of Israel." },
  { word: "LORD", hint: "A name for God." },
  { word: "PRAY", hint: "To communicate with God." },
  { word: "GIFT", hint: "Salvation is a ___ from God." },
  { word: "ANGEL", hint: "A spiritual messenger from God." },
  { word: "ARK", hint: "Noah's boat; also, the container for the Ten Commandments." },
  { word: "STAR", hint: "Led the Magi to Jesus." },
  { word: "CROSS", hint: "Where Jesus was crucified." },
  { word: "TOMB", hint: "Where Jesus was buried." },
  { word: "HEAL", hint: "Jesus's power to make the sick well." },
  { word: "HOLY", hint: "Set apart, sacred." },
  { word: "WORD", hint: "The Bible is the ___ of God." },
  { word: "SONG", hint: "The book of Psalms is a book of ___." },
  { word: "ALTAR", hint: "A structure upon which offerings are made." },
  { word: "ANOINT", hint: "To consecrate with oil." },
  { word: "BIBLE", hint: "The holy book of Christianity." },
  { word: "BLESS", hint: "To confer well-being or prosperity." },
  { word: "BLOOD", hint: "A symbol of life and sacrifice." },
  { word: "BOAZ", hint: "A wealthy landowner who married Ruth." },
  { word: "CALEB", hint: "One of the two spies who trusted God." },
  { word: "CHOIR", hint: "A group of singers, especially in a church." },
  { word: "CHURCH", hint: "A building for public Christian worship." },
  { word: "CLAY", hint: "God is the potter, we are the ___." },
  { word: "CROWN", hint: "A symbol of royalty or victory." },
  { word: "DEED", hint: "An action performed intentionally." },
  { word: "DEVIL", hint: "The chief evil spirit." },
  { word: "DREAM", hint: "Joseph and Daniel interpreted these." },
  { word: "DUST", hint: "Man was formed from this." },
  { word: "ELIJAH", hint: "A prophet who was taken to heaven in a chariot of fire." },
  { word: "EMPTY", hint: "The tomb of Jesus was found ___." },
  { word: "FLESH", hint: "The soft substance of a living body." },
  { word: "FLOOD", hint: "God sent a great ___ in the time of Noah." },
  { word: "FLOCK", hint: "A group of sheep." },
  { word: "FRUIT", hint: "The ___ of the Spirit." },
  { word: "GIANT", hint: "Goliath was a ___." },
  { word: "GLORY", hint: "High renown or honor." },
  { word: "HEART", hint: "God looks at the ___." },
  { word: "HEAVEN", hint: "The abode of God." },
  { word: "HYMN", hint: "A religious song or poem of praise." },
  { word: "IMAGE", hint: "Man was made in God's ___." },
  { word: "JESSE", hint: "The father of King David." },
  { word: "JEWEL", hint: "A precious stone." },
  { word: "JOSHUA", hint: "Led the Israelites into the Promised Land." },
  { word: "JUDGE", hint: "A leader in Israel before the kings." },
  { word: "LEAH", hint: "Jacob's first wife." },
  { word: "MERCY", hint: "Compassion or forgiveness." },
  { word: "MIRIAM", hint: "The sister of Moses." },
  { word: "PEACE", hint: "A fruit of the Spirit." },
  { word: "PRAISE", hint: "To express warm approval or admiration of." },
  { word: "PSALM", hint: "A sacred song or hymn." },
  { word: "QUEEN", hint: "Esther was a ___." },
  { word: "RACHEL", hint: "Jacob's second wife." },
  { word: "SAINT", hint: "A person acknowledged as holy or virtuous." },
  { word: "SAVED", hint: "Rescued from sin." },
  { word: "SCROLL", hint: "Ancient texts were written on these." },
  { word: "SERVE", hint: "To perform duties for God or others." },
  { word: "SINAI", hint: "The mountain where Moses received the Ten Commandments." },
  { word: "SON", hint: "Jesus is the ___ of God." },
  { word: "TRUTH", hint: "Jesus is the way, the ___, and the life." },
  { word: "VOICE", hint: "Samuel heard the ___ of the Lord." },
  { word: "WHEAT", hint: "A cereal grain, often used in parables." },
  { word: "WINE", hint: "Jesus' first miracle was turning water into ___." },
  { word: "WORLD", hint: "For God so loved the ___." },
  { word: "WORRY", hint: "To feel or cause to feel anxious." },
  { word: "YOUTH", hint: "The period between childhood and adult age." },

  // Stage 2: Intermediate (6-7 letters) - 100 words
  { word: "GIDEON", hint: "A judge of Israel who defeated a large army with only 300 men." },
  { word: "SAMSON", hint: "A judge known for his incredible strength tied to his long hair." },
  { word: "ESTHER", hint: "A Jewish queen who saved her people from a plot of destruction." },
  { word: "ISAIAH", hint: "A prophet who foretold the coming of the Messiah." },
  { word: "DANIEL", hint: "A prophet who was thrown into a den of lions but was protected by God." },
  { word: "GOLIATH", hint: "The giant Philistine warrior defeated by David." },
  { word: "ABRAHAM", hint: "The father of the Jewish nation, known for his great faith." },
  { word: "JOSEPH", hint: "Was sold into slavery by his brothers but became a powerful ruler in Egypt." },
  { word: "SPIRIT", hint: "The Holy ____, the third person of the Trinity." },
  { word: "GOSPEL", hint: "Means 'good news' and refers to the message of Jesus Christ." },
  { word: "DEBORAH", hint: "The only female judge mentioned in the Bible." },
  { word: "RAHAB", hint: "A woman of Jericho who hid Israelite spies." },
  { word: "HANNAH", hint: "Mother of the prophet Samuel." },
  { word: "SAMUEL", hint: "A prophet and the last judge of Israel." },
  { word: "SOLOMON", hint: "A wise king who built the first temple." },
  { word: "ELIJAH", hint: "A prophet who challenged the prophets of Baal on Mount Carmel." },
  { word: "ELISHA", hint: "The prophet who succeeded Elijah." },
  { "word": "BAPTISM", "hint": "A Christian rite of immersion in water." },
  { "word": "MIRACLE", "hint": "An extraordinary event attributed to divine intervention." },
  { "word": "PARABLE", "hint": "A simple story used to illustrate a moral or spiritual lesson." },
  { "word": "PROPHET", "hint": "A person regarded as an inspired teacher or proclaimer of the will of God." },
  { "word": "WORSHIP", "hint": "The feeling or expression of reverence and adoration for God." },
  { "word": "SABBATH", "hint": "A day of religious observance and abstinence from work." },
  { "word": "TEMPLE", "hint": "The house of God in Jerusalem." },
  { "word": "DISCIPLE", "hint": "A personal follower of Jesus during his life." },
  { "word": "APOSTLE", "hint": "Each of the twelve chief disciples of Jesus Christ." },
  { "word": "GENTILE", "hint": "A person who is not Jewish." },
  { "word": "HEBREW", "hint": "A member of an ancient people living in what is now Israel and Palestine." },
  { "word": "ISRAEL", "hint": "The name given to Jacob and the nation descended from him." },
  { "word": "JUDAH", "hint": "The fourth son of Jacob, from whom the Davidic line descended." },
  { "word": "EPHESUS", "hint": "A major city in ancient Greece to which Paul wrote a letter." },
  { "word": "GALILEE", "hint": "The region in northern Israel where Jesus began his ministry." },
  { "word": "NAZARETH", "hint": "The town where Jesus grew up." },
  { "word": "MATTHEW", "hint": "A tax collector who became one of Jesus' disciples." },
  { "word": "ANDREW", "hint": "A disciple, brother of Peter." },
  { "word": "PHILIP", "hint": "One of the twelve apostles, he brought Nathanael to Jesus." },
  { "word": "THOMAS", "hint": "The disciple who doubted Jesus' resurrection." },
  { "word": "JUDAS", "hint": "The disciple who betrayed Jesus." },
  { "word": "STEPHEN", "hint": "The first Christian martyr." },
  { "word": "BARNABAS", "hint": "A companion of Paul on his first missionary journey." },
  { "word": "TIMOTHY", "hint": "A young pastor and companion of Paul." },
  { "word": "TITUS", "hint": "A Gentile convert and companion of Paul." },
  { "word": "PHARISEE", "hint": "A member of an ancient Jewish sect, known for strict observance of the law." },
  { "word": "SADDUCEE", "hint": "A member of an ancient Jewish sect that denied the resurrection." },
  { "word": "GARDEN", "hint": "Jesus prayed in the ___ of Gethsemane." },
  { "word": "SERPENT", "hint": "Tempted Eve in the Garden of Eden." },
  { "word": "PRIEST", "hint": "A religious leader in ancient Israel." },
  { "word": "SAVIOR", "hint": "A title for Jesus Christ." },
  { "word": "CREATOR", "hint": "A title for God." },
  { "word": "REDEEMER", "hint": "One who pays a price to free another." },
  { word: "ABIDE", hint: "To remain or continue in a place or state." },
  { word: "BELIEVE", hint: "To accept as true." },
  { word: "BETHANY", hint: "The village where Lazarus lived." },
  { word: "BETRAY", hint: "Judas did this to Jesus." },
  { word: "BLESSING", hint: "God's favor and protection." },
  { word: "BUILDER", hint: "One who constructs something." },
  { word: "CALLING", hint: "A strong urge toward a particular way of life." },
  { word: "CARMEL", hint: "The mountain where Elijah challenged the prophets of Baal." },
  { word: "CHERUB", hint: "A type of angelic being." },
  { word: "COMFORT", hint: "To ease the grief or distress of." },
  { word: "CONVERT", hint: "To change one's religious faith." },
  { word: "DELILAH", hint: "The woman who betrayed Samson." },
  { word: "DELIVER", hint: "To save or rescue." },
  { word: "DENARIUS", hint: "A Roman silver coin." },
  { word: "DESTROY", hint: "To put an end to the existence of something." },
  { word: "DIVINE", hint: "Of, from, or like God." },
  { word: "ETERNAL", hint: "Lasting or existing forever." },
  { word: "EUNUCH", hint: "A man who was castrated." },
  { word: "EXALTED", hint: "Placed at a high or powerful level." },
  { word: "FORGIVE", hint: "To stop feeling angry or resentful." },
  { word: "GABRIEL", hint: "An archangel who announced the births of John and Jesus." },
  { word: "GENTLE", hint: "A fruit of the Spirit." },
  { word: "GLADNESS", hint: "A state of cheerfulness or joy." },
  { word: "HEAVENLY", hint: "Relating to heaven." },
  { word: "HONOR", hint: "High respect; great esteem." },
  { word: "HUMBLE", hint: "Having a modest or low view of one's importance." },
  { word: "JEALOUS", hint: "God is described as a ___ God." },
  { word: "KINGDOM", hint: "The spiritual reign or rule of God." },
  { word: "KNOWLEDGE", hint: "Facts, information, and skills." },
  { word: "LEPER", hint: "A person suffering from leprosy." },
  { word: "LIBERTY", hint: "The state of being free." },
  { word: "MAJESTY", hint: "Impressive beauty, scale, or stateliness." },
  { word: "MARTYR", hint: "A person who is killed because of their religious beliefs." },
  { word: "MASTER", hint: "A title for Jesus." },
  { word: "MICHAEL", hint: "An archangel." },
  { word: "MIGHTY", hint: "Possessing great power or strength." },
  { word: "MINISTER", hint: "To attend to the needs of someone." },
  { word: "OFFERING", hint: "A gift or contribution." },
  { word: "PATIENCE", hint: "The capacity to accept delay or suffering." },
  { word: "PROMISE", hint: "A declaration that one will do a particular thing." },
  { word: "REJOICE", hint: "To feel or show great joy." },
  { word: "REPENT", hint: "To feel or express sincere regret for one's wrongdoing." },
  { word: "REWARD", hint: "A thing given in recognition of service or effort." },
  { word: "SACRIFICE", hint: "An act of slaughtering an animal or person or surrendering a possession as an offering to God." },
  { word: "SCRIPTURE", hint: "The sacred writings of Christianity contained in the Bible." },

  // Stage 3: Advanced (8-10 letters) - 100 words
  { word: "JEREMIAH", hint: "Known as the 'weeping prophet'." },
  { word: "EZEKIEL", hint: "A prophet who had a vision of a valley of dry bones." },
  { word: "BETHLEHEM", hint: "The town where Jesus was born." },
  { word: "JERUSALEM", hint: "The holy city, central to the Jewish faith." },
  { word: "PHILIPPIANS", hint: "A letter written by Paul to a church in Macedonia, emphasizing joy." },
  { word: "GALATIANS", hint: "A letter by Paul addressing the issue of justification by faith." },
  { word: "EPHESIANS", hint: "A letter by Paul that talks about the Armor of God." },
  { word: "PROVERBS", hint: "A book of wisdom, largely written by Solomon." },
  { "word": "GENESIS", "hint": "The first book of the Bible, detailing creation." },
  { word: "REVELATION", hint: "The last book of the Bible, containing prophecies about the end times." },
  { "word": "EXODUS", "hint": "The book detailing the Israelites' departure from Egypt." },
  { "word": "LEVITICUS", "hint": "The book of laws for the priests." },
  { "word": "NUMBERS", "hint": "The book containing the census of the Israelites." },
  { "word": "DEUTERONOMY", "hint": "The fifth book of the Pentateuch, meaning 'second law'." },
  { "word": "CHRONICLES", "hint": "Two books that provide a history of Israel." },
  { "word": "NEHEMIAH", "hint": "Rebuilt the walls of Jerusalem." },
  { "word": "ECCLESIASTES", "hint": "A book of wisdom questioning the meaning of life." },
  { "word": "LAMENTATIONS", "hint": "A book of sorrowful poems mourning the destruction of Jerusalem." },
  { "word": "MALACHI", "hint": "The last prophet of the Old Testament." },
  { "word": "BETHESDA", "hint": "A pool in Jerusalem where Jesus healed a paralytic." },
  { "word": "CAPERNAUM", "hint": "A town where Jesus performed many miracles." },
  { "word": "CORINTH", "hint": "A Greek city with a church to which Paul wrote." },
  { "word": "DAMASCUS", "hint": "The city where Saul was converted." },
  { "word": "GETHSEMANE", "hint": "The garden where Jesus prayed before his crucifixion." },
  { "word": "JERICHO", "hint": "A city whose walls fell down." },
  { "word": "NICODEMUS", "hint": "A Pharisee who came to Jesus by night." },
  { "word": "ZACCHAEUS", "hint": "A short tax collector who climbed a tree to see Jesus." },
  { "word": "BARTIMAEUS", "hint": "A blind beggar healed by Jesus." },
  { "word": "LAZARUS", "hint": "A man whom Jesus raised from the dead." },
  { "word": "BATHSHEBA", "hint": "The wife of Uriah, later married to David." },
  { "word": "JONATHAN", "hint": "David's best friend." },
  { "word": "ABIGAIL", "hint": "A wise woman who became David's wife." },
  { "word": "JEZEBEL", "hint": "A wicked queen of Israel." },
  { "word": "METHUSELAH", "hint": "The oldest person mentioned in the Bible." },
  { "word": "ZACHARIAH", "hint": "The father of John the Baptist." },
  { "word": "ELIZABETH", "hint": "The mother of John the Baptist." },
  { "word": "BELSHAZZAR", "hint": "A king who saw the writing on the wall." },
  { "word": "COMMANDMENT", "hint": "A divine rule, especially one of the Ten." },
  { "word": "COVENANT", "hint": "An agreement between God and his people." },
  { "word": "FORGIVENESS", "hint": "The act of pardoning someone for an offense." },
  { "word": "HOLINESS", "hint": "The state of being holy." },
  { "word": "JUSTICE", "hint": "Just behavior or treatment." },
  { "word": "KINDNESS", "hint": "The quality of being friendly, generous, and considerate." },
  { "word": "PATIENCE", "hint": "The capacity to accept or tolerate delay, trouble, or suffering without getting angry or upset." },
  { "word": "RIGHTEOUS", "hint": "Morally right or justifiable." },
  { "word": "SALVATION", "hint": "Deliverance from sin and its consequences." },
  { "word": "TESTIMONY", "hint": "A formal written or spoken statement, especially one given in a court of law." },
  { "word": "WISDOM", "hint": "The quality of having experience, knowledge, and good judgment." },
  { word: "ABUNDANT", hint: "Existing or available in large quantities." },
  { word: "ACCUSATION", hint: "A charge or claim that someone has done something illegal or wrong." },
  { word: "ADVERSARY", hint: "One's opponent in a contest, conflict, or dispute." },
  { word: "ALLEGIANCE", hint: "Loyalty or commitment to a superior or to a group or cause." },
  { word: "AMBASSADOR", hint: "Paul called himself this for Christ." },
  { word: "ANATHEMA", hint: "Something or someone that one vehemently dislikes; a curse." },
  { word: "ANTICHRIST", hint: "A great personal opponent of Christ expected to appear before the end of the world." },
  { word: "ASCENSION", hint: "The ascent of Christ into heaven." },
  { word: "AUTHORITY", hint: "The power or right to give orders, make decisions, and enforce obedience." },
  { word: "BELOVED", hint: "Dearly loved." },
  { word: "BENEDICTION", hint: "The utterance or bestowing of a blessing." },
  { word: "BLAMELESS", hint: "Innocent of wrongdoing." },
  { word: "CENTURION", hint: "The commander of a century in the ancient Roman army." },
  { word: "CHARITY", hint: "Another word for love, as in 1 Corinthians 13." },
  { word: "CIRCUMCISION", hint: "The action or practice of circumcising." },
  { word: "COMMUNION", hint: "The service of Christian worship at which bread and wine are consecrated and shared." },
  { word: "CONFESSION", hint: "A formal statement admitting that one is guilty." },
  { word: "CONSCIENCE", hint: "An inner feeling or voice viewed as acting as a guide to the rightness or wrongness of one's behavior." },
  { word: "CONSECRATE", hint: "To make or declare sacred." },
  { word: "CONTENTMENT", hint: "A state of happiness and satisfaction." },
  { word: "CONVICTION", hint: "A firmly held belief or opinion." },
  { word: "CRUCIFIXION", hint: "The execution of a person by nailing or binding them to a cross." },
  { word: "DEDICATION", hint: "The quality of being dedicated or committed to a task or purpose." },
  { word: "DELIVERANCE", hint: "The action of being rescued or set free." },
  { word: "DEVOTION", hint: "Love, loyalty, or enthusiasm for a person, activity, or cause." },
  { word: "DISCERNMENT", hint: "The ability to judge well." },
  { word: "EDIFICATION", hint: "The instruction or improvement of a person morally or intellectually." },
  { word: "ENCOURAGE", hint: "To give support, confidence, or hope to someone." },
  { word: "ENDURANCE", hint: "The fact or power of enduring an unpleasant or difficult process or situation without giving way." },
  { word: "EPISTLE", hint: "A letter, especially a formal or didactic one." },
  { word: "FAITHFUL", hint: "Loyal, constant, and steadfast." },
  { word: "FELLOWSHIP", hint: "Friendly association, especially with people who share one's interests." },
  { word: "GRATEFUL", hint: "Feeling or showing an appreciation of kindness; thankful." },
  { word: "GUARDIAN", hint: "A defender, protector, or keeper." },
  { word: "HALLELUJAH", hint: "An exclamation of praise to God." },
  { word: "HERITAGE", hint: "Property that is or may be inherited." },
  { word: "IDOLATRY", hint: "The worship of idols." },
  { word: "IMMORTAL", hint: "Living forever; never dying or decaying." },
  { word: "INHERITANCE", hint: "A thing that is inherited." },
  { word: "INTEGRITY", hint: "The quality of being honest and having strong moral principles." },
  { word: "JUDGMENT", hint: "The ability to make considered decisions or come to sensible conclusions." },
  { word: "LEPROSY", hint: "A contagious disease that affects the skin, mucous membranes, and nerves." },
  { word: "LIBERATION", hint: "The action of setting someone free from imprisonment, slavery, or oppression." },
  { word: "MEDIATOR", hint: "A person who attempts to make people involved in a conflict come to an agreement." },
  { word: "MESSENGER", hint: "A person who carries a message." },
  { word: "MINISTRY", hint: "The work or vocation of a minister of religion." },
  { word: "OBEDIENCE", hint: "Compliance with an order, request, or law or submission to another's authority." },
  { word: "OMNIPOTENT", hint: "Having unlimited power." },
  
  // Stage 4: Expert (11+ letters) - 100 words
  { word: "THESSALONIANS", hint: "Paul wrote two letters to this church, discussing the second coming of Christ." },
  { word: "CORINTHIANS", hint: "Paul wrote two letters to this church in a major Greek city, addressing various problems." },
  { word: "NEBUCHADNEZZAR", hint: "A powerful king of Babylon who is a prominent figure in the book of Daniel." },
  { word: "RIGHTEOUSNESS", hint: "The quality of being morally right or justifiable." },
  { word: "SANCTIFICATION", hint: "The process of being made or becoming holy." },
  { word: "REDEMPTION", hint: "The action of saving or being saved from sin, error, or evil." },
  { word: "RESURRECTION", hint: "The act of Christ rising from the dead." },
  { word: "TRANSFIGURATION", hint: "The event where Jesus's appearance was changed into a glorified form on a mountain." },
  { "word": "HEZEKIAH", "hint": "A king of Judah who was given 15 more years of life." },
  { "word": "MELCHIZEDEK", "hint": "A king and priest who blessed Abraham." },
  { "word": "ZERUBBABEL", "hint": "A governor of Judah who helped rebuild the temple." },
  { "word": "JEHOSHAPHAT", "hint": "A king of Judah who sought the Lord." },
  { "word": "BARTHOLOMEW", "hint": "One of the twelve apostles, possibly also known as Nathanael." },
  { "word": "PHILEMON", "hint": "A recipient of a personal letter from Paul." },
  { "word": "ONESIMUS", "hint": "A runaway slave who became a Christian." },
  { "word": "AQUILA", "hint": "A tentmaker and friend of Paul, husband of Priscilla." },
  { "word": "PRISCILLA", "hint": "A tentmaker and friend of Paul, wife of Aquila." },
  { "word": "APOLLOS", "hint": "A learned and eloquent preacher in the early church." },
  { "word": "EUTYCHUS", "hint": "A young man who fell asleep during Paul's sermon and fell out of a window." },
  { "word": "GAMALIEL", "hint": "A respected Pharisee who taught Saul (Paul)." },
  { "word": "CORNELIUS", "hint": "A Roman centurion who was one of the first Gentile converts." },
  { "word": "DEMETRIUS", "hint": "A silversmith who started a riot in Ephesus against Paul." },
  { "word": "ARTAXERXES", "hint": "A Persian king who allowed Nehemiah to rebuild Jerusalem's walls." },
  { "word": "AHASUERUS", "hint": "The Persian king in the book of Esther, also known as Xerxes." },
  { "word": "SENNACHERIB", "hint": "An Assyrian king who besieged Jerusalem but was defeated by God." },
  { "word": "PHILISTINES", "hint": "A people who were frequent enemies of Israel." },
  { "word": "AMALEKITES", "hint": "A nomadic people who attacked the Israelites in the desert." },
  { "word": "MIDIANITES", "hint": "A people whom Gideon defeated." },
  { "word": "ASSYRIANS", "hint": "A major Mesopotamian empire that conquered the northern kingdom of Israel." },
  { "word": "BABYLONIANS", "hint": "A major Mesopotamian empire that conquered the southern kingdom of Judah." },
  { "word": "SANHEDRIN", "hint": "The supreme council and tribunal of the Jews." },
  { "word": "SYNAGOGUE", "hint": "A Jewish house of worship." },
  { "word": "TABERNACLE", "hint": "The portable sanctuary used by the Israelites in the desert." },
  { "word": "PROPITIATION", "hint": "An atoning sacrifice." },
  { "word": "RECONCILIATION", "hint": "The restoration of friendly relations." },
  { "word": "JUSTIFICATION", "hint": "Being made righteous in the sight of God." },
  { "word": "GLORIFICATION", "hint": "The final stage of salvation, where believers are perfected in heaven." },
  { "word": "PERSEVERANCE", "hint": "Steadfastness in doing something despite difficulty or delay in achieving success." },
  { "word": "LONGSUFFERING", "hint": "Patiently enduring lasting offense or hardship." },
  { "word": "FAITHFULNESS", "hint": "The quality of being loyal and steadfast." },
  { "word": "GENTLENESS", "hint": "The quality of being kind, tender, or mild-mannered." },
  { "word": "GOODNESS", "hint": "The quality of being morally good or virtuous." },
  { "word": "SELF-CONTROL", "hint": "The ability to control oneself, in particular one's emotions and desires." },
  { "word": "HUMILITY", "hint": "A modest or low view of one's own importance." },
  { "word": "BENEVOLENCE", "hint": "The quality of being well-meaning; kindness." },
  { "word": "COMPASSION", "hint": "Sympathetic pity and concern for the sufferings or misfortunes of others." },
  { "word": "SOVEREIGNTY", "hint": "The supreme power or authority of God." },
  { word: "ABOMINATION", hint: "A thing that causes disgust or hatred." },
  { word: "ADOPTION", hint: "The action of being brought into God's family." },
  { word: "ADULTERY", hint: "Infidelity to a spouse." },
  { word: "AFFLICTION", hint: "Something that causes pain or suffering." },
  { word: "ALMIGHTY", hint: "Having complete power." },
  { word: "APOCALYPSE", hint: "The complete final destruction of the world." },
  { word: "ARCHANGEL", hint: "An angel of high rank." },
  { word: "ATONEMENT", hint: "The reconciliation of God and humankind through Jesus Christ." },
  { word: "BEATITUDE", hint: "Supreme blessedness." },
  { word: "BLASPHEMY", hint: "The act of speaking sacrilegiously about God." },
  { word: "BONDSERVANT", hint: "A person bound to service without wages." },
  { word: "CAPTIVITY", hint: "The state of being imprisoned or confined." },
  { word: "CESSATION", hint: "The fact or process of ending or being brought to an end." },
  { word: "CHERUBIM", hint: "Plural of Cherub." },
  { word: "COLOSSIANS", hint: "A letter by Paul to a church in Colossae." },
  { word: "CONCUBINE", hint: "A woman who lives with a man but has lower status than his wife or wives." },
  { word: "CONDEMNATION", hint: "The expression of very strong disapproval." },
  { word: "CORRUPTION", hint: "The process of decay." },
  { word: "CREATION", hint: "The action or process of bringing something into existence." },
  { word: "CRUCIFIED", hint: "Put to death by nailing or binding to a cross." },
  { word: "DECEPTION", hint: "The action of deceiving someone." },
  { word: "DECREE", hint: "An official order issued by a legal authority." },
  { word: "DESOLATION", hint: "A state of complete emptiness or destruction." },
  { word: "DISPENSATION", hint: "A system of order, government, or organization of a nation, community, etc., at a particular time." },
  { word: "DIVINATION", hint: "The practice of seeking knowledge of the future or the unknown by supernatural means." },
  { word: "DOMINION", hint: "Sovereignty or control." },
  { word: "ELECTION", hint: "The action of God in choosing people for salvation." },
  { word: "EVERLASTING", hint: "Lasting forever." },
  { word: "EXCOMMUNICATION", hint: "The action of officially excluding someone from participation in the sacraments and services of the Christian Church." },
  { word: "FASTING", hint: "Abstaining from all or some kinds of food or drink." },
  { word: "FOREKNOWLEDGE", hint: "Awareness of something before it happens or exists." },
  { word: "GENTILES", hint: "Plural of Gentile." },
  { word: "GOVERNOR", hint: "An official appointed to govern a town or region." },
  { word: "GRACEFUL", hint: "Having or showing grace or elegance." },
  { word: "HOSPITALITY", hint: "The friendly and generous reception and entertainment of guests, visitors, or strangers." },
  { word: "ILLUMINATION", hint: "The action of supplying or brightening with light." },
  { word: "IMMANUEL", hint: "A Hebrew name which means 'God with us'." },
  { word: "IMPECCABLE", hint: "In accordance with the highest standards of propriety; faultless." },
  { word: "INCARNATION", hint: "A person who embodies in the flesh a deity, spirit, or abstract quality." },
  { word: "INTERCESSION", hint: "The action of intervening on behalf of another." },
  { word: "INVINCIBLE", hint: "Too powerful to be defeated or overcome." },
  { word: "IRREVOCABLE", hint: "Not able to be changed, reversed, or recovered." },
  { word: "LAMENT", hint: "A passionate expression of grief or sorrow." },
  { word: "LEVIATHAN", hint: "A sea monster mentioned in the Book of Job." },
  { word: "MAGNIFICENT", hint: "Impressively beautiful, elaborate, or extravagant." },
  { word: "MANNA", hint: "The substance miraculously supplied as food to the Israelites in the wilderness." },
  { word: "MILLENNIUM", hint: "A period of a thousand years." },
  { word: "PESTILENCE", hint: "A fatal epidemic disease." },
];


const STAGE_CONFIG = [
    { name: "Beginner", wordsPerLevel: 100, expPerWord: 1 },
    { name: "Intermediate", wordsPerLevel: 100, expPerWord: 2 },
    { name: "Advanced", wordsPerLevel: 100, expPerWord: 3 },
    { name: "Expert", wordsPerLevel: 100, expPerWord: 4 },
];

const shuffleString = (s: string) => {
    const a = s.split('');
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.join('');
};

type Progress = {
    [stage: number]: number[]; // Array of completed word indices
};

type View = 'stageSelection' | 'wordSelection' | 'game';

export default function JumbleGamePage() {
    const [isClient, setIsClient] = useState(false);
    const [progress, setProgress] = useState<Progress>({});
    const [view, setView] = useState<View>('stageSelection');
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [jumbledWord, setJumbledWord] = useState('');
    const [userInput, setUserInput] = useState('');
    const [status, setStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');
    const [showHint, setShowHint] = useState(false);

    const { addExp, hints, useHint: spendHint } = useUserProgress();
    const { toast } = useToast();
    const { playCorrectSound, playIncorrectSound } = useSoundEffects();
    const router = useRouter();

    const loadProgress = useCallback(() => {
        const saved = localStorage.getItem('jumbleGameProgress');
        if (saved) {
            setProgress(JSON.parse(saved));
        }
    }, []);

    const saveProgress = useCallback(() => {
        if (!isClient) return;
        localStorage.setItem('jumbleGameProgress', JSON.stringify(progress));
    }, [isClient, progress]);

    useEffect(() => {
        setIsClient(true);
        loadProgress();
    }, [loadProgress]);

    useEffect(() => {
        saveProgress();
    }, [progress, saveProgress]);
    
    const { stageWords, stageStartIndex } = useMemo(() => {
        const stageConfig = STAGE_CONFIG[currentStageIndex];
        const startIndex = STAGE_CONFIG.slice(0, currentStageIndex).reduce((acc, conf) => acc + conf.wordsPerLevel, 0);
        const words = jumbleWords.slice(startIndex, startIndex + stageConfig.wordsPerLevel);
        return { stageWords: words, stageStartIndex: startIndex };
    }, [currentStageIndex]);

    const setupWord = useCallback((wordIndex: number) => {
        const wordData = stageWords[wordIndex];
        if (!wordData) return;

        let shuffled = shuffleString(wordData.word);
        while (shuffled === wordData.word) {
            shuffled = shuffleString(wordData.word);
        }
        setJumbledWord(shuffled);
        setUserInput('');
        setStatus('playing');
        setShowHint(false);
    }, [stageWords]);
    
    const handleSelectStage = (stageIndex: number) => {
        setCurrentStageIndex(stageIndex);
        setView('wordSelection');
    };

    const handleSelectWord = (wordIndex: number) => {
        const globalWordIndex = stageStartIndex + wordIndex;
        const prevGlobalWordIndex = globalWordIndex - 1;
        const isFirstWordInStage = wordIndex === 0;
        
        const isPreviousWordCompleted = isFirstWordInStage || progress[currentStageIndex]?.includes(prevGlobalWordIndex);
        
        const isCurrentWordCompleted = progress[currentStageIndex]?.includes(globalWordIndex);

        if (!isPreviousWordCompleted && !isCurrentWordCompleted) {
             toast({
                variant: 'default',
                title: "Word Locked",
                description: "Please complete the previous word to unlock this one."
            });
            return;
        }

        setCurrentWordIndex(wordIndex);
        setupWord(wordIndex);
        setView('game');
    };

    const checkAnswer = () => {
        const correctWord = stageWords[currentWordIndex].word;
        if (userInput.trim().toUpperCase() === correctWord) {
            setStatus('correct');
            playCorrectSound();
            
            const globalWordIndex = stageStartIndex + currentWordIndex;
            const alreadyCompleted = progress[currentStageIndex]?.includes(globalWordIndex);
            
            if (!alreadyCompleted) {
                const expGained = STAGE_CONFIG[currentStageIndex].expPerWord;
                addExp(expGained);
                setProgress(prev => {
                    const newProgress = {...prev};
                    if (!newProgress[currentStageIndex]) {
                        newProgress[currentStageIndex] = [];
                    }
                    newProgress[currentStageIndex].push(globalWordIndex);
                    return newProgress;
                });
                toast({
                    title: "Correct!",
                    description: `You earned ${expGained} EXP!`,
                });
            } else {
                 toast({ title: "Correct!", description: "You've already solved this word." });
            }
            setTimeout(() => {
                const isStageNowComplete = (progress[currentStageIndex]?.length || 0) + (alreadyCompleted ? 0 : 1) === STAGE_CONFIG[currentStageIndex].wordsPerLevel;
                if(isStageNowComplete) {
                    setView('wordSelection');
                } else if (currentWordIndex < stageWords.length - 1) {
                    handleSelectWord(currentWordIndex + 1);
                } else {
                    setView('wordSelection');
                }
            }, 1500);

        } else {
            setStatus('incorrect');
            playIncorrectSound();
        }
    };
    
    const handleNextWord = () => {
        if (currentWordIndex < stageWords.length - 1) {
            handleSelectWord(currentWordIndex + 1);
        } else {
             toast({ title: "Last Word", description: "This is the last word in this stage." });
             setView('wordSelection');
        }
    };
    
    const handleHint = () => {
        if (hints > 0) {
            setShowHint(true);
            spendHint();
        } else {
            toast({
                variant: 'destructive',
                title: "Out of Hints!",
                description: "You can get more hints in the Forge."
            });
        }
    };

    const handleReshuffle = () => {
        const correctWord = stageWords[currentWordIndex].word;
        let newShuffled = shuffleString(correctWord);
        while (newShuffled === correctWord || newShuffled === jumbledWord) {
            newShuffled = shuffleString(correctWord);
        }
        setJumbledWord(newShuffled);
    };
    
    const currentWordData = stageWords[currentWordIndex];
    const stageConfig = STAGE_CONFIG[currentStageIndex];
    const globalWordIndex = stageStartIndex + currentWordIndex;
    const isWordCompleted = progress[currentStageIndex]?.includes(globalWordIndex);

    if (!isClient) {
        return <div>Loading Jumble...</div>;
    }

    if (view === 'stageSelection') {
        return (
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <Button variant="outline" onClick={() => router.push('/dashboard/games')}>
                        <Home className="mr-2"/> Back to Games
                    </Button>
                    <div className="text-center">
                        <h1 className="font-headline text-3xl font-bold">Jumble Words</h1>
                        <p className="text-muted-foreground">Select a stage to begin unscrambling.</p>
                    </div>
                    <div className="w-24"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STAGE_CONFIG.map((stage, index) => {
                        const completedCount = progress[index]?.length || 0;
                        const totalCount = stage.wordsPerLevel;
                        const isComplete = completedCount === totalCount;
                        return (
                            <Card key={stage.name} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectStage(index)}>
                                <CardHeader className="bg-primary/10 rounded-t-lg">
                                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Puzzle />{stage.name}</CardTitle>
                                    <CardDescription>EXP per word: {stage.expPerWord}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="font-bold">{completedCount} / {totalCount} Words Solved</p>
                                    {isComplete && <Badge className="mt-2 bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="mr-2" />Stage Complete</Badge>}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        )
    }

    if (view === 'wordSelection') {
        const completedCount = progress[currentStageIndex]?.length || 0;
        const totalCount = stageConfig.wordsPerLevel;
        return (
             <div className="container mx-auto max-w-7xl">
                 <div className="text-center mb-6 relative">
                    <Button variant="outline" onClick={() => setView('stageSelection')} className="absolute left-0 top-1/2 -translate-y-1/2">
                        <Home className="mr-2"/> Back to Stages
                    </Button>
                    <h1 className="font-headline text-3xl font-bold">{stageConfig.name} Stage</h1>
                    <p className="text-muted-foreground">Progress: {completedCount} / {totalCount}</p>
                </div>
                 <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
                     {stageWords.map((_, index) => {
                        const gIndex = stageStartIndex + index;
                        const isCompleted = progress[currentStageIndex]?.includes(gIndex);
                        const isFirstWord = index === 0;
                        const prevCompleted = isFirstWord || progress[currentStageIndex]?.includes(gIndex - 1);
                        const isLocked = !prevCompleted && !isCompleted;

                         return (
                            <Card 
                                key={index} 
                                onClick={() => handleSelectWord(index)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 text-center aspect-square transition-all",
                                    isLocked 
                                        ? "bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                        : "cursor-pointer hover:bg-secondary hover:-translate-y-1",
                                    isCompleted && "border-primary bg-primary/5 text-primary"
                                )}
                            >
                                <CardTitle className="font-headline text-xl">Word {index + 1}</CardTitle>
                                {isCompleted && <CheckCircle2 className="w-8 h-8 mt-2"/>}
                                {isLocked && <Lock className="w-8 h-8 mt-2 text-muted-foreground" />}
                                {!isLocked && !isCompleted && <PlayCircle className="w-8 h-8 mt-2 text-muted-foreground" />}
                             </Card>
                         )
                     })}
                 </div>
            </div>
        )
    }

    if (view === 'game' && currentWordData) {
        return (
            <div className="container mx-auto max-w-2xl">
                <Button variant="outline" onClick={() => setView('wordSelection')} className="mb-4">
                    <ChevronLeft className="mr-2"/> Back to Word Selection
                </Button>
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                        <div className="text-center">
                            <CardTitle className="font-headline text-2xl">{stageConfig.name}</CardTitle>
                            <CardDescription>Word {currentWordIndex + 1} of {stageConfig.wordsPerLevel}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-6 pt-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentWordIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex flex-col items-center space-y-4"
                            >
                                <div className="p-4 bg-muted rounded-lg text-center w-full">
                                    <p className={cn(
                                        "font-bold tracking-widest font-headline break-all",
                                        jumbledWord.length > 12 ? "text-2xl" :
                                        jumbledWord.length > 8 ? "text-3xl" : "text-4xl"
                                    )}>{jumbledWord}</p>
                                </div>
                                
                                {isWordCompleted && status !== 'correct' && (
                                    <Badge variant="secondary" className="border-green-600/50 bg-green-50 text-green-700">
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Already Completed
                                    </Badge>
                                )}
                                
                                <div className="w-full max-w-sm space-y-2">
                                    <Input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => {
                                            setUserInput(e.target.value);
                                            if (status === 'incorrect') setStatus('playing');
                                        }}
                                        onKeyDown={e => e.key === 'Enter' && status === 'playing' && checkAnswer()}
                                        placeholder="Your guess..."
                                        className={cn(
                                            "text-center text-lg h-12",
                                            status === 'correct' && "border-green-500 ring-green-500",
                                            status === 'incorrect' && "border-destructive ring-destructive animate-shake"
                                        )}
                                        disabled={status === 'correct'}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {showHint && status !== 'correct' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-center text-sm">
                                <p><strong>Hint:</strong> {currentWordData.hint}</p>
                            </motion.div>
                        )}

                        <div className="flex flex-wrap gap-2 justify-center">
                            {status === 'playing' && (
                                <>
                                    <Button onClick={checkAnswer}>Check Answer</Button>
                                    <Button variant="outline" onClick={handleHint}><Lightbulb className="mr-2" />Hint ({hints})</Button>
                                    <Button variant="outline" onClick={handleReshuffle}><Shuffle className="mr-2" />Reshuffle</Button>
                                </>
                            )}
                            {status === 'incorrect' && (
                                <>
                                    <Button onClick={checkAnswer} variant="destructive">Try Again</Button>
                                    <Button variant="outline" onClick={() => setUserInput('')}><RefreshCw className="mr-2" />Clear</Button>
                                </>
                            )}
                            {status === 'correct' && (
                                <div className="text-center space-y-2">
                                    <p className="font-bold text-green-600 flex items-center gap-2"><CheckCircle/> The word is {currentWordData.word}!</p>
                                </div>
                            )}
                        </div>
                         <div className="flex justify-between items-center w-full pt-4 border-t mt-4">
                            <Button variant="secondary" onClick={() => {if(currentWordIndex > 0) handleSelectWord(currentWordIndex - 1)}} disabled={currentWordIndex === 0}>
                                <ChevronLeft /> Prev Word
                            </Button>
                            <Button variant="secondary" onClick={handleNextWord} disabled={currentWordIndex === stageWords.length - 1}>
                            Next Word <ChevronRight />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return <div>Something went wrong.</div>;
}

