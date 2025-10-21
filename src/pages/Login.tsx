import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({
  setToken,
  setRole,
}: {
  setToken: (t: string | null) => void;
  setRole: (r: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { access_token, role } = res.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      setToken(access_token);
      setRole(role);
      navigate(role === "admin" ? "/admin" : "/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <section className="auth">
      <h2>התחברות</h2>
      <form onSubmit={onSubmit} className="auth-form">
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
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {err && <p className="error">{err}</p>}
        <button type="submit" className="primary">התחבר</button>
      </form>
    </section>
  );
}
