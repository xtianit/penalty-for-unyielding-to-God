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

// const initialScriptureDB: ScriptureDB = {
//   "Matthew 11:28": {
//     KJV: "28 Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
//     NKJV: "28 Come to Me, all you who labor and are heavy laden, and I will give you rest.",
//     NIV: "28 “Come to me, all you who are weary and burdened, and I will give you rest.",
//     ESV: "28 “Come to me, all who labor and are heavy laden, and I will give you rest.",
//     AMP: "28 “Come to Me, all who are weary and heavily burdened [by religious rituals that provide no peace], and I will give you rest [refreshing your souls with salvation].",
//     NLT: "28 Then Jesus said, “Come to me, all of you who are weary and carry heavy burdens, and I will give you rest.",
//     MSG: "28 “Are you tired? Worn out? Burned out on religion? Come to me. Get away with me and you’ll recover your life. I’ll show you how to take a real rest."
//   },
//   "Jeremiah 17:5": {
//     KJV: "5 Thus saith the Lord; Cursed be the man that trusteth in man, and maketh flesh his arm, and whose heart departeth from the Lord.",
//     NKJV: "5 Thus says the Lord: “Cursed is the man who trusts in man And makes flesh his strength, Whose heart departs from the Lord.",
//     NIV: "5 This is what the Lord says: “Cursed is the one who trusts in man, who draws strength from mere flesh and whose heart turns away from the Lord.",
//     ESV: "5 Thus says the Lord: “Cursed is the man who trusts in man and makes flesh his strength, whose heart turns away from the Lord.",
//     AMP: "5 Thus says the Lord, “Cursed is the man who trusts in and relies on mankind, Making [weak, faulty] human flesh his strength, And whose mind and heart turn away from the Lord.",
//     NLT: "5 This is what the Lord says: “Cursed are those who put their trust in mere humans, who rely on human strength and turn their hearts away from the Lord.",
//     MSG: "5 God’s Message: “Cursed is the strong one who relies on mere humans, Who thinks he can make it on muscle alone and sets God aside as dead weight."
//   },
//   "Psalm 121:2": {
//     KJV: "2 My help cometh from the Lord, which made heaven and earth.",
//     NKJV: "2 My help comes from the Lord, Who made heaven and earth.",
//     NIV: "2 My help comes from the Lord, the Maker of heaven and earth.",
//     ESV: "2 My help comes from the Lord, who made heaven and earth.",
//     AMP: "2 My help comes from the Lord, Who made heaven and earth.",
//     NLT: "2 My help comes from the Lord, who made heaven and earth!",
//     MSG: "2 My help comes from God, who made heaven and earth."
//   },
//   "1 Samuel 2:9": {
//     KJV: "9 He will keep the feet of his saints, and the wicked shall be silent in darkness; for by strength shall no man prevail.",
//     NKJV: "9 He will guard the feet of His saints, But the wicked shall be silent in darkness. “For by strength no man shall prevail.",
//     NIV: "9 He will guard the feet of his faithful servants, but the wicked will be silenced in the place of darkness. “It is not by strength that one prevails;",
//     ESV: "9 “He will guard the feet of his faithful ones, but the wicked shall be cut off in darkness, for not by might shall a man prevail.",
//     AMP: "9 “He guards the feet of His godly ones, But the wicked ones are silenced in darkness; For not by might shall a man prevail.",
//     NLT: "9 He will protect his faithful ones, but the wicked will disappear in darkness. No one will succeed by strength alone.",
//     MSG: "9 He protects those who follow him, but leaves the wicked to stumble in the dark. No one makes it on 'muscle' alone."
//   },
//   "Romans 3:12": {
//     KJV: "12 They are all gone out of the way, they are together become unprofitable; there is none that doeth good, no, not one.",
//     NKJV: "12 They have all turned aside; They have together become unprofitable; There is none who does good, no, not one.”",
//     NIV: "12 All have turned away, they have together become worthless; there is no one who does good, not even one.”",
//     ESV: "12 All have turned aside; together they have become worthless; no one does good, not even one.”",
//     AMP: "12 All have turned aside, together they have become useless; There is no one who does good, no, not even one.”",
//     NLT: "12 All have turned away; all have become useless. No one does good, not a single one.”",
//     MSG: "12 All over the lot, squandering lives, wastage, everywhere. Not one person has it together, not even one."
//   },
//   "Matthew 28:18": {
//     KJV: "18 And Jesus came and spake unto them, saying, All power is given unto me in heaven and in earth.",
//     NKJV: "18 And Jesus came and spoke to them, saying, “All authority has been given to Me in heaven and on earth.",
//     NIV: "18 Then Jesus came to them and said, “All authority in heaven and on earth has been given to me.",
//     ESV: "18 And Jesus came and said to them, “All authority in heaven and on earth has been given to me.",
//     AMP: "18 Jesus came up and said to them, “All authority (all power of absolute rule) in heaven and on earth has been given to Me.",
//     NLT: "18 Jesus came and told his disciples, “I have been given all authority in heaven and on earth.",
//     MSG: "18 Jesus, undeterred, went right up and said, “God has given me complete charge of actually ruling everything in heaven and on earth."
//   },
//   "Isaiah 1:18": {
//     KJV: "18 Come now, and let us reason together, saith the Lord: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool.",
//     NKJV: "18 “Come now, and let us reason together,” Says the Lord, “Though your sins are like scarlet, They shall be as white as snow; Though they are red like crimson, They shall be as wool.",
//     NIV: "18 “Come now, let us settle the matter,” says the Lord. “Though your sins are like scarlet, they shall be as white as snow; though they are red like crimson, they shall be as wool.",
//     ESV: "18 “Come now, let us reason together, says the Lord: though your sins are like scarlet, they shall be as white as snow; though they are red like crimson, they shall be as wool.",
//     AMP: "18 “Come now, and let us reason together,” Says the Lord. “Though your sins are like scarlet, They shall be as white as snow; Though they are red like crimson, They shall be as wool.",
//     NLT: "18 “Come now, let us settle the matter,” says the Lord. “Though your sins are like scarlet, I will make them as white as snow. Though they are red like crimson, I will make them as white as wool.",
//     MSG: "18 “Come. Sit down. Let’s argue this out.” This is God’s Message: “If your sins are blood-red, they’ll be snow-white. If they’re red as crimson, they’ll be like wool."
//   },
//   "Isaiah 45:11": {
//     KJV: "11 Thus saith the Lord, the Holy One of Israel, and his Maker, Ask me of things to come concerning my sons, and concerning the work of my hands command ye me.",
//     NKJV: "11 Thus says the Lord, The Holy One of Israel, and his Maker: “Ask Me of things to come concerning My sons; And concerning the work of My hands, you command Me.",
//     NIV: "11 This is what the Lord says—the Holy One of Israel, and its Maker: Concerning things to come, do you question me about my children, or give me orders about the work of my hands?",
//     ESV: "11 Thus says the Lord, the Holy One of Israel, and the one who formed him: “Ask me of things to come; will you command me concerning my children and the work of my hands?",
//     AMP: "11 Thus says the Lord, the Holy One of Israel, and its Maker: “Ask Me about the things to come concerning My sons, And give Me orders concerning the work of My hands.",
//     NLT: "11 This is what the Lord says—the Holy One of Israel and your Creator: “Do you question what I do for my children? Do you give me orders about the work of my hands?",
//     MSG: "11 Thus God, The Holy of Israel, Israel’s Maker, says: “Do you questions me about my children? Do you tell me what to do with the work of my hands?"
//   },
//   "Hosea 14:2": {
//     KJV: "2 Take with you words, and turn to the Lord: say unto him, Take away all iniquity, and receive us graciously: so will we render the calves of our lips.",
//     NKJV: "2 Take words with you, And return to the Lord. Say to Him, “Take away all iniquity; Receive us graciously, For we will offer the sacrifices of our lips.",
//     NIV: "2 Take words with you and return to the Lord. Say to him: “Forgive all our sins and receive us graciously, that we may offer the fruit of our lips.",
//     ESV: "2 Take with you words and return to the Lord; say to him, “Take away all iniquity; accept what is good, and we will pay with bulls the vows of our lips.",
//     AMP: "2 Take the words [confessing your guilt] with you and return to the Lord. Say to Him, “Take away all our wickedness; Accept what is good and receive us graciously, So that we may present the fruit of our lips (gratitude).",
//     NLT: "2 Bring your confessions, and return to the Lord. Say to him, “Forgive all our sins and graciously receive us, so that we may offer you our praises.",
//     MSG: "2 Prepare your confession and come back to God. Pray to him, “Take away our sin, accept our confession. Receive as restitution our repentant prayers.”"
//   },
//   "Genesis 28:12-15": {
//     KJV: "12 And he dreamed, and behold a ladder set up on the earth, and the top of it reached to heaven: and behold the angels of God ascending and descending on it. 13 And, behold, the Lord stood above it, and said, I am the Lord God of Abraham thy father, and the God of Isaac: the land whereon thou liest, to thee will I give it, and to thy seed; 14 And thy seed shall be as the dust of the earth, and thou shalt spread abroad to the west, and to the east, and to the north, and to the south: and in thee and in thy seed shall all the families of the earth be blessed. 15 And, behold, I am with thee, and will keep thee in all places whither thou goest, and will bring thee again into this land; for I will not leave thee, until I have done that which I have spoken to thee of.",
//     NKJV: "12 Then he dreamed, and behold, a ladder was set up on the earth, and its top reached to heaven; and there the angels of God were ascending and descending on it. 13 And behold, the Lord stood above it and said: “I am the Lord God of Abraham your father and the God of Isaac; the land on which you lie I will give to you and your descendants. 14 Also your descendants shall be as the dust of the earth; you shall spread abroad to the west and the east, to the north and the south; and in you and in your seed all the families of the earth shall be blessed. 15 Behold, I am with you and will keep you wherever you go, and will bring you back to this land; for I will not leave you until I have done what I have spoken to you.”",
//     NIV: "12 He had a dream in which he saw a stairway resting on the earth, with its top reaching to heaven, and the angels of God were ascending and descending on it. 13 There above it stood the Lord, and he said: “I am the Lord, the God of your father Abraham and the God of Isaac. I will give you and your descendants the land on which you are lying. 14 Your descendants will be like the dust of the earth, and you will spread out to the west and to the east, to the north and to the south. All peoples on earth will be blessed through you and your offspring. 15 I am with you and will watch over you wherever you go, and I will bring you back to this land. I will not leave you until I have done what I have promised you.”",
//     ESV: "12 And he dreamed, and behold, there was a ladder set up on the earth, and the top of it reached to heaven. And behold, the angels of God were ascending and descending on it! 13 And behold, the Lord stood above it and said, “I am the Lord, the God of Abraham your father and the God of Isaac. The land on which you lie I will give to you and to your offspring. 14 Your offspring shall be like the dust of the earth, and you shall spread abroad to the west and to the east and to the north and to the south, and in you and your offspring shall all the families of the earth be blessed. 15 Behold, I am with you and will keep you wherever you go, and will bring you back to this land. For I will not leave you until I have done what I have promised you.”",
//     AMP: "12 He had a dream, and behold, a ladder (stairway) was placed on the earth with its top reaching out toward heaven; and behold, the angels of God were ascending and descending on it [going to and from heaven]. 13 And behold, the Lord stood above it and said, “I am the Lord, the God of Abraham your father [forefather] and the God of Isaac; I will give to you and to your descendants the land on which you are lying. 14 Your descendants shall be as [countless as] the dust of the earth, and you shall spread abroad to the west and the east and to the north and to the south; and in you and in your descendants shall all the families of the earth be blessed. 15 Behold, I am with you and will keep [watch over you with care, take notice of] you wherever you may go, and I will bring you back to this land; for I will not leave you until I have done all that I have told you.”",
//     NLT: "12 As he slept, he dreamed of a stairway that reached from the earth up to heaven. And he saw the angels of God going up and down the stairway. 13 At the top of the stairway stood the Lord, and he said, “I am the Lord, the God of your grandfather Abraham, and the God of your father, Isaac. The ground you are lying on belongs to you. I am giving it to you and your descendants. 14 Your descendants will be as numerous as the dust of the earth! They will spread out in all directions—to the west and the east, to the north and the south. And all the families of the earth will be blessed through you and your descendants. 15 What’s more, I am with you, and I will protect you wherever you go. One day I will bring you back to this land. I will not leave you until I have finished giving you everything I have promised you.”",
//     MSG: "12 He had a dream: A stairway rested on the ground, with its top reaching to the sky. Angels of God were going up and coming down on it. 13-15 Then God was there, standing over him, saying, “I am God, the God of Abraham your father and the God of Isaac. I’m giving the ground on which you are sleeping to you and to your descendants. Your descendants will be as the dust of the Earth; they’ll stretch from west to east and from north to south. All the families of the Earth will bless themselves in you and your descendants. Yes. I’ll be with you, I’ll keep a close watch on you wherever you go, and I’ll bring you back to this ground. I’m not leaving you until I’ve finished what I’m telling you now.”"
//   },
//   "Genesis 32:22-30": {
//     KJV: "22 And he rose up that night, and took his two wives, and his two womenservants, and his eleven sons, and passed over the ford Jabbok. 23 And he took them, and sent them over the brook, and sent over that he had. 24 And Jacob was left alone; and there wrestled a man with him until the breaking of the day. 25 And when he saw that he prevailed not against him, he touched the hollow of his thigh; and the hollow of Jacob's thigh was out of joint, as he wrestled with him. 26 And he said, Let me go, for the day breaketh. And he said, I will not let thee go, except thou bless me. 27 And he said unto him, What is thy name? And he said, Jacob. 28 And he said, Thy name shall be called no more Jacob, but Israel: for as a prince hast thou power with God and with men, and hast prevailed. 29 And Jacob asked him, and said, Tell me, I pray thee, thy name. And he said, Wherefore is it that thou dost ask after my name? And he blessed him there. 30 And Jacob called the name of the place Peniel: for I have seen God face to face, and my life is preserved.",
//     NKJV: "22 And he arose that night and took his two wives, his two female servants, and his eleven sons, and crossed over the ford of Jabbok. 23 He took them, sent them over the brook, and sent over what he had. 24 Then Jacob was left alone; and a Man wrestled with him until the breaking of day. 25 Now when He saw that He did not prevail against him, He touched the socket of his hip; and the socket of Jacob’s hip was out of joint as He wrestled with him. 26 And He said, “Let Me go, for the day breaks.” But he said, “I will not let You go unless You bless me!” 27 So He said to him, “What is your name?” He said, “Jacob.” 28 And He said, “Your name shall no longer be called Jacob, but Israel; for you have struggled with God and with men, and have prevailed.” 29 Then Jacob asked, saying, “Tell me Your name, I pray.” And He said, “Why is it that you ask about My name?” And He blessed him there. 30 So Jacob called the name of the place Peniel: “For I have seen God face to face, and my life is preserved.”",
//     NIV: "22 That night Jacob got up and took his two wives, his two female servants and his eleven sons and crossed the ford of the Jabbok. 23 After he had sent them across the stream, he sent over all his possessions. 24 So Jacob was left alone, and a man wrestled with him till daybreak. 25 When the man saw that he could not overpower him, he touched the socket of Jacob’s hip so that his hip was wrenched as he wrestled with the man. 26 Then the man said, “Let me go, for it is daybreak.” But Jacob replied, “I will not let you go unless you bless me.” 27 The man asked him, “What is your name?” “Jacob,” he answered. 28 Then the man said, “Your name will no longer be Jacob, but Israel, because you have struggled with God and with humans and have overcome.” 29 Jacob said, “Please tell me your name.” But he replied, “Why do you ask my name?” Then he blessed him there. 30 So Jacob called the place Peniel, saying, “It is because I saw God face to face, and yet my life was spared.”",
//     ESV: "22 The same night he arose and took his two wives, his two female servants, and his eleven sons, and crossed the ford of the Jabbok. 23 He took them and sent them across the stream, and everything else that he had. 24 And Jacob was left alone. And a man wrestled with him until the breaking of the day. 25 When the man saw that he did not prevail against Jacob, he touched his hip socket, and Jacob's hip was put out of joint as he wrestled with him. 26 Then he said, “Let me go, for the day has broken.” But Jacob said, “I will not let you go unless you bless me.” 27 And he said to him, “What is your name?” And he said, “Jacob.” 28 Then he said, “Your name shall no longer be called Jacob, but Israel, for you have striven with God and with men, and have prevailed.” 29 Then Jacob asked him, “Please tell me your name.” But he said, “Why is it that you ask my name?” And there he blessed him. 30 So Jacob called the name of the place Peniel, saying, “For I have seen God face to face, and yet my life has been delivered.”",
//     AMP: "22 But he rose up that same night and took his two wives, his two female servants, and his eleven sons, and crossed the ford of the Jabbok. 23 He took them and sent them across the stream, and he also sent across all [the possessions] that he had. 24 So Jacob was left alone, and a Man wrestled with him until daybreak. 25 When the Man saw that He had not prevailed against Jacob, He touched his hip socket; and Jacob’s hip was dislocated as he wrestled with Him. 26 Then He said, “Let Me go, for day is breaking.” But Jacob said, “I will not let You go unless You bless me.” 27 The Man asked him, “What is your name?” And he said, “Jacob.” 28 Then He said, “Your name shall no longer be Jacob, but Israel; for you have struggled with God and with men and have prevailed.” 29 Jacob asked Him, “Please tell me Your name.” But He said, “Why is it that you ask My name?” And He blessed him there. 30 So Jacob named the place Peniel (face of God), saying, “For I have seen God face to face, yet my life has not been taken.”",
//     NLT: "22 During the night Jacob got up and took his two wives, his two servant wives, and his eleven sons and crossed the Jabbok River with them. 23 After sending them across the stream, he sent over all his possessions. 24 This left Jacob all alone in the camp, and a man came and wrestled with him until the dawn began to break. 25 When the man saw that he would not win the match, he touched the hip socket and wrenched it out of its joint. 26 Then the man said, “Let me go, for the dawn is breaking!” But Jacob said, “I will not let you go unless you bless me.” 27 “What is your name?” the man asked. “Jacob,” he replied. 28 “Your name will no longer be Jacob,” the man told him. “From now on you will be called Israel, because you have fought with God and with men and have won.” 29 “Please tell me your name,” Jacob said. “Why do you want to know my name?” the man replied. Then he blessed Jacob there. 30 Jacob named the place Peniel (which means “face of God”), for he said, “I have seen God face to face, yet my life has been spared.”",
//     MSG: "22-23 But during the night he got up and took his two wives, his two maidservants, and his eleven children and crossed the ford of the Jabbok. He got them safely across the brook and then brought over his possessions. 24-25 But Jacob stayed behind by himself, and a man wrestled with him until daybreak. When the man saw that he couldn’t get the best of Jacob as they wrestled, he deliberately threw Jacob’s hip out of joint. 26 The man said, “Let me go; it’s daybreak.” Jacob said, “I’m not letting you go till you bless me.” 27 The man said, “What’s your name?” He answered, “Jacob.” 28 The man said, “But no longer. Your name is now Israel (God-Wrestler). You’ve wrestled with God and you’ve wrestled with men. And you’ve won.” 29 Jacob said, “And what’s your name?” The man said, “Why do you want to know my name?” and then, right then and there, he blessed him. 30 Jacob named the place Peniel (God’s Face) because, he said, “I saw God face-to-face and lived to tell the story!”"
//   },
//   "Genesis 32:24": {
//     KJV: "24 And Jacob was left alone; and there wrestled a man with him until the breaking of the day.",
//     NKJV: "24 Then Jacob was left alone; and a Man wrestled with him until the breaking of day.",
//     NIV: "24 So Jacob was left alone, and a man wrestled with him till daybreak.",
//     ESV: "24 And Jacob was left alone. And a man wrestled with him until the breaking of the day.",
//     AMP: "24 So Jacob was left alone, and a Man [the Angel of the Lord] wrestled with him until daybreak.",
//     NLT: "24 This left Jacob all alone in the camp, and a man came and wrestled with him until the dawn began to break.",
//     MSG: "24 But Jacob stayed behind by himself, and a man wrestled with him until daybreak."
//   },
//   "Genesis 32:22-23": {
//     KJV: "22 And he rose up that night, and took his two wives, and his two womenservants, and his eleven sons, and passed over the ford Jabbok. 23 And he took them, and sent them over the brook, and sent over that he had.",
//     NKJV: "22 And he arose that night and took his two wives, his two female servants, and his eleven sons, and crossed over the ford of Jabbok. 23 He took them, sent them over the brook, and sent over what he had.",
//     NIV: "22 That night Jacob got up and took his two wives, his two female servants and his eleven sons and crossed the ford of the Jabbok. 23 After he had sent them across the stream, he sent over all his possessions.",
//     ESV: "22 The same night he arose and took his two wives, his two female servants, and his eleven sons, and crossed the ford of the Jabbok. 23 He took them and sent them across the stream, and everything else that he had.",
//     AMP: "22 But he rose up that same night and took his two wives, his two female servants, and his eleven sons, and crossed the ford of the Jabbok. 23 He took them and sent them across the stream, and he also sent across all [the possessions] that he had.",
//     NLT: "22 During the night Jacob got up and took his two wives, his two servant wives, and his eleven sons and crossed the Jabbok River with them. 23 After sending them across the stream, he sent over all his possessions.",
//     MSG: "22-23 But during the night he got up and took his two wives, his two maidservants, and his eleven children and crossed the ford of the Jabbok. He got them safely across the brook and then brought over his possessions."
//   },
//   "Genesis 32:24-26": {
//     KJV: "24 And Jacob was left alone; and there wrestled a man with him until the breaking of the day. 25 And when he saw that he prevailed not against him, he touched the hollow of his thigh; and the hollow of Jacob's thigh was out of joint, as he wrestled with him. 26 And he said, Let me go, for the day breaketh. And he said, I will not let thee go, except thou bless me.",
//     NKJV: "24 Then Jacob was left alone; and a Man wrestled with him until the breaking of day. 25 Now when He saw that He did not prevail against him, He touched the socket of his hip; and the socket of Jacob’s hip was out of joint as He wrestled with him. 26 And He said, “Let Me go, for the day breaks.” But he said, “I will not let You go unless You bless me!”",
//     NIV: "24 So Jacob was left alone, and a man wrestled with him till daybreak. 25 When the man saw that he could not overpower him, he touched the socket of Jacob’s hip so that his hip was wrenched as he wrestled with the man. 26 Then the man said, “Let me go, for it is daybreak.” But Jacob replied, “I will not let you go unless you bless me.”",
//     ESV: "24 And Jacob was left alone. And a man wrestled with him until the breaking of the day. 25 When the man saw that he did not prevail against Jacob, he touched his hip socket, and Jacob's hip was put out of joint as he wrestled with him. 26 Then he said, “Let me go, for the day has broken.” But Jacob said, “I will not let you go unless you bless me.”",
//     AMP: "24 So Jacob was left alone, and a Man wrestled with him until daybreak. 25 When the Man saw that He had not prevailed against Jacob, He touched his hip socket; and Jacob’s hip was dislocated as he wrestled with Him. 26 Then He said, “Let Me go, for day is breaking.” But Jacob said, “I will not let You go unless You bless me.”",
//     NLT: "24 This left Jacob all alone in the camp, and a man came and wrestled with him until the dawn began to break. 25 When the man saw that he would not win the match, he touched the hip socket and wrenched it out of its joint. 26 Then the man said, “Let me go, for the dawn is breaking!” But Jacob said, “I will not let you go unless you bless me.”",
//     MSG: "24-26 But Jacob stayed behind by himself, and a man wrestled with him until daybreak. When the man saw that he couldn’t get the best of Jacob as they wrestled, he deliberately threw Jacob’s hip out of joint. The man said, “Let me go; it’s daybreak.” Jacob said, “I’m not letting you go till you bless me.”"
//   },
//   "Job 14:14": {
//     KJV: "14 If a man die, shall he live again? all the days of my appointed time will I wait, till my change come.",
//     NKJV: "14 If a man dies, shall he live again? All the days of my hard service I will wait, Till my change comes.",
//     NIV: "14 If a man dies, will he live again? All the days of my hard service I will wait for my renewal to come.",
//     ESV: "14 If a man dies, shall he live again? All the days of my service I would wait, till my renewal should come.",
//     AMP: "14 “If a man dies, will he live again? All the days of my struggle I will wait Until my change and release come.",
//     NLT: "14 Can the dead live again? If so, this would give me hope through all my years of struggle, and I would eagerly wait for the release of death.",
//     MSG: "14 If a man dies, will he live again? I’d welcome the time of my hard service and wait for the release of death."
//   },
//   "Genesis 32:26-28": {
//     KJV: "26 And he said, Let me go, for the day breaketh. And he said, I will not let thee go, except thou bless me. 27 And he said unto him, What is thy name? And he said, Jacob. 28 And he said, Thy name shall be called no more Jacob, but Israel: for as a prince hast thou power with God and with men, and hast prevailed.",
//     NKJV: "26 And He said, “Let Me go, for the day breaks.” But he said, “I will not let You go unless You bless me!” 27 So He said to him, “What is your name?” He said, “Jacob.” 28 And He said, “Your name shall no longer be called Jacob, but Israel; for you have struggled with God and with men, and have prevailed.”",
//     NIV: "26 Then the man said, “Let me go, for it is daybreak.” But Jacob replied, “I will not let you go unless you bless me.” 27 The man asked him, “What is your name?” “Jacob,” he answered. 28 Then the man said, “Your name will no longer be Jacob, but Israel, because you have struggled with God and with humans and have overcome.”",
//     ESV: "26 Then he said, “Let me go, for the day has broken.” But Jacob said, “I will not let you go unless you bless me.” 27 And he said to him, “What is your name?” And he said, “Jacob.” 28 Then he said, “Your name shall no longer be called Jacob, but Israel, for you have striven with God and with men, and have prevailed.”",
//     AMP: "26 Then He said, “Let Me go, for day is breaking.” But Jacob said, “I will not let You go unless You bless me.” 27 The Man asked him, “What is your name?” And he said, “Jacob.” 28 Then He said, “Your name shall no longer be Jacob, but Israel; for you have struggled with God and with men and have prevailed.”",
//     NLT: "26 Then the man said, “Let me go, for the dawn is breaking!” But Jacob said, “I will not let you go unless you bless me.” 27 “What is your name?” the man asked. “Jacob,” he replied. 28 “Your name will no longer be Jacob,” the man told him. “From now on you will be called Israel, because you have fought with God and with men and have won.”",
//     MSG: "26 The man said, “Let me go; it’s daybreak.” Jacob said, “I’m not letting you go till you bless me.” 27 The man said, “What’s your name?” He answered, “Jacob.” 28 The man said, “But no longer. Your name is now Israel (God-Wrestler). You’ve wrestled with God and you’ve wrestled with men. And you’ve won.”"
//   },
//   "Genesis 32:26": {
//     KJV: "26 And he said, Let me go, for the day breaketh. And he said, I will not let thee go, except thou bless me.",
//     NKJV: "26 And He said, “Let Me go, for the day breaks.” But he said, “I will not let You go unless You bless me!”",
//     NIV: "26 Then the man said, “Let me go, for it is daybreak.” But Jacob replied, “I will not let you go unless you bless me.”",
//     ESV: "26 Then he said, “Let me go, for the day has broken.” But Jacob said, “I will not let you go unless you bless me.”",
//     AMP: "26 Then He said, “Let Me go, for day is breaking.” But Jacob said, “I will not let You go unless You bless me.”",
//     NLT: "26 Then the man said, “Let me go, for the dawn is breaking!” But Jacob said, “I will not let you go unless you bless me.”",
//     MSG: "26 The man said, “Let me go; it’s daybreak.” Jacob said, “I’m not letting you go till you bless me.”"
//   },
//   "Genesis 32:25": {
//     KJV: "25 And when he saw that he prevailed not against him, he touched the hollow of his thigh; and the hollow of Jacob's thigh was out of joint, as he wrestled with him.",
//     NKJV: "25 Now when He saw that He did not prevail against him, He touched the socket of his hip; and the socket of Jacob’s hip was out of joint as He wrestled with him.",
//     NIV: "25 When the man saw that he could not overpower him, he touched the socket of Jacob’s hip so that his hip was wrenched as he wrestled with the man.",
//     ESV: "25 When the man saw that he did not prevail against Jacob, he touched his hip socket, and Jacob's hip was put out of joint as he wrestled with him.",
//     AMP: "25 When the Man saw that He had not prevailed against Jacob, He touched his hip socket; and Jacob’s hip was dislocated as he wrestled with Him.",
//     NLT: "25 When the man saw that he would not win the match, he touched the hip socket and wrenched it out of its joint.",
//     MSG: "25 When the man saw that he couldn’t get the best of Jacob as they wrestled, he deliberately threw Jacob’s hip out of joint."
//   },
//   "Genesis 32:27-28": {
//     KJV: "27 And he said unto him, What is thy name? And he said, Jacob. 28 And he said, Thy name shall be called no more Jacob, but Israel: for as a prince hast thou power with God and with men, and hast prevailed.",
//     NKJV: "27 So He said to him, “What is your name?” He said, “Jacob.” 28 And He said, “Your name shall no longer be called Jacob, but Israel; for you have struggled with God and with men, and have prevailed.”",
//     NIV: "27 The man asked him, “What is your name?” “Jacob,” he answered. 28 Then the man said, “Your name will no longer be Jacob, but Israel, because you have struggled with God and with humans and have overcome.”",
//     ESV: "27 And he said to him, “What is your name?” And he said, “Jacob.” 28 Then he said, “Your name shall no longer be called Jacob, but Israel, for you have striven with God and with men, and have prevailed.”",
//     AMP: "27 The Man asked him, “What is your name?” And he said, “Jacob.” 28 Then He said, “Your name shall no longer be Jacob, but Israel; for you have struggled with God and with men and have prevailed.”",
//     NLT: "27 “What is your name?” the man asked. “Jacob,” he replied. 28 “Your name will no longer be Jacob,” the man told him. “From now on you will be called Israel, because you have fought with God and with men and have won.”",
//     MSG: "27-28 The man said, “What’s your name?” He answered, “Jacob.” The man said, “But no longer. Your name is now Israel (God-Wrestler). You’ve wrestled with God and you’ve wrestled with men. And you’ve won.”"
//   },
//   "Genesis 32:27": {
//     KJV: "27 And he said unto him, What is thy name? And he said, Jacob.",
//     NKJV: "27 So He said to him, “What is your name?” He said, “Jacob.”",
//     NIV: "27 The man asked him, “What is your name?” “Jacob,” he answered.",
//     ESV: "27 And he said to him, “What is your name?” And he said, “Jacob.”",
//     AMP: "27 The Man asked him, “What is your name?” And he said, “Jacob.”",
//     NLT: "27 “What is your name?” the man asked. “Jacob,” he replied.",
//     MSG: "27 The man said, “What’s your name?” He answered, “Jacob.”"
//   },
//   "Ezekiel 36:11": {
//     KJV: "11 And I will multiply upon you man and beast; and they shall increase and bring fruit: and I will settle you after your old estates, and will do better unto you than at your beginnings: and ye shall know that I am the Lord.",
//     NKJV: "11 I will multiply upon you man and beast; and they shall increase and bear young; I will make you inhabited as in former times, and do better for you than at your beginnings. Then you shall know that I am the Lord.",
//     NIV: "11 I will increase the number of people and animals living on you, and they will be fruitful and become numerous. I will settle people on you as in the past and will make you prosper more than before. Then you will know that I am the Lord.",
//     ESV: "11 And I will multiply on you man and beast, and they shall multiply and be fruitful. And I will cause you to be inhabited as in your former times, and will do more good to you than ever before. Then you will know that I am the Lord.",
//     AMP: "11 I will multiply on you man and beast; and they will increase and be fruitful. I will cause you to be inhabited as you were before, and I will do better for you than at your beginnings. Then you will know [with confidence] that I am the Lord.",
//     NLT: "11 I will increase not only the people, but also your animals. You will be fertile and have many young. I will settle people on you as in the past, and I will make you even more prosperous than before. Then you will know that I am the Lord.",
//     MSG: "11 I’ll fill you with people and animals. They'll have lots of babies. I'll make you more populous than you've ever been, take better care of you than ever. Then you’ll realize that I am God."
//   }
// };

