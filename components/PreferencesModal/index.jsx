import { useEffect } from 'react';
import Modal from 'react-modal';
import Switch from 'react-switch';

import { useGameContext } from '../../context/game-context';
import styles from './styles.module.scss';

export const PerferencesModal = ({ isOpen, onClose }) => {
  const {
    userPreferences,
    changeShowHintButtonPreference,
    changeShowTimerPreference
  } = useGameContext();

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