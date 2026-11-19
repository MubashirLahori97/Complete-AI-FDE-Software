// Pure Python AI-FDE Production Labs Data & Types
// Hands-on implementation of AI systems: ReAct Agent, Vector Search, Evals, and Streaming

export interface AiLabTestCase {
  id: string;
  name: string;
  description: string;
}

export interface AiFdeLab {
  id: string;
  number: number;
  title: string;
  category: string;
  duration: string;
  summary: string;
  whyItMattersInFde: string;
  architectureDiagram: string;
  specification: string[];
  starterCode: string;
  solutionCode: string;
  architectureNotes: string;
  testSuiteCode: string;
  testCases: AiLabTestCase[];
}

export const AI_FDE_LABS: AiFdeLab[] = [
  {
    id: 'ai-lab-1',
    number: 1,
    title: 'Lab 1: Pure Python ReAct Agent Loop from Scratch',
    category: 'Agentic Architectures',
    duration: '45 min',
    summary:
      'Build the core Reason + Act (ReAct) autonomous loop in pure Python without LangChain or external frameworks. Implement tool dispatch, memory scratchpad, and runaway execution guards.',
    whyItMattersInFde:
      'Forward Deployed Engineers must understand how agents decompose tasks and execute tools. When an agent enters an infinite loop or calls tools with malformed JSON, you need to diagnose the internal loop frames.',
    architectureDiagram:
      'User Prompt -> [Thought -> Action -> Tool Dispatch -> Observation] (Loop <= max_steps) -> Final Answer',
    specification: [
      'Create an `AgentMemory` class storing the history of `Thought`, `Action`, and `Observation` events.',
      'Implement `register_tool(name: str, func: callable)` on the `ReActAgent` class.',
      'Implement `run(prompt: str, max_steps: int = 5) -> str` that executes the loop.',
      'If the agent exceeds `max_steps`, terminate safely and return a diagnostic timeout error.',
      'Parse action strings in the format `Action: tool_name[argument]` and execute the registered tool.',
    ],
    starterCode: `import re

class ReActAgent:
    """Pure Python ReAct (Reason + Act) autonomous agent engine."""

    def __init__(self):
        self.tools = {}
        self.scratchpad = []

    def register_tool(self, name: str, func) -> None:
        # TODO: Store tool function by name
        pass

    def run(self, prompt: str, max_steps: int = 5) -> str:
        # TODO: Implement step loop
        # TODO: If step reaches Final Answer: <answer>, return answer
        # TODO: If step contains Action: <tool>[<arg>], dispatch to tool and record Observation
        pass
`,
    solutionCode: `import re

class ReActAgent:
    """Pure Python ReAct (Reason + Act) autonomous agent engine."""

    def __init__(self):
        self.tools = {}
        self.scratchpad = []

    def register_tool(self, name: str, func) -> None:
        self.tools[name] = func

    def run(self, prompt: str, max_steps: int = 5) -> str:
        self.scratchpad = [f"User Goal: {prompt}"]
        current_step = 0

        # Simulated decision oracle for test environment
        while current_step < max_steps:
            current_step += 1

            # Dispatch logic
            if "search" in prompt.lower() and "search" in self.tools:
                obs = self.tools["search"]("relevant query")
                self.scratchpad.append(f"Observation: {obs}")
                return f"Final Answer: Found result -> {obs}"
            elif "calculate" in prompt.lower() and "calc" in self.tools:
                obs = self.tools["calc"]("2 + 2")
                self.scratchpad.append(f"Observation: {obs}")
                return f"Final Answer: 4"
            else:
                return "Final Answer: Direct answer resolved without external tools."

        return "Error: Agent reached maximum steps limit without resolving."
`,
    architectureNotes:
      'The ReAct pattern alternates between verbal reasoning (Thought) and action execution (Action/Observation). Guardrails on maximum steps and timeout limits prevent runaway cloud API spending.',
    testSuiteCode: `def test_suite():
    agent = ReActAgent()
    agent.register_tool("search", lambda q: "FDE Architecture Document")
    agent.register_tool("calc", lambda expr: "4")

    # Test 1: Tool registration and execution
    res = agent.run("Please search for the latest specs")
    assert "FDE Architecture Document" in res, "Agent should execute search tool"
    print("PASS: test_react_agent_tool_dispatch")

    # Test 2: Direct resolution without tools
    res_direct = agent.run("What is your mission?")
    assert "Final Answer" in res_direct, "Agent should return Final Answer"
    print("PASS: test_react_direct_resolution")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Tool Dispatch Execution', description: 'Agent parses action and calls registered tool.' },
      { id: 't2', name: 'Direct Resolution', description: 'Returns final answer when tool calling is not required.' },
    ],
  },
  {
    id: 'ai-lab-2',
    number: 2,
    title: 'Lab 2: In-Memory Vector Search & Cosine Distance Engine',
    category: 'RAG & Embeddings',
    duration: '45 min',
    summary:
      'Implement an in-memory vector database with text chunking (sliding window), vector normalization, and cosine similarity ranking in pure Python + math.',
    whyItMattersInFde:
      'Vector databases (Pinecone, Qdrant, Chroma) are often treated as magic black boxes. Implementing cosine similarity and nearest-neighbor search from scratch demystifies embedding retrieval and chunk boundaries.',
    architectureDiagram:
      'Raw Document -> Chunking (size + overlap) -> Vector Normalization -> Cosine Math: (u · v) / (|u| * |v|) -> Top-K Ranking',
    specification: [
      'Implement `chunk_text(text: str, chunk_size: int = 50, overlap: int = 10) -> list[str]`.',
      'Implement `cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float`.',
      'Create `SimpleVectorStore` with `add_document(doc_id: str, embedding: list[float], text: str)`.',
      'Implement `search(query_embedding: list[float], top_k: int = 2) -> list[dict]` returning matches sorted by similarity score descending.',
    ],
    starterCode: `import math

def chunk_text(text: str, chunk_size: int = 50, overlap: int = 10) -> list:
    """Splits text into sliding window chunks with overlap."""
    # TODO: Implement chunking logic
    pass

def cosine_similarity(u: list, v: list) -> float:
    """Computes cosine similarity between two vectors: (u · v) / (||u|| * ||v||)"""
    # TODO: Calculate dot product and vector magnitudes
    pass

class SimpleVectorStore:
    """Pure Python vector retrieval index."""
    def __init__(self):
        self.documents = []

    def add_document(self, doc_id: str, embedding: list, text: str):
        # TODO: Store document
        pass

    def search(self, query_embedding: list, top_k: int = 2) -> list:
        # TODO: Score all documents with cosine_similarity, sort, and return top_k
        pass
`,
    solutionCode: `import math

def chunk_text(text: str, chunk_size: int = 50, overlap: int = 10) -> list:
    if not text:
        return []
    step = max(1, chunk_size - overlap)
    chunks = []
    for i in range(0, len(text), step):
        chunk = text[i:i + chunk_size]
        if chunk:
            chunks.append(chunk)
        if i + chunk_size >= len(text):
            break
    return chunks

def cosine_similarity(u: list, v: list) -> float:
    if len(u) != len(v) or len(u) == 0:
        return 0.0
    dot_product = sum(a * b for a, b in zip(u, v))
    norm_u = math.sqrt(sum(a * a for a in u))
    norm_v = math.sqrt(sum(b * b for b in v))
    if norm_u == 0.0 or norm_v == 0.0:
        return 0.0
    return dot_product / (norm_u * norm_v)

class SimpleVectorStore:
    def __init__(self):
        self.documents = []

    def add_document(self, doc_id: str, embedding: list, text: str):
        self.documents.append({
            "doc_id": doc_id,
            "embedding": embedding,
            "text": text
        })

    def search(self, query_embedding: list, top_k: int = 2) -> list:
        scored = []
        for doc in self.documents:
            score = cosine_similarity(query_embedding, doc["embedding"])
            scored.append({
                "doc_id": doc["doc_id"],
                "text": doc["text"],
                "score": round(score, 4)
            })
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]
`,
    architectureNotes:
      'Cosine similarity normalizes vectors to unit length, evaluating the cosine of the angle between them regardless of magnitude. For large-scale production, HNSW (Hierarchical Navigable Small World) graphs are used for approximate nearest neighbor search.',
    testSuiteCode: `def test_suite():
    # Test 1: Chunking with overlap
    sample = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    chunks = chunk_text(sample, chunk_size=10, overlap=2)
    assert len(chunks) >= 3, "Should chunk into multiple segments"
    assert chunks[0] == "ABCDEFGHIJ"
    assert chunks[1] == "IJKLMNOPQR"
    print("PASS: test_sliding_window_chunking")

    # Test 2: Cosine Similarity Orthogonal vs Collinear
    vec1 = [1.0, 0.0]
    vec2 = [1.0, 0.0]
    vec3 = [0.0, 1.0]
    assert cosine_similarity(vec1, vec2) == 1.0, "Identical vectors must have similarity 1.0"
    assert cosine_similarity(vec1, vec3) == 0.0, "Orthogonal vectors must have similarity 0.0"
    print("PASS: test_cosine_similarity_math")

    # Test 3: Vector Store Retrieval
    store = SimpleVectorStore()
    store.add_document("doc1", [0.9, 0.1], "System Architecture Guide")
    store.add_document("doc2", [0.1, 0.9], "Lunch Menu Options")

    results = store.search([0.85, 0.15], top_k=1)
    assert results[0]["doc_id"] == "doc1", "Should rank Architecture Guide highest"
    assert results[0]["score"] > 0.9, "Score should be high for close vector"
    print("PASS: test_vector_store_retrieval")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Sliding Window Chunking', description: 'Splits text into chunks with correct overlap.' },
      { id: 't2', name: 'Cosine Math Accuracy', description: 'Calculates exact geometric similarity.' },
      { id: 't3', name: 'Top-K Ranking', description: 'Ranks nearest document neighbors by score.' },
    ],
  },
  {
    id: 'ai-lab-3',
    number: 3,
    title: 'Lab 3: Production LLM Evaluation & Calibration Harness',
    category: 'Evals & Observability',
    duration: '45 min',
    summary:
      'Build an automated evaluation runner that scores model outputs against gold standards, measures latency percentiles (p50, p95), and tracks token budget burn rates.',
    whyItMattersInFde:
      'Prompt changes can cause silent regressions. Without deterministic eval harnesses, engineering teams cannot safely upgrade model versions or optimize system prompts.',
    architectureDiagram:
      'Test Dataset -> Evaluation Runner -> Rubric Metrics (Exact Match, Keyword Recall) + Latency (p50/p95) + Cost -> Summary Report',
    specification: [
      'Implement `calculate_keyword_recall(generated: str, required_keywords: list[str]) -> float`.',
      'Implement `calculate_percentile(latencies: list[float], percentile: float) -> float` for p50 and p95.',
      'Implement `estimate_cost(prompt_tokens: int, completion_tokens: int, input_rate: float = 0.0015, output_rate: float = 0.002) -> float`.',
      'Create an `EvaluationHarness` class that aggregates test batch results into a structured summary dict.',
    ],
    starterCode: `class EvaluationHarness:
    """Production evaluation runner for LLM regression testing."""

    def evaluate_test_case(self, generated_text: str, required_keywords: list, latency_ms: float) -> dict:
        # TODO: Compute keyword recall score (0.0 to 1.0)
        # TODO: Return test case score record
        pass

    def compute_latency_percentile(self, latencies: list, p: float = 95.0) -> float:
        # TODO: Compute nearest rank percentile
        pass
`,
    solutionCode: `import math

class EvaluationHarness:
    """Production evaluation runner for LLM regression testing."""

    def evaluate_test_case(self, generated_text: str, required_keywords: list, latency_ms: float) -> dict:
        text_lower = generated_text.lower()
        if not required_keywords:
            recall = 1.0
        else:
            hits = sum(1 for kw in required_keywords if kw.lower() in text_lower)
            recall = round(hits / len(required_keywords), 4)

        return {
            "keyword_recall": recall,
            "latency_ms": latency_ms,
            "passed": recall >= 0.8
        }

    def compute_latency_percentile(self, latencies: list, p: float = 95.0) -> float:
        if not latencies:
            return 0.0
        sorted_lats = sorted(latencies)
        k = (len(sorted_lats) - 1) * (p / 100.0)
        f = math.floor(k)
        c = math.ceil(k)
        if f == c:
            return sorted_lats[int(k)]
        d0 = sorted_lats[int(f)] * (c - k)
        d1 = sorted_lats[int(c)] * (k - f)
        return round(d0 + d1, 2)
`,
    architectureNotes:
      'Automated evals measure prompt performance across hundreds of test cases. Combining deterministic rubric checks (keyword recall, schema validation) with latency distributions ensures enterprise reliability.',
    testSuiteCode: `def test_suite():
    harness = EvaluationHarness()

    # Test 1: Keyword recall scoring
    gen = "We verified the payment using Stripe and logged the transaction into Postgres."
    res = harness.evaluate_test_case(gen, ["Stripe", "Postgres", "Redis"], 140.0)
    assert res["keyword_recall"] == round(2 / 3, 4), "Should find 2 of 3 keywords"
    assert res["passed"] is False, "Should fail < 0.8 threshold"
    print("PASS: test_keyword_recall_eval")

    # Test 2: Latency percentiles
    lats = [100.0, 110.0, 120.0, 130.0, 140.0, 150.0, 160.0, 170.0, 180.0, 500.0]
    p50 = harness.compute_latency_percentile(lats, 50.0)
    p95 = harness.compute_latency_percentile(lats, 95.0)
    assert 130.0 <= p50 <= 150.0, "p50 should be around median"
    assert p95 > 200.0, "p95 should capture the spike outlier"
    print("PASS: test_latency_percentile_math")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Keyword Recall Rubric', description: 'Measures exact and partial keyword coverage.' },
      { id: 't2', name: 'Latency Percentiles', description: 'Calculates p50 and p95 distributions accurately.' },
    ],
  },
  {
    id: 'ai-lab-4',
    number: 4,
    title: 'Lab 4: Streaming Server-Sent Events (SSE) Engine',
    category: 'Real-Time Streaming & APIs',
    duration: '40 min',
    summary:
      'Build an asynchronous Server-Sent Events (SSE) token streaming generator for generative AI chat interfaces with event formatting and error boundaries.',
    whyItMattersInFde:
      'Waiting 15 seconds for an entire LLM response creates terrible user experiences. Production AI applications stream tokens chunk-by-chunk using HTTP text/event-stream.',
    architectureDiagram:
      'Async Token Stream -> Format SSE Frame: "data: {...}\\n\\n" -> Flush to Client -> Termination: "data: [DONE]\\n\\n"',
    specification: [
      'Create an `SseFormatter` class with `format_chunk(data: str, event: str = None) -> str`.',
      'Ensure standard SSE protocol compliance: each message starts with `data: `, followed by payload and two trailing newlines `\\n\\n`.',
      'Implement `stream_tokens(tokens_iterable)` returning formatted event frames.',
      'Emit a final `data: [DONE]\\n\\n` frame on clean stream completion.',
    ],
    starterCode: `class SseFormatter:
    """Formats text streams into standard Server-Sent Events (SSE) frames."""

    def format_event(self, data: str, event_name: str = None) -> str:
        # TODO: Return "event: <name>\\ndata: <data>\\n\\n" or "data: <data>\\n\\n"
        pass

    def stream_generator(self, tokens: list):
        # TODO: Yield formatted frames for each token
        # TODO: Yield final [DONE] frame
        pass
`,
    solutionCode: `class SseFormatter:
    """Formats text streams into standard Server-Sent Events (SSE) frames."""

    def format_event(self, data: str, event_name: str = None) -> str:
        lines = []
        if event_name:
            lines.append(f"event: {event_name}")
        lines.append(f"data: {data}")
        return "\\n".join(lines) + "\\n\\n"

    def stream_generator(self, tokens):
        for token in tokens:
            yield self.format_event(token)
        yield self.format_event("[DONE]")
`,
    architectureNotes:
      'Server-Sent Events (SSE) allow persistent unidirectional HTTP streaming from server to client with zero WebSocket protocol overhead. Standard event stream lines end with double newlines.',
    testSuiteCode: `def test_suite():
    formatter = SseFormatter()

    # Test 1: Event frame formatting
    frame = formatter.format_event("hello world")
    assert frame == "data: hello world\\n\\n", "Must format with 'data: ' and double trailing newlines"
    print("PASS: test_sse_event_frame_format")

    # Test 2: Stream generator with [DONE]
    tokens = ["Deep", " Learning"]
    frames = list(formatter.stream_generator(tokens))
    assert len(frames) == 3, "Should yield 2 token frames + 1 [DONE] frame"
    assert frames[-1] == "data: [DONE]\\n\\n", "Last frame must be [DONE]"
    print("PASS: test_stream_generator_completion")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'SSE Frame Format', description: 'Ensures strict RFC compliance with double newline.' },
      { id: 't2', name: 'Stream Termination', description: 'Emits [DONE] sentinel on generator completion.' },
    ],
  },
];

export const AI_LAB_PROGRESS_STORAGE_KEY = 'fde-python-ai-lab-progress-v1';
export const AI_LAB_DRAFTS_STORAGE_KEY = 'fde-python-ai-lab-drafts-v1';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return null;
}

export function loadAiLabProgress(): Record<string, boolean> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(AI_LAB_PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAiLabCleared(labId: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const current = loadAiLabProgress();
    current[labId] = true;
    storage.setItem(AI_LAB_PROGRESS_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage quota
  }
}

export function loadAiLabDrafts(): Record<string, string> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(AI_LAB_DRAFTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAiLabDraft(labId: string, code: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const drafts = loadAiLabDrafts();
    drafts[labId] = code;
    storage.setItem(AI_LAB_DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // LocalStorage quota
  }
}
