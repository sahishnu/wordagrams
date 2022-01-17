import { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import { InstructionsModal } from '../InstructionsModal';

export const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // if this is users first time on page, show instructions
    const isFirstTime = localStorage.getItem('firstTime') === null;
    if (isFirstTime) {
      setModalIsOpen(true);
      localStorage.setItem('firstTime', 'false');
    }
  }, [])
  return (
    <header className={styles.header}>
      <h1>
        Cool Name Here
      </h1>
      {/*  */}
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
    </header>
  )
}