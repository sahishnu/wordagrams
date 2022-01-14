import styles from './styles/variables.module.scss';
const COLS = parseInt(styles.COLUMNS);

export const ItemTypes = {
  TILE: 'tile'
}

export const Emojis = ['❤️', '💩', '😄', '🎮', '💪🏽', '🎼', '🤪', '💙', '🧡', '💜', '🖤', '🤌🏽', '🙏🏽'];

export const BOARD_SIZE = COLS;
export const MIN_WORD_LENGTH = 3;

// object with all letters
export const Letters = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
  f: 'f',
  g: 'g',
  h: 'h',
  i: 'i',
  j: 'j',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  o: 'o',
  p: 'p',
  // q: 'q', removing q makes game a lil easier
  r: 'r',
  s: 's',
  t: 't',
  u: 'u',
  v: 'v',
  w: 'w',
  x: 'x',
  y: 'y',
  z: 'z',
}

export const DICE1 = ['M','M', 'L', 'L', 'B', 'Y'];
export const DICE2 = ['V','E', 'G', 'K', 'P', 'P'];
export const DICE3 = ['H','H', 'N', 'N', 'R', 'R'];
export const DICE4 = ['D','F', 'R', 'L', 'L', 'W'];
export const DICE5 = ['R','R', 'D', 'L', 'G', 'G'];
export const DICE6 = ['X','K', 'B', 'S', 'Z', 'N'];
export const DICE7 = ['W','H', 'H', 'T', 'T', 'P'];
export const DICE8 = ['C','C', 'B', 'T', 'J', 'D'];
export const DICE9 = ['C','C', 'M', 'T', 'T', 'S'];
export const DICE10 = ['O','I', 'I', 'N', 'N', 'Y'];
export const DICE11 = ['A','E', 'I', 'O', 'U', 'U'];
export const DICE12 = ['A','A', 'E', 'E', 'O', 'O'];

export const ALL_DICE = [DICE1, DICE2, DICE3, DICE11, DICE5, DICE6, DICE7, DICE10, DICE9, DICE8, DICE4, DICE12];