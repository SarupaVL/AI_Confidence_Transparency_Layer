from sampling import generate_samples
from perturbation import generate_perturbed_samples
from claims import extract_claims, overlap_score, contradiction_penalty
from verification import self_verify
from calibration import calibration_score
from scoring import final_confidence, get_confidence_level_and_reason
from risk import classify_risk
from diagnostics import evaluate_claims, highlight_text
from explainer import generate_explanation
from task_classifier import classify_prompt

def analyze(prompt: str) -> dict:
    # 0. Classify task type BEFORE scoring
    task_type = classify_prompt(prompt)
    print(f"[DEBUG] Task type classified as: {task_type}")

    # 1. Multi-Sampling
    samples = generate_samples(prompt)

    # 2. Prompt Perturbation
    perturbed = generate_perturbed_samples(prompt)

    all_outputs = samples + perturbed

    # 3. Extract Claims (from all outputs for robustness/contradiction)
    claim_sets = [extract_claims(o) for o in all_outputs]
    all_claims_flat = [c for claims in claim_sets for c in claims]

    # Aggregate signals
    robustness = overlap_score(claim_sets)
    contradiction = contradiction_penalty(all_claims_flat)

    # 4. Primary answer = first stable sample
    primary_answer = samples[0] if samples else "Error processing."

    # 5. Verification (whole-answer score)
    verification = self_verify(primary_answer)

    # 6. Calibration
    calibration = calibration_score(primary_answer)

    # 7. Aggregated confidence — task-type aware
    confidence = final_confidence(
        robustness=robustness,
        verifiability=verification,
        calibration=calibration,
        contradiction=contradiction,
        task_type=task_type
    )
    level, reason = get_confidence_level_and_reason(confidence, contradiction, task_type)

    # 8. Risk classification — skip for creative (not meaningful)
    if task_type == "creative":
        risk = "CREATIVE"
    else:
        risk = classify_risk(confidence, contradiction, verification)

    # 9. Claim-level diagnostics on primary answer (skip for creative)
    primary_claims = extract_claims(primary_answer)[:6]
    if task_type == "creative":
        # Claim verification doesn't apply — all claims marked as N/A
        claim_results = [{"claim": c, "status": "creative"} for c in primary_claims]
    else:
        claim_results = evaluate_claims(primary_claims)

    # 10. Highlighted answer (skip for creative)
    if task_type == "creative":
        highlighted_answer = primary_answer
    else:
        highlighted_answer = highlight_text(primary_answer, claim_results)

    # 11. Structured explanation
    reasons = generate_explanation(confidence, risk, claim_results, robustness)

    # 12. Serialize claim_results for API
    claims_analysis = [
        {"text": c["claim"], "status": c["status"]}
        for c in claim_results
    ]

    return {
        "answer": primary_answer,
        "highlighted_answer": highlighted_answer,
        "task_type": task_type,
        "confidence_level": level,
        "risk": risk,
        "score": round(confidence, 4),
        "signals": {
            "robustness": round(robustness, 4),
            "verifiability": round(verification, 4),
            "calibration": round(calibration, 4),
            "contradiction": round(contradiction, 4)
        },
        "claims_analysis": claims_analysis,
        "reasons": reasons
    }
