/**
 * this script takes an existing dictionary at `dictionary.json`
 *
 * and creates a version where each word is sorted
 *
 * {
 *  "aardvark": true,
 * }
 *
 * OUTPUT:
 * {
 *   "aaadkrrv": "aardvark"
 * }
 */
const fs = require('fs');

const rawDictionary = fs.readFileSync('dictionary.json');
const dictionary = JSON.parse(rawDictionary);


const newObj = Object.keys(dictionary).reduce((acc, word) => {
  const key = word.split('').sort().join('');

  acc[key] = word;

  return acc;
}, {})


const jsonContent = JSON.stringify(newObj);

fs.writeFile("dictionarySorted.json", jsonContent, 'utf8', function (err) {
  if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
  }
});

