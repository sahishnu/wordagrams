import { BOARD_SIZE, MIN_WORD_LENGTH } from "../constants";
import DICTIONARY from '../dictionary.json';

/**
 * 1. find all word/letter sequences on board
 * 2. make sure all letters are used
 * 3. make sure all words are valid length > 3
 * 4. test words in dictionary
 *
 * return true if all words are valid
 * return false if any words are invalid
 */
export const checkBoard = async (boardPositions) => {
  const { words, flags } = getLetterSequencesOnBoard(boardPositions);
  const stringWords = convertObjectsToWords(words);

  const validLengthErrors = testAreAllWordsValidLength(stringWords);
  const inDictionaryErrors = await testAreAllWordsInDictionary(stringWords);
  const unusedTilesErrors = testAreNoUnusedTiles(flags);

  let multipleIslandsErrors = [];
  if (unusedTilesErrors.length === 0) {
    multipleIslandsErrors = testAreMultipleIslands(boardPositions);
  }

  const check = {
    pass: (
      validLengthErrors.length === 0
      && inDictionaryErrors.length === 0
      && unusedTilesErrors.length === 0
      && multipleIslandsErrors.length === 0
    ),
    errors: [
      ...validLengthErrors,
      ...inDictionaryErrors,
      ...unusedTilesErrors,
      ...multipleIslandsErrors
    ]
  };

  return check;
}

const testAreAllWordsInDictionary = async (words) => {
  const errors = [];

  words.forEach(word => {
    const inDictionary = DICTIONARY[word]
    if (word.length >= MIN_WORD_LENGTH && !inDictionary) {
      errors.push(`${word.toUpperCase()} is not in the dictionary!`);
    }
  });
  if (errors.length >= 3) {
    errors = ['Many words are not in the dictionary!'];
  }
  return errors;
}

const testAreAllWordsValidLength = (words) => {
  const errors = [];
  words.forEach(word => {
    const validLength = word.length >= MIN_WORD_LENGTH;
    if (!validLength) {
      errors.push(`${word.toUpperCase()} is not long enough!`);
    }
  });
  if (errors.length >= 3) {
    errors = ['Many words are not long enough!'];
  }
  return errors;
}

const testAreNoUnusedTiles = (flags) => {
  const errors = [];
  const unusedTiles = flags.length === 0;
  if (!unusedTiles) {
    errors.push('There are unused tiles!');
  }
  return errors;
}

const testAreMultipleIslands = (boardPositions) => {
  const board2D = positionsTo2DArray(boardPositions);
  const numberOfIslands = countNumberOfIslands(board2D);

  const errors = [];

  if (numberOfIslands > 1) {
    errors.push('All the words must connect!');
  }

  return errors;
}

// converts an array of letter objects to a single string
const convertObjectsToWords = (wordArray) => {
  return wordArray.map(wordWithObjs => {
    return wordWithObjs.reduce((acc, letter) => {
      return `${acc}${letter.letter}`;
    }, '')
  });
}

// transpose a 2d array (really this is a mapped 1D array)
const tranposeBoard = (board) => {
  const newBoard = {};

  Object.keys(board).forEach(key => {
    const row = Math.floor(key / BOARD_SIZE);
    const col = key % BOARD_SIZE;

    const newKey = (col * BOARD_SIZE) + row;
    newBoard[newKey] = board[key];
  });

  return newBoard;
}

// checks if letter TOP is above letter BOTTOM
const isLetterAbove = (top, bottom, size) => {
  return (top - bottom) === -size;
}

// checks if letter LEFT is to the left of letter RIGHT
const isLetterLeft = (left, right, size) => {
  return (left - right) === -1;
}

