import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "normalize.css";
import "@fontsource/inter"; // auto load Inter font
import theme from "./theme/theme";
import GlobalStyles from "./theme/GlobalStyles";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <GlobalStyles /> 
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
