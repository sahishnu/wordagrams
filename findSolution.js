const dictionarySorted = require('./pages/api/data/dictionarySorted.json');

function combinations(str, min) {
  var fn = function(active, rest, a) {
      if (!active && !rest)
          return;
      if (!rest) {
          if (active.length >= min) {
            a.push(active.split(''));
          }
      } else {
          fn(active + rest[0], rest.slice(1), a);
          fn(active, rest.slice(1), a);
      }
      return a;
  }
  return fn("", str, []);
}
const findPossibleWords = (letters, wordList, mustInclude) => {
  let possibleWords = [];
  let possibleCombos = combinations(letters, 3);
  possibleCombos.forEach(combo => {
    const comboString = combo.sort().join('');
    const findInSortedDictionary = wordList[comboString];
    if (findInSortedDictionary !== undefined) {
      findInSortedDictionary.forEach(word => {
        if (!possibleWords.includes(word)) {
          if (!mustInclude) {
            possibleWords.push(word);
          } else {
            if (word.includes(mustInclude)) {
              possibleWords.push(word);
            }
          }
        }
      })
    }
  });

  return possibleWords;
};

const generateSortedDictionary = (wordList) => {
  let dictionarySorted = {};
  wordList.forEach(word => {
    const sortedWord = word.split('').sort().join('');

    if (dictionarySorted[sortedWord]) {
      dictionarySorted[sortedWord] = [...dictionarySorted[sortedWord], word];
    } else {
      dictionarySorted[sortedWord] = [word];
    }
  });
  return dictionarySorted;
};

const getRemainingLetters = (letters, usedLetters) => {
  let remaining = letters;
  usedLetters.split('').forEach(letter => {
    remaining = remaining.replace(letter, '');
  });
  return remaining;
}

const sortWordsByLength = (words) => {
  return words.sort((a, b) => a.length - b.length);
}

const getRandomWordByLength = (words, len) => {
  const wordsOfLength = words.filter(word => word.length === len);
  const randomIndex = Math.floor(Math.random() * wordsOfLength.length);

  return wordsOfLength[randomIndex];
}

let ALL_LETTERS = 'YFNLLBTTSOIO';
ALL_LETTERS = ALL_LETTERS.toLowerCase();

let words = findPossibleWords(ALL_LETTERS, dictionarySorted);
console.log(words);
// const startingWord = getRandomWordByLength(words, 5);
const startingWord = 'lintsofty';

console.log('Starting Word: ', startingWord);

const shortListSorted = generateSortedDictionary(words);
const remainingLetters = getRemainingLetters(ALL_LETTERS, startingWord);

startingWord.split('').forEach(letter => {
  const newLetters = remainingLetters + letter;
  console.log(newLetters);
  const possibleWords = findPossibleWords(newLetters, shortListSorted, letter);

  console.log(possibleWords)
});
