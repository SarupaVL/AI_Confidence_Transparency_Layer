import { useState, useRef, useEffect } from "react";
import PromptBox from "./components/PromptBox";
import AnswerCard from "./components/AnswerCard";
import ConfidenceDashboard from "./components/ConfidenceBar";
import ClaimsAnalysis from "./components/ClaimsAnalysis";
import RiskBadge from "./components/RiskBadge";
import ExplanationPanel from "./components/ExplanationPanel";
import NeuralBackground from "./components/NeuralBackground";
import About from "./components/About";
import Compare from "./components/Compare";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const LOADING_STEPS = [
  "Analyzing prompt intent...",
  "Warming up execution node...",
  "Running low-temperature strict sample...",
  "Generating multi-sampled variations...",
  "Perturbing prompt for robustness...",
  "Extracting atomic claims...",
  "Cross-verifying claim density...",
  "Measuring lexical calibration metrics...",
  "Scoring contradiction signals...",
  "Formatting diagnostic output..."
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("chat");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (result || loading || error) {
      scrollToBottom();
    }
  }, [result, loading, error]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setLoadingStep(0);
    // Append user message to history
    setChatHistory((prev) => [...prev, { type: "user", content: prompt }]);

    // Animate loading steps faster
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 1500);

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
      // Append AI result object to chat history
      setChatHistory((prev) => [...prev, { type: "ai", resultData: data }]);
      setShowRaw(false);
      setSidebarOpen(true);
      setActivePage("chat"); // Ensure we switch back to chat if it was background loaded
      setPrompt("");
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  return (
    <div className="layout-wrapper">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setActivePage("chat")} style={{cursor: 'pointer'}}>
          <span className="logo-icon">⬡</span>
          <h1>AI Confidence Layer</h1>
        </div>
        <div className="nav-links">
          <button className={`nav-link-btn ${activePage === "chat" ? "active" : ""}`} onClick={() => setActivePage("chat")}>Chat</button>
          <button className={`nav-link-btn ${activePage === "about" ? "active" : ""}`} onClick={() => setActivePage("about")}>About</button>
          <button className={`nav-link-btn ${activePage === "compare" ? "active" : ""}`} onClick={() => setActivePage("compare")}>Compare</button>
        </div>
        <div className="nav-actions">
          {(result || loading) && (
            <button 
              className={`toggle-sidebar-btn ${sidebarOpen ? 'active' : ''}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Insights Panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="15" y1="3" x2="15" y2="21"></line></svg>
              <span>Insights</span>
            </button>
          )}
        </div>
      </nav>

      <main className="main-content">
        {activePage === "about" ? (
          <About />
        ) : activePage === "compare" ? (
          <Compare />
        ) : (
          <>
            <div className="chat-area">
              {!result && !loading && chatHistory.length === 0 ? (
                <div className="landing-hero fade-in">
                  <div className="bg-container"><NeuralBackground /></div>
                  <div className="landing-content-front">
                    <h2>Understand what the AI <em>actually</em> knows.</h2>
                    <p>
                      A new kind of interface that doesn't just give you an answer.<br/>
                      It multi-samples, perturbs, validates, and highlights hallucinations.
                    </p>
                  </div>
                  <div className="suggested-prompts">
                    <button className="suggested-prompt-btn" onClick={() => setPrompt("Who discovered electricity in 1805?")}>
                      <span className="prompt-icon">→</span> Who discovered electricity in 1805?
                    </button>
                    <button className="suggested-prompt-btn" onClick={() => setPrompt("Is social media harmful?")}>
                      <span className="prompt-icon">→</span> Is social media harmful?
                    </button>
                    <button className="suggested-prompt-btn" onClick={() => setPrompt("Write an atmospheric sci-fi scene about a city built inside a dying star.")}>
                      <span className="prompt-icon">→</span> Write a sci-fi scene about a city in a dying star.
                    </button>
                  </div>
                </div>
              ) : (
            <div className="chat-history">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.type}-message fade-in`}>
                  <div className="message-avatar">{msg.type === "user" ? "U" : "AI"}</div>
                  <div className="message-content">
                    {msg.type === "user" ? msg.content : (
                      <AnswerCard
                        answer={msg.resultData.answer}
                        highlightedAnswer={msg.resultData.highlighted_answer}
                        showRaw={showRaw}
                        onToggle={() => setShowRaw((v) => !v)}
                      />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-message ai-message loading-message fade-in">
                  <div className="message-avatar pulse">AI</div>
                  <div className="message-content">
                    <span className="typing-indicator">Analyzing response context...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="chat-message error-message fade-in">
                   <div className="message-avatar error-avatar">!</div>
                   <div className="message-content">Error: {error}</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          <div className="prompt-container">
            <PromptBox
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              loading={loading}
            />
            <p className="prompt-disclaimer">AI can make mistakes. The transparency layer verifies claims to help you trust the output.</p>
          </div>
        </div>

        {(result || loading) && (
          <aside className={`insights-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="insights-scroll-content">
              <div className="insights-header">
                <h3>Analysis Insights</h3>
              </div>
              <div className="insights-body">
                {loading ? (
                  <div className="sidebar-loading-wrapper fade-in">
                    <div className="loading-pipeline">
                      {LOADING_STEPS.map((step, i) => (
                        <div key={i} className={`pipeline-step ${i < loadingStep ? "done" : i === loadingStep ? "active" : "pending"}`}>
                          <span className="step-dot" />
                          <span className="step-label">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : result ? (
                  <>
                    <RiskBadge risk={result.risk} />
                    
                    <ConfidenceDashboard
                      level={result.confidence_level}
                      score={result.score}
                      signals={result.signals}
                      taskType={result.task_type}
                    />

                    <ExplanationPanel reasons={result.reasons} />

                    <ClaimsAnalysis claims={result.claims_analysis} taskType={result.task_type} />
                  </>
                ) : null}
              </div>
            </div>
          </aside>
        )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
