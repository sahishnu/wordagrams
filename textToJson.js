/**
 * script written by: Sahishnu
 * Date: 2022, Jan 13
 * Collected MacOS word list from /usr/share/dict/words
 * Removed all 'misspelled' words using `aspell`:
 *    $ comm -23 in.txt <(aspell list < in.txt) > out.txt
 * Then ran this script against the remaining words
 */
const fs = require('fs');

const allFileContents = fs.readFileSync('dictionary.txt', 'utf-8');
const words = [];
allFileContents.split(/\r?\n/).forEach(line =>  {
  words.push(line);
});

const jsonContent = JSON.stringify(words);

fs.writeFile("dictionary.json", jsonContent, 'utf8', function (err) {
  if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
  }
});
