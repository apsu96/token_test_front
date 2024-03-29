import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import TokenAbi from "./abi/TokenAbi.json";
import TransferForm from "./TransferForm";
import MintForm from "./MintForm";

const TOKEN_ADDRESS = "0xf7DC76fbE6D64dcf7C131B1b9b4213B2AFF494d5";

function MetamaskConnect() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [name, setName] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [isMinter, setIsMinter] = useState(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isMintOpen, setIsMintOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountChangedHandler);
      window.ethereum.on("chainChanged", chainChangedHandler);
    } else {
      setErrorMessage("Please install MetaMask");
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          accountChangedHandler
        );
        window.ethereum.removeListener("chainChanged", chainChangedHandler);
      }
    };
  }, []);

  function connectHandler() {
    setIsLoading(true);
    window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
      setAccount(res);
      getToken(res);
    });
  }

  function getToken(res) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token = new ethers.Contract(TOKEN_ADDRESS, TokenAbi, signer);
    token
      .balanceOf(res.toString())
      .then((res) => {
        const tokenNum = Number(ethers.utils.formatEther(res));
        setBalance(tokenNum.toFixed(2));
      })
      .catch((err) => console.log(err));
    token.name().then((res) => setName(res));
    token.decimals().then((res) => setDecimals(res));
    token.symbol().then((res) => setSymbol(res));
    token.totalSupply().then((res) => {
      const supplyNum = Number(ethers.utils.formatEther(res));
      setTotalSupply(supplyNum.toFixed(2));
      setIsLoading(false);
    });
    token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), res.toString()).then((minter) => {
        minter? setIsMinter(true) : setIsMinter(false);
    });
  }

  function chainChangedHandler() {
    window.location.reload();
  }

  function accountChangedHandler(accounts) {
    setAccount(accounts[0]);
    setBalance(null);
    setDecimals(null);
    setSymbol(null);
    setTotalSupply(null);
    setName(null);
    getToken(accounts[0]);
  }

  function shortAddress(account) {
    if (account) {
      let substring1 = account.toString().slice(0, 5);
      let substring2 = account.toString().slice(-4);
      return substring1 + "..." + substring2;
    }
  }

  function createData(name, data) {
    if (name === "Address") {
      data = shortAddress(data);
    }
    return { name, data };
  }

  const rows = [
    createData("Address", account),
    createData("Balance", balance + "  " + symbol),
    createData("Name", name),
    createData("Decimals", decimals),
    createData("Total Supply", totalSupply),
  ];

  const connectForm = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#d7c1e8",
        borderRadius: "30px",
        minHeight: "200px",
        minWidth: "300px",
        padding: "50px",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5">Connect to Metamask Wallet</Typography>
        <Button
          variant="contained"
          sx={{ marginTop: "30px", backgroundColor: "#9979C1" }}
          onClick={connectHandler}
        >
          Connect
        </Button>
      </Box>
      <Typography variant="subtitle2" color="red">
        {errorMessage}
      </Typography>
    </Box>
  );

  const accountCard = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#d7c1e8",
        borderRadius: "30px",
        padding: "30px",
      }}
    >
      <Box>
        <Card
          sx={{
            backgroundColor: "#d7c1e8",
            height: "300px",
            minWidth: "350px",
          }}
        >
          <CardContent>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}
            >
              Account details:
            </Typography>
            <Box sx={{ marginTop: "20px" }}>
              <Table sx={{}}>
                <TableBody>
                  {rows.map((row) => {
                    return (
                      <TableRow
                        key={row.name}
                        hover={true}
                        sx={{ backgroundColor: "#e0d1ed", height: "10px" }}
                      >
                        <TableCell size="small" sx={{ margin: "5px" }}>
                          {row.name}
                        </TableCell>
                        <TableCell size="small" sx={{ margin: "5px" }}>
                          {row.data}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ paddingLeft: "20px" }}>
        <Card
          sx={{
            backgroundColor: "#d7c1e8",
            height: "300px",
            minWidth: "250px",
          }}
        >
          <CardContent>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}
            >
              Transactions:
            </Typography>
          </CardContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", marginTop: "10px" }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "#9979C1" }}
              onClick={() => setIsTransferOpen(true)}
            >
              Transfer
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#9979C1", marginTop: "15px" }}
              onClick={() => setIsMintOpen(true)}
              disabled={!isMinter}
            >
              Mint
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );

  return (
    <div
      style={{
        backgroundColor: "#9979C1",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {account ? accountCard : connectForm}
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <Modal
          open={isTransferOpen}
          onClose={() => {
              setIsTransferOpen(false);
              getToken(account);
            }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TransferForm />
        </Modal>
      </Box>
      <Box>
        <Modal
          open={isMintOpen}
          onClose={() => {
              setIsMintOpen(false);
              getToken(account);
            }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MintForm />
        </Modal>
      </Box>
    </div>
  );
}

export default MetamaskConnect;
