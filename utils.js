import { BOARD_SIZE, MIN_WORD_LENGTH } from "./constants";
import DICTIONARY from './dictionary.json';
import { getSavedGameState, saveGameState } from "./storedGameState";

export const initGame = (size, puzzleObj) => {
  const game = {};

  if (hasExistingGame(puzzleObj)) {
    // initialize from saved state
    game = initFromSavedState();
  } else {
    game = initFreshGame(size, puzzleObj);
  }


  return game;
}

const initFromSavedState = () => {
  const savedGameState = getSavedGameState();

  return savedGameState;
}

const initFreshGame = (size, puzzleObj) => {
  const board = {};
  const totalSquares = size * size;

  for (let i = 0; i < (totalSquares); i++) {
    board[i] = {
      id: i,
      letter: '',
    };
  }

  if (puzzleObj?.letters) {
    const puzzleLetters = puzzleObj.letters;
    const puzzleTileStarts = totalSquares - puzzleLetters.length;

    for (let i = puzzleTileStarts; i < totalSquares; i++) {
      board[i] = {
        id: i,
        letter: puzzleLetters[i - puzzleTileStarts],
      };
    }
  }
  saveGameState(board, puzzleObj, false);
  return {
    board,
    puzzle: puzzleObj,
    solved: false,
  };
}

const hasExistingGame = (puzzle) => {
  if (typeof window !== "undefined") {
    const savedGameState = getSavedGameState();

    if (savedGameState?.puzzle?.letters === puzzle?.letters) {
      return true;
    }
  } else {
    return false;
  }
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

/**
 * 1. find all word/letter sequences on board
 * 2. make sure all letters are used
 * 3. make sure all words are valid length > 3
 * 4. test words in dictionary
 *
 * return true if all words are valid
 * return false if any words are invalid
 */
export const checkBoard = (boardPositions) => {
  const { words, flags } = getLetterSequencesOnBoard(boardPositions);
  const stringWords = convertObjectsToWords(words);

  // console.log({flags});
  const pass = testAreAllWordsValidLength(stringWords) &&
    testAreAllWordsInDictionary(stringWords) &&
    testAreNoUnusedTiles(flags);

  return pass;
}

const testAreAllWordsInDictionary = (words) => {
  return words.every(word => {
    const inDictionary = DICTIONARY.includes(word)
    if (!inDictionary) {
      console.log(`${word} is not in the dictionary!`);
    }
    return inDictionary;
  });
}

const testAreAllWordsValidLength = (words) => {
  return words.every(word => {
    const validLength = word.length >= MIN_WORD_LENGTH;
    if (!validLength) {
      console.log(`${word} is not long enough!`);
    }
    return validLength;
  });
}

const testAreNoUnusedTiles = (flags) => {
  const unusedTiles = flags.length === 0;
  if (!unusedTiles) {
    console.log(`There are unused tiles!`);
  }
  return flags.length === 0;
}

// converts an array of letter objects to a single string
const convertObjectsToWords = (wordArray) => {
  return wordArray.map(wordWithObjs => {
    return wordWithObjs.reduce((acc, letter) => {
      return `${acc}${letter.letter}`;
    }, '')
  });
}

// checks if letter TOP is above letter BOTTOM
export const isLetterAbove = (top, bottom, size) => {
  return (top - bottom) === -size;
}

// checks if letter LEFT is to the left of letter RIGHT
export const isLetterLeft = (left, right, size) => {
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
              doubleCheck.push(buffer[0])
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
      doubleCheck.push(buffer[0])
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

const shuffleString = (value) => {
  const letters = value.split('');
  const len = letters.length;

  for (let i = len - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = letters[i];
    letters[i] = letters[j];
    letters[j] = temp;
  }

  return letters.join('');
}