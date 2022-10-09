import React, { useCallback, useEffect } from "react";
import {
  Modal,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
  Dropdown,
} from "@nextui-org/react";
import { useWeb3 } from "../hooks/useWeb3";
import { useContract } from "../hooks/useContract";
import { toast } from "react-toastify";
import { BigNumber, ethers } from "ethers";
import { walletconnect } from "web3modal/dist/providers/connectors";
import erc20ABI from "../utils/erc20.json";

export default function Deposit() {
  const { provider, connectWallet } = useWeb3();
  const contract = useContract();
  const [visible, setVisible] = React.useState(false);
  const [amount, setAmount] = React.useState("");

  const inputAmount = useCallback(
    (event: { target: { value: React.SetStateAction<string> } }) => {
      setAmount(event.target.value);
      console.log(amount);
    },
    [amount]
  );
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  const deposit = async () => {
    console.log("yuyuhiuih");
    if (provider) {
      if (contract) {
        const signer = await provider.getSigner();
        const targetToken = new ethers.Contract(
          "0xD1633F7Fb3d716643125d6415d4177bC36b7186b",
          erc20ABI,
          signer
        );
        let approveTx = await targetToken.approve(contract.address, 2000000);
        console.log("approving token...");
        await approveTx.wait();
        console.log("approved!");
        console.log(amount);
        const tx = await contract.mintFutabaToken(1000000);
        await tx.wait();
        console.log(tx);
        toast.success("Transaction Completed");
      }
    }
  };

  // todo ネットワークをフェッチしたい
  useEffect(() => {
    connectWallet();
  }, [provider]);
  return (
    <div>
      <Button
        auto
        className="deposit-button"
        css={{ $$background: "#330025" }}
        shadow
        onClick={handler}
      >
        <div className="deposit-text">Deposit</div>
      </Button>
      <Modal
        closeButton
        className="deposit-modal"
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <p id="deposit-title">Deposit</p>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-subtitle">Assets</div>
          <Dropdown>
            <Dropdown.Button flat className="chain-select">
              <div className="usdc">USDC</div>
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Static Actions"
              disabledKeys={["usdt", "dai"]}
            >
              <Dropdown.Item key="new">USDC</Dropdown.Item>
              <Dropdown.Item key="dai">DAI(comming soon)</Dropdown.Item>
              <Dropdown.Item key="usdt">USDT(comming soon)</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="modal-subtitle">Amount</div>
          <Input
            className="input-amount"
            fullWidth
            placeholder="ex. 100"
            labelRight="USDC"
            onChange={inputAmount}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            className="close-button"
            color="error"
            onClick={closeHandler}
          >
            Close
          </Button>
          <Button auto className="deposit-button" onClick={() => deposit()}>
            Deposit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
