import { MIN_TIME_FIRST_HINT, GAME_STATES } from '../../constants';
import { Button } from '../Button';
import styles from './styles.module.scss';

export const BoardButtons = ({
  shuffleBoard,
  checkBoardSolution,
  timeTaken,
  startGame,
  showHint,
  state,
  disableButtons,
  userPreferences,
  puzzle
}) => {

  switch (state) {
    case GAME_STATES.NOT_STARTED:
      return (
        <div className={styles.buttonRow}>
          <Button disabled={disableButtons} label="Start Game" color="green" onClick={startGame} />
        </div>
      );
      case GAME_STATES.PLAY_AGAIN:
      // this is the case where the user has solved the puzzle and wants to play again
      // dont display hint button since the puzzle is solved
      return (
        <div className={styles.buttonRow}>
          <Button label={<img src='/shuffle.svg' />} color='orange' onClick={shuffleBoard} />
          <Button label="Submit" onClick={checkBoardSolution} />
        </div>
      )
    case GAME_STATES.SOLVED:
      return null;
    case GAME_STATES.IN_PROGRESS:
      return (
        <div className={styles.buttonRow}>
          <Button label={<img src='/shuffle.svg' />} color='orange' onClick={shuffleBoard} />
          <Button label="Submit" onClick={checkBoardSolution} />
          {
            (userPreferences.showHintButton && puzzle.words?.length) ? (
              <Button
                disabled={timeTaken < MIN_TIME_FIRST_HINT}
                narrow
                label={<img src='/hint.svg' />}
                color='green'
                onClick={showHint}
              />
            ) : null}
        </div>
      );
    default:
      return '';
  }
}