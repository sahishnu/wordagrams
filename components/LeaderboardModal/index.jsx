import Modal from 'react-modal';
import { useSession, signIn } from "next-auth/react";
import classnames from 'classnames';

import { getTimeDisplay } from '../TimeTaken';
import { useGameContext } from '../../context/game-context';

import styles from './styles.module.scss';

export const LeaderboardModal = ({ isOpen, onClose }) => {
  const {
    leaderBoard
  } = useGameContext();
  const { data: session } = useSession();

  let isUserInLeaderboard = leaderBoard.some(({ isUser }) => isUser);

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
            {
              session ? (
                <div style={{ opacity: 0.5 }}>
                  You are signed in as {session.user.email}
                </div>
              ) : (
                <div>
                  You must be signed in to participate in the daily leaderboard.
                  <br />
                  <div className={styles.signInLink} onClick={signIn}>Sign in with Google now</div>
                </div>
              )
            }
          </div>
        </div>
      </Modal>
  )
}

const getLeaderboardName = (name) => {
  const [firstName, lastName] = name.split(' ');
  return `${firstName.substring(0, 4)} ${lastName.substring(0, 1)}.`;
}