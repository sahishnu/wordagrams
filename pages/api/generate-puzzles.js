import faunadb from 'faunadb';
import dayjs from 'dayjs';

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
  'AAEEOO'
];

const getRandomLetters = () => {
  const out = [];
  DICE.map(die => {
    const random = Math.floor(Math.random() * die.length);
    out.push(die[random]);
  })

  return out.join('');
}

const START_DATE = dayjs('2022-01-17');
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
    if (!doesDocExist) {
      const newPuzzle = {
        date,
        letters: getRandomLetters(),
        day: i,
        words: []
      };
      await client.query(
        q.Create(q.Collection('puzzles'), {
          data: newPuzzle,
        })
      );
      createdPuzzles.push(newPuzzle);
    }
  }

  return res.status(200).json({
    newPuzzles: createdPuzzles
  });
}