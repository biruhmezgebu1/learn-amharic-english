export interface Word {
  id: string
  en: string
  am: string
  phonetic: string
  category: 'greeting' | 'food' | 'number' | 'body' | 'travel' | 'feeling' | 'action' | 'thing'
  example: string
  exampleAm: string
}

export const VOCAB: Word[] = [
  // Greetings (Lesson 1)
  { id: 'hello', en: 'Hello', am: '\u1230\u120B\u121D', phonetic: 'heh-LOH', category: 'greeting', example: 'Hello! How are you?', exampleAm: '\u1230\u120B\u121D! \u12A5\u1295\u12F4\u121D\u1295 \u1290\u12CE\u1275?' },
  { id: 'thankyou', en: 'Thank you', am: '\u12A0\u1218\u1230\u130D\u1293\u1208\u1201', phonetic: 'THANK yoo', category: 'greeting', example: 'Thank you very much!', exampleAm: '\u1260\u1323\u121D \u12A0\u1218\u1230\u130D\u1293\u1208\u1201!' },
  { id: 'myname', en: 'My name is', am: '\u1235\u121C... \u1290\u12CD', phonetic: 'my NAYM iz', category: 'greeting', example: 'My name is Soli.', exampleAm: '\u1235\u121C \u1236\u120A \u1290\u12CD\u1362' },
  { id: 'goodbye', en: 'Goodbye', am: '\u12F0\u1215\u1293 \u1201\u1295', phonetic: 'good-BYE', category: 'greeting', example: 'Goodbye! See you tomorrow!', exampleAm: '\u12F0\u1215\u1293 \u1201\u1295! \u1290\u1308 \u12A5\u1295\u130B\u129D!' },
  { id: 'please', en: 'Please', am: '\u12A5\u1263\u12AD\u12CE\u1295', phonetic: 'PLEEZ', category: 'greeting', example: 'Water, please.', exampleAm: '\u12CD\u1203 \u12A5\u1263\u12AD\u12CE\u1295\u1362' },
  { id: 'sorry', en: 'Sorry', am: '\u12ED\u1245\u122D\u1273', phonetic: 'SAH-ree', category: 'greeting', example: 'Sorry, I don\'t understand.', exampleAm: '\u12ED\u1245\u122D\u1273\u1363 \u12A0\u120D\u1308\u1263\u129D\u121D\u1362' },
  { id: 'yes', en: 'Yes', am: '\u12A0\u12CE', phonetic: 'YES', category: 'greeting', example: 'Yes, I understand.', exampleAm: '\u12A0\u12CE\u1363 \u1308\u1263\u129D\u1362' },
  { id: 'no', en: 'No', am: '\u12A0\u12ED\u12F0\u1208\u121D', phonetic: 'NOH', category: 'greeting', example: 'No, thank you.', exampleAm: '\u12A0\u12ED\u12F0\u1208\u121D\u1363 \u12A0\u1218\u1230\u130D\u1293\u1208\u1201\u1362' },

  // Food/Cafe (Lesson 2-3)
  { id: 'coffee', en: 'Coffee', am: '\u1261\u1293', phonetic: 'KAH-fee', category: 'food', example: 'I want coffee, please.', exampleAm: '\u1261\u1293 \u12A5\u1348\u120D\u130B\u1208\u1201\u1362' },
  { id: 'water', en: 'Water', am: '\u12CD\u1203', phonetic: 'WAH-ter', category: 'food', example: 'Can I have water?', exampleAm: '\u12CD\u1203 \u120A\u1230\u1321\u129D \u12ED\u127D\u120B\u1209?' },
  { id: 'bread', en: 'Bread', am: '\u12F3\u1266', phonetic: 'BRED', category: 'food', example: 'Bread and coffee.', exampleAm: '\u12F3\u1266 \u12A5\u1293 \u1261\u1293\u1362' },
  { id: 'milk', en: 'Milk', am: '\u12C8\u1270\u1275', phonetic: 'MILK', category: 'food', example: 'Coffee with milk.', exampleAm: '\u1261\u1293 \u12A8\u12C8\u1270\u1275 \u130B\u122D\u1362' },
  { id: 'iwant', en: 'I want', am: '\u12A5\u1348\u120D\u130B\u1208\u1201', phonetic: 'eye WAHNT', category: 'action', example: 'I want coffee.', exampleAm: '\u1261\u1293 \u12A5\u1348\u120D\u130B\u1208\u1201\u1362' },
  { id: 'howmuch', en: 'How much?', am: '\u1235\u1295\u1275 \u1290\u12CD?', phonetic: 'how MUCH', category: 'thing', example: 'How much is this?', exampleAm: '\u12ED\u1205 \u1235\u1295\u1275 \u1290\u12CD?' },

  // Numbers (Lesson 4)
  { id: 'one', en: 'One', am: '\u12A0\u1295\u12F5', phonetic: 'WUN', category: 'number', example: 'One coffee, please.', exampleAm: '\u12A0\u1295\u12F5 \u1261\u1293 \u12A5\u1263\u12AD\u12CE\u1295\u1362' },
  { id: 'two', en: 'Two', am: '\u1201\u1208\u1275', phonetic: 'TOO', category: 'number', example: 'Two waters.', exampleAm: '\u1201\u1208\u1275 \u12CD\u1203\u1362' },
  { id: 'three', en: 'Three', am: '\u1230\u1236\u1235\u1275', phonetic: 'THREE', category: 'number', example: 'Three breads.', exampleAm: '\u1230\u1236\u1235\u1275 \u12F3\u1266\u1362' },
  { id: 'five', en: 'Five', am: '\u12A0\u121D\u1235\u1275', phonetic: 'FYVE', category: 'number', example: 'Five birr.', exampleAm: '\u12A0\u121D\u1235\u1275 \u1265\u122D\u1362' },
  { id: 'ten', en: 'Ten', am: '\u12A0\u1225\u122D', phonetic: 'TEN', category: 'number', example: 'Ten birr.', exampleAm: '\u12A0\u1225\u122D \u1265\u122D\u1362' },

  // Feelings/Body (Lesson 5-6)
  { id: 'good', en: 'Good', am: '\u1325\u1229', phonetic: 'GOOD', category: 'feeling', example: 'I am good.', exampleAm: '\u12F0\u1215\u1293 \u1290\u129D\u1362' },
  { id: 'happy', en: 'Happy', am: '\u12F0\u1235\u1270\u129B', phonetic: 'HAH-pee', category: 'feeling', example: 'I am happy!', exampleAm: '\u12F0\u1235\u1270\u129B \u1290\u129D!' },
  { id: 'hungry', en: 'Hungry', am: '\u1270\u122B\u1260', phonetic: 'HUNG-ree', category: 'feeling', example: 'I am hungry.', exampleAm: '\u1270\u122B\u1260\u129D\u1362' },
  { id: 'help', en: 'Help', am: '\u12A5\u122D\u12F3\u1273', phonetic: 'HELP', category: 'action', example: 'Help me, please!', exampleAm: '\u12A5\u1263\u12AD\u12CE\u1295 \u12A5\u122D\u12F1\u129D!' },
]

