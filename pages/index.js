import {isMobile} from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import faunadb from 'faunadb';

import styles from '../styles/Home.module.scss'
import { SolveCounter } from '../components/SolveCounter';
import { GameProvider } from '../context/game-context';
import { Board } from '../components/Board';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';

import backupPuzzles from './api/data/backup-puzzles.json';

export default function MainGame({ puzzle }) {

  return (
    <Layout>
        <GameProvider puzzle={puzzle}>
          <main className={styles.main}>
            <Header />
            <div className={styles.game}>
              <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                    <Board puzzle={puzzle} />
              </DndProvider>
            </div>
            <Toaster
              containerClassName={styles.toasterContainer}
              toastOptions={{
                // duration: 100000,
                position: 'bottom-center',
                className: styles.toaster,
                style: {
                  background: '#141A32',
                  color: '#fff',
                  border: '2px solid #2F3763'
                },
              }}
            >
              {(t) => (
                <ToastBar toast={t}>
                  {({ icon, message }) => (
                    <div style={{ display: 'flex' }} onClick={() => toast.dismiss(t.id)}>
                      {icon}
                      {message}
                    </div>
                  )}
                </ToastBar>
              )}
            </Toaster>
            <footer className={styles.footer}>
              <SolveCounter />
            </footer>
          </main>
        </GameProvider>
    </Layout>
  )
}

// This function gets called at each page request
export async function getServerSideProps() {
  const date = dayjs().tz("America/New_York").format('YYYY-MM-DD');
  // let puzzle = PUZZLES.find(p => p.date === date) || PUZZLES[0];
  let puzzle = null;
  try {
    const q = faunadb.query;
    const client = new faunadb.Client({
      secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
      domain: 'db.us.fauna.com',
    });

    const doesDocExist = await client.query(
      q.Exists(q.Match(q.Index('puzzle_by_day'), date))
    );
    if (!doesDocExist) {
      // handle is no puzzle exists for today
      // maybe fallback to a random puzzle?
      const randomBackupPuzzle = backupPuzzles[Math.floor(Math.random()*backupPuzzles.length)];
      const fallback = {
        date,
        letters: randomBackupPuzzle.letters,
        words: randomBackupPuzzle.words
      }

      return {
        props: {
          puzzle: fallback,
        },
      }
    }

    // Fetch the document for-real
    const document = await client.query(
      q.Get(q.Match(q.Index('puzzle_by_day'), date))
    );

    puzzle = document.data

  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      puzzle,
    },
  }
}
