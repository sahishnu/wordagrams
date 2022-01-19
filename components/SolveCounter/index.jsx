import { useGameContext } from '../../context/game-context';
import styles from './styles.module.scss';

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const SolveCounter = ({  }) => {
  const { solvedCount } = useGameContext();

  return (
    <div className={styles.text}>
      So far, {solvedCount} people have solved this puzzle
    </div>
  );
}