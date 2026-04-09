import { useState } from "react";

export default function AnswerCard({ answer, variants }) {
  const [showVariants, setShowVariants] = useState(false);

  return (
    <div className="answer-card">
      <h2 className="answer-heading">AI Response</h2>
      <p className="answer-text">{answer}</p>

      <button
        className="toggle-variants-btn"
        onClick={() => setShowVariants((v) => !v)}
        id="toggle-variants-btn"
      >
        {showVariants ? "Hide" : "Show"} all 3 generated responses ↕
      </button>

      {showVariants && (
        <div className="variants-list">
          {variants.map((v, i) => (
            <div className="variant-item" key={i}>
              <span className="variant-tag">Run {i + 1} (temp: {[0.3, 0.7, 1.0][i]})</span>
              <p>{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
