import styles from './styles/variables.module.scss';
const COLS = parseInt(styles.COLUMNS);

export const ItemTypes = {
  TILE: 'tile'
}

export const GAME_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  SOLVED: 'SOLVED'
}

export const Good_Luck_Messages = [
  'It always seems impossible until it\'s done 🔥 \n - N. Mandela',
  'Don\'t watch the clock; do what it does. Keep going 🕰️ \n - S. Levenson',
  'If you can dream it, you can do it 🐭 \n - W. Disney',
  'Aim for the moon. If you miss, you may hit a star 🌟 \n - W. Stone',
  'It does not matter how slowly you go as long as you do not stop 🐢 \n - Confucius',
  'You can\'t expect to hit the jackpot if you don\'t put a few nickels in the machine 🪙 \n - F. Wilson',
  'You will never win if you never begin 🟢 \n - H. Rowland',
  'The secret of getting ahead is getting started ⛰️ \n - M. Twain',
  'The most certain way to succeed is always to try just one more time 💡 \n - T. Edison',
  'Problems are not stop signs, they are guidelines 🛑 \n - R. Schuller',
  'In order to succeed, we must first believe that we can \n - N. Kazantzakis',
  'You can\'t cross the sea merely by standing and staring at the water 🌊 \n - R. Tagore',
  'Where there is a will, there is a way 🧩 \n - P. Kael',
  'Your talent is God\'s gift to you. What you do with it is your gift back to God 🙏🏽 \n - L. Buscaglia',
  'Winners never quit and quitters never win 🏁 \n - T. Turner',
  'Perseverance is failing 19 times and succeeding the 20th \n - J. Andrews',
  'The harder the conflict, the more glorious the triumph 🏆 \n - T. Paine',
  'Things do not happen. Things are made to happen 🇺🇸 \n - J. F. K.',
  'Big shots are only little shots who keep shooting 💥 \n - C. Morley',
  'Never give in and never give up 💪🏽 \n - H. Humphrey',
  'Either you run the day or the day runs you 🏇🏽 \n - J. Rohn',
  'A somebody was once a nobody who wanted to and did 🦋 \n - J. Burroughs',
];

export const BOARD_SIZE = COLS;
export const MIN_WORD_LENGTH = 3;

export const META_CONTENT = {
  description: 'Arrange all your letters to form words on the board! A new puzzle is released every day.',
  title: 'Cross \'em up',
  twitter: {
    handle: '@sahishnuk',
  },
  url: 'https://crossemup.xyz/'
}

export const MIN_TIME_FIRST_HINT = 4*60;

export const SOLVED_MESSAGES_BY_TIME = [
  {
    time: 30,
    message: 'Holy cow! You\'re a genius! 🤯'
  },
  {
    time: 45,
    message: 'Amazing! You\'re fast! 🤩'
  },
  {
    time: 60,
    message: 'Impressive! You deserve a 🌟'
  },
  {
    time: 90,
    message: 'Wow! You\'re really quick! 👍🏽'
  },
  {
    time: 120,
    message: 'Great! You\'re pretty quick! 👍🏽'
  },
  {
    time: 180,
    message: 'Good job! You did it'
  },
]

export const DICE = [
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

export const HIGHLIGHTED_3 = {
  21: true,
  22: true,
  23: true,
  32: true,
  41: true,
  40: true,
  39: true,
  50: true,
  59: true,
  58: true,
  57: true,
};

export const HIGHLIGHTED_2 = {
  21: true,
  22: true,
  23: true,
  32: true,
  41: true,
  40: true,
  39: true,
  48: true,
  59: true,
  58: true,
  57: true,
};

export const HIGHLIGHTED_1 = {
  21: true,
  22: true,
  31: true,
  40: true,
  49: true,
  59: true,
  58: true,
  57: true,
};

export const HIGHLIGHTED_POSITIONS = {
  1: HIGHLIGHTED_1,
  2: HIGHLIGHTED_2,
  3: HIGHLIGHTED_3
}
