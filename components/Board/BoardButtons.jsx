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
  userPreferences
}) => {

  switch (state) {
    case GAME_STATES.NOT_STARTED:
      return (
        <div className={styles.buttonRow}>
          <Button disabled={disableButtons} label="Start Game" color="green" onClick={startGame} />
        </div>
      );
    case GAME_STATES.SOLVED:
      return '';
    case GAME_STATES.IN_PROGRESS:
      return (
        <div className={styles.buttonRow}>
          <Button label={<img src='/shuffle.svg' />} color='orange' onClick={shuffleBoard} />
          <Button label="Submit" onClick={checkBoardSolution} />
          {
            userPreferences.showHintButton ? (
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