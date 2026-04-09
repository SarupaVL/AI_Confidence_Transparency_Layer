import React from "react";

const STATUS_CONFIG = {
  supported: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.25)",
    icon: "✓",
    label: "Supported",
  },
  uncertain: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.25)",
    icon: "❓",
    label: "Unverified",
  },
  contradicted: {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.25)",
    icon: "⚠",
    label: "Contradicted",
  },
  creative: {
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.08)",
    border: "rgba(167, 139, 250, 0.25)",
    icon: "✦",
    label: "Creative",
  },
};

export default function ClaimsAnalysis({ claims, taskType }) {
  if (!claims || claims.length === 0) return null;

  const isCreative = taskType === "creative";

  const supported = claims.filter((c) => c.status === "supported").length;
  const uncertain = claims.filter((c) => c.status === "uncertain").length;
  const contradicted = claims.filter((c) => c.status === "contradicted").length;

  return (
    <div className="claims-panel fade-in">
      <div className="claims-header">
        <h3>Claim-Level Analysis</h3>
        {isCreative ? (
          <span className="creative-note">🎨 Quality review only — factual verification not applicable</span>
        ) : (
          <div className="claims-summary">
            <span style={{ color: "#10b981" }}>✓ {supported} supported</span>
            <span style={{ color: "#f59e0b" }}>❓ {uncertain} unverified</span>
            <span style={{ color: "#ef4444" }}>⚠ {contradicted} contradicted</span>
          </div>
        )}
      </div>

      <div className="claims-list">
        {claims.map((c, i) => {
          const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG["uncertain"];
          return (
            <div
              key={i}
              className="claim-row"
              style={{ borderLeftColor: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}
            >
              <span className="claim-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
              <div className="claim-body">
                <span className="claim-text">"{c.text}"</span>
                <span className="claim-status-label" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
