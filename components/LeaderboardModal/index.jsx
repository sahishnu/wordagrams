import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import Modal from 'react-modal';
import { useSession, signIn } from "next-auth/react";
import classnames from 'classnames';
import CountDown from 'react-countdown';

import { getTimeDisplay } from '../TimeTaken';
import { Button } from '../Button';
import { useGameContext } from '../../context/game-context';
import { getShareString } from '../../utils/share';

import styles from './styles.module.scss';
import { GAME_STATES } from '../../constants';

export const LeaderboardModal = ({ isOpen, onClose }) => {
  const {
    leaderBoard,
    gameState,
  } = useGameContext();
  const { data: session } = useSession();
  const {
    state,
    timeTaken
  } = gameState;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: getShareString(board, timeTaken)
      })
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(getShareString(board, timeTaken))
        .then(() => {
          toast.success('Copied to clipboard');
        });
      }
    }
  }

  let isUserInLeaderboard = leaderBoard.some(({ isUser }) => isUser);
  // gets time till midnight
  const today = dayjs().tz("America/New_York");
  const midnight = today.add(1, 'day').startOf('day');

  return (
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Leaderboard"
        onRequestClose={onClose}
        ariaHideApp={false}
      >
        <div className={styles.modalContent}>
          <header className={styles.modalHeader}>
            Daily Leaderboard
          </header>
          <img
            alt='Close leaderboard modal'
            className={styles.close}
            onClick={onClose}
            src='/x.svg'
          />
          <div className={styles.instructions}>
            {
              leaderBoard.length > 0 ? (
                <ol>
                  {leaderBoard.map((leader, index) => {
                    return (
                      <li className={classnames(styles.row, {[styles.highlight]: leader.isUser})} key={index}>
                        <span className={styles.name}>{getLeaderboardName(leader.user)}{leader.isUser ? ' 🎉' : null}</span>
                        <span className={styles.time}>{getTimeDisplay(leader.timeTaken)}</span>
                      </li>
                    )
                  })}
                  {
                    (leaderBoard.length < 10 && !isUserInLeaderboard) ? (
                      <p className={styles.emptyMessage}>
                        Your name could be here!
                      </p>
                    ) : null
                  }
                </ol>
              ) : (
                <p className={styles.emptyMessage}>
                  No one has made it to the leaderboard today.
                  {session ? null : 'Sign in and be the first one!'}
                </p>
              )
            }

          </div>
          <div className={styles.modalFooter}>
            {(state === GAME_STATES.SOLVED || state === GAME_STATES.PLAY_AGAIN) ? (
              <>
                {!isUserInLeaderboard ? <div className={styles.yourTime}>Your time: {getTimeDisplay(timeTaken)}</div> : null}
                <div className={styles.nextAndShare}>
                  <div className={styles.nextPuzzleSection}>
                    Next puzzle
                    <CountDown
                      date={midnight.valueOf()}
                      zeroPadTime={2}
                      renderer={props => (<div
                        className={styles.countdown}>
                        {props.hours}h {props.minutes}m {props.seconds}s
                      </div>)}
                    />
                  </div>
                    <Button color='green' onClick={handleShare} label={<img src='/share.svg' />} />
                </div>
              </>
            ) : null }
            <div style={{ opacity: 0.5 }}>
              { session ? `You are signed in as ${session.user.email}` : 'Sign in to participate in the daily leaderboard.'}
            </div>
          </div>
        </div>
      </Modal>
  )
}

const getLeaderboardName = (name) => {
  const [firstName, lastName] = name.split(' ');
  return `${firstName.substring(0, 10)} ${lastName.substring(0, 1)}.`;
}