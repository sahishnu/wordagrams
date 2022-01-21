import { useState } from 'react';
import Modal from 'react-modal';
import classnames from 'classnames';

import { LocalStorage } from '../../utils/LocalStorage';
import { getTimeDisplay } from '../TimeTaken';
import styles from './styles.module.scss';

const usernameMaxLength = 6;

export const LeaderboardModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const leaderboard = [
    {
      name: 'Sahishnu',
      time: 35,
    },
    {
      name: 'Ashish',
      time: 46
    },
    {
      name: 'Sarz',
      time: 52
    },
    {
      name: 'AJ',
      time: 56
    },
    {
      name: 'Shreyas',
      time: 158
    },
    {
      name: 'Pushpk',
      time: 201
    },
  ]

  const handleType = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z]/g, '');
    setUsername(value);
  }

  const handleSubmitUsername = () => {
    LocalStorage.setItem('username', username);
  }

  return (
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Leaderboard"
        onRequestClose={onClose}
        ariaHideApp={false}
      >
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
          <ol>
            {leaderboard.map((leader, index) => {
              return (
                <li className={styles.row} key={index}>
                  <span className={styles.name}>{leader.name}</span>
                  <span className={styles.time}>{getTimeDisplay(leader.time)}</span>
                </li>
              )
            })}
          </ol>
        </div>
        <div className={styles.modalFooter}>
          <div className={styles.userNameField}>
            <div className={styles.inputLabel}>Set your username</div>
            <div className={styles.inputRow}>
              <input
                onChange={handleType}
                value={username}
                maxLength={usernameMaxLength}
                className={styles.input}
              />
              <img
                alt='Submit username'
                onClick={handleSubmitUsername}
                disabled={username.length < 3}
                className={classnames({
                  [styles.submitArrow]: true,
                  [styles.disabled]: username.length < 3,
                })}
                src='/arrow-right-circle.svg'
              />
            </div>
            <div className={styles.fieldMessage}>{usernameMaxLength} letters only. No weird stuff!</div>
          </div>
        </div>
      </Modal>
  )
}

const isKeyAllowed = (e) => {
  return allowedKeys.includes(e.key);
}

const allowedKeys = 'abcdefghijklmnopqrstuvwxyz';