// Production RAG (Retrieval-Augmented Generation) Architecture & Hands-on Project Labs
// Enterprise knowledge base retrieval, semantic search, context assembly, and hallucination guards

export interface RagTestCase {
  id: string;
  name: string;
  description: string;
}

export interface RagLab {
  id: string;
  number: number;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  category: string;
  summary: string;
  whyItMattersInProduction: string;
  architectureDiagram: string;
  toyVsProd: {
    toyCode: string;
    prodCode: string;
    keyDifference: string;
  };
  specification: string[];
  starterCode: string;
  solutionCode: string;
  testSuiteCode: string;
  testCases: RagTestCase[];
  productionNotes: string;
}

export const RAG_OVERVIEW = {
  title: 'Production Retrieval-Augmented Generation (RAG) Architecture',
  summary:
    'RAG combines the factual precision of external knowledge bases with the generative reasoning of Large Language Models. Instead of fine-tuning or prompt-stuffing, RAG retrieves relevant document chunks dynamically and injects them into the prompt with verifiable citations.',
  pipelineSteps: [
    {
      step: '1. Ingestion & Chunking',
      description:
        'Raw enterprise documents (PDFs, markdown, docs) are split into semantically coherent chunks (e.g. 300 words with 50-word overlap) with unique chunk IDs and source metadata.',
    },
    {
      step: '2. Embedding Generation',
      description:
        'Chunks are converted into high-dimensional dense vector embeddings representing their semantic meaning in vector space.',
    },
    {
      step: '3. Vector Index & Hybrid Retrieval',
      description:
        'A vector index computes cosine similarity between the user query embedding and stored chunks. Production systems combine dense vector search with sparse keyword (BM25) search.',
    },
    {
      step: '4. Context Assembly & Citation Injection',
      description:
        'The top-k retrieved chunks are formatted with explicit citation tags (`[Doc 1]`, `[Doc 2]`) and bounded within a strict token budget to prevent attention dilution.',
    },
    {
      step: '5. Grounded Generation & Hallucination Guard',
      description:
        'The LLM generates an answer restricted to the injected context. If retrieved similarity is below threshold, the system returns a safe refusal rather than hallucinating.',
    },
  ],
};

