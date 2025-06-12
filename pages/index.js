import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import { Board } from "../components/Board";
import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { SolveCounter } from "../components/SolveCounter";
import { GameProvider } from "../context/game-context";
import { supabase } from "../lib/supabase";
import styles from "../styles/Home.module.scss";
import backupPuzzles from "./api/data/backup-puzzles.json";
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));

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
              position: "bottom-center",
              className: styles.toaster,
              style: {
                background: "#141A32",
                color: "#fff",
                border: "2px solid #2F3763",
              },
            }}
          >
            {(t) => (
              <ToastBar toast={t}>
                {({ icon, message }) => (
                  <div
                    style={{ display: "flex" }}
                    onClick={() => toast.dismiss(t.id)}
                  >
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
  );
}

// This function gets called at each page request
export async function getServerSideProps() {
  const date = dayjs().tz("America/New_York").format("YYYY-MM-DD");
  let puzzle = null;

  try {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .eq("date", date)
      .single();

    if (error) {
      // No puzzle found.
      if (error.code === "PGRST116") {
        // Fallback to a random backup puzzle.
        const randomBackupPuzzle =
          backupPuzzles[Math.floor(Math.random() * backupPuzzles.length)];

        puzzle = {
          date,
          letters: randomBackupPuzzle.letters,
          words: randomBackupPuzzle.words,
        };
      } else {
        console.error("Error fetching puzzle:", error);
      }
    } else {
      puzzle = data;
    }
  } catch (err) {
    console.error("Error:", err);
  }

  return {
    props: {
      puzzle,
    },
  };
}
