import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {
  Container,
  Button,
  Input,
  Spacer,
  Text,
  Link
} from '@nextui-org/react';
import Dashboard from '../components/Dashboard';


export default function Home() {
  return (
    <div >
      <Head>
        <title>Home</title>
        <meta
          name="description"
          content="Home"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Dashboard/>
    </div>
  );
}
