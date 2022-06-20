import React from "react";
import ReactDOM from "react-dom/client";
import Index from "./components/TeacherIndex";
import QuizEditor from "./components/QuizEditor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />}></Route>
      <Route path="/editor" element={<QuizEditor />}></Route>
    </Routes>
  </BrowserRouter>
);
