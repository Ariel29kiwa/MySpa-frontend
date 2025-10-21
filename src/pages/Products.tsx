import { useState } from "react";
import type { Product } from "./Home";
import { Link } from "react-router-dom";

export default function Products({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // רשימת קטגוריות ייחודיות מהמוצרים
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // סינון לפי קטגוריה
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <section className="featured">
      <h2>כל המוצרים</h2>

      {/* סינון לפי קטגוריה */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginLeft: "10px", fontWeight: "bold" }}>קטגוריה:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">הצג הכל</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* הצגת מוצרים */}
      <div className="products">
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            {/* תמונה (אם יש) */}
            {p.image_url && (
              <Link to={`/products/${p.id}`}>
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                />
              </Link>
            )}

            {/* שם המוצר מוביל לעמוד הפרטים */}
            <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <h3>{p.name}</h3>
            </Link>

            <p>{p.description}</p>
            <p className="price">₪{p.price}</p>
            <p style={{ fontSize: "0.9rem", color: "#777" }}>
              קטגוריה: {p.category}
            </p>

            {/* כפתורי צור קשר */}
            <div className="buttons" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Link className="cta" to="/contact">
                צור קשר באתר
              </Link>
              <a
                className="cta"
                href={`https://wa.me/972501234567?text=שלום, אני מתעניין במוצר: ${encodeURIComponent(p.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
