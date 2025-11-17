import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

interface Lead {
  id: number;
  name: string;
  email: string;
  message?: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

export default function Admin({ role }: { role: string | null }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // --- טפסים למוצר חדש ---
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImage, setNewImage] = useState("");

  // --- עריכת מוצר קיים ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      setErr("אין לך הרשאה לצפות בדף זה");
      return;
    }

    // טעינת לידים
    axios
      .get("http://localhost:5000/api/admin/leads")
      .then((res) => setLeads(res.data))
      .catch((e) => setErr(e?.response?.data?.error || "Load failed"));

    // טעינת מוצרים
    axios
      .get("https://myspa-backend.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, [role]);

  if (role !== "admin") {
    return (
      <section className="admin">
        <h2>דאשבורד מנהל</h2>
        <p className="error">{err || "אין הרשאה"}</p>
      </section>
    );
  }

  // --- הוספת מוצר חדש ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("https://myspa-backend.onrender.com/api/products", {
        name: newName,
        description: newDesc,
        price: parseFloat(newPrice),
        category: newCategory || "כללי",
        image_url: newImage || null,
      });
      alert("המוצר נוסף בהצלחה!");
      setNewName("");
      setNewDesc("");
      setNewPrice("");
      setNewCategory("");
      setNewImage("");
      const updated = await axios.get("http://localhost:5000/api/products");
      setProducts(updated.data);
    } catch {
      alert("שגיאה בהוספת מוצר");
    }
  };

  // --- מחיקת מוצר ---
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("למחוק מוצר זה?")) return;
    try {
      await axios.delete(`https://myspa-backend.onrender.com/api/products/${id}`,);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("שגיאה במחיקה");
    }
  };

  // --- עדכון מוצר ---
  const handleUpdateProduct = async (id: number) => {
    try {
      await axios.put(`https://myspa-backend.onrender.com/api/products/${id}`, {
        name: editName,
        description: editDesc,
        price: parseFloat(editPrice),
        category: editCategory,
        image_url: editImage,
      });
      alert("המוצר עודכן בהצלחה!");
      setEditingId(null);
      const updated = await axios.get("http://localhost:5000/api/products");
      setProducts(updated.data);
    } catch {
      alert("שגיאה בעדכון מוצר");
    }
  };

  return (
    <section className="admin">
      <h2>דאשבורד מנהל</h2>

      {/* כרטיסי סטטיסטיקות */}
      <div className="stats">
        <div className="card">
          <h3>סה״כ לידים</h3>
          <p>{leads.length}</p>
        </div>
        <div className="card">
          <h3>סה״כ מוצרים</h3>
          <p>{products.length}</p>
        </div>
      </div>

      {/* טבלת לידים */}
      <div className="table-wrap">
        <h3>לידים אחרונים</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>שם</th>
              <th>אימייל</th>
              <th>הודעה</th>
              <th>נוצר ב־</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>{l.message}</td>
                <td>{l.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* טופס מוצר חדש */}
      <div className="add-product">
        <h3>הוספת מוצר חדש</h3>
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="שם מוצר"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <textarea
            placeholder="תיאור"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="מחיר"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="קטגוריה"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="קישור לתמונה"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          />
          <button type="submit" className="primary">
            הוסף מוצר
          </button>
        </form>
      </div>

      {/* טבלת מוצרים */}
      <div className="table-wrap">
        <h3>ניהול מוצרים</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>שם</th>
              <th>תיאור</th>
              <th>מחיר</th>
              <th>קטגוריה</th>
              <th>תמונה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>

                {editingId === p.id ? (
                  <>
                    <td>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdateProduct(p.id)}>
                        שמור
                      </button>
                      <button onClick={() => setEditingId(null)}>ביטול</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td>₪{p.price}</td>
                    <td>{p.category}</td>
                    <td>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          style={{ width: "80px", borderRadius: "6px" }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setEditName(p.name);
                          setEditDesc(p.description);
                          setEditPrice(p.price.toString());
                          setEditCategory(p.category);
                          setEditImage(p.image_url || "");
                        }}
                      >
                        ערוך
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(p.id)}
                      >
                        מחק
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
