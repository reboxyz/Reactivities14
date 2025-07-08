import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/layout/App.tsx";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/ReactToastify.css";
import "./app/layout/styles.css";
import ScrollToTop from "./app/layout/ScrollToTop.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
);
