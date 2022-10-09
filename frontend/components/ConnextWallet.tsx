import React, { useEffect, useState } from "react";
import { Modal, Input, Row, Checkbox, Button, Text } from "@nextui-org/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/ConnectWallet.module.css";
import metamask from "../assets/MetaMask_Fox.png";
import { useWeb3 } from "../hooks/useWeb3";

const ConnectWallet: NextPage = () => {
  const { connectWallet, provider } = useWeb3();
  const [address, setAddress] = useState("");
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };

  const setWalletAddress = async () => {
    if (provider) {
      const address = await provider.getSigner().getAddress();
      setAddress(address.slice(0, 4) + "..." + address.slice(-4));
    }
  };

  useEffect(() => {
    if (provider) {
      setVisible(false);
      setWalletAddress();
    }
  }, [provider]);

  return (
    <div>
      {!provider ? (
        <Button
          rounded
          auto
          css={{ backgroundColor: "#12eb27" }}
          shadow
          onClick={handler}
        >
          ウォレットに接続
        </Button>
      ) : (
        <Button
          rounded
          auto
          css={{ backgroundColor: "#12eb27" }}
          shadow
          disabled
        >
          {address}
        </Button>
      )}

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text className={styles.header} b size={24}>
              ウォレットを選択
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.top_32px}></div>
          <div className={styles.top_32px}></div>
          <Button bordered color="warning" auto onClick={() => connectWallet()}>
            Meta Mask
            <Image
              className={styles.metamask}
              width={30}
              height={30}
              src={metamask}
            ></Image>
          </Button>
          <div className={styles.top_32px}></div>
          <div className={styles.top_32px}></div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};
export default ConnectWallet;
