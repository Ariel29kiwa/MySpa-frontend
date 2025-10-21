import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";




interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  created_at: string;
  message?: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const navigate = useNavigate();

  // הגדרת axios עם Authorization
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // שליפת מוצרים לדף הבית
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    navigate("/");
  };

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
          <li><Link to="/" onClick={() => setIsSidebarOpen(false)}>בית</Link></li>
          <li><Link to="/products" onClick={() => setIsSidebarOpen(false)}>כל המוצרים</Link></li>
          <li><Link to="/about" onClick={() => setIsSidebarOpen(false)}>אודות</Link></li>
          <li><Link to="/contact" onClick={() => setIsSidebarOpen(false)}>צור קשר</Link></li>
          {/* {!token && (
            <li><Link to="/login" onClick={() => setIsSidebarOpen(false)}>התחברות</Link></li>
          )} */}
          {token && (
            <>
              {/* {role === "admin" && (
                <li><Link to="/admin" onClick={() => setIsSidebarOpen(false)}>דאשבורד מנהל</Link></li>
              )} */}
              {/* <li><button className="linklike" onClick={handleLogout}>התנתק</button></li> */}
            </>
          )}
        </ul>
      </nav>

      {/* --- תוכן האתר --- */}
      <div className="page">
        <Routes>
          {/* דף הבית */}
          <Route path="/" element={<Home products={products} />} />
          {/* כל המוצרים */}
          <Route path="/products" element={<Products products={products} />} />
          {/*פרטי מוצר*/}
          <Route path="/products/:id" element={<ProductDetails />} />
          {/* אודות */}
          <Route path="/about" element={<About />} />
          {/* צור קשר */}
          <Route path="/contact" element={<Contact />} />
          {/* התחברות
          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} /> */}
          {/* דאשבורד מנהל */}
          {/* <Route path="/admin" element={<Admin role={role} />} /> */}
        </Routes>

        <footer>
          <p>© {new Date().getFullYear()} MySpa | כל הזכויות שמורות</p>
        </footer>
      </div>
    </div>
  );
}


/* ===== קומפוננטת צור קשר ===== */
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      await axios.post("http://localhost:5000/api/leads", {
        name,
        email,
        message,
      });
      setStatus("ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("שגיאה בשליחת ההודעה. נסה שוב.");
    }
  };

  return (
    <section className="contact">
      <h2>צור קשר</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          שם מלא
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          הודעה
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
        </label>
        <button type="submit" className="primary">שלח</button>
        {status && <p className="status">{status}</p>}
      </form>
    </section>
  );
}



export default App;


