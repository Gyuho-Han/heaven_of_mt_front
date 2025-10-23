import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import GlobalStyle from "./styles/GlobalStyle";
import mixpanel from "mixpanel-browser";

// Create an instance of the Mixpanel object, your token is already added to this snippet
mixpanel.init('aab37d3e7857facb62ad9c132c045efb', {
  autocapture: true,
  record_sessions_percent: 100,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>
);
