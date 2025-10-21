import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("המוצר לא נמצא"));
  }, [id]);

  if (error) {
    return (
      <section className="product-details">
        <Link to="/products" className="back-link">← חזרה לכל המוצרים</Link>
        <p>{error}</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-details">
        <p>טוען מידע על המוצר...</p>
      </section>
    );
  }

  return (
    <section className="product-details">
      <Link to="/products" className="back-link">← חזרה לכל המוצרים</Link>

      <div className="product-content">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img"
          />
        )}

        <div className="info">
          <h2>{product.name}</h2>
          <p className="category">קטגוריה: {product.category}</p>
          <p className="desc">{product.description}</p>
          <p className="price">₪{product.price}</p>

          <div className="buttons">
            <Link className="cta" to="/contact">
              צור קשר באתר
            </Link>
            <a
              className="cta"
              href={`https://wa.me/972501234567?text=שלום, אני מתעניין במוצר: ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
