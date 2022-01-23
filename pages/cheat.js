import { useState } from 'react';
import Head from 'next/head'

import { META_CONTENT } from '../constants';
import styles from '../styles/Cheat.module.scss'

export default function CheatPage() {

  const [inputVal, setInputVal] = useState('');
  const [possibleWords, setPossibleWords] = useState({});

  const handleSubmit = (e) => {
    console.log(inputVal);
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
    <div className={styles.container}>
      <Head>
        <title>{META_CONTENT.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={META_CONTENT.description} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content={META_CONTENT.twitter.handle} key="twhandle" />
        <meta name="twitter:image" content="/preview.png" />
        {/* Open Graph */}
        <meta property="og:url" content={META_CONTENT.url} key="ogurl" />
        <meta property="og:image" content='/preview.png' key="ogimage" />
        <meta property="og:site_name" content={META_CONTENT.title} key="ogsitename" />
        <meta property="og:title" content={META_CONTENT.title} key="ogtitle" />
        <meta property="og:description" content={META_CONTENT.description} key="ogdesc" />

        <link rel="icon" href="/favicon.ico" />
        <link href="/favicon-32x32.png" rel="icon shortcut" sizes="3232" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap" rel="stylesheet" />

        {/* Global site tag (gtag.js) - Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
            `,
        }}
        />
      </Head>

      <main className={styles.main}>
        <h1>Cheat 'em up</h1>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Enter letters to find all possible words</span>
          <div className={styles.inputRow}>
            <input maxLength={12} value={inputVal} onChange={handleChange} className={styles.fieldInput} />
            <img onClick={handleSubmit}  className={styles.submitButton} src={'./arrow-right-circle.svg'} alt="submit" />
          </div>
        </div>
        {Object.keys(possibleWords).length > 0 ? (
          <div className={styles.wordListContainer}>
            <h2>Possible words</h2>
            {Object.keys(possibleWords).map((size) => {
              return (
                <div className={styles.letterSection}>
                  <div className={styles.letterSectionHeader}>
                    <h3>{size} letters</h3> ({possibleWords[size].length} word{possibleWords[size].length > 1 ? 's' : ''})
                  </div>
                  <ul className={styles.wordList}>
                    {possibleWords[size].map((word) => {
                      return <li className={styles.word} key={word}>{word}</li>
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        ) : null}
      </main>

    </div>
  )
}