import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerUser } from "../services/api";

/**
 * Registration form per UX: includes name, email, password fields.
 * For MVP backend compatibility, only name + email are POSTed to /auth/register.
 */

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration page. On success navigates to /login with a success hint. */
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Password is captured for UX parity but not sent to the API in MVP
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  function validate() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Please create a password.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    if (!validate()) return;

    try {
      setSubmitting(true);
      // Only send the fields supported by the backend schema for MVP
      await registerUser({ name: name.trim(), email: email.trim() });
      setOk("Registration successful. You can now sign in.");
      // Optionally prime login step with known values
      sessionStorage.setItem("loginName", name.trim());
      navigate("/login");
    } catch (e) {
      setError(e?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  const formWrap = {
    maxWidth: 480,
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
      <h2>Create your account</h2>
      <form onSubmit={handleSubmit} style={formWrap} aria-label="Register form">
        {error && (
          <div role="alert" style={{ color: "tomato", marginBottom: 12 }}>
            {error}
          </div>
        )}
        {ok && (
          <div role="status" style={{ color: "green", marginBottom: 12 }}>
            {ok}
          </div>
        )}

        <label htmlFor="name">Name</label>
        <input
          style={inputStyle}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
        />

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
          placeholder="Create a password"
          required
        />

        <button style={btnStyle} type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: "var(--text-secondary)" }}>
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
