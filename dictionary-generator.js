/**
 * script written by: Sahishnu
 * Date: 2022, Jan 13
 * Collected MacOS word list from /usr/share/dict/words
 * Removed all 'misspelled' words using `aspell`:
 *    $ comm -23 in.txt <(aspell list < in.txt) > out.txt
 * Then ran this script against the remaining words
 */
const fs = require('fs');

const allFileContents = fs.readFileSync('in.txt', 'utf-8');
const keptWords = [];
allFileContents.split(/\r?\n/).forEach(line =>  {
  /**
   * 1. word should not have the letter: Q
   * 2. word should be at least 3 characters long
   * 3. word should be at most 10 characters long
   * 4. words should not be proper nouns (start with a capital letter)
   */
  if (line.length < 3 || line.length > 10 || line.includes('q') || line.at(0).toUpperCase() === line.at(0)) {
    // skip this word
  } else {
    keptWords.push(line);
  }
  // console.log(`Line from file: ${line}`);
});

const keepFile = fs.createWriteStream('out.txt');
keptWords.forEach(function(v) { keepFile.write(v + '\n'); });
keepFile.end();
console.log('Done!')