from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from controller import analyze

app = FastAPI(title="AI Confidence Transparency Layer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

class SignalsBreakdown(BaseModel):
    robustness: float
    verifiability: float
    calibration: float
    contradiction: float

class ClaimResult(BaseModel):
    text: str
    status: str  # "supported" | "uncertain" | "contradicted"

class AnalyzeResponse(BaseModel):
    answer: str
    highlighted_answer: str
    task_type: str
    confidence_level: str
    risk: str
    score: float
    signals: SignalsBreakdown
    claims_analysis: List[ClaimResult]
    reasons: List[str]

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Confidence Transparency Layer is running."}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_endpoint(req: PromptRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        result = analyze(req.prompt)

        if result["answer"].startswith("Error"):
            raise HTTPException(status_code=502, detail=f"Model call failed: {result['answer']}")

        return AnalyzeResponse(
            answer=result["answer"],
            highlighted_answer=result["highlighted_answer"],
            task_type=result["task_type"],
            confidence_level=result["confidence_level"],
            risk=result["risk"],
            score=result["score"],
            signals=result["signals"],
            claims_analysis=result["claims_analysis"],
            reasons=result["reasons"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
