import React from "react";
import { Text, Table, Row, Col, Tooltip, User  } from "@nextui-org/react";

const Dashboard = () => {
    const columns = [
        { name: "CURRENCY", uid: "currency" },
        { name: "ROLE", uid: "role" },
        { name: "STATUS", uid: "status" },
        { name: "ACTIONS", uid: "actions" },
      ];
      const users = [
        {
          id: 1,
          currency: "USDC",
          role: "CEO",
          team: "Management",
          status: "active",
          age: "29",
          avatar: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=023",
          email: "tony.reichert@example.com",
        },
        {
          id: 2,
          currency: "DAI",
          role: "Technical Lead",
          team: "Development",
          status: "paused",
          age: "25",
          avatar: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=023",
          email: "zoey.lang@example.com",
        },
        {
          id: 3,
          currency: "USDT",
          role: "Senior Developer",
          team: "Development",
          status: "active",
          age: "22",
          avatar: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=023",
          email: "jane.fisher@example.com",
        },
      ];
    
      const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
          case "currency":
            return (
              <User squared src={user.avatar} name={cellValue} css={{ p: 0 }}>
                
              </User>
            );
          case "role":
            return (
              <Col>
                <Row>
                  <Text b size={14} css={{ tt: "capitalize" }}>
                    {cellValue}
                  </Text>
                </Row>
                <Row>
                  <Text b size={13} css={{ tt: "capitalize", color: "$accents7" }}>
                    {user.team}
                  </Text>
                </Row>
              </Col>
            );
    //      case "status":
    //        return <StyledBadge type={user.status}>{cellValue}</StyledBadge>;
    
          case "actions":
            return (
              <Row justify="center" align="center">
                <Col css={{ d: "flex" }}>
                  <Tooltip content="Details">
                  </Tooltip>
                </Col>
                <Col css={{ d: "flex" }}>
                  <Tooltip content="Edit user">
                  </Tooltip>
                </Col>
                <Col css={{ d: "flex" }}>
                  <Tooltip
                    content="Delete user"
                    color="error"
                    onClick={() => console.log("Delete user", user.id)}
                  >
                  </Tooltip>
                </Col>
              </Row>
            );
          default:
            return cellValue;
        }
      };
    
    return (
        <React.Fragment>
            <Text h2>Available Assets</Text>
            <Table
        css={{
            height: "auto",
            minWidth: "100%",
        }}
        selectionMode="none"
        >
        <Table.Header columns={columns}>
            {(column) => (
            <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
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
    )
}

export default Dashboard;