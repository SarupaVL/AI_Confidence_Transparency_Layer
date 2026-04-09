from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from controller import analyze

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

class SignalsBreakdown(BaseModel):
    robustness: float
    verifiability: float
    calibration: float
    contradiction: float

class AnalyzeResponse(BaseModel):
    answer: str
    confidence_level: str
    score: float
    signals: SignalsBreakdown
    reason: str

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Confidence Transparency Layer is running."}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_endpoint(req: PromptRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        result = analyze(req.prompt)
        # Check if model call failed immediately on primary answer
        if result["answer"].startswith("Error"):
             raise HTTPException(status_code=502, detail=f"Model call failed: {result['answer']}")
             
        return AnalyzeResponse(
            answer=result["answer"],
            confidence_level=result["confidence_level"],
            score=result["score"],
            signals=result["signals"],
            reason=result["reason"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
