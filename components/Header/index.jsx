import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './styles.module.scss';

import { Instructions } from '../Instructions';

export const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // if this is users first time on page, show instructions
    const isFirstTime = localStorage.getItem('firstTime') === null;
    if (isFirstTime) {
      localStorage.setItem('firstTime', 'false');
      setModalIsOpen(true);
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
      <Modal
        isOpen={modalIsOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Instructions"
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
      >
        <div className={styles.modalHeader}>
          How to play
        </div>
        <img
          alt='Close instructions modal'
          className={styles.close}
          onClick={() => setModalIsOpen(false)}
          src='/x.svg'
        />
        <Instructions />
        <div className={styles.imageContainer}>
          <img className={styles.instructionImage} src='/instructions.png' alt='screenshot' />
        </div>
        <div className={styles.modalFooter}>Good luck, have fun! 🤓</div>
      </Modal>
    </header>
  )
}