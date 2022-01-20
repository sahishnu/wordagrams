import { useGameContext } from '../../context/game-context';
import { getTimeDisplay } from '../TimeTaken';
import styles from './styles.module.scss';

export const SolveCounter = ({  }) => {
  const { solvedCount, fastestTime, gameInitialized } = useGameContext();

  if (!gameInitialized) {
    return (
    <div className={styles.text}>
      Loading game...
    </div>
    )
  };

  const peopleHave = solvedCount === 1 ? 'person has' : 'people have';
  return (
    <div className={styles.text}>
      {solvedCount} {peopleHave} solved todays puzzle.
      {
        (fastestTime && fastestTime > 0) ? ` Fastest: ${getTimeDisplay(fastestTime)}` : null
      }
    </div>
  );
}