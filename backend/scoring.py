def final_confidence(
    robustness: float,
    verifiability: float,
    calibration: float,
    contradiction: float,
    task_type: str = "factual"
) -> float:
    """
    Compute weighted confidence score.

    Creative tasks rely entirely on calibration (fluency/quality),
    since variation and unverifiability are expected — not signs of failure.

    Factual / analytical tasks use the full multi-signal formula.
    """
    if task_type == "creative":
        # Verification and robustness are meaningless for creative output.
        # Calibration (specificity, low hedging) is the best proxy for quality.
        score = calibration
    else:
        score = (
            0.4 * robustness +
            0.4 * verifiability +
            0.2 * calibration
        )
        score -= 0.2 * contradiction

    return max(0.0, min(score, 1.0))


def get_confidence_level_and_reason(
    score: float,
    contradiction: float,
    task_type: str = "factual"
) -> tuple[str, str]:
    if task_type == "creative":
        if score > 0.65:
            return "High", "The response is well-formed, specific, and stylistically coherent."
        elif score > 0.40:
            return "Medium", "The response is reasonable but could be more specific or polished."
        else:
            return "Low", "The response is vague or heavily hedged — quality may be limited."

    # Factual / analytical path
    if score > 0.85 and contradiction < 0.1:
        return "High", "The model was highly consistent, specific, and self-verified its factual accuracy."
    elif score > 0.60:
        return "Medium", "Moderate variation detected across prompts, or the answer contains some unverifiable elements."
    else:
        return "Low", "Significant disagreement, high uncertainty, or contradiction detected. Trust with caution."
