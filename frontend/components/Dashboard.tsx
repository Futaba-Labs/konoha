import React from "react";
import { Text, Table, Row, Col, Button, User, Image } from "@nextui-org/react";
import Deposit from "./Deposit";

const Dashboard = () => {
  const columns = [
    { name: "CURRENCY", uid: "currency" },
    { name: "POOL", uid: "pool" },
    { name: "APY", uid: "apy" },
    { name: "FARMING", uid: "farming" },
    { name: "APY TRANSITION", uid: "graph" },
    { name: "BUTTON", uid: "button" },
  ];
  const users = [
    {
      id: 1,
      currency: "USDC",
      pool: "1M",
      apy: "8.5 %",
      farming: "https://cryptologos.cc/logos/aave-aave-logo.png?v=023",
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=023",
      graph:
        "https://png.pngtree.com/png-clipart/20220909/original/pngtree-financial-stock-market-graph-on-stock-market-investment-trading-png-image_8502628.png",
    },
    {
      id: 2,
      currency: "DAI",
      pool: "1M",
      apy: "8.5 %",
      farming: "https://cryptologos.cc/logos/aave-aave-logo.png?v=023",
      logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=023",
      graph:
        "https://png.pngtree.com/png-clipart/20220909/original/pngtree-financial-stock-market-graph-on-stock-market-investment-trading-png-image_8502628.png",
    },
    {
      id: 3,
      currency: "USDT",
      pool: "1M",
      apy: "8.5 %",
      farming: "https://cryptologos.cc/logos/aave-aave-logo.png?v=023",
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=023",
      graph:
        "https://png.pngtree.com/png-clipart/20220909/original/pngtree-financial-stock-market-graph-on-stock-market-investment-trading-png-image_8502628.png",
    },
  ];

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "currency":
        return (
          <User squared src={user.logo} name={cellValue} css={{ p: 0 }}></User>
        );
      case "pool":
        return (
          <Col>
            <Row>
              <Text b size={14} css={{ tt: "capitalize" }}>
                {cellValue}
              </Text>
            </Row>
          </Col>
        );

      case "apy":
        return (
          <Col>
            <Row>
              <Text b size={14}>
                {cellValue}
              </Text>
            </Row>
          </Col>
        );

      case "farming":
        return <User squared name="" src={cellValue} css={{ p: 0 }}></User>;
      case "graph":
        return (
          <Col>
            <Row>
              <Image src={cellValue} autoResize={true} width={150} />
            </Row>
          </Col>
        );
      case "button":
        return (
          <Col>
            <Row>
              <Deposit />
            </Row>
          </Col>
        );

      default:
        return cellValue;
    }
  };

  return (
    <React.Fragment>
      <Text h2>Available Assets</Text>
      <Table
        aria-label="Dashboard"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        selectionMode="single"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              hideHeader={column.uid === "button"}
              align={column.uid === "graph" ? "center" : "start"}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={users}>
          {(item) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </React.Fragment>
  );
};

export default Dashboard;
