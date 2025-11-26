import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, selectRoles } from "../services/api";
import RoleCard from "../components/RoleCard";

// PUBLIC_INTERFACE
export default function RoleSelection() {
  /** Allows selecting current and target roles; persists selection via API. */
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [currentRole, setCurrentRole] = useState(null);
  const [targetRole, setTargetRole] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const r = await getRoles();
        if (mounted) setRoles(Array.isArray(r) ? r : []);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load roles");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, []);

  async function handleContinue() {
    if (!currentRole || !targetRole) {
      setErr("Please select both current and target roles.");
      return;
    }
    try {
      await selectRoles({ currentRoleId: currentRole.id, targetRoleId: targetRole.id });
      localStorage.setItem("targetRoleId", targetRole.id);
      navigate("/assessment");
    } catch (e) {
      setErr(e?.message || "Unable to save role selection");
    }
  }

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  };

  const section = { marginBottom: 24 };

  return (
    <div style={{ padding: 16 }}>
      <h2>Select your roles</h2>
      {err && <div role="alert" style={{ color: "tomato" }}>{err}</div>}
      {loading ? (
        <div>Loading roles...</div>
      ) : (
        <>
          <div style={section}>
            <h3>Current Role</h3>
            <div style={grid}>
              {roles.map((r) => (
                <RoleCard
                  key={`current-${r.id}`}
                  role={r}
                  onSelect={setCurrentRole}
                  selected={currentRole?.id === r.id}
                />
              ))}
            </div>
          </div>
          <div style={section}>
            <h3>Target Role</h3>
            <div style={grid}>
              {roles.map((r) => (
                <RoleCard
                  key={`target-${r.id}`}
                  role={r}
                  onSelect={setTargetRole}
                  selected={targetRole?.id === r.id}
                />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleContinue}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--button-bg)",
                color: "var(--button-text)",
                cursor: "pointer",
              }}
            >
              Continue to Assessment →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
