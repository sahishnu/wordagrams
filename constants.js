import styles from './styles/variables.module.scss';
const COLS = parseInt(styles.COLUMNS);

export const ItemTypes = {
  TILE: 'tile'
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