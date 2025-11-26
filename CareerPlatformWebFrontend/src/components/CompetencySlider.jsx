import React from "react";

// PUBLIC_INTERFACE
export default function CompetencySlider({ name, value, onChange, min = 1, max = 5 }) {
  /** Slider to select a proficiency level for a competency. */
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 0",
    borderBottom: "1px dashed var(--border-color)",
  };
  const labelStyle = { width: 220, fontWeight: 600 };
  const rangeStyle = { flex: 1 };
  const valueStyle = { minWidth: 24, textAlign: "center" };

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>{name}</div>
      <input
        style={rangeStyle}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${name} proficiency`}
      />
      <div style={valueStyle}>{value}</div>
    </div>
  );
}
