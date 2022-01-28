import { useSession, signIn, signOut } from "next-auth/react";
import Modal from 'react-modal';
import Switch from 'react-switch';
import classnames from "classnames";

import { useGameContext } from '../../context/game-context';
import styles from './styles.module.scss';

export const PerferencesModal = ({ isOpen, onClose }) => {
  const {
    userPreferences,
    changeShowHintButtonPreference,
    changeShowTimerPreference
  } = useGameContext();
  const { data: session } = useSession();
  return (
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Preferences"
        onRequestClose={onClose}
        ariaHideApp={false}
      >
        <div className={styles.modalContent}>
          <header className={styles.modalHeader}>
            Settings
          </header>
          <img
            alt='Close preferences modal'
            className={styles.close}
            onClick={onClose}
            src='/x.svg'
          />
          <div className={styles.settings}>
            <ul>
              <li className={classnames(styles.settingRow, styles.loginRow, { [styles.notSignedIn]: !session })}>
                {session ? (
                  <>
                    <div className={styles.loginLeft}>
                      Signed in as:
                    </div>
                    <div className={styles.loginRight}>
                      <div className={styles.email} onClick={() => signOut()}>
                        {session.user.email}
                      </div>
                      <div className={styles.subInstruction}>Click to sign out</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.loginLeft}>
                      Sign in with Google
                      <div className={styles.subInstruction}>
                        'Fastest Time' only submitted if signed in
                      </div>
                    </div>
                    <div className={styles.loginRight}>
                      <img className={styles.loginIcon} alt='Sign in' src="./log-in.svg" onClick={() => signIn()} />
                    </div>
                  </>
                )}
              </li>
              <li className={styles.settingRow}>
                Show timer above board
                <Switch
                  checked={userPreferences.showTimer}
                  onChange={(val) => changeShowTimerPreference(val)}
                />
              </li>
              <li className={styles.settingRow}>
                Show hint button
                <Switch
                  checked={userPreferences.showHintButton}
                  onChange={(val) => changeShowHintButtonPreference(val)}
                />
              </li>
              <li className={styles.settingRow}>
                Feedback / Bugs
                <span>
                  <a
                    target={'_blank'}
                    href="mailto: sahishnupatel+crossem@gmail.com?subject=Feedback"
                  >
                    Email
                  </a> / <a
                  href="https://twitter.com/intent/tweet?screen_name=sahishnuk"
                  target="blank"
                  title="@sahishnuk">
                    Twitter
                  </a>
                </span>
              </li>
            </ul>
          </div>
          <div className={styles.modalFooter}>
            <div className={styles.message}>Good luck, have fun! 🤓</div>
            {/* <div className={styles.feedback}>Hope your're having fun! 💜</div> */}
          </div>
        </div>
      </Modal>
  )
}