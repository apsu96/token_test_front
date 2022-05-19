import { Box, Typography,Container,CssBaseline, Button, TextField } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

function MetamaskConnect() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            connectHandler();
        } else {
            setErrorMessage("Please install MetaMask");
        }
    }, [])

    function connectHandler() {
        if (window.ethereum) {
            window.ethereum.request({
                method: "eth_requestAccounts",
            }).then(result => {
                accountChangeHandler(result[0]);
            })
        } else {
            setErrorMessage("Error. Could not connect.");    
        }
    }

    function accountChangeHandler(account) {
        setAccount(0);
        setBalance(0);
        setAccount(account);
        getUserBalance(account.toString());
    }

    function getUserBalance(address) {
        window.ethereum.request({
            method: "eth_getBalance", params: [address, "latest"]
        }).then(result => {
            setBalance(ethers.utils.formatEther(result));
        })
    }

    function chainChangedHandler() {
        window.location.reload();
    }

    window.ethereum.on("accountsChanged", accountChangeHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);

    return  <Container component="main" maxWidth="xs">
        <CssBaseline />
        {account? (<Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Typography variant="h5">Your account details</Typography>
            <TextField value={"Address:  " + account} margin="dense" sx={{padding: "auto", }}></TextField>
            <TextField value={"Balance:  " + balance} margin="dense"></TextField>
        </Box>) : ( <Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Typography variant="h5">Connect to your Metamask account</Typography>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }}onClick={connectHandler}>Connect</Button>
            <Typography variant="subtitle2" color="red">{errorMessage}</Typography>
        </Box>)}
    </Container>
}

export default MetamaskConnect;