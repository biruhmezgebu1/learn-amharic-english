export interface SceneObject {
  id: string
  emoji: string
  en: string
  am: string
  x: number      // percentage position
  y: number
  action: 'tap' | 'drag'
  dragTarget?: string  // id of target for drag
  sparkle?: boolean
}

export interface Beat {
  soliSays: string
  soliSub?: string
  soliMood: string
  speakEn?: string
  targetObject?: string   // object id to interact with
  targetAction?: 'tap' | 'drag'
  wordReveal?: { en: string; am: string }
  autoAdvance?: number    // ms to auto-advance (0 = wait for interaction)
  challenge?: { prompt: string; correctId: string; wrongIds: string[] }
}

export interface Chapter {
  id: string
  room: string
  title: string
  bgColor: string
  bgGradient: string
  objects: SceneObject[]
  beats: Beat[]
  wordsLearned: string[]
}

export const CHAPTERS: Chapter[] = [
  // ===== PROLOGUE: FRONT DOOR =====
  {
    id: 'door',
    room: 'Front Door',
    title: 'The Front Door',
    bgColor: '#E8D5B7',
    bgGradient: 'linear-gradient(180deg, #87CEEB 0%, #E8D5B7 50%, #C4A882 100%)',
    objects: [
      { id: 'door', emoji: '🚪', en: 'Door', am: 'በር', x: 45, y: 35, action: 'tap' },
    ],
    beats: [
      { soliSays: 'ሰላም? ማን ነው የመጣው?', soliSub: 'Hello? Who is there?', soliMood: 'listen', speakEn: 'Hello? Who is there? Say OPEN to come in!', autoAdvance: 0 },
      { soliSays: '"OPEN" ይበሉ! በሩን ይክፈቱ!', soliSub: 'Say OPEN! Open the door!', soliMood: 'encourage', targetObject: 'door', targetAction: 'tap', wordReveal: { en: 'Open', am: 'ክፈት' } },
      { soliSays: 'ሰላም! እኔ ሶሊ ነኝ! ግቡ!', soliSub: 'Hello! I am Soli! Come in!', soliMood: 'wave', speakEn: 'Hello! I am Soli! Come in!', autoAdvance: 3000 },
    ],
    wordsLearned: ['open', 'door', 'hello'],
  },

  // ===== CHAPTER 1: LIVING ROOM =====
  {
    id: 'living',
    room: 'Living Room',
    title: 'The Living Room',
    bgColor: '#F5EBD8',
    bgGradient: 'linear-gradient(180deg, #FFF8F0 0%, #F5EBD8 100%)',
    objects: [
      { id: 'light', emoji: '💡', en: 'Light', am: 'ብርሃን', x: 10, y: 15, action: 'tap' },
      { id: 'chair', emoji: '🪑', en: 'Chair', am: 'ወንበር', x: 20, y: 55, action: 'tap', sparkle: true },
      { id: 'table', emoji: '🪵', en: 'Table', am: 'ጠረጴዛ', x: 50, y: 50, action: 'tap', sparkle: true },
      { id: 'book', emoji: '📖', en: 'Book', am: 'መጽሓፍ', x: 75, y: 30, action: 'drag', dragTarget: 'soli' },
      { id: 'window', emoji: '🪟', en: 'Window', am: 'መስኮት', x: 80, y: 20, action: 'tap', sparkle: true },
    ],
    beats: [
      { soliSays: 'ጨለመ! ብርሃን ያብሩ!', soliSub: "It's dark! Turn on the light!", soliMood: 'encourage', speakEn: "It is dark! Find the light!", targetObject: 'light', targetAction: 'tap', wordReveal: { en: 'Light', am: 'ብርሃን' } },
      { soliSays: 'ጥሩ! አሁን ክፍሉን ይመልከቱ! ነገሮችን ይንኩ!', soliSub: 'Good! Now look around! Tap things!', soliMood: 'smile', speakEn: 'Good! Tap the things you see!', autoAdvance: 0 },
      { soliSays: '', soliMood: 'smile', targetObject: 'chair', targetAction: 'tap', wordReveal: { en: 'Chair', am: 'ወንበር' } },
      { soliSays: '', soliMood: 'smile', targetObject: 'table', targetAction: 'tap', wordReveal: { en: 'Table', am: 'ጠረጴዛ' } },
      { soliSays: '', soliMood: 'smile', targetObject: 'window', targetAction: 'tap', wordReveal: { en: 'Window', am: 'መስኮት' } },
      { soliSays: 'BOOK ይቺን አምጡልኝ!', soliSub: 'Bring me the BOOK!', soliMood: 'encourage', speakEn: 'Bring me the book!', targetObject: 'book', targetAction: 'drag', wordReveal: { en: 'Book', am: 'መጽሓፍ' } },
      { soliSays: 'አመሰግናለሁ! ተራበኝ! ወደ ኩሽና እንሂድ!', soliSub: "Thank you! I'm hungry! Let's go to the kitchen!", soliMood: 'celebrate', speakEn: "Thank you! I am hungry! Let us go to the kitchen!", autoAdvance: 3000 },
    ],
    wordsLearned: ['light', 'chair', 'table', 'book', 'window'],
  },

  // ===== CHAPTER 2: KITCHEN =====
  {
    id: 'kitchen',
    room: 'Kitchen',
    title: 'The Kitchen',
    bgColor: '#FFF3E0',
    bgGradient: 'linear-gradient(180deg, #FFF8F0 0%, #FFF3E0 100%)',
    objects: [
      { id: 'faucet', emoji: '🚰', en: 'Water', am: 'ውሃ', x: 15, y: 25, action: 'tap' },
      { id: 'cup', emoji: '☕', en: 'Cup', am: 'ስኒ', x: 30, y: 45, action: 'drag', dragTarget: 'soli' },
      { id: 'jebena', emoji: '☕', en: 'Coffee', am: 'ቡና', x: 55, y: 30, action: 'tap' },
      { id: 'fridge', emoji: '🧊', en: 'Fridge', am: 'ማቀዝቀዣ', x: 85, y: 30, action: 'tap' },
      { id: 'bread', emoji: '🍞', en: 'Bread', am: 'ዳቦ', x: 70, y: 55, action: 'drag', dragTarget: 'plate' },
      { id: 'milk', emoji: '🥛', en: 'Milk', am: 'ወተት', x: 80, y: 55, action: 'drag', dragTarget: 'plate' },
      { id: 'plate', emoji: '🍽️', en: '', am: '', x: 45, y: 65, action: 'tap' },
    ],
    beats: [
      { soliSays: 'ውሃ እፈልጋለሁ! ሙዝ ክፈቱ!', soliSub: 'I want WATER! Turn on the faucet!', soliMood: 'encourage', speakEn: 'I want water! Turn on the faucet!', targetObject: 'faucet', targetAction: 'tap', wordReveal: { en: 'Water', am: 'ውሃ' } },
      { soliSays: 'ስኒ ስጡኝ! Give me a CUP!', soliSub: 'Give me a CUP!', soliMood: 'smile', speakEn: 'Give me a cup!', targetObject: 'cup', targetAction: 'drag', wordReveal: { en: 'Cup', am: 'ስኒ' } },
      { soliSays: 'ቡና እንሥራ! Let us make COFFEE!', soliSub: "Let's make COFFEE!", soliMood: 'celebrate', speakEn: 'Let us make coffee!', targetObject: 'jebena', targetAction: 'tap', wordReveal: { en: 'Coffee', am: 'ቡና' } },
      { soliSays: 'ማቀዝቀዣውን ክፈቱ! Open the fridge!', soliSub: 'Open the fridge!', soliMood: 'encourage', speakEn: 'Open the fridge!', targetObject: 'fridge', targetAction: 'tap' },
      { soliSays: 'ዳቦ እና ወተት! BREAD and MILK!', soliSub: 'Bread and Milk! Put them on the plate!', soliMood: 'smile', speakEn: 'Bread and milk! Put them on the plate!', targetObject: 'bread', targetAction: 'drag', wordReveal: { en: 'Bread', am: 'ዳቦ' } },
      { soliSays: '', soliMood: 'smile', targetObject: 'milk', targetAction: 'drag', wordReveal: { en: 'Milk', am: 'ወተት' } },
      { soliSays: 'I EAT bread. I DRINK coffee. እንብላ!', soliSub: 'I eat bread. I drink coffee. Let us eat!', soliMood: 'celebrate', speakEn: 'I eat bread. I drink coffee.', autoAdvance: 3500 },
      { soliSays: 'አመሰግናለሁ! ገበያ መሄድ አለብኝ! Let us go to the market!', soliSub: "Thank you! I need to go to the market!", soliMood: 'celebrate', speakEn: 'Thank you! I need to go to the market!', autoAdvance: 3000 },
    ],
    wordsLearned: ['water', 'cup', 'coffee', 'bread', 'milk'],
  },

  // ===== CHAPTER 3: SOLI'S ROOM =====
  {
    id: 'bedroom',
    room: "Soli's Room",
    title: "Soli's Room",
    bgColor: '#F3E5F5',
    bgGradient: 'linear-gradient(180deg, #FFF8F0 0%, #F3E5F5 100%)',
    objects: [
      { id: 'mirror', emoji: '🪞', en: 'Mirror', am: 'መስታወት', x: 25, y: 25, action: 'tap' },
      { id: 'bag', emoji: '👜', en: 'Bag', am: 'ቦርሳ', x: 70, y: 50, action: 'drag', dragTarget: 'soli' },
      { id: 'photo', emoji: '🖼️', en: 'Photo', am: 'ፎቶ', x: 50, y: 15, action: 'tap' },
    ],
    beats: [
      { soliSays: 'ከመውጣታችን በፊት ልለማመድ! መስታወቱን ይንኩ!', soliSub: 'Before we go, let me practice! Tap the mirror!', soliMood: 'smile', speakEn: 'Before we go, let me practice! Tap the mirror!', targetObject: 'mirror', targetAction: 'tap' },
      { soliSays: 'MY NAME IS Soli! ስምህ ማን ነው? MY NAME IS... ይበሉ!', soliSub: "My name is Soli! What's your name? Say MY NAME IS!", soliMood: 'encourage', speakEn: 'My name is Soli! What is your name?', wordReveal: { en: 'My name is', am: 'ስሜ... ነው' }, autoAdvance: 4000 },
      { soliSays: 'እባክዎን ቦርሳዬን ስጡኝ! PLEASE give me my bag!', soliSub: 'PLEASE give me my bag!', soliMood: 'encourage', speakEn: 'Please give me my bag!', targetObject: 'bag', targetAction: 'drag', wordReveal: { en: 'Please', am: 'እባክዎን' } },
      { soliSays: 'THANK YOU! አመሰግናለሁ!', soliSub: 'Thank you!', soliMood: 'celebrate', speakEn: 'Thank you!', wordReveal: { en: 'Thank you', am: 'አመሰግናለሁ' }, autoAdvance: 2500 },
      { soliSays: 'አንተ ጥሩ ጓደኛ ነህ። You are a GOOD friend.', soliSub: 'You are a good friend.', soliMood: 'smile', speakEn: 'You are a good friend. Thank you.', wordReveal: { en: 'Good', am: 'ጥሩ' }, autoAdvance: 3500 },
      { soliSays: 'አሁን እንሢድ! ወደ መርካቶ! NOW LET US GO!', soliSub: "Now let's go! To the market!", soliMood: 'celebrate', speakEn: "Now let us go! To the market!", autoAdvance: 3000 },
    ],
    wordsLearned: ['myname', 'please', 'thankyou', 'good'],
  },

  // ===== EXIT: PAYWALL DOOR =====
  {
    id: 'exit',
    room: 'The Door to the World',
    title: 'The Outside World',
    bgColor: '#FFF8F0',
    bgGradient: 'linear-gradient(180deg, #87CEEB 0%, #FFF8F0 60%, #E8D5B7 100%)',
    objects: [
      { id: 'exitdoor', emoji: '🚪', en: 'Open', am: 'ክፈት', x: 45, y: 40, action: 'tap' },
    ],
    beats: [
      { soliSays: 'ያስታውሳሉ? በሩን እንዴት እንከፍታለን?', soliSub: 'Do you remember? How do we open the door?', soliMood: 'think', speakEn: 'Do you remember? How do we open the door? Say OPEN!', targetObject: 'exitdoor', targetAction: 'tap' },
      { soliSays: 'OPEN!', soliSub: '', soliMood: 'celebrate', speakEn: 'Open!', autoAdvance: 2000 },
    ],
    wordsLearned: [],
  },
]

export function getAllWordsLearned(): { en: string; am: string }[] {
  const words: { en: string; am: string }[] = []
  const seen = new Set()
  CHAPTERS.forEach(ch => {
    ch.beats.forEach(b => {
      if (b.wordReveal && !seen.has(b.wordReveal.en)) {
        seen.add(b.wordReveal.en)
        words.push(b.wordReveal)
      }
    })
  })
  return words
}
