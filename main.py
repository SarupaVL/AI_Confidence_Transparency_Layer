import requests
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

API_URL = "https://router.huggingface.co/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def compute_confidence(texts):
    embeddings = embedder.encode(texts)
    similarity_matrix = cosine_similarity(embeddings)

    sims = [
        similarity_matrix[0][1],
        similarity_matrix[1][2],
        similarity_matrix[0][2]
    ]

    avg_similarity = float(np.mean(sims))

    if avg_similarity > 0.85:
        level = "High"
        reason = "Model responses were highly consistent."
    elif avg_similarity > 0.65:
        level = "Medium"
        reason = "Some variation detected across responses."
    else:
        level = "Low"
        reason = "Significant disagreement across model responses."

    return level, avg_similarity, reason

def query(prompt, temperature=0.7):
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": temperature,
        "max_tokens": 400
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    print("Raw response:", response.text)

    response.raise_for_status()
    return response.json()

def generate_variants(prompt):
    temperatures = [0.3, 0.7, 1.0]
    outputs = []

    for t in temperatures:
        result = query(prompt, temperature=t)
        print(result["choices"][0]["finish_reason"])

        try:
            content = result["choices"][0]["message"]["content"]
        except:
            content = "Error generating response"

        outputs.append(content)

    return outputs

if __name__ == "__main__":
    prompt = "Is astrology scientific?"

    variants = generate_variants(prompt)

    print("\n================ VARIANTS ================\n")
    for i, v in enumerate(variants):
        print(f"\n--- Variant {i+1} ---\n")
        print(v)

    level, score, reason = compute_confidence(variants)

    print("\n================ CONFIDENCE ================\n")
    print("Level:", level)
    print("Score:", score)
    print("Reason:", reason)