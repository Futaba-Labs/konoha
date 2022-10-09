import '../styles/globals.css';
import { NextUIProvider,Container, Spacer } from '@nextui-org/react';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps }) {
  return (
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
  );
}

export default MyApp;
