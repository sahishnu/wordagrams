import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Head from "next/head";
import { META_CONTENT } from "../constants";

// root component
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{META_CONTENT.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta
          name="twitter:creator"
          content={META_CONTENT.twitter.handle}
          key="twhandle"
        />
        <meta name="twitter:image" content="/preview.png" />

        {/* Open Graph */}
        <meta property="og:url" content={META_CONTENT.url} key="ogurl" />
        <meta property="og:image" content="/preview.png" key="ogimage" />
        <meta
          property="og:site_name"
          content={META_CONTENT.title}
          key="ogsitename"
        />
        <meta property="og:title" content={META_CONTENT.title} key="ogtitle" />
        <meta
          property="og:description"
          content={META_CONTENT.description}
          key="ogdesc"
        />

        {/* Favicon */}
        <link href="/favicon-32x32.png" rel="icon shortcut" sizes="32x32" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />

        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
            `,
          }}
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
