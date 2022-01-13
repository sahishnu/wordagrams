const fs = require('fs');
// Generates a random number with a normal distribution. (centered around 0.5)
function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

function getRandomIntInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * This script should generate a set of letters which can be used for the puzzle
 * 1. Start with a random word length (normally distributed)
 * 2. Pick a random word from dictionary of that length - get starting word
 * 3. Pick a random word length less than that of starting word
 * 4. Pick a random word of that length from dictionary
 * 5. If not matching letters, pick another word of that length from dictionary
 * 6. If total letters exceed 10, repeat from step 3
 */
function generateAPuzzle() {
  let dictionary = fs.readFileSync('dictionary.txt', 'utf-8');
  dictionary = dictionary.split(/\r?\n/);
  let startingLength = Math.floor(randn_bm() * 10) + 1;
  while (startingLength < 3) {
    startingLength = Math.floor(randn_bm() * 10) + 1;
  }
  const possibleWords = dictionary.filter(word => word.length === startingLength);
  const startingWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];

  const secondWord = findSecondaryWord(startingWord, dictionary);

  return {
    letters: jumblePuzzleLetters([startingWord, secondWord]),
    words: [startingWord, secondWord],
  };
}

function findSecondaryWord(startingWord, dictionary) {
  const wordLength = getRandomIntInRange(3, startingWord.length);
  const possibleWords = dictionary.filter(word => word.length === wordLength);
  let word = possibleWords[Math.floor(Math.random() * possibleWords.length)];

  while (!findCommonLetter(word, startingWord) && areCombinedWordsValidLength([startingWord, word], 10)) {
    word = findSecondaryWord(startingWord, dictionary);
  }

  return word;
}

function findCommonLetter(wordA, wordB) {
  let shorterWord;
  let longerWord;
  if (wordA.length > wordB.length) {
    longerWord = wordA;
    shorterWord = wordB;
  } else {
    longerWord = wordB;
    shorterWord = wordA;
  }
  const longerLetters = longerWord.split('');
  const shorterLetters = shorterWord.split('');

  let sharedLetter = null;
  shorterLetters.forEach(letter => {
    if (longerLetters.includes(letter)) {
      sharedLetter = letter;
    }
  });

  return sharedLetter;
}

function areCombinedWordsValidLength(words, maxLength) {
  let length = words.reduce((acc, word) => acc + word.length, 0);
  length = length - words.length;

  return length <= maxLength;
}

function jumblePuzzleLetters(words) {

  const commonLetter = findCommonLetter(words[0], words[1]);
  const newFirstWord = words[0].replace(commonLetter, '');
  const allLetters = [ ...newFirstWord, ...words[1] ];

  const jumbledLetters = shuffle(allLetters);

  return jumbledLetters.join('');
}

// shuffles an array of elements
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function createPuzzleFile() {
  console.log('Generating puzzles...\n');
  const runs = 10;
  const puzzles = [];

  for (let i = 0; i < runs; i++) {
    const puzzle = generateAPuzzle();
    puzzles.push(`${puzzle.letters}, ${puzzle.words[0]}, ${puzzle.words[1]}`);
  }

  const puzzleFile = fs.createWriteStream('puzzles.txt');
  puzzles.forEach(puzzle => {
    puzzleFile.write(puzzle + '\n');
    console.log(puzzle);
  })
  puzzleFile.end();
  console.log(`\n${puzzles.length} puzzles created!`);
}

createPuzzleFile();