const initialScriptureDB: ScriptureDB = {
  "Hosea 4:6a": {
    KJV: "6 My people are destroyed for lack of knowledge:",
    NKJV: "6 My people are destroyed for lack of knowledge.",
    NIV: "6 my people are destroyed from lack of knowledge.",
    ESV: "6 My people are destroyed for lack of knowledge;",
    AMP: "6 My people are destroyed for lack of knowledge.",
    NLT: "6 My people are being destroyed because they don’t know me.",
    MSG: "6 My people are ruined because they don’t know what’s right or true."
  },
  "1 Kings 21:1-13": {
        KJV: "1 And it came to pass after these things, that Naboth the Jezreelite had a vineyard, which was in Jezreel, hard by the palace of Ahab king of Samaria. 2 And Ahab spake unto Naboth, saying, Give me thy vineyard, that I may have it for a garden of herbs, because it is near unto my house: and I will give thee for it a better vineyard than it; or, if it seem good to thee, I will give thee the worth of it in money. 3 And Naboth said to Ahab, The Lord forbid it me, that I should give the inheritance of my fathers unto thee. 4 And Ahab came into his house heavy and displeased because of the word which Naboth the Jezreelite had spoken to him: for he had said, I will not give thee the inheritance of my fathers. And he laid him down upon his bed, and turned away his face, and would eat no bread. 5 But Jezebel his wife came to him, and said unto him, Why is thy spirit so sad, that thou eatest no bread? 6 And he said unto her, Because I spake unto Naboth the Jezreelite, and said unto him, Give me thy vineyard for money; or else, if it provide thee better, I will give thee another vineyard for it: and he answered, I will not give thee my vineyard. 7 And Jezebel his wife said unto him, Dost thou now govern the kingdom of Israel? arise, and eat bread, and let thine heart be merry: I will give thee the vineyard of Naboth the Jezreelite. 8 So she wrote letters in Ahab's name, and sealed them with his seal, and sent the letters unto the elders and to the nobles that were in his city, dwelling with Naboth. 9 And she wrote in the letters, saying, Proclaim a fast, and set Naboth on high among the people: 10 And set two men, sons of Belial, before him, to bear witness against him, saying, Thou didst blaspheme God and the king. And then carry him out, and stone him, that he may die. 11 And the men of his city, even the elders and the nobles who were the inhabitants in his city, did as Jezebel had sent unto them, and as it was written in the letters which she had sent unto them. 12 They proclaimed a fast, and set Naboth on high among the people. 13 And there came in two men, children of Belial, and sat before him: and the wicked men witnessed against him, even against Naboth, in the presence of the people, saying, Naboth did blaspheme God and the king. Then they carried him forth out of the city, and stoned him with stones, that he died.",
        NKJV: "1 And it came to pass after these things that Naboth the Jezreelite had a vineyard which was in Jezreel, next to the palace of Ahab king of Samaria. 2 So Ahab spoke to Naboth, saying, “Give me your vineyard, that I may have it for a vegetable garden, because it is near, next to my house; and for it I will give you a vineyard better than it. Or, if it seems good to you, I will give you its worth in money.” 3 But Naboth said to Ahab, “The Lord forbid that I should give the inheritance of my fathers to you!” 4 So Ahab went into his house sullen and displeased because of the word which Naboth the Jezreelite had spoken to him; for he had said, “I will not give you the inheritance of my fathers.” And he lay down on his bed, and turned away his face, and would eat no food. 5 But Jezebel his wife came to him, and said to him, “Why is your spirit so sullen that you eat no food?” 6 He said to her, “Because I spoke to Naboth the Jezreelite, and said to him, ‘Give me your vineyard for money; or else, if it pleases you, I will give you another vineyard for it.’ And he answered, ‘I will not give you my vineyard.’” 7 Then Jezebel his wife said to him, “You now exercise authority over Israel! Arise, eat food, and let your heart be cheerful; I will give you the vineyard of Naboth the Jezreelite.” 8 And she wrote letters in Ahab’s name, sealed them with his seal, and sent the letters to the elders and the nobles who were in his city, dwelling with Naboth. 9 She wrote in the letters, saying, Proclaim a fast, and seat Naboth with high honor among the people; 10 and seat two men, scoundrels, before him to bear witness against him, saying, “You have blasphemed God and the king.” Then take him out, and stone him, that he may die. 11 So the men of his city, the elders and the nobles who were inhabitants in his city, did as Jezebel had sent to them, as it was written in the letters which she had sent to them. 12 They proclaimed a fast, and seated Naboth with high honor among the people. 13 And two men, scoundrels, came in and sat before him; and the scoundrels witnessed against him, against Naboth, in the presence of the people, saying, “Naboth has blasphemed God and the king!” Then they carried him out of the city and stoned him with stones, so that he died.",
        NIV: "1 Some time later there was an incident involving a vineyard belonging to Naboth the Jezreelite. The vineyard was in Jezreel, close to the palace of Ahab king of Samaria. 2 Ahab said to Naboth, “Let me have your vineyard to use for a vegetable garden, since it is close to my palace. In exchange I will give you a better vineyard or, if you prefer, I will pay you whatever it is worth.” 3 But Naboth replied, “The Lord forbid that I should give you the inheritance of my ancestors.” 4 So Ahab went home, sullen and angry because Naboth the Jezreelite had said, “I will not give you the inheritance of my ancestors.” He lay on his bed sulking and refused to eat. 5 His wife Jezebel came in and asked him, “Why are you so sullen? Why won’t you eat?” 6 He answered her, “Because I said to Naboth the Jezreelite, ‘Sell me your vineyard; or if you prefer, I will give you another vineyard in exchange.’ But he said, ‘I will not give you my vineyard.’” 7 Jezebel his wife said, “Is this how you act as king over Israel? Get up and eat! Cheer up. I’ll get you the vineyard of Naboth the Jezreelite.” 8 So she wrote letters in Ahab’s name, placed his seal on them, and sent them to the elders and nobles who lived in Naboth’s city with him. 9 In those letters she wrote: “Proclaim a day of fasting and seat Naboth in a prominent place among the people. 10 But seat two scoundrels opposite him and have them bring charges that he has cursed both God and the king. Then take him out and stone him to death.” 11 So the elders and nobles who lived in Naboth’s city did as Jezebel directed in the letters she had written to them. 12 They proclaimed a fast and seated Naboth in a prominent place among the people. 13 Then two scoundrels came and sat opposite him and brought charges against Naboth before the people, saying, “Naboth has cursed both God and the king.” So they took him outside the city and stoned him to death.",
        ESV: "1 Now Naboth the Jezreelite had a vineyard in Jezreel, beside the palace of Ahab king of Samaria. 2 And after this Ahab said to Naboth, “Give me your vineyard, that I may have it for a vegetable garden, because it is near my house, and I will give you a better vineyard for it; or, if it seems good to you, I will give you its value in money.” 3 But Naboth said to Ahab, “The Lord forbid it me, that I should give you the inheritance of my fathers.” 4 And Ahab came into his house vexed and sullen because of what Naboth the Jezreelite had said to him, for he had said, “I will not give you the inheritance of my fathers.” And he lay down on his bed and turned away his face and would eat no food. 5 But Jezebel his wife came to him and said to him, “Why is your spirit so vexed that you eat no food?” 6 And he said to her, “Because I spoke to Naboth the Jezreelite and said to him, ‘Give me your vineyard for money, or else, if it please you, I will give you another vineyard for it.’ And he answered, ‘I will not give you my vineyard.’” 7 And Jezebel his wife said to him, “Do you now govern Israel? Arise and eat bread and let your heart be cheerful; I will give you the vineyard of Naboth the Jezreelite.” 8 So she wrote letters in Ahab's name and sealed them with his seal, and she sent the letters to the elders and the nobles who lived in his city with Naboth. 9 And she wrote in the letters, “Proclaim a fast, and set Naboth at the head of the people. 10 And set two worthless men opposite him, and let them bring a charge against him, saying, ‘You have cursed God and the king.’ Then take him out and stone him to death.” 11 And the men of his city, the elders and the nobles who lived in his city, did as Jezebel had sent word to them. As it was written in the letters that she had sent to them, 12 they proclaimed a fast and set Naboth at the head of the people. 13 And the two worthless men came in and sat opposite him. And the worthless men brought a charge against Naboth in the presence of the people, saying, “Naboth cursed God and the king.” So they took him outside the city and stoned him to death with stones.",
        AMP: "1 Now it came to pass after these things that Naboth the Jezreelite had a vineyard in Jezreel, beside the palace of Ahab king of Samaria. 2 Ahab spoke to Naboth, saying, “Give me your vineyard so that I may have it for a garden of herbs (vegetables), because it is near my house. I will give you a better vineyard for it, or, if you prefer, I will give you its worth in money.” 3 But Naboth said to Ahab, “The Lord forbid that I should give the inheritance of my fathers to you!” 4 So Ahab went into his house sullen and vexed because of the answer which Naboth the Jezreelite had given him; for he had said, “I will not give you the inheritance of my fathers.” And he lay down on his bed and turned away his face and would eat no food. 5 But Jezebel his wife came to him and asked, “Why is your spirit so troubled that you eat no food?” 6 And he said to her, “Because I spoke to Naboth the Jezreelite and said to him, ‘Give me your vineyard for money; or else, if you prefer, I will give you another vineyard for it.’ And he answered, ‘I will not give you my vineyard.’” 7 Jezebel his wife said to him, “Do you now exercise authority over Israel? Arise, eat bread, and let your heart be cheerful; I will give you the vineyard of Naboth the Jezreelite.” 8 So she wrote letters in Ahab’s name and sealed them with his seal, and sent them to the elders and to the nobles who lived in his city with Naboth. 9 Now she wrote in the letters, saying, “Proclaim a fast and seat Naboth at the head of the people; 10 and seat two worthless and unprincipled men opposite him, and have them testify against him, saying, ‘You cursed God and the king.’ Then take him out and stone him to death.” 11 So the men of his city, the elders and the nobles who lived in his city, did as Jezebel had sent word to them, just as it was written in the letters which she had sent to them. 12 They proclaimed a fast and seated Naboth at the head of the people. 13 Then the two worthless men came in and sat opposite him; and the worthless men testified against Naboth before the people, saying, “Naboth cursed God and the king.” So they took him outside the city and stoned him to death.",
        NLT: "1 Now there was a man named Naboth, from Jezreel, who owned a vineyard in Jezreel beside the palace of King Ahab of Samaria. 2 One day Ahab said to Naboth, “Since your vineyard is so convenient to my palace, I would like to buy it to use as a vegetable garden. I will give you a better vineyard in exchange, or if you prefer, I will pay you for it.” 3 But Naboth replied, “The Lord forbid that I should give you the inheritance that was passed down by my ancestors.” 4 So Ahab went home angry and sullen because of Naboth’s answer. The king went to bed with his face to the wall and refused to eat! 5 “What’s the matter?” his wife Jezebel asked him. “What’s made you so upset that you’re not eating?” 6 “I asked Naboth to sell me his vineyard or trade it, but he refused!” Ahab told her. 7 “Are you the king of Israel or not?” Jezebel asked. “Get up and eat something, and don’t worry about it. I’ll get you Naboth’s vineyard!” 8 So she wrote letters in Ahab’s name, sealed them with his seal, and sent them to the elders and other leaders of the town where Naboth lived. 9 In her letters she commanded: “Call the citizens together for a fast and give Naboth a place of honor. 10 And then seat two scoundrels across from him who will accuse him of cursing God and the king. Then take him out and stone him to death.” 11 So the elders and other town leaders followed the instructions Jezebel had written in the letters. 12 They called for a fast and put Naboth at a place of honor among the people. 13 Then the two scoundrels came and sat down across from him. And they accused Naboth before all the people, saying, “Naboth cursed God and the king.” So he was dragged outside the town and stoned to death.",
        MSG: "1-3 It came about after this that Naboth the Jezreelite owned a vineyard in Jezreel. It was right next to the palace of Ahab king of Samaria. Ahab said to Naboth, “Give me your vineyard so I can use it for a kitchen garden; it’s right next to my house. I’ll give you a better vineyard in exchange, or if you prefer, I’ll pay you a fair price in cash.” Naboth said to Ahab, “God forbid that I should give you my family inheritance!” 4 Ahab went home in a black mood, sulking because of Naboth’s answer, “I’ll never give you my family inheritance.” He went to bed, turned his face to the wall, and wouldn't eat a bite. 5-6 His wife Jezebel came in and said, “What’s going on? Why are you so out of sorts? Why aren't you eating?” He told her, “Because I spoke to Naboth the Jezreelite and said, ‘Give me your vineyard. I’ll pay you for it or, if you’d rather, I’ll give you another vineyard in exchange.’ And he said, ‘I’ll never give you my vineyard.’” 7 Jezebel his wife said, “Is this how the king of Israel acts? Get out of bed! Eat! Cheer up! I’ll get you the vineyard of Naboth the Jezreelite.” 8-10 So she wrote letters in Ahab’s name and sealed them with his seal. She sent the letters to the city fathers and leaders who lived in Naboth’s city. She wrote: “Call for a fast. Put Naboth in the front row. Then find two hoodlums and seat them opposite him. Have them accuse him, ‘You cursed God and the King!’ Then take him out and stone him to death.” 11-13 The city fathers and leaders did what Jezebel ordered in the letters she had sent them. They called for a fast and put Naboth in the front row. Then the two hoodlums came in, sat in the witness box, and accused Naboth before the people: “Naboth cursed God and the King!” They took him outside the city and stoned him to death."
    },
  "1 Kings 21:1-2": {
    KJV: "1 And it came to pass after these things, that Naboth the Jezreelite had a vineyard, which was in Jezreel, hard by the palace of Ahab king of Samaria. 2 And Ahab spake unto Naboth, saying, Give me thy vineyard, that I may have it for a garden of herbs, because it is near unto my house: and I will give thee for it a better vineyard than it; or, if it seem good to thee, I will give thee the worth of it in money.",
    NKJV: "1 And it came to pass after these things that Naboth the Jezreelite had a vineyard which was in Jezreel, next to the palace of Ahab king of Samaria. 2 So Ahab spoke to Naboth, saying, “Give me your vineyard, that I may have it for a vegetable garden, because it is near, next to my house; and for it I will give you a vineyard better than it. Or, if it seems good to you, I will give you its worth in money.”",
    NIV: "1 Some time later there was an incident involving a vineyard belonging to Naboth the Jezreelite. The vineyard was in Jezreel, close to the palace of Ahab king of Samaria. 2 Ahab said to Naboth, “Let me have your vineyard to use for a vegetable garden, since it is close to my palace. In exchange I will give you a better vineyard or, if you prefer, I will pay you whatever it is worth.”",
    ESV: "1 Now Naboth the Jezreelite had a vineyard in Jezreel, beside the palace of Ahab king of Samaria. 2 And after this Ahab said to Naboth, “Give me your vineyard, that I may have it for a vegetable garden, because it is near my house, and I will give you a better vineyard for it; or, if it seems good to you, I will give you its value in money.”",
    AMP: "1 Now it came to pass after these things that Naboth the Jezreelite had a vineyard in Jezreel, beside the palace of Ahab king of Samaria. 2 Ahab spoke to Naboth, saying, “Give me your vineyard so that I may have it for a garden of herbs (vegetables), because it is near my house. I will give you a better vineyard for it, or, if you prefer, I will give you its worth in money.”",
    NLT: "1 Now there was a man named Naboth, from Jezreel, who owned a vineyard in Jezreel beside the palace of King Ahab of Samaria. 2 One day Ahab said to Naboth, “Since your vineyard is so convenient to my palace, I would like to buy it to use as a vegetable garden. I will give you a better vineyard in exchange, or if you prefer, I will pay you for it.”",
    MSG: "1-2 It came about after this that Naboth the Jezreelite owned a vineyard in Jezreel. It was right next to the palace of Ahab king of Samaria. Ahab said to Naboth, “Give me your vineyard so I can use it for a kitchen garden; it’s right next to my house. I’ll give you a better vineyard in exchange, or if you prefer, I’ll pay you a fair price in cash.”"
  },
  "1 Kings 21:1": {
    KJV: "1 And it came to pass after these things, that Naboth the Jezreelite had a vineyard, which was in Jezreel, hard by the palace of Ahab king of Samaria.",
    NKJV: "1 And it came to pass after these things that Naboth the Jezreelite had a vineyard which was in Jezreel, next to the palace of Ahab king of Samaria.",
    NIV: "1 Some time later there was an incident involving a vineyard belonging to Naboth the Jezreelite. The vineyard was in Jezreel, close to the palace of Ahab king of Samaria.",
    ESV: "1 Now Naboth the Jezreelite had a vineyard in Jezreel, beside the palace of Ahab king of Samaria.",
    AMP: "1 Now it came to pass after these things that Naboth the Jezreelite had a vineyard in Jezreel, beside the palace of Ahab king of Samaria.",
    NLT: "1 Now there was a man named Naboth, from Jezreel, who owned a vineyard in Jezreel beside the palace of King Ahab of Samaria.",
    MSG: "1 It came about after this that Naboth the Jezreelite owned a vineyard in Jezreel. It was right next to the palace of Ahab king of Samaria."
  },
  "John 5:7": {
    KJV: "7 The impotent man answered him, Sir, I have no man, when the water is troubled, to put me into the pool: but while I am coming, another steppeth down before me.",
    NKJV: "7 The sick man answered Him, “Sir, I have no man to put me into the pool when the water is stirred up; but while I am coming, another steps down before me.”",
    NIV: "7 “Sir,” the invalid replied, “I have no one to help me into the pool when the water is stirred. While I am trying to get in, someone else goes down ahead of me.”",
    ESV: "7 The sick man answered him, “Sir, I have no one to put me into the pool when the water is stirred up, and while I am going another steps down before me.”",
    AMP: "7 The invalid answered, “Sir, I have no one to put me into the pool when the water is stirred up, and while I am coming [to get into it], someone else steps down before me.”",
    NLT: "7 “I can't, sir,” the sick man said, “for I have no one to put me into the pool when the water bubbles up. Someone else always gets there ahead of me.”",
    MSG: "7 The sick man said, “Sir, when the water is stirred, I don't have anybody to help me into the pool. By the time I get there, somebody else is already in.”"
  }
};




