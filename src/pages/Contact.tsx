import { useState } from "react";
import axios from "axios";

export default function Contact() {
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
