# AI Confidence Transparency Layer

### What is this?
Basically, LLMs (like GPT or Mistral) are really good at sounding right even when they're totally guessing or making things up. This project is a way to see "under the hood" of how sure an AI actually is about its answer. 

Instead of just getting an answer, you get a transparency layer that tells you if the AI is consistent or if it's just hallucinating.

### 📌 The Problem
A lot of people just trust whatever an AI spits out because it sounds fluent. But fluency != accuracy. This app estimates confidence by asking the model the same thing a few times and seeing if it gives the same answer.

### ⚙️ How it works
1. You type a prompt.
2. The backend hits the Hugging Face API and gets **multiple** responses (we tweak the temperature/parameters to see if it changes its mind).
3. We compare how similar those answers are using some math (sentence embeddings).
4. **Calculated Confidence:**
   - They all say the same thing? -> **High Confidence**
   - They mostly agree but some details change? -> **Medium Confidence**
   - Every answer is different? -> **Low Confidence**

### 🛠 Tech Stack
*   **Frontend:** React (Vite) - *keeps it fast*
*   **Backend:** FastAPI (Python) - *handles the logic and similarity checks*
*   **AI Side:** Hugging Face Inference API (Mistral-7B mostly)
*   **Deployment:** Cloud Run (back) + Vercel (front)

### 🎯 Purpose
This isn't about training a new model. It's about building a better UI/UX for AI where uncertainty isn't hidden. It's just a student project to show how we can make AI more explainable for normal users.

---
*Roughly put together for a college project.*
