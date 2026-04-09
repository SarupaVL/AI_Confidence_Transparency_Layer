import React from "react";
import ReactMarkdown from "react-markdown";

export default function AnswerCard({ answer }) {
  return (
    <div className="answer-card fade-in">
      <h3>AI Response</h3>
      <div className="markdown-body">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
}
