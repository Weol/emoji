import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { CssVarsProvider, extendTheme } from "@mui/joy";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = extendTheme({
  fontFamily: {
    body: "Inconsolata",
  },
});

root.render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);
