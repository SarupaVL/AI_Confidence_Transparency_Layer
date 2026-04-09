const COLOR_MAP = {
  High: { bar: "#22c55e", bg: "#052e16", badge: "#16a34a", emoji: "🟢" },
  Medium: { bar: "#f59e0b", bg: "#1c1400", badge: "#b45309", emoji: "🟡" },
  Low: { bar: "#ef4444", bg: "#1f0000", badge: "#b91c1c", emoji: "🔴" },
};

export default function ConfidenceBar({ level, score, reason }) {
  const colors = COLOR_MAP[level] || COLOR_MAP["Medium"];
  const percent = Math.round(score * 100);

  return (
    <div className="confidence-card" style={{ background: colors.bg }}>
      <div className="confidence-header">
        <span className="confidence-emoji">{colors.emoji}</span>
        <span className="confidence-label">
          Confidence:{" "}
          <span className="confidence-badge" style={{ background: colors.badge }}>
            {level}
          </span>
        </span>
        <span className="confidence-score">{percent}%</span>
      </div>

      <div className="confidence-track">
        <div
          className="confidence-fill"
          style={{ width: `${percent}%`, background: colors.bar }}
        />
      </div>

      <p className="confidence-reason">{reason}</p>
    </div>
  );
}
