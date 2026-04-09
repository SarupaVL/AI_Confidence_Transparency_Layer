import { useState } from "react";
import PromptBox from "./components/PromptBox";
import AnswerCard from "./components/AnswerCard";
import ConfidenceDashboard from "./components/ConfidenceBar";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

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
    } catch (e) {
      setError(e.message);
    } finally {
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
          Ask anything. See how confident the AI actually is — built on a multi-signal verification pipeline.
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
            <div className="spinner" />
            <p>Sampling variants, perturbing facts, and computing confidence signals…</p>
          </div>
        )}

        {result && (
          <div className="result-section">
            <ConfidenceDashboard 
                level={result.confidence_level} 
                score={result.score} 
                reason={result.reason} 
                signals={result.signals} 
            />
            <AnswerCard answer={result.answer} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        Built with FastAPI + Hugging Face + React · Multi-Axis Calibration Layer
      </footer>
    </div>
  );
}

export default App;
