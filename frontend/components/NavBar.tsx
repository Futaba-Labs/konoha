import React from "react";
import { Navbar, Button, Text, Card, Radio } from "@nextui-org/react";

const NavBar = () => {
  return (
    <Navbar isBordered>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          Futaba
        </Text>
      </Navbar.Brand>
    </Navbar>
  );
};

export default NavBar;
