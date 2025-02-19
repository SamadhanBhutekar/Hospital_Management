import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-tooltip/dist/react-tooltip.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* ✅ Wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
