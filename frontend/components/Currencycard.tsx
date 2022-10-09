import React, {useState} from "react";
import { Card, Text, Button, Avatar } from "@nextui-org/react";

const Currencycard = () => {
    const [currencyId, SetCurrencyId] = useState(0)
    const currencies = [
        {
            id: "1",
            name: "USDC",
            src: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=023",
            apy: "8.5 %",
            pool: "2M"
        },
        {
            id: "2",
            name: "DAI",
            src: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=023",
            apy: "9.5 %",
            pool: "1.5M"
        },
        {
            id: "3",
            name: "USDT",
            src: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=023",
            apy: "10.0 %",
            pool: "1M"
        }   
    ]
    const currentCurrency = currencies[currencyId]
    return (
        <Card css={{ mw: "350px" }}>
            <Card.Header >
                <Button.Group color="gradient" ghost>
                    <Button onPress={() => {SetCurrencyId(0)}}>USDC</Button>
                    <Button onPress={() => {SetCurrencyId(1)}}>DAI</Button>
                    <Button onPress={() => {SetCurrencyId(2)}}>USDT</Button>
                </Button.Group>
            </Card.Header>
            <Card.Body css={{alignItems: "center"}}>
                <Avatar src={currentCurrency.src} size="xl"/>
                <Text h2>
                    {currentCurrency.name}
                </Text>
                <Text>
                    APY : {currentCurrency.apy}
                </Text>
                <Text>
                    Pool : {currentCurrency.pool}
                </Text>
            </Card.Body>
        </Card>
    )   
}

export default Currencycard;