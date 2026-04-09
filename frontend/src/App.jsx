import { useState } from "react";
import PromptBox from "./components/PromptBox";
import AnswerCard from "./components/AnswerCard";
import ConfidenceDashboard from "./components/ConfidenceBar";
import ClaimsAnalysis from "./components/ClaimsAnalysis";
import RiskBadge from "./components/RiskBadge";
import ExplanationPanel from "./components/ExplanationPanel";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const LOADING_STEPS = [
  "Generating response variants...",
  "Perturbing prompts...",
  "Extracting atomic claims...",
  "Running claim-level verification...",
  "Calibrating language signals...",
  "Aggregating confidence score...",
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setLoadingStep(0);

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 4000);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Something went wrong.");
      }
      const data = await res.json();
      setResult(data);
      setShowRaw(false);
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo-row">
          <span className="logo-icon">🧠</span>
          <h1>AI Confidence Transparency Layer</h1>
        </div>
        <p className="subtitle">
          Multi-axis hallucination detection · Claim-level diagnostics · Risk classification
        </p>
      </header>

      <main className="app-main">
        <PromptBox
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && <div className="error-box">⚠️ {error}</div>}

        {loading && (
          <div className="loading-state">
            <div className="loading-pipeline">
              {LOADING_STEPS.map((step, i) => (
                <div key={i} className={`pipeline-step ${i < loadingStep ? "done" : i === loadingStep ? "active" : "pending"}`}>
                  <span className="step-dot" />
                  <span className="step-label">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="result-section">
            {/* Row 1: Risk badge + Confidence gauge */}
            <div className="top-row">
              <RiskBadge risk={result.risk} />
            </div>

            <ConfidenceDashboard
              level={result.confidence_level}
              score={result.score}
              signals={result.signals}
              taskType={result.task_type}
            />

            {/* Explanation panel */}
            <ExplanationPanel reasons={result.reasons} />

            {/* Claims analysis */}
            <ClaimsAnalysis claims={result.claims_analysis} taskType={result.task_type} />

            {/* Answer — with toggle between highlighted and raw */}
            <AnswerCard
              answer={result.answer}
              highlightedAnswer={result.highlighted_answer}
              showRaw={showRaw}
              onToggle={() => setShowRaw((v) => !v)}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        Built with FastAPI · Hugging Face · React · 5-layer confidence pipeline
      </footer>
    </div>
  );
}

export default App;
