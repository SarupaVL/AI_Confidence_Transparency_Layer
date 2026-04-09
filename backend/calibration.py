import re

hedge_words = ["may", "might", "possibly", "could", "depends", "perhaps", "probably", "presumably", "unlikely", "suggests", "seems", "believe", "assume"]

def hedging_score(text: str) -> float:
    words = text.lower().split()
    if not words:
        return 0.0
    count = sum(word in words for word in hedge_words)
    # Scale slightly so a few hedge words don't completely tank the score
    return min(count / max(len(words), 1) * 10, 1.0) 

def specificity_score(text: str) -> float:
    numbers = len(re.findall(r'\d+', text))
    return min(numbers / 5, 1.0)

def calibration_score(text: str) -> float:
    # High hedging lowers the score. High specificity raises it.
    return 0.5 * (1 - hedging_score(text)) + 0.5 * specificity_score(text)
