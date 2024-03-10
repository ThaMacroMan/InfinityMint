import type { AppProps } from 'next/app';
import { MeshProvider } from '@meshsdk/react';
import Head from 'next/head';
import './styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />


      </Head>
      <Component {...pageProps} />
    </MeshProvider>
  );
}

export default MyApp;
