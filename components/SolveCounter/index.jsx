import { useSession, signIn } from "next-auth/react";

import { useGameContext } from '../../context/game-context';
import { getTimeDisplay } from '../TimeTaken';
import styles from './styles.module.scss';

export const SolveCounter = ({  }) => {
  const { solvedCount, gameInitialized, leaderBoard } = useGameContext();
  const { data: session } = useSession();

  if (!gameInitialized) {
    return (
    <div className={styles.text}>
      Loading game...
    </div>
    )
  };

  const fastestTime = leaderBoard.length > 0 ? leaderBoard[0].timeTaken : 0;
  const peopleHave = solvedCount === 1 ? 'person has' : 'people have';

  const AuthRow = () => {
    return (
      <div className={styles.authRow}>
        {
          session ? (
            <div className={styles.signedIn}>
              Signed in as {session.user.email}
            </div>
          ) : (
            <div onClick={signIn} className={styles.notSignedIn}>
              Click here to sign in.
            </div>
          )
        }
      </div>
    )
  }

  const StatsRow = () => {
    return (
      <div className={styles.statsRow}>
        {solvedCount} {peopleHave} solved todays puzzle.
        {
          (fastestTime && fastestTime > 0) ? ` Fastest: ${getTimeDisplay(fastestTime)}` : null
        }
      </div>
    )
  }

  return (
    <div className={styles.text}>
      {
        session ? (
          <>
            <StatsRow />
            <AuthRow />
          </>
        ) : (
          <>
            <AuthRow />
            <StatsRow />
          </>
        )
      }
    </div>
  );
}