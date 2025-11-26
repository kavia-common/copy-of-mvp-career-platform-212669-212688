import React, { useEffect, useState } from "react";
import { generateDevelopmentPlan, exportDevelopmentPlan } from "../services/api";

// PUBLIC_INTERFACE
export default function DevelopmentPlan() {
  /** Generates a development plan from the last gap analysis result and renders it. */
  const [plan, setPlan] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [exportUrl, setExportUrl] = useState("");

  useEffect(() => {
    let mounted = true;
    const gapResult = JSON.parse(localStorage.getItem("gapResult") || "null");
    if (!gapResult) {
      setErr("No gap analysis found. Please complete the gap analysis first.");
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await generateDevelopmentPlan(gapResult);
        if (mounted) setPlan(res);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to generate development plan");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, []);

  async function handleExport() {
    try {
      const res = await exportDevelopmentPlan();
      const url = res?.exportLink || res?.url || "";
      setExportUrl(url);
    } catch (e) {
      setErr(e?.message || "Failed to export plan");
    }
  }

  const card = {
    marginTop: 12,
    padding: 16,
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    background: "var(--bg-secondary)",
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Development Plan</h2>
      {err && <div role="alert" style={{ color: "tomato" }}>{err}</div>}
      {loading ? (
        <div>Generating your plan...</div>
      ) : (
        <>
          <div style={card}>
            <h3>Steps</h3>
            <ul>
              {(plan?.steps || []).map((s, i) => (
                <li key={`step-${i}`}>{typeof s === "string" ? s : s?.description || JSON.stringify(s)}</li>
              ))}
            </ul>
          </div>
          <div style={card}>
            <h3>Actions</h3>
            <ul>
              {(plan?.actions || []).map((a, i) => (
                <li key={`action-${i}`}>{String(a)}</li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={handleExport}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--button-bg)",
                color: "var(--button-text)",
                cursor: "pointer",
              }}
            >
              Export Plan
            </button>
            {exportUrl && (
              <a href={exportUrl} target="_blank" rel="noreferrer">
                Open Export
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
