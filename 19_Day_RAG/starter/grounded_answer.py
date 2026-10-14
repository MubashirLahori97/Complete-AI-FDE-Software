evidence = {
    "shipping": {"source_id": "FAQ-01", "text": "Standard shipping takes 3 to 5 business days."}
}

def answer(topic):
    source = evidence.get(topic)
    if source is None:
        return {"answer": "The available documents do not answer this question.", "citations": []}
    return {"answer": source["text"], "citations": [source["source_id"]]}

print(answer("shipping")["answer"])
print("Source:", answer("shipping")["citations"][0])
print(answer("international-tax")["answer"])
