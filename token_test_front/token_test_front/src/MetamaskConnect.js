import { Box, Typography,Container,CssBaseline, Button } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

function MetamaskConnect() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    function connectHandler() {
        if (window.ethereum) {
            window.ethereum.request({
                method: "eth_requestAccounts",
            }).then(result => {
                
            })
        } else {
            setErrorMessage("Please install MetaMask");    
        }
    }

    return  <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Typography variant="h5">Connect to your Metamask account</Typography>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }}onClick={connectHandler}>Connect</Button>
            <Typography variant="subtitle2" color="red">{errorMessage}</Typography>
        </Box>
    </Container>
}

export default MetamaskConnect;