import type { AppProps } from 'next/app';
import { MeshProvider } from '@meshsdk/react';
import Head from 'next/head';
import './styles/globals.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Head>
        <link rel="icon" type="image/png"  href= "/favicon.png"/>

        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />


      </Head>
      <Component {...pageProps} />
    </MeshProvider>
  );
}

export default MyApp;
