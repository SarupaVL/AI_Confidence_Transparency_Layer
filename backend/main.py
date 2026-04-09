from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import generate_variants
from confidence import compute_confidence

app = FastAPI(title="AI Confidence Transparency Layer")

# Allow all origins for demo/dev — tighten for prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

class AnalyzeResponse(BaseModel):
    answer: str
    confidence: str
    score: float
    reason: str
    variants: list[str]

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Confidence Transparency Layer is running."}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: PromptRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    variants = generate_variants(req.prompt)

    if all(v.startswith("Error") for v in variants):
        raise HTTPException(status_code=502, detail="All model calls failed. Check your HF token.")

    confidence_result = compute_confidence(variants)

    return AnalyzeResponse(
        answer=variants[1],          # middle-temperature response as primary answer
        confidence=confidence_result["level"],
        score=confidence_result["score"],
        reason=confidence_result["reason"],
        variants=variants,
    )
