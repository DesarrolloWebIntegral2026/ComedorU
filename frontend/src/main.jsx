import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import axios from 'axios';

axios.defaults.withCredentials = true;
// El resto de tu configuración (baseURL, etc.) se mantiene igual
axios.defaults.baseURL = 'http://localhost:3000/api';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
