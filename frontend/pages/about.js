import React from "react";
import Head from 'next/head';
import { Text, Spacer } from "@nextui-org/react";
import Currencycard from "../components/Currencycard";
import Balancecard from "../components/Balancecard";

const AboutPage = () => {
    return (
        <div>
            <Head>
                <title>About</title>
            </Head>
            <div>
                <Text h2>About</Text>
                <Currencycard/>
            </div>
            <Spacer/>
            <div>
                <Text h2>Withdraw</Text>
                <Balancecard/>
            </div>
        </div>
    )
}

export default AboutPage;