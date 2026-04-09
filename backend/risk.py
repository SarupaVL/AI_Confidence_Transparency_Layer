def classify_risk(confidence: float, contradiction: float, verification: float) -> str:
    """
    Classify overall answer risk based on the three most critical signals.
    RISKY   — output is likely wrong or internally contradictory
    UNCERTAIN — output may be correct but can't be verified
    SAFE    — output is consistent, verified, and calibrated
    """
    if contradiction > 0.5:
        return "RISKY"
    elif verification < 0.4:
        return "RISKY"
    elif confidence < 0.6:
        return "UNCERTAIN"
    else:
        return "SAFE"
