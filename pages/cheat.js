import { useState } from 'react';

import { WordsList } from '../components/WordsList';
import { Layout } from '../components/Layout';
import styles from '../styles/Cheat.module.scss'

export default function CheatPage() {

  const [inputVal, setInputVal] = useState('');
  const [possibleWords, setPossibleWords] = useState({});

  const handleSubmit = (e) => {
    fetch(`/api/possible-words?letters=${inputVal}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.words) {
          const byLetterCount = data.words.reduce((acc, word) => {
            const size = word.length;
            if (!acc[size]) {
              acc[size] = [word];
            } else {
              acc[size].push(word);
            }
            return acc;
          }, {});
          setPossibleWords(byLetterCount);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  }

  const handleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z]/g, '');
    setInputVal(value);
  }

  return (
    <Layout>
      <main className={styles.main}>
        <h1>Cheat 'em up</h1>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Enter letters to find all possible words</span>
          <div className={styles.inputRow}>
            <input maxLength={12} value={inputVal} onChange={handleChange} className={styles.fieldInput} />
            <img onClick={handleSubmit}  className={styles.submitButton} src={'./arrow-right-circle.svg'} alt="submit" />
          </div>
        </div>
        <WordsList words={possibleWords} letters={inputVal} />
      </main>

    </Layout>
  )
}