const getLetterSequencesOnBoard = (boardPositions) => {
  const words = [];
  const doubleCheck = [];
  for (let rowNum = 0; rowNum < BOARD_SIZE; rowNum++) {
    const leftLim = rowNum * BOARD_SIZE;
    const rightLim = leftLim + BOARD_SIZE - 1;
    const buffer = [];

    for (let col = leftLim; col <= rightLim; col++) {
      const letter = boardPositions[col].letter;

      // if we find a letter, check if there is a buffer
      if (letter !== '') {
        // if there is a buffer, see if letter is adjacent
        if (buffer.length) {
          const lastletterInBuffer = buffer[buffer.length - 1].pos;
          const isAdjacent = isLetterLeft(lastletterInBuffer, col, BOARD_SIZE)

          if (isAdjacent) {
            buffer.push({ pos: col, letter, id: boardPositions[col].id });
          } else {
            // there is an existing buffer. and this letter is not adjacent
            // so copy buffer to words and reset buffer

            // if buffer only had 1 letter, need to double check its part of a word
            if (buffer.length === 1) {
              doubleCheck.push(buffer[0])
            } else {
              words.push(buffer);
            }
            buffer = [{ pos: col, letter, id: boardPositions[col].id }];
          }
        } else {
          buffer.push({ pos: col, letter, id: boardPositions[col].id });
        }
      }
    }

    // before moving to next row, check if there is a buffer
    // if buffer only had 1 letter, need to double check its part of a word
    if (buffer.length === 1) {
      doubleCheck.push(buffer[0])
    } else if (buffer.length > 1) {
      words.push(buffer);
    }
    buffer = [];
  }

  const transposedBoard = tranposeBoard(boardPositions);
  for (let rowNum = 0; rowNum < BOARD_SIZE; rowNum++) {
    const leftLim = rowNum * BOARD_SIZE;
    const rightLim = leftLim + BOARD_SIZE - 1;
    const buffer = [];

    for (let col = leftLim; col <= rightLim; col++) {
      const letter = transposedBoard[col].letter;

      // if we find a letter, check if there is a buffer
      if (letter !== '') {
        // if there is a buffer, see if letter is adjacent
        if (buffer.length) {
          const lastletterInBuffer = buffer[buffer.length - 1].pos;
          const isAdjacent = isLetterLeft(lastletterInBuffer, col, BOARD_SIZE)

          if (isAdjacent) {
            buffer.push({ pos: col, letter, id: transposedBoard[col].id })
          } else {
            // there is an existing buffer. and this letter is not adjacent
            // so copy buffer to words and reset buffer

            // if buffer only had 1 letter, need to double check its part of a word
            if (buffer.length === 1) {
              if (!isLetterInDoubleCheck(buffer[0], doubleCheck)) {
                doubleCheck.push(buffer[0])
              }
            } else {
              words.push(buffer);
            }
            buffer = [{ pos: col, letter, id: transposedBoard[col].id }];
          }
        } else {
          buffer.push({ pos: col, letter, id: transposedBoard[col].id });
        }
      }
    }

    // before moving to next row, check if there is a buffer
    // if buffer only had 1 letter, need to double check its part of a word
    if (buffer.length === 1) {
      if (!isLetterInDoubleCheck(buffer[0], doubleCheck)) {
        doubleCheck.push(buffer[0])
      }
    } else if (buffer.length > 1) {
      words.push(buffer);
    }
    buffer = [];
  }

  // double check words
  // TODO: can have duplicate standalone letters because of transposition
  const flags = doubleCheck.filter(letterToCheck => {
    const { id } = letterToCheck;

    const isPartOfWord = words.some(word => {
      return word.some(letter => {
        return letter.id === id;
      })
    });

    return !isPartOfWord;
  });

  return { words, flags };
}

const isLetterInDoubleCheck = (letter, doubleCheck) => {
  return doubleCheck.some(letterToCheck => {
    return letterToCheck.id === letter.id;
  });
}

const positionsTo2DArray = (positions) => {
  const board = Array(BOARD_SIZE).fill([]).map(() => Array(BOARD_SIZE).fill(''));

  Object.keys(positions).forEach(key => {
    const row = Math.floor(key / BOARD_SIZE);
    const col = key % BOARD_SIZE;
    board[row][col] = positions[key].letter;
  });

  return board;
}

const countNumberOfIslands = (board2D) => {
  let counter = 0;

  const dfs = (i, j) => {
    if (
      i >= 0 &&
      j >= 0 &&
      i < board2D.length &&
      j < board2D[i].length &&
      board2D[i][j] !== ''
    ) {
      board2D[i][j] = '';
      dfs(i + 1, j); // top
      dfs(i, j + 1); // right
      dfs(i - 1, j); // bottom
      dfs(i, j - 1); // left
    }
  };

  for (let i = 0; i < board2D.length; i += 1) {
    for (let j = 0; j < board2D[i].length; j += 1) {
      if (board2D[i][j] !== '') {
        counter += 1;
        dfs(i, j);
      }
    }
  }

  return counter;
}