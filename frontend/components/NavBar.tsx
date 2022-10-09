import React from "react";
import { Navbar, Text} from "@nextui-org/react";

const NavBar = () => {

  return (
    <Navbar isBordered>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          Futaba
        </Text>
      </Navbar.Brand>
      <Navbar.Content>
        <Navbar.Link>
          Connect to Wallet
        </Navbar.Link>
      </Navbar.Content>
    </Navbar>
  );
};

export default NavBar;
