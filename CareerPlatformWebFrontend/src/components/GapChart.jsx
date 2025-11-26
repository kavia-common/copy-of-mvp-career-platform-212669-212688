import React from "react";

/**
 * Compute safe number between 0 and 5.
 */
function clampLevel(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(5, x));
}

// PUBLIC_INTERFACE
export default function GapChart({ data }) {
  /** Render a compact bar chart where required vs current levels are compared per competency. */
  if (!Array.isArray(data) || data.length === 0) {
    return <div style={{ opacity: 0.7 }}>No gap data available.</div>;
  }

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "6px 0",
  };
  const nameStyle = { width: 220, fontSize: 14, fontWeight: 600 };
  const barWrapStyle = {
    position: "relative",
    height: 14,
    flex: 1,
    background: "var(--bg-secondary)",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    overflow: "hidden",
  };
  const legendStyle = {
    display: "flex",
    gap: 12,
    fontSize: 12,
    opacity: 0.8,
    paddingTop: 8,
  };

  return (
    <div>
      {data.map((item, idx) => {
        const current = clampLevel(item.currentLevel);
        const required = clampLevel(item.requiredLevel);
        const currentPct = (current / 5) * 100;
        const requiredPct = (required / 5) * 100;

        return (
          <div key={idx} style={rowStyle}>
            <div style={nameStyle}>{item.name || item.competencyId || `Competency ${idx + 1}`}</div>
            <div style={barWrapStyle} aria-label="gap bar">
              {/* Required baseline */}
              <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${requiredPct}%`,
                    background: "#99999955",
                }}
              />
              {/* Current level overlay */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${currentPct}%`,
                  background: "var(--text-secondary)",
                }}
              />
            </div>
            <div style={{ minWidth: 120, textAlign: "right", fontSize: 12 }}>
              {current} / {required}
            </div>
          </div>
        );
      })}
      <div style={legendStyle}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: "var(--text-secondary)" }} /> Current
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: "#99999955", border: "1px solid #99999955" }} /> Required
        </span>
      </div>
    </div>
  );
}
