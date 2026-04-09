import { useRef, useEffect } from "react";

export default function PromptBox({ value, onChange, onSubmit, loading }) {
  const textareaRef = useRef(null);

  const handleKey = (e) => {
    // Enter without Shift submits
    if (e.key === "Enter" && !e.shiftKey) {
      if (!value.trim()) return;
      e.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="prompt-box">
      <textarea
        ref={textareaRef}
        id="prompt-input"
        className="prompt-textarea"
        placeholder="Ask the AI anything… (Enter to submit, Shift+Enter for newline)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        rows={1}
        disabled={loading}
      />
      <button
        id="submit-btn"
        className="submit-btn"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
      >
        {loading ? "..." : "↑"}
      </button>
    </div>
  );
}
