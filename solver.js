const combine = function(a, min) {
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

const letters = 'CXROAPMAHR'.toLowerCase().split('');

const possibleWords = ["cox","orc","car","cop","com","och","cap","mac","pox","max","oar","pro","rho","rap","ram","rah","arr","pom","hop","ohm","map","hap","ham","aha","coax","crop","corm","corr","crap","cram","char","capo","coma","comp","chop","camp","chap","mach","hoax","roam","hora","roar","romp","ramp","para","harp","harm","copra","macro","roach","porch","cramp","parch","march","poach","mocha","chomp","champ","aroma","armor","morph","carhop","camphor","amphora"];
const sortedVals = possibleWords.map(word => word.split('').sort().join(''));

let startingWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];

while (startingWord.length !== 4) {
  startingWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
}

console.log('Starting Word: ', startingWord);

for (let i = 0; i < startingWord.length; i++) {
  letters.splice(letters.indexOf(startingWord[i]), 1);
}

console.log('Remaining Set: ', letters.join(''));

for (let i = 0; i < startingWord.length; i++) {
  const letter = startingWord[i];
  const set = letters.push(letter);
  console.log('Set: ', letters.join(''));

  const combos = combine(set, 3);
  combos.forEach(combo => {
    if (combo && combo.sort && typeof combo.sort === 'function') {
      const comboString = combo.sort().join('');

      const findInSortedDictionary = sortedVals.findIndex(word => word === comboString);
      if (findInSortedDictionary !== -1) {
        if (!possibleWords.includes(possibleWords[findInSortedDictionary])) {
          possibleWords.push(possibleWords[findInSortedDictionary]);
        }
      }
    }
  });
}