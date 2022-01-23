import Head from 'next/head'
import {isMobile} from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import faunadb from 'faunadb';

import { SolveCounter } from '../components/SolveCounter';
import styles from '../styles/Home.module.scss'
import PUZZLES from '../puzzles.json';
import { GameProvider } from '../context/game-context';
import { Board } from '../components/Board';
import { Header } from '../components/Header';
import { Emojis, META_CONTENT } from '../constants';

export default function MainGame({ puzzle }) {

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
          />
          <footer className={styles.footer}>
            <SolveCounter />
          </footer>
        </main>
      </GameProvider>

    </div>
  )
}

// This function gets called at each page request
export async function getServerSideProps() {
  const date = dayjs().tz("America/New_York").format('YYYY-MM-DD');
  const puzzle = PUZZLES.find(p => p.date === date) || PUZZLES[0];
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
    }

    // Fetch the document for-real
    const document = await client.query(
      q.Get(q.Match(q.Index('puzzle_by_day'), date))
    );

    console.log(document.data);

  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      puzzle,
      emoji: Emojis[Math.floor(Math.random() * (Emojis.length - 1))],
      hits: 0
    },
  }
}
