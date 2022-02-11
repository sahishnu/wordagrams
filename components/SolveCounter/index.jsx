import { useSession, signIn } from "next-auth/react";
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import CountDown from 'react-countdown';

import { useGameContext } from '../../context/game-context';
import { getTimeDisplay } from '../TimeTaken';
import styles from './styles.module.scss';
import { GAME_STATES } from "../../constants";

export const SolveCounter = ({  }) => {
  const { solvedCount, gameInitialized, leaderBoard, gameState } = useGameContext();
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

  // gets time till midnight
  const today = dayjs().tz("America/New_York");
  const midnight = today.add(1, 'day').startOf('day');

  const Countdown = () => (
    <CountDown
      date={midnight.valueOf()}
      zeroPadTime={2}
      renderer={props => (<div
        className={styles.countdown}>
        {props.hours}h {props.minutes}m {props.seconds}s
      </div>)}
    />);
  const NextPuzzleRow = () => {
    if (gameState.state === GAME_STATES.SOLVED || gameState.state === GAME_STATES.PLAY_AGAIN) {
      return (
        <div className={styles.nextPuzzleRow}>
          Next puzzle in {Countdown()}.
        </div>
      )
    }

    return null;
  }

  return (
    <div className={styles.text}>
      {
        session ? (
          <>
            <NextPuzzleRow />
            <StatsRow />
            <AuthRow />
          </>
        ) : (
          <>
            <AuthRow />
            <NextPuzzleRow />
            <StatsRow />
          </>
        )
      }
    </div>
  );
}