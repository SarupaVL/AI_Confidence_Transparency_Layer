from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def compute_confidence(texts: list[str]) -> dict:
    embeddings = embedder.encode(texts)
    sim_matrix = cosine_similarity(embeddings)

    sims = [
        sim_matrix[0][1],
        sim_matrix[1][2],
        sim_matrix[0][2],
    ]
    avg = float(np.mean(sims))

    if avg > 0.85:
        level = "High"
        reason = "Model responses were highly consistent across all runs."
    elif avg > 0.65:
        level = "Medium"
        reason = "Some variation detected across responses — treat with moderate trust."
    else:
        level = "Low"
        reason = "Significant disagreement across responses — the model may be uncertain."

    return {"level": level, "score": round(avg, 4), "reason": reason}
