import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

/**
 * Step 2 of the login flow: confirms persisted name and adds email.
 * Only here we call POST /auth/login using the email + the password saved from step 1.
 */

// PUBLIC_INTERFACE
export default function LoginDetails() {
  /** Final login step (email + confirm). On success stores token and navigates to /roles. */
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // password is not shown here to minimize exposure; taken from session or route state
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stateName = location?.state?.name;
    const statePass = location?.state?.password;
    const savedName = sessionStorage.getItem("loginName") || "";
    const savedPass = sessionStorage.getItem("loginPassword") || "";

    setName(stateName || savedName || "");
    setPassword(statePass || savedPass || "");
  }, [location?.state]);

  function validate() {
    if (!name.trim()) {
      setError("Missing name from previous step. Please go back and re-enter.");
      return false;
    }
    // simple email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Missing password from previous step. Please go back and re-enter.");
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
      // Only now call the API
      await login(email, password);
      // Clear transient session storage (no longer needed)
      sessionStorage.removeItem("loginName");
      sessionStorage.removeItem("loginPassword");
      navigate("/roles");
    } catch (e) {
      setError(e?.message || "Login failed");
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

  const row = { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 };
  const pill = {
    padding: "6px 10px",
    borderRadius: 20,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
  };

  const actions = { display: "flex", gap: 8, marginTop: 8 };
  const primaryBtn = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    cursor: "pointer",
  };
  const secondaryBtn = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Confirm your details</h2>
      <form onSubmit={handleSubmit} style={formWrap} aria-label="Login details form">
        {error && (
          <div role="alert" style={{ color: "tomato", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div style={row}>
          <span style={{ opacity: 0.7 }}>Name:</span>
          <input
            style={inputStyle}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

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

        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6, marginBottom: 12 }}>
          Your password was provided on the previous step and will be used to complete sign-in.
        </div>

        <div style={actions}>
          <button type="button" style={secondaryBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button type="submit" style={primaryBtn} disabled={submitting}>
            {submitting ? "Signing in..." : "Continue / Login"}
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          <span>New here? </span>
          <Link to="/register" style={{ color: "var(--text-secondary)" }}>
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
