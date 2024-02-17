import type { AppProps } from 'next/app';
import { MeshProvider } from '@meshsdk/react';
import './styles/globals.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>

        <Component {...pageProps} />

    </MeshProvider>
  );
}

export default MyApp;
