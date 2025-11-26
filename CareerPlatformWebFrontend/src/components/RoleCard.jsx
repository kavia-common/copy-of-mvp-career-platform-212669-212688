import React from "react";

// PUBLIC_INTERFACE
export default function RoleCard({ role, onSelect, selected }) {
  /** Displays a role with name/description and a select button. */
  const cardStyle = {
    border: `2px solid ${selected ? "var(--text-secondary)" : "var(--border-color)"}`,
    borderRadius: 12,
    padding: 16,
    background: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 260,
  };

  const btnStyle = {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: selected ? "var(--text-secondary)" : "var(--button-bg)",
    color: "var(--button-text)",
    cursor: "pointer",
    alignSelf: "flex-start",
  };

  return (
    <div style={cardStyle} role="group" aria-label={`Role ${role?.name || ""}`}>
      <div style={{ fontWeight: 700 }}>{role?.name}</div>
      <div style={{ color: "var(--text-primary)", opacity: 0.8, fontSize: 14 }}>
        {role?.description || "No description provided."}
      </div>
      <button style={btnStyle} onClick={() => onSelect(role)}>
        {selected ? "Selected" : "Select"}
      </button>
    </div>
  );
}
