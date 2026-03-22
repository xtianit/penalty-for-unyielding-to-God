import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    Award,
    CheckCircle,
    Edit2,
    Save,
    X,
    Clock,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
    MSG: string;
};

type ScriptureDB = Record<string, BibleVersions>;


const initialScriptureDB: ScriptureDB = {
  "Matthew 22:37": {
    "KJV": "37 Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind.",
    "NKJV": "37 Jesus said to him, ‘You shall love the Lord your God with all your heart, with all your soul, and with all your mind.’",
    "NIV": "37 Jesus replied: “‘Love the Lord your God with all your heart and with all your soul and with all your mind.’",
    "ESV": "37 And he said to him, “You shall love the Lord your God with all your heart and with all your soul and with all your mind.",
    "AMP": "37 And Jesus replied to him, “‘You shall love the Lord your God with all your heart, and with all your soul, and with all your mind.’",
    "NLT": "37 Jesus replied, “‘You must love the Lord your God with all your heart, all your soul, and all your mind.’",
    "MSG": "37 Jesus said, “‘Love the Lord your God with all your passion and prayer and intelligence.’"
  },

  "Matthew 11:20-24": {
    "KJV": "20 Then began he to upbraid the cities wherein most of his mighty works were done, because they repented not: 21 Woe unto thee, Chorazin! woe unto thee, Bethsaida! for if the mighty works, which were done in you, had been done in Tyre and Sidon, they would have repented long ago in sackcloth and ashes. 22 But I say unto you, It shall be more tolerable for Tyre and Sidon at the day of judgment, than for you. 23 And thou, Capernaum, which art exalted unto heaven, shalt be brought down to hell: for if the mighty works, which have been done in thee, had been done in Sodom, it would have remained until this day. 24 But I say unto you, That it shall be more tolerable for the land of Sodom in the day of judgment, than for thee.",
    "NKJV": "20 Then He began to rebuke the cities in which most of His mighty works had been done, because they did not repent: 21 “Woe to you, Chorazin! Woe to you, Bethsaida! For if the mighty works which were done in you had been done in Tyre and Sidon, they would have repented long ago in sackcloth and ashes. 22 But I say to you, it will be more tolerable for Tyre and Sidon in the day of judgment than for you. 23 And you, Capernaum, who are exalted to heaven, will be brought down to Hades; for if the mighty works which were done in you had been done in Sodom, it would have remained until this day. 24 But I say to you that it shall be more tolerable for the land of Sodom in the day of judgment than for you.”",
    "NIV": "20 Then Jesus began to denounce the towns in which most of his miracles had been performed, because they did not repent. 21 “Woe to you, Chorazin! Woe to you, Bethsaida! For if the miracles that were performed in you had been performed in Tyre and Sidon, they would have repented long ago in sackcloth and ashes. 22 But I tell you, it will be more bearable for Tyre and Sidon on the day of judgment than for you. 23 And you, Capernaum, will you be lifted to the heavens? No, you will go down to the depths. If the miracles that were performed in you had been performed in Sodom, it would have remained to this day. 24 But I tell you that it will be more bearable for Sodom on the day of judgment than for you.”",
    "ESV": "20 Then he began to denounce the cities where most of his mighty works had been done, because they did not repent. 21 “Woe to you, Chorazin! Woe to you, Bethsaida! For if the mighty works done in you had been done in Tyre and Sidon, they would have repented long ago in sackcloth and ashes. 22 But I tell you, it will be more bearable on the day of judgment for Tyre and Sidon than for you. 23 And you, Capernaum, will you be exalted to heaven? You will be brought down to Hades. For if the mighty works done in you had been done in Sodom, it would have remained until this day. 24 But I tell you that it will be more tolerable on the day of judgment for the land of Sodom than for you.”",
    "AMP": "20 Then He began to denounce the cities in which most of His miracles had been done, because they did not repent. 21 “Woe to you, Chorazin! Woe to you, Bethsaida! For if the miracles done in you had been done in Tyre and Sidon, they would have repented long ago in sackcloth and ashes. 22 Nevertheless I say to you, it will be more tolerable for Tyre and Sidon on the day of judgment than for you. 23 And you, Capernaum, will you be exalted to heaven? You will descend to Hades; for if the miracles done in you had been done in Sodom, it would have remained until this day. 24 But I say to you that it will be more tolerable for the land of Sodom on the day of judgment, than for you.”",
    "NLT": "20 Then Jesus began to denounce the towns where he had done so many of his miracles, because they hadn’t repented of their sins and turned to God. 21 “What sorrow awaits you, Chorazin and Bethsaida! For if the miracles I did in you had been done in wicked Tyre and Sidon, their people would have repented of their sins long ago, clothing themselves in burlap and throwing ashes on their heads to show their remorse. 22 I tell you, Tyre and Sidon will be better off on judgment day than you. 23 “And you people of Capernaum, will you be honored in heaven? No, you will go down to the place of the dead. For if the miracles I did in you had been done in wicked Sodom, it would still be here today. 24 I tell you, even Sodom will be better off on judgment day than you.”",
    "MSG": "20-22 Next Jesus began to denouncing the towns where most of his miracles had been done, because they hadn’t turned to God. “Doom to you, Chorazin! Doom to you, Bethsaida! If Tyre and Sidon had seen half of the miracles you’re seeing, they’d have been on their knees in a minute. At Judgment Day they’ll get off easy compared to you. 23-24 And Capernaum! With your head in the clouds, do you think you’ll sit on the highest council of heaven? You’re going to end up in the abyss. If Sodom had just seen what you’ve seen, she’d still be on the map. At Judgment Day they’ll get off easy compared to you.”"
  },

  "Mark 6:45": {
    "KJV": "45 And straightway he constrained his disciples to get into the ship, and to go to the other side before unto Bethsaida, while he sent away the people.",
    "NKJV": "45 Immediately He made His disciples get into the boat and go before Him to the other side, to Bethsaida, while He sent the multitude away.",
    "NIV": "45 Immediately Jesus made his disciples get into the boat and go on ahead of him to Bethsaida, while he dismissed the crowd.",
    "ESV": "45 Immediately he made his disciples get into the boat and go before him to the other side, to Bethsaida, while he dismissed the crowd.",
    "AMP": "45 Immediately Jesus insisted that His disciples get into the boat and go ahead of Him to the other side to Bethsaida, while He was dismissing the crowd.",
    "NLT": "45 Immediately after this, Jesus insisted that his disciples get back into the boat and head across the lake to Bethsaida, while he sent the people home.",
    "MSG": "45 Right of the bat, Jesus made his disciples get into the boat and head for Bethsaida on the other side, while he dismissed the crowd."
  },

  "Mark 8:22": {
    "KJV": "22 And he cometh to Bethsaida; and they bring a blind man unto him, and besought him to touch him.",
    "NKJV": "22 Then He came to Bethsaida; and they brought a blind man to Him, and begged Him to touch him.",
    "NIV": "22 They came to Bethsaida, and some people brought a blind man and begged Jesus to touch him.",
    "ESV": "22 And they came to Bethsaida. And some people brought to him a blind man and begged him to touch him.",
    "AMP": "22 And they came to Bethsaida. And some people brought a blind man to Jesus and begged Him to touch him.",
    "NLT": "22 When they arrived at Bethsaida, some people brought a blind man to Jesus, and they begged him to touch the man and heal him.",
    "MSG": "22 They arrived at Bethsaida. Some people brought a blind man and begged him to touch him."
  },

  "Matthew 4:13-16": {
    "KJV": "13 And leaving Nazareth, he came and dwelt in Capernaum, which is upon the sea coast, in the borders of Zabulon and Nephthalim: 14 That it might be fulfilled which was spoken by Esaias the prophet, saying, 15 The land of Zabulon, and the land of Nephthalim, by the way of the sea, beyond Jordan, Galilee of the Gentiles; 16 The people which sat in darkness saw great light; and to them which sat in the region and shadow of death light is sprung up.",
    "NKJV": "13 And leaving Nazareth, He came and dwelt in Capernaum, which is by the sea, in the regions of Zebulun and Naphtali, 14 that it might be fulfilled which was spoken by Isaiah the prophet, saying: 15 “The land of Zebulun and the land of Naphtali, By the way of the sea, beyond the Jordan, Galilee of the Gentiles: 16 The people who sat in darkness have seen a great light, And upon those who sat in the region and shadow of death Light has dawned.”",
    "NIV": "13 Leaving Nazareth, he went and lived in Capernaum, which was by the lake in the area of Zebulun and Naphtali— 14 to fulfill what was said through the prophet Isaiah: 15 “Land of Zebulun and land of Naphtali, the Way of the Sea, beyond the Jordan, Galilee of the Gentiles— 16 the people living in darkness have seen a great light; on those living in the land of the shadow of death a light has dawned.”",
    "ESV": "13 And leaving Nazareth he went and lived in Capernaum by the sea, in the territory of Zebulun and Naphtali, 14 so that what was spoken by the prophet Isaiah might be fulfilled: 15 “The land of Zebulun and the land of Naphtali, the way of the sea, beyond the Jordan, Galilee of the Gentiles— 16 the people dwelling in darkness have seen a great light, and for those dwelling in the region and shadow of death, on them a light has dawned.”",
    "AMP": "13 And leaving Nazareth, He went and settled in Capernaum, which is by the sea, in the country of Zebulun and Naphtali. 14 This was to fulfill what was spoken by the prophet Isaiah: 15 “The land of Zebulun and the land of Naphtali, by the way of the sea, beyond the Jordan, Galilee of the Gentiles (non-Jews)— 16 The people who were sitting (living) in spiritual darkness have seen a great Light, and for those who were sitting (living) in the region and shadow of [spiritual] death, upon them a Light has dawned.”",
    "NLT": "13 He went first to Nazareth, then left there and moved to Capernaum, beside the Sea of Galilee, in the region of Zebulun and Naphtali. 14 This fulfilled what God said through the prophet Isaiah: 15 “In the land of Zebulun and of Naphtali, beside the sea, beyond the Jordan River, in Galilee where so many Gentiles live, 16 the people who sat in darkness have seen a great light. And for those who lived in the land where death casts its shadow, a light has shined.”",
    "MSG": "13-16 He left Nazareth and moved to Capernaum, alongside the Sea of Galilee, at the crossroads of Zebulun and Naphtali. This moved realized Isaiah’s prophecy: Land of Zebulun, land of Naphtali, road to the sea, over Jordan, Galilee, crossroads for the nations. People sitting out in the dark saw a huge light; sitting in that black-hole territory of death, they got fresh light, dawned for them."
  },

  "Mark 2:1": {
    "KJV": "1 And again he entered into Capernaum after some days; and it was noised that he was in the house.",
    "NKJV": "1 And again He entered Capernaum after some days, and it was heard that He was in the house.",
    "NIV": "1 A few days later, when Jesus again entered Capernaum, the people heard that he had come home.",
    "ESV": "1 And when he returned to Capernaum after some days, it was reported that he was at home.",
    "AMP": "1 When Jesus returned to Capernaum a few days later, the news went around that He was at home.",
    "NLT": "1 When Jesus returned to Capernaum several days later, the news spread quickly that he was back home.",
    "MSG": "1 After a few days, Jesus went back to Capernaum, and word got around that he was back home."
  },

  "1 Chronicles 1:13": {
    "KJV": "13 And Mizraim begat Ludim, and Anamim, and Lehabim, and Naphtuhim,",
    "NKJV": "13 Mizraim begat Ludim, Anamim, Lehabim, Naphtuhim,",
    "NIV": "13 Mizraim was the father of the Ludites, Anamites, Lehabites, Naphtuhites,",
    "ESV": "13 Mizraim fathered Ludim, Anamim, Lehabim, Naphtuhim,",
    "AMP": "13 Mizraim was the father of Ludim, Anamim, Lehabim, Naphtuhim,",
    "NLT": "13 Mizraim was the ancestor of the Ludites, Anamites, Lehabites, Naphtuhites,",
    "MSG": "13 Mizraim was the ancestor of the Ludim, the Anamim, the Lehabim, the Naphtuhim,"
  },

  "Genesis 19:24-25": {
    "KJV": "24 Then the Lord rained upon Sodom and upon Gomorrah brimstone and fire from the Lord out of heaven; 25 And he overthrew those cities, and all the plain, and all the inhabitants of the cities, and that which grew upon the ground.",
    "NKJV": "24 Then the Lord rained brimstone and fire on Sodom and Gomorrah, from the Lord out of heaven. 25 So He overthrew those cities, all the plain, all the inhabitants of the cities, and what grew on the ground.",
    "NIV": "24 Then the Lord rained down burning sulfur on Sodom and Gomorrah—from the Lord out of the heavens. 25 Thus he overthrew those cities and the entire plain, destroying all those living in the cities—and also the vegetation in the land.",
    "ESV": "24 Then the Lord rained on Sodom and Gomorrah sulfur and fire from the Lord out of heaven. 25 And he overthrew those cities, and all the valley, and all the inhabitants of the cities, and what grew on the ground.",
    "AMP": "24 Then the Lord rained brimstone and fire on Sodom and on Gomorrah from the Lord out of heaven, 25 and He overthrew (demolished) those cities, and the entire valley, and all the inhabitants of the cities, and whatever grew on the ground.",
    "NLT": "24 Then the Lord rained down fire and burning sulfur from the sky on Sodom and Gomorrah. 25 He utterly destroyed them and the other cities of the plain, wiping out all the people and every bit of vegetation.",
    "MSG": "24-25 Then God rained brimstone and fire down on Sodom and Gomorrah—a river of lava from God out of the sky!—and overthrew those cities and the entire plain and everyone who lived in the cities, everything that grew from the ground."
  },

  "Matthew 11:22-24": {
    "KJV": "22 But I say unto you, It shall be more tolerable for Tyre and Sidon at the day of judgment, than for you. 23 And thou, Capernaum, which art exalted unto heaven, shalt be brought down to hell: for if the mighty works, which have been done in thee, had been done in Sodom, it would have remained until this day. 24 But I say unto you, That it shall be more tolerable for the land of Sodom in the day of judgment, than for thee.",
    "NKJV": "22 But I say to you, it will be more tolerable for Tyre and Sidon in the day of judgment than for you. 23 And you, Capernaum, who are exalted to heaven, will be brought down to Hades; for if the mighty works which were done in you had been done in Sodom, it would have remained until this day. 24 But I say to you that it shall be more tolerable for the land of Sodom in the day of judgment than for you.”",
    "NIV": "22 But I tell you, it will be more bearable for Tyre and Sidon on the day of judgment than for you. 23 And you, Capernaum, will you be lifted to the heavens? No, you will go down to the depths. If the miracles that were performed in you had been performed in Sodom, it would have remained to this day. 24 But I tell you that it will be more bearable for Sodom on the day of judgment than for you.”",
    "ESV": "22 But I tell you, it will be more bearable on the day of judgment for Tyre and Sidon than for you. 23 And you, Capernaum, will you be exalted to heaven? You will be brought down to Hades. For if the mighty works done in you had been done in Sodom, it would have remained until this day. 24 But I tell you that it will be more tolerable on the day of judgment for the land of Sodom than for you.”",
    "AMP": "22 Nevertheless I say to you, it will be more tolerable for Tyre and Sidon on the day of judgment than for you. 23 And you, Capernaum, will you be exalted to heaven? You will descend to Hades; for if the miracles done in you had been done in Sodom, it would have remained until this day. 24 But I say to you that it will be more tolerable for the land of Sodom on the day of judgment, than for you.”",
    "NLT": "22 I tell you, Tyre and Sidon will be better off on judgment day than you. 23 “And you people of Capernaum, will you be honored in heaven? No, you will go down to the place of the dead. For if the miracles I did in you had been done in wicked Sodom, it would still be here today. 24 I tell you, even Sodom will be better off on judgment day than you.”",
    "MSG": "22 At Judgment Day they’ll get off easy compared to you. 23-24 And Capernaum! With your head in the clouds, do you think you’ll sit on the highest council of heaven? You’re going to end up in the abyss. If Sodom had just seen what you’ve seen, she’d still be on the map. At Judgment Day they’ll get off easy compared to you.”"
  },
  "Matthew 11:20": {
    "KJV": "20 Then began he to upbraid the cities wherein most of his mighty works were done, because they repented not:",
    "NKJV": "20 Then He began to rebuke the cities in which most of His mighty works had been done, because they did not repent:",
    "NIV": "20 Then Jesus began to denounce the towns in which most of his miracles had been performed, because they did not repent.",
    "ESV": "20 Then he began to denounce the cities where most of his mighty works had been done, because they did not repent.",
    "AMP": "20 Then He began to denounce the cities in which most of His miracles had been done, because they did not repent.",
    "NLT": "20 Then Jesus began to denounce the towns where he had done so many of his miracles, because they hadn’t repented of their sins and turned to God.",
    "MSG": "20 Next Jesus began to denouncing the towns where most of his miracles had been done, because they hadn’t turned to God."
  },

  "Luke 13:4-5": {
    "KJV": "4 Or those eighteen, upon whom the tower in Siloam fell, and slew them, think ye that they were sinners above all men that dwelt in Jerusalem? 5 I tell you, Nay: but, except ye repent, ye shall all likewise perish.",
    "NKJV": "4 Or those eighteen on whom the tower in Siloam fell and killed them, do you think that they were worse sinners than all other men who dwelt in Jerusalem? 5 I tell you, no; but unless you repent you will all likewise perish.”",
    "NIV": "4 Or those eighteen who died when the tower in Siloam fell on them—do you think they were guiltier than all the others living in Jerusalem? 5 I tell you, no! But unless you repent, you too will all perish.”",
    "ESV": "4 Or those eighteen on whom the tower in Siloam fell and killed them: do you think that they were worse offenders than all the others who lived in Jerusalem? 5 No, I tell you; but unless you repent, you will all likewise perish.”",
    "AMP": "4 Or those eighteen on whom the tower in Siloam fell and killed them: do you think that they were worse sinners than all the others who lived in Jerusalem? 5 I tell you, no; but unless you repent [change your old way of thinking, turn from your sinful ways and live changed lives], you will all likewise perish.”",
    "NLT": "4 And what about the eighteen people who died when the tower in Siloam fell on them? Were they the worst sinners in Jerusalem? 5 No, and I tell you again that unless you repent, you will perish, too.”",
    "MSG": "4-5 And what about the eighteen people who died when the Tower of Siloam fell on them? Do you think they were more bad than any other people living in Jerusalem? No. And I’m telling you that if you don’t change your ways, you’ll end up the same way.”"
  },

  "Revelation 3:22": {
    "KJV": "22 He that hath an ear, let him hear what the Spirit saith unto the churches.",
    "NKJV": "22 “He who has an ear, let him hear what the Spirit says to the churches.” ’ ”",
    "NIV": "22 Whoever has ears, let them hear what the Spirit says to the churches.”",
    "ESV": "22 He who has an ear, let him hear what the Spirit says to the churches.’”",
    "AMP": "22 He who has an ear, let him hear and heed what the Spirit says to the churches.’”",
    "NLT": "22 “Anyone with ears to hear must listen to the Spirit and understand what he is saying to the churches.”",
    "MSG": "22 “Are your ears awake? Listen. Listen to the Wind Words, the Spirit blowing through the churches.”"
  }
};


