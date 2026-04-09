def final_confidence(robustness: float, verifiability: float, calibration: float, contradiction: float) -> float:
    score = (
        0.4 * robustness +
        0.4 * verifiability +
        0.2 * calibration
    )

    score -= 0.2 * contradiction

    return max(0.0, min(score, 1.0))

def get_confidence_level_and_reason(score: float, contradiction: float) -> tuple[str, str]:
    if score > 0.85 and contradiction < 0.1:
        return "High", "The model was highly consistent, specific, and self-verified its factual accuracy."
    elif score > 0.60:
        return "Medium", "Moderate variation detected across prompts, or the answer contains some unverifiable elements."
    else:
        return "Low", "Significant disagreement, high uncertainty, or contradiction detected. Trust with caution."
