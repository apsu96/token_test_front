import { Box,TextField, Button } from '@mui/material';
import { useState } from 'react';
import {ethers } from 'ethers';
import TokenAbi from "./abi/TokenAbi.json";

const TOKEN_ADDRESS = "0xf7DC76fbE6D64dcf7C131B1b9b4213B2AFF494d5";

function TransferForm(props) {
    const [address, setAddress] = useState(null);
    const [amount, setAmount] = useState(null);

    function sendTransfer() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const token = new ethers.Contract(TOKEN_ADDRESS, TokenAbi, signer);
            token.transfer(address, ethers.utils.parseUnits(amount));
        }
    }

    return <Box sx={{backgroundColor: "white", display: "flex", flexDirection: "column", padding: "50px", width: "500px"}}>
        <TextField placeholder="Address" margin="dense" onChange={(e) => setAddress(e.target.value)}></TextField>
        <TextField placeholder="Amount" margin="dense" onChange={(e) => setAmount(e.target.value)}></TextField>
        <Button variant="contained" sx={{marginTop: "10px"}} onClick={sendTransfer}>Send</Button>
        </Box>
    
}

export default TransferForm