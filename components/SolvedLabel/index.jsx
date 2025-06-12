import { handleShare } from '../../utils/share';
import { Button } from '../Button';
import styles from './styles.module.scss';

export function SolvedLabel({ wordsFound, playAgain, isSolved, board, timeTaken }) {

  return (
    <div className={styles.solvedContainer}>
      {isSolved ? (
        <>
          <h2 className={styles.solvedMessage}>
            You got it, good job! 🎉
          </h2>
          <div className={styles.playAgainSection}>
            <Button color='purple' onClick={playAgain} label={'Play Again'} />
            <Button color='green' onClick={() => handleShare(board, timeTaken)} label={<img alt='Share' src='/share.svg' />} />
          </div>
        </>
      ) : null}
      <div className={styles.wordsFound}>
        <h3>Words found:</h3>
        <ul>
        {wordsFound.map(word => (<li className={styles.foundWord} key={word}>{word}</li>))}
        </ul>
      </div>
    </div>
  )
};
