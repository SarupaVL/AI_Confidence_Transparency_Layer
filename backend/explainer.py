def generate_explanation(
    confidence: float,
    risk: str,
    claim_results: list[dict],
    robustness: float
) -> list[str]:
    """
    Build structured, human-readable reasons from signals.
    Each item is a standalone insight the user can act on.
    """
    reasons = []

    # Creative tasks have a completely different interpretation
    if risk == "CREATIVE":
        reasons.append("This is a creative task — variation across outputs is expected and normal.")
        reasons.append("Confidence reflects output quality and fluency, not factual accuracy.")
        if confidence > 0.65:
            reasons.append("The response appears well-formed and stylistically coherent.")
        else:
            reasons.append("The response may benefit from more specificity or structure.")
        return reasons

    if robustness < 0.6:
        reasons.append("Model responses varied significantly across sampling runs.")

    if robustness >= 0.6 and robustness < 0.8:
        reasons.append("Moderate consistency across response variants.")

    contradicted = sum(1 for c in claim_results if c["status"] == "contradicted")
    uncertain = sum(1 for c in claim_results if c["status"] == "uncertain")
    supported = sum(1 for c in claim_results if c["status"] == "supported")

    if supported > 0:
        reasons.append(f"{supported} claim{'s' if supported > 1 else ''} verified as factually supported.")

    if contradicted == 1:
        reasons.append("1 claim appears to be factually incorrect — highlighted in the response.")
    elif contradicted > 1:
        reasons.append(f"{contradicted} claims appear to be factually incorrect — highlighted in the response.")

    if uncertain == 1:
        reasons.append("1 claim could not be independently verified.")
    elif uncertain > 1:
        reasons.append(f"{uncertain} claims could not be independently verified.")

    if confidence > 0.8 and (contradicted > 0 or uncertain > 0):
        reasons.append("Model shows signs of overconfidence — the score is high despite unverifiable claims.")

    if risk == "RISKY" and not reasons:
        reasons.append("High contradiction rate or very low verifiability — treat with significant caution.")

    if not reasons:
        reasons.append("All signals are within acceptable ranges. The response appears reliable.")

    return reasons
