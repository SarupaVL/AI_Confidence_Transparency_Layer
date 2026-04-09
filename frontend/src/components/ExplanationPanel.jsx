import React from "react";

export default function ExplanationPanel({ reasons }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="explanation-panel fade-in">
      <h3>Why this confidence score?</h3>
      <ul className="reasons-list">
        {reasons.map((r, i) => (
          <li key={i} className="reason-item">
            <span className="reason-bullet">→</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
