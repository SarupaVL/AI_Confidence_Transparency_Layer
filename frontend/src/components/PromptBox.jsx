export default function PromptBox({ value, onChange, onSubmit, loading }) {
  const handleKey = (e) => {
    if (e.key === "Enter" && e.ctrlKey) onSubmit();
  };

  return (
    <div className="prompt-box">
      <textarea
        id="prompt-input"
        className="prompt-textarea"
        placeholder="Ask the AI anything… (Ctrl+Enter to submit)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        rows={4}
        disabled={loading}
      />
      <button
        id="submit-btn"
        className="submit-btn"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
      >
        {loading ? "Analysing…" : "Ask AI →"}
      </button>
    </div>
  );
}
