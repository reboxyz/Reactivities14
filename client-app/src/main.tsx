import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/layout/App.tsx";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/ReactToastify.css";
import "./app/layout/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import ScrollToTop from "./app/layout/ScrollToTop.tsx";
import { StoreContext, store } from "./app/stores/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </StoreContext.Provider>
  </StrictMode>
);
