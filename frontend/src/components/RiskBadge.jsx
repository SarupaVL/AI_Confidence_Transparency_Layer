import React from "react";

const RISK_CONFIG = {
  SAFE: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    icon: "✓",
    label: "SAFE",
    description: "Consistent, verified, and well-calibrated response.",
  },
  UNCERTAIN: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    icon: "!",
    label: "UNCERTAIN",
    description: "Some claims could not be independently verified.",
  },
  RISKY: {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    icon: "✗",
    label: "RISKY",
    description: "High likelihood of hallucination or internal contradiction.",
  },
  CREATIVE: {
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.1)",
    border: "rgba(167, 139, 250, 0.3)",
    icon: "◆",
    label: "CREATIVE TASK",
    description: "Variation is expected. Confidence reflects quality, not factual correctness.",
  },
};

export default function RiskBadge({ risk }) {
  const cfg = RISK_CONFIG[risk] || RISK_CONFIG["UNCERTAIN"];

  return (
    <div className="risk-badge-wrap fade-in" style={{ borderColor: cfg.border, backgroundColor: cfg.bg }}>
      <span className="risk-icon">{cfg.icon}</span>
      <div className="risk-text">
        <span className="risk-label" style={{ color: cfg.color }}>
          Risk Level: {cfg.label}
        </span>
        <span className="risk-description">{cfg.description}</span>
      </div>
    </div>
  );
}
