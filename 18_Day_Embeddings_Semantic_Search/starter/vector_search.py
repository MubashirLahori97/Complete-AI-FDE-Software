import math

def cosine(left, right):
    if len(left) != len(right):
        raise ValueError("Dimensions must match")
    norm_left = math.sqrt(sum(value * value for value in left))
    norm_right = math.sqrt(sum(value * value for value in right))
    if norm_left == 0 or norm_right == 0:
        raise ValueError("Zero vectors have no cosine similarity")
    return sum(a * b for a, b in zip(left, right)) / (norm_left * norm_right)

query = [0.8, 0.2]
illustrative_document = [1.0, 0.0]
print(f"Illustrative similarity: {cosine(query, illustrative_document):.3f}")
