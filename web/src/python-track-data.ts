// Dedicated Python Mastery Track & Interview Engine
// Built for complete beginner to advanced software engineering in the AI era.
// Strictly generic production concepts -- zero client proprietary information.

export type PythonDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type PythonTrackTab =
  | 'curriculum'
  | 'toy-vs-prod'
  | 'topics'
  | 'studio'
  | 'fastapi'
  | 'rag'
  | 'ai-labs'
  | 'incidents'
  | 'starter-kit'
  | 'interview'
  | 'flashcards'
  | 'quiz'
  | 'lab';

export interface PythonTrackTier {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  tabIds: PythonTrackTab[];
}

export const PYTHON_TRACK_TIERS: PythonTrackTier[] = [
  {
    id: 1,
    tag: 'TIER 1',
    title: 'Foundations & Mental Models',
    subtitle: 'Beginner to Core Fundamentals',
    description: '4-stage roadmap, Day 1 Toy vs Production paradigm shift, and 18 CPython internals deep dives.',
    tabIds: ['curriculum', 'toy-vs-prod', 'topics'],
  },
  {
    id: 2,
    tag: 'TIER 2',
    title: 'Production Systems & Applied Labs',
    subtitle: 'Intermediate to Advanced Systems Engineering',
    description: 'Interactive Pyodide WebAssembly Code & Exam Studio, FastAPI Backend, RAG Pipeline, AI Labs, and On-Call Incidents.',
    tabIds: ['studio', 'fastapi', 'rag', 'ai-labs', 'incidents', 'starter-kit'],
  },
  {
    id: 3,
    tag: 'TIER 3',
    title: 'Interview Screen & Verification',
    subtitle: 'Senior Verification & Career Readiness',
    description: '68 GeeksforGeeks interview questions, 3D flip card active recall, 30-min timed screen, and tricky gotchas.',
    tabIds: ['interview', 'flashcards', 'quiz', 'lab'],
  },
];

export interface OrderedPythonTab {
  tab: PythonTrackTab;
  stepNumber: number;
  title: string;
  subtitle: string;
  tierId: number;
}

export const ORDERED_PYTHON_TABS: OrderedPythonTab[] = [
  {
    tab: 'curriculum',
    stepNumber: 1,
    title: 'Stages & Roadmap',
    subtitle: 'The 4 progressive learning stages from beginner to AI systems engineer',
    tierId: 1,
  },
  {
    tab: 'toy-vs-prod',
    stepNumber: 2,
    title: 'Day 1: Toy vs Production',
    subtitle: 'Why tutorial code breaks in production (modern uv, ruff, pydantic, and pytest)',
    tierId: 1,
  },
  {
    tab: 'topics',
    stepNumber: 3,
    title: '18 Concept Deep Dives',
    subtitle: 'CPython internals, memory layout, dunder protocols, OOP MRO, and asyncio',
    tierId: 1,
  },
  {
    tab: 'studio',
    stepNumber: 4,
    title: 'Code & Exam Studio',
    subtitle: 'Interactive Pyodide WebAssembly runtime & 6 automated production exams',
    tierId: 2,
  },
  {
    tab: 'fastapi',
    stepNumber: 5,
    title: '⚡ FastAPI Backend',
    subtitle: 'Production microservices: lifespans, DI Depends, Pydantic schemas, and RFC 7807',
    tierId: 2,
  },
  {
    tab: 'rag',
    stepNumber: 6,
    title: '🧠 Production RAG',
    subtitle: 'Sliding chunking, dense vector cosine similarity, and hallucination guard',
    tierId: 2,
  },
  {
    tab: 'ai-labs',
    stepNumber: 7,
    title: '🤖 AI-FDE Labs',
    subtitle: 'Token counting, tool dispatchers, SSE event streams, and eval benchmarks',
    tierId: 2,
  },
  {
    tab: 'incidents',
    stepNumber: 8,
    title: '🚨 On-Call Incidents',
    subtitle: 'Senior debugging: memory leaks, GIL locks, race conditions, and pool exhaustion',
    tierId: 2,
  },
  {
    tab: 'starter-kit',
    stepNumber: 9,
    title: '📦 Microservice Template',
    subtitle: 'Production repo scaffolding with uv, ruff, mypy, pytest, and Dockerfile',
    tierId: 2,
  },
  {
    tab: 'interview',
    stepNumber: 10,
    title: '68 Interview Q&A Engine',
    subtitle: 'Complete question bank with what senior interviewers look for and tag filters',
    tierId: 3,
  },
  {
    tab: 'flashcards',
    stepNumber: 11,
    title: '🎴 Flashcards & Mock Screen',
    subtitle: '3D flip card active recall & 30-minute timed senior technical screen',
    tierId: 3,
  },
  {
    tab: 'quiz',
    stepNumber: 12,
    title: 'Tricky Gotchas Quiz',
    subtitle: '10 runtime gotchas: mutable defaults, closure bindings, and is vs ==',
    tierId: 3,
  },
  {
    tab: 'lab',
    stepNumber: 13,
    title: 'Production Project Lab',
    subtitle: 'Capstone architecture blueprint and full-stack deployment journey',
    tierId: 3,
  },
];

export interface PythonTrackStage {
  id: string;
  number: number;
  title: string;
  eyebrow: string;
  description: string;
  topicIds: string[];
}

export interface PythonConceptTopic {
  id: string;
  number: number;
  title: string;
  difficulty: PythonDifficulty;
  duration: string;
  stage: string;
  summary: string;
  mentalModel: string;
  whyItMatters: string;
  codeExample: string;
  commonAiPitfalls: string[];
  verificationChecklist: string[];
  relatedQuestions: number[];
}

export interface PythonInterviewQuestion {
  id: string;
  number: number;
  difficulty: PythonDifficulty;
  question: string;
  summary: string;
  explanation: string;
  code?: string | null;
  interviewerNote: string;
  tags: string[];
}

export interface PythonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: PythonDifficulty;
  gotchaConcept: string;
  explanation: string;
}

export const PYTHON_STAGES: PythonTrackStage[] = [
  {
    id: 'stage-1',
    number: 1,
    title: 'Foundations & Core Idioms',
    eyebrow: 'STAGE 1 · COMPLETE BEGINNER',
    description:
      'Master the Python execution model, dynamic typing, mutability internals, idiomatic iteration, parameter binding, and defensive exception handling.',
    topicIds: ['topic-1', 'topic-2', 'topic-3', 'topic-4', 'topic-5', 'topic-6'],
  },
  {
    id: 'stage-2',
    number: 2,
    title: 'Object-Oriented Architecture & Protocols',
    eyebrow: 'STAGE 2 · INTERMEDIATE',
    description:
      'Deep dive into classes, the __init__ vs __new__ lifecycle, Python dunder protocols, cooperative multiple inheritance with C3 MRO, descriptors, and decorators.',
    topicIds: ['topic-7', 'topic-8', 'topic-9', 'topic-10', 'topic-11', 'topic-12'],
  },
  {
    id: 'stage-3',
    number: 3,
    title: 'Systems Internals, Concurrency & Modern Python',
    eyebrow: 'STAGE 3 · ADVANCED',
    description:
      'Architect resilient systems using custom generators, context managers, memory refcounting & cyclic GC, the GIL, asyncio event loops, and modern Python 3.10-3.12+ features.',
    topicIds: ['topic-13', 'topic-14', 'topic-15', 'topic-16', 'topic-17', 'topic-18'],
  },
  {
    id: 'stage-4',
    number: 4,
    title: 'Production AI-Native Project Lab',
    eyebrow: 'STAGE 4 · PRODUCTION CAPSTONE',
    description:
      'Build a production-grade async Python microservice from scratch: strict Pydantic v2 schemas, resilient retry/circuit breaker policies, structured logging, and automated test harnesses.',
    topicIds: [],
  },
];

