import { Button, Typography, Container } from "@mui/material";

function App() {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        textAlign: "center",
        minHeight: "100vh",    
        width: "100vw",        
        backgroundColor: "red",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h3" gutterBottom color="white">
        Chào mừng đến với React + Material UI 🚀
      </Typography>
      <Button 
        variant="contained" 
        sx={{backgroundColor: "white",
          color: "black",
          fontWeight: "700"
        }}
      >
        Nhấn vào tôi
      </Button>
    </Container>
  );
}

export default App;
