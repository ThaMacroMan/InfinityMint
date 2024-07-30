import type { AppProps } from 'next/app';
import { MeshProvider } from '@meshsdk/react';
import Head from 'next/head';
import './styles/globals.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <MeshProvider>
      <Head>
        <link rel="icon" type="image/png"  href= "Catsky LOGO Small.png"/>

      </Head>
      <Component {...pageProps} />
    </MeshProvider>
  );
}

export default MyApp;
