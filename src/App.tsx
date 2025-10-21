import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";

// מייבאים את הטייפ מהדף Home (שם הוא מוגדר ונעשה בו שימוש)
import type { Product } from "./pages/Home";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // שליפת מוצרים לדף הבית/קטלוג
  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // סגירה ב-Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // נעילת גלילה כשהתפריט פתוח
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div>
      {/* כפתור ☰ */}
      <button
        className="menu-btn"
        aria-label="פתח תפריט"
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Overlay כהה */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <nav
        id="sidebar"
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        aria-hidden={!isSidebarOpen}
      >
        <ul>
          <li>
            <Link to="/" onClick={() => setIsSidebarOpen(false)}>
              בית
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setIsSidebarOpen(false)}>
              כל המוצרים
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsSidebarOpen(false)}>
              אודות
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsSidebarOpen(false)}>
              צור קשר
            </Link>
          </li>
        </ul>
      </nav>

      {/* --- תוכן האתר --- */}
      <div className="page">
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/products" element={<Products products={products} />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <footer>
          <p>© {new Date().getFullYear()} MySpa | כל הזכויות שמורות</p>
        </footer>
      </div>
    </div>
  );
}
