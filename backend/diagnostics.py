import re
from model import call_llm

def verify_claim(claim: str) -> str:
    """
    Ask the LLM to evaluate a single atomic claim.
    Returns: "supported" | "uncertain" | "contradicted"
    """
    prompt = f"""You are a strict fact-checker. Evaluate this single claim for factual accuracy.

Claim: "{claim}"

Reply with EXACTLY one of these words on the first line:
- supported   (if the claim is factually correct and well-established)
- uncertain   (if you cannot verify it or evidence is mixed)
- contradicted  (if the claim is factually wrong or contradicts established knowledge)

Then on the next line give a brief one-sentence reason.
"""
    result = call_llm(prompt, temperature=0.0, top_p=1.0)
    result_lower = result.strip().lower()

    if result_lower.startswith("supported"):
        return "supported"
    elif result_lower.startswith("contradicted"):
        return "contradicted"
    else:
        return "uncertain"


def evaluate_claims(claims: list[str]) -> list[dict]:
    """
    Score each atomic claim individually.
    Returns a list of {claim, status} dicts.
    """
    results = []
    for claim in claims:
        verdict = verify_claim(claim)
        results.append({"claim": claim, "status": verdict})
        print(f"[DEBUG] Claim: '{claim[:60]}...' → {verdict}")
    return results


def highlight_text(answer: str, claim_results: list[dict]) -> str:
    """
    Replace claim text in the answer with annotated markers.
    Uses fuzzy substring match so small paraphrase differences still get caught.
    """
    highlighted = answer

    for c in claim_results:
        claim_text = c["claim"]
        status = c["status"]

        if status == "contradicted":
            marker = f"[INCORRECT: {claim_text}]"
        elif status == "uncertain":
            marker = f"[UNVERIFIED: {claim_text}]"
        else:
            continue  # Leave supported claims untouched

        # Try exact replacement first, then word-boundary fuzzy match
        if claim_text in highlighted:
            highlighted = highlighted.replace(claim_text, marker, 1)

    return highlighted
