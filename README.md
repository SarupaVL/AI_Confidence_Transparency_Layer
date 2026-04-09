# AI Confidence Transparency Layer

A model-agnostic layer that evaluates AI-generated responses for factual confidence and reliability, using an 8-layer pipeline including risk classification, claim-level hallucination detection, and task-aware scoring.

---
*College project.*

## 🧠 Architecture

```
Prompt
  ↓ Task Classifier (creative / analytical / factual)
  ↓ Multi-Sampling Engine
  ↓ Prompt Perturbation Engine
  ↓ Claim Extraction Engine
  ↓ Verification Engine (per-claim + whole-answer)
  ↓ Calibration Engine
  ↓ Confidence Aggregation (task-type aware weighting)
  ↓ Risk Classifier (SAFE / UNCERTAIN / RISKY / CREATIVE)
  ↓ Claim-Level Diagnostics (hallucination highlighting)
  ↓ Explanation Generator
  ↓ Final output + highlighted answer + signals breakdown
```

## 📦 Signals

| Signal | Weight (factual) | Meaning |
|---|---|---|
| Robustness | 40% | Semantic consistency across sampling variants |
| Verifiability | 40% | Self-verified factual correctness |
| Calibration | 20% | Specificity vs. hedging language ratio |
| Contradiction | Penalty | Negation density across variants |

Creative tasks use **calibration only** — factual verification is skipped.

## 🚀 Running Locally

Double-click `start.bat` to launch both backend and frontend:

```
Backend  → http://localhost:8080
Frontend → http://localhost:5173
```

## 🛠 Tech Stack

- **Backend**: FastAPI, Python, Hugging Face (Qwen2.5-72B-Instruct), sentence-transformers
- **Frontend**: React, Vite, CSS
