import os
import requests
from dotenv import load_dotenv, find_dotenv

# Search upward from this file so it works whether you run from backend/ or root
load_dotenv(find_dotenv(usecwd=False))

HF_TOKEN = os.getenv("HF_TOKEN")
# API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
API_URL = "https://router.huggingface.co/v1/chat/completions"

# Debug: confirm token is loading
print(f"[DEBUG] HF_TOKEN loaded: {'YES ('+HF_TOKEN[:8]+'...)' if HF_TOKEN else 'NO - TOKEN IS NONE'}")

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json",
}

def call_model(prompt: str, temperature: float) -> str:
    payload = {
        "model": "Qwen/Qwen2.5-72B-Instruct",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": 400,
    }
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        print(f"[DEBUG] HF API status: {response.status_code}")
        print(f"[DEBUG] HF API response: {response.text[:300]}")
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[DEBUG] Error on temp={temperature}: {str(e)}")
        return f"Error: {str(e)}"

def generate_variants(prompt: str) -> list[str]:
    temperatures = [0.3, 0.7, 1.0]
    return [call_model(prompt, t) for t in temperatures]
