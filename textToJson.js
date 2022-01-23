/**
 * script written by: Sahishnu
 * Date: 2022, Jan 13
 * Converts a text file to JSON
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