export const RAG_LABS: RagLab[] = [
  {
    id: 'rag-lab-1',
    number: 1,
    title: 'Lab 1: Production Text Chunker with Sliding Window & Overlap',
    difficulty: 'beginner',
    duration: '35 min',
    category: 'Ingestion & Chunking',
    summary:
      'Build a production text chunker that splits long documents into fixed-size word windows with overlapping boundaries to prevent loss of sentence context.',
    whyItMattersInProduction:
      'Naively splitting text on character counts or arbitrary newlines chops sentences in half, causing vector embeddings to lose context and degrading retrieval accuracy by over 40%.',
    architectureDiagram:
      'Raw Document -> Token/Word Window (size=W) -> Overlap Stride (overlap=S) -> [Chunk 1, Chunk 2, ...] with doc_id & chunk_id',
    toyVsProd: {
      toyCode: `# Toy approach: arbitrary character slice
chunks = [text[i:i+500] for i in range(0, len(text), 500)]`,
      prodCode: `# Production: Word/token bounded with sliding overlap and metadata
chunks = TextChunker(chunk_size=100, overlap=20).split(text, doc_id="kb-001")`,
      keyDifference:
        'Overlapping windows ensure critical transition sentences are preserved in both adjacent chunks with exact citation offsets.',
    },
    specification: [
      'Create a `DocumentChunk` dataclass or dictionary storing `chunk_id: str`, `doc_id: str`, `text: str`, and `word_count: int`.',
      'Implement `split_text(text: str, doc_id: str, chunk_size: int = 5, overlap: int = 2) -> list[DocumentChunk]`.',
      'Step through words with stride `step = chunk_size - overlap`.',
      'Ensure chunk IDs follow the pattern `{doc_id}-c{index}` (e.g. `doc1-c0`, `doc1-c1`).',
      'Handle edge cases: text shorter than chunk_size returns a single chunk; empty text returns empty list.',
    ],
    starterCode: `class DocumentChunk:
    def __init__(self, chunk_id: str, doc_id: str, text: str, word_count: int):
        self.chunk_id = chunk_id
        self.doc_id = doc_id
        self.text = text
        self.word_count = word_count

class TextChunker:
    """Production document chunker with sliding window overlap."""

    def __init__(self, chunk_size: int = 5, overlap: int = 2):
        if overlap >= chunk_size:
            raise ValueError("Overlap must be smaller than chunk size.")
        self.chunk_size = chunk_size
        self.overlap = overlap

    def split_document(self, text: str, doc_id: str) -> list[DocumentChunk]:
        # TODO: Split text into words
        # TODO: Slide window of chunk_size with stride (chunk_size - overlap)
        # TODO: Return list of DocumentChunk instances with IDs: {doc_id}-c{idx}
        pass
`,
    solutionCode: `class DocumentChunk:
    def __init__(self, chunk_id: str, doc_id: str, text: str, word_count: int):
        self.chunk_id = chunk_id
        self.doc_id = doc_id
        self.text = text
        self.word_count = word_count

class TextChunker:
    """Production document chunker with sliding window overlap."""

    def __init__(self, chunk_size: int = 5, overlap: int = 2):
        if overlap >= chunk_size:
            raise ValueError("Overlap must be smaller than chunk size.")
        self.chunk_size = chunk_size
        self.overlap = overlap

    def split_document(self, text: str, doc_id: str) -> list[DocumentChunk]:
        words = text.strip().split()
        if not words:
            return []

        if len(words) <= self.chunk_size:
            return [DocumentChunk(f"{doc_id}-c0", doc_id, " ".join(words), len(words))]

        chunks = []
        step = self.chunk_size - self.overlap
        idx = 0
        start = 0

        while start < len(words):
            end = min(start + self.chunk_size, len(words))
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words)
            chunks.append(DocumentChunk(f"{doc_id}-c{idx}", doc_id, chunk_text, len(chunk_words)))
            idx += 1
            if end == len(words):
                break
            start += step

        return chunks
`,
    productionNotes:
      'In production Python systems, chunk boundaries often leverage semantic sentence tokenizers (like spaCy or NLTK) or Markdown header hierarchies so headings stay attached to section bodies.',
    testSuiteCode: `def test_suite():
    chunker = TextChunker(chunk_size=5, overlap=2)

    # Test 1: Empty text
    assert chunker.split_document("", "d1") == [], "Empty text must yield empty list"
    print("PASS: test_empty_text")

    # Test 2: Short text
    short = chunker.split_document("FastAPI with Python", "d2")
    assert len(short) == 1
    assert short[0].chunk_id == "d2-c0"
    assert short[0].word_count == 3
    print("PASS: test_short_document")

    # Test 3: Sliding window with overlap
    doc = "alpha beta gamma delta epsilon zeta eta theta"
    # words = 8. chunk_size=5, overlap=2 -> step = 3
    # c0: 0..5 (alpha..epsilon)
    # c1: 3..8 (delta..theta)
    chunks = chunker.split_document(doc, "doc-test")
    assert len(chunks) == 2, f"Expected 2 chunks, got {len(chunks)}"
    assert chunks[0].chunk_id == "doc-test-c0"
    assert chunks[1].chunk_id == "doc-test-c1"
    assert "delta epsilon" in chunks[0].text and "delta epsilon" in chunks[1].text, "Overlap must share words"
    print("PASS: test_sliding_window_overlap")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Empty Handling', description: 'Gracefully returns empty list.' },
      { id: 't2', name: 'Short Documents', description: 'Returns single chunk for short text.' },
      { id: 't3', name: 'Window Overlap', description: 'Maintains overlap across chunk transitions.' },
    ],
  },
  {
    id: 'rag-lab-2',
    number: 2,
    title: 'Lab 2: Dense Vector Index & Cosine Similarity Ranking',
    difficulty: 'intermediate',
    duration: '45 min',
    category: 'Vector Retrieval',
    summary:
      'Build an in-memory vector index that computes cosine similarity between high-dimensional dense vector embeddings, ranks matches, and filters by similarity score.',
    whyItMattersInProduction:
      'Vector databases (Pinecone, Qdrant, Chroma, pgvector) use cosine similarity or dot product over normalized vectors. Understanding the mathematical core enables you to debug retrieval drift.',
    architectureDiagram:
      'Query Vector -> VectorStore -> DotProduct(Q, V) / (||Q|| * ||V||) -> Filter (score >= min_sim) -> Top-K Sort',
    toyVsProd: {
      toyCode: `# Toy: Exact keyword lookup
return [doc for doc in docs if query in doc]`,
      prodCode: `# Production: Semantic vector space search with threshold guard
return vector_store.search(query_vec, top_k=3, min_similarity=0.7)`,
      keyDifference:
        'Dense vector search finds semantically identical concepts even when zero shared vocabulary or keywords exist.',
    },
    specification: [
      'Implement `cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float`.',
      'Formula: `dot(a, b) / (norm(a) * norm(b))`. Handle division by zero safely.',
      'Implement `VectorStore` with `add(chunk_id: str, embedding: list[float], text: str)`.',
      'Implement `search(query_vec: list[float], top_k: int = 3, min_similarity: float = 0.5) -> list[tuple[str, str, float]]`.',
      'Return results sorted descending by similarity score.',
    ],
    starterCode: `import math

def cosine_similarity(a: list[float], b: list[float]) -> float:
    # TODO: Compute dot product and vector magnitudes
    # TODO: Return dot / (mag_a * mag_b)
    pass

class VectorStore:
    def __init__(self):
        self.records = [] # (chunk_id, embedding, text)

    def add(self, chunk_id: str, embedding: list[float], text: str) -> None:
        # TODO: Store record
        pass

    def search(self, query_vec: list[float], top_k: int = 3, min_similarity: float = 0.5) -> list[dict]:
        # TODO: Compute similarity for each record
        # TODO: Filter by min_similarity
        # TODO: Sort descending and return top_k dicts: {"chunk_id": ..., "text": ..., "score": ...}
        pass
`,
    solutionCode: `import math

def cosine_similarity(a: list[float], b: list[float]) -> float:
    if len(a) != len(b):
        raise ValueError("Vectors must have matching dimensions.")

    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))

    if mag_a == 0 or mag_b == 0:
        return 0.0

    return round(dot / (mag_a * mag_b), 4)