export const PYTHON_TOPICS: PythonConceptTopic[] = [
  {
    "id": "topic-1",
    "number": 1,
    "title": "The CPython Execution Engine: Source, Bytecode & PVM",
    "difficulty": "beginner",
    "duration": "45 min",
    "stage": "Stage 1: Foundations & Core Idioms",
    "summary": "Understand how Python translates human-readable source code into bytecode instructions (.pyc) and how the Python Virtual Machine (PVM) loop executes them stack by stack.",
    "mentalModel": "Source code (.py) is compiled to an abstract syntax tree and then into stack-based bytecode (.pyc). The PVM is a giant C loop (eval_frame) that consumes opcodes one by one.",
    "whyItMatters": "Debugging performance, import latency, caching behavior, and understanding why Python is both compiled and interpreted.",
    "codeExample": "import dis\n\ndef calculate_tax(subtotal: float, rate: float = 0.08) -> float:\n    \"\"\"Demonstrates how CPython translates high-level code to opcodes.\"\"\"\n    total = subtotal * (1 + rate)\n    return round(total, 2)\n\n# Inspect the raw bytecode opcodes generated by CPython\nprint(\"Bytecode disassembly:\")\ndis.dis(calculate_tax)\n",
    "commonAiPitfalls": [
      "Assuming Python is purely interpreted with no compiler phase (ignoring .pyc caching).",
      "Believing Python bytecode is executed directly by hardware CPU rather than the PVM runtime.",
      "Confusing CPython (the C reference implementation) with the Python language specification itself."
    ],
    "verificationChecklist": [
      "Can you explain the role of __pycache__ and when Python skips recompilation?",
      "Can you read basic dis output (LOAD_FAST, BINARY_OP, STORE_FAST, RETURN_VALUE)?",
      "Do you know the difference between CPython, PyPy (JIT), and Jython/IronPython?"
    ],
    "relatedQuestions": [
      1,
      2,
      29
    ]
  },
  {
    "id": "topic-2",
    "number": 2,
    "title": "Dynamic Typing, Memory Binding & Identity vs Equality",
    "difficulty": "beginner",
    "duration": "45 min",
    "stage": "Stage 1: Foundations & Core Idioms",
    "summary": "Variables in Python do not hold values; they are name tags pointing to heap-allocated objects. Master the critical difference between value equality (==) and identity (is).",
    "mentalModel": "Objects are physical items floating in memory; variable names are sticky notes attached by strings. You can stick 5 labels to the exact same object.",
    "whyItMatters": "Prevents catastrophic bugs where developers use 'is' for string or integer comparison and get nondeterministic test failures due to memory caching.",
    "codeExample": "# Equality (==) checks value content; Identity (is) checks memory address id()\na = [10, 20, 30]\nb = [10, 20, 30]\n\nprint(f\"a == b: {a == b}\")        # True: identical contents\nprint(f\"a is b: {a is b}\")        # False: distinct heap objects\nprint(f\"id(a)={id(a)}, id(b)={id(b)}\")\n\n# Small Integer Caching (-5 to 256 in CPython)\nx = 250\ny = 250\nprint(f\"x is y (250): {x is y}\")  # True: points to pre-allocated singleton\n\np = 1000\nq = 1000\nprint(f\"p is q (1000): {p is q}\") # False (in REPL): separate heap allocations\n",
    "commonAiPitfalls": [
      "Writing `if status is 'ACTIVE':` which passes in tests due to string interning but breaks under load.",
      "Assuming variable assignment `a = b` creates a copy of the object.",
      "Failing to account for small integer caching (-5 to 256) when testing identity."
    ],
    "verificationChecklist": [
      "Can you explain why `x is None` is correct but `x is 0` is an anti-pattern?",
      "Can you use `id()` to verify whether two variables reference the same memory allocation?",
      "Can you explain why dynamic typing does NOT mean weak typing (e.g. `'2' + 2` raises TypeError)?"
    ],
    "relatedQuestions": [
      3,
      5,
      6
    ]
  },
  {
    "id": "topic-3",
    "number": 3,
    "title": "Core Data Structures, Mutability & Hash Tables",
    "difficulty": "beginner",
    "duration": "60 min",
    "stage": "Stage 1: Foundations & Core Idioms",
    "summary": "Deep dive into Lists (dynamic arrays with over-allocation), Dictionaries (compact hash tables with open addressing), Sets, and Tuples. Understand mutability and shallow vs deep copies.",
    "mentalModel": "Lists grow with a resizing factor (0, 4, 8, 16, 25...). Dicts use hash table buckets with perturbation collision resolution. Mutable changes happen in-place; immutable requires allocating a new object.",
    "whyItMatters": "Choosing the right data structure transforms an $O(n^2)$ sluggish script into an $O(n)$ production engine.",
    "codeExample": "import copy\n\n# Mutable (list, dict, set) vs Immutable (str, tuple, int, frozenset)\noriginal = [[1, 2, 3], [\"a\", \"b\"]]\n\n# Shallow copy: outer list is cloned, inner lists are shared references!\nshallow = original.copy()\nshallow[0].append(99)\nprint(f\"Original after shallow modification: {original}\")  # Notice inner list changed!\n\n# Deep copy: recursively clones all nested objects\ndeep = copy.deepcopy(original)\ndeep[0].append(999)\nprint(f\"Original after deep modification:    {original}\")  # Untouched!\n",
    "commonAiPitfalls": [
      "Modifying a list or dictionary while iterating directly over it (`for x in my_list: my_list.remove(x)`).",
      "Using a mutable object (like a list) as a dictionary key or set element (unhashable type error).",
      "Using shallow copy when dealing with nested state hierarchies, causing unexpected side effects."
    ],
    "verificationChecklist": [
      "Can you explain why tuple lookups are fast and why tuples can be dict keys while lists cannot?",
      "Do you know the time complexity ($O(1)$ vs $O(n)$) of `in` on a list vs a set?",
      "Can you trace how a shallow copy interacts with nested references?"
    ],
    "relatedQuestions": [
      4,
      5,
      9,
      10,
      11,
      23,
      24,
      25,
      31,
      34
    ]
  },
  {
    "id": "topic-4",
    "number": 4,
    "title": "Idiomatic Iteration, Comprehensions & Control Flow",
    "difficulty": "beginner",
    "duration": "45 min",
    "stage": "Stage 1: Foundations & Core Idioms",
    "summary": "Pythonic iteration using the iterator protocol, enumerate, zip, and list/dict comprehensions. Demystifying the myth of 'tuple comprehensions' (which are generator expressions).",
    "mentalModel": "Streams over indexes. Never write `for i in range(len(items)):` when you can iterate elements directly or use `enumerate(items)`.",
    "whyItMatters": "Writing clean, readable, high-performance code that leverages C-optimized bytecode loops rather than manual index bookkeeping.",
    "codeExample": "# Clean multi-sequence iteration with zip and enumerate\nnames = [\"Alice\", \"Bob\", \"Charlie\"]\nscores = [95, 88, 92]\n\nfor rank, (name, score) in enumerate(zip(names, scores), start=1):\n    print(f\"#{rank}: {name} -> {score}\")\n\n# List and Dict Comprehensions\npassing_scores = {name: score for name, score in zip(names, scores) if score >= 90}\nprint(f\"Passing scores mapping: {passing_scores}\")\n\n# NOTE: (x for x in scores) is a GENERATOR, NOT a tuple comprehension!\ngen = (x * 2 for x in scores)\nprint(f\"Generator type: {type(gen)}\")  # <class 'generator'>\n",
    "commonAiPitfalls": [
      "AI generating C-style index loops: `for i in range(len(arr)): print(arr[i])`.",
      "Writing complex 4-level nested comprehensions that become impossible to read and debug.",
      "Believing `(x for x in items)` produces a tuple (it produces a generator expression)."
    ],
    "verificationChecklist": [
      "Can you explain when to use a list comprehension vs a generator expression?",
      "Do you know how `zip(..., strict=True)` prevents silent data truncation in Python 3.10+?",
      "Can you explain the `for...else` construct and when the `else` block runs?"
    ],
    "relatedQuestions": [
      7,
      8,
      12,
      13,
      26,
      30,
      32,
      33,
      51,
      53
    ]
  },
  {
    "id": "topic-5",
    "number": 5,
    "title": "Functions, Parameter Binding & Scopes (LEGB)",
    "difficulty": "beginner",
    "duration": "60 min",
    "stage": "Stage 1: Foundations & Core Idioms",
    "summary": "Master call-by-object-reference, *args and **kwargs parameter packing/unpacking, the infamous mutable default argument trap, and the LEGB variable resolution hierarchy.",
    "mentalModel": "Scope lookup is a series of concentric expanding circles: Local -> Enclosing (nested functions) -> Global (module) -> Built-in. Python checks Local first and stops at the first match.",
    "whyItMatters": "The mutable default argument trap (`def f(x=[])`) is the #1 source of state leakage bugs in Python applications.",
    "codeExample": "# THE DANGEROUS TRAP: Default arguments evaluate ONCE at function definition time!\ndef buggy_append(item, target_list=[]):\n    target_list.append(item)\n    return target_list\n\nprint(buggy_append(1))  # [1]\nprint(buggy_append(2))  # [1, 2] -- UNEXPECTED! target_list persisted!\n\n# THE PRODUCTION FIX: Use None sentinel value\ndef safe_append(item, target_list=None):\n    if target_list is None:\n        target_list = []\n    target_list.append(item)\n    return target_list\n\nprint(safe_append(1))   # [1]\nprint(safe_append(2))   # [2] -- Clean isolation!\n",
    "commonAiPitfalls": [
      "AI agents frequently suggest `def add_log(entry, history=[])` which leaks state across requests.",
      "Confusing `global` (modifies module-level namespace) with `nonlocal` (modifies enclosing function namespace).",
      "Misunderstanding `*args` (positional tuple) and `**kwargs` (keyword dictionary) unpacking."
    ],
    "verificationChecklist": [
      "Can you explain why default arguments are evaluated at import/definition time rather than call time?",
      "Can you write a closure that uses `nonlocal` to maintain an encapsulated counter?",
      "Do you know what happens when you unpack a dictionary with `**` into a function call?"
    ],
    "relatedQuestions": [
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ]
  },
  {
    "id": "topic-6",
    "number": 6,
    "title": "Defensive Exception Handling & Clean Modularization",
    "difficulty": "beginner",
    "duration": "45 min",
    "stage": "Stage 1: Foundations & Core Idioms",
    "summary": "Structured error recovery using try, except, else, and finally. Creating domain-specific custom exception hierarchies and managing script execution with if __name__ == '__main__'.",
    "mentalModel": "The try block isolates the risk; except handles expected failures; else runs strictly when NO exception occurred; finally cleans up external resources regardless of outcome.",
    "whyItMatters": "Silent failures and generic exception swallowing crash production systems without trace evidence. Clean errors enable automated retry and alerting.",
    "codeExample": "class PaymentError(Exception):\n    \"\"\"Base domain exception for payment failures.\"\"\"\n    pass\n\nclass InsufficientFundsError(PaymentError):\n    \"\"\"Raised when account balance is lower than transaction amount.\"\"\"\n    def __init__(self, required: float, available: float):\n        super().__init__(f\"Required ${required:.2f}, but only ${available:.2f} available.\")\n        self.required = required\n        self.available = available\n\ndef process_transaction(amount: float, balance: float):\n    try:\n        if amount > balance:\n            raise InsufficientFundsError(amount, balance)\n        # Process transaction...\n        result = \"SUCCESS\"\n    except InsufficientFundsError as err:\n        print(f\"Domain failure handled: {err}\")\n        result = \"REJECTED\"\n    else:\n        print(\"Payment completed without error.\")\n    finally:\n        print(\"Audit log flushed to disk.\")\n    return result\n\nprocess_transaction(100.0, 45.0)\n",
    "commonAiPitfalls": [
      "Writing bare `except:` or `except Exception: pass` which swallows SyntaxError and KeyboardInterrupt.",
      "Putting cleanup code in the `try` block where it gets skipped on error (use `finally` or context managers).",
      "Forgetting the `if __name__ == '__main__':` entrypoint guard, causing scripts to run when imported by test suites."
    ],
    "verificationChecklist": [
      "Can you explain the exact role of the `else` clause in a try-except statement?",
      "Can you define a custom exception that inherits from `Exception` (not `BaseException`)?",
      "Can you explain why `except Exception as e:` is safer than bare `except:`?"
    ],
    "relatedQuestions": [
      22,
      27,
      28,
      29,
      49,
      50,
      52
    ]
  },
  {
    "id": "topic-7",
    "number": 7,
    "title": "Object-Oriented Architecture: Classes, __init__ & self",
    "difficulty": "intermediate",
    "duration": "60 min",
    "stage": "Stage 2: Object-Oriented Architecture & Protocols",
    "summary": "Deep dive into classes as namespaces and object blueprints. Understand how Python automatically binds the instance to the explicit `self` parameter during method dispatch.",
    "mentalModel": "`user.get_name()` is purely syntactic sugar for `User.get_name(user)`. Classes are factories; `self` is the freshly allocated instance passed into the initializer.",
    "whyItMatters": "Core foundational knowledge for building testable business domain services, repositories, and API clients in Python.",
    "codeExample": "class ServiceEndpoint:\n    # Class attribute: shared across all instances\n    TIMEOUT_SECONDS = 30\n\n    def __init__(self, endpoint_url: str):\n        # Instance attribute: private to this specific instance\n        self.endpoint_url = endpoint_url\n        self.call_count = 0\n\n    def record_call(self) -> int:\n        self.call_count += 1\n        return self.call_count\n\nep1 = ServiceEndpoint(\"https://api.gateway.internal/v1\")\nep2 = ServiceEndpoint(\"https://api.gateway.internal/v2\")\n\nep1.record_call()\nprint(f\"ep1 count: {ep1.call_count}\")  # 1\nprint(f\"ep2 count: {ep2.call_count}\")  # 0 -- Instances are isolated!\n",
    "commonAiPitfalls": [
      "Accidentally mutating a class attribute (`ServiceEndpoint.items.append(x)`) instead of setting instance state.",
      "Forgetting `self` in method definitions, resulting in `TypeError: takes 0 positional arguments but 1 was given`.",
      "Creating deep OOP inheritance hierarchies where simple composition or functional pipelines would be cleaner."
    ],
    "verificationChecklist": [
      "Can you explain why Python requires `self` to be explicitly named in method signatures?",
      "Can you differentiate between a class variable and an instance variable in memory?",
      "Can you inspect an object's internal dictionary using `__dict__`?"
    ],
    "relatedQuestions": [
      55,
      57
    ]
  },
  {
    "id": "topic-8",
    "number": 8,
    "title": "Object Lifecycle: Construction vs Initialization (__new__ vs __init__)",
    "difficulty": "intermediate",
    "duration": "60 min",
    "stage": "Stage 2: Object-Oriented Architecture & Protocols",
    "summary": "Master the two-stage instantiation pipeline: `__new__` (allocates and returns the raw instance object) vs `__init__` (configures instance attributes). Implement Singletons and immutable subclasses.",
    "mentalModel": "`__new__` is the construction contractor who pours the concrete foundation and erects the walls. `__init__` is the interior designer who paints the rooms.",
    "whyItMatters": "Essential for building thread-safe Singletons, caching factories, modifying immutable types (subclassing `int`, `str`, `tuple`), and metaprogramming.",
    "codeExample": "class SingletonDatabaseClient:\n    _instance = None\n\n    def __new__(cls, *args, **kwargs):\n        # __new__ controls the actual creation of the instance\n        if cls._instance is None:\n            print(\"Allocating new Singleton instance in memory...\")\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\n    def __init__(self, connection_string: str = \"default.db\"):\n        self.connection_string = connection_string\n\nc1 = SingletonDatabaseClient(\"db-primary\")\nc2 = SingletonDatabaseClient(\"db-replica\")\n\nprint(f\"c1 is c2: {c1 is c2}\")  # True! Both point to the exact same memory address\n",
    "commonAiPitfalls": [
      "Assuming `__init__` creates the object (it only initializes an already created object; `__new__` creates it).",
      "Forgetting to return the instance from `__new__`, which results in `None` being assigned and `__init__` never being called.",
      "Implementing Singletons in multithreaded environments without lock protection."
    ],
    "verificationChecklist": [
      "Can you explain the arguments received by `__new__(cls, *args, **kwargs)`?",
      "Why must you use `__new__` instead of `__init__` when subclassing an immutable type like `tuple`?",
      "What happens if `__new__` returns an instance of a different class?"
    ],
    "relatedQuestions": [
      55,
      56
    ]
  },
  {
    "id": "topic-9",
    "number": 9,
    "title": "Python Dunder Protocols & Emulating Built-in Behaviors",
    "difficulty": "intermediate",
    "duration": "60 min",
    "stage": "Stage 2: Object-Oriented Architecture & Protocols",
    "summary": "Leverage Python's Data Model magic methods: string representations (__repr__ vs __str__), container protocols (__len__, __getitem__, __contains__), and hashing (__eq__, __hash__).",
    "mentalModel": "Python has no special syntax reserved for built-in types; any custom class that implements `__len__` and `__getitem__` is automatically indexable, sliceable, and iterable.",
    "whyItMatters": "Allows you to write expressive, elegant Pythonic APIs that work seamlessly with `len()`, `for item in obj:`, `obj[key]`, and `in`.",
    "codeExample": "class TaskQueue:\n    def __init__(self):\n        self._tasks = []\n\n    def add(self, task: str):\n        self._tasks.append(task)\n\n    def __len__(self) -> int:\n        return len(self._tasks)\n\n    def __getitem__(self, index):\n        return self._tasks[index]\n\n    def __repr__(self) -> str:\n        return f\"TaskQueue(count={len(self._tasks)}, tasks={self._tasks!r})\"\n\nq = TaskQueue()\nq.add(\"Verify spec\")\nq.add(\"Execute test suite\")\n\nprint(f\"Length: {len(q)}\")           # 2 (via __len__)\nprint(f\"First item: {q[0]}\")         # 'Verify spec' (via __getitem__)\nprint(f\"Sliced: {q[:]}\")             # ['Verify spec', 'Execute test suite'] (slicing for free!)\nprint(repr(q))\n",
    "commonAiPitfalls": [
      "Implementing `__eq__` without `__hash__`, which causes the class to become unhashable and break in `set` and `dict`.",
      "Confusing `__repr__` (unambiguous, developer-oriented) with `__str__` (friendly user-facing string).",
      "Raising exceptions other than `KeyError` or `IndexError` inside `__getitem__`."
    ],
    "verificationChecklist": [
      "Can you explain the rule: 'If you define __eq__, Python sets __hash__ = None by default'?",
      "Can you write a class that implements `__enter__` and `__exit__`?",
      "What protocol enables an object to be invoked like a function (`__call__`)?"
    ],
    "relatedQuestions": [
      36,
      55,
      56
    ]
  },
  {
    "id": "topic-10",
    "number": 10,
    "title": "Inheritance, Multiple Inheritance & C3 Linearization (MRO)",
    "difficulty": "intermediate",
    "duration": "60 min",
    "stage": "Stage 2: Object-Oriented Architecture & Protocols",
    "summary": "Understand multiple inheritance, Method Resolution Order (MRO), C3 Linearization, and cooperative `super()` calls to avoid diamond dependency bugs.",
    "mentalModel": "MRO is a deterministic linearized list of classes that Python traverses from left to right. `super()` calls the NEXT class in that list, which is NOT necessarily the direct parent!",
    "whyItMatters": "Understanding how mixins and framework architectures (Django, FastAPI, SQLAlchemy) resolve methods across deep inheritance hierarchies.",
    "codeExample": "class Base:\n    def action(self):\n        print(\"Base action\")\n\nclass Left(Base):\n    def action(self):\n        print(\"Left action enter\")\n        super().action()\n        print(\"Left action exit\")\n\nclass Right(Base):\n    def action(self):\n        print(\"Right action enter\")\n        super().action()\n        print(\"Right action exit\")\n\nclass Diamond(Left, Right):\n    def action(self):\n        print(\"Diamond action enter\")\n        super().action()\n        print(\"Diamond action exit\")\n\nd = Diamond()\nd.action()\nprint(\"MRO Order:\", [cls.__name__ for cls in Diamond.__mro__])\n# Output order: Diamond -> Left -> Right -> Base -> object\n",
    "commonAiPitfalls": [
      "Hardcoding `ParentClass.__init__(self)` instead of `super().__init__()`, breaking cooperative inheritance.",
      "Creating conflicting inheritance orders that violate monotonicity, causing `TypeError: Cannot create a consistent method resolution order`.",
      "Overusing inheritance where composition (has-a) is much cleaner and less tightly coupled."
    ],
    "verificationChecklist": [
      "Can you print and interpret `Class.__mro__`?",
      "Can you trace how `super()` delegates through a diamond hierarchy?",
      "What is the C3 Linearization algorithm's guarantee for local precedence order?"
    ],
    "relatedQuestions": [
      40,
      41,
      42,
      43,
      44,
      45
    ]
  },
  {
    "id": "topic-11",
    "number": 11,
    "title": "Method Descriptors: @classmethod, @staticmethod & @property",
    "difficulty": "intermediate",
    "duration": "45 min",
    "stage": "Stage 2: Object-Oriented Architecture & Protocols",
    "summary": "Master method descriptors: `@classmethod` (receives `cls` for alternative constructors), `@staticmethod` (utility functions grouped in a namespace), and `@property` for clean data encapsulation.",
    "mentalModel": "Descriptors intercept attribute access via `__get__`, `__set__`, and `__delete__`. `@property` lets you expose attributes like variables while running validation logic behind the scenes.",
    "whyItMatters": "Allows you to evolve internal data representation without breaking public API contracts (no need for ugly Java-style `obj.getTemperature()` getters).",
    "codeExample": "class Temperature:\n    def __init__(self, celsius: float):\n        self.celsius = celsius  # Invokes the property setter!\n\n    @property\n    def celsius(self) -> float:\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value: float):\n        if value < -273.15:\n            raise ValueError(\"Temperature below absolute zero is impossible!\")\n        self._celsius = value\n\n    @classmethod\n    def from_fahrenheit(cls, fahrenheit: float):\n        \"\"\"Factory method creating instance from Fahrenheit.\"\"\"\n        celsius = (fahrenheit - 32) * 5 / 9\n        return cls(celsius)\n\n    @staticmethod\n    def is_freezing(celsius: float) -> bool:\n        return celsius <= 0.0\n\nt = Temperature.from_fahrenheit(68)\nprint(f\"Celsius: {t.celsius:.1f}C (Freezing: {Temperature.is_freezing(t.celsius)})\")\n",
    "commonAiPitfalls": [
      "Using `@staticmethod` when the factory method needs `cls` to support polymorphic subclassing.",
      "Creating circular recursion inside property setters: `self.val = val` instead of `self._val = val`.",
      "Assuming Python's `__var` double-underscore is true encryption or private security (it is just name mangling)."
    ],
    "verificationChecklist": [
      "Can you explain the difference in method signatures between instance, class, and static methods?",
      "How does Python implement name mangling for private attributes (`__attr`)?",
      "Can you write a property getter, setter, and deleter?"
    ],
    "relatedQuestions": [
      44,
      57,
      58
    ]
  },
  {
    "id": "topic-12",
    "number": 12,
    "title": "First-Class Functions, Closures & Production Decorators",
    "difficulty": "intermediate",
    "duration": "60 min",
    "stage": "Stage 2: Object-Oriented Architecture & Protocols",
    "summary": "Understand closures and function objects. Build robust production decorators with parameterization, execution metrics, error retries, and preserve metadata using functools.wraps.",
    "mentalModel": "A decorator is a function transformer. `@my_decorator \\n def my_func(): ...` is 100% syntactic sugar for `my_func = my_decorator(my_func)`.",
    "whyItMatters": "Decorators power logging, caching, authorization, circuit breakers, and metrics collection in production frameworks.",
    "codeExample": "import functools\nimport time\n\ndef retry(max_attempts: int = 3, delay_seconds: float = 0.5):\n    \"\"\"Parameterized decorator that retries failing operations with backoff.\"\"\"\n    def decorator(func):\n        @functools.wraps(func)  # CRITICAL: Preserves function name, docstring, and annotations!\n        def wrapper(*args, **kwargs):\n            attempts = 0\n            while attempts < max_attempts:\n                try:\n                    return func(*args, **kwargs)\n                except Exception as err:\n                    attempts += 1\n                    if attempts >= max_attempts:\n                        raise\n                    time.sleep(delay_seconds * attempts)\n        return wrapper\n    return decorator\n\n@retry(max_attempts=3, delay_seconds=0.1)\ndef unstable_api_call():\n    \"\"\"Simulates flaky network operation.\"\"\"\n    return \"Data fetched successfully\"\n\nprint(f\"Function name preserved: {unstable_api_call.__name__}\")\nprint(unstable_api_call())\n",
    "commonAiPitfalls": [
      "Forgetting `@functools.wraps(func)`, which erases the decorated function's `__name__` and breaks documentation/debuggers.",
      "Confusing the 3 nesting levels required for parameterized decorators (outer config -> decorator -> wrapper).",
      "Modifying mutable default arguments inside closures without proper scoping."
    ],
    "verificationChecklist": [
      "What does `@functools.wraps` copy over from the wrapped function?",
      "Can you explain how closures store free variables in `func.__closure__`?",
      "Can you write a decorator that records execution duration?"
    ],
    "relatedQuestions": [
      14,
      16,
      46
    ]
  },
  {
    "id": "topic-13",
    "number": 13,
    "title": "Lazy Iteration: Iterators & Custom Generators (yield)",
    "difficulty": "advanced",
    "duration": "60 min",
    "stage": "Stage 3: Advanced Systems, Concurrency & Modern Python",
    "summary": "Master the iterator protocol (__iter__ and __next__) and generators using `yield` and `yield from`. Stream gigabytes of data with minimal memory consumption.",
    "mentalModel": "Push vs Pull. Lists push all items into RAM eagerly. Generators produce items on-demand one at a time and suspend execution state in the heap until requested.",
    "whyItMatters": "Processing 50 GB log files or streaming ML dataset embeddings without crashing Docker containers with Out-Of-Memory (OOM) errors.",
    "codeExample": "import sys\nfrom typing import Generator\n\ndef csv_record_stream(row_count: int) -> Generator[dict, None, None]:\n    \"\"\"Generates millions of simulated records with $O(1)$ memory usage.\"\"\"\n    for i in range(row_count):\n        yield {\"id\": i, \"payload\": f\"payload_data_{i}\"}\n\n# Memory comparison\nstream = csv_record_stream(100_000)\nprint(f\"Generator memory size: {sys.getsizeof(stream)} bytes\")\n\n# Eager list in memory\neager_list = list(csv_record_stream(100_000))\nprint(f\"Eager list memory size: {sys.getsizeof(eager_list)} bytes\")\n# Notice: generator takes ~200 bytes while list consumes megabytes!\n",
    "commonAiPitfalls": [
      "Accidentally calling `list(my_generator)` on massive streams, completely destroying the memory benefit.",
      "Attempting to reuse a generator after it has already raised `StopIteration` (generators are single-pass!).",
      "Forgetting that exceptions raised inside a generator propagate to the caller on the `next()` call."
    ],
    "verificationChecklist": [
      "Can you implement the iterator protocol from scratch using a class with `__iter__` and `__next__`?",
      "Can you explain how `yield from` delegates iteration to a sub-generator?",
      "Can you use `generator.send()` and `generator.close()` for coroutine-style pipelines?"
    ],
    "relatedQuestions": [
      35,
      37,
      51
    ]
  },
  {
    "id": "topic-14",
    "number": 14,
    "title": "Context Managers & Resource Safety (with statement)",
    "difficulty": "advanced",
    "duration": "45 min",
    "stage": "Stage 3: Advanced Systems, Concurrency & Modern Python",
    "summary": "Deterministic resource management. Master the context manager protocol (__enter__ and __exit__), exception suppression rules, and the contextlib standard library.",
    "mentalModel": "A transaction sandbox. Guarantee that connections, locks, and temporary files are always closed or rolled back, even if unhandled exceptions strike midway.",
    "whyItMatters": "Prevents file descriptor leaks, orphaned database connection pools, and deadlock states in production environments.",
    "codeExample": "import contextlib\nimport time\n\n@contextlib.contextmanager\ndef execution_timer(label: str):\n    \"\"\"Measures and logs execution time cleanly using generator context manager.\"\"\"\n    start = time.perf_counter()\n    try:\n        yield\n    finally:\n        elapsed = time.perf_counter() - start\n        print(f\"[{label}] finished in {elapsed:.4f}s\")\n\nwith execution_timer(\"Data processing task\"):\n    total = sum(x * x for x in range(1_000_000))\n",
    "commonAiPitfalls": [
      "Returning `True` from `__exit__` unintentionally, which silences all exceptions (including bugs and KeyboardInterrupt).",
      "Failing to catch exceptions in `@contextmanager` generator functions around the `yield` statement.",
      "Opening resources manually outside the `with` statement, leaving them dangling on early return."
    ],
    "verificationChecklist": [
      "What arguments are passed to `__exit__(exc_type, exc_val, exc_tb)` when an exception occurs?",
      "How do you signal to Python that an exception was successfully handled in `__exit__`?",
      "Can you use `contextlib.suppress()` and `contextlib.ExitStack()`?"
    ],
    "relatedQuestions": [
      61
    ]
  },
  {
    "id": "topic-15",
    "number": 15,
    "title": "CPython Memory Management, Ref Counting & Cyclic GC",
    "difficulty": "advanced",
    "duration": "60 min",
    "stage": "Stage 3: Advanced Systems, Concurrency & Modern Python",
    "summary": "Deep dive into CPython's two-tier memory architecture: Primary Reference Counting (instant deallocation) and the Generational Cyclic Garbage Collector (generations 0, 1, 2).",
    "mentalModel": "Every object has an `ob_refcnt` header. When it drops to 0, memory is freed immediately. Circular references (A -> B -> A) cannot reach 0; the cyclic GC periodically scans container objects to detect and harvest these orphan islands.",
    "whyItMatters": "Diagnosing subtle memory leaks in long-running Python services and Celery workers caused by reference cycles or unbounded caches.",
    "codeExample": "import sys\nimport gc\n\nclass Node:\n    def __init__(self, name: str):\n        self.name = name\n        self.neighbor = None\n\n# Reference count observation\nnode_a = Node(\"A\")\nprint(f\"Reference count of node_a: {sys.getrefcount(node_a) - 1}\")  # -1 accounts for getrefcount arg\n\n# Create circular reference cycle\nnode_b = Node(\"B\")\nnode_a.neighbor = node_b\nnode_b.neighbor = node_a\n\n# Break external names\ndel node_a\ndel node_b\n\n# The objects still exist in RAM because their internal cycle keeps refcount > 0!\n# Run cyclic garbage collection manually to collect them\nunreachable = gc.collect()\nprint(f\"Cyclic GC collected {unreachable} unreachable cyclic objects.\")\n",
    "commonAiPitfalls": [
      "Believing Python has no memory leaks because it has garbage collection (reference cycles with caches leak RAM).",
      "Using `del variable` assuming it frees memory (it only decrements the reference counter by 1).",
      "Disabling the garbage collector (`gc.disable()`) in long-running services without profiling."
    ],
    "verificationChecklist": [
      "Can you explain why reference counting alone cannot collect circular references?",
      "What are the 3 generations in Python's cyclic garbage collector and how do objects get promoted?",
      "How does `weakref` allow caching objects without preventing their garbage collection?"
    ],
    "relatedQuestions": [
      48,
      59
    ]
  },
  {
    "id": "topic-16",
    "number": 16,
    "title": "The Python GIL, Threading (I/O) vs Multiprocessing (CPU)",
    "difficulty": "advanced",
    "duration": "60 min",
    "stage": "Stage 3: Advanced Systems, Concurrency & Modern Python",
    "summary": "Understand the Global Interpreter Lock (GIL) in CPython. Learn when to use `threading` (I/O bound: network, disk) vs `multiprocessing` (CPU bound: data processing, ML, cryptography).",
    "mentalModel": "The GIL is a mutex ensuring only one native OS thread executes Python bytecode at any moment. Threading switches threads while waiting for I/O; Multiprocessing forks separate processes with separate memory spaces and separate GILs.",
    "whyItMatters": "Running CPU-intensive workloads on Python threads does NOT speed them up\u2014it actually slows them down due to GIL lock contention overhead!",
    "codeExample": "import concurrent.futures\nimport time\n\ndef cpu_heavy_task(n: int) -> int:\n    \"\"\"CPU-bound computation: benefits from multiprocessing, NOT threading.\"\"\"\n    return sum(i * i for i in range(n))\n\ndef io_bound_task(seconds: float) -> str:\n    \"\"\"I/O-bound simulation: threads release the GIL during sleep/I/O.\"\"\"\n    time.sleep(seconds)\n    return f\"Waited {seconds}s\"\n\n# For I/O bound: ThreadPoolExecutor is lightweight and fast\nwith concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:\n    results = list(executor.map(io_bound_task, [0.1, 0.1, 0.1, 0.1]))\nprint(\"I/O tasks completed concurrently:\", len(results))\n\n# For CPU bound: ProcessPoolExecutor utilizes multiple CPU cores\nwith concurrent.futures.ProcessPoolExecutor() as executor:\n    results = list(executor.map(cpu_heavy_task, [2_000_000, 2_000_000]))\nprint(\"CPU tasks completed on multiple cores:\", len(results))\n",
    "commonAiPitfalls": [
      "Using `threading.Thread` to parallelize mathematical calculations or image resizing (GIL prevents parallel CPU work).",
      "Sharing mutable memory across processes without IPC queues or shared memory buffers.",
      "Forgetting `if __name__ == '__main__':` when launching `multiprocessing`, causing infinite fork bombs on Windows and macOS."
    ],
    "verificationChecklist": [
      "Why was the GIL implemented in CPython in the first place (C-extensions and refcounting thread safety)?",
      "What operations cause CPython to release the GIL voluntarily?",
      "What is PEP 703 (free-threaded Python in Python 3.13+)?"
    ],
    "relatedQuestions": [
      63,
      64
    ]
  },
  {
    "id": "topic-17",
    "number": 17,
    "title": "Asynchronous Systems: asyncio, Event Loops & Coroutines",
    "difficulty": "advanced",
    "duration": "60 min",
    "stage": "Stage 3: Advanced Systems, Concurrency & Modern Python",
    "summary": "Master cooperative multitasking on a single thread. Understand event loops, async/await coroutines, Tasks, gather, and avoiding catastrophic event loop blocking bugs.",
    "mentalModel": "A single chef juggling 100 orders. When an order goes into the oven (network/database wait), the chef does not stand still\u2014they prepare the next dish. When the timer rings, they retrieve the finished dish.",
    "whyItMatters": "Modern Python web backends (FastAPI, Starlette) and AI agent frameworks rely entirely on asyncio to handle thousands of concurrent requests.",
    "codeExample": "import asyncio\nimport time\n\nasync def fetch_user_data(user_id: int) -> dict:\n    \"\"\"Asynchronous coroutine simulating non-blocking network fetch.\"\"\"\n    await asyncio.sleep(0.05)  # Non-blocking pause; frees event loop!\n    return {\"id\": user_id, \"role\": \"engineer\"}\n\nasync def main():\n    start = time.perf_counter()\n    # Concurrently launch 5 network calls\n    tasks = [fetch_user_data(i) for i in range(1, 6)]\n    results = await asyncio.gather(*tasks)\n    elapsed = time.perf_counter() - start\n    print(f\"Fetched {len(results)} records in {elapsed:.4f}s (concurrently!)\")\n\nasyncio.run(main())\n",
    "commonAiPitfalls": [
      "Calling synchronous blocking code like `time.sleep()` or `requests.get()` inside `async def`, which freezes the entire event loop for all users!",
      "Creating tasks without awaiting or capturing references to them, causing silent background task cancellation.",
      "Using `asyncio.run()` inside a running event loop (e.g. inside Jupyter or FastAPI endpoints)."
    ],
    "verificationChecklist": [
      "Can you explain the difference between a coroutine function, a coroutine object, and a Task?",
      "How do you run blocking CPU or synchronous I/O operations inside asyncio without freezing the loop (`asyncio.to_thread`)?",
      "How do you handle timeouts using `asyncio.wait_for`?"
    ],
    "relatedQuestions": [
      65
    ]
  },
  {
    "id": "topic-18",
    "number": 18,
    "title": "Modern Python 3.10\u20133.12+: Pattern Matching, Walrus & Typing",
    "difficulty": "advanced",
    "duration": "60 min",
    "stage": "Stage 3: Advanced Systems, Concurrency & Modern Python",
    "summary": "Master modern Python innovations: Structural Pattern Matching (`match / case`), the Walrus operator (`:=`), strict Type Annotations (`typing.Protocol`), and Python 3.11+ Exception Groups.",
    "mentalModel": "Python has evolved into a strictly typed, highly expressive systems language. Pattern matching matches object structures and destructures values in one atomic operation.",
    "whyItMatters": "Writing clean, type-safe, maintainable Python code that passes static analysis (`mypy`) and provides bulletproof domain modeling.",
    "codeExample": "from typing import Protocol\n\n# Structural Pattern Matching (Python 3.10+)\ndef route_event(event: dict) -> str:\n    match event:\n        case {\"type\": \"PAYMENT\", \"amount\": amount, \"currency\": \"USD\"} if amount > 1000:\n            return f\"High-value payment flagged: ${amount}\"\n        case {\"type\": \"PAYMENT\", \"amount\": amount}:\n            return f\"Standard payment processed: {amount}\"\n        case {\"type\": \"REFUND\", \"reason\": reason}:\n            return f\"Refund processed: {reason}\"\n        case _:\n            return \"Unknown event structure\"\n\nprint(route_event({\"type\": \"PAYMENT\", \"amount\": 2500, \"currency\": \"USD\"}))\n\n# Walrus Operator := (Assignment expression)\nsample_text = \"Complete-AI-FDE-Software\"\nif (n := len(sample_text)) > 10:\n    print(f\"Text is long ({n} characters)\")\n",
    "commonAiPitfalls": [
      "Treating `match/case` as just a primitive C-style switch statement rather than using shape destructuring and guards.",
      "Overusing the Walrus operator in complex expressions where code readability is severely degraded.",
      "Writing type annotations that cannot be statically verified by `mypy`."
    ],
    "verificationChecklist": [
      "Can you write a `match/case` pattern that matches a dataclass and extracts its fields?",
      "Can you use `ExceptionGroup` and `except*` to catch multiple concurrent async task errors?",
      "What is the difference between `typing.TypedDict`, `dataclasses.dataclass`, and `pydantic.BaseModel`?"
    ],
    "relatedQuestions": [
      60,
      66,
      67,
      68
    ]
  }
];

