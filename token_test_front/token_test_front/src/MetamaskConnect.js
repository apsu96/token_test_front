import { Box, Typography,Container,CssBaseline, Button } from "@mui/material";

function MetamaskConnect() {

    return  <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Typography variant="h5">Connect to your Metamask account</Typography>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }}>Connect</Button>
        </Box>
    </Container>
}

export default MetamaskConnect;