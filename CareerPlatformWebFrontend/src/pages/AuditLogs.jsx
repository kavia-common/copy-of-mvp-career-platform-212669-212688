import React, { useEffect, useState } from "react";
import { getAuditLogs } from "../services/api";

// PUBLIC_INTERFACE
export default function AuditLogs() {
  /** Displays audit logs for admins. */
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await getAuditLogs();
        if (mounted) setLogs(Array.isArray(res) ? res : []);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to fetch audit logs");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, []);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid var(--border-color)",
  };
  const thtd = {
    border: "1px solid var(--border-color)",
    padding: 8,
    textAlign: "left",
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Audit Logs</h2>
      {err && <div role="alert" style={{ color: "tomato" }}>{err}</div>}
      {loading ? (
        <div>Loading logs...</div>
      ) : logs.length === 0 ? (
        <div>No logs available.</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>Timestamp</th>
              <th style={thtd}>User</th>
              <th style={thtd}>Action</th>
              <th style={thtd}>Trace ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, idx) => (
              <tr key={`log-${l.id || idx}`}>
                <td style={thtd}>{l.timestamp || ""}</td>
                <td style={thtd}>{l.user || ""}</td>
                <td style={thtd}>{l.action || ""}</td>
                <td style={thtd}>{l.traceId || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