export const PYTHON_INTERVIEW_QUESTIONS: PythonInterviewQuestion[] = [
  {
    "id": "py-q1",
    "number": 1,
    "difficulty": "beginner",
    "question": "Is Python a compiled language or an interpreted language?",
    "summary": "Python is considered both a compiled and an interpreted language. First, Python source code (.py files) is compiled into bytecode (.pyc files). Then, the Python Virtual Machine (PVM) interprets and executes this bytecode line by line.\n- Python code i...",
    "explanation": "Python is considered both a compiled and an interpreted language. First, Python source code (.py files) is compiled into bytecode (.pyc files). Then, the Python Virtual Machine (PVM) interprets and executes this bytecode line by line.\n- Python code is first compiled into bytecode.\n- The Python Virtual Machine (PVM) executes the bytecode.\n- CPython, the most common Python implementation, both compiles and interprets code.\n- Some implementations like PyPy use Just-In-Time (JIT) compilation for improved performance.\n\nTherefore, Python combines features of both compiled and interpreted languages.",
    "code": null,
    "interviewerNote": "Interviewer wants to hear: Python is BOTH. First CPython compiles source to bytecode (.pyc), then PVM interprets bytecode. Mention PyPy/JIT for bonus points.",
    "tags": [
      "internals",
      "pvm",
      "bytecode"
    ]
  },
  {
    "id": "py-q2",
    "number": 2,
    "difficulty": "beginner",
    "question": "Is Indentation Required in Python?",
    "summary": "Yes, indentation is required in Python. A Python interpreter can be informed that a group of statements belongs to a specific block of code by using Python indentation. Indentations make the code easy to read for developers in all programming languag...",
    "explanation": "Yes, indentation is required in Python. A Python interpreter can be informed that a group of statements belongs to a specific block of code by using Python indentation. Indentations make the code easy to read for developers in all programming languages but in Python, it is very important to indent the code in a specific order.",
    "code": null,
    "interviewerNote": "Interviewer checks: Do you know that indentation is syntactic, not aesthetic? Mention 4 spaces (PEP 8) and IndentationError.",
    "tags": [
      "syntax",
      "indentation",
      "pep8"
    ]
  },
  {
    "id": "py-q3",
    "number": 3,
    "difficulty": "beginner",
    "question": "What is a dynamically typed language?",
    "summary": "A dynamically typed language is a programming language in which the data type of a variable is determined at runtime. In Python, you do not need to declare the data type of a variable explicitly. Instead, Python automatically assigns the appropriate...",
    "explanation": "A dynamically typed language is a programming language in which the data type of a variable is determined at runtime. In Python, you do not need to declare the data type of a variable explicitly. Instead, Python automatically assigns the appropriate type based on the value stored in the variable.\n\n```python\nx = 10       # x is an integer\nx = \"Hello\"  # Now x is a string\n```\n\nHere, the variable x initially stores an integer and is later reassigned to a string. Python automatically updates the variable's type at runtime.",
    "code": "x = 10       # x is an integer\nx = \"Hello\"  # Now x is a string",
    "interviewerNote": "Interviewer wants: Types are associated with objects, not variable names. Variables are pointers/references bound at runtime.",
    "tags": [
      "typing",
      "runtime",
      "types"
    ]
  },
  {
    "id": "py-q4",
    "number": 4,
    "difficulty": "beginner",
    "question": "What are Built-in data types in Python?",
    "summary": "The following are the standard or built-in data types in Python:\n- Numeric: The numeric data type in Python represents the data that has a numeric value. A numeric value can be an integer, a floating number, or a complex number.\n- Sequence Type: The...",
    "explanation": "The following are the standard or built-in data types in Python:\n- Numeric: The numeric data type in Python represents the data that has a numeric value. A numeric value can be an integer, a floating number, or a complex number.\n- Sequence Type: The sequence Data Type in Python is the ordered collection of similar or different data types. There are several sequence types in Python like String, List, Tuple, range\n- Mapping Types: In Python, hashable data can be mapped to random objects using a mapping object. There is currently only one common mapping type, the Dictionary and mapping objects are mutable.\n- Set Types: In Python, a Set is an unordered collection of data types that is iterable, mutable and has no duplicate elements. The order of elements in a set is undefined though it may consist of various elements.",
    "code": null,
    "interviewerNote": "Categorize clearly: Numeric (int, float, complex), Sequences (str, list, tuple, range), Mappings (dict), Sets (set, frozenset).",
    "tags": [
      "types",
      "builtins",
      "data-structures"
    ]
  },
  {
    "id": "py-q5",
    "number": 5,
    "difficulty": "beginner",
    "question": "What is the difference between a Mutable datatype and an Immutable data type?",
    "summary": "- Mutable data types are objects whose values can be changed after they are created. Any modification is made in place without creating a new object. Common examples include lists, dictionaries and sets.\n- Immutable data types are objects whose value...",
    "explanation": "- Mutable data types are objects whose values can be changed after they are created. Any modification is made in place without creating a new object. Common examples include lists, dictionaries and sets.\n- Immutable data types are objects whose values cannot be changed after creation. If you modify them, Python creates a new object instead. Common examples include strings, tuples, integers and floats.\n\n```python\n# Mutable example\na = [1, 2, 3]\na.append(4)\nprint(a)        \n\n# Immutable example\ns = \"Hello\"\ns = s + \" World\"\nprint(s)       \n```\n\nExplanation: In the first example, the list a is modified directly by adding a new element. In the second example, strings are immutable, so concatenating \" World\" creates a new string object and assigns it back to s.",
    "code": "# Mutable example\na = [1, 2, 3]\na.append(4)\nprint(a)        \n\n# Immutable example\ns = \"Hello\"\ns = s + \" World\"\nprint(s)",
    "interviewerNote": "Classic trap: Explain that mutable modifications happen in-place at the same memory address id(); immutable creates a new object in heap.",
    "tags": [
      "memory",
      "mutability",
      "gotchas"
    ]
  },
  {
    "id": "py-q6",
    "number": 6,
    "difficulty": "beginner",
    "question": "What is the difference between == and is in Python?",
    "summary": "Both == and is are comparison operators, but they compare different things.\n- == checks whether two objects have the same value.\n- is checks whether two variables refer to the same object in memory.",
    "explanation": "Both == and is are comparison operators, but they compare different things.\n- == checks whether two objects have the same value.\n- is checks whether two variables refer to the same object in memory.\n\n```python\na = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)\nprint(a is b)\nprint(a is c)\n```",
    "code": "a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)\nprint(a is b)\nprint(a is c)",
    "interviewerNote": "Key distinction: '==' checks value equality (__eq__), 'is' checks memory address identity. Mention small integer caching (-5 to 256) gotcha.",
    "tags": [
      "operators",
      "identity",
      "equality"
    ]
  },
  {
    "id": "py-q7",
    "number": 7,
    "difficulty": "beginner",
    "question": "What is the difference between / and // in Python?",
    "summary": "/ represents precise division (result is a floating point number) whereas // represents floor division (result is an integer). For Example:",
    "explanation": "/ represents precise division (result is a floating point number) whereas // represents floor division (result is an integer). For Example:\n\n```python\nprint(5//2)\nprint(5/2)\n```",
    "code": "print(5//2)\nprint(5/2)",
    "interviewerNote": "'/' is float division (e.g. 5/2 = 2.5), '//' is floor division (e.g. 5//2 = 2). Notice negative number floor: -5//2 = -3!",
    "tags": [
      "operators",
      "math",
      "python3"
    ]
  },
  {
    "id": "py-q8",
    "number": 8,
    "difficulty": "beginner",
    "question": "How do you floor a number in Python?",
    "summary": "To floor a number in Python, you can use the math.floor() function, which returns the largest integer less than or equal to the given number.\n- floor() method returns the floor of x i.e., the largest integer not greater than x.\u00a0\n- Also, The method ce...",
    "explanation": "To floor a number in Python, you can use the math.floor() function, which returns the largest integer less than or equal to the given number.\n- floor() method returns the floor of x i.e., the largest integer not greater than x.\u00a0\n- Also, The method ceil (x) returns a ceiling value of x i.e., the smallest integer greater than or equal to x.\n\n```python\nimport math\n\nn = 3.7\nF_num = math.floor(n)\n\nprint(F_num) \n```",
    "code": "import math\n\nn = 3.7\nF_num = math.floor(n)\n\nprint(F_num)",
    "interviewerNote": "Explain math.floor() returns the greatest integer <= x, '//' operator performs floor division, and int() truncates towards zero.",
    "tags": [
      "math",
      "builtins",
      "standard-library"
    ]
  },
  {
    "id": "py-q9",
    "number": 9,
    "difficulty": "beginner",
    "question": "What is the difference between a Set and Dictionary?",
    "summary": "Set\u00a0is an unordered collection data type that is iterable, mutable and has no duplicate elements. Python\u2019s set class represents the mathematical notion of a set. Defined using curly braces {} or the set() function.",
    "explanation": "Set\u00a0is an unordered collection data type that is iterable, mutable and has no duplicate elements. Python\u2019s set class represents the mathematical notion of a set. Defined using curly braces {} or the set() function.\n\nExample: my_set = {1, 2, 3}\n\nDictionary is a collection of key-value pairs used to store and retrieve data using unique keys. Dictionaries preserve insertion order. Defined using curly braces {} with key-value pairs.\n\nExample: my_dict = {\"a\": 1, \"b\": 2, \"c\": 3}",
    "code": null,
    "interviewerNote": "Both use hash tables ($O(1)$ lookup), but Set stores unique hashable keys only, while Dict stores key-value pairs.",
    "tags": [
      "data-structures",
      "sets",
      "dicts"
    ]
  },
  {
    "id": "py-q10",
    "number": 10,
    "difficulty": "beginner",
    "question": "How is a dictionary different from a list?",
    "summary": "A list is an ordered collection of items that are accessed using their index position, whereas a dictionary is an ordered collection of key-value pairs that are accessed using unique keys. Lists are suitable for storing sequential data, while diction...",
    "explanation": "A list is an ordered collection of items that are accessed using their index position, whereas a dictionary is an ordered collection of key-value pairs that are accessed using unique keys. Lists are suitable for storing sequential data, while dictionaries are ideal for storing data associated with meaningful keys.\n\n```python\n# List\nnumbers = [10, 20, 30]\nprint(numbers[1])   \n\n# Dictionary\nstudent = {\"name\": \"Emma\", \"marks\": 95}\nprint(student[\"name\"])\n```",
    "code": "# List\nnumbers = [10, 20, 30]\nprint(numbers[1])   \n\n# Dictionary\nstudent = {\"name\": \"Emma\", \"marks\": 95}\nprint(student[\"name\"])",
    "interviewerNote": "List is an ordered indexed dynamic array ($O(n)$ search, $O(1)$ index lookup); Dict is a hash table ($O(1)$ key search).",
    "tags": [
      "data-structures",
      "dicts",
      "lists"
    ]
  },
  {
    "id": "py-q11",
    "number": 11,
    "difficulty": "beginner",
    "question": "What is the difference between Python Arrays and Lists?",
    "summary": "Arrays (when talking about the array module in Python) are specifically used to store a collection of numeric elements that are all of the same type. This makes them more efficient for storing large amounts of data and performing numerical computatio...",
    "explanation": "Arrays (when talking about the array module in Python) are specifically used to store a collection of numeric elements that are all of the same type. This makes them more efficient for storing large amounts of data and performing numerical computations where the type consistency is maintained.\n\n```python\nfrom array import array\narr = array('i', [1, 2, 3, 4])  # Array of integers\nprint(arr)\n```\n\nLists\u00a0are more flexible than arrays in that they can hold elements of different types (integers, strings, objects, etc.). They come built-in with Python and do not require importing any additional modules. Lists support a variety of operations that can modify the list.\n\n```python\na = [1, 'hello', 3.14, [1, 2, 3]]\nprint(a)\n```\n\nRead more about: List vs Array in Python",
    "code": "from array import array\narr = array('i', [1, 2, 3, 4])  # Array of integers\nprint(arr)",
    "interviewerNote": "Built-in lists hold heterogeneous object pointers; array module / numpy arrays hold contiguous homogeneous C-types with low memory overhead.",
    "tags": [
      "data-structures",
      "arrays",
      "lists"
    ]
  },
  {
    "id": "py-q12",
    "number": 12,
    "difficulty": "beginner",
    "question": "Difference between for loop and while loop in Python",
    "summary": "- For loop: Used when we know how many times to repeat, often with lists, tuples, sets or dictionaries.\n- While loop: Used when we only have an end condition and don\u2019t know exactly how many times it will repeat.",
    "explanation": "- For loop: Used when we know how many times to repeat, often with lists, tuples, sets or dictionaries.\n- While loop: Used when we only have an end condition and don\u2019t know exactly how many times it will repeat.\n\n```python\nfor i in range(5):\n    print(i)\n    \nprint()\n\nc = 0\nwhile c < 5:\n    print(c)\n    c += 1\n```",
    "code": "for i in range(5):\n    print(i)\n    \nprint()\n\nc = 0\nwhile c < 5:\n    print(c)\n    c += 1",
    "interviewerNote": "for loops consume the iterable protocol (__iter__ / __next__); while loops test a condition on each iteration.",
    "tags": [
      "control-flow",
      "loops",
      "iterators"
    ]
  },
  {
    "id": "py-q13",
    "number": 13,
    "difficulty": "beginner",
    "question": "What is a break, continue and pass in Python?",
    "summary": "- Break statement: Used to terminate the loop or statement in which it is present. After that, the control will pass to the statements that are present after the break statement, if available.\n- Continue: is also a loop control statement just like th...",
    "explanation": "- Break statement: Used to terminate the loop or statement in which it is present. After that, the control will pass to the statements that are present after the break statement, if available.\n- Continue: is also a loop control statement just like the break statement. continue statement is opposite to that of the break statement, instead of terminating the loop, it forces to execute the next iteration of the loop.\n- Pass: means performing no operation or in other words, it is a placeholder in the compound statement, where there should be a blank left and nothing has to be written there.",
    "code": null,
    "interviewerNote": "break exits loop, continue skips to next iteration, pass is a syntactic null-statement placeholder.",
    "tags": [
      "control-flow",
      "keywords"
    ]
  },
  {
    "id": "py-q14",
    "number": 14,
    "difficulty": "beginner",
    "question": "What is a lambda function?",
    "summary": "A lambda function is an anonymous function. This function can have any number of parameters but, can have just one statement. In the example, we defined a lambda function(upper) to convert a string to its upper case using\u00a0upper().",
    "explanation": "A lambda function is an anonymous function. This function can have any number of parameters but, can have just one statement. In the example, we defined a lambda function(upper) to convert a string to its upper case using\u00a0upper().\n\n```python\ns1 = 'GeeksforGeeks'\ns2 = lambda func: func.upper()\nprint(s2(s1))\n```",
    "code": "s1 = 'GeeksforGeeks'\ns2 = lambda func: func.upper()\nprint(s2(s1))",
    "interviewerNote": "Anonymous inline function restricted to a single expression. Best used for short key callbacks like sorted(data, key=lambda x: x[1]).",
    "tags": [
      "functions",
      "functional",
      "lambda"
    ]
  },
  {
    "id": "py-q15",
    "number": 15,
    "difficulty": "beginner",
    "question": "What are map(), filter(), and reduce() in Python?",
    "summary": "These functions are used for functional programming:\n- map() applies a function to every element.\n- filter() selects elements that satisfy a condition.\n- reduce() combines all elements into a single value.",
    "explanation": "These functions are used for functional programming:\n- map() applies a function to every element.\n- filter() selects elements that satisfy a condition.\n- reduce() combines all elements into a single value.\n\n```python\nfrom functools import reduce\n\nnumbers = [1,2,3,4]\nprint(list(map(lambda x: x*2, numbers)))\nprint(list(filter(lambda x: x%2==0, numbers)))\nprint(reduce(lambda x,y:x+y, numbers))\n```",
    "code": "from functools import reduce\n\nnumbers = [1,2,3,4]\nprint(list(map(lambda x: x*2, numbers)))\nprint(list(filter(lambda x: x%2==0, numbers)))\nprint(reduce(lambda x,y:x+y, numbers))",
    "interviewerNote": "map applies function to iterable, filter yields items where predicate is True, reduce (functools) cumulatively folds values. Mention list comprehensions are often preferred.",
    "tags": [
      "functional",
      "builtins"
    ]
  },
  {
    "id": "py-q16",
    "number": 16,
    "difficulty": "beginner",
    "question": "Can we Pass a function as an argument in Python?",
    "summary": "Yes, several arguments can be passed to a function, including objects, variables (of the same or distinct data types) and functions. Functions can be passed as parameters to other functions because they are objects. Higher-order functions are functio...",
    "explanation": "Yes, several arguments can be passed to a function, including objects, variables (of the same or distinct data types) and functions. Functions can be passed as parameters to other functions because they are objects. Higher-order functions are functions that can take other functions as arguments.\n\n```python\ndef add(x, y):\n    return x + y\n\ndef apply_func(func, a, b):\n    return func(a, b)\n\nprint(apply_func(add, 3, 5))\n```\n\nThe add function is passed as an argument to apply_func, which applies it to 3 and 5.",
    "code": "def add(x, y):\n    return x + y\n\ndef apply_func(func, a, b):\n    return func(a, b)\n\nprint(apply_func(add, 3, 5))",
    "interviewerNote": "Functions are first-class citizens in Python\u2014can be passed as arguments, assigned to variables, and returned from other functions.",
    "tags": [
      "functions",
      "first-class",
      "closures"
    ]
  },
  {
    "id": "py-q17",
    "number": 17,
    "difficulty": "beginner",
    "question": "What are *args and **kwargs?",
    "summary": "*args: used to pass a variable number of arguments to a function. Python program to illustrate *args for a variable number of arguments.",
    "explanation": "*args: used to pass a variable number of arguments to a function. Python program to illustrate *args for a variable number of arguments.\n\n```python\ndef fun(*argv):\n    for arg in argv:\n        print(arg)\n\nfun('Hello', 'Welcome', 'to', 'GeeksforGeeks')\n```\n\n**kwargs: used to accept a variable number of keyword arguments. These arguments are collected into a dictionary, where the keys are the argument names and the values are the corresponding values. \n\n```python\ndef fun(**kwargs):\n    for k, val in kwargs.items():\n        print(\"%s == %s\" % (k, val))\n\nfun(s1='Geeks', s2='for', s3='Geeks')\n```",
    "code": "def fun(*argv):\n    for arg in argv:\n        print(arg)\n\nfun('Hello', 'Welcome', 'to', 'GeeksforGeeks')",
    "interviewerNote": "*args packs extra positional arguments into a tuple; **kwargs packs extra keyword arguments into a dictionary. Crucial for decorators and forwarding.",
    "tags": [
      "functions",
      "parameters",
      "args-kwargs"
    ]
  },
  {
    "id": "py-q18",
    "number": 18,
    "difficulty": "beginner",
    "question": "How are arguments passed by value or by reference in Python?",
    "summary": "Python uses Pass by Object Reference (also called Call by Object Sharing) to pass arguments to functions. Instead of passing values or references directly, Python passes a reference to the object. Whether the original object changes depends on whethe...",
    "explanation": "Python uses Pass by Object Reference (also called Call by Object Sharing) to pass arguments to functions. Instead of passing values or references directly, Python passes a reference to the object. Whether the original object changes depends on whether it is mutable or immutable.\n\n```python\ndef call_by_val(x):\n    x = x * 2\n    return x\n\ndef call_by_ref(b):\n    b.append(\"D\")\n    return b\n\na = [\"E\"]\nnum = 6\n\nupdated_num = call_by_val(num)\nupdated_list = call_by_ref(a)\nprint(\"Updated value after call_by_val:\", updated_num)\nprint(\"Updated list after call_by_ref:\", updated_list)\n```",
    "code": "def call_by_val(x):\n    x = x * 2\n    return x\n\ndef call_by_ref(b):\n    b.append(\"D\")\n    return b\n\na = [\"E\"]\nnum = 6\n\nupdated_num = call_by_val(num)\nupdated_list = call_by_ref(a)\nprint(\"Updated value after call_by_val:\", updated_num)\nprint(\"Updated list after call_by_ref:\", updated_list)",
    "interviewerNote": "Python uses 'Call by Object Reference' (or Call by Sharing). If the object is mutable and modified in-place, the caller sees changes; if reassigned, it does not.",
    "tags": [
      "memory",
      "functions",
      "evaluation"
    ]
  },
  {
    "id": "py-q19",
    "number": 19,
    "difficulty": "beginner",
    "question": "What is a Variable Scope in Python?",
    "summary": "The location where we can find a variable and also access it if required is called the scope of a variable.\n- Python Local variable: Local variables are those that are initialized within a function and are unique to that function. A local variable ca...",
    "explanation": "The location where we can find a variable and also access it if required is called the scope of a variable.\n- Python Local variable: Local variables are those that are initialized within a function and are unique to that function. A local variable cannot be accessed outside of the function.\n- Python Global variables: Global variables are the ones that are defined and declared outside any function and are not specified to any function.\n- Module-level scope: It refers to the global objects of the current module accessible in the program.\n- Outermost scope: It refers to any built-in names that the program can call. The name referenced is located last among the objects in this scope.",
    "code": null,
    "interviewerNote": "Scope determines variable visibility and lifespan: Local, Enclosing, Global, and Built-in.",
    "tags": [
      "scope",
      "variables"
    ]
  },
  {
    "id": "py-q20",
    "number": 20,
    "difficulty": "beginner",
    "question": "What is the LEGB rule in Python?",
    "summary": "Python follows the LEGB rule to resolve variable names. LEGB stands for:\n- L \u2013 Local\n- E \u2013 Enclosing\n- G \u2013 Global\n- B \u2013 Built-in",
    "explanation": "Python follows the LEGB rule to resolve variable names. LEGB stands for:\n- L \u2013 Local\n- E \u2013 Enclosing\n- G \u2013 Global\n- B \u2013 Built-in\n\nPython searches for a variable in this order until it is found.\n\n```python\nx = \"Global\"\n\ndef outer():\n    x = \"Enclosing\"\n\n    def inner():\n        x = \"Local\"\n        print(x)\n\n    inner()\n\nouter()\n```",
    "code": "x = \"Global\"\n\ndef outer():\n    x = \"Enclosing\"\n\n    def inner():\n        x = \"Local\"\n        print(x)\n\n    inner()\n\nouter()",
    "interviewerNote": "LEGB rule dictates namespace search order: Local -> Enclosing -> Global -> Built-in. Python stops at the first match.",
    "tags": [
      "scope",
      "legb",
      "lookup"
    ]
  },
  {
    "id": "py-q21",
    "number": 21,
    "difficulty": "beginner",
    "question": "What are the global and nonlocal keywords in Python?",
    "summary": "Both keywords allow modifying variables outside the current function.\n- global modifies a global variable.\n- nonlocal modifies a variable from the nearest enclosing function.",
    "explanation": "Both keywords allow modifying variables outside the current function.\n- global modifies a global variable.\n- nonlocal modifies a variable from the nearest enclosing function.\n\n```python\ncount = 0\n\ndef increment():\n    global count\n    count += 1\n\nincrement()\nprint(count)\n```\n\nExample of nonlocal:\n\n```python\ndef outer():\n    x = 10\n\n    def inner():\n        nonlocal x\n        x += 5\n\n    inner()\n    print(x)\n\nouter()\n```",
    "code": "count = 0\n\ndef increment():\n    global count\n    count += 1\n\nincrement()\nprint(count)",
    "interviewerNote": "global declares variable is at module level; nonlocal declares variable is in the nearest enclosing (outer function) scope.",
    "tags": [
      "scope",
      "keywords",
      "closures"
    ]
  },
  {
    "id": "py-q22",
    "number": 22,
    "difficulty": "beginner",
    "question": "What is docstring in Python?",
    "summary": "Python documentation strings (or docstrings) provide a convenient way of associating documentation with Python modules, functions, classes and methods.\n- Declaring Docstrings: Docstrings are written using triple single quotes (''') or triple double q...",
    "explanation": "Python documentation strings (or docstrings) provide a convenient way of associating documentation with Python modules, functions, classes and methods.\n- Declaring Docstrings: Docstrings are written using triple single quotes (''') or triple double quotes (\"\"\") immediately below the module, class, method or function definition.\n- Accessing Docstrings: Docstrings can be accessed using the __doc__ attribute of the object or by using the help() function.\n\n```python\ndef add(a, b):\n    \"\"\"Return the sum of two numbers.\"\"\"\n    return a + b\n\nprint(add.__doc__)\nhelp(add)\n```\n\nExplanation: In this example, the function add() includes a docstring that describes its purpose. The docstring can be viewed directly using add.__doc__ or through the built-in help() function.",
    "code": "def add(a, b):\n    \"\"\"Return the sum of two numbers.\"\"\"\n    return a + b\n\nprint(add.__doc__)\nhelp(add)",
    "interviewerNote": "First statement in module/class/function as string literal. Accessible via __doc__ and used by help() and automated doc generators.",
    "tags": [
      "documentation",
      "pep257"
    ]
  },
  {
    "id": "py-q23",
    "number": 23,
    "difficulty": "beginner",
    "question": "How can you concatenate two lists in Python?",
    "summary": "We can concatenate two lists in Python using the +operator or the extend() method.",
    "explanation": "We can concatenate two lists in Python using the +operator or the extend() method.\n\n1. + operator: This creates a new list by joining two lists together.\n\n```python\na = [1, 2, 3]\nb = [4, 5, 6]\nres = a + b\nprint(res) \n```\n\n2. extend() : This adds all the elements of the second list to the first list in-place.\n\n```python\na = [1, 2, 3]\nb = [4, 5, 6]\na.extend(b)\nprint(a) \n```",
    "code": "a = [1, 2, 3]\nb = [4, 5, 6]\nres = a + b\nprint(res)",
    "interviewerNote": "Methods: '+' operator (creates new list), list.extend() (in-place modification), and unpacking [*a, *b].",
    "tags": [
      "lists",
      "concatenation"
    ]
  },
  {
    "id": "py-q24",
    "number": 24,
    "difficulty": "beginner",
    "question": "What is the difference between append() and extend()?",
    "summary": "Both methods add elements to a list:\n- append() adds the entire object as a single element.\n- extend() adds each element of an iterable individually.",
    "explanation": "Both methods add elements to a list:\n- append() adds the entire object as a single element.\n- extend() adds each element of an iterable individually.\n\n```python\na = [1,2]\na.append([3,4])\nprint(a)\n\nb = [1,2]\nb.extend([3,4])\nprint(b)\n```",
    "code": "a = [1,2]\na.append([3,4])\nprint(a)\n\nb = [1,2]\nb.extend([3,4])\nprint(b)",
    "interviewerNote": "append(item) adds the argument as a single element; extend(iterable) unpacks and appends each element of the iterable.",
    "tags": [
      "lists",
      "methods"
    ]
  },
  {
    "id": "py-q25",
    "number": 25,
    "difficulty": "beginner",
    "question": "What is the difference between remove(), pop(), and del?",
    "summary": "All three remove elements from a list but work differently:\n- remove() deletes the first matching value.\n- pop() removes an element using its index and returns it.\n- del deletes an element or an entire list.",
    "explanation": "All three remove elements from a list but work differently:\n- remove() deletes the first matching value.\n- pop() removes an element using its index and returns it.\n- del deletes an element or an entire list.\n\n```python\nnum = [10,20,30,40]\nnum.remove(20)\nnum.pop()\ndel num[0]\nprint(num)\n```",
    "code": "num = [10,20,30,40]\nnum.remove(20)\nnum.pop()\ndel num[0]\nprint(num)",
    "interviewerNote": "remove(val) removes first matching value; pop([i]) removes and returns element at index (default last); del statement deletes by index or slice.",
    "tags": [
      "lists",
      "deletion"
    ]
  },
  {
    "id": "py-q26",
    "number": 26,
    "difficulty": "beginner",
    "question": "What is List Comprehension? Give an Example.",
    "summary": "List comprehension\u00a0is a way to create lists using a concise syntax. It allows us to generate a new list by applying an\u00a0expression\u00a0to each item in an existing\u00a0iterable\u00a0(such as a\u00a0list\u00a0or\u00a0range). This helps us to write cleaner, more readable code compa...",
    "explanation": "List comprehension\u00a0is a way to create lists using a concise syntax. It allows us to generate a new list by applying an\u00a0expression\u00a0to each item in an existing\u00a0iterable\u00a0(such as a\u00a0list\u00a0or\u00a0range). This helps us to write cleaner, more readable code compared to traditional looping techniques.\n\nFor example, if we have a list of integers and want to create a new list containing the square of each element, we can easily achieve this using list comprehension.\n\n```python\na = [2,3,4,5]\nres = [val ** 2 for val in a]\nprint(res)\n```",
    "code": "a = [2,3,4,5]\nres = [val ** 2 for val in a]\nprint(res)",
    "interviewerNote": "Concise syntax [expr for item in iterable if cond]. Evaluates faster in CPython than equivalent for-append loop due to optimized bytecode.",
    "tags": [
      "comprehensions",
      "lists",
      "idiomatic"
    ]
  },
  {
    "id": "py-q27",
    "number": 27,
    "difficulty": "beginner",
    "question": "How is Exceptional handling done in Python?",
    "summary": "Exception handling in Python is used to manage runtime errors gracefully without stopping the program abruptly. Python provides three main keywords for handling exceptions:\n- try: A block of code that is monitored for errors.\n- except: Executes when...",
    "explanation": "Exception handling in Python is used to manage runtime errors gracefully without stopping the program abruptly. Python provides three main keywords for handling exceptions:\n- try: A block of code that is monitored for errors.\n- except: Executes when an error occurs in the try block.\n- finally: Executes after the try and except blocks, regardless of whether an error occurred. It\u2019s used for cleanup tasks.\n\nExample: Trying to divide a number by zero will cause an exception.\n\n```python\nn = 10\ntry:\n    res = n / 0  # Raises ZeroDivisionError\n\nexcept ZeroDivisionError:\n    print(\"Can't be divided by zero!\")\n\nfinally:\n    print(\"Execution completed.\")\n```\n\nExplanation:\u00a0In this example, dividing number by 0 raises a\u00a0ZeroDivisionError. The try block contains the code that might cause an exception and the except block handles the exception, printing an error message instead of stopping the program.",
    "code": "n = 10\ntry:\n    res = n / 0  # Raises ZeroDivisionError\n\nexcept ZeroDivisionError:\n    print(\"Can't be divided by zero!\")\n\nfinally:\n    print(\"Execution completed.\")",
    "interviewerNote": "try-except-else-finally block. Else runs ONLY when no exception occurs; finally runs ALWAYS (ideal for closing sockets/files).",
    "tags": [
      "exceptions",
      "defensive"
    ]
  },
  {
    "id": "py-q28",
    "number": 28,
    "difficulty": "beginner",
    "question": "What are Modules and Packages in Python?",
    "summary": "A module is a single file that contains Python code (functions, variables, classes) which can be reused in other programs. You can think of it as a code library. For example: math is a built-in module that provides math functions like sqrt(), pi, etc...",
    "explanation": "A module is a single file that contains Python code (functions, variables, classes) which can be reused in other programs. You can think of it as a code library. For example: math is a built-in module that provides math functions like sqrt(), pi, etc.\n\n```python\nimport math\nprint(math.sqrt(16))  \n```\n\nPackage is a collection of related modules stored in a directory. It helps in organizing and grouping modules together for easier management. For example: The numpy package contains multiple modules for numerical operations. To create a package, the directory must contain a special file named __init__.py.",
    "code": "import math\nprint(math.sqrt(16))",
    "interviewerNote": "A module is a single .py file; a package is a directory containing modules and an __init__.py file (optional in Python 3.3+ namespace packages).",
    "tags": [
      "modules",
      "packaging"
    ]
  },
  {
    "id": "py-q29",
    "number": 29,
    "difficulty": "beginner",
    "question": "What is the purpose of if __name__ == \"__main__\" in Python?",
    "summary": "The if __name__ == \"__main__\" statement ensures that a block of code runs only when the file is executed directly, not when it is imported as a module.",
    "explanation": "The if __name__ == \"__main__\" statement ensures that a block of code runs only when the file is executed directly, not when it is imported as a module.\n\n```python\ndef greet():\n    print(\"Hello\")\n\nif __name__ == \"__main__\":\n    greet()\n```\n\n---\n\n## Intermediate Python Interview Questions",
    "code": "def greet():\n    print(\"Hello\")\n\nif __name__ == \"__main__\":\n    greet()",
    "interviewerNote": "Guards code from executing upon import. __name__ evaluates to '__main__' when run as a script, but to the module's name when imported.",
    "tags": [
      "execution",
      "entrypoint"
    ]
  },
  {
    "id": "py-q30",
    "number": 30,
    "difficulty": "intermediate",
    "question": "What is slicing in Python?",
    "summary": "Slicing is a technique used to extract a portion of a sequence such as a string, list, tuple or range. It allows to specify a starting index, an ending index and an optional step value.",
    "explanation": "Slicing is a technique used to extract a portion of a sequence such as a string, list, tuple or range. It allows to specify a starting index, an ending index and an optional step value.\n\nSyntax: slice(start, stop, step)\n\n```python\nl = [10, 20, 30, 40, 50]\nres = slice(1, 4)\nprint(l[res])\n```",
    "code": "l = [10, 20, 30, 40, 50]\nres = slice(1, 4)\nprint(l[res])",
    "interviewerNote": "sequence[start:stop:step]. Returns a new shallow copy slice. Negative indices count from end; step=-1 reverses sequence.",
    "tags": [
      "slicing",
      "sequences"
    ]
  },
  {
    "id": "py-q31",
    "number": 31,
    "difficulty": "intermediate",
    "question": "Differentiate between List and Tuple?",
    "summary": "Let\u2019s analyze the differences between List and Tuple:",
    "explanation": "Let\u2019s analyze the differences between List and Tuple:\n\nList\n- Lists are Mutable datatype.\n- Lists consume more memory\n- The list is better for performing operations, such as insertion and deletion.\n- The implication of iterations is Time-consuming\n\nTuple\n- Tuples are Immutable datatype.\n- Tuple consumes less memory as compared to the list\n- A Tuple data type is appropriate for accessing the elements\n- The implication of iterations is comparatively Faster",
    "code": null,
    "interviewerNote": "Lists are mutable (over-allocated dynamic arrays); tuples are immutable (fixed-size, can be dictionary keys if items are hashable).",
    "tags": [
      "data-structures",
      "tuples",
      "immutability"
    ]
  },
  {
    "id": "py-q32",
    "number": 32,
    "difficulty": "intermediate",
    "question": "What is Dictionary Comprehension? Give an Example",
    "summary": "Dictionary Comprehension is a concise way to create dictionaries from existing iterables. It allows to generate key-value pairs in a single line of code, making the code more readable and efficient.",
    "explanation": "Dictionary Comprehension is a concise way to create dictionaries from existing iterables. It allows to generate key-value pairs in a single line of code, making the code more readable and efficient.\n\n```python\nkeys = ['a', 'b', 'c', 'd', 'e']\nvalues = [1, 2, 3, 4, 5]\nd = {k: v for k, v in zip(keys, values)}\nprint(d)\n```",
    "code": "keys = ['a', 'b', 'c', 'd', 'e']\nvalues = [1, 2, 3, 4, 5]\nd = {k: v for k, v in zip(keys, values)}\nprint(d)",
    "interviewerNote": "{k_expr: v_expr for item in iterable}. Rapidly construct inverted or filtered mappings.",
    "tags": [
      "comprehensions",
      "dicts"
    ]
  },
  {
    "id": "py-q33",
    "number": 33,
    "difficulty": "intermediate",
    "question": "Is Tuple Comprehension possible in Python? If yes, how and if not why?",
    "summary": "Tuple comprehensions are not directly supported, Python's existing features like generator expressions and the tuple() function provide flexible alternatives for creating tuples from iterable data.",
    "explanation": "Tuple comprehensions are not directly supported, Python's existing features like generator expressions and the tuple() function provide flexible alternatives for creating tuples from iterable data.\n\n(i for i in (1, 2, 3))\n\nExplanation: \n- In Python, expressions enclosed in parentheses with a for loop produce a generator expression, which generates values lazily one at a time. \n- Since tuples are immutable sequences, Python does not provide a separate tuple comprehension syntax. Instead, the recommended approach is to use a generator expression and convert it into a tuple using tuple().",
    "code": null,
    "interviewerNote": "Tuple comprehension does NOT exist! (x for x in data) creates a generator expression. To get a tuple, wrap it: tuple(x for x in data).",
    "tags": [
      "comprehensions",
      "generators",
      "tuples"
    ]
  },
  {
    "id": "py-q34",
    "number": 34,
    "difficulty": "intermediate",
    "question": "What is the difference between a shallow copy and a deep copy?",
    "summary": "Below is the tabular difference between the Shallow Copy and Deep Copy:",
    "explanation": "Below is the tabular difference between the Shallow Copy and Deep Copy:\n\n| Shallow Copy | Deep Copy |\n| --- | --- |\n| Shallow Copy stores the references of objects to the original memory address. | Deep copy stores copies of the object\u2019s value. |\n| Shallow Copy reflects changes made to the new/copied object in the original object. | Deep copy doesn\u2019t reflect changes made to the new/copied object in the original object. |\n| Shallow Copy stores the copy of the original object and points the references to the objects. | Deep copy stores the copy of the original object and recursively copies the objects as well. |\n| A shallow copy is faster. | Deep copy is comparatively slower. |",
    "code": null,
    "interviewerNote": "Shallow copy (copy.copy) creates a new container but references child objects; deep copy (copy.deepcopy) recursively clones all nested objects.",
    "tags": [
      "memory",
      "copying"
    ]
  },
  {
    "id": "py-q35",
    "number": 35,
    "difficulty": "intermediate",
    "question": "What are Iterators in Python?",
    "summary": "Iterators are used to iterate a group of elements, containers like a list. Iterators work on iterable objects such as lists, tuples and dictionaries. Python iterator implements __iter__() and the next() methods to iterate the stored elements. We gene...",
    "explanation": "Iterators are used to iterate a group of elements, containers like a list. Iterators work on iterable objects such as lists, tuples and dictionaries. Python iterator implements __iter__() and the next() methods to iterate the stored elements. We generally use loops to iterate over the collections (list, tuple) in Python.\n\n```python\ns = \"GFG\"\nit = iter(s)\n\nprint(next(it))\nprint(next(it))\nprint(next(it))\n```",
    "code": "s = \"GFG\"\nit = iter(s)\n\nprint(next(it))\nprint(next(it))\nprint(next(it))",
    "interviewerNote": "An object implementing __iter__() (returns self) and __next__() (returns next item or raises StopIteration).",
    "tags": [
      "iterators",
      "protocols"
    ]
  },
  {
    "id": "py-q36",
    "number": 36,
    "difficulty": "intermediate",
    "question": "What are Magic (Dunder) Methods in Python?",
    "summary": "Magic methods are special methods whose names begin and end with double underscores. They allow developers to customize the behavior of objects. Common magic methods include:\n- __init__()\n- __str__()\n- __repr__()\n- __len__()",
    "explanation": "Magic methods are special methods whose names begin and end with double underscores. They allow developers to customize the behavior of objects. Common magic methods include:\n- __init__()\n- __str__()\n- __repr__()\n- __len__()\n\n```python\nclass Student:\n\n    def __init__(self, name):\n        self.name = name\n\n    def __str__(self):\n        return self.name\n\ns = Student(\"Alice\")\nprint(s)\n```",
    "code": "class Student:\n\n    def __init__(self, name):\n        self.name = name\n\n    def __str__(self):\n        return self.name\n\ns = Student(\"Alice\")\nprint(s)",
    "interviewerNote": "Special methods with leading/trailing double underscores (__repr__, __add__, __len__) that hook into Python's internal protocol operations.",
    "tags": [
      "dunder",
      "data-model",
      "protocols"
    ]
  },
  {
    "id": "py-q37",
    "number": 37,
    "difficulty": "intermediate",
    "question": "What are Generators in Python?",
    "summary": "Generators are a simple and memory-efficient way to create iterators in Python. They generate values one at a time only when needed, rather than storing all values in memory at once. A function becomes a generator if it contains the yield statement....",
    "explanation": "Generators are a simple and memory-efficient way to create iterators in Python. They generate values one at a time only when needed, rather than storing all values in memory at once. A function becomes a generator if it contains the yield statement. Each time yield is executed, the function returns a value and pauses its execution. When the next value is requested, execution resumes from where it left off.\n\nGenerators automatically implement the __iter__() and __next__() methods, which allows them to be used directly in loops and with the next() function.\n\n```python\ndef fun(max):\n    cnt = 1\n    while cnt <= max:\n        yield cnt\n        cnt += 1\n\nctr = fun(5)\nfor n in ctr:\n    print(n)\n```",
    "code": "def fun(max):\n    cnt = 1\n    while cnt <= max:\n        yield cnt\n        cnt += 1\n\nctr = fun(5)\nfor n in ctr:\n    print(n)",
    "interviewerNote": "Functions containing 'yield' that return generator iterators. Suspend and resume execution frame without exhausting RAM.",
    "tags": [
      "generators",
      "lazy-eval",
      "yield"
    ]
  },
  {
    "id": "py-q38",
    "number": 38,
    "difficulty": "intermediate",
    "question": "Which sorting technique is used by sort() and sorted() functions of python?",
    "summary": "Python uses the Tim Sort algorithm for sorting. It\u2019s a stable sorting whose worst case is O(N log N). It\u2019s a hybrid sorting algorithm, derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data.",
    "explanation": "Python uses the Tim Sort algorithm for sorting. It\u2019s a stable sorting whose worst case is O(N log N). It\u2019s a hybrid sorting algorithm, derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data.",
    "code": null,
    "interviewerNote": "Timsort (hybrid of Merge Sort and Insertion Sort). $O(n \\log n)$ worst-case, $O(n)$ best-case on partially sorted data, stable.",
    "tags": [
      "algorithms",
      "sorting",
      "timsort"
    ]
  },
  {
    "id": "py-q39",
    "number": 39,
    "difficulty": "intermediate",
    "question": "What is the difference between sort() and sorted()?",
    "summary": "sort()\t\n- Sorts original list\n- Changes existing list",
    "explanation": "sort()\t\n- Sorts original list\n- Changes existing list\n\nsorted()\n- Returns a new sorted list\n- Does not modify original list\n\n```python\nnum = [3,1,2]\n\nprint(sorted(num))\nprint(num)\n\nnum.sort()\nprint(num)\n```",
    "code": "num = [3,1,2]\n\nprint(sorted(num))\nprint(num)\n\nnum.sort()\nprint(num)",
    "interviewerNote": "list.sort() sorts the list in-place and returns None; sorted(iterable) returns a new sorted list leaving original untouched.",
    "tags": [
      "sorting",
      "methods"
    ]
  },
  {
    "id": "py-q40",
    "number": 40,
    "difficulty": "intermediate",
    "question": "Does Python supports multiple Inheritance?",
    "summary": "When a class is derived from more than one base class it is called multiple Inheritance. The derived class inherits all the features of the base case.Multiple Inheritance",
    "explanation": "When a class is derived from more than one base class it is called multiple Inheritance. The derived class inherits all the features of the base case.Multiple Inheritance\n\nPython does support multiple inheritances, unlike some programming languages that restrict multiple inheritance of classes. For example:\n\n```python\nclass A:\n    def method_a(self):\n        print(\"Method from class A\")\n\nclass B:\n    def method_b(self):\n        print(\"Method from class B\")\n\nclass C(A, B):\n    pass\n\nobj = C()\nobj.method_a()\nobj.method_b()\n```\n\nExplanation:\n- A and B are parent classes, each defining one method.\n- C(A, B) inherits from both parent classes.\n- obj = C() creates an object of class C.\n- The object obj can call methods from both A and B.",
    "code": "class A:\n    def method_a(self):\n        print(\"Method from class A\")\n\nclass B:\n    def method_b(self):\n        print(\"Method from class B\")\n\nclass C(A, B):\n    pass\n\nobj = C()\nobj.method_a()\nobj.method_b()",
    "interviewerNote": "Yes, Python fully supports multiple inheritance. Resolved deterministically using C3 Linearization (MRO).",
    "tags": [
      "oop",
      "inheritance",
      "mro"
    ]
  },
  {
    "id": "py-q41",
    "number": 41,
    "difficulty": "intermediate",
    "question": "What is Method Resolution Order (MRO) in Python?",
    "summary": "Method Resolution Order (MRO) defines the order in which Python searches for methods in classes when multiple inheritance is used. The MRO can be viewed using the mro() method.",
    "explanation": "Method Resolution Order (MRO) defines the order in which Python searches for methods in classes when multiple inheritance is used. The MRO can be viewed using the mro() method.\n\n```python\nclass A:\n    pass\n\nclass B(A):\n    pass\n\nclass C(B):\n    pass\n\nprint(C.mro())\n```",
    "code": "class A:\n    pass\n\nclass B(A):\n    pass\n\nclass C(B):\n    pass\n\nprint(C.mro())",
    "interviewerNote": "Method Resolution Order: The deterministic order in which Python searches base classes for attributes/methods, viewed via Class.__mro__.",
    "tags": [
      "oop",
      "mro",
      "c3-linearization"
    ]
  },
  {
    "id": "py-q42",
    "number": 42,
    "difficulty": "intermediate",
    "question": "What is the purpose of the super() function in Python?",
    "summary": "The super() function allows a child class to access methods and constructors of its parent class.",
    "explanation": "The super() function allows a child class to access methods and constructors of its parent class.\n\n```python\nclass Animal:\n\n    def __init__(self):\n        print(\"Animal\")\n\nclass Dog(Animal):\n\n    def __init__(self):\n        super().__init__()\n        print(\"Dog\")\n\nDog()\n```",
    "code": "class Animal:\n\n    def __init__(self):\n        print(\"Animal\")\n\nclass Dog(Animal):\n\n    def __init__(self):\n        super().__init__()\n        print(\"Dog\")\n\nDog()",
    "interviewerNote": "Delegates method calls to the next class in the MRO chain. Essential for cooperative multiple inheritance.",
    "tags": [
      "oop",
      "super",
      "cooperative"
    ]
  },
  {
    "id": "py-q43",
    "number": 43,
    "difficulty": "intermediate",
    "question": "What is Polymorphism in Python?",
    "summary": "Polymorphism means \"many forms.\" It allows same method name to perform different actions depending on the object that calls it. This is achieved through method overriding, where child classes provide their own implementation of a method defined in a...",
    "explanation": "Polymorphism means \"many forms.\" It allows same method name to perform different actions depending on the object that calls it. This is achieved through method overriding, where child classes provide their own implementation of a method defined in a parent class.\n- The same method name can behave differently for different objects.\n- Child classes can override methods of parent classes.\n- It improves code flexibility and reusability.\n\n```python\nclass Animal:\n    def sound(self):\n        print(\"Some sound\")\n\nclass Dog(Animal):\n    def sound(self):\n        print(\"Bark\")\n\nclass Cat(Animal):\n    def sound(self):\n        print(\"Meow\")\n\nfor animal in [Dog(), Cat()]:\n    animal.sound()\n```\n\nExplanation:\n- Dog and Cat override the sound() method of Animal.\n- The same sound() method produces different outputs for different objects.\n- This demonstrates polymorphism in Python.",
    "code": "class Animal:\n    def sound(self):\n        print(\"Some sound\")\n\nclass Dog(Animal):\n    def sound(self):\n        print(\"Bark\")\n\nclass Cat(Animal):\n    def sound(self):\n        print(\"Meow\")\n\nfor animal in [Dog(), Cat()]:\n    animal.sound()",
    "interviewerNote": "Duck typing: 'If it walks like a duck and quacks like a duck, it's a duck.' Python checks for behavior/methods at runtime, not strict inheritance.",
    "tags": [
      "oop",
      "polymorphism",
      "duck-typing"
    ]
  },
  {
    "id": "py-q44",
    "number": 44,
    "difficulty": "intermediate",
    "question": "Define encapsulation in Python?",
    "summary": "Encapsulation is the process of hiding the internal state of an object and requiring all interactions to be performed through an object\u2019s methods. This approach:\n- Provides better control over data.\n- Prevents accidental modification of data.\n- Promo...",
    "explanation": "Encapsulation is the process of hiding the internal state of an object and requiring all interactions to be performed through an object\u2019s methods. This approach:\n- Provides better control over data.\n- Prevents accidental modification of data.\n- Promotes modular programming.\n\nPython achieves encapsulation through\u00a0public,\u00a0protected\u00a0and\u00a0private\u00a0attributes.Encapsulation",
    "code": null,
    "interviewerNote": "Bundling data and methods. Python uses naming conventions: single underscore _internal (protected hint), double underscore __private (name mangled).",
    "tags": [
      "oop",
      "encapsulation"
    ]
  },
  {
    "id": "py-q45",
    "number": 45,
    "difficulty": "intermediate",
    "question": "How do you do data abstraction in Python?",
    "summary": "Data Abstraction means providing only the essential details while hiding the implementation. It allows users to interact with an object through a simple interface without needing to understand its internal working. It's achieved using abstract base c...",
    "explanation": "Data Abstraction means providing only the essential details while hiding the implementation. It allows users to interact with an object through a simple interface without needing to understand its internal working. It's achieved using abstract base classes provided by the abc module. These classes define abstract methods that must be implemented by derived classes.\n\n```python\nfrom abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    def area(self):\n        return 3.14 * 5 * 5\n\nc = Circle()\nprint(c.area())\n```\n\nExplanation:\n- Shape defines an abstract method area().\n- Circle implements the area() method and Circle objects can use area() normally.\n- The implementation details are hidden behind a common interface.",
    "code": "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    def area(self):\n        return 3.14 * 5 * 5\n\nc = Circle()\nprint(c.area())",
    "interviewerNote": "Abstract Base Classes via the 'abc' module and '@abstractmethod' decorator prevent instantiation until subclasses implement required interfaces.",
    "tags": [
      "oop",
      "abstraction",
      "abc"
    ]
  },
  {
    "id": "py-q46",
    "number": 46,
    "difficulty": "intermediate",
    "question": "What are Decorators?",
    "summary": "Decorators is a flexible way to modify or extend the behavior of functions or methods, without changing their actual code. A decorator is essentially a function that takes another function as an argument and returns a new function with enhanced funct...",
    "explanation": "Decorators is a flexible way to modify or extend the behavior of functions or methods, without changing their actual code. A decorator is essentially a function that takes another function as an argument and returns a new function with enhanced functionality.\n\nDecorators are often used in scenarios such as logging, authentication and memorization, allowing us to add additional functionality to existing functions or methods in a clean, reusable way.",
    "code": null,
    "interviewerNote": "A callable that takes a function and returns an enhanced function. Syntactic sugar @dec. Remember to use functools.wraps.",
    "tags": [
      "decorators",
      "meta-programming"
    ]
  },
  {
    "id": "py-q47",
    "number": 47,
    "difficulty": "intermediate",
    "question": "What is a namespace in Python?",
    "summary": "A namespace refers to a container where names (variables, functions, objects) are mapped to objects. In simple terms, a namespace is a space where names are defined and stored and it helps avoid naming conflicts by ensuring that names are unique with...",
    "explanation": "A namespace refers to a container where names (variables, functions, objects) are mapped to objects. In simple terms, a namespace is a space where names are defined and stored and it helps avoid naming conflicts by ensuring that names are unique within a given scope.Namespace\n\nTypes of Namespaces:\n- Built-in Namespace: Contains all the built-in functions and exceptions, like print(), int(), etc. These are available in every Python program.\n- Global Namespace: Contains names from all the objects, functions and variables in the program at the top level.\n- Local Namespace: Refers to names inside a function or method. Each function call creates a new local namespace.",
    "code": null,
    "interviewerNote": "A mapping from names to objects implemented internally as Python dictionaries (globals(), locals(), __dict__).",
    "tags": [
      "internals",
      "namespaces"
    ]
  },
  {
    "id": "py-q48",
    "number": 48,
    "difficulty": "intermediate",
    "question": "How is memory management done in Python?",
    "summary": "Python uses its private heap space to manage the memory. Basically, all the objects and data structures are stored in the private heap space. Even the programmer can not access this private space as the interpreter takes care of this space. Python al...",
    "explanation": "Python uses its private heap space to manage the memory. Basically, all the objects and data structures are stored in the private heap space. Even the programmer can not access this private space as the interpreter takes care of this space. Python also has an inbuilt garbage collector, which recycles all the unused memory and frees the memory and makes it available to the heap space.\n\nPython manages memory automatically using a private heap, where all objects and data structures are stored. Python interpreter handles memory allocation and deallocation and an inbuilt garbage collector reclaims memory occupied by objects that are no longer in use.\n- All objects and data structures are stored in a private heap.\n- The Python interpreter manages memory allocation automatically.\n- Programmers do not access the private heap directly.\n- Python uses garbage collection to free unused memory.",
    "code": null,
    "interviewerNote": "Primary: Reference counting (instant free when refcount=0). Secondary: Generational cyclic Garbage Collector (gc module) detects circular references.",
    "tags": [
      "memory",
      "gc",
      "refcounting"
    ]
  },
  {
    "id": "py-q49",
    "number": 49,
    "difficulty": "intermediate",
    "question": "How to delete a file using Python?",
    "summary": "Python provides several ways to delete files, some of them are as following:\n- os.remove() deletes a file permanently.\n- send2trash.send2trash() moves a file to the recycle bin or trash.\u00a0\n- os.rmdir is used to remove empty directories, not files.",
    "explanation": "Python provides several ways to delete files, some of them are as following:\n- os.remove() deletes a file permanently.\n- send2trash.send2trash() moves a file to the recycle bin or trash.\u00a0\n- os.rmdir is used to remove empty directories, not files.",
    "code": null,
    "interviewerNote": "os.remove(path) or pathlib.Path.unlink(). For directories: os.rmdir() or shutil.rmtree().",
    "tags": [
      "files",
      "os-module"
    ]
  },
  {
    "id": "py-q50",
    "number": 50,
    "difficulty": "intermediate",
    "question": "How do you debug a Python program?",
    "summary": "1. Using pdb (Python Debugger): pdb is a built-in module that allows you to set breakpoints and step through the code line by line. You can start the debugger by adding import pdb; pdb.set_trace() in your code where you want to begin debugging.",
    "explanation": "1. Using pdb (Python Debugger): pdb is a built-in module that allows you to set breakpoints and step through the code line by line. You can start the debugger by adding import pdb; pdb.set_trace() in your code where you want to begin debugging.\n\n```python\nimport pdb\nx = 5\npdb.set_trace()  # Debugger starts here\nprint(x)\n```\n\n> /home/repl/02c07243-5df9-4fb0-a2cd-54fe6d597c80/main.py(4)<module>()   \n-> print(x)   \n(Pdb) \n\n2. Using logging Module: For more advanced debugging, the logging module provides a flexible way to log messages with different severity levels (INFO, DEBUG, WARNING, ERROR, CRITICAL).\n\n```python\nimport logging\nlogging.basicConfig(level=logging.DEBUG)\nlogging.debug(\"This is a debug message\")\n```\n\nDEBUG:root:This is a debug message",
    "code": "import pdb\nx = 5\npdb.set_trace()  # Debugger starts here\nprint(x)",
    "interviewerNote": "Use pdb / breakpoint() built-in, IDE debuggers, structured logging, or trace/sys.settrace.",
    "tags": [
      "debugging",
      "pdb",
      "tooling"
    ]
  },
  {
    "id": "py-q51",
    "number": 51,
    "difficulty": "intermediate",
    "question": "What is the difference between xrange and range functions?",
    "summary": "range() and xrange() were both used in Python 2 to generate sequences of numbers for iteration.\u00a0In Python 3, there is no xrange, but the range function behaves like xrange.\n- range(): returns a range object, which is an immutable sequence type that g...",
    "explanation": "range() and xrange() were both used in Python 2 to generate sequences of numbers for iteration.\u00a0In Python 3, there is no xrange, but the range function behaves like xrange.\n- range(): returns a range object, which is an immutable sequence type that generates the numbers on demand.\u00a0\n- xrange(): returns the generator object that can be used to display numbers only by looping. The only particular range is displayed on demand and hence called lazy evaluation.\n\n---\n\n## Advanced Python Interview Questions & Answers",
    "code": null,
    "interviewerNote": "In Python 2, range() created a full list, xrange() was a lazy generator. In Python 3, range() is an immutable sequence type with $O(1)$ memory.",
    "tags": [
      "python2-vs-3",
      "range"
    ]
  },
  {
    "id": "py-q52",
    "number": 52,
    "difficulty": "advanced",
    "question": "What is PIP?",
    "summary": "PIP stands for \"Pip Installs Packages.\" It is Python\u2019s standard package manager used to install, upgrade and manage third-party libraries and dependencies from the Python Package Index (PyPI). \n- Used to install Python packages from PyPI.\n- Comes pre...",
    "explanation": "PIP stands for \"Pip Installs Packages.\" It is Python\u2019s standard package manager used to install, upgrade and manage third-party libraries and dependencies from the Python Package Index (PyPI). \n- Used to install Python packages from PyPI.\n- Comes pre-installed with most modern Python distributions.\n- Supports installing, upgrading and uninstalling packages.\n- Works from the command line.\n\npip install numpy",
    "code": null,
    "interviewerNote": "Package Installer for Python. Resolves and downloads wheels/sdists from PyPI into virtual environments.",
    "tags": [
      "tooling",
      "packaging",
      "pip"
    ]
  },
  {
    "id": "py-q53",
    "number": 53,
    "difficulty": "advanced",
    "question": "What is a zip function?",
    "summary": "zip() function returns a zip object, which maps a similar index of multiple containers. It takes an iterable, converts it into an iterator and aggregates the elements based on iterables passed. It returns an iterator of tuples.",
    "explanation": "zip() function returns a zip object, which maps a similar index of multiple containers. It takes an iterable, converts it into an iterator and aggregates the elements based on iterables passed. It returns an iterator of tuples.\n\nSyntax: zip(*iterables)\u00a0\n\n```python\nnames = ['Hiro', 'Mila', 'Tariq']\nscores = [88, 94]\nres = zip(names, scores)\nprint(list(res))\n```",
    "code": "names = ['Hiro', 'Mila', 'Tariq']\nscores = [88, 94]\nres = zip(names, scores)\nprint(list(res))",
    "interviewerNote": "Combines elements from multiple iterables into tuples. In Python 3, returns an iterator. In Python 3.10+, supports strict=True to enforce equal lengths.",
    "tags": [
      "builtins",
      "zip",
      "iterables"
    ]
  },
  {
    "id": "py-q54",
    "number": 54,
    "difficulty": "advanced",
    "question": "Write a code to display the current time?",
    "summary": "The datetime module provides the datetime.now() method, which returns the current local date and time. It is commonly used to display timestamps, log events, or retrieve the current system date and time.",
    "explanation": "The datetime module provides the datetime.now() method, which returns the current local date and time. It is commonly used to display timestamps, log events, or retrieve the current system date and time.\n\n```python\nfrom datetime import datetime\nprint(\"Current time is:\", datetime.now())\n```",
    "code": "from datetime import datetime\nprint(\"Current time is:\", datetime.now())",
    "interviewerNote": "datetime.datetime.now() or datetime.datetime.now(timezone.utc) for timezone-aware production timestamps.",
    "tags": [
      "datetime",
      "standard-library"
    ]
  },
  {
    "id": "py-q55",
    "number": 55,
    "difficulty": "advanced",
    "question": "What is __init__() in Python and how does self play a role in it?",
    "summary": "__init__() is Python's equivalent of constructors in OOP, called automatically when a new object is created. It initializes the object's attributes with values but doesn\u2019t handle memory allocation.\n- Memory allocation is handled by the __new__() meth...",
    "explanation": "__init__() is Python's equivalent of constructors in OOP, called automatically when a new object is created. It initializes the object's attributes with values but doesn\u2019t handle memory allocation.\n- Memory allocation is handled by the __new__() method, which is called before __init__().\n- The self parameter in __init__() refers to the instance of the class, allowing access to its attributes and methods.\n- self must be the first parameter in all instance methods, including __init__()\n\n```python\nclass MyClass:\n    def __init__(self, value):\n        self.value = value  # Initialize object attribute\n\n    def display(self):\n        print(f\"Value: {self.value}\")\n\nobj = MyClass(10)\nobj.display() \n```",
    "code": "class MyClass:\n    def __init__(self, value):\n        self.value = value  # Initialize object attribute\n\n    def display(self):\n        print(f\"Value: {self.value}\")\n\nobj = MyClass(10)\nobj.display()",
    "interviewerNote": "__init__ is the instance initializer. 'self' is the explicit reference to the instance being initialized.",
    "tags": [
      "oop",
      "init",
      "self"
    ]
  },
  {
    "id": "py-q56",
    "number": 56,
    "difficulty": "advanced",
    "question": "What is the difference between __new__() and __init__()?",
    "summary": "- __new__() creates a new instance of a class.\n- __init__() initializes the created instance.",
    "explanation": "- __new__() creates a new instance of a class.\n- __init__() initializes the created instance.\n\n__new__() is called before __init__().",
    "code": null,
    "interviewerNote": "__new__ is a static method that allocates and returns the object in memory; __init__ initializes attributes on that created instance.",
    "tags": [
      "oop",
      "dunder",
      "lifecycle"
    ]
  },
  {
    "id": "py-q57",
    "number": 57,
    "difficulty": "advanced",
    "question": "What are Access Specifiers in Python?",
    "summary": "Python uses the \u2018_\u2019 symbol to determine the access control for a specific data member or a member function of a class. A Class in Python has three types of Python access modifiers:\n- Public Access Modifier: Members declared normally (without any unde...",
    "explanation": "Python uses the \u2018_\u2019 symbol to determine the access control for a specific data member or a member function of a class. A Class in Python has three types of Python access modifiers:\n- Public Access Modifier: Members declared normally (without any underscore) are public and can be accessed from anywhere.\n- Protected Access Modifier: Members prefixed with a single underscore (_) are intended for internal use within the class and its subclasses. They can still be accessed from outside the class, but this is discouraged by convention.\n- Private Access Modifier: Members prefixed with double underscores (__) are name-mangled by Python to make accidental access from outside the class more difficult.\n\n```python\nclass Student:\n    def __init__(self):\n        # Public\n        self.name = \"Mike\"          \n        # Protected\n        self._roll_no = 101         \n        # Private\n        self.__marks = 95            \n\nobj = Student()\nprint(obj.name)      \nprint(obj._roll_no)\nprint(obj._Student__marks)  \n```\n\nExplanation:\n- name is a public attribute and can be accessed directly.\n- _roll_no is a protected attribute, it is accessible outside the class but intended for internal use.\n- __marks is a private attribute and is automatically renamed internally.\n- obj._Student__marks accesses the private attribute using Python's name mangling mechanism.",
    "code": "class Student:\n    def __init__(self):\n        # Public\n        self.name = \"Mike\"          \n        # Protected\n        self._roll_no = 101         \n        # Private\n        self.__marks = 95            \n\nobj = Student()\nprint(obj.name)      \nprint(obj._roll_no)\nprint(obj._Student__marks)",
    "interviewerNote": "Public (var), Protected (_var, convention), and Private (__var, name-mangled to _Class__var to prevent accidental subclass override).",
    "tags": [
      "oop",
      "access-specifiers"
    ]
  },
  {
    "id": "py-q58",
    "number": 58,
    "difficulty": "advanced",
    "question": "What is the difference between @classmethod, @staticmethod and instance methods in Python?",
    "summary": "- Instance Method: Operates on an instance of the class and has access to instance attributes and takes self as the first parameter. \n- Class Method: Works with the class and takes cls as the first parameter. It is defined using @classmethod.\n- Stati...",
    "explanation": "- Instance Method: Operates on an instance of the class and has access to instance attributes and takes self as the first parameter. \n- Class Method: Works with the class and takes cls as the first parameter. It is defined using @classmethod.\n- Static Method: Does not access instance (self) or class (cls) data. It is defined using @staticmethod and is commonly used for utility functions related to the class. \n\n```python\nclass Student:\n    school = \"ABC School\"\n\n    def display(self, name):\n        print(f\"Student Name: {name}\")\n\n    @classmethod\n    def show_school(cls):\n        print(f\"School: {cls.school}\")\n\n    @staticmethod\n    def is_adult(age):\n        return age >= 18\n\ns = Student()\ns.display(\"Kevin\")\nStudent.show_school()\nprint(Student.is_adult(20))\n```",
    "code": "class Student:\n    school = \"ABC School\"\n\n    def display(self, name):\n        print(f\"Student Name: {name}\")\n\n    @classmethod\n    def show_school(cls):\n        print(f\"School: {cls.school}\")\n\n    @staticmethod\n    def is_adult(age):\n        return age >= 18\n\ns = Student()\ns.display(\"Kevin\")\nStudent.show_school()\nprint(Student.is_adult(20))",
    "interviewerNote": "Instance method takes 'self'; @classmethod takes 'cls' (factory constructor); @staticmethod takes neither (namespaced utility function).",
    "tags": [
      "oop",
      "methods",
      "descriptors"
    ]
  },
  {
    "id": "py-q59",
    "number": 59,
    "difficulty": "advanced",
    "question": "What are Pickling and Unpickling?",
    "summary": "- Pickling: converts any Python object into a byte stream (not a string representation). This byte stream can then be stored in a file, sent over a network or saved for later use. The function used for pickling is pickle.dump().\n- Unpickling: process...",
    "explanation": "- Pickling: converts any Python object into a byte stream (not a string representation). This byte stream can then be stored in a file, sent over a network or saved for later use. The function used for pickling is pickle.dump().\n- Unpickling: process of retrieving the original Python object from the byte stream (saved during pickling) is called unpickling. The function used for unpickling is pickle.load().",
    "code": null,
    "interviewerNote": "pickle serializes Python object hierarchies to bytes; unpickle deserializes bytes back. WARNING: Never unpickle untrusted data (remote code execution risk).",
    "tags": [
      "serialization",
      "pickle"
    ]
  },
  {
    "id": "py-q60",
    "number": 60,
    "difficulty": "advanced",
    "question": "What are Exception Groups in Python?",
    "summary": "Exception Groups are a feature introduced in Python 3.11 that allow multiple exceptions to be grouped together and handled in a structured way. They are particularly useful when several operations may fail independently, such as in concurrent or asyn...",
    "explanation": "Exception Groups are a feature introduced in Python 3.11 that allow multiple exceptions to be grouped together and handled in a structured way. They are particularly useful when several operations may fail independently, such as in concurrent or asynchronous programs.\n\nExceptionGroup class is used to combine multiple exceptions into a single object and the except* syntax is used to handle specific exception types within the group.\n\n```python\ntry:\n    raise ExceptionGroup(\n        \"Example ExceptionGroup\",\n        [\n            TypeError(\"Example TypeError\"),\n            ValueError(\"Example ValueError\"),\n            KeyError(\"Example KeyError\"),\n            AttributeError(\"Example AttributeError\"),\n        ]\n    )\nexcept* TypeError:\n    print(\"Handled TypeError\")\nexcept* ValueError:\n    print(\"Handled ValueError\")\nexcept* (KeyError, AttributeError):\n    print(\"Handled KeyError and AttributeError\")\n```",
    "code": "try:\n    raise ExceptionGroup(\n        \"Example ExceptionGroup\",\n        [\n            TypeError(\"Example TypeError\"),\n            ValueError(\"Example ValueError\"),\n            KeyError(\"Example KeyError\"),\n            AttributeError(\"Example AttributeError\"),\n        ]\n    )\nexcept* TypeError:\n    print(\"Handled TypeError\")\nexcept* ValueError:\n    print(\"Handled ValueError\")\nexcept* (KeyError, AttributeError):\n    print(\"Handled KeyError and AttributeError\")",
    "interviewerNote": "Introduced in Python 3.11: ExceptionGroup allows raising and catching multiple unrelated exceptions simultaneously using 'except*' syntax.",
    "tags": [
      "exceptions",
      "python311"
    ]
  },
  {
    "id": "py-q61",
    "number": 61,
    "difficulty": "advanced",
    "question": "What is a Context Manager in Python?",
    "summary": "A context manager automatically manages resources such as files, network connections, or database connections. It is commonly used with the with statement.",
    "explanation": "A context manager automatically manages resources such as files, network connections, or database connections. It is commonly used with the with statement.\n\n```python\nwith open(\"sample.txt\", \"r\") as file:\n    data = file.read()\n```\n\nBenefits:\n- Automatically closes the file.\n- Prevents resource leaks.\n- Makes code cleaner and easier to read.",
    "code": "with open(\"sample.txt\", \"r\") as file:\n    data = file.read()",
    "interviewerNote": "Manages runtime context using __enter__ and __exit__. Guarantees deterministic teardown. Can also be built using @contextlib.contextmanager.",
    "tags": [
      "context-managers",
      "protocols"
    ]
  },
  {
    "id": "py-q62",
    "number": 62,
    "difficulty": "advanced",
    "question": "What are unit tests in Python?",
    "summary": "Unit Testing is the first level of software testing where the smallest testable parts of the software are tested. This is used to validate that each unit of the software performs as designed. The unit test framework is Python\u2019s xUnit style framework....",
    "explanation": "Unit Testing is the first level of software testing where the smallest testable parts of the software are tested. This is used to validate that each unit of the software performs as designed. The unit test framework is Python\u2019s xUnit style framework. The White Box Testing method is used for Unit testing.\n\n```python\nimport unittest\ndef add(a, b):\n    return a + b\n\nclass TestAdd(unittest.TestCase):\n    def test_addition(self):\n        self.assertEqual(add(2, 3), 5)\n\nif __name__ == \"__main__\":\n    unittest.main()\n```\n\n.  \n----------------------------------------------------------------------\n\nRan 1 test in 0.000s  \n  \nOK",
    "code": "import unittest\ndef add(a, b):\n    return a + b\n\nclass TestAdd(unittest.TestCase):\n    def test_addition(self):\n        self.assertEqual(add(2, 3), 5)\n\nif __name__ == \"__main__\":\n    unittest.main()",
    "interviewerNote": "Automated testing framework. unittest (standard library xUnit style) or pytest (industry standard, concise fixtures, assert rewriting).",
    "tags": [
      "testing",
      "unittest",
      "pytest"
    ]
  },
  {
    "id": "py-q63",
    "number": 63,
    "difficulty": "advanced",
    "question": "Python Global Interpreter Lock (GIL)?",
    "summary": "Global Interpreter Lock (GIL) is a mechanism used in the CPython interpreter that allows only one thread to execute Python bytecode at a time. This simplifies memory management and makes the interpreter thread-safe.\n- Python supports multithreading....",
    "explanation": "Global Interpreter Lock (GIL) is a mechanism used in the CPython interpreter that allows only one thread to execute Python bytecode at a time. This simplifies memory management and makes the interpreter thread-safe.\n- Python supports multithreading.\n- In CPython, only one thread can execute Python bytecode at a time because of the GIL.\n- The GIL mainly affects CPU-bound multithreaded programs.\n- I/O-bound programs can still benefit from multithreading.\n- Multiprocessing can be used to achieve true parallelism across multiple CPU cores.",
    "code": null,
    "interviewerNote": "Global Interpreter Lock: A mutex in CPython that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously.",
    "tags": [
      "internals",
      "gil",
      "concurrency"
    ]
  },
  {
    "id": "py-q64",
    "number": 64,
    "difficulty": "advanced",
    "question": "What is the difference between Threading and Multiprocessing in Python?",
    "summary": "Threading\t\n- Uses multiple threads\n- Shares memory\t\n- Limited by the GIL for CPU-bound tasks",
    "explanation": "Threading\t\n- Uses multiple threads\n- Shares memory\t\n- Limited by the GIL for CPU-bound tasks\t\n\nMultiprocessing\n- Uses multiple processes\n- Separate memory\n- Not limited by the GIL\n\nThreading is generally preferred for I/O-bound tasks, while multiprocessing is better suited for CPU-bound tasks.",
    "code": null,
    "interviewerNote": "Threading shares memory space under one GIL (ideal for I/O-bound tasks). Multiprocessing spawns separate OS processes with separate GILs (ideal for CPU-bound computation).",
    "tags": [
      "concurrency",
      "threading",
      "multiprocessing"
    ]
  },
  {
    "id": "py-q65",
    "number": 65,
    "difficulty": "advanced",
    "question": "What are async and await in Python?",
    "summary": "async and await are used to write asynchronous programs that can perform multiple I/O operations concurrently without blocking execution.",
    "explanation": "async and await are used to write asynchronous programs that can perform multiple I/O operations concurrently without blocking execution.\n\n```python\nimport asyncio\n\nasync def greet():\n    print(\"Hello\")\n\nasyncio.run(greet())\n```",
    "code": "import asyncio\n\nasync def greet():\n    print(\"Hello\")\n\nasyncio.run(greet())",
    "interviewerNote": "async def defines a coroutine; await pauses coroutine execution until an awaitable (Future/Task) completes, freeing the event loop to run other tasks.",
    "tags": [
      "async",
      "asyncio",
      "coroutines"
    ]
  },
  {
    "id": "py-q66",
    "number": 66,
    "difficulty": "advanced",
    "question": "What are Function Annotations in Python?",
    "summary": "- Function Annotation is a feature that allows you to add metadata to function parameters and return values. This way you can specify the input type of the function parameters and the return type of the value the function returns.\n- Function annotati...",
    "explanation": "- Function Annotation is a feature that allows you to add metadata to function parameters and return values. This way you can specify the input type of the function parameters and the return type of the value the function returns.\n- Function annotations are arbitrary Python expressions that are associated with various parts of functions. These expressions are evaluated at compile time and have no life in Python\u2019s runtime environment. Python does not attach any meaning to these annotations. They take life when interpreted by third-party libraries, for example, mypy.",
    "code": null,
    "interviewerNote": "Type hints (e.g. def add(x: int, y: int) -> int:). Evaluated at definition time, stored in __annotations__, validated by tools like mypy and Pydantic.",
    "tags": [
      "typing",
      "pep484"
    ]
  },
  {
    "id": "py-q67",
    "number": 67,
    "difficulty": "advanced",
    "question": "What is Walrus Operator?",
    "summary": "Walrus Operator allows to assign a value to a variable within an expression. This can be useful when you need to use a value multiple times in a loop, but don't want to repeat the calculation. It is represented by the `:=` syntax and can be used in a...",
    "explanation": "Walrus Operator allows to assign a value to a variable within an expression. This can be useful when you need to use a value multiple times in a loop, but don't want to repeat the calculation. It is represented by the `:=` syntax and can be used in a variety of contexts including while loops and if statements.\n\nNote: Python versions before 3.8 doesn't support Walrus Operator.\n\n```python\nnumbers = [1, 2, 3, 4, 5]\n\nwhile (n := len(numbers)) > 0:\n    print(numbers.pop())\n```",
    "code": "numbers = [1, 2, 3, 4, 5]\n\nwhile (n := len(numbers)) > 0:\n    print(numbers.pop())",
    "interviewerNote": "Assignment expression (:=) introduced in Python 3.8. Assigns values to variables as part of a larger expression, avoiding repeated function calls.",
    "tags": [
      "syntax",
      "walrus",
      "python38"
    ]
  },
  {
    "id": "py-q68",
    "number": 68,
    "difficulty": "advanced",
    "question": "What is Python Switch Statement?",
    "summary": "Python does not have a traditional switch statement like languages such as C, C++ or Java. Starting with Python 3.10, however, Python introduced structural pattern matching using the match and case keywords, which provides similar functionality.",
    "explanation": "Python does not have a traditional switch statement like languages such as C, C++ or Java. Starting with Python 3.10, however, Python introduced structural pattern matching using the match and case keywords, which provides similar functionality.\n\n```python\nvalue = 2\n\nmatch value:\n    case 1:\n        result = \"one\"\n    case 2:\n        result = \"two\"\n    case 3:\n        result = \"three\"\n    case _:\n        result = \"unknown\"\n\nprint(result)\n```",
    "code": "value = 2\n\nmatch value:\n    case 1:\n        result = \"one\"\n    case 2:\n        result = \"two\"\n    case 3:\n        result = \"three\"\n    case _:\n        result = \"unknown\"\n\nprint(result)",
    "interviewerNote": "Python 3.10 match/case statement: Much more than a switch! Performs deep structural pattern matching, sequence destructuring, type checking, and guard clauses.",
    "tags": [
      "syntax",
      "pattern-matching",
      "python310"
    ]
  }
];

