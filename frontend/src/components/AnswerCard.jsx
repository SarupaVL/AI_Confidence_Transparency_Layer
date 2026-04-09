import React from "react";
import ReactMarkdown from "react-markdown";

export default function AnswerCard({ answer, highlightedAnswer, showRaw, onToggle }) {
  // Parse highlighted answer — replace markers with JSX spans
  const renderHighlighted = (text) => {
    if (!text) return null;

    // Split on our markers and render with appropriate styles
    const parts = [];
    let remaining = text;

    // Regex to match [⚠️ POSSIBLY INCORRECT: ...] and [❓ UNVERIFIED: ...]
    const markerRegex = /\[(⚠️ POSSIBLY INCORRECT|❓ UNVERIFIED): ([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = markerRegex.exec(text)) !== null) {
      // Push plain text before marker
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>
        );
      }

      const isContradicted = match[1].includes("POSSIBLY INCORRECT");
      parts.push(
        <span
          key={match.index}
          className={isContradicted ? "highlight-contradicted" : "highlight-uncertain"}
          title={isContradicted ? "This claim may be factually incorrect" : "This claim could not be independently verified"}
        >
          {isContradicted ? "⚠️" : "❓"} {match[2]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    // Trailing plain text
    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : <span>{text}</span>;
  };

  return (
    <div className="answer-card fade-in">
      <div className="answer-card-header">
        <h3>AI Response</h3>
        <button className="toggle-btn" onClick={onToggle}>
          {showRaw ? "🔍 Show Highlighted" : "📄 Show Plain"}
        </button>
      </div>

      <div className="markdown-body">
        {showRaw ? (
          <ReactMarkdown>{answer}</ReactMarkdown>
        ) : (
          <div className="highlighted-answer">
            {renderHighlighted(highlightedAnswer || answer)}
          </div>
        )}
      </div>

      {!showRaw && (highlightedAnswer !== answer) && (
        <div className="highlight-legend">
          <span className="legend-item highlight-contradicted">⚠️ Possibly incorrect</span>
          <span className="legend-item highlight-uncertain">❓ Unverified claim</span>
          <span className="legend-item legend-ok">Plain text = Supported</span>
        </div>
      )}
    </div>
  );
}
