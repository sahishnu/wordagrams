import { useState, useEffect } from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

export const WordsList = ({ words, letters }) => {

  const [highlightedWords, setHighlightedWords] = useState({});
  const [highlightedLetters, setHighlightedLetters] = useState([]);

  useEffect(() => {
    const init = letters.split('').map((letter, i) => {
      return {
        letter,
        key: `${i}-${letter}`,
        highlighted: false
      }
    })
    setHighlightedLetters(init);
  }, [letters])

  const handleClickWord = (word) => {
    const isHighlighted = highlightedWords[word];
    setHighlightedWords({
      ...highlightedWords,
      [word]: !isHighlighted
    });
  }

  const handleClearImpLetters = () => {
    setHighlightedLetters(
      highlightedLetters.map(letter => ({ ...letter, highlighted: false }))
    )
  }

  const handleClickLetter = (key) => {
    const [i, letter] = key.split('-');
    if (highlightedLetters[i]) {
      const highlighted = highlightedLetters[i].highlighted;
      const newHighlightedLetters = [...highlightedLetters];
      newHighlightedLetters[i].highlighted = !highlighted;
      setHighlightedLetters(newHighlightedLetters)
    }
  }

  const doesWordHaveLetters = (word, impLetters) => {
    if (impLetters.length === 0) {
      return false;
    }
    const wordSplit = word.toUpperCase().split('');
    const ans = impLetters.every((letter) => {
      const inWord = wordSplit.includes(letter);
      if (inWord) {
        wordSplit.splice(wordSplit.indexOf(letter), 1);
        return true;
      }
      return false;
    });
    return ans;
  }

  return Object.keys(words).length > 0 ? (
    <div className={styles.wordListContainer}>
      <h2>Possible words</h2>
      <div className={styles.importantLettersContainer}>
        <div className={styles.importantLettersRow}>
          {highlightedLetters.map(letterObj => {
          const { letter, highlighted, key } = letterObj;
          return (
            <span
              key={key}
              onClick={() => handleClickLetter(key)}
              className={classnames(styles.displayLetter, { [styles.highlighted]: highlighted })}
            >
              {letter}
            </span>
            )
          })}
          {highlightedLetters.filter(letterObj => letterObj.highlighted).length > 0 ? (
            <img onClick={handleClearImpLetters} src='/x-circle-thick.svg' />
          ) : null}
        </div>
      </div>
      {Object.keys(words).map((size) => {
        let impLetters = highlightedLetters
          .filter(letterObj => letterObj.highlighted)
          .map(letterObj => letterObj.letter.toUpperCase())
        return (
          <div key={`${size}-size-words`} className={styles.letterSection}>
            <div className={styles.letterSectionHeader}>
              <h3>{size} letters</h3> ({words[size].length} word{words[size].length > 1 ? 's' : ''})
            </div>
            <ul className={styles.wordList}>
              {words[size].map((word) => {
                const hasLetters = doesWordHaveLetters(word, impLetters);
                return (
                  <li
                    // onClick={() => handleClickWord(word)}
                    // className={classnames(styles.word, { [styles.highlighted]: !!highlightedWords[word] })}
                    className={classnames(styles.word, { [styles.highlighted]: hasLetters })}
                    key={word}
                  >
                    {word}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  ) : null;
}