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

export const Emojis = [
  '🤪', '💩', '😄', '🎮', '💪🏽',
  '🫀', '❤️', '💙', '🧡', '💜',
  '🎼', '🤌🏽', '🙏🏽' ,'🤖', '🦾'
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