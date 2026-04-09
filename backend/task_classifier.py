def classify_prompt(prompt: str) -> str:
    """
    Classify the prompt into one of three task types that require
    different confidence interpretation strategies.

    Returns: "creative" | "analytical" | "factual"
    """
    p = prompt.lower()

    creative_words = [
        "story", "poem", "imagine", "invent", "create", "write a", "generate a",
        "fiction", "narrative", "fantasy", "describe a scene", "compose"
    ]
    analytical_words = [
        "explain", "why", "how", "should", "what causes", "what is the reason",
        "compare", "analyze", "analyse", "difference between", "pros and cons",
        "evaluate", "argue", "opinion", "think about"
    ]

    if any(word in p for word in creative_words):
        return "creative"
    elif any(word in p for word in analytical_words):
        return "analytical"
    else:
        return "factual"
