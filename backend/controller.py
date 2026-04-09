from sampling import generate_samples
from perturbation import generate_perturbed_samples
from claims import extract_claims, overlap_score, contradiction_penalty
from verification import self_verify
from calibration import calibration_score
from scoring import final_confidence, get_confidence_level_and_reason

def analyze(prompt: str) -> dict:
    # 1. Multi-Sampling
    samples = generate_samples(prompt)
    
    # 2. Prompt Perturbation
    perturbed = generate_perturbed_samples(prompt)

    all_outputs = samples + perturbed

    # 3. Extract Claims
    claim_sets = [extract_claims(o) for o in all_outputs]
    all_claims_flat = [c for claims in claim_sets for c in claims]

    # Calculate signals
    robustness = overlap_score(claim_sets)
    contradiction = contradiction_penalty(all_claims_flat)
    
    # 4. Verification Engine
    # Use the first sample (standard execution) as the primary answer to verify
    primary_answer = samples[0] if samples else "Error processing."
    verification = self_verify(primary_answer)
    
    # 5. Calibration Engine
    calibration = calibration_score(primary_answer)

    # 6. Aggregation
    confidence = final_confidence(
        robustness=robustness,
        verifiability=verification,
        calibration=calibration,
        contradiction=contradiction
    )

    level, reason = get_confidence_level_and_reason(confidence, contradiction)

    return {
        "answer": primary_answer,
        "confidence_level": level,
        "score": round(confidence, 4),
        "signals": {
            "robustness": round(robustness, 4),
            "verifiability": round(verification, 4),
            "calibration": round(calibration, 4),
            "contradiction": round(contradiction, 4)
        },
        "reason": reason
    }
