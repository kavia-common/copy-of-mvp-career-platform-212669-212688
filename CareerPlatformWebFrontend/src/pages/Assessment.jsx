import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompetencies, submitAssessment } from "../services/api";
import CompetencySlider from "../components/CompetencySlider";

// PUBLIC_INTERFACE
export default function Assessment() {
  /** Lists competencies and allows the user to set their proficiency levels (1-5). */
  const navigate = useNavigate();
  const [competencies, setCompetencies] = useState([]);
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const list = await getCompetencies();
        const arr = Array.isArray(list) ? list : [];
        if (mounted) {
          setCompetencies(arr);
          // initialize to 3 as neutral baseline
          const init = {};
          arr.forEach((c) => {
            const key = c.id || c.name;
            init[key] = Number(c.proficiencyLevel) || 3;
          });
          setLevels(init);
        }
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load competencies");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, []);

  function updateLevel(key, value) {
    setLevels((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    try {
      const payload = competencies.map((c) => ({
        id: c.id || undefined,
        name: c.name || "",
        definition: c.definition || "",
        proficiencyLevel: String(levels[c.id || c.name] ?? 3),
      }));
      await submitAssessment(payload);
      localStorage.setItem("assessment", JSON.stringify(payload));
      navigate("/gap-analysis");
    } catch (e) {
      setErr(e?.message || "Failed to submit assessment");
    }
  }

  const listStyle = {
    marginTop: 12,
    padding: 16,
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    background: "var(--bg-secondary)",
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Competency Assessment</h2>
      {err && <div role="alert" style={{ color: "tomato" }}>{err}</div>}
      {loading ? (
        <div>Loading competencies...</div>
      ) : (
        <div style={listStyle}>
          {competencies.map((c, idx) => {
            const key = c.id || c.name || `c-${idx}`;
            const val = levels[key] ?? 3;
            return (
              <CompetencySlider
                key={key}
                name={c.name || `Competency ${idx + 1}`}
                value={val}
                onChange={(v) => updateLevel(key, v)}
              />
            );
          })}
          <div style={{ marginTop: 16 }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--button-bg)",
                color: "var(--button-text)",
                cursor: "pointer",
              }}
            >
              Submit Assessment →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
