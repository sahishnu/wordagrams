import { useGameContext } from '../../context/game-context';
import styles from './styles.module.scss';

export const SolveCounter = ({  }) => {
  const { solvedCount } = useGameContext();

  const peopleHave = solvedCount === 1 ? 'person has' : 'people have';
  return (
    <div className={styles.text}>
      So far, {solvedCount} {peopleHave} solved this puzzle
    </div>
  );
}