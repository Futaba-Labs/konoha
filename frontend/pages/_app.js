import '../styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import {TransactionProvider} from '../context/KonohaTransaction'


function MyApp({ Component, pageProps }) {
  return (
    <TransactionProvider>
    <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
    </TransactionProvider>

  );
}

export default MyApp;
