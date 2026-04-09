import React from "react";

export default function ConfidenceDashboard({ level, score, reason, signals }) {
  const getLevelColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case "high": return "#10b981"; // Emerald
      case "medium": return "#f59e0b"; // Amber
      case "low": return "#ef4444"; // Red
      default: return "#6b7280"; // Gray
    }
  };

  const getPercentage = (val) => `${Math.round((val || 0) * 100)}%`;
  const getContradictionColor = (val) => val > 0.2 ? "#ef4444" : "#10b981";
  const getSignalColor = (val) => val > 0.7 ? "#10b981" : val > 0.4 ? "#f59e0b" : "#ef4444";

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
            <text x="18" y="20.35" className="percentage">{getPercentage(score)}</text>
          </svg>
          <div className="level-info">
             <h2 style={{ color: getLevelColor(level) }}>{level} Confidence</h2>
             <p className="reason-text">{reason}</p>
          </div>
        </div>
      </div>

      <div className="signals-grid">
         <div className="signal-card tooltip-container">
            <div className="signal-head">
              <span className="signal-title">Robustness</span>
              <span className="signal-value" style={{color: getSignalColor(signals?.robustness)}}>{getPercentage(signals?.robustness)}</span>
            </div>
            <div className="bar-bg"><div className="bar-fill" style={{ width: getPercentage(signals?.robustness), backgroundColor: getSignalColor(signals?.robustness) }}></div></div>
            <span className="tooltip">Similarity across multiple sampled and perturbed variants of the answer.</span>
         </div>

         <div className="signal-card tooltip-container">
            <div className="signal-head">
               <span className="signal-title">Verifiability</span>
               <span className="signal-value" style={{color: getSignalColor(signals?.verifiability)}}>{getPercentage(signals?.verifiability)}</span>
            </div>
            <div className="bar-bg"><div className="bar-fill" style={{ width: getPercentage(signals?.verifiability), backgroundColor: getSignalColor(signals?.verifiability) }}></div></div>
            <span className="tooltip">Self-verified factual correctness and logical consistency of claims.</span>
         </div>
         
         <div className="signal-card tooltip-container">
            <div className="signal-head">
               <span className="signal-title">Calibration</span>
               <span className="signal-value" style={{color: getSignalColor(signals?.calibration)}}>{getPercentage(signals?.calibration)}</span>
            </div>
            <div className="bar-bg"><div className="bar-fill" style={{ width: getPercentage(signals?.calibration), backgroundColor: getSignalColor(signals?.calibration) }}></div></div>
            <span className="tooltip">Ratio of specific facts versus language hedging (might, could, possibly).</span>
         </div>

         <div className="signal-card tooltip-container">
            <div className="signal-head">
               <span className="signal-title">Contradiction</span>
               <span className="signal-value" style={{color: getContradictionColor(signals?.contradiction)}}>{getPercentage(signals?.contradiction)}</span>
            </div>
            <div className="bar-bg"><div className="bar-fill" style={{ width: getPercentage(signals?.contradiction), backgroundColor: getContradictionColor(signals?.contradiction) }}></div></div>
            <span className="tooltip">Penalty for negated statements and internal contradictions in generated variants.</span>
         </div>
      </div>
    </div>
  );
}
