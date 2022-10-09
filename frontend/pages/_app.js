import '../styles/globals.css';
import {TransactionProvider} from '../context/KonohaTransaction'

import { NextUIProvider,Container, Spacer } from '@nextui-org/react';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps }) {
  return (
    <TransactionProvider>
    <NextUIProvider>
<NavBar/>
      <Container
        as="main"
        //display="flex"
        direction="column"
        //justify="center"
        alignItems="flex-start"
        style={{ height: '100vh' }}
      >
        <Spacer y={1}/>
      <Component {...pageProps} />
      </Container>
    </NextUIProvider>
    </TransactionProvider>
  );
}

export default MyApp;
