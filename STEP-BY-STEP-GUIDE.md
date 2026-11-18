# Step-by-Step Guide — FDE Academy (AI-Era Path)

> **Start from where you actually are.** You do not need to memorize coding syntax or repeat basics you already know. Check what you have already learned, then follow the 7-step AI-Native FDE lifecycle in order.

---

## Step 0: Check What You Have Already Learned

Before starting at Mission 1, check off what you already know (or complete the interactive check on the home page at `#/`):

| Skill Area | If You Are New | If You Already Know It |
| :--- | :--- | :--- |
| **1. Web & Product Framing** | Start at **Step 1 & Step 2** (`#/sdlc`, Mission 1) | Fast-track Step 2 and jump to Spec-Driven Dev |
| **2. APIs, JSON & HTTP Contracts** | Complete **Step 4** (Missions 11 & 15) | Skim Mission 11 & focus on failure handling |
| **3. Databases & Transactions** | Complete **Step 4** (Missions 12 & 13) | Focus on transactions & idempotency in Mission 13 |
| **4. Security, Auth & Privacy** | Complete **Step 4** (Mission 14) | Audit your trust boundaries & secret hygiene |
| **5. AI Agents, Specs & RAG** | Complete **Step 3 & Step 5** (Missions 8, 10, 16–19) | Jump to multi-step agent coordination & tools |
| **6. Testing Harnesses & AI Evals** | Complete **Step 6** (Missions 20 & 21) | Build held-out eval suites for your own project |
| **7. Release, Rollback & Incident Ops** | Complete **Step 7** (Missions 22–25, 28–30) | Build your end-to-end capstone & portfolio proof |

---

## The 7-Step AI-Native FDE Path

### Step 1: Master the AI-Native SDLC Spine
- **Where:** `#/sdlc` and [AI-NATIVE-SDLC.md](AI-NATIVE-SDLC.md)
- **What you learn:** Why loose prompting ("vibe coding") fails in production, and how the 7 phases (*Discover → Specify → Architect → Build → Verify → Review → Operate*) keep AI-built systems reliable.
- **Action:** Run the interactive **Skip-a-Phase Simulator** and download the starter kit from [`templates/ai-sdlc/`](templates/ai-sdlc/README.md).

### Step 2: Discover & Frame Real Problems
- **Missions:** [M1](missions/01/README.md), [M2](missions/02/README.md), [M6](missions/06/README.md), [M7](missions/07/README.md), [M26](missions/26/README.md)
- **What you learn:** Investigating a real workflow, measuring a baseline metric, turning preferences into clear direction, and defining explicit non-goals.
- **Outcome:** A clear Problem Brief proving *why* a system should be built before directing any AI agent.

### Step 3: Write Testable Specs (`SPEC.md`)
- **Missions:** [M8](missions/08/README.md), [M10](missions/10/README.md)
- **What you learn:** User journeys, error feedback, pass/fail acceptance criteria, boundary cases, and negative cases.
- **Outcome:** A versioned `SPEC.md` that leaves zero guesswork for AI coding agents.

### Step 4: Understand System Architecture, Data & Security
- **Missions:** [M3](missions/03/README.md), [M4](missions/04/README.md), [M5](missions/05/README.md), [M9](missions/09/README.md), [M11](missions/11/README.md), [M12](missions/12/README.md), [M13](missions/13/README.md), [M14](missions/14/README.md), [M15](missions/15/README.md)
- **What you learn:** How browsers, APIs, databases, transactions, authentication, authorization, and third-party integrations actually work—plus how to lock guardrails in `AGENTS.md` and ADRs.
- **Outcome:** Ability to design system boundaries and spot structural or security flaws in AI-generated designs.

### Step 5: Direct AI Agents in Vertical Bolts
- **Missions:** [M16](missions/16/README.md), [M17](missions/17/README.md), [M18](missions/18/README.md), [M19](missions/19/README.md), [M27](missions/27/README.md)
- **What you learn:** Decomposing specs into small vertical slices, coordinating dependent work, adding AI capabilities (structured outputs, embeddings, RAG, tool permissions), and enforcing budgets.
- **Outcome:** Working software built through AI in clean, reviewable increments.

### Step 6: Build Verification Harnesses & AI Evals
- **Missions:** [M20](missions/20/README.md), [M21](missions/21/README.md)
- **What you learn:** Designing held-out AI evaluation datasets, balancing precision/recall/cost, and instructing AI to build unit, integration, and end-to-end harnesses that catch regressions automatically.
- **Outcome:** Automated CI checks proving your system works on normal, boundary, and adversarial inputs.

### Step 7: Release, Operate & Demonstrate Readiness
- **Missions:** [M22](missions/22/README.md), [M23](missions/23/README.md), [M24](missions/24/README.md), [M25](missions/25/README.md), [M28](missions/28/README.md), [M29](missions/29/README.md), [M30](missions/30/README.md)
- **What you learn:** CI/CD and safe rollbacks, debugging with logs/metrics/traces, scaling & cost control, safe database migrations, blameless postmortems, handoff runbooks, and defending your system on fresh scenarios.
- **Outcome:** A complete, verifiable engineering portfolio (`#/portfolio`) backed by real systems and 8-part explanations.
