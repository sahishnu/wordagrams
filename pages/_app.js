import { GameProvider } from '../context/game-context';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  )
}

export default MyApp
