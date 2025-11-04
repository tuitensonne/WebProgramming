// src/theme/GlobalStyles.js
import { GlobalStyles as MUIGlobalStyles } from "@mui/material";

export default function GlobalStyles() {
  return (
    <MUIGlobalStyles
      styles={{
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        html: {
          height: "100%",
          width: "100%",
          fontSize: "16px", 
          WebkitTextSizeAdjust: "100%",
          MozTextSizeAdjust: "100%",
          MsTextSizeAdjust: "100%", 
          textSizeAdjust: "100%",
          scrollBehavior: "smooth",
        },
        body: {
          margin: 0,
          padding: 0,
          fontFamily:
            "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          backgroundColor: "#fafafa",
          color: "#111",
        },
        "#root": {
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        },
        "img, picture, video, canvas, svg": {
          display: "block",
          maxWidth: "100%",
        },
        "input, button, textarea, select": {
          font: "inherit",
        },
      }}
    />
  );
}