class VectorStore:
    def __init__(self):
        self.records = []

    def add(self, chunk_id: str, embedding: list[float], text: str) -> None:
        self.records.append({"chunk_id": chunk_id, "embedding": embedding, "text": text})

    def search(self, query_vec: list[float], top_k: int = 3, min_similarity: float = 0.5) -> list[dict]:
        scored = []
        for rec in self.records:
            score = cosine_similarity(query_vec, rec["embedding"])
            if score >= min_similarity:
                scored.append({
                    "chunk_id": rec["chunk_id"],
                    "text": rec["text"],
                    "score": score,
                })

        scored.sort(key=lambda r: r["score"], reverse=True)
        return scored[:top_k]
`,
    productionNotes:
      'In production with millions of vectors, exhaustive linear search is replaced by Approximate Nearest Neighbor (ANN) index algorithms such as HNSW (Hierarchical Navigable Small World).',
    testSuiteCode: `def test_suite():
    # Test 1: Identical vectors have cosine similarity 1.0
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    assert cosine_similarity(v1, v2) == 1.0, "Identical vectors must equal 1.0"
    print("PASS: test_identical_similarity")

    # Test 2: Orthogonal vectors have similarity 0.0
    v_orth = [0.0, 1.0, 0.0]
    assert cosine_similarity(v1, v_orth) == 0.0, "Orthogonal vectors must equal 0.0"
    print("PASS: test_orthogonal_similarity")

    # Test 3: Vector Store top-k ranking and score threshold
    store = VectorStore()
    store.add("c-auth", [0.9, 0.1, 0.0], "Auth JWT tokens and session expiration.")
    store.add("c-db", [0.1, 0.9, 0.0], "Postgres connection pool settings.")
    store.add("c-cache", [0.8, 0.2, 0.0], "Redis caching and eviction policies.")

    # Search for auth concept
    query = [1.0, 0.0, 0.0]
    results = store.search(query, top_k=2, min_similarity=0.7)

    assert len(results) == 2, "Should return top 2 matches above 0.7"
    assert results[0]["chunk_id"] == "c-auth"
    assert results[0]["score"] > results[1]["score"]
    assert results[1]["chunk_id"] == "c-cache"
    print("PASS: test_vector_store_ranking")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Cosine Math', description: 'Validates dot product and magnitude division.' },
      { id: 't2', name: 'Orthogonal Check', description: 'Returns 0.0 for unrelated vectors.' },
      { id: 't3', name: 'Ranked Retrieval', description: 'Returns sorted top-k matches above threshold.' },
    ],
  },
  {
    id: 'rag-lab-3',
    number: 3,
    title: 'Lab 3: Context Assembly & Token Budget Guard',
    difficulty: 'intermediate',
    duration: '40 min',
    category: 'Context Assembly',
    summary:
      'Assemble retrieved passages into an LLM prompt block with structured citations (`[Doc 1]`, `[Doc 2]`) and enforce strict token budget ceilings to prevent attention dilution.',
    whyItMattersInProduction:
      'Injecting too many retrieved chunks into an LLM prompt causes "Lost in the Middle" degradation, increases latency, and risks token limit errors.',
    architectureDiagram:
      'Retrieved Chunks -> Word/Token Budget Accumulator -> Format "[Doc N] {text}" -> Output (context_str, citation_ids)',
    toyVsProd: {
      toyCode: `# Toy approach: dump all chunks with no budget or citation
context = "\\n".join([c["text"] for c in chunks])`,
      prodCode: `# Production: Budgeted context with explicit citation references
context_text, citations = assemble_context(chunks, max_words=300)`,
      keyDifference:
        'Production context assembly attributes every fact to a document ID and truncates cleanly before exceeding context window budgets.',
    },
    specification: [
      'Create `assemble_context(chunks: list[dict], max_words: int = 50) -> tuple[str, list[str]]`.',
      'Format each chunk as `[Source: {chunk_id}]\\n{text}`.',
      'Accumulate chunks until adding another chunk would exceed `max_words`.',
      'Return the assembled context string and the list of included `chunk_id` strings.',
      'If no chunks fit, return empty string and empty list.',
    ],
    starterCode: `def assemble_context(chunks: list[dict], max_words: int = 50) -> tuple[str, list[str]]:
    """Assembles retrieved chunks into a cited context block within a word budget."""
    # TODO: Iterate through chunks
    # TODO: Count words in chunk text
    # TODO: If total_words + chunk_words <= max_words, append to context and record chunk_id
    # TODO: Return "\\n\\n".join(formatted_blocks), included_citations
    pass
`,
    solutionCode: `def assemble_context(chunks: list[dict], max_words: int = 50) -> tuple[str, list[str]]:
    """Assembles retrieved chunks into a cited context block within a word budget."""
    formatted_blocks = []
    included_citations = []
    current_word_count = 0

    for chunk in chunks:
        text = chunk.get("text", "").strip()
        chunk_id = chunk.get("chunk_id", "unknown")
        words = text.split()
        word_count = len(words)

        if current_word_count + word_count <= max_words:
            formatted_blocks.append(f"[Source: {chunk_id}]\\n{text}")
            included_citations.append(chunk_id)
            current_word_count += word_count
        else:
            # Budget exhausted; stop appending further chunks
            break

    return "\\n\\n".join(formatted_blocks), included_citations
`,
    productionNotes:
      'Production RAG systems use tokenizer libraries like tiktoken to count exact BPE tokens rather than whitespace words, ensuring sub-millimeter precision before calling LLM APIs.',
    testSuiteCode: `def test_suite():
    chunks = [
        {"chunk_id": "doc-1", "text": "Python is a high level programming language."},  # 7 words
        {"chunk_id": "doc-2", "text": "FastAPI provides high performance ASGI routing."}, # 6 words
        {"chunk_id": "doc-3", "text": "Pydantic validates structured data schemas at runtime with Rust."}, # 9 words
    ]

    # Test 1: Budget allows all chunks (max_words=30)
    ctx, citations = assemble_context(chunks, max_words=30)
    assert len(citations) == 3
    assert citations == ["doc-1", "doc-2", "doc-3"]
    assert "[Source: doc-1]" in ctx
    print("PASS: test_full_budget_assembly")

    # Test 2: Budget stops at 10 words (only doc-1 fits: 7 words <= 10)
    ctx_small, citations_small = assemble_context(chunks, max_words=10)
    assert citations_small == ["doc-1"], f"Expected ['doc-1'], got {citations_small}"
    assert "doc-2" not in ctx_small
    print("PASS: test_budget_truncation")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Context Formatting', description: 'Formats [Source: ID] headers.' },
      { id: 't2', name: 'Budget Guard', description: 'Stops accumulation before exceeding ceiling.' },
      { id: 't3', name: 'Citation Tracking', description: 'Returns exact citation list for attribution.' },
    ],
  },
  {
    id: 'rag-lab-4',
    number: 4,
    title: 'Lab 4: End-to-End Grounded RAG Pipeline & Hallucination Guard',
    difficulty: 'advanced',
    duration: '50 min',
    category: 'End-to-End Systems',
    summary:
      'Integrate the Chunker, Vector Store, and Context Assembler into an autonomous RAG question-answering pipeline with a strict hallucination guard that refuses to answer when retrieved confidence is low.',
    whyItMattersInProduction:
      'An ungrounded AI bot that hallucinates incorrect answers damages user trust. Production systems enforce confidence thresholds: if retrieval confidence < threshold, return a safe refusal.',
    architectureDiagram:
      'Query -> Retrieve Top-K -> Confidence Check (score >= 0.6?) -> YES: Synthesize Cited Answer | NO: Safe Refusal',
    toyVsProd: {
      toyCode: `# Toy: Always query LLM even if no documents matched
return llm.generate(f"Context: {context}\\nQuestion: {query}")`,
      prodCode: `# Production: Grounding guardrail
if not retrieved_chunks or max_score < CONFIDENCE_THRESHOLD:
    return {"answer": "Insufficient grounded evidence in knowledge base.", "citations": []}`,
      keyDifference:
        'Prevents hallucinations by refusing to guess when supporting context is missing or low-confidence.',
    },
    specification: [
      'Create `ProductionRagEngine` initialized with a `VectorStore` and `min_confidence: float = 0.65`.',
      'Implement `ingest_document(doc_id: str, text: str, embedding_generator_fn)` using `TextChunker`.',
      'Implement `answer_query(query: str, query_vec: list[float], max_context_words: int = 100) -> dict`.',
      'If top retrieval score < `min_confidence`, return `{"status": "refusal", "answer": "Insufficient grounded context.", "citations": []}`.',
      'If confident, format context and return `{"status": "grounded", "answer": f"Answer based on context...", "citations": citations, "confidence": top_score}`.',
    ],
    starterCode: `class ProductionRagEngine:
    """Full-stack grounded RAG pipeline with hallucination guardrail."""

    def __init__(self, vector_store, chunker, min_confidence: float = 0.65):
        self.vector_store = vector_store
        self.chunker = chunker
        self.min_confidence = min_confidence

    def answer_query(self, query: str, query_vec: list[float]) -> dict:
        # TODO: Search vector_store for top 3 matches
        # TODO: If no matches or top match score < min_confidence:
        #           return {"status": "refusal", "answer": "Insufficient grounded context.", "citations": []}
        # TODO: Assemble context from retrieved chunks
        # TODO: Return {"status": "grounded", "answer": ..., "citations": ..., "confidence": ...}
        pass
`,
    solutionCode: `class ProductionRagEngine:
    """Full-stack grounded RAG pipeline with hallucination guardrail."""

    def __init__(self, vector_store, chunker, min_confidence: float = 0.65):
        self.vector_store = vector_store
        self.chunker = chunker
        self.min_confidence = min_confidence

    def answer_query(self, query: str, query_vec: list[float]) -> dict:
        results = self.vector_store.search(query_vec, top_k=3, min_similarity=0.1)

        if not results or results[0]["score"] < self.min_confidence:
            return {
                "status": "refusal",
                "answer": "Insufficient grounded context.",
                "citations": [],
                "confidence": results[0]["score"] if results else 0.0,
            }

        top_score = results[0]["score"]
        citations = [r["chunk_id"] for r in results if r["score"] >= self.min_confidence]
        synthesized_answer = f"Grounded response addressing '{query}' backed by {len(citations)} verified sources."

        return {
            "status": "grounded",
            "answer": synthesized_answer,
            "citations": citations,
            "confidence": top_score,
        }
`,
    productionNotes:
      'In production, evaluation harnesses like Ragas or TruLens run automated evals measuring Faithfulness (is the answer grounded in context?) and Context Recall (did retrieval capture all necessary facts?).',
    testSuiteCode: `def test_suite():
    # Setup mock vector store
    class MockVectorStore:
        def __init__(self, results):
            self.results = results
        def search(self, vec, top_k=3, min_similarity=0.1):
            return self.results

    # Test 1: Grounded query with high confidence
    confident_store = MockVectorStore([
        {"chunk_id": "c-101", "text": "PostgreSQL connection pool max_size is 20.", "score": 0.88},
        {"chunk_id": "c-102", "text": "Database timeouts happen when pool is exhausted.", "score": 0.72},
    ])
    engine = ProductionRagEngine(vector_store=confident_store, chunker=None, min_confidence=0.65)
    res = engine.answer_query("How to configure DB pool?", [1.0, 0.0])

    assert res["status"] == "grounded"
    assert res["citations"] == ["c-101", "c-102"]
    assert res["confidence"] == 0.88
    print("PASS: test_grounded_answer")

    # Test 2: Low confidence query triggers hallucination refusal
    unconfident_store = MockVectorStore([
        {"chunk_id": "c-999", "text": "Unrelated gardening tips.", "score": 0.32}
    ])
    engine_guarded = ProductionRagEngine(vector_store=unconfident_store, chunker=None, min_confidence=0.65)
    refusal_res = engine_guarded.answer_query("What is the capital of Mars?", [0.0, 1.0])

    assert refusal_res["status"] == "refusal"
    assert "Insufficient grounded context" in refusal_res["answer"]
    assert refusal_res["citations"] == []
    print("PASS: test_hallucination_guard_refusal")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Grounded Query', description: 'Returns cited answer when confidence is high.' },
      { id: 't2', name: 'Hallucination Refusal', description: 'Refuses to answer when evidence is weak.' },
      { id: 't3', name: 'Citation Extraction', description: 'Attributes answer to valid chunk citations.' },
    ],
  },
];

export const RAG_STORAGE_KEY = 'fde-rag-progress-v1';
export const RAG_DRAFTS_KEY = 'fde-rag-drafts-v1';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return null;
}

export function loadRagProgress(): Record<string, boolean> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(RAG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRagCleared(labId: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const current = loadRagProgress();
    current[labId] = true;
    storage.setItem(RAG_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage quota
  }
}

export function loadRagDrafts(): Record<string, string> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(RAG_DRAFTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRagDraft(labId: string, code: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const drafts = loadRagDrafts();
    drafts[labId] = code;
    storage.setItem(RAG_DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // LocalStorage quota
  }
}
