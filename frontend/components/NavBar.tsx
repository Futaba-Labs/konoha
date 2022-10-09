import React from "react";
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
        <Navbar.Link href="/about">
          About
        </Navbar.Link>
        <Button>Connect to Wallet</Button>
      </Navbar.Content>
    </Navbar>
  );
};

export default NavBar;
