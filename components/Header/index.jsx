import { useEffect, useState } from 'react';

import { META_CONTENT } from '../../constants';
import styles from './styles.module.scss';
import { InstructionsModal } from '../InstructionsModal';
import { LeaderboardModal } from '../LeaderboardModal';
import { LocalStorage } from '../../utils/LocalStorage';

export const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [leaderBoardIsOpen, setLeaderboardIsOpen] = useState(false);

  useEffect(() => {
    // if this is users first time on page, show instructions
    const isFirstTime = LocalStorage.getItem('firstTime') === null;
    if (isFirstTime) {
      setModalIsOpen(true);
      LocalStorage.setItem('firstTime', 'false');
    }
  }, [])
  return (
    <header className={styles.header}>
      <img
        alt='Leaderboard'
        className={styles.leaderboardIcon}
        onClick={() => setLeaderboardIsOpen(true)}
        src='/award.svg'
      />
      <h1 className={styles.title}>
        {META_CONTENT.title}
        <br />
        <span className={styles.byline}>By Sahishnu</span>
      </h1>
      <img
        alt='How to play'
        className={styles.helpIcon}
        onClick={() => setModalIsOpen(true)}
        src='/help-circle.svg'
      />
      <InstructionsModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
      <LeaderboardModal
        isOpen={leaderBoardIsOpen}
        onClose={() => setLeaderboardIsOpen(false)}
      />
    </header>
  )
}