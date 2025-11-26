import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

/**
 * Single-step login form: email + password.
 * Posts to /api/v1/auth/login with { email, password }.
 */

// PUBLIC_INTERFACE
export default function Login() {
  /** Login page that signs in with email and password; stores token on success and navigates to /roles. */
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Please enter your password.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    try {
      setSubmitting(true);
      await login(email.trim(), password);
      navigate("/roles");
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  const formWrap = {
    maxWidth: 420,
    margin: "40px auto",
    padding: 20,
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    background: "var(--bg-secondary)",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    marginBottom: 12,
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
  };

  const btnStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    cursor: "pointer",
  };

  const helperStyle = { marginTop: 12, fontSize: 14, opacity: 0.85 };

  return (
    <div style={{ padding: 16 }}>
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} style={formWrap} aria-label="Login form">
        {error && (
          <div role="alert" style={{ color: "tomato", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input
          style={inputStyle}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          style={inputStyle}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button style={btnStyle} type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>

        <div style={helperStyle}>
          <span>Don't have an account? </span>
          <Link to="/register" style={{ color: "var(--text-secondary)" }}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
