const fs = require('fs');

const rawSortedByLetter = fs.readFileSync('dictionarySorted.json');
const rawDictionary = fs.readFileSync('dictionary.json');
const rawPuzzles = fs.readFileSync('puzzles.json');
const sortedByLetter = JSON.parse(rawSortedByLetter);
const dictionary = JSON.parse(rawDictionary);
const puzzles = JSON.parse(rawPuzzles);

var combine = function(a, min) {
  var fn = function(n, src, got, all) {
      if (n == 0) {
          if (got.length > 0) {
              all[all.length] = got;
          }
          return;
      }
      for (var j = 0; j < src.length; j++) {
          fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
      }
      return;
  }
  var all = [];
  for (var i = min; i < a.length; i++) {
      fn(i, a, [], all);
  }
  all.push(a);
  return all;
}

puzzles.forEach(puzzle => {
  const letters = puzzle.letters;
  const possibleCombos = combine(letters, 5);
  const possibleWords = [];

  possibleCombos.forEach(combo => {
    if (combo && combo.sort && typeof combo.sort === 'function') {
      const comboString = combo.sort().join('');
      const findInDictionary = sortedByLetter.findIndex(word => word === comboString);
      if (findInDictionary !== -1) {
        if (!possibleWords.includes(dictionary[findInDictionary])) {
          possibleWords.push(dictionary[findInDictionary]);
        }
      }
    }
  });

  console.log(letters);
  console.log(possibleWords);
  console.log('\n');
  console.log('\n');
  console.log('\n');
})

// let letters = 'xpmrcoahcarg';


// const possibleCombos6 = combine(letters.split(''), 3);
// const possibleWords = [];
// possibleCombos6.forEach(combo => {
//   const comboString = combo.sort().join('');
//   const findInDictionary = sortedByLetter.findIndex(word => word === comboString);
//   if (findInDictionary !== -1) {
//     if (!possibleWords.includes(dictionary[findInDictionary])) {
//       possibleWords.push(dictionary[findInDictionary]);
//     }
//   }
// });

// console.log(possibleWords);