export function getWord(id: string): Word | undefined {
  return VOCAB.find(w => w.id === id)
}

export function getWordsByCategory(cat: string): Word[] {
  return VOCAB.filter(w => w.category === cat)
}

// Lesson definitions
export interface LessonDef {
  stop: number
  titleAm: string
  titleEn: string
  storyAm: string
  storyEn: string
  location: string
  words: string[] // word IDs
  emoji: string
}

export const LESSONS: LessonDef[] = [
  { stop: 1, titleAm: '\u1230\u1348\u122D', titleEn: 'The Neighborhood', storyAm: '\u1236\u120A \u12C8\u12F0 \u1230\u1348\u122D \u12A5\u12E8\u1204\u12F0\u127D \u1290\u12CD\u1362 \u1230\u120B\u121D \u121B\u1208\u1275 \u1275\u122D\u12F3\u1273\u120D?', storyEn: 'Soli is going to the neighborhood. Help her say hello!', location: 'Addis Ababa', words: ['hello', 'thankyou', 'myname'], emoji: '\ud83d\udccd' },
  { stop: 2, titleAm: '\u1261\u1293 \u1262\u1275', titleEn: 'The Coffee Shop', storyAm: '\u1236\u120A \u1261\u1293 \u1262\u1275 \u1308\u1265\u1273\u1363 \u130D\u1295 \u12A5\u1295\u130D\u120A\u12DD\u129B \u12A0\u1273\u12CD\u1245\u121D!', storyEn: 'Soli is at the coffee shop but can\'t order!', location: 'Addis Ababa', words: ['coffee', 'water', 'iwant', 'please'], emoji: '\u2615' },
  { stop: 3, titleAm: '\u1218\u122D\u12AB\u1276', titleEn: 'The Market', storyAm: '\u1236\u120A \u1218\u122D\u12AB\u1276 \u1204\u12F0\u127D! \u12DD\u130B\u12CD\u1295 \u1218\u1325\u12E8\u1245 \u12A0\u1208\u1263\u1275\u1362', storyEn: 'Soli is at the market! She needs to ask the price.', location: 'Merkato', words: ['howmuch', 'one', 'two', 'three', 'five', 'ten'], emoji: '\ud83d\udecd\ufe0f' },
  { stop: 4, titleAm: '\u12F3\u1266 \u1262\u1275', titleEn: 'The Bakery', storyAm: '\u1236\u120A \u12F3\u1266 \u12A5\u1293 \u12C8\u1270\u1275 \u121B\u130D\u12D8\u1275 \u1275\u1348\u120D\u130B\u1208\u127D!', storyEn: 'Soli wants bread and milk!', location: 'Addis Ababa', words: ['bread', 'milk', 'iwant', 'thankyou'], emoji: '\ud83c\udf5e' },
  { stop: 5, titleAm: '\u12A0\u12F2\u1235 \u1309\u12F0\u129B', titleEn: 'New Friend', storyAm: '\u1236\u120A \u12A0\u12F2\u1235 \u1230\u12CD \u12A0\u1308\u129D\u127D! \u122B\u1237\u1295 \u121B\u1235\u1270\u12CB\u12C8\u1245 \u1275\u1348\u120D\u130B\u1208\u127D\u1362', storyEn: 'Soli met someone new! She wants to introduce herself.', location: 'Bole', words: ['hello', 'myname', 'goodbye', 'good', 'happy'], emoji: '\ud83e\udd1d' },
  { stop: 6, titleAm: '\u12A5\u122D\u12F3\u1273!', titleEn: 'Help!', storyAm: '\u1236\u120A \u12A5\u122D\u12F3\u1273 \u1275\u1348\u120D\u130B\u1208\u127D! \u12A5\u1295\u12F4\u1275 \u1218\u1325\u12E8\u1245 \u1275\u121B\u122B\u1208\u127D?', storyEn: 'Soli needs help! Can she learn to ask?', location: 'Addis Ababa', words: ['help', 'please', 'sorry', 'yes', 'no'], emoji: '\ud83c\udd98' },
  { stop: 7, titleAm: '\u1260\u12CB\u120D \u12A5\u1295\u130D\u120A\u12DD\u129B', titleEn: 'Real English', storyAm: '\u12E8\u1218\u1300\u1218\u122A\u12EB \u12CD\u12ED\u12ED\u1275! \u1236\u120A \u12A5\u1295\u130D\u120A\u12DD\u129B \u1218\u1293\u1308\u122D \u1275\u127D\u120B\u1208\u127D!', storyEn: 'Your first conversation! Soli can speak English!', location: 'Bole', words: ['hello', 'myname', 'good', 'thankyou', 'goodbye'], emoji: '\ud83c\udf1f' },
]
