import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../lib/useAuthContext";
import "./SignupPage.css";

function SignupPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const { signup, loading } = useAuthContext();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(form);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-page signup-page">
        <header className="auth-hero">
          <p className="page-kicker">Build your profile</p>
          <h1 className="auth-title">Aside.</h1>
          <p className="auth-copy muted">Bring one useful thing. Leave with the knowledge of the whole cohort.</p>
        </header>

        <form onSubmit={handleSubmit} className="card stack">
          <div>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={form.username} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
}

export default SignupPage;
