# AI Confidence Transparency Layer

A model-agnostic layer that evaluates AI-generated responses for factual confidence and reliability, breaking down an LLM's certainty across an advanced 5-layer pipeline.

---
*Roughly put together for a college project.*

## 🧠 Architecture
- **Layer 1: Multi-Sampling Engine** – Samples completions at varying temperatures.
- **Layer 2: Prompt Perturbation Engine** – Modifies prompts to test output robustness.
- **Layer 3: Claim Extraction Engine** – Breaks down text into atomic facts and checks semantic overlap/contradiction.
- **Layer 4: Verification Engine** – Subjects the answer to zero-temperature adversarial judgment.
- **Layer 5: Calibration Engine** – Penalizes subjective, hedged language and rewards factual specificity.

## 🚀 Running Locally
Run the convenient startup script to launch both the backend (FastAPI) and frontend (React):
```cmd
start.bat
```