export const PYTHON_QUIZ_QUESTIONS: PythonQuizQuestion[] = [
  {
    "id": "quiz-1",
    "question": "What is the output of the following Python code?\n\ndef add_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(add_item(1))\nprint(add_item(2))",
    "options": [
      "[1] and [2]",
      "[1] and [1, 2]",
      "TypeError: mutable default argument not allowed",
      "[1] and None"
    ],
    "correctIndex": 1,
    "difficulty": "beginner",
    "gotchaConcept": "Mutable Default Arguments",
    "explanation": "Default arguments in Python are evaluated once when the function is defined, NOT each time it is called. The exact same list object in memory is reused across subsequent invocations."
  },
  {
    "id": "quiz-2",
    "question": "What does the expression `a is b` evaluate to for `a = 1000; b = 1000` when run in the standard CPython REPL?",
    "options": [
      "Always True because their numerical values are identical",
      "False because 1000 is outside CPython's small integer cache (-5 to 256)",
      "TypeError: cannot compare integers with 'is'",
      "True because Python interns all positive integers"
    ],
    "correctIndex": 1,
    "difficulty": "beginner",
    "gotchaConcept": "Identity vs Equality & Small Int Caching",
    "explanation": "CPython pre-allocates an array of integer objects for values between -5 and 256. For integers outside this range, distinct heap objects are allocated, so 'is' returns False even though '==' is True."
  },
  {
    "id": "quiz-3",
    "question": "What does `funcs = [lambda: i for i in range(3)]; [f() for f in funcs]` evaluate to?",
    "options": [
      "[0, 1, 2]",
      "[2, 2, 2]",
      "[0, 0, 0]",
      "TypeError: 'i' is out of scope"
    ],
    "correctIndex": 1,
    "difficulty": "intermediate",
    "gotchaConcept": "Closure Late Binding",
    "explanation": "Python closures bind variables by reference, not value. By the time the lambda functions are executed, the loop has completed and 'i' has the value 2 for all closures. Fix: `lambda i=i: i`."
  },
  {
    "id": "quiz-4",
    "question": "What is the type of the expression `x = (i ** 2 for i in range(5))`?",
    "options": [
      "<class 'tuple'>",
      "<class 'list'>",
      "<class 'generator'>",
      "<class 'iterator_tuple'>"
    ],
    "correctIndex": 2,
    "difficulty": "intermediate",
    "gotchaConcept": "Tuple Comprehension Myth",
    "explanation": "There is no such thing as a tuple comprehension in Python! Parentheses around a comprehension syntax create a generator expression. To create a tuple, use `tuple(i ** 2 for i in range(5))`."
  },
  {
    "id": "quiz-5",
    "question": "If you have a CPU-intensive calculation (e.g. computing prime numbers), which approach will achieve true multi-core parallel execution in CPython?",
    "options": [
      "threading.Thread with max_workers = CPU count",
      "multiprocessing.Process or concurrent.futures.ProcessPoolExecutor",
      "asyncio with asyncio.gather()",
      "All of the above"
    ],
    "correctIndex": 1,
    "difficulty": "advanced",
    "gotchaConcept": "Global Interpreter Lock (GIL)",
    "explanation": "Because of CPython's GIL, threads cannot execute Python bytecode simultaneously on multiple CPU cores. Only separate OS processes (multiprocessing) bypass the GIL by using separate memory spaces."
  },
  {
    "id": "quiz-6",
    "question": "In Python's class instantiation lifecycle, which method is responsible for returning the newly allocated instance?",
    "options": [
      "__init__",
      "__new__",
      "__call__",
      "__alloc__"
    ],
    "correctIndex": 1,
    "difficulty": "intermediate",
    "gotchaConcept": "Object Lifecycle (__new__ vs __init__)",
    "explanation": "__new__ is the static method that allocates and returns the raw instance object in memory. __init__ only initializes attributes on that already-created instance and must return None."
  },
  {
    "id": "quiz-7",
    "question": "When does the `else` block of a `try...except...else...finally` statement execute?",
    "options": [
      "When an exception was raised and caught",
      "When no exception was raised in the try block",
      "Always, right before the finally block",
      "Only when the except block returns None"
    ],
    "correctIndex": 1,
    "difficulty": "beginner",
    "gotchaConcept": "Try-Except-Else Flow",
    "explanation": "The else block in a try-except statement executes ONLY if the code inside the try block completed successfully without raising any exceptions."
  },
  {
    "id": "quiz-8",
    "question": "What is the result of `original = [[1, 2]]; copy_list = original[:]; copy_list[0].append(3); print(original)`?",
    "options": [
      "[[1, 2]]",
      "[[1, 2, 3]]",
      "IndexError: slice out of bounds",
      "[[1, 2], [3]]"
    ],
    "correctIndex": 1,
    "difficulty": "beginner",
    "gotchaConcept": "Shallow Copy Trap",
    "explanation": "Slice `original[:]` creates a shallow copy. The outer list is a new container, but the inner list `[1, 2]` is the exact same reference. Modifying it modifies `original`. Use `copy.deepcopy` to prevent this."
  },
  {
    "id": "quiz-9",
    "question": "What happens if a developer puts `time.sleep(5)` inside an `async def` endpoint in a FastAPI or Starlette server?",
    "options": [
      "FastAPI automatically offloads it to a background thread",
      "It pauses only that specific request while other users proceed normally",
      "It blocks the entire event loop, freezing all concurrent requests for all users for 5 seconds",
      "It raises a RuntimeWarning: coroutine was never awaited"
    ],
    "correctIndex": 2,
    "difficulty": "advanced",
    "gotchaConcept": "Async Event Loop Blocking",
    "explanation": "time.sleep() is synchronous and blocking. Calling it in a coroutine halts the single OS thread running the event loop, freezing all other concurrent tasks. Use `await asyncio.sleep(5)` or `asyncio.to_thread`."
  },
  {
    "id": "quiz-10",
    "question": "In Python's Method Resolution Order (MRO) using C3 Linearization, what ensures that parents do not precede their children and order is preserved?",
    "options": [
      "Depth-First Search (DFS) with backtrack",
      "Monotonicity and Local Precedence Order",
      "Breadth-First Search (BFS) sorting by alphabet",
      "Arbitrary hash order resolution"
    ],
    "correctIndex": 1,
    "difficulty": "advanced",
    "gotchaConcept": "C3 Linearization & MRO",
    "explanation": "C3 Linearization enforces Monotonicity (if A precedes B in parent MRO, it must precede B in child MRO) and preserves Local Precedence Order (left-to-right listing in base class tuple)."
  }
];

