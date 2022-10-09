import React from "react";
import ConnectWallet from "./ConnextWallet";
import { Navbar, Text, Button, Link} from "@nextui-org/react";

const NavBar = () => {
  return (
    <Navbar isBordered>
      <Navbar.Brand>
        <Link href="/">
        <Text b color="black" hideIn="xs">
          Futaba
        </Text>
        </Link>
      </Navbar.Brand>
      <Navbar.Content>

        <ConnectWallet />
        <Navbar.Link href="/about">
          About
        </Navbar.Link>
      </Navbar.Content>
    </Navbar>
  );
};

export default NavBar;
