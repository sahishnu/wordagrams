import faunadb from 'faunadb';
import dayjs from 'dayjs';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const DICE = [
  'MMLLBY',
  'VFGKPP',
  'HHNNRR',
  'DFRLLW',
  'RRDLGG',
  'XKBSZN',
  'WHHTTP',
  'CCBTJD',
  'CCMTTS',
  'OIINNY',
  'AEIOUU',
  'AAEEOO',
];

const getRandomLetters = () => {
  const out = [];
  DICE.map((die) => {
    const random = Math.floor(Math.random() * die.length);
    out.push(die[random]);
  });

  return out.join('');
};

const getEasyPuzzle = () => {
  let letters = getRandomLetters();
  let vowelCount = 0;

  while (vowelCount < 3 || letters.includes('x')) {
    letters = getRandomLetters();
    vowelCount = letters.split('').reduce((acc, letter) => {
      if (VOWELS.includes(letter)) {
        return acc + 1;
      }
    }, 0);
  }

  return letters;
};

const START_DATE = dayjs('2022-03-30');
const MAX_DAYS = 365;

export default async function handler(req, res) {
  return;

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
    domain: 'db.us.fauna.com',
  });

  const createdPuzzles = [];

  for (let i = 0; i < MAX_DAYS; i++) {
    let date = START_DATE.add(i, 'day').format('YYYY-MM-DD');

    // Check and see if the doc exists.
    const doesDocExist = await client.query(
      q.Exists(q.Match(q.Index('puzzle_by_day'), date))
    );

    // if puzzle for that day doesn't exist, create it
    const newPuzzle = {
      date,
      letters: getEasyPuzzle(),
      day: 71 + i,
      words: [],
    };
    if (!doesDocExist) {
      await client.query(
        q.Create(q.Collection('puzzles'), {
          data: newPuzzle,
        })
      );
    } else {
      // Fetch the document for-real
      const document = await client.query(
        q.Get(q.Match(q.Index('puzzle_by_day'), date))
      );

      await client.query(
        q.Update(document.ref, {
          data: newPuzzle,
        })
      );
    }
    createdPuzzles.push(newPuzzle);
  }

  return res.status(200).json({
    newPuzzles: createdPuzzles,
  });
}
