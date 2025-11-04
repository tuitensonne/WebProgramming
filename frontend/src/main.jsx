import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "normalize.css";
import "@fontsource/inter";
import theme from "./theme/theme";
import GlobalStyles from "./theme/GlobalStyles";
import App from "./App";
import AdminApp from "./admin";

const path = window.location.pathname; 

if (path.startsWith("/admin")) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
