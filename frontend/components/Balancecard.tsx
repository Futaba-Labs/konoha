import React from "react";
import { Card, Text, Button, Avatar, Table, Col, Row, User } from "@nextui-org/react";

const Balancecard = () => {
    const columns = [
        {
          uid: "bank",
          name: "Bank",
        },
        {
          uid: "deposit",
          name: "Deposit",
        },
        {
          uid: "earned",
          name: "Earned",
        },
      ];
      const rows = [
        {
          key: "1",
          bank: "USDC",
          deposit: "1000",
          earned: "200",
          logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=023",
        },
        {
          key: "2",
          bank: "DAI",
          deposit: "1000",
          earned: "200",
          logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=023",
        },
        {
          key: "3",
          bank: "USDT",
          deposit: "1000",
          earned: "200",
          logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=023",
        },
      ];

      const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
          case "bank":
            return (
              <User squared src={user.logo} name={cellValue} css={{ p: 0 }}>
                
              </User>
            );
          case "deposit":
            return (
              <Col>
                <Row>
                  <Text b size={14} css={{ tt: "capitalize" }}>
                    $ {cellValue}
                  </Text>
                </Row>
              </Col>
            );
    
          case "earned":
            return(
              <Col>
                <Row>
                    <Text b size={14}>
                        + $ {cellValue}
                    </Text>
                </Row>
              </Col>
            )

            default:
            return cellValue;
        }
      };      

      return (
        <Card css={{ mw: "350px" }}>
            <Card.Header>
                <Text h3 >You Deposited</Text>
            </Card.Header>
            <Card.Body>
                <Table
                aria-label="Example table with dynamic content"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
                >
                <Table.Header columns={columns}>
                    {(column) => (
                    <Table.Column key={column.uid}>{column.name}</Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={rows}>
                    {(item) => (
                    <Table.Row key={item.key}>
                        {(columnKey) => <Table.Cell>{renderCell(item,columnKey)}</Table.Cell>}
                    </Table.Row>
                    )}
                </Table.Body>
                </Table>
            </Card.Body>
        </Card>
    )
}

export default Balancecard;