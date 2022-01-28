import dictionarySorted from './data/dictionarySorted.json';

export default async function handler(req, res) {
  let letters = req.query.letters;

  if (!letters || letters.length < 3) {
    return res.status(400).json({
      message: 'Please provide at least 3 letters',
    });
  }

  if (!/^[a-z]+$/i.test(letters)) {
    return res.status(400).json({
      message: 'Please provide letters only',
    });
  }

  letters = letters.toLowerCase();
  const possibleWords = [];
  const possibleCombos = combine(letters, 3);

  possibleCombos.forEach(combo => {
    if (combo && combo.sort && typeof combo.sort === 'function') {
      const comboString = combo.sort().join('');

      const findInSortedDictionary = dictionarySorted[comboString];
      if (findInSortedDictionary !== undefined) {
        findInSortedDictionary.forEach(word => {
          if (!possibleWords.includes(word)) {
            possibleWords.push(word);
          }
        })
      }
    }
  });

  return res.status(200).json({
    words: possibleWords,
  });
}

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