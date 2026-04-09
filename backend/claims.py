import re
from sentence_transformers.util import cos_sim
from confidence import get_embedder

def extract_claims(text: str) -> list[str]:
    sentences = re.split(r'[.?!]', text)
    claims = [s.strip() for s in sentences if len(s.strip()) > 10]
    return claims

def claim_similarity(claims1: list[str], claims2: list[str]) -> float:
    if not claims1 or not claims2:
        return 0.0
    embedder = get_embedder()
    emb1 = embedder.encode(claims1)
    emb2 = embedder.encode(claims2)
    
    sim = cos_sim(emb1, emb2)
    return float(sim.mean())

def overlap_score(all_claim_sets: list[list[str]]) -> float:
    scores = []
    for i in range(len(all_claim_sets)):
        for j in range(i+1, len(all_claim_sets)):
            scores.append(claim_similarity(all_claim_sets[i], all_claim_sets[j]))

    return sum(scores) / len(scores) if scores else 1.0

def contradiction_penalty(claims: list[str]) -> float:
    negative_words = ["not", "no", "never", "cannot", "won't", "don't", "shouldn't", "couldn't"]
    penalty = 0

    for c in claims:
        for word in negative_words:
            # Add simple word boundary to not match "notice" or "knot"
            if re.search(r'\b' + word + r'\b', c.lower()):
                penalty += 1

    return min(penalty / max(len(claims), 1), 1.0)
