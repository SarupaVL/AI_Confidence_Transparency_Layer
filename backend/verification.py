import re
from model import call_llm

def parse_score(result: str) -> float:
    # Look for a number between 0 and 1
    match = re.search(r'0\.\d+|1\.0|0', result)
    if match:
        return float(match.group())
    return 0.5  # Neutral fallback

def self_verify(answer: str) -> float:
    prompt = f"""
    Evaluate the factual correctness of the following answer.
    Give a confidence score from 0 to 1 representing the likelihood that the answer is factually correct.
    Include the score on a new line and briefly list possible issues if any.

    Answer:
    {answer}
    """
    
    # We use a relatively low temperature for analytical tasks
    result = call_llm(prompt, temperature=0.1)
    print(f"[DEBUG] Verification raw output: {result[:100].replace(chr(10), ' ')}")
    return parse_score(result)
