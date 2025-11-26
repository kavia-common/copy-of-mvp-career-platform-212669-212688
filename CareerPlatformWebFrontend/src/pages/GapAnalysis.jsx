import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { performGapAnalysis } from "../services/api";
import GapChart from "../components/GapChart";

/**
 * Derive a normalized gap list from a gap analysis result.
 */
function toGapRows(result) {
  if (!result) return [];
  // If explicit 'gaps' provided with current/required levels
  if (Array.isArray(result.gaps) && result.gaps.length > 0) {
    return result.gaps.map((g) => ({
      name: g.name || g.competencyId || "Competency",
      currentLevel: g.currentLevel ?? g.proficiencyLevel ?? 0,
      requiredLevel: g.requiredLevel ?? g.targetLevel ?? 0,
    }));
  }
  // Fallback: compute from current vs target arrays if present
  const byName = (arr = []) =>
    arr.reduce((acc, c) => {
      const key = c.name || c.id || c.competencyId || "";
      if (!key) return acc;
      acc[key] = Number(c.proficiencyLevel || c.level || 0);
      return acc;
    }, {});
  const current = byName(result.currentCompetencies || []);
  const target = byName(result.targetCompetencies || []);
  const allKeys = Array.from(new Set([...Object.keys(current), ...Object.keys(target)]));
  return allKeys.map((k) => ({
    name: k,
    currentLevel: current[k] || 0,
    requiredLevel: target[k] || current[k] || 0,
  }));
}

// PUBLIC_INTERFACE
export default function GapAnalysis() {
  /** Runs the gap analysis and renders a simple chart + navigation to plan. */
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const targetRoleId = localStorage.getItem("targetRoleId") || "";
    const assessment = JSON.parse(localStorage.getItem("assessment") || "[]");
    if (!assessment || assessment.length === 0) {
      navigate("/assessment");
      return;
    }
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await performGapAnalysis({
          currentCompetencies: assessment,
          targetRoleId,
        });
        if (mounted) {
          setResult(res);
          localStorage.setItem("gapResult", JSON.stringify(res));
        }
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to run gap analysis");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, [navigate]);

  const gaps = useMemo(() => toGapRows(result), [result]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Gap Analysis</h2>
      {err && <div role="alert" style={{ color: "tomato" }}>{err}</div>}
      {loading ? (
        <div>Computing gap analysis...</div>
      ) : (
        <>
          <p style={{ opacity: 0.8 }}>
            The chart compares your current proficiency to the target role's required levels.
          </p>
          <GapChart data={gaps} />
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => navigate("/plan")}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--button-bg)",
                color: "var(--button-text)",
                cursor: "pointer",
              }}
            >
              Generate Development Plan →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
