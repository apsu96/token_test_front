import { Container } from '@mui/material';
import { Button } from '@mui/material';
import { Modal, Box,TextField } from '@mui/material';

function TransferForm() {
    return <Box >
    <Modal open={true} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Box sx={{backgroundColor: "white", display: "flex", flexDirection: "column", padding: "50px", width: "500px"}}>
            <TextField placeholder="Address" margin="dense"></TextField>
            <TextField placeholder="Amount" margin="dense"></TextField>
            <Button variant="contained" sx={{marginTop: "10px"}}>Send</Button>
            </Box>
            </Modal>
        </Box>
    
}

export default TransferForm