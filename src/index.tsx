import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CssVarsProvider, extendTheme } from "@mui/joy";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        common: {},
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);
