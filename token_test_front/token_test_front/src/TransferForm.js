import {
  Box,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
  Typography
} from "@mui/material";
import { useState } from "react";
import { ethers } from "ethers";
import TokenAbi from "./abi/TokenAbi.json";

const TOKEN_ADDRESS = "0xf7DC76fbE6D64dcf7C131B1b9b4213B2AFF494d5";

function TransferForm() {
  const [address, setAddress] = useState(null);
  const [amount, setAmount] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [error, setError] = useState("");
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("pending");
  const [showRes, setShowRes] = useState(false);

  function sendTransfer() {
    setIsSending(true);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const token = new ethers.Contract(TOKEN_ADDRESS, TokenAbi, signer);
      token
        .transfer(address, ethers.utils.parseUnits(amount))
        .then((hash) => {
          setIsSending(false);
          setIsSigned(true);
          setHash(hash.hash);
          setTimeout(function checkTx() {
            provider.getTransaction(hash.hash).then((res) => {
              if (res.blockNumber) {
                setShowRes(true);
                setStatus("success");
                setIsSigned(false);
              } else {
                setTimeout(checkTx, 2000);
              }
            });
          }, 2000);
        })
        .catch((e) => console.log("error"));
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#d7c1e8",
        display: "flex",
        flexDirection: "column",
        padding: "50px",
        width: "600px",
        borderRadius: "30px",
        height: "350px",
      }}
    >
      {!showRes ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
              marginBottom: "10px",
            }}
          >
            Transfer transaction
          </Typography>
          <Typography sx={{ textAlign: "center", marginBottom: "10px" }}>
            Please enter receiver's address and amount to be transferred
          </Typography>
          <TextField
            placeholder="Address"
            margin="dense"
            onChange={(e) => setAddress(e.target.value)}
            disabled={isSending || isSigned}
            sx={{ backgroundColor: "#e0d1ed" }}
          ></TextField>
          <TextField
            placeholder="Amount"
            margin="dense"
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSending || isSigned}
            sx={{ backgroundColor: "#e0d1ed" }}
          ></TextField>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#9979C1",
              width: "300px",
              margin: "10px auto",
              height: "50px",
            }}
            onClick={sendTransfer}
            disabled={!address || !amount}
          >
            Send
          </Button>
          <Typography sx={{ textAlign: "center" }}>{error}</Typography>
          { isSigned ? (
            <Box
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography sx={{ textAlign: "center", marginTop: "10px" }}>
                Transaction was approved. Status:{" "}
                <a href={`https://rinkeby.etherscan.io/tx/${hash}`}>{status}</a>
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginTop: "5px",
                  fontWeight: "bold",
                }}
              >
                Transaction Hash
              </Typography>
              <Typography
                sx={{ textAlign: "center", marginTop: "5px" }}
              >
                {hash}
              </Typography>
              <Typography sx={{ textAlign: "center", marginTop: "5px" }}>
                <CircularProgress color="inherit" open={isSigned} size={20} />
              </Typography>
              <Backdrop open={isSending}>
                <CircularProgress color="inherit" />
              </Backdrop>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", padding: "30px 0px" }}>
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
              marginBottom: "10px",
            }}
          >
            Transaction was successfully completed.
          </Typography>
          <Typography
            sx={{ textAlign: "center", fontSize: "18px", marginBottom: "10px" }}
          >
            See details on <a href={`https://rinkeby.etherscan.io/tx/${hash}`}>Etherscan</a>.
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              marginTop: "35px",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Transaction Hash
          </Typography>
          <Typography
            sx={{ textAlign: "center", marginTop: "5px", fontSize: "15px" }}
          >
            {hash}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#9979C1",
              width: "400px",
              margin: "30px auto",
              height: "50px",
            }}
            onClick={() => {
              setIsSigned(false);
              setHash("");
              setShowRes(false);
              setAddress(null);
              setAmount(null);
            }}
          >
            Go back to transfer form
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default TransferForm;
