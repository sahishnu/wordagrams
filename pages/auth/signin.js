import { getProviders, signIn, getSession } from "next-auth/react"

import { META_CONTENT } from '../../constants';
import styles from '../../styles/SignIn.module.scss';

export default function SignIn({ providers }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header>
          <h1>{META_CONTENT.title}</h1>
        </header>
        <div className={styles.board}>
          {Object.values(providers).map((provider) => (
            <button className={styles.signInButton} key={provider.name} onClick={() => signIn(provider.id)}>
              {provider.id === 'google' ? <img className={styles.providerLogo} src='../google-logo.svg' /> : null}
              Sign in with {provider.name}
            </button>
          ))}
          <footer>Signing in gives you the ability to count your score towards the ‘Fastest Time’ and Leaderboard. </footer>
        </div>
      </main>
    </div>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  const providers = await getProviders()
  return {
    props: { providers },
  }
}
