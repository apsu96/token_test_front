import { Box, Typography,Container,CssBaseline, Button, TextField, Modal } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import TokenAbi from "./abi/TokenAbi.json";
import TransferForm from "./TransferForm";

const TOKEN_ADDRESS = "0xf7DC76fbE6D64dcf7C131B1b9b4213B2AFF494d5";

function MetamaskConnect() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [decimals, setDecimals] = useState(null);
    const [name, setName] = useState(null);
    const [symbol, setSymbol] = useState(null);
    const [totalSupply, setTotalSupply] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            connectHandler();
            window.ethereum.on("accountsChanged", accountChangedHandler);
            window.ethereum.on("chainChanged", chainChangedHandler);
        } else {
            setErrorMessage("Please install MetaMask");
        }
        return () => {
            if (window.ethereum) {
              window.ethereum.removeListener('accountsChanged', accountChangedHandler)
              window.ethereum.removeListener('chainChanged', chainChangedHandler)
            }
          }
    }, [])

    function connectHandler() {
        window.ethereum.request({method: "eth_requestAccounts"}).then(res => {
            setAccount(res);
            getToken(res);
        })  
    }

    function getToken(res) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const token = new ethers.Contract(TOKEN_ADDRESS, TokenAbi, signer);
        token.balanceOf(res.toString()).then((res) => {
            const tokenNum = Number(ethers.utils.formatEther(res));
            setBalance(tokenNum.toFixed(2));
        }).catch((err) => console.log(err));
        token.name(account).then((res) => setName(res));
        token.decimals(account).then(res => setDecimals(res));
        token.symbol(account).then(res => setSymbol(res));
        token.totalSupply(account).then(res => setTotalSupply(res));
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

    return  <div>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        {account? (<Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            
        }}>
            <Typography variant="h5">Your account details</Typography>
            <TextField value={"Address:  " + account} margin="dense" sx={{width: "500px"}}></TextField>
            <TextField value={"Balance:  " + balance} margin="dense" sx={{width: "500px"}}></TextField>
            <TextField value={"Name:  " + name} margin="dense" sx={{width: "500px"}}></TextField>
            <TextField value={"Symbol:  " + symbol} margin="dense" sx={{width: "500px"}}></TextField>
            <TextField value={"Decimals:  " + decimals} margin="dense" sx={{width: "500px"}}></TextField>
            <TextField value={"Total supply:  " + totalSupply} margin="dense" sx={{width: "500px"}}></TextField>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} 
            onClick={() => setIsActive(true)}
            >Transfer</Button>
        </Box>) : ( <Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Typography variant="h5">Connect to your Metamask account</Typography>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={connectHandler}>Connect</Button>
            <Typography variant="subtitle2" color="red">{errorMessage}</Typography>
        </Box>)}
    </Container>
    <Box >
        <Modal open={isActive} onClose={() => setIsActive(false)}sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <TransferForm />
        </Modal>
    </Box>
    </div>
}

export default MetamaskConnect;