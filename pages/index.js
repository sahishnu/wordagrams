import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {isMobile} from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from 'react-hot-toast';

import puzzles from '../puzzles.json';
import { GameProvider } from '../context/game-context';
import { Board } from '../components/Board';
import { Header } from '../components/Header';
import { Emojis } from '../constants';

export default function MainGame({ puzzle, emoji }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Anagram Solitaire</title>
        <meta name="description" content="An anagram-solitaire game" />
        <link rel="icon" href="/favicon.ico" />
        <link href="/favicon-32x32.png" rel="icon shortcut" sizes="3232" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <GameProvider puzzle={puzzle}>
        <main className={styles.main}>
          <Header />
          <div className={styles.game}>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                {/* <CustomDragLayer /> */}
                  <Board puzzle={puzzle} />
            </DndProvider>
          </div>
          <Toaster
            containerClassName={styles.toasterContainer}
            toastOptions={{
              duraction: 10000,
              position: 'bottom-center',
              className: styles.toaster,
            }}
          />
          <footer className={styles.footer}>
            Made with <span>{emoji}</span> by Sahishnu
          </footer>
        </main>
      </GameProvider>

    </div>
  )
}

// This function gets called at each page request
export async function getServerSideProps() {
  const puzzle = puzzles[0];

  return {
    props: {
      puzzle,
      emoji: Emojis[Math.floor(Math.random() * (Emojis.length - 1))]
    },
  }
}
