const n=`# Python Mastery Firmware: From Absolute Beginner to Advanced AI Systems Engineer

> An exhaustive, production-grade guide to mastering Python execution internals, object-oriented protocols, memory architecture, asynchronous systems, and 68 essential interview questions.
> **Strictly Generic Production Engineering**: 100% focused on architectural rigor, AI-assisted development, and verifiable verification harnesses.

---

## Executive Summary & Engineering Philosophy

In the era of AI coding agents, memorizing syntax is no longer the bottleneck. The real bottleneck is **mental models, verification discipline, and architectural clarity**:
1. **Understand Execution Mechanics**: Know how CPython compiles source to bytecode (\`.pyc\`) and executes it in the PVM stack loop.
2. **Respect the Memory Model**: Understand heap allocations, reference counting, the cyclic garbage collector, and why \`is\` differs from \`==\`.
3. **Master Protocols over Inheritance**: Emulate Python's data model using dunder methods (\`__getitem__\`, \`__len__\`, \`__repr__\`) rather than building fragile deep class hierarchies.
4. **Architect for Concurrency Safely**: Know when the Global Interpreter Lock (GIL) demands multiprocessing (CPU bound) versus when \`asyncio\` or threading shines (I/O bound).
5. **Direct AI with Testable Specs**: Provide AI models with explicit invariants, type contracts, and property-based test harnesses to verify generated code.

---

## Table of Contents

1. [Stage 1: Foundations & Core Idioms (Beginner)](#stage-1-foundations--core-idioms)
   - [01. CPython Execution Engine: Source, Bytecode & PVM](#01-cpython-execution-engine)
   - [02. Dynamic Typing, Memory Binding & Identity vs Equality](#02-dynamic-typing--memory-binding)
   - [03. Core Data Structures, Mutability & Hash Tables](#03-core-data-structures--mutability)
   - [04. Idiomatic Iteration, Comprehensions & Control Flow](#04-idiomatic-iteration--comprehensions)
   - [05. Functions, Parameter Binding & Scopes (LEGB)](#05-functions--parameter-binding)
   - [06. Defensive Exception Handling & Modularization](#06-defensive-exception-handling)
2. [Stage 2: Object-Oriented Architecture & Protocols (Intermediate)](#stage-2-object-oriented-architecture)
   - [07. Classes, \`__init__\`, and the \`self\` Protocol](#07-classes-and-self)
   - [08. Object Lifecycle: \`__new__\` vs \`__init__\`](#08-new-vs-init)
   - [09. Python Dunder Protocols & Emulating Built-in Behaviors](#09-dunder-protocols)
   - [10. Multiple Inheritance & C3 Linearization (MRO)](#10-multiple-inheritance--mro)
   - [11. Descriptors: \`@classmethod\`, \`@staticmethod\`, \`@property\`](#11-descriptors--properties)
   - [12. First-Class Functions, Closures & Production Decorators](#12-closures--decorators)
3. [Stage 3: Systems Internals, Concurrency & Modern Python (Advanced)](#stage-3-systems-internals)
   - [13. Lazy Iteration: Iterators & Custom Generators (\`yield\`)](#13-iterators--generators)
   - [14. Context Managers & Resource Safety (\`with\`)](#14-context-managers)
   - [15. CPython Memory Management, Ref Counting & Cyclic GC](#15-memory-management--gc)
   - [16. The Python GIL, Threading (I/O) vs Multiprocessing (CPU)](#16-gil-threading-multiprocessing)
   - [17. Asynchronous Systems: \`asyncio\`, Event Loops & Coroutines](#17-asyncio--coroutines)
   - [18. Modern Python 3.10–3.12+: Pattern Matching, Walrus & Typing](#18-modern-python-features)
4. [Stage 4: Production AI-Native Service Lab](#stage-4-production-lab)
5. [Stage 5: The 68 Essential Python Interview Questions with Deep-Dive Answers](#stage-5-interview-questions)
   - [Basic Questions (Q1–Q29)](#basic-questions-q1q29)
   - [Intermediate Questions (Q30–Q51)](#intermediate-questions-q30q51)
   - [Advanced Questions (Q52–Q68)](#advanced-questions-q52q68)

---

## Stage 1: Foundations & Core Idioms

### 01. CPython Execution Engine
Python code is neither purely compiled nor purely interpreted. CPython first parses source text into an Abstract Syntax Tree (AST), compiles it into bytecode instructions stored in \`.pyc\` files, and then executes it using the Python Virtual Machine (PVM).

\`\`\`python
import dis

def add_tax(price: float, rate: float = 0.08) -> float:
    return round(price * (1 + rate), 2)

# Inspect the PVM bytecode instructions
dis.dis(add_tax)
\`\`\`

- **Bytecode**: Platform-independent intermediate representation (\`LOAD_FAST\`, \`BINARY_OP\`, \`RETURN_VALUE\`).
- **PVM**: A stack-based execution loop written in C that steps through bytecode instructions one by one.

### 02. Dynamic Typing & Memory Binding
In Python, variables are names pointing to heap-allocated objects.
- \`==\` calls \`__eq__\` to check **value equality**.
- \`is\` checks **identity** (whether two references point to the exact same memory address \`id()\`).

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True (equal values)
print(a is b)  # False (different heap allocations)

# Small Integer Caching (-5 to 256):
x = 250
y = 250
print(x is y)  # True (CPython singletons)
\`\`\`

### 03. Core Data Structures & Mutability
- **Mutable**: \`list\`, \`dict\`, \`set\`, \`bytearray\` (modified in-place at same memory address).
- **Immutable**: \`int\`, \`float\`, \`str\`, \`tuple\`, \`frozenset\`, \`bytes\` (modifications allocate a new object).
- **Shallow Copy** (\`copy.copy\`): Clones outer container; inner references remain shared.
- **Deep Copy** (\`copy.deepcopy\`): Recursively clones all nested objects.

### 04. Idiomatic Iteration & Comprehensions
Always prefer direct sequence iteration, \`enumerate()\`, and \`zip()\` over C-style index counters.

\`\`\`python
# Clean iteration
for rank, (name, score) in enumerate(zip(students, scores), start=1):
    print(f"#{rank}: {name} -> {score}")

# Note: (x for x in data) is a GENERATOR, not a tuple comprehension!
gen_expr = (x * 2 for x in [1, 2, 3])
\`\`\`

### 05. Functions & Parameter Binding
Python evaluates arguments using **Call by Object Reference**:
- If you mutate an object in-place inside a function, the caller observes the change.
- If you reassign the variable name, the caller's reference is unchanged.
- **Mutable Default Trap**: Default arguments evaluate **once** at function definition time. Always use \`None\` as the default sentinel!

\`\`\`python
# CORRECT PATTERN:
def append_safely(item, container=None):
    if container is None:
        container = []
    container.append(item)
    return container
\`\`\`

**Scope (LEGB Rule)**: Local $\\rightarrow$ Enclosing $\\rightarrow$ Global $\\rightarrow$ Built-in. Use \`global\` to modify module-level variables and \`nonlocal\` for closure variables.

### 06. Defensive Exception Handling
Structure error recovery into \`try\`, \`except\`, \`else\` (runs strictly when NO exception was raised), and \`finally\` (guaranteed cleanup).

\`\`\`python
class IngestionError(Exception):
    """Domain base exception."""

try:
    process_data()
except IngestionError as err:
    logger.error("Domain failure", error=str(err))
else:
    logger.info("Ingestion completed with zero errors.")
finally:
    db_connection.close()
\`\`\`

---

## Stage 2: Object-Oriented Architecture & Protocols

### 07. Classes and \`self\`
Classes act as namespaces and factories. When calling \`obj.method()\`, Python translates this to \`Class.method(obj)\`.

### 08. \`__new__\` vs \`__init__\`
- \`__new__(cls, *args, **kwargs)\`: Allocator. Allocates and returns the fresh instance in memory.
- \`__init__(self, *args, **kwargs)\`: Initializer. Configures attributes on that created instance.
- Singletons and immutable subclasses (subclassing \`int\` or \`tuple\`) must override \`__new__\`.

### 09. Dunder Protocols
Python uses special double-underscore methods to enable built-in syntax on custom objects:
- \`__repr__\`: Unambiguous string for debugging (\`eval(repr(obj)) == obj\` where practical).
- \`__str__\`: Readable string for end users.
- \`__len__\` & \`__getitem__\`: Emulate sequences (indexing, slicing, iteration).
- \`__eq__\` & \`__hash__\`: Hashable collections (\`set\` and \`dict\` keys).

### 10. Multiple Inheritance & MRO
CPython resolves inheritance conflicts using the **C3 Linearization** algorithm. View the resolution chain via \`Class.__mro__\`. Always use \`super().__init__()\` for cooperative multiple inheritance.

### 11. Descriptors & Properties
- \`@property\`: Create getters and setters without breaking existing attribute API contracts.
- \`@classmethod\`: Receives \`cls\` as first argument; standard for factory constructors.
- \`@staticmethod\`: Namespaced utility function with no instance or class binding.
- Private attributes (\`__var\`) use name mangling (\`_ClassName__var\`) to prevent accidental subclass collisions.

### 12. Closures & Decorators
A decorator transforms a function: \`@dec \\n def f(): ...\` is identical to \`f = dec(f)\`. Always use \`@functools.wraps(func)\` to preserve function metadata.

---

## Stage 3: Systems Internals, Concurrency & Modern Python

### 13. Iterators & Generators (\`yield\`)
Generators produce items on demand with $O(1)$ memory consumption, suspending stack frames on the heap. Use \`yield from\` to delegate iteration to sub-generators.

### 14. Context Managers (\`with\`)
Implement \`__enter__\` (setup) and \`__exit__\` (teardown) or use \`@contextlib.contextmanager\` to guarantee that sockets, files, and transaction locks are never leaked.

### 15. Memory Management & Cyclic GC
CPython pairs primary **Reference Counting** (immediate deallocation when refcount reaches 0) with a **Generational Cyclic Garbage Collector** (generations 0, 1, 2) that detects circular reference islands.

### 16. The GIL, Threading & Multiprocessing
- **Global Interpreter Lock (GIL)**: A mutex ensuring only one OS thread executes Python bytecode at once.
- **I/O Bound**: Use \`threading\` or \`asyncio\` (the GIL is released during socket/disk waits).
- **CPU Bound**: Use \`multiprocessing\` or \`concurrent.futures.ProcessPoolExecutor\` to utilize multiple CPU cores.

### 17. Asynchronous Systems (\`asyncio\`)
Cooperative multitasking on a single thread. The event loop switches between coroutines paused at \`await\`.
- **Golden Rule**: NEVER call blocking code (\`time.sleep()\`, synchronous \`requests.get()\`) inside an async function. Use \`await asyncio.sleep()\` or \`asyncio.to_thread()\`.

### 18. Modern Python 3.10–3.12+
- **Pattern Matching (\`match/case\`)**: Structural destructuring with guards.
- **Walrus Operator (\`:=\`)**: Assign values inline within larger expressions.
- **Exception Groups & \`except*\` (Python 3.11+)**: Handle multiple concurrent async failures cleanly.

---

## Modern Tooling: The 2025/2026 Production Standard (Astral Stack)

Inspired by modern production engineering workflows (such as Datalumina's modern Python curriculum):

### 1. \`uv\` — The Lightning-Fast Python Package & Project Manager
Traditional Python development required multiple disjointed tools (\`pip\`, \`virtualenv\`, \`pip-tools\`, \`poetry\`). In modern production, \`uv\` (written in Rust by Astral) replaces all of them:
- **10–30x Faster Installs**: Installs packages in 1–2 seconds instead of 30+ seconds.
- **Instant Virtual Environments**: \`uv venv\` creates isolated environments in milliseconds.
- **Deterministic Lockfiles**: \`uv lock\` ensures exact bit-for-bit reproducibility across developers and CI/CD pipelines.
- **Run Anywhere**: \`uv run script.py\` executes code in an isolated project context automatically.

\`\`\`bash
# Modern production setup:
uv venv
uv pip install -r pyproject.toml
uv run python main.py
\`\`\`

### 2. \`Ruff\` — The All-in-One Rust Linter & Formatter
Replaces \`flake8\`, \`black\`, \`isort\`, \`pydocstyle\`, and \`bandit\` with a single binary that checks and formats code in under 10 milliseconds:
\`\`\`bash
uv run ruff check --fix   # Lint and auto-fix violations
uv run ruff format        # Format according to PEP 8 standard
\`\`\`

### 3. \`pyproject.toml\` — Modern Single-File Declarative Metadata (PEP 621)
No more fragmented \`setup.py\`, \`setup.cfg\`, \`requirements.txt\`, and \`.flake8\`:
\`\`\`toml
[project]
name = "production-ai-service"
version = "1.0.0"
dependencies = [
    "pydantic>=2.7.0",
    "pydantic-settings>=2.2.0",
    "httpx>=0.27.0",
    "structlog>=24.1.0",
]

[tool.ruff]
line-length = 100
target-version = "py312"
\`\`\`

---

## From Day 1: Toy Tutorial Code vs Production-Grade Code

When learners transition from basic Python tutorials to actual company codebases, they experience shock. In production, code looks fundamentally different:

### 1. Data Validation: Loose Dictionaries vs Pydantic v2 Models
* **Toy Code**: Accessing raw untyped dicts: \`user["name"]\`. Crashes with \`KeyError\` or accepts negative prices silently.
* **Production Code**: Explicit \`BaseModel\` schema with typed attributes, field constraints (\`ge=0\`), email validation, and automated OpenAPI documentation.

### 2. Observability: \`print()\` vs Structured Logging (\`structlog\`)
* **Toy Code**: \`print("Order processed", order_id)\`. Untracked, lacks timestamps, and cannot be ingested by Datadog or CloudWatch.
* **Production Code**: Structured JSON logs (\`logger.info("order_processed", order_id=oid, latency_ms=12.4, trace_id=tid)\`) for distributed tracing.

### 3. Secrets & Configuration: Hardcoded Keys vs \`.env\` + Pydantic Settings
* **Toy Code**: \`API_KEY = "sk_live_12345"\` committed to Git or unvalidated \`int(os.environ["PORT"])\`.
* **Production Code**: \`BaseSettings\` class reading \`.env\` that validates port ranges ($1024 \\le 	ext{port} \\le 65535$) and masks secrets in \`__repr__\` (\`sk_***\`).

### 4. Error Handling: Bare \`except:\` vs Custom Domain Exception Hierarchies
* **Toy Code**: Swallowing errors blindly with \`except: pass\`.
* **Production Code**: Domain-specific exceptions (\`OrderNotFoundError(DomainError)\`) that map cleanly to HTTP status codes (404 vs 500) and preserve error contexts.

### 5. Automated Verification: Manual Prints vs Pytest Fixtures & Parametrization
* **Toy Code**: Running \`if __name__ == '__main__': test()\` with visual prints.
* **Production Code**: Automated \`pytest\` test suites with dependency injection fixtures, parameterized test matrices, and mock assertions in CI/CD.

---

## The 6 Production-Grade Coding Exams & Test Suites

The FDE Academy Python Track features 6 interactive hands-on coding exams with real-world specifications and automated test suites:

### Exam 1: Modern Configuration & Secret Masking
- **Scenario**: Microservices must validate ports and prevent secret leakage in logs.
- **Requirements**:
  1. \`AppConfig\` class with typed fields (\`app_name\`, \`port\`, \`api_key\`, \`debug\`).
  2. Guard port range: $1024 \\le 	ext{port} \\le 65535$.
  3. Mask \`api_key\` as \`'sk_***'\` in \`__repr__\`.
  4. Classmethod \`from_env(dict)\` factory with sensible defaults.

### Exam 2: API Webhook Payload Schema Validator
- **Scenario**: Parse and validate financial transaction webhooks from external gateways.
- **Requirements**:
  1. Custom \`ValidationError(Exception)\`.
  2. Validate required fields (\`order_id\`, \`status\`, \`items\`).
  3. Validate status enums: \`{"PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"}\`.
  4. Validate item prices ($>0$) and quantities ($\\ge 1$).
  5. \`calculate_total(discount_pct)\` with 2-decimal place rounding.

### Exam 3: Resilient Network Retry with Exponential Backoff
- **Scenario**: External LLM and payment APIs suffer transient 503 errors and rate limits.
- **Requirements**:
  1. Custom \`ServiceUnavailableError(Exception)\`.
  2. \`execute_with_retry(fn, max_attempts=3, base_delay=0.1)\` function.
  3. Delay schedule: $	ext{base\\_delay} 	imes 2^{	ext{attempt} - 1}$.
  4. If attempts exhaust, raise \`ServiceUnavailableError\` with attempts count.

### Exam 4: Atomic Resource Transaction Context Manager
- **Scenario**: Prevent partial writes and file corruption during server crashes.
- **Requirements**:
  1. \`AtomicBuffer\` context manager implementing \`__enter__\` and \`__exit__\`.
  2. Writes staged in a temporary buffer.
  3. If no exception occurs (\`exc_type is None\`), commit to persistent store.
  4. If an exception occurs, discard staging buffer and propagate exception.

### Exam 5: Memory-Efficient Streaming Log Analyzer
- **Scenario**: Parse 10 GB log files without triggering the Linux Out-Of-Memory (OOM) killer.
- **Requirements**:
  1. \`parse_log_stream(lines)\` generator yielding parsed timestamp, level, message.
  2. \`filter_severity(stream, min_level)\` generator yielding matching entries.
  3. \`tally_anomalies(stream)\` frequency counter.
  4. Pipeline must process lazily with $O(1)$ memory consumption.

### Exam 6: Clean Architecture Domain Service with Pytest Fixtures
- **Scenario**: Decouple business logic from database infrastructure for unit testability.
- **Requirements**:
  1. \`InMemoryUserRepository\` implementing \`get_by_email\` and \`save\`.
  2. \`AuthService(repo)\` accepting repository via Dependency Injection.
  3. \`register(email, password)\` raising \`UserAlreadyExistsError\` on duplicates.
  4. \`login(email, password)\` raising \`InvalidCredentialsError\` on mismatch.

---

## Stage 4: Production AI-Native Service Lab

When engineering production Python backends with AI assistance, follow this 4-pillar architectural pattern:
1. **Pydantic v2 Domain Models**: Enforce strict data validation and automated JSON schema generation.
2. **Resilient HTTP Clients**: Use \`httpx.AsyncClient\` with exponential backoff and randomized jitter to prevent thundering herd failures.
3. **Structured Telemetry**: Use \`structlog\` to emit JSON logs containing correlation IDs for distributed observability.
4. **Automated Verification Harness**: Write parameterized tests in \`pytest\` with mock verification and coverage gates.

---

## Stage 5: The 68 Essential Python Interview Questions with Deep-Dive Answers


### Q1. Is Python a compiled language or an interpreted language?

**Category:** Basic | **Tags:** \`internals\`, \`pvm\`, \`bytecode\`

> **Senior Interviewer Insight:** Interviewer wants to hear: Python is BOTH. First CPython compiles source to bytecode (.pyc), then PVM interprets bytecode. Mention PyPy/JIT for bonus points.

Python is considered both a compiled and an interpreted language. First, Python source code (.py files) is compiled into bytecode (.pyc files). Then, the Python Virtual Machine (PVM) interprets and executes this bytecode line by line.
- Python code is first compiled into bytecode.
- The Python Virtual Machine (PVM) executes the bytecode.
- CPython, the most common Python implementation, both compiles and interprets code.
- Some implementations like PyPy use Just-In-Time (JIT) compilation for improved performance.

Therefore, Python combines features of both compiled and interpreted languages.

---

### Q2. Is Indentation Required in Python?

**Category:** Basic | **Tags:** \`syntax\`, \`indentation\`, \`pep8\`

> **Senior Interviewer Insight:** Interviewer checks: Do you know that indentation is syntactic, not aesthetic? Mention 4 spaces (PEP 8) and IndentationError.

Yes, indentation is required in Python. A Python interpreter can be informed that a group of statements belongs to a specific block of code by using Python indentation. Indentations make the code easy to read for developers in all programming languages but in Python, it is very important to indent the code in a specific order.

---

### Q3. What is a dynamically typed language?

**Category:** Basic | **Tags:** \`typing\`, \`runtime\`, \`types\`

> **Senior Interviewer Insight:** Interviewer wants: Types are associated with objects, not variable names. Variables are pointers/references bound at runtime.

A dynamically typed language is a programming language in which the data type of a variable is determined at runtime. In Python, you do not need to declare the data type of a variable explicitly. Instead, Python automatically assigns the appropriate type based on the value stored in the variable.

\`\`\`python
x = 10       # x is an integer
x = "Hello"  # Now x is a string
\`\`\`

Here, the variable x initially stores an integer and is later reassigned to a string. Python automatically updates the variable's type at runtime.

\`\`\`python
x = 10       # x is an integer
x = "Hello"  # Now x is a string
\`\`\`

---

### Q4. What are Built-in data types in Python?

**Category:** Basic | **Tags:** \`types\`, \`builtins\`, \`data-structures\`

> **Senior Interviewer Insight:** Categorize clearly: Numeric (int, float, complex), Sequences (str, list, tuple, range), Mappings (dict), Sets (set, frozenset).

The following are the standard or built-in data types in Python:
- Numeric: The numeric data type in Python represents the data that has a numeric value. A numeric value can be an integer, a floating number, or a complex number.
- Sequence Type: The sequence Data Type in Python is the ordered collection of similar or different data types. There are several sequence types in Python like String, List, Tuple, range
- Mapping Types: In Python, hashable data can be mapped to random objects using a mapping object. There is currently only one common mapping type, the Dictionary and mapping objects are mutable.
- Set Types: In Python, a Set is an unordered collection of data types that is iterable, mutable and has no duplicate elements. The order of elements in a set is undefined though it may consist of various elements.

---

### Q5. What is the difference between a Mutable datatype and an Immutable data type?

**Category:** Basic | **Tags:** \`memory\`, \`mutability\`, \`gotchas\`

> **Senior Interviewer Insight:** Classic trap: Explain that mutable modifications happen in-place at the same memory address id(); immutable creates a new object in heap.

- Mutable data types are objects whose values can be changed after they are created. Any modification is made in place without creating a new object. Common examples include lists, dictionaries and sets.
- Immutable data types are objects whose values cannot be changed after creation. If you modify them, Python creates a new object instead. Common examples include strings, tuples, integers and floats.

\`\`\`python
# Mutable example
a = [1, 2, 3]
a.append(4)
print(a)        

# Immutable example
s = "Hello"
s = s + " World"
print(s)       
\`\`\`

Explanation: In the first example, the list a is modified directly by adding a new element. In the second example, strings are immutable, so concatenating " World" creates a new string object and assigns it back to s.

\`\`\`python
# Mutable example
a = [1, 2, 3]
a.append(4)
print(a)        

# Immutable example
s = "Hello"
s = s + " World"
print(s)
\`\`\`

---

### Q6. What is the difference between == and is in Python?

**Category:** Basic | **Tags:** \`operators\`, \`identity\`, \`equality\`

> **Senior Interviewer Insight:** Key distinction: '==' checks value equality (__eq__), 'is' checks memory address identity. Mention small integer caching (-5 to 256) gotcha.

Both == and is are comparison operators, but they compare different things.
- == checks whether two objects have the same value.
- is checks whether two variables refer to the same object in memory.

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)
print(a is b)
print(a is c)
\`\`\`

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)
print(a is b)
print(a is c)
\`\`\`

---

### Q7. What is the difference between / and // in Python?

**Category:** Basic | **Tags:** \`operators\`, \`math\`, \`python3\`

> **Senior Interviewer Insight:** '/' is float division (e.g. 5/2 = 2.5), '//' is floor division (e.g. 5//2 = 2). Notice negative number floor: -5//2 = -3!

/ represents precise division (result is a floating point number) whereas // represents floor division (result is an integer). For Example:

\`\`\`python
print(5//2)
print(5/2)
\`\`\`

\`\`\`python
print(5//2)
print(5/2)
\`\`\`

---

### Q8. How do you floor a number in Python?

**Category:** Basic | **Tags:** \`math\`, \`builtins\`, \`standard-library\`

> **Senior Interviewer Insight:** Explain math.floor() returns the greatest integer <= x, '//' operator performs floor division, and int() truncates towards zero.

To floor a number in Python, you can use the math.floor() function, which returns the largest integer less than or equal to the given number.
- floor() method returns the floor of x i.e., the largest integer not greater than x. 
- Also, The method ceil (x) returns a ceiling value of x i.e., the smallest integer greater than or equal to x.

\`\`\`python
import math

n = 3.7
F_num = math.floor(n)

print(F_num) 
\`\`\`

\`\`\`python
import math

n = 3.7
F_num = math.floor(n)

print(F_num)
\`\`\`

---

### Q9. What is the difference between a Set and Dictionary?

**Category:** Basic | **Tags:** \`data-structures\`, \`sets\`, \`dicts\`

> **Senior Interviewer Insight:** Both use hash tables ($O(1)$ lookup), but Set stores unique hashable keys only, while Dict stores key-value pairs.

Set is an unordered collection data type that is iterable, mutable and has no duplicate elements. Python’s set class represents the mathematical notion of a set. Defined using curly braces {} or the set() function.

Example: my_set = {1, 2, 3}

Dictionary is a collection of key-value pairs used to store and retrieve data using unique keys. Dictionaries preserve insertion order. Defined using curly braces {} with key-value pairs.

Example: my_dict = {"a": 1, "b": 2, "c": 3}

---

### Q10. How is a dictionary different from a list?

**Category:** Basic | **Tags:** \`data-structures\`, \`dicts\`, \`lists\`

> **Senior Interviewer Insight:** List is an ordered indexed dynamic array ($O(n)$ search, $O(1)$ index lookup); Dict is a hash table ($O(1)$ key search).

A list is an ordered collection of items that are accessed using their index position, whereas a dictionary is an ordered collection of key-value pairs that are accessed using unique keys. Lists are suitable for storing sequential data, while dictionaries are ideal for storing data associated with meaningful keys.

\`\`\`python
# List
numbers = [10, 20, 30]
print(numbers[1])   

# Dictionary
student = {"name": "Emma", "marks": 95}
print(student["name"])
\`\`\`

\`\`\`python
# List
numbers = [10, 20, 30]
print(numbers[1])   

# Dictionary
student = {"name": "Emma", "marks": 95}
print(student["name"])
\`\`\`

---

### Q11. What is the difference between Python Arrays and Lists?

**Category:** Basic | **Tags:** \`data-structures\`, \`arrays\`, \`lists\`

> **Senior Interviewer Insight:** Built-in lists hold heterogeneous object pointers; array module / numpy arrays hold contiguous homogeneous C-types with low memory overhead.

Arrays (when talking about the array module in Python) are specifically used to store a collection of numeric elements that are all of the same type. This makes them more efficient for storing large amounts of data and performing numerical computations where the type consistency is maintained.

\`\`\`python
from array import array
arr = array('i', [1, 2, 3, 4])  # Array of integers
print(arr)
\`\`\`

Lists are more flexible than arrays in that they can hold elements of different types (integers, strings, objects, etc.). They come built-in with Python and do not require importing any additional modules. Lists support a variety of operations that can modify the list.

\`\`\`python
a = [1, 'hello', 3.14, [1, 2, 3]]
print(a)
\`\`\`

Read more about: List vs Array in Python

\`\`\`python
from array import array
arr = array('i', [1, 2, 3, 4])  # Array of integers
print(arr)
\`\`\`

---

### Q12. Difference between for loop and while loop in Python

**Category:** Basic | **Tags:** \`control-flow\`, \`loops\`, \`iterators\`

> **Senior Interviewer Insight:** for loops consume the iterable protocol (__iter__ / __next__); while loops test a condition on each iteration.

- For loop: Used when we know how many times to repeat, often with lists, tuples, sets or dictionaries.
- While loop: Used when we only have an end condition and don’t know exactly how many times it will repeat.

\`\`\`python
for i in range(5):
    print(i)
    
print()

c = 0
while c < 5:
    print(c)
    c += 1
\`\`\`

\`\`\`python
for i in range(5):
    print(i)
    
print()

c = 0
while c < 5:
    print(c)
    c += 1
\`\`\`

---

### Q13. What is a break, continue and pass in Python?

**Category:** Basic | **Tags:** \`control-flow\`, \`keywords\`

> **Senior Interviewer Insight:** break exits loop, continue skips to next iteration, pass is a syntactic null-statement placeholder.

- Break statement: Used to terminate the loop or statement in which it is present. After that, the control will pass to the statements that are present after the break statement, if available.
- Continue: is also a loop control statement just like the break statement. continue statement is opposite to that of the break statement, instead of terminating the loop, it forces to execute the next iteration of the loop.
- Pass: means performing no operation or in other words, it is a placeholder in the compound statement, where there should be a blank left and nothing has to be written there.

---

### Q14. What is a lambda function?

**Category:** Basic | **Tags:** \`functions\`, \`functional\`, \`lambda\`

> **Senior Interviewer Insight:** Anonymous inline function restricted to a single expression. Best used for short key callbacks like sorted(data, key=lambda x: x[1]).

A lambda function is an anonymous function. This function can have any number of parameters but, can have just one statement. In the example, we defined a lambda function(upper) to convert a string to its upper case using upper().

\`\`\`python
s1 = 'GeeksforGeeks'
s2 = lambda func: func.upper()
print(s2(s1))
\`\`\`

\`\`\`python
s1 = 'GeeksforGeeks'
s2 = lambda func: func.upper()
print(s2(s1))
\`\`\`

---

### Q15. What are map(), filter(), and reduce() in Python?

**Category:** Basic | **Tags:** \`functional\`, \`builtins\`

> **Senior Interviewer Insight:** map applies function to iterable, filter yields items where predicate is True, reduce (functools) cumulatively folds values. Mention list comprehensions are often preferred.

These functions are used for functional programming:
- map() applies a function to every element.
- filter() selects elements that satisfy a condition.
- reduce() combines all elements into a single value.

\`\`\`python
from functools import reduce

numbers = [1,2,3,4]
print(list(map(lambda x: x*2, numbers)))
print(list(filter(lambda x: x%2==0, numbers)))
print(reduce(lambda x,y:x+y, numbers))
\`\`\`

\`\`\`python
from functools import reduce

numbers = [1,2,3,4]
print(list(map(lambda x: x*2, numbers)))
print(list(filter(lambda x: x%2==0, numbers)))
print(reduce(lambda x,y:x+y, numbers))
\`\`\`

---

### Q16. Can we Pass a function as an argument in Python?

**Category:** Basic | **Tags:** \`functions\`, \`first-class\`, \`closures\`

> **Senior Interviewer Insight:** Functions are first-class citizens in Python—can be passed as arguments, assigned to variables, and returned from other functions.

Yes, several arguments can be passed to a function, including objects, variables (of the same or distinct data types) and functions. Functions can be passed as parameters to other functions because they are objects. Higher-order functions are functions that can take other functions as arguments.

\`\`\`python
def add(x, y):
    return x + y

def apply_func(func, a, b):
    return func(a, b)

print(apply_func(add, 3, 5))
\`\`\`

The add function is passed as an argument to apply_func, which applies it to 3 and 5.

\`\`\`python
def add(x, y):
    return x + y

def apply_func(func, a, b):
    return func(a, b)

print(apply_func(add, 3, 5))
\`\`\`

---

### Q17. What are *args and **kwargs?

**Category:** Basic | **Tags:** \`functions\`, \`parameters\`, \`args-kwargs\`

> **Senior Interviewer Insight:** *args packs extra positional arguments into a tuple; **kwargs packs extra keyword arguments into a dictionary. Crucial for decorators and forwarding.

*args: used to pass a variable number of arguments to a function. Python program to illustrate *args for a variable number of arguments.

\`\`\`python
def fun(*argv):
    for arg in argv:
        print(arg)

fun('Hello', 'Welcome', 'to', 'GeeksforGeeks')
\`\`\`

**kwargs: used to accept a variable number of keyword arguments. These arguments are collected into a dictionary, where the keys are the argument names and the values are the corresponding values. 

\`\`\`python
def fun(**kwargs):
    for k, val in kwargs.items():
        print("%s == %s" % (k, val))

fun(s1='Geeks', s2='for', s3='Geeks')
\`\`\`

\`\`\`python
def fun(*argv):
    for arg in argv:
        print(arg)

fun('Hello', 'Welcome', 'to', 'GeeksforGeeks')
\`\`\`

---

### Q18. How are arguments passed by value or by reference in Python?

**Category:** Basic | **Tags:** \`memory\`, \`functions\`, \`evaluation\`

> **Senior Interviewer Insight:** Python uses 'Call by Object Reference' (or Call by Sharing). If the object is mutable and modified in-place, the caller sees changes; if reassigned, it does not.

Python uses Pass by Object Reference (also called Call by Object Sharing) to pass arguments to functions. Instead of passing values or references directly, Python passes a reference to the object. Whether the original object changes depends on whether it is mutable or immutable.

\`\`\`python
def call_by_val(x):
    x = x * 2
    return x

def call_by_ref(b):
    b.append("D")
    return b

a = ["E"]
num = 6

updated_num = call_by_val(num)
updated_list = call_by_ref(a)
print("Updated value after call_by_val:", updated_num)
print("Updated list after call_by_ref:", updated_list)
\`\`\`

\`\`\`python
def call_by_val(x):
    x = x * 2
    return x

def call_by_ref(b):
    b.append("D")
    return b

a = ["E"]
num = 6

updated_num = call_by_val(num)
updated_list = call_by_ref(a)
print("Updated value after call_by_val:", updated_num)
print("Updated list after call_by_ref:", updated_list)
\`\`\`

---

### Q19. What is a Variable Scope in Python?

**Category:** Basic | **Tags:** \`scope\`, \`variables\`

> **Senior Interviewer Insight:** Scope determines variable visibility and lifespan: Local, Enclosing, Global, and Built-in.

The location where we can find a variable and also access it if required is called the scope of a variable.
- Python Local variable: Local variables are those that are initialized within a function and are unique to that function. A local variable cannot be accessed outside of the function.
- Python Global variables: Global variables are the ones that are defined and declared outside any function and are not specified to any function.
- Module-level scope: It refers to the global objects of the current module accessible in the program.
- Outermost scope: It refers to any built-in names that the program can call. The name referenced is located last among the objects in this scope.

---

### Q20. What is the LEGB rule in Python?

**Category:** Basic | **Tags:** \`scope\`, \`legb\`, \`lookup\`

> **Senior Interviewer Insight:** LEGB rule dictates namespace search order: Local -> Enclosing -> Global -> Built-in. Python stops at the first match.

Python follows the LEGB rule to resolve variable names. LEGB stands for:
- L – Local
- E – Enclosing
- G – Global
- B – Built-in

Python searches for a variable in this order until it is found.

\`\`\`python
x = "Global"

def outer():
    x = "Enclosing"

    def inner():
        x = "Local"
        print(x)

    inner()

outer()
\`\`\`

\`\`\`python
x = "Global"

def outer():
    x = "Enclosing"

    def inner():
        x = "Local"
        print(x)

    inner()

outer()
\`\`\`

---

### Q21. What are the global and nonlocal keywords in Python?

**Category:** Basic | **Tags:** \`scope\`, \`keywords\`, \`closures\`

> **Senior Interviewer Insight:** global declares variable is at module level; nonlocal declares variable is in the nearest enclosing (outer function) scope.

Both keywords allow modifying variables outside the current function.
- global modifies a global variable.
- nonlocal modifies a variable from the nearest enclosing function.

\`\`\`python
count = 0

def increment():
    global count
    count += 1

increment()
print(count)
\`\`\`

Example of nonlocal:

\`\`\`python
def outer():
    x = 10

    def inner():
        nonlocal x
        x += 5

    inner()
    print(x)

outer()
\`\`\`

\`\`\`python
count = 0

def increment():
    global count
    count += 1

increment()
print(count)
\`\`\`

---

### Q22. What is docstring in Python?

**Category:** Basic | **Tags:** \`documentation\`, \`pep257\`

> **Senior Interviewer Insight:** First statement in module/class/function as string literal. Accessible via __doc__ and used by help() and automated doc generators.

Python documentation strings (or docstrings) provide a convenient way of associating documentation with Python modules, functions, classes and methods.
- Declaring Docstrings: Docstrings are written using triple single quotes (''') or triple double quotes (""") immediately below the module, class, method or function definition.
- Accessing Docstrings: Docstrings can be accessed using the __doc__ attribute of the object or by using the help() function.

\`\`\`python
def add(a, b):
    """Return the sum of two numbers."""
    return a + b

print(add.__doc__)
help(add)
\`\`\`

Explanation: In this example, the function add() includes a docstring that describes its purpose. The docstring can be viewed directly using add.__doc__ or through the built-in help() function.

\`\`\`python
def add(a, b):
    """Return the sum of two numbers."""
    return a + b

print(add.__doc__)
help(add)
\`\`\`

---

### Q23. How can you concatenate two lists in Python?

**Category:** Basic | **Tags:** \`lists\`, \`concatenation\`

> **Senior Interviewer Insight:** Methods: '+' operator (creates new list), list.extend() (in-place modification), and unpacking [*a, *b].

We can concatenate two lists in Python using the +operator or the extend() method.

1. + operator: This creates a new list by joining two lists together.

\`\`\`python
a = [1, 2, 3]
b = [4, 5, 6]
res = a + b
print(res) 
\`\`\`

2. extend() : This adds all the elements of the second list to the first list in-place.

\`\`\`python
a = [1, 2, 3]
b = [4, 5, 6]
a.extend(b)
print(a) 
\`\`\`

\`\`\`python
a = [1, 2, 3]
b = [4, 5, 6]
res = a + b
print(res)
\`\`\`

---

### Q24. What is the difference between append() and extend()?

**Category:** Basic | **Tags:** \`lists\`, \`methods\`

> **Senior Interviewer Insight:** append(item) adds the argument as a single element; extend(iterable) unpacks and appends each element of the iterable.

Both methods add elements to a list:
- append() adds the entire object as a single element.
- extend() adds each element of an iterable individually.

\`\`\`python
a = [1,2]
a.append([3,4])
print(a)

b = [1,2]
b.extend([3,4])
print(b)
\`\`\`

\`\`\`python
a = [1,2]
a.append([3,4])
print(a)

b = [1,2]
b.extend([3,4])
print(b)
\`\`\`

---

### Q25. What is the difference between remove(), pop(), and del?

**Category:** Basic | **Tags:** \`lists\`, \`deletion\`

> **Senior Interviewer Insight:** remove(val) removes first matching value; pop([i]) removes and returns element at index (default last); del statement deletes by index or slice.

All three remove elements from a list but work differently:
- remove() deletes the first matching value.
- pop() removes an element using its index and returns it.
- del deletes an element or an entire list.

\`\`\`python
num = [10,20,30,40]
num.remove(20)
num.pop()
del num[0]
print(num)
\`\`\`

\`\`\`python
num = [10,20,30,40]
num.remove(20)
num.pop()
del num[0]
print(num)
\`\`\`

---

### Q26. What is List Comprehension? Give an Example.

**Category:** Basic | **Tags:** \`comprehensions\`, \`lists\`, \`idiomatic\`

> **Senior Interviewer Insight:** Concise syntax [expr for item in iterable if cond]. Evaluates faster in CPython than equivalent for-append loop due to optimized bytecode.

List comprehension is a way to create lists using a concise syntax. It allows us to generate a new list by applying an expression to each item in an existing iterable (such as a list or range). This helps us to write cleaner, more readable code compared to traditional looping techniques.

For example, if we have a list of integers and want to create a new list containing the square of each element, we can easily achieve this using list comprehension.

\`\`\`python
a = [2,3,4,5]
res = [val ** 2 for val in a]
print(res)
\`\`\`

\`\`\`python
a = [2,3,4,5]
res = [val ** 2 for val in a]
print(res)
\`\`\`

---

### Q27. How is Exceptional handling done in Python?

**Category:** Basic | **Tags:** \`exceptions\`, \`defensive\`

> **Senior Interviewer Insight:** try-except-else-finally block. Else runs ONLY when no exception occurs; finally runs ALWAYS (ideal for closing sockets/files).

Exception handling in Python is used to manage runtime errors gracefully without stopping the program abruptly. Python provides three main keywords for handling exceptions:
- try: A block of code that is monitored for errors.
- except: Executes when an error occurs in the try block.
- finally: Executes after the try and except blocks, regardless of whether an error occurred. It’s used for cleanup tasks.

Example: Trying to divide a number by zero will cause an exception.

\`\`\`python
n = 10
try:
    res = n / 0  # Raises ZeroDivisionError

except ZeroDivisionError:
    print("Can't be divided by zero!")

finally:
    print("Execution completed.")
\`\`\`

Explanation: In this example, dividing number by 0 raises a ZeroDivisionError. The try block contains the code that might cause an exception and the except block handles the exception, printing an error message instead of stopping the program.

\`\`\`python
n = 10
try:
    res = n / 0  # Raises ZeroDivisionError

except ZeroDivisionError:
    print("Can't be divided by zero!")

finally:
    print("Execution completed.")
\`\`\`

---

### Q28. What are Modules and Packages in Python?

**Category:** Basic | **Tags:** \`modules\`, \`packaging\`

> **Senior Interviewer Insight:** A module is a single .py file; a package is a directory containing modules and an __init__.py file (optional in Python 3.3+ namespace packages).

A module is a single file that contains Python code (functions, variables, classes) which can be reused in other programs. You can think of it as a code library. For example: math is a built-in module that provides math functions like sqrt(), pi, etc.

\`\`\`python
import math
print(math.sqrt(16))  
\`\`\`

Package is a collection of related modules stored in a directory. It helps in organizing and grouping modules together for easier management. For example: The numpy package contains multiple modules for numerical operations. To create a package, the directory must contain a special file named __init__.py.

\`\`\`python
import math
print(math.sqrt(16))
\`\`\`

---

### Q29. What is the purpose of if __name__ == "__main__" in Python?

**Category:** Basic | **Tags:** \`execution\`, \`entrypoint\`

> **Senior Interviewer Insight:** Guards code from executing upon import. __name__ evaluates to '__main__' when run as a script, but to the module's name when imported.

The if __name__ == "__main__" statement ensures that a block of code runs only when the file is executed directly, not when it is imported as a module.

\`\`\`python
def greet():
    print("Hello")

if __name__ == "__main__":
    greet()
\`\`\`

---

## Intermediate Python Interview Questions

\`\`\`python
def greet():
    print("Hello")

if __name__ == "__main__":
    greet()
\`\`\`

---

### Q30. What is slicing in Python?

**Category:** Intermediate | **Tags:** \`slicing\`, \`sequences\`

> **Senior Interviewer Insight:** sequence[start:stop:step]. Returns a new shallow copy slice. Negative indices count from end; step=-1 reverses sequence.

Slicing is a technique used to extract a portion of a sequence such as a string, list, tuple or range. It allows to specify a starting index, an ending index and an optional step value.

Syntax: slice(start, stop, step)

\`\`\`python
l = [10, 20, 30, 40, 50]
res = slice(1, 4)
print(l[res])
\`\`\`

\`\`\`python
l = [10, 20, 30, 40, 50]
res = slice(1, 4)
print(l[res])
\`\`\`

---

### Q31. Differentiate between List and Tuple?

**Category:** Intermediate | **Tags:** \`data-structures\`, \`tuples\`, \`immutability\`

> **Senior Interviewer Insight:** Lists are mutable (over-allocated dynamic arrays); tuples are immutable (fixed-size, can be dictionary keys if items are hashable).

Let’s analyze the differences between List and Tuple:

List
- Lists are Mutable datatype.
- Lists consume more memory
- The list is better for performing operations, such as insertion and deletion.
- The implication of iterations is Time-consuming

Tuple
- Tuples are Immutable datatype.
- Tuple consumes less memory as compared to the list
- A Tuple data type is appropriate for accessing the elements
- The implication of iterations is comparatively Faster

---

### Q32. What is Dictionary Comprehension? Give an Example

**Category:** Intermediate | **Tags:** \`comprehensions\`, \`dicts\`

> **Senior Interviewer Insight:** {k_expr: v_expr for item in iterable}. Rapidly construct inverted or filtered mappings.

Dictionary Comprehension is a concise way to create dictionaries from existing iterables. It allows to generate key-value pairs in a single line of code, making the code more readable and efficient.

\`\`\`python
keys = ['a', 'b', 'c', 'd', 'e']
values = [1, 2, 3, 4, 5]
d = {k: v for k, v in zip(keys, values)}
print(d)
\`\`\`

\`\`\`python
keys = ['a', 'b', 'c', 'd', 'e']
values = [1, 2, 3, 4, 5]
d = {k: v for k, v in zip(keys, values)}
print(d)
\`\`\`

---

### Q33. Is Tuple Comprehension possible in Python? If yes, how and if not why?

**Category:** Intermediate | **Tags:** \`comprehensions\`, \`generators\`, \`tuples\`

> **Senior Interviewer Insight:** Tuple comprehension does NOT exist! (x for x in data) creates a generator expression. To get a tuple, wrap it: tuple(x for x in data).

Tuple comprehensions are not directly supported, Python's existing features like generator expressions and the tuple() function provide flexible alternatives for creating tuples from iterable data.

(i for i in (1, 2, 3))

Explanation: 
- In Python, expressions enclosed in parentheses with a for loop produce a generator expression, which generates values lazily one at a time. 
- Since tuples are immutable sequences, Python does not provide a separate tuple comprehension syntax. Instead, the recommended approach is to use a generator expression and convert it into a tuple using tuple().

---

### Q34. What is the difference between a shallow copy and a deep copy?

**Category:** Intermediate | **Tags:** \`memory\`, \`copying\`

> **Senior Interviewer Insight:** Shallow copy (copy.copy) creates a new container but references child objects; deep copy (copy.deepcopy) recursively clones all nested objects.

Below is the tabular difference between the Shallow Copy and Deep Copy:

| Shallow Copy | Deep Copy |
| --- | --- |
| Shallow Copy stores the references of objects to the original memory address. | Deep copy stores copies of the object’s value. |
| Shallow Copy reflects changes made to the new/copied object in the original object. | Deep copy doesn’t reflect changes made to the new/copied object in the original object. |
| Shallow Copy stores the copy of the original object and points the references to the objects. | Deep copy stores the copy of the original object and recursively copies the objects as well. |
| A shallow copy is faster. | Deep copy is comparatively slower. |

---

### Q35. What are Iterators in Python?

**Category:** Intermediate | **Tags:** \`iterators\`, \`protocols\`

> **Senior Interviewer Insight:** An object implementing __iter__() (returns self) and __next__() (returns next item or raises StopIteration).

Iterators are used to iterate a group of elements, containers like a list. Iterators work on iterable objects such as lists, tuples and dictionaries. Python iterator implements __iter__() and the next() methods to iterate the stored elements. We generally use loops to iterate over the collections (list, tuple) in Python.

\`\`\`python
s = "GFG"
it = iter(s)

print(next(it))
print(next(it))
print(next(it))
\`\`\`

\`\`\`python
s = "GFG"
it = iter(s)

print(next(it))
print(next(it))
print(next(it))
\`\`\`

---

### Q36. What are Magic (Dunder) Methods in Python?

**Category:** Intermediate | **Tags:** \`dunder\`, \`data-model\`, \`protocols\`

> **Senior Interviewer Insight:** Special methods with leading/trailing double underscores (__repr__, __add__, __len__) that hook into Python's internal protocol operations.

Magic methods are special methods whose names begin and end with double underscores. They allow developers to customize the behavior of objects. Common magic methods include:
- __init__()
- __str__()
- __repr__()
- __len__()

\`\`\`python
class Student:

    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name

s = Student("Alice")
print(s)
\`\`\`

\`\`\`python
class Student:

    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name

s = Student("Alice")
print(s)
\`\`\`

---

### Q37. What are Generators in Python?

**Category:** Intermediate | **Tags:** \`generators\`, \`lazy-eval\`, \`yield\`

> **Senior Interviewer Insight:** Functions containing 'yield' that return generator iterators. Suspend and resume execution frame without exhausting RAM.

Generators are a simple and memory-efficient way to create iterators in Python. They generate values one at a time only when needed, rather than storing all values in memory at once. A function becomes a generator if it contains the yield statement. Each time yield is executed, the function returns a value and pauses its execution. When the next value is requested, execution resumes from where it left off.

Generators automatically implement the __iter__() and __next__() methods, which allows them to be used directly in loops and with the next() function.

\`\`\`python
def fun(max):
    cnt = 1
    while cnt <= max:
        yield cnt
        cnt += 1

ctr = fun(5)
for n in ctr:
    print(n)
\`\`\`

\`\`\`python
def fun(max):
    cnt = 1
    while cnt <= max:
        yield cnt
        cnt += 1

ctr = fun(5)
for n in ctr:
    print(n)
\`\`\`

---

### Q38. Which sorting technique is used by sort() and sorted() functions of python?

**Category:** Intermediate | **Tags:** \`algorithms\`, \`sorting\`, \`timsort\`

> **Senior Interviewer Insight:** Timsort (hybrid of Merge Sort and Insertion Sort). $O(n \\log n)$ worst-case, $O(n)$ best-case on partially sorted data, stable.

Python uses the Tim Sort algorithm for sorting. It’s a stable sorting whose worst case is O(N log N). It’s a hybrid sorting algorithm, derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data.

---

### Q39. What is the difference between sort() and sorted()?

**Category:** Intermediate | **Tags:** \`sorting\`, \`methods\`

> **Senior Interviewer Insight:** list.sort() sorts the list in-place and returns None; sorted(iterable) returns a new sorted list leaving original untouched.

sort()	
- Sorts original list
- Changes existing list

sorted()
- Returns a new sorted list
- Does not modify original list

\`\`\`python
num = [3,1,2]

print(sorted(num))
print(num)

num.sort()
print(num)
\`\`\`

\`\`\`python
num = [3,1,2]

print(sorted(num))
print(num)

num.sort()
print(num)
\`\`\`

---

### Q40. Does Python supports multiple Inheritance?

**Category:** Intermediate | **Tags:** \`oop\`, \`inheritance\`, \`mro\`

> **Senior Interviewer Insight:** Yes, Python fully supports multiple inheritance. Resolved deterministically using C3 Linearization (MRO).

When a class is derived from more than one base class it is called multiple Inheritance. The derived class inherits all the features of the base case.Multiple Inheritance

Python does support multiple inheritances, unlike some programming languages that restrict multiple inheritance of classes. For example:

\`\`\`python
class A:
    def method_a(self):
        print("Method from class A")

class B:
    def method_b(self):
        print("Method from class B")

class C(A, B):
    pass

obj = C()
obj.method_a()
obj.method_b()
\`\`\`

Explanation:
- A and B are parent classes, each defining one method.
- C(A, B) inherits from both parent classes.
- obj = C() creates an object of class C.
- The object obj can call methods from both A and B.

\`\`\`python
class A:
    def method_a(self):
        print("Method from class A")

class B:
    def method_b(self):
        print("Method from class B")

class C(A, B):
    pass

obj = C()
obj.method_a()
obj.method_b()
\`\`\`

---

### Q41. What is Method Resolution Order (MRO) in Python?

**Category:** Intermediate | **Tags:** \`oop\`, \`mro\`, \`c3-linearization\`

> **Senior Interviewer Insight:** Method Resolution Order: The deterministic order in which Python searches base classes for attributes/methods, viewed via Class.__mro__.

Method Resolution Order (MRO) defines the order in which Python searches for methods in classes when multiple inheritance is used. The MRO can be viewed using the mro() method.

\`\`\`python
class A:
    pass

class B(A):
    pass

class C(B):
    pass

print(C.mro())
\`\`\`

\`\`\`python
class A:
    pass

class B(A):
    pass

class C(B):
    pass

print(C.mro())
\`\`\`

---

### Q42. What is the purpose of the super() function in Python?

**Category:** Intermediate | **Tags:** \`oop\`, \`super\`, \`cooperative\`

> **Senior Interviewer Insight:** Delegates method calls to the next class in the MRO chain. Essential for cooperative multiple inheritance.

The super() function allows a child class to access methods and constructors of its parent class.

\`\`\`python
class Animal:

    def __init__(self):
        print("Animal")

class Dog(Animal):

    def __init__(self):
        super().__init__()
        print("Dog")

Dog()
\`\`\`

\`\`\`python
class Animal:

    def __init__(self):
        print("Animal")

class Dog(Animal):

    def __init__(self):
        super().__init__()
        print("Dog")

Dog()
\`\`\`

---

### Q43. What is Polymorphism in Python?

**Category:** Intermediate | **Tags:** \`oop\`, \`polymorphism\`, \`duck-typing\`

> **Senior Interviewer Insight:** Duck typing: 'If it walks like a duck and quacks like a duck, it's a duck.' Python checks for behavior/methods at runtime, not strict inheritance.

Polymorphism means "many forms." It allows same method name to perform different actions depending on the object that calls it. This is achieved through method overriding, where child classes provide their own implementation of a method defined in a parent class.
- The same method name can behave differently for different objects.
- Child classes can override methods of parent classes.
- It improves code flexibility and reusability.

\`\`\`python
class Animal:
    def sound(self):
        print("Some sound")

class Dog(Animal):
    def sound(self):
        print("Bark")

class Cat(Animal):
    def sound(self):
        print("Meow")

for animal in [Dog(), Cat()]:
    animal.sound()
\`\`\`

Explanation:
- Dog and Cat override the sound() method of Animal.
- The same sound() method produces different outputs for different objects.
- This demonstrates polymorphism in Python.

\`\`\`python
class Animal:
    def sound(self):
        print("Some sound")

class Dog(Animal):
    def sound(self):
        print("Bark")

class Cat(Animal):
    def sound(self):
        print("Meow")

for animal in [Dog(), Cat()]:
    animal.sound()
\`\`\`

---

### Q44. Define encapsulation in Python?

**Category:** Intermediate | **Tags:** \`oop\`, \`encapsulation\`

> **Senior Interviewer Insight:** Bundling data and methods. Python uses naming conventions: single underscore _internal (protected hint), double underscore __private (name mangled).

Encapsulation is the process of hiding the internal state of an object and requiring all interactions to be performed through an object’s methods. This approach:
- Provides better control over data.
- Prevents accidental modification of data.
- Promotes modular programming.

Python achieves encapsulation through public, protected and private attributes.Encapsulation

---

### Q45. How do you do data abstraction in Python?

**Category:** Intermediate | **Tags:** \`oop\`, \`abstraction\`, \`abc\`

> **Senior Interviewer Insight:** Abstract Base Classes via the 'abc' module and '@abstractmethod' decorator prevent instantiation until subclasses implement required interfaces.

Data Abstraction means providing only the essential details while hiding the implementation. It allows users to interact with an object through a simple interface without needing to understand its internal working. It's achieved using abstract base classes provided by the abc module. These classes define abstract methods that must be implemented by derived classes.

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def area(self):
        return 3.14 * 5 * 5

c = Circle()
print(c.area())
\`\`\`

Explanation:
- Shape defines an abstract method area().
- Circle implements the area() method and Circle objects can use area() normally.
- The implementation details are hidden behind a common interface.

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def area(self):
        return 3.14 * 5 * 5

c = Circle()
print(c.area())
\`\`\`

---

### Q46. What are Decorators?

**Category:** Intermediate | **Tags:** \`decorators\`, \`meta-programming\`

> **Senior Interviewer Insight:** A callable that takes a function and returns an enhanced function. Syntactic sugar @dec. Remember to use functools.wraps.

Decorators is a flexible way to modify or extend the behavior of functions or methods, without changing their actual code. A decorator is essentially a function that takes another function as an argument and returns a new function with enhanced functionality.

Decorators are often used in scenarios such as logging, authentication and memorization, allowing us to add additional functionality to existing functions or methods in a clean, reusable way.

---

### Q47. What is a namespace in Python?

**Category:** Intermediate | **Tags:** \`internals\`, \`namespaces\`

> **Senior Interviewer Insight:** A mapping from names to objects implemented internally as Python dictionaries (globals(), locals(), __dict__).

A namespace refers to a container where names (variables, functions, objects) are mapped to objects. In simple terms, a namespace is a space where names are defined and stored and it helps avoid naming conflicts by ensuring that names are unique within a given scope.Namespace

Types of Namespaces:
- Built-in Namespace: Contains all the built-in functions and exceptions, like print(), int(), etc. These are available in every Python program.
- Global Namespace: Contains names from all the objects, functions and variables in the program at the top level.
- Local Namespace: Refers to names inside a function or method. Each function call creates a new local namespace.

---

### Q48. How is memory management done in Python?

**Category:** Intermediate | **Tags:** \`memory\`, \`gc\`, \`refcounting\`

> **Senior Interviewer Insight:** Primary: Reference counting (instant free when refcount=0). Secondary: Generational cyclic Garbage Collector (gc module) detects circular references.

Python uses its private heap space to manage the memory. Basically, all the objects and data structures are stored in the private heap space. Even the programmer can not access this private space as the interpreter takes care of this space. Python also has an inbuilt garbage collector, which recycles all the unused memory and frees the memory and makes it available to the heap space.

Python manages memory automatically using a private heap, where all objects and data structures are stored. Python interpreter handles memory allocation and deallocation and an inbuilt garbage collector reclaims memory occupied by objects that are no longer in use.
- All objects and data structures are stored in a private heap.
- The Python interpreter manages memory allocation automatically.
- Programmers do not access the private heap directly.
- Python uses garbage collection to free unused memory.

---

### Q49. How to delete a file using Python?

**Category:** Intermediate | **Tags:** \`files\`, \`os-module\`

> **Senior Interviewer Insight:** os.remove(path) or pathlib.Path.unlink(). For directories: os.rmdir() or shutil.rmtree().

Python provides several ways to delete files, some of them are as following:
- os.remove() deletes a file permanently.
- send2trash.send2trash() moves a file to the recycle bin or trash. 
- os.rmdir is used to remove empty directories, not files.

---

### Q50. How do you debug a Python program?

**Category:** Intermediate | **Tags:** \`debugging\`, \`pdb\`, \`tooling\`

> **Senior Interviewer Insight:** Use pdb / breakpoint() built-in, IDE debuggers, structured logging, or trace/sys.settrace.

1. Using pdb (Python Debugger): pdb is a built-in module that allows you to set breakpoints and step through the code line by line. You can start the debugger by adding import pdb; pdb.set_trace() in your code where you want to begin debugging.

\`\`\`python
import pdb
x = 5
pdb.set_trace()  # Debugger starts here
print(x)
\`\`\`

> /home/repl/02c07243-5df9-4fb0-a2cd-54fe6d597c80/main.py(4)<module>()   
-> print(x)   
(Pdb) 

2. Using logging Module: For more advanced debugging, the logging module provides a flexible way to log messages with different severity levels (INFO, DEBUG, WARNING, ERROR, CRITICAL).

\`\`\`python
import logging
logging.basicConfig(level=logging.DEBUG)
logging.debug("This is a debug message")
\`\`\`

DEBUG:root:This is a debug message

\`\`\`python
import pdb
x = 5
pdb.set_trace()  # Debugger starts here
print(x)
\`\`\`

---

### Q51. What is the difference between xrange and range functions?

**Category:** Intermediate | **Tags:** \`python2-vs-3\`, \`range\`

> **Senior Interviewer Insight:** In Python 2, range() created a full list, xrange() was a lazy generator. In Python 3, range() is an immutable sequence type with $O(1)$ memory.

range() and xrange() were both used in Python 2 to generate sequences of numbers for iteration. In Python 3, there is no xrange, but the range function behaves like xrange.
- range(): returns a range object, which is an immutable sequence type that generates the numbers on demand. 
- xrange(): returns the generator object that can be used to display numbers only by looping. The only particular range is displayed on demand and hence called lazy evaluation.

---

## Advanced Python Interview Questions & Answers

---

### Q52. What is PIP?

**Category:** Advanced | **Tags:** \`tooling\`, \`packaging\`, \`pip\`

> **Senior Interviewer Insight:** Package Installer for Python. Resolves and downloads wheels/sdists from PyPI into virtual environments.

PIP stands for "Pip Installs Packages." It is Python’s standard package manager used to install, upgrade and manage third-party libraries and dependencies from the Python Package Index (PyPI). 
- Used to install Python packages from PyPI.
- Comes pre-installed with most modern Python distributions.
- Supports installing, upgrading and uninstalling packages.
- Works from the command line.

pip install numpy

---

### Q53. What is a zip function?

**Category:** Advanced | **Tags:** \`builtins\`, \`zip\`, \`iterables\`

> **Senior Interviewer Insight:** Combines elements from multiple iterables into tuples. In Python 3, returns an iterator. In Python 3.10+, supports strict=True to enforce equal lengths.

zip() function returns a zip object, which maps a similar index of multiple containers. It takes an iterable, converts it into an iterator and aggregates the elements based on iterables passed. It returns an iterator of tuples.

Syntax: zip(*iterables) 

\`\`\`python
names = ['Hiro', 'Mila', 'Tariq']
scores = [88, 94]
res = zip(names, scores)
print(list(res))
\`\`\`

\`\`\`python
names = ['Hiro', 'Mila', 'Tariq']
scores = [88, 94]
res = zip(names, scores)
print(list(res))
\`\`\`

---

### Q54. Write a code to display the current time?

**Category:** Advanced | **Tags:** \`datetime\`, \`standard-library\`

> **Senior Interviewer Insight:** datetime.datetime.now() or datetime.datetime.now(timezone.utc) for timezone-aware production timestamps.

The datetime module provides the datetime.now() method, which returns the current local date and time. It is commonly used to display timestamps, log events, or retrieve the current system date and time.

\`\`\`python
from datetime import datetime
print("Current time is:", datetime.now())
\`\`\`

\`\`\`python
from datetime import datetime
print("Current time is:", datetime.now())
\`\`\`

---

### Q55. What is __init__() in Python and how does self play a role in it?

**Category:** Advanced | **Tags:** \`oop\`, \`init\`, \`self\`

> **Senior Interviewer Insight:** __init__ is the instance initializer. 'self' is the explicit reference to the instance being initialized.

__init__() is Python's equivalent of constructors in OOP, called automatically when a new object is created. It initializes the object's attributes with values but doesn’t handle memory allocation.
- Memory allocation is handled by the __new__() method, which is called before __init__().
- The self parameter in __init__() refers to the instance of the class, allowing access to its attributes and methods.
- self must be the first parameter in all instance methods, including __init__()

\`\`\`python
class MyClass:
    def __init__(self, value):
        self.value = value  # Initialize object attribute

    def display(self):
        print(f"Value: {self.value}")

obj = MyClass(10)
obj.display() 
\`\`\`

\`\`\`python
class MyClass:
    def __init__(self, value):
        self.value = value  # Initialize object attribute

    def display(self):
        print(f"Value: {self.value}")

obj = MyClass(10)
obj.display()
\`\`\`

---

### Q56. What is the difference between __new__() and __init__()?

**Category:** Advanced | **Tags:** \`oop\`, \`dunder\`, \`lifecycle\`

> **Senior Interviewer Insight:** __new__ is a static method that allocates and returns the object in memory; __init__ initializes attributes on that created instance.

- __new__() creates a new instance of a class.
- __init__() initializes the created instance.

__new__() is called before __init__().

---

### Q57. What are Access Specifiers in Python?

**Category:** Advanced | **Tags:** \`oop\`, \`access-specifiers\`

> **Senior Interviewer Insight:** Public (var), Protected (_var, convention), and Private (__var, name-mangled to _Class__var to prevent accidental subclass override).

Python uses the ‘_’ symbol to determine the access control for a specific data member or a member function of a class. A Class in Python has three types of Python access modifiers:
- Public Access Modifier: Members declared normally (without any underscore) are public and can be accessed from anywhere.
- Protected Access Modifier: Members prefixed with a single underscore (_) are intended for internal use within the class and its subclasses. They can still be accessed from outside the class, but this is discouraged by convention.
- Private Access Modifier: Members prefixed with double underscores (__) are name-mangled by Python to make accidental access from outside the class more difficult.

\`\`\`python
class Student:
    def __init__(self):
        # Public
        self.name = "Mike"          
        # Protected
        self._roll_no = 101         
        # Private
        self.__marks = 95            

obj = Student()
print(obj.name)      
print(obj._roll_no)
print(obj._Student__marks)  
\`\`\`

Explanation:
- name is a public attribute and can be accessed directly.
- _roll_no is a protected attribute, it is accessible outside the class but intended for internal use.
- __marks is a private attribute and is automatically renamed internally.
- obj._Student__marks accesses the private attribute using Python's name mangling mechanism.

\`\`\`python
class Student:
    def __init__(self):
        # Public
        self.name = "Mike"          
        # Protected
        self._roll_no = 101         
        # Private
        self.__marks = 95            

obj = Student()
print(obj.name)      
print(obj._roll_no)
print(obj._Student__marks)
\`\`\`

---

### Q58. What is the difference between @classmethod, @staticmethod and instance methods in Python?

**Category:** Advanced | **Tags:** \`oop\`, \`methods\`, \`descriptors\`

> **Senior Interviewer Insight:** Instance method takes 'self'; @classmethod takes 'cls' (factory constructor); @staticmethod takes neither (namespaced utility function).

- Instance Method: Operates on an instance of the class and has access to instance attributes and takes self as the first parameter. 
- Class Method: Works with the class and takes cls as the first parameter. It is defined using @classmethod.
- Static Method: Does not access instance (self) or class (cls) data. It is defined using @staticmethod and is commonly used for utility functions related to the class. 

\`\`\`python
class Student:
    school = "ABC School"

    def display(self, name):
        print(f"Student Name: {name}")

    @classmethod
    def show_school(cls):
        print(f"School: {cls.school}")

    @staticmethod
    def is_adult(age):
        return age >= 18

s = Student()
s.display("Kevin")
Student.show_school()
print(Student.is_adult(20))
\`\`\`

\`\`\`python
class Student:
    school = "ABC School"

    def display(self, name):
        print(f"Student Name: {name}")

    @classmethod
    def show_school(cls):
        print(f"School: {cls.school}")

    @staticmethod
    def is_adult(age):
        return age >= 18

s = Student()
s.display("Kevin")
Student.show_school()
print(Student.is_adult(20))
\`\`\`

---

### Q59. What are Pickling and Unpickling?

**Category:** Advanced | **Tags:** \`serialization\`, \`pickle\`

> **Senior Interviewer Insight:** pickle serializes Python object hierarchies to bytes; unpickle deserializes bytes back. WARNING: Never unpickle untrusted data (remote code execution risk).

- Pickling: converts any Python object into a byte stream (not a string representation). This byte stream can then be stored in a file, sent over a network or saved for later use. The function used for pickling is pickle.dump().
- Unpickling: process of retrieving the original Python object from the byte stream (saved during pickling) is called unpickling. The function used for unpickling is pickle.load().

---

### Q60. What are Exception Groups in Python?

**Category:** Advanced | **Tags:** \`exceptions\`, \`python311\`

> **Senior Interviewer Insight:** Introduced in Python 3.11: ExceptionGroup allows raising and catching multiple unrelated exceptions simultaneously using 'except*' syntax.

Exception Groups are a feature introduced in Python 3.11 that allow multiple exceptions to be grouped together and handled in a structured way. They are particularly useful when several operations may fail independently, such as in concurrent or asynchronous programs.

ExceptionGroup class is used to combine multiple exceptions into a single object and the except* syntax is used to handle specific exception types within the group.

\`\`\`python
try:
    raise ExceptionGroup(
        "Example ExceptionGroup",
        [
            TypeError("Example TypeError"),
            ValueError("Example ValueError"),
            KeyError("Example KeyError"),
            AttributeError("Example AttributeError"),
        ]
    )
except* TypeError:
    print("Handled TypeError")
except* ValueError:
    print("Handled ValueError")
except* (KeyError, AttributeError):
    print("Handled KeyError and AttributeError")
\`\`\`

\`\`\`python
try:
    raise ExceptionGroup(
        "Example ExceptionGroup",
        [
            TypeError("Example TypeError"),
            ValueError("Example ValueError"),
            KeyError("Example KeyError"),
            AttributeError("Example AttributeError"),
        ]
    )
except* TypeError:
    print("Handled TypeError")
except* ValueError:
    print("Handled ValueError")
except* (KeyError, AttributeError):
    print("Handled KeyError and AttributeError")
\`\`\`

---

### Q61. What is a Context Manager in Python?

**Category:** Advanced | **Tags:** \`context-managers\`, \`protocols\`

> **Senior Interviewer Insight:** Manages runtime context using __enter__ and __exit__. Guarantees deterministic teardown. Can also be built using @contextlib.contextmanager.

A context manager automatically manages resources such as files, network connections, or database connections. It is commonly used with the with statement.

\`\`\`python
with open("sample.txt", "r") as file:
    data = file.read()
\`\`\`

Benefits:
- Automatically closes the file.
- Prevents resource leaks.
- Makes code cleaner and easier to read.

\`\`\`python
with open("sample.txt", "r") as file:
    data = file.read()
\`\`\`

---

### Q62. What are unit tests in Python?

**Category:** Advanced | **Tags:** \`testing\`, \`unittest\`, \`pytest\`

> **Senior Interviewer Insight:** Automated testing framework. unittest (standard library xUnit style) or pytest (industry standard, concise fixtures, assert rewriting).

Unit Testing is the first level of software testing where the smallest testable parts of the software are tested. This is used to validate that each unit of the software performs as designed. The unit test framework is Python’s xUnit style framework. The White Box Testing method is used for Unit testing.

\`\`\`python
import unittest
def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(add(2, 3), 5)

if __name__ == "__main__":
    unittest.main()
\`\`\`

.  
----------------------------------------------------------------------

Ran 1 test in 0.000s  
  
OK

\`\`\`python
import unittest
def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(add(2, 3), 5)

if __name__ == "__main__":
    unittest.main()
\`\`\`

---

### Q63. Python Global Interpreter Lock (GIL)?

**Category:** Advanced | **Tags:** \`internals\`, \`gil\`, \`concurrency\`

> **Senior Interviewer Insight:** Global Interpreter Lock: A mutex in CPython that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously.

Global Interpreter Lock (GIL) is a mechanism used in the CPython interpreter that allows only one thread to execute Python bytecode at a time. This simplifies memory management and makes the interpreter thread-safe.
- Python supports multithreading.
- In CPython, only one thread can execute Python bytecode at a time because of the GIL.
- The GIL mainly affects CPU-bound multithreaded programs.
- I/O-bound programs can still benefit from multithreading.
- Multiprocessing can be used to achieve true parallelism across multiple CPU cores.

---

### Q64. What is the difference between Threading and Multiprocessing in Python?

**Category:** Advanced | **Tags:** \`concurrency\`, \`threading\`, \`multiprocessing\`

> **Senior Interviewer Insight:** Threading shares memory space under one GIL (ideal for I/O-bound tasks). Multiprocessing spawns separate OS processes with separate GILs (ideal for CPU-bound computation).

Threading	
- Uses multiple threads
- Shares memory	
- Limited by the GIL for CPU-bound tasks	

Multiprocessing
- Uses multiple processes
- Separate memory
- Not limited by the GIL

Threading is generally preferred for I/O-bound tasks, while multiprocessing is better suited for CPU-bound tasks.

---

### Q65. What are async and await in Python?

**Category:** Advanced | **Tags:** \`async\`, \`asyncio\`, \`coroutines\`

> **Senior Interviewer Insight:** async def defines a coroutine; await pauses coroutine execution until an awaitable (Future/Task) completes, freeing the event loop to run other tasks.

async and await are used to write asynchronous programs that can perform multiple I/O operations concurrently without blocking execution.

\`\`\`python
import asyncio

async def greet():
    print("Hello")

asyncio.run(greet())
\`\`\`

\`\`\`python
import asyncio

async def greet():
    print("Hello")

asyncio.run(greet())
\`\`\`

---

### Q66. What are Function Annotations in Python?

**Category:** Advanced | **Tags:** \`typing\`, \`pep484\`

> **Senior Interviewer Insight:** Type hints (e.g. def add(x: int, y: int) -> int:). Evaluated at definition time, stored in __annotations__, validated by tools like mypy and Pydantic.

- Function Annotation is a feature that allows you to add metadata to function parameters and return values. This way you can specify the input type of the function parameters and the return type of the value the function returns.
- Function annotations are arbitrary Python expressions that are associated with various parts of functions. These expressions are evaluated at compile time and have no life in Python’s runtime environment. Python does not attach any meaning to these annotations. They take life when interpreted by third-party libraries, for example, mypy.

---

### Q67. What is Walrus Operator?

**Category:** Advanced | **Tags:** \`syntax\`, \`walrus\`, \`python38\`

> **Senior Interviewer Insight:** Assignment expression (:=) introduced in Python 3.8. Assigns values to variables as part of a larger expression, avoiding repeated function calls.

Walrus Operator allows to assign a value to a variable within an expression. This can be useful when you need to use a value multiple times in a loop, but don't want to repeat the calculation. It is represented by the \`:=\` syntax and can be used in a variety of contexts including while loops and if statements.

Note: Python versions before 3.8 doesn't support Walrus Operator.

\`\`\`python
numbers = [1, 2, 3, 4, 5]

while (n := len(numbers)) > 0:
    print(numbers.pop())
\`\`\`

\`\`\`python
numbers = [1, 2, 3, 4, 5]

while (n := len(numbers)) > 0:
    print(numbers.pop())
\`\`\`

---

### Q68. What is Python Switch Statement?

**Category:** Advanced | **Tags:** \`syntax\`, \`pattern-matching\`, \`python310\`

> **Senior Interviewer Insight:** Python 3.10 match/case statement: Much more than a switch! Performs deep structural pattern matching, sequence destructuring, type checking, and guard clauses.

Python does not have a traditional switch statement like languages such as C, C++ or Java. Starting with Python 3.10, however, Python introduced structural pattern matching using the match and case keywords, which provides similar functionality.

\`\`\`python
value = 2

match value:
    case 1:
        result = "one"
    case 2:
        result = "two"
    case 3:
        result = "three"
    case _:
        result = "unknown"

print(result)
\`\`\`

\`\`\`python
value = 2

match value:
    case 1:
        result = "one"
    case 2:
        result = "two"
    case 3:
        result = "three"
    case _:
        result = "unknown"

print(result)
\`\`\`

---
`;export{n as default};
