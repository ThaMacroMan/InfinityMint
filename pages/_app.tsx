import type { AppProps } from 'next/app';
import { MeshProvider } from '@meshsdk/react';
import '../styles/globals.css';

//import { ChakraProvider } from '@chakra-ui/react'



function MyApp({ Component, pageProps }: AppProps) {
  return (
   // <ChakraProvider>
      <MeshProvider>
        <Component {...pageProps} />
      </MeshProvider>
   //</ChakraProvider>

  );
}

export default MyApp;