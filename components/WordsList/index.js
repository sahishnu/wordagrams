import { useState} from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

export const WordsList = ({ words }) => {

  const [highlightedWords, setHighlightedWords] = useState({});

  const handleClickWord = (word) => {
    const isHighlighted = highlightedWords[word];
    setHighlightedWords({
      ...highlightedWords,
      [word]: !isHighlighted
    });
  }

  return Object.keys(words).length > 0 ? (
    <div className={styles.wordListContainer}>
      <h2>Possible words</h2>
      {Object.keys(words).map((size) => {
        return (
          <div key={`${size}-size-words`} className={styles.letterSection}>
            <div className={styles.letterSectionHeader}>
              <h3>{size} letters</h3> ({words[size].length} word{words[size].length > 1 ? 's' : ''})
            </div>
            <ul className={styles.wordList}>
              {words[size].map((word) => {
                return (
                  <li
                    onClick={() => handleClickWord(word)}
                    className={classnames(styles.word, { [styles.highlighted]: !!highlightedWords[word] })}
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