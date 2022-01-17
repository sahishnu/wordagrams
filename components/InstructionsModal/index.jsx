import { useEffect } from 'react';
import Modal from 'react-modal';

import styles from './styles.module.scss';

export const InstructionsModal = ({ isOpen, onClose }) => {

  return (
      <Modal
        isOpen={isOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Instructions"
        onRequestClose={onClose}
        ariaHideApp={false}
      >
        <header className={styles.modalHeader}>
          How to play
        </header>
        <img
          alt='Close instructions modal'
          className={styles.close}
          onClick={onClose}
          src='/x.svg'
        />
        <div className={styles.instructions}>
          <ol>
            <li>Arrange the letters on the board to form words.</li>
            <li>Each word must be at least 3 letters.</li>
            <li>The words must connect.</li>
            <li>All the letters must be used!</li>
          </ol>
          <div className={styles.imageContainer}>
            <img className={styles.instructionImage} src='/instructions.png' alt='screenshot' />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <div className={styles.message}>Good luck, have fun! 🤓</div>
          {/* <div className={styles.feedback}>Email me with feedback & bugs 🐛</div> */}
        </div>
      </Modal>
  )
}