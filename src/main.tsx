import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import Product from "./pages/Product";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="Product/:id" element={<Product />} />
    </Routes>
  </BrowserRouter>
);
