import React from "react";
import { Navbar, Text } from "@nextui-org/react";
import ConnectWallet from "./ConnextWallet";

const NavBar = () => {
  return (
    <Navbar isBordered>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          Futaba
        </Text>
      </Navbar.Brand>
      <Navbar.Content>
        <ConnectWallet />
      </Navbar.Content>
    </Navbar>
  );
};

export default NavBar;