export const MASTERED_STORAGE_KEY = 'fde-python-mastered-questions-v1';
export const QUIZ_PROGRESS_STORAGE_KEY = 'fde-python-quiz-progress-v1';

export function getTopicsByDifficulty(difficulty: PythonDifficulty): PythonConceptTopic[] {
  return PYTHON_TOPICS.filter((t) => t.difficulty === difficulty);
}

export function getTopicByNumber(num: number): PythonConceptTopic | undefined {
  return PYTHON_TOPICS.find((t) => t.number === num);
}

export function getQuestionByNumber(num: number): PythonInterviewQuestion | undefined {
  return PYTHON_INTERVIEW_QUESTIONS.find((q) => q.number === num);
}

export function getAllQuestionTags(): string[] {
  const tags = new Set<string>();
  for (const q of PYTHON_INTERVIEW_QUESTIONS) {
    for (const tag of q.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export function searchInterviewQuestions(
  query: string,
  difficultyFilter: PythonDifficulty | 'all' = 'all',
  tagFilter: string = '',
): PythonInterviewQuestion[] {
  const cleanQuery = query.toLowerCase().trim();
  return PYTHON_INTERVIEW_QUESTIONS.filter((q) => {
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    if (tagFilter && !q.tags.includes(tagFilter)) return false;
    if (!cleanQuery) return true;
    const matchNumber = `q${q.number}` === cleanQuery || String(q.number) === cleanQuery;
    const matchText =
      q.question.toLowerCase().includes(cleanQuery) ||
      q.summary.toLowerCase().includes(cleanQuery) ||
      q.tags.some((t) => t.toLowerCase().includes(cleanQuery));
    return matchNumber || matchText;
  });
}

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return null;
}

export function loadMasteredQuestions(): Set<number> {
  try {
    const storage = getStorage();
    if (!storage) return new Set();
    const raw = storage.getItem(MASTERED_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

export function saveMasteredQuestions(mastered: Set<number>): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(MASTERED_STORAGE_KEY, JSON.stringify(Array.from(mastered)));
  } catch {
    // LocalStorage quota or unavailable
  }
}

export function loadQuizAnswers(): Record<string, number> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(QUIZ_PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function saveQuizAnswers(answers: Record<string, number>): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(QUIZ_PROGRESS_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // LocalStorage quota
  }
}
