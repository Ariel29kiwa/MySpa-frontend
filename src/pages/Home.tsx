import { Link } from "react-router-dom";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

export default function Home({ products }: { products: Product[] }) {
  return (
    <div>
      {/* Hero משודרג */}
      <header className="hero">
        <div className="hero-logo">
          <img src="/images/logo.png" alt="MySpa" />
        </div>


        <h1>הופכים חלומות למציאות</h1>
        <Link className="cta" to="/products">כל המוצרים</Link>
      </header>

      {/* מוצרים מובילים */}
      <section className="featured">
        <h2>המוצרים המובילים שלנו</h2>
        <div className="products">
          {products.slice(0, 3).map((p) => (
            <div key={p.id} className="product-card">
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="product-img" />
              )}
              <h3>{p.name}</h3>
              <p className="price">₪{p.price}</p>
              <p>{p.description}</p>
              <div className="buttons">
                <Link className="cta" to={`/products/${p.id}`}>לפרטים</Link>
                <Link className="cta" to="/contact">צור קשר</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* אודות */}
      <section className="about">
        <h2>על החברה</h2>
        <p>
          MySpa מתמחה במוצרי ספא איכותיים לבית ולחצר – ג׳קוזי, סאונות,
          בריכות זרמים ועוד. המטרה שלנו היא להביא לך חווית ספא יוקרתית
          בלי לצאת מהבית.
        </p>
        <Link className="more" to="/about">קרא עוד</Link>
      </section>
    </div>
  );
}
