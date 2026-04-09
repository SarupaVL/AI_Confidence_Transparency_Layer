import React from "react";
import ReactMarkdown from "react-markdown";

export default function AnswerCard({ answer, highlightedAnswer, showRaw, onToggle }) {
  // Translate markers into markdown links that we can hijack in the custom renderer
  // We use resilient regexes to handle both the old ⚠️ format and the new format in case backend didn't reload
  const contentToParse = showRaw
    ? answer
    : (highlightedAnswer || answer)
        .replace(/\[(?:⚠️\s*)?POSSIBLY INCORRECT: ([^\]]+)\]/g, "[$1](#incorrect)")
        .replace(/\[INCORRECT: ([^\]]+)\]/g, "[$1](#incorrect)")
        .replace(/\[(?:❓\s*)?UNVERIFIED: ([^\]]+)\]/g, "[$1](#unverified)");

  return (
    <div className="answer-card fade-in">
      <div className="answer-card-header">
        <button className="toggle-btn" onClick={onToggle}>
          {showRaw ? "🔍 Show Highlighted" : "📄 Show Plain"}
        </button>
      </div>

      <div className="markdown-body">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => {
              if (props.href && props.href.includes("#incorrect")) {
                return (
                  <span className="highlight-contradicted" title="This claim may be factually incorrect">
                    {props.children}
                  </span>
                );
              }
              if (props.href && props.href.includes("#unverified")) {
                return (
                  <span className="highlight-uncertain" title="This claim could not be independently verified">
                    {props.children}
                  </span>
                );
              }
              // Normal link fallback
              return <a {...props}>{props.children}</a>;
            }
          }}
        >
          {contentToParse}
        </ReactMarkdown>
      </div>

      {!showRaw && (highlightedAnswer !== answer) && (
        <div className="highlight-legend">
          <span className="legend-item highlight-contradicted">Possibly incorrect</span>
          <span className="legend-item highlight-uncertain">Unverified claim</span>
          <span className="legend-item legend-ok">Plain text = Supported</span>
        </div>
      )}
    </div>
  );
}
