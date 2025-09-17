
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import GlobalStyle from "./styles/GlobalStyle";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>
);
