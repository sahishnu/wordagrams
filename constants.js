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
  'Good Luck, Have Fun! 🤙🏽',
  'Happy Puzzle Solving! 🧩',
  'Happy Hunting! 🐯',
  'Good luck, you will need it! 😅',
  'Fingers crossed! 🤞🏽',
  'You\'ll do great! 🧡',
  'Godspeed, friend 🤝',
  'May the force be with you 🤘🏽',
  'You were made for this. You got it! 😝',
  'Don\'t give up! 💪',
  'Believe in yourself! 👴🏽',
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
export const MIN_TIME_SECOND_HINT = 7*60;

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
