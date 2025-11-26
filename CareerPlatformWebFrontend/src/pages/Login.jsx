import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

// PUBLIC_INTERFACE
export default function Login() {
  /** Email/password login form; stores token and navigates to role selection. */
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/roles");
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
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

  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome back</h2>
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
        <button style={btnStyle} type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
