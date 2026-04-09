from model import call_llm

def perturb_prompt(prompt: str) -> list[str]:
    return [
        prompt,
        "Answer concisely: " + prompt,
        "Explain in detail: " + prompt
    ]

def generate_perturbed_samples(prompt: str) -> list[str]:
    prompts = perturb_prompt(prompt)
    outputs = []

    for p in prompts:
        outputs.append(call_llm(p, temperature=0.7))

    return outputs
