import React from "react";

export default function ConfidenceDashboard({ level, score, signals, taskType }) {
  const getLevelColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case "high": return "#10b981";
      case "medium": return "#f59e0b";
      case "low": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const pct = (val) => `${Math.round((val || 0) * 100)}%`;
  const getContradictionColor = (val) => val > 0.2 ? "#ef4444" : "#10b981";
  const getSignalColor = (val) => val > 0.7 ? "#10b981" : val > 0.4 ? "#f59e0b" : "#ef4444";

  const signalDefs = [
    {
      key: "robustness",
      label: "Robustness",
      tooltip: "Semantic similarity across multi-sampled and perturbed outputs. High = consistent answers regardless of prompt framing.",
      color: getSignalColor(signals?.robustness),
    },
    {
      key: "verifiability",
      label: "Verifiability",
      tooltip: "Self-verification score: how factually correct the model judges its own answer at low temperature.",
      color: getSignalColor(signals?.verifiability),
    },
    {
      key: "calibration",
      label: "Calibration",
      tooltip: "Specificity vs. hedging ratio. Penalises vague language (might, perhaps, could) and rewards numeric precision.",
      color: getSignalColor(signals?.calibration),
    },
    {
      key: "contradiction",
      label: "Contradiction",
      tooltip: "Density of negation patterns across all response variants. Lower is better. High = conflicting internal claims.",
      color: getContradictionColor(signals?.contradiction),
      invert: true,
    },
  ];

  return (
    <div className="confidence-dashboard fade-in">
      <div className="dashboard-header">
        <div className="main-score-group">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path className="circle"
              strokeDasharray={`${(score || 0) * 100}, 100`}
              stroke={getLevelColor(level)}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{pct(score)}</text>
          </svg>
          <div className="level-info">
            <h2 style={{ color: getLevelColor(level) }}>{level} Confidence</h2>
            <p className="score-sub">
              {taskType === "creative"
                ? "🎨 Quality score — not factual correctness"
                : taskType === "analytical"
                ? "🔍 Analytical task — reasoning consistency weighted"
                : "📋 Factual task — verification & consistency weighted"}
            </p>
          </div>
        </div>

        <div className="weight-legend">
          <span>Robustness <strong>40%</strong></span>
          <span>Verifiability <strong>40%</strong></span>
          <span>Calibration <strong>20%</strong></span>
        </div>
      </div>

      <div className="signals-grid">
        {signalDefs.map((s) => (
          <div key={s.key} className="signal-card tooltip-container">
            <div className="signal-head">
              <span className="signal-title">{s.label}</span>
              <span className="signal-value" style={{ color: s.color }}>{pct(signals?.[s.key])}</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: pct(signals?.[s.key]), backgroundColor: s.color }} />
            </div>
            <span className="tooltip">{s.tooltip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