const quizQuestions = [
    {
        q: "What is the main theme or title of this lesson?",
        a: [
            "The Power of Forgiveness",
            "Penalty For Unyielding To God",
            "The Blessings of Obedience",
            "The History of Galilee"
        ],
        correct: 1
    },
    {
        q: "According to the Introduction, what is the ultimate aim of every miracle and blessing from God?",
        a: [
            "To make us famous",
            "To solve all financial problems",
            "To return man to God in a restoration exercise",
            "To prove that Christians are superior"
        ],
        correct: 2
    },
    {
        q: "In this lesson, what do the mentioned cities (Chorazin, Bethsaida, etc.) represent?",
        a: [
            "Historical landmarks only",
            "Individuals and families who received God’s blessing but turned their backs on Him",
            "The only places where Jesus preached",
            "Ancient trade routes"
        ],
        correct: 1
    },
    {
        q: "What does the city 'Bethsaida' mean and what does it represent in the lesson?",
        a: [
            "House of Bread; represents prosperity",
            "Fortified city; represents arrogance",
            "House of Fishing; represents those delivered from struggling who now ignore God",
            "City of Palms; represents peace"
        ],
        correct: 2
    },
    {
        q: "Which city is described as the headquarters of Jesus' earthly ministry?",
        a: [
            "Sodom",
            "Tyre",
            "Capernaum",
            "Sidon"
        ],
        correct: 2
    },
    {
        q: "What character trait of the city of Tyre led God to use conquerors like Alexander the Great to wipe it out?",
        a: [
            "Arrogance",
            "Poverty",
            "Lack of intelligence",
            "Kindness"
        ],
        correct: 0
    },
    {
        q: "The lesson 'THE DENOUNCE' suggests that God does what to the ungrateful?",
        a: [
            "Forces them to obey",
            "Openly withdraws from them",
            "Gives them more miracles",
            "Changes His mind about judgment"
        ],
        correct: 1
    },
    {
        q: "According to 'GOD’S CONCENTRATION,' why have many received greater attention from God?",
        a: [
            "Because they are better than others",
            "Due to the nature of their problems",
            "Because they paid for it",
            "By accident"
        ],
        correct: 1
    },
    {
        q: "What is the memory verse for this lesson?",
        a: [
            "John 3:16",
            "Psalm 23:1",
            "Matthew 22:37",
            "Genesis 1:1"
        ],
        correct: 2
    },
    {
        q: "According to the conclusion and Luke 13:4-5, what does God expect from those who receive His blessings?",
        a: [
            "That they should become wealthy",
            "That they should yield themselves to Him",
            "That they should build large monuments",
            "That they should stop working"
        ],
        correct: 1
    }
];



