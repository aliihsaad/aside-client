import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../lib/useAuthContext";
import "./LoginPage.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const { login, loading } = useAuthContext();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-page login-page">
        <header className="auth-hero">
          <p className="page-kicker">Welcome back</p>
          <h1 className="auth-title">Aside.</h1>
          <p className="auth-copy muted">The useful things your cohort learns should not disappear into chat history.</p>
        </header>

        <form onSubmit={handleSubmit} className="card stack">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="muted">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </div>
  );
}

export default LoginPage;
