import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/common/AuthProvider";
import ToastProvider from "./components/common/ToastProvider";
import App from "./components/App";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);