const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "", MSG: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(50);
    const [showResults, setShowResults] = useState(false);
    const [faithRating, setFaithRating] = useState(5);
    const [commitments, setCommitments] = useState<
        Array<{ text: string; date: string }>
    >([]);
    const [commitmentInput, setCommitmentInput] = useState("");
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { 
        title: string; 
        content: string; 
        scriptures?: string[]; 
    };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
        lessonDate: string;
        lessonTitle: string;
        memoryVerse: string;
        memoryVerseRef: string;
        introduction: string;
        introScriptures: string[];
        lessonIntroScriptures: string[];
        aims: string;
        objectives: string;
        lessonIntro: string;
        lessonPoints: LessonPoint[];
        conclusion: string;
        conclusionScriptures: string[];
        prayerPoints: string[];
    };
    
const [contentData, setContentData] = useState<ContentData>({
    lessonDate: "March 22, 2026",
    lessonTitle: "Penalty For Unyielding To God",

    memoryVerse:
        "Jesus said unto him, Thou shall love the lord thy God with all thy heart and with all thy soul, and with all thy mind. - Matthew 22:37",
    memoryVerseRef: "Matthew 22:37",

    introScriptures: ["Matthew 11:20-24"],

    lessonIntroScriptures: ["Matthew 11:20-24"],

    introduction:
        "The fall of man is costing God a lot of resources to restore the earth. Every miracle, favour, blessing and benevolence is aimed at returning man to God in the restoration exercise. Your benefits are God profits. If you hinder his profits by unyielding to him despite his benefits, you will incur his wrath. God is sure prepared to frustrate the efforts of any man who frustrates his.",

    aims:
        "To warn those who mistreat God after receiving his attention.",

    objectives:
        "To save the believer from unfailing impending doom for misconduct.",

    lessonIntro:
        "The text is a pointer to the LORD’S disappointment, displeasure and punitive plan concerning certain persons for their unexpected misbehavior inspite of his love. Let us consider what God is revealing in this lesson.",

    lessonPoints: [
        {
            title: "THE REPRESENTATION:",
            content:
                "The cities mentioned are representing different individual, families and place who have received God’s blessing and have turn their back on him.",
            scriptures: [],
            subPoints: [
                {
                    title: "CHORAZIN",
                    content:
                        "An unknown city in the Bible days that received God’s favours. Many of us were nobodies but God has now made somebody and yet despise him."
                },
                {
                    title: "BETHSAIDA",
                    content:
                        "Means an house of fishing. A city located in a DESERT place by the sea of Galilee characterized by struggling but touched by God. This place speaks of men delivered and established from suffering who now pays no attention to God.",
                    scriptures: ["Mark 6:45", "Mark 8:22"]
                },
                {
                    title: "CAPERNAUM",
                    content:
                        "A city where Jesus established the headquarters of his earthly ministries. Where could be considered more favoured than a place where Jesus establish his HQTRS. This represents people that are highly favoured and blessed for grace’ sake yet treats God with contempt.",
                    scriptures: ["Matthew 4:13-16", "Mark 2:1"]
                },
                {
                    title: "TYRE",
                    content:
                        "A greatly fortified city who sometimes controlled the rich commerce and treasures of the then world. Whose arrogance tried the patience of God and he used Nebuchadnezzar and Alexander the great at different times to wipe out."
                },
                {
                    title: "SIDON",
                    content:
                        "Means fortified. A gentile tribe of Canaan that was destroyed for wickedness.",
                    scriptures: ["1 Chronicles 1:13"]
                },
                {
                    title: "SODOM",
                    content:
                        "The city of great wickedness that was destroy with fire.",
                    scriptures: ["Genesis 19:24-25"]
                }
            ],
        },
        {
            title: "THE DENOUNCE:",
            content:
                "God clearly reveals here that he is openly withdrawing from the ungrateful.",
            scriptures: ["Matthew 11:20"],
            subPoints: [],
        },
        {
            title: "GOD’S CONCENTRATION:",
            content:
                "Most of us have received a greater attention from God due to the nature of our problems yet we don’t treat him accordingly.",
            scriptures: ["Matthew 11:20"],
            subPoints: [],
        },
        {
            title: "THE BENEVOLENCE:",
            content:
                "Whatever God does for you is expected to humble you and draw you closer to him but the case is a reverse for many people.",
            scriptures: [],
            subPoints: [],
        },
        {
            title: "GOD’S MIND REVEALED:",
            content:
                "Judgment awaits those who receive God’s blessings but refuse to yield to him.",
            scriptures: ["Matthew 11:22-24"],
            subPoints: [],
        }
    ],

    conclusion:
        "City d, e, and f represent people judged and destroyed by God who by comparison could be better than you except for grace. God expects that those who receive his blessings should yield themselves to him.",

    conclusionScriptures: ["Revelation 3:22"],

    prayerPoints: [
        "Father, help me not to despise Your blessings in my life.",
        "Lord, remove every form of ingratitude from my heart.",
        "Father, help me to always yield myself to You.",
        "Lord, draw me closer to You so that I will not lose Your favour."
    ],
});




    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                    MSG: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (quizActive && timeLeft > 0 && !showResults) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [quizActive, timeLeft, showResults]);

    const startQuiz = () => {
        setQuizActive(true);
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(50);
        setShowResults(false);
    };

    const checkAnswer = (choice: number) => {
        if (!quizActive || showResults) return;
        const correct = quizQuestions[currentQuestion].correct === choice;
        const timeBonus = Math.floor(timeLeft / 10);
        const points = correct ? 10 + timeBonus : 0;
        if (correct) setScore((prev) => prev + points);
        if (currentQuestion < quizQuestions.length - 1) {
            setTimeout(() => setCurrentQuestion((prev) => prev + 1), 1000);
        } else {
            setTimeout(() => endQuiz(), 1000);
        }
    };

    const endQuiz = () => {
        setQuizActive(false);
        setShowResults(true);
    };

    const addCommitment = () => {
        if (commitmentInput.trim()) {
            setCommitments((prev) => [
                ...prev,
                {
                    text: commitmentInput,
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setCommitmentInput("");
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";


        if (appLoading) {
    const animatedText = "Dancing in Fame and Glory".split("");

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                            style={{ animationDelay: "0.3s" }}
                        ></div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Life Gate Ministries Worldwide
                </h1>
                <p className="text-xl text-white/90 mb-8">
                    Sunday School Lessons
                </p>

                {/* Single-color glowing neon text */}
                <div className="flex justify-center mb-6 text-3xl md:text-4xl font-extrabold">
                    {animatedText.map((char, idx) => (
                        <span
                            key={idx}
                            className="inline-block text-blue-400 drop-shadow-[0_0_10px_#00ffff] animate-[wave_1.5s_ease-in-out_infinite]"
                            style={{
                                animationDelay: `${idx * 0.1}s`,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </div>

                <div className="text-white/80 mb-6 text-lg animate-pulse">
                    Loading Sunday School Lesson...
                </div>
                <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                <p className="text-white/70 mt-3 text-sm">
                    {loadingProgress}%
                </p>
            </div>

            {/* Keyframes for smooth wave bounce */}
            <style>
                {`
                    @keyframes wave {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-12px); }
                        50% { transform: translateY(8px); }
                        75% { transform: translateY(-6px); }
                    }
                `}
            </style>
        </div>
    );
}




    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            Penalty For Unyielding To God
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "application",
                        "quiz",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        {activeTab === "intro" && (
                            <div className="space-y-6">
                                {editingContent === "intro" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-blue-900/30"
                                            : "bg-blue-50"
                                    } p-6 rounded-lg border-l-4 border-blue-600`}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="text-blue-600" />{" "}
                                        Memory Verse
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.memoryVerse}
                                            onChange={(e) =>
                                                updateContent(
                                                    "memoryVerse",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={2}
                                        />
                                    ) : (
                                        <blockquote className="text-xl italic mb-4">
                                            "{contentData.memoryVerse}"
                                        </blockquote>
                                    )}
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                contentData.memoryVerseRef
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read {contentData.memoryVerseRef}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Text: Matthew 11:20-24
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "Matthew 11:20-24"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                        <BookOpen size={16} />
                                            Read  Matthew 11:20-24
                                        </button>

                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Introduction
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.introduction}
                                            onChange={(e) =>
                                                updateContent(
                                                    "introduction",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mt-4">
                                                {/* <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Jeremiah 17:5"
                                                    )
                                                }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                            > */}
                                            {/* <BookOpen size={16} />
                                                Jeremiah 17:5
                                            </button>

                                            <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Psalm 121:2"
                                                    )
                                                }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                            >
                                                <BookOpen size={16} />
                                                    Psalm 121:2
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            "1 Samuel 2:9"
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm">
                                                    <BookOpen size={16} />
                                                        1 Samuel 2:9
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            "Romans 3:12"
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm">
                                                    <BookOpen size={16} />
                                                        Romans 3:12
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            "Matthew 28:18"
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm">
                                                    <BookOpen size={16} />
                                                        Matthew 28:18
                                                </button> */}
                                                    

                                            </div>
                                            
                                        </p>
                                        
                                    )}
                                   
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-green-900/30"
                                            : "bg-green-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h3 className="text-xl font-bold mb-3">
                                        Aims and Objectives
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                AIMS:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={contentData.aims}
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "aims",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{contentData.aims}</p>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                OBJECTIVES:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={
                                                        contentData.objectives
                                                    }
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "objectives",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={2}
                                                />
                                            ) : (
                                                <p>{contentData.objectives}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                    
                                        </div>
                                        
                                    </p>
                                    
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scriptures ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                <div className="flex flex-row flex-wrap items-center gap-2 mt-2">
                                                                                {subPoint.scriptures?.map((ref, i) => (
                                                                                    <button
                                                                                    key={i}
                                                                                    onClick={() => showBibleVersions(ref)}
                                                                                    className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm flex-shrink-0"
                                                                                    >
                                                                                    📖 Read {ref}
                                                                                    </button>
                                                                                ))}
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
            

                      
                        {activeTab === "application" && (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-4">Personal Application</h3>

        {/* Self-Assessment */}
        <div
            className={`${
                darkMode
                    ? "bg-gray-700"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
            } p-6 rounded-lg`}
        >
            <h4 className="text-xl font-semibold mb-4">
                Self-Assessment: Yielding To God
            </h4>

            <p className="mb-4">
                On a scale of 1 to 10, how responsive are you to God's voice and
                instructions after receiving His blessings and attention
                (Matthew 11:20–24; Matthew 22:37)?
            </p>

            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={faithRating}
                    onChange={(e) => setFaithRating(Number(e.target.value))}
                    className="flex-1"
                />
                <span className="text-2xl font-bold text-blue-600">
                    {faithRating}/10
                </span>
            </div>

            <p className="mt-3 text-sm italic">
                {faithRating >= 8
                    ? "Excellent! Continue loving and yielding to God wholeheartedly so that His blessings in your life will not be in vain."
                    : faithRating >= 5
                    ? "You are making progress. Reflect on areas where you may still resist God's will and surrender them to Him."
                    : "This is a wake-up call. Ask God for grace to repent and yield completely to Him before His patience turns to judgment."}
            </p>
        </div>

        {/* Personal Decisions */}
        <div
            className={`${
                darkMode
                    ? "bg-gray-700"
                    : "bg-white border border-gray-200"
            } p-6 rounded-lg`}
        >
            <h4 className="text-xl font-semibold mb-4">
                Personal Decisions: Yielding My Life To God
            </h4>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={commitmentInput}
                    onChange={(e) => setCommitmentInput(e.target.value)}
                    placeholder="Write a personal decision (e.g., obey God's instructions promptly, appreciate His blessings, repent from stubbornness, seek Him daily, avoid ingratitude)..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                        darkMode
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                    }`}
                    onKeyPress={(e) =>
                        e.key === "Enter" && addCommitment()
                    }
                />
                <button
                    onClick={addCommitment}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Save size={16} /> Save
                </button>
            </div>

            <div className="space-y-2">
                {commitments.map((commitment, idx) => (
                    <div
                        key={idx}
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-gray-50"
                        } p-3 rounded-lg flex items-start gap-3`}
                    >
                        <CheckCircle
                            className="text-green-600 mt-1"
                            size={20}
                        />
                        <div className="flex-1">
                            <p>{commitment.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {commitment.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-4 text-sm italic text-gray-500">
                Cities like Chorazin, Bethsaida, and Capernaum experienced
                great miracles yet failed to respond appropriately to God
                (Matthew 11:20–24). God expects His blessings to draw us
                closer to Him in humility and obedience. Do not allow
                ingratitude or stubbornness to make you lose God's favour.
                Make practical decisions today to love God with all your
                heart, soul, and mind (Matthew 22:37).
            </p>
        </div>
    </div>
)}









                        {activeTab === "quiz" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Speed Quiz Challenge
                                    </h3>
                                    {quizActive && (
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-blue-600" />
                                                <span className="text-xl font-bold">
                                                    {timeLeft}s
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="text-yellow-600" />
                                                <span className="text-xl font-bold">
                                                    {score}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!quizActive && !showResults && (
                                    <div className="text-center py-12">
                                        <Award
                                            size={64}
                                            className="mx-auto mb-4 text-yellow-600"
                                        />
                                        <h4 className="text-2xl font-bold mb-4">
                                            Ready to Test Your Knowledge?
                                        </h4>
                                        <p className="mb-6 text-lg">
                                            Answer quickly for bonus points!
                                        </p>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition transform hover:scale-105"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}
                                {quizActive && !showResults && (
                                    <div>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-blue-50"
                                            } p-6 rounded-lg mb-6`}
                                        >
                                            <h4 className="text-xl font-semibold mb-4">
                                                Question {currentQuestion + 1}{" "}
                                                of {quizQuestions.length}
                                            </h4>
                                            <p className="text-lg mb-6">
                                                {
                                                    quizQuestions[
                                                        currentQuestion
                                                    ].q
                                                }
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {quizQuestions[
                                                    currentQuestion
                                                ].a.map((answer, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            checkAnswer(idx)
                                                        }
                                                        className={`${
                                                            darkMode
                                                                ? "bg-gray-800 hover:bg-gray-900"
                                                                : "bg-white hover:bg-gray-50"
                                                        } p-4 rounded-lg border-2 border-blue-600 transition transform hover:scale-105 text-left`}
                                                    >
                                                        <span className="font-bold text-blue-600 mr-2">
                                                            {String.fromCharCode(
                                                                65 + idx
                                                            )}
                                                            .
                                                        </span>
                                                        {answer}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showResults && (
                                    <div className="text-center space-y-6">
                                        <Award
                                            size={80}
                                            className="mx-auto text-yellow-600"
                                        />
                                        <h4 className="text-3xl font-bold">
                                            Quiz Complete!
                                        </h4>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
                                            } p-8 rounded-lg`}
                                        >
                                            <p className="text-5xl font-bold text-blue-600 mb-2">
                                                {score}
                                            </p>
                                            <p className="text-xl">
                                                Final Score
                                            </p>
                                            <p className="mt-4 text-lg">
                                                {score >= 100
                                                    ? "Outstanding! Excellent knowledge!"
                                                    : score >= 60
                                                    ? "Great work! Keep studying!"
                                                    : "Good effort! Review the lesson."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                    "MSG",

                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
