from model import call_llm
from sentence_transformers.util import cos_sim
from confidence import get_embedder

def similarity(samples: list[str]) -> float:
    if len(samples) < 2:
        return 1.0
    embedder = get_embedder()
    emb = embedder.encode(samples)
    
    sims = []
    # Pairwise similarity
    for i in range(len(samples)):
        for j in range(i+1, len(samples)):
            sim = float(cos_sim(emb[i], emb[j])[0][0])
            sims.append(sim)
            
    return sum(sims) / len(sims) if sims else 1.0

def generate_samples(prompt: str) -> list[str]:
    configs = [
        {"temperature": 0.2, "top_p": 0.8},
        {"temperature": 0.7, "top_p": 0.9}
    ]

    outputs = []
    for cfg in configs:
        outputs.append(call_llm(prompt, **cfg))

    # Adaptive expansion if low similarity
    if similarity(outputs) < 0.8:
        print("[DEBUG] Low similarity detected, generating 3rd adaptive sample")
        outputs.append(call_llm(prompt, temperature=1.2, top_p=1.0))

    return outputs
