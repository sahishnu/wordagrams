
import { Button } from '../Button';
import styles from './styles.module.scss';

export function SolvedLabel({ wordsFound, playAgain, isSolved }) {

  return (
    <div className={styles.solvedContainer}>
      {isSolved ? (
        <>
          <h2 className={styles.solvedMessage}>
            You got it, good job! 🎉
          </h2>
          <div className={styles.playAgainSection}>
            {/* <div className={styles.playAgainMessage}>
            Play again to find more words and earn more 🌟
            </div> */}
            <Button color='purple' onClick={playAgain} label={'Play Again'} />
          </div>
        </>
      ) : null}
      <div className={styles.wordsFound}>
        <h3>Words found:</h3>
        <ul>
        {wordsFound.map(word => (<li className={styles.foundWord}>{word}</li>))}
        </ul>
      </div>
    </div>
  )
};
