import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../services/api";

// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme }) {
  /** Navbar with brand, simple navigation, theme toggle, and auth-aware login/logout. */
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "var(--bg-secondary)",
    borderBottom: "1px solid var(--border-color)",
    position: "sticky",
    top: 0,
    zIndex: 5,
  };

  const linksStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  };

  const linkStyle = {
    color: "var(--text-primary)",
    textDecoration: "none",
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
  };

  const btnStyle = {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle} aria-label="Main navigation">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 700 }}>Career Platform</span>
        {token && (
          <div style={linksStyle}>
            <Link style={linkStyle} to="/roles">Roles</Link>
            <Link style={linkStyle} to="/assessment">Assessment</Link>
            <Link style={linkStyle} to="/gap-analysis">Gap Analysis</Link>
            <Link style={linkStyle} to="/plan">Development Plan</Link>
            <Link style={linkStyle} to="/audit-logs">Audit Logs</Link>
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onToggleTheme}
          style={btnStyle}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {!token ? (
          <Link style={linkStyle} to="/login">Login</Link>
        ) : (
          <button style={btnStyle} onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
