import Modal from 'react-modal';

import styles from './styles.module.scss';

export const PromptSignInModal = ({ isOpen, startGame, signIn, closeModal }) => {

  const handleSkip = () => {
    closeModal();
    startGame();
  }
  return (
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Prompt Sign In"
        // onRequestClose={onClose}
        ariaHideApp={false}
      >
        <div className={styles.modalContent}>
          <div className={styles.signInSection}>
            <div className={styles.reminderHeader}>Just a quick reminder:</div>
            <div className={styles.reminderText}>To participate in the daily leaderboard, you must sign in.</div>
            <div className={styles.link} onClick={signIn}>Go to sign in page <img alt="login" src='./log-in.svg' /></div>
          </div>
          <div className={styles.skipSection}>
            <div className={styles.skipText}>Or else, you can play for fun without signing in!</div>
            <div onClick={handleSkip} className={styles.skip}>Skip sign in, and start game</div>
            <div className={styles.message}>Sorry for the dark UX pattern 😢</div>
          </div>
        </div>
      </Modal>
  )
}