const quizQuestions = [
    {
        q: "According to Hosea 4:6a, what is the primary cause of destruction mentioned in the lesson?",
        a: [
            "Persecution from enemies",
            "Lack of knowledge",
            "Absence of leadership",
            "Lack of financial resources"
        ],
        correct: 1
    },
    {
        q: "What valuable possession did Naboth inherit that became central to the lesson?",
        a: [
            "A palace",
            "A royal inheritance",
            "A vineyard",
            "A trade business"
        ],
        correct: 2
    },
    {
        q: "Why did King Ahab desire Naboth’s vineyard?",
        a: [
            "To convert it into a temple",
            "To use it as a vegetable garden because it was close to his palace",
            "To expand his military base",
            "To give it to Jezebel"
        ],
        correct: 1
    },
    {
        q: "What major mistake did Naboth make according to the lesson?",
        a: [
            "He ignored King Ahab’s authority",
            "He failed to recognize the full value and potential of what he had",
            "He relocated without notice",
            "He sold the vineyard too quickly"
        ],
        correct: 1
    },
    {
        q: "The lesson 'Limited Knowledge' teaches believers to:",
        a: [
            "Avoid responsibility",
            "Undervalue inherited possessions",
            "Examine and appreciate the full value of what they have",
            "Guard traditions without question"
        ],
        correct: 2
    },
    {
        q: "What warning is given in 'What’s Close to Others'?",
        a: [
            "Relocate from envious people",
            "Share everything freely",
            "Avoid forming relationships",
            "Protect what others have access to"
        ],
        correct: 3
    },
    {
        q: "John 5:7 is used in the lesson to emphasize that:",
        a: [
            "Delay can cause others to take available opportunities",
            "Patience eliminates competition",
            "Miracles happen automatically",
            "Healing requires location change"
        ],
        correct: 0
    },
    {
        q: "The point 'Cultivate It Now' teaches that:",
        a: [
            "Inheritance guarantees success",
            "Effort is unnecessary",
            "Others will develop what you neglect",
            "Opportunities wait indefinitely"
        ],
        correct: 2
    },
    {
        q: "Why does the lesson warn against celebrating poverty?",
        a: [
            "Wealth is sinful",
            "Poverty can limit one’s ability to maximize opportunities",
            "Rich people are always oppressive",
            "Poverty is spiritually superior"
        ],
        correct: 1
    },
    {
        q: "The overall message of 'Ignorant Of Own Treasure' emphasizes that:",
        a: [
            "Inheritance guarantees prosperity",
            "External enemies are the main threat to destiny",
            "Ignorance can lead to loss, stagnation, and destruction",
            "Kings always act unjustly"
        ],
        correct: 2
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

    type SubPoint = { title: string; content: string; scripture?: string };
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
    lessonDate: "March 8, 2026",
    lessonTitle: "Ignorant Of Own Treasure (Part 1)",

    memoryVerse:
        "My people are destroyed for lack of knowledge. - Hosea 4:6a",
    memoryVerseRef: "Hosea 4:6a",

    introScriptures: [
        "Hosea 4:6a"
    ],

    lessonIntroScriptures: ["1 Kings 21:1-13"],

    introduction:
        "Every man has been provided with treasures by the Lord as his manner is. He prepared Eden for Adam and Canaan for Israel to possess. Despite this fact, many are rotting away without enjoying these treasures. To Naboth was left a vineyard that could have enriched him but his ignorance did not only retard his progress but also attract his death.",

    aims:
        "To arouse brethren to carefully examine what's at their disposal.",

    objectives:
        "To prevent the brethren from premature death out of ignorance.",

    lessonIntro:
        "This vineyard was the only reflection of the lives and labours of Naboth's ancestors but he was too naive to appreciate it for its real potentials. King Ahab coveted it but could not strike a deal with Naboth and consequently killed him for it. The lesson and the consequences are below to consider.",

    lessonPoints: [
        {
            title: "LIMITED KNOWLEDGE:",
            content:
                "Vs 1-2. Naboth held to the vineyard because it was the only prominent memory of his fathers. He did not realize that there was more to the vineyard like King Ahab saw. Ahab was restless until he confiscated what Naboth commonised. Let us examine what we have and appreciate its entire value. It may be your way to the top.",
            scriptures: ["1 Kings 21:1-2"],
            subPoints: [],
        },
        {
            title: "WHAT'S CLOSE TO OTHERS:",
            content:
                "Vs 1. This passage teaches us to be mindful of our belongings that are close to other people. Protect what other people have access to. If you are loose, you will loose the loosed belongings.",
            scriptures: ["1 Kings 21:1"],
            subPoints: [],
        },
        {
            title: "CULTIVATE IT NOW:",
            content:
                "If you don't cultivate your vineyard others will. Time and chance waits for no man. The man by the pool said while I was still trying another goes down before me. Don't let desperate people seize your treasure base.",
            scriptures: ["John 5:7"],
            subPoints: [],
        },
        {
            title: "DON'T CELEBRATE POVERTY:",
            content:
                "Vs 1-2. One reason Naboth could not maximize the use of the vineyard was poverty. Don't celebrate it but do something about it because if not you will loose precious things. Wealth and riches are also powerful that other noble people like Ahab will respect and stay clear.",
            scriptures: ["1 Kings 21:1-2"],
            subPoints: [],
        },
    ],

    conclusion:
        "All the results of ignorance are at the extreme and we must not patronize it.",

    conclusionScriptures: [],

    prayerPoints: [
        "Father, open my eyes to recognize and appreciate the treasures You have given me.",
        "Lord, deliver me from ignorance that can destroy my destiny.",
        "Father, give me wisdom to cultivate and protect what You have placed in my hands."
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
                            Ignorant Of Own Treasure (Part 1)
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
                                        Text: 1 Kings 21:1-13
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "1 Kings 21:1-13"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                        <BookOpen size={16} />
                                            Read  1 Kings 21:1-13
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
                                                                                subPoint.scripture ||
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
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
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
                Self-Assessment: Ignorant Of Own Treasure
            </h4>

            <p className="mb-4">
                On a scale of 1 to 10, how well do you recognize, value, and cultivate
                the treasures God has placed in your life instead of neglecting them
                (1 Kings 21:1–2; Hosea 4:6a)?
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
                    ? "Excellent! Continue appreciating and cultivating your God-given treasures before others attempt to seize them."
                    : faithRating >= 5
                    ? "You are making progress. Examine what you may be undervaluing and begin to intentionally cultivate it."
                    : "This is a wake-up call. Ask God for wisdom to recognize and protect what He has already placed in your hands."}
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
                Personal Decisions: Valuing My Treasure
            </h4>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={commitmentInput}
                    onChange={(e) => setCommitmentInput(e.target.value)}
                    placeholder="Write a personal decision (e.g., identify my gifts, cultivate my skills, protect my opportunities, avoid ignorance, refuse to celebrate poverty)..."
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
                Naboth failed to maximize the full potential of his vineyard,
                and ignorance led to loss (1 Kings 21:1–13). The man at the pool
                lost opportunities because others moved faster (John 5:7).
                Do not allow ignorance, delay, or carelessness to rob you of
                what God has given you. Make deliberate and practical decisions
                to cultivate and protect your treasure.
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
