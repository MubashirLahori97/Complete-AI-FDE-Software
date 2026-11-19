import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  Filter,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  Timer,
  Workflow,
  Zap,
} from 'lucide-react';
import {
  PYTHON_STAGES,
  PYTHON_TOPICS,
  PYTHON_INTERVIEW_QUESTIONS,
  PYTHON_QUIZ_QUESTIONS,
  PYTHON_TRACK_TIERS,
  ORDERED_PYTHON_TABS,
  getAllQuestionTags,
  getTopicsByDifficulty,
  loadMasteredQuestions,
  saveMasteredQuestions,
  loadQuizAnswers,
  saveQuizAnswers,
  searchInterviewQuestions,
  type PythonDifficulty,
  type PythonTrackTab,
  type PythonConceptTopic,
  type PythonInterviewQuestion,
  type OrderedPythonTab,
} from './python-track-data';
import PythonCodeStudio from './PythonCodeStudio';
import PythonIncidentsSimulator from './PythonIncidentsSimulator';
import PythonAiLabsStudio from './PythonAiLabsStudio';
import PythonFastApiStudio from './PythonFastApiStudio';
import PythonRagStudio from './PythonRagStudio';
import PythonStarterKitView from './PythonStarterKitView';
import PythonFlashcards from './PythonFlashcards';
import {
  PYTHON_EXAMS,
  TOY_VS_PROD_COMPARISONS,
  loadExamProgress,
} from './python-exams-data';
import {
  PRODUCTION_INCIDENTS,
  loadIncidentProgress,
} from './python-incidents-data';
import {
  AI_FDE_LABS,
  loadAiLabProgress,
} from './python-ai-labs-data';
import {
  FASTAPI_LABS,
  loadFastApiProgress,
} from './python-fastapi-data';
import {
  RAG_LABS,
  loadRagProgress,
} from './python-rag-data';
import type { Progress } from './state';
import './python-track.css';

export default function PythonTrack({ progress }: { progress?: Progress }) {
  const [tab, setTab] = useState<PythonTrackTab>('curriculum');
  const [difficultyFilter, setDifficultyFilter] = useState<PythonDifficulty | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [expandedTopicId, setExpandedTopicId] = useState<string>('topic-1');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string>('py-q1');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Persistence
  const [masteredIds, setMasteredIds] = useState<Set<number>>(() => loadMasteredQuestions());
  const [passedExams, setPassedExams] = useState<Record<string, boolean>>(() => loadExamProgress());
  const [resolvedIncidents, setResolvedIncidents] = useState<Record<string, boolean>>(() =>
    loadIncidentProgress(),
  );
  const [clearedAiLabs, setClearedAiLabs] = useState<Record<string, boolean>>(() =>
    loadAiLabProgress(),
  );
  const [clearedFastApi, setClearedFastApi] = useState<Record<string, boolean>>(() =>
    loadFastApiProgress(),
  );
  const [clearedRag, setClearedRag] = useState<Record<string, boolean>>(() =>
    loadRagProgress(),
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(() => loadQuizAnswers());
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(() => {
    const answers = loadQuizAnswers();
    return Object.keys(answers).length >= PYTHON_QUIZ_QUESTIONS.length;
  });

  const allTags = useMemo(() => getAllQuestionTags(), []);

  const filteredQuestions = useMemo(() => {
    return searchInterviewQuestions(searchQuery, difficultyFilter, selectedTag);
  }, [searchQuery, difficultyFilter, selectedTag]);

  const filteredTopics = useMemo(() => {
    if (difficultyFilter === 'all') return PYTHON_TOPICS;
    return getTopicsByDifficulty(difficultyFilter);
  }, [difficultyFilter]);

  const toggleMastered = (num: number) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      saveMasteredQuestions(next);
      return next;
    });
  };

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  const handleSelectQuizOption = (quizId: string, optionIndex: number) => {
    setQuizAnswers((prev) => {
      const next = { ...prev, [quizId]: optionIndex };
      saveQuizAnswers(next);
      return next;
    });
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    saveQuizAnswers({});
  };

  const quizScore = useMemo(() => {
    let score = 0;
    for (const q of PYTHON_QUIZ_QUESTIONS) {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    }
    return score;
  }, [quizAnswers]);

  const masteredPercentage = Math.round(
    (masteredIds.size / PYTHON_INTERVIEW_QUESTIONS.length) * 100,
  );

  const activeTier = useMemo(() => {
    if (tab === 'curriculum' || tab === 'toy-vs-prod' || tab === 'topics') return 1;
    if (
      tab === 'studio' ||
      tab === 'fastapi' ||
      tab === 'rag' ||
      tab === 'ai-labs' ||
      tab === 'incidents' ||
      tab === 'starter-kit'
    )
      return 2;
    return 3;
  }, [tab]);

  const totalTier2Cleared = useMemo(() => {
    const exams = Object.values(passedExams).filter(Boolean).length;
    const fastapi = Object.values(clearedFastApi).filter(Boolean).length;
    const rag = Object.values(clearedRag).filter(Boolean).length;
    const incidents = Object.values(resolvedIncidents).filter(Boolean).length;
    const aiLabs = Object.values(clearedAiLabs).filter(Boolean).length;
    return exams + fastapi + rag + incidents + aiLabs;
  }, [passedExams, clearedFastApi, clearedRag, resolvedIncidents, clearedAiLabs]);

  const currentTabItem = useMemo(() => {
    return ORDERED_PYTHON_TABS.find((item) => item.tab === tab) || ORDERED_PYTHON_TABS[0];
  }, [tab]);

  const handleNextTab = (targetTab?: PythonTrackTab) => {
    if (targetTab) {
      setTab(targetTab);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const renderNextStepBanner = (targetTab: PythonTrackTab, title: string, subtitle: string) => {
    const currentStep = currentTabItem.stepNumber;
    return (
      <div className="next-learning-step-banner">
        <div className="next-step-copy">
          <span className="next-step-badge">
            Step {currentStep} of {ORDERED_PYTHON_TABS.length} in Python Learning Flow
          </span>
          <h4>Next: {title}</h4>
          <p>{subtitle}</p>
        </div>
        <button
          type="button"
          className="button primary next-step-action-btn"
          onClick={() => handleNextTab(targetTab)}
        >
          Continue to {title} <ArrowRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="python-track-page">
      {/* Hero Header */}
      <header className="python-hero">
        <div className="python-hero-copy">
          <p className="eyebrow">
            <Terminal size={14} /> COMPLETE PYTHON MASTERY FIRMWARE
          </p>
          <h1>From Syntax Beginner to Advanced AI Systems Engineer</h1>
          <p className="python-lead">
            CPython execution internals, memory layout, dunder protocols, cooperative MRO, GIL &
            concurrency, asyncio architectures, and all 68 essential interview questions.
            Designed for high concept-density and AI-native software engineering.
          </p>

          <div className="python-stats-bar">
            <div className="python-stat-card">
              <span className="stat-number">4</span>
              <span className="stat-label">Stages</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">18</span>
              <span className="stat-label">Concepts</span>
            </div>
            <div className="python-stat-card highlight">
              <span className="stat-number">
                {Object.keys(passedExams).filter((k) => passedExams[k]).length}/{PYTHON_EXAMS.length}
              </span>
              <span className="stat-label">Exams Cleared</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">
                {Object.keys(clearedFastApi).filter((k) => clearedFastApi[k]).length}/{FASTAPI_LABS.length}
              </span>
              <span className="stat-label">FastAPI Labs</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">
                {Object.keys(clearedRag).filter((k) => clearedRag[k]).length}/{RAG_LABS.length}
              </span>
              <span className="stat-label">RAG Labs</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">
                {Object.keys(resolvedIncidents).filter((k) => resolvedIncidents[k]).length}/{PRODUCTION_INCIDENTS.length}
              </span>
              <span className="stat-label">Incidents Fixed</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">
                {Object.keys(clearedAiLabs).filter((k) => clearedAiLabs[k]).length}/{AI_FDE_LABS.length}
              </span>
              <span className="stat-label">AI Labs Cleared</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">68</span>
              <span className="stat-label">Interview Q&As</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">{masteredIds.size}/68</span>
              <span className="stat-label">Q&As Mastered</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">10</span>
              <span className="stat-label">Gotcha Quizzes</span>
            </div>
          </div>
        </div>

        <div className="python-hero-actions">
          <a
            className="button light"
            href="#/document/PYTHON-MASTERY-GUIDE.md"
            title="Read full reference guide"
          >
            <BookOpen size={16} />
            Full Reference Guide
          </a>
          <a className="button light" href="#/sdlc" title="AI-Native SDLC">
            <Workflow size={16} />
            AI-Native SDLC
          </a>
        </div>
      </header>

      {/* Learning Progression Stepper */}
      <section className="learning-progression-stepper" aria-label="Learning Progression Phases">
        <button
          type="button"
          className={`progression-step-card ${activeTier === 1 ? 'active-tier' : ''}`}
          onClick={() => setTab('curriculum')}
        >
          <div className="progression-step-header">
            <span className="phase-pill">PHASE 1</span>
            <span className="phase-status-pill done">Foundations</span>
          </div>
          <div className="progression-step-title">
            <Workflow size={16} />
            <span>Foundations & Mental Models</span>
          </div>
          <p className="progression-step-desc">
            Roadmap, Day 1 Toy vs Production paradigm shift, and 18 CPython internals deep dives.
          </p>
          <div className="progression-step-meta">
            <span>3 Sequential Modules</span>
            <span>18 Core Concepts</span>
          </div>
        </button>

        <div className="progression-arrow" aria-hidden="true">
          <ArrowRight size={18} />
        </div>

        <button
          type="button"
          className={`progression-step-card ${activeTier === 2 ? 'active-tier' : ''}`}
          onClick={() => setTab('studio')}
        >
          <div className="progression-step-header">
            <span className="phase-pill">PHASE 2</span>
            <span className="phase-status-pill lab-status">
              {totalTier2Cleared} / 23 Labs Cleared
            </span>
          </div>
          <div className="progression-step-title">
            <Terminal size={16} />
            <span>Production Systems & Applied Labs</span>
          </div>
          <p className="progression-step-desc">
            Browser WebAssembly Pyodide Studio, FastAPI Backend, RAG Pipeline, AI Labs, and Incidents.
          </p>
          <div className="progression-step-meta">
            <span>6 Interactive Systems</span>
            <span>23 Hands-on Challenges</span>
          </div>
        </button>

        <div className="progression-arrow" aria-hidden="true">
          <ArrowRight size={18} />
        </div>

        <button
          type="button"
          className={`progression-step-card ${activeTier === 3 ? 'active-tier' : ''}`}
          onClick={() => setTab('interview')}
        >
          <div className="progression-step-header">
            <span className="phase-pill">PHASE 3</span>
            <span className="phase-status-pill ready-status">
              {masteredIds.size} / 68 Q&As Mastered
            </span>
          </div>
          <div className="progression-step-title">
            <Award size={16} />
            <span>Technical Interview & Verification</span>
          </div>
          <p className="progression-step-desc">
            68 interview questions, 3D flip card active recall, 30-min timed screen, and tricky gotchas.
          </p>
          <div className="progression-step-meta">
            <span>4 Verification Engines</span>
            <span>68 Q&As · 10 Gotchas</span>
          </div>
        </button>
      </section>

      {/* Grouped Navigation Tabs */}
      <nav className="python-nav-tabs-grouped" aria-label="Python Track Sections">
        {/* Tier 1 Group */}
        <div className={`nav-tier-group ${activeTier === 1 ? 'is-active-tier' : ''}`}>
          <div className="nav-tier-header">
            <span className="tier-tag">TIER 1</span>
            <span className="tier-title">Foundations & Mental Models</span>
          </div>
          <div className="tier-buttons">
            <button
              type="button"
              className={`python-tab-btn ${tab === 'curriculum' ? 'active' : ''}`}
              onClick={() => setTab('curriculum')}
            >
              <Workflow size={15} />
              Stages & Roadmap
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'toy-vs-prod' ? 'active' : ''}`}
              onClick={() => setTab('toy-vs-prod')}
            >
              <Zap size={15} />
              Day 1: Toy vs Production
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'topics' ? 'active' : ''}`}
              onClick={() => setTab('topics')}
            >
              <BookOpen size={15} />
              18 Concept Deep Dives
            </button>
          </div>
        </div>

        {/* Tier 2 Group */}
        <div className={`nav-tier-group ${activeTier === 2 ? 'is-active-tier' : ''}`}>
          <div className="nav-tier-header">
            <span className="tier-tag">TIER 2</span>
            <span className="tier-title">Production Systems & Applied Labs</span>
          </div>
          <div className="tier-buttons">
            <button
              type="button"
              className={`python-tab-btn ${tab === 'studio' ? 'active' : ''}`}
              onClick={() => setTab('studio')}
            >
              <Terminal size={15} />
              Code & Exam Studio
              <span className="tab-badge badge-blue">{PYTHON_EXAMS.length}</span>
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'fastapi' ? 'active' : ''}`}
              onClick={() => setTab('fastapi')}
            >
              <Zap size={15} />
              ⚡ FastAPI Backend
              <span className="tab-badge badge-purple">{FASTAPI_LABS.length}</span>
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'rag' ? 'active' : ''}`}
              onClick={() => setTab('rag')}
            >
              <Brain size={15} />
              🧠 Production RAG
              <span className="tab-badge badge-emerald">{RAG_LABS.length}</span>
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'ai-labs' ? 'active' : ''}`}
              onClick={() => setTab('ai-labs')}
            >
              <Bot size={15} />
              🤖 AI-FDE Labs
              <span className="tab-badge badge-cyan">{AI_FDE_LABS.length}</span>
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'incidents' ? 'active' : ''}`}
              onClick={() => setTab('incidents')}
            >
              <AlertTriangle size={15} />
              🚨 On-Call Incidents
              <span className="tab-badge badge-rose">{PRODUCTION_INCIDENTS.length}</span>
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'starter-kit' ? 'active' : ''}`}
              onClick={() => setTab('starter-kit')}
            >
              <Boxes size={15} />
              📦 Microservice Template
            </button>
          </div>
        </div>

        {/* Tier 3 Group */}
        <div className={`nav-tier-group ${activeTier === 3 ? 'is-active-tier' : ''}`}>
          <div className="nav-tier-header">
            <span className="tier-tag">TIER 3</span>
            <span className="tier-title">Technical Interview & Verification</span>
          </div>
          <div className="tier-buttons">
            <button
              type="button"
              className={`python-tab-btn ${tab === 'interview' ? 'active' : ''}`}
              onClick={() => setTab('interview')}
            >
              <Award size={15} />
              68 Interview Q&A Engine
              <span className="tab-badge badge-gold">{PYTHON_INTERVIEW_QUESTIONS.length}</span>
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setTab('flashcards')}
            >
              <Timer size={15} />
              🎴 Flashcards & Mock Screen
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'quiz' ? 'active' : ''}`}
              onClick={() => setTab('quiz')}
            >
              <HelpCircle size={15} />
              Tricky Gotchas Quiz
              <span className="tab-badge badge-amber">{PYTHON_QUIZ_QUESTIONS.length}</span>
            </button>
            <button
              type="button"
              className={`python-tab-btn ${tab === 'lab' ? 'active' : ''}`}
              onClick={() => setTab('lab')}
            >
              <Code2 size={15} />
              Production Project Lab
            </button>
          </div>
        </div>
      </nav>

      {/* TAB 1: CURRICULUM STAGES */}
      {tab === 'curriculum' && (
        <section className="python-tab-pane">
          <div className="section-intro">
            <h2>The 4 Progressive Python Mastery Stages</h2>
            <p className="muted">
              Move deliberately from absolute beginner execution fundamentals to architecting
              resilient, multi-worker Python microservices.
            </p>
          </div>

          <div className="stages-grid">
            {PYTHON_STAGES.map((stage) => (
              <div key={stage.id} className="stage-card">
                <div className="stage-header">
                  <span className="stage-badge">{stage.eyebrow}</span>
                  <h3>{stage.title}</h3>
                </div>
                <p className="stage-desc">{stage.description}</p>
                {stage.topicIds.length > 0 ? (
                  <div className="stage-topics-list">
                    <h4>Covered Topics:</h4>
                    <ul>
                      {stage.topicIds.map((tid) => {
                        const t = PYTHON_TOPICS.find((item) => item.id === tid);
                        if (!t) return null;
                        return (
                          <li key={t.id}>
                            <button
                              type="button"
                              className="topic-link-btn"
                              onClick={() => {
                                setTab('topics');
                                setExpandedTopicId(t.id);
                              }}
                            >
                              <span className="topic-num">#{t.number}</span>
                              <span className="topic-name">{t.title}</span>
                              <span className="topic-duration">{t.duration}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="stage-capstone-box">
                    <p>
                      <strong>Capstone Architecture:</strong> Build a production async microservice
                      with Pydantic v2 validation, retry exponential backoff with jitter, structured
                      JSON logging, and 100% pytest coverage.
                    </p>
                    <button
                      type="button"
                      className="button primary small"
                      onClick={() => setTab('lab')}
                    >
                      <Code2 size={14} /> Open Production Lab
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {renderNextStepBanner(
            'toy-vs-prod',
            'Day 1: Toy vs Production',
            'See why tutorial code breaks in real production systems and modern astral tooling (uv, ruff, pydantic, pytest)',
          )}
        </section>
      )}

      {/* TAB 2: DAY 1 TOY VS PRODUCTION */}
      {tab === 'toy-vs-prod' && (
        <section className="python-tab-pane">
          <div className="section-intro">
            <h2>From Day 1: Why Tutorial Code Breaks in Production</h2>
            <p className="muted">
              Most people learn Python from toy tutorials, then freeze when seeing a real production
              codebase. Here is the modern production standard (inspired by Datalumina and modern
              astral tooling: uv, ruff, pydantic, and pytest).
            </p>
          </div>

          {/* Modern Tooling Banner */}
          <div className="modern-tooling-banner">
            <div className="tooling-header">
              <span className="tooling-badge">THE 2025/2026 MODERN PYTHON TOOLCHAIN</span>
              <h3>No More Slow Pip & Fragmented Configs</h3>
              <p>
                Production Python in 2025+ runs on <strong>uv</strong> (10-30x faster package
                management and instant virtual environments in Rust) and <strong>Ruff</strong> (sub-10ms
                linting, formatting, and import sorting).
              </p>
            </div>
            <div className="tooling-grid">
              <div className="tool-card">
                <h4>⚡ uv (by Astral)</h4>
                <p>Replaces pip, virtualenv, and poetry. Creates virtual environments instantly.</p>
                <code>uv venv && uv pip install -r pyproject.toml</code>
              </div>
              <div className="tool-card">
                <h4>🛡️ Ruff (by Astral)</h4>
                <p>Replaces black, flake8, and isort in a single lightning-fast binary.</p>
                <code>uv run ruff check --fix && uv run ruff format</code>
              </div>
              <div className="tool-card">
                <h4>📦 pyproject.toml</h4>
                <p>Modern declarative single-file project metadata (PEP 621). Replaces setup.py.</p>
                <code>[project] dependencies = ["pydantic", "httpx"]</code>
              </div>
              <div className="tool-card">
                <h4>🧪 pytest</h4>
                <p>Industry standard for fixtures, parametrization, and async test suites.</p>
                <code>uv run pytest tests/ -v</code>
              </div>
            </div>
          </div>

          <div className="comparisons-list">
            {TOY_VS_PROD_COMPARISONS.map((comp, idx) => (
              <article key={idx} className="comparison-card">
                <header className="comp-card-header">
                  <span className="comp-category">{comp.category}</span>
                  <h3>{comp.title}</h3>
                </header>

                <div className="comp-grid">
                  <div className="comp-side toy">
                    <div className="side-title">
                      <span className="side-icon toy-icon">✗</span>
                      <span>{comp.toyTitle}</span>
                    </div>
                    <pre className="code-pre">
                      <code>{comp.toyCode}</code>
                    </pre>
                    <p className="pitfall-text">
                      <strong>Why it breaks in production:</strong> {comp.toyPitfall}
                    </p>
                  </div>

                  <div className="comp-side prod">
                    <div className="side-title">
                      <span className="side-icon prod-icon">✓</span>
                      <span>{comp.prodTitle}</span>
                    </div>
                    <pre className="code-pre">
                      <code>{comp.prodCode}</code>
                    </pre>
                    <p className="advantage-text">
                      <strong>Production advantage:</strong> {comp.prodAdvantage}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {renderNextStepBanner(
            'topics',
            '18 Concept Deep Dives',
            'Master CPython internals, memory layout, dunder protocols, cooperative MRO & OOP, and asyncio',
          )}
        </section>
      )}

      {/* TAB 3: TOPICS DEEP DIVE */}
      {tab === 'topics' && (
        <section className="python-tab-pane">
          <div className="pane-filter-bar">
            <div className="filter-group">
              <span className="filter-label">Level:</span>
              <button
                type="button"
                className={`filter-chip ${difficultyFilter === 'all' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('all')}
              >
                All (18)
              </button>
              <button
                type="button"
                className={`filter-chip ${difficultyFilter === 'beginner' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('beginner')}
              >
                Beginner (6)
              </button>
              <button
                type="button"
                className={`filter-chip ${difficultyFilter === 'intermediate' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('intermediate')}
              >
                Intermediate (6)
              </button>
              <button
                type="button"
                className={`filter-chip ${difficultyFilter === 'advanced' ? 'active' : ''}`}
                onClick={() => setDifficultyFilter('advanced')}
              >
                Advanced (6)
              </button>
            </div>
          </div>

          <div className="topics-accordion">
            {filteredTopics.map((topic) => {
              const isExpanded = expandedTopicId === topic.id;
              return (
                <article
                  key={topic.id}
                  className={`topic-accordion-item ${isExpanded ? 'expanded' : ''}`}
                >
                  <header
                    className="topic-accordion-header"
                    onClick={() => setExpandedTopicId(isExpanded ? '' : topic.id)}
                  >
                    <div className="topic-header-title">
                      <span className="topic-pill">{topic.number}</span>
                      <span className={`diff-pill ${topic.difficulty}`}>{topic.difficulty}</span>
                      <h3>{topic.title}</h3>
                    </div>
                    <div className="topic-header-meta">
                      <span className="duration-tag">{topic.duration}</span>
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </header>

                  {isExpanded && (
                    <div className="topic-accordion-body">
                      <div className="topic-summary-box">
                        <p className="topic-summary">{topic.summary}</p>
                      </div>

                      <div className="topic-details-grid">
                        <div className="topic-callout mental-model">
                          <h4>
                            <Lightbulb size={16} /> Mental Model
                          </h4>
                          <p>{topic.mentalModel}</p>
                        </div>
                        <div className="topic-callout why-matters">
                          <h4>
                            <Flame size={16} /> Why It Matters in Production
                          </h4>
                          <p>{topic.whyItMatters}</p>
                        </div>
                      </div>

                      <div className="code-block-wrapper">
                        <div className="code-block-header">
                          <span className="code-lang">python</span>
                          <button
                            type="button"
                            className="copy-btn"
                            onClick={() => copyCode(topic.codeExample, topic.id)}
                          >
                            {copiedCodeId === topic.id ? (
                              <>
                                <Check size={14} /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={14} /> Copy snippet
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="code-pre">
                          <code>{topic.codeExample}</code>
                        </pre>
                      </div>

                      <div className="topic-pitfalls-box">
                        <h4>
                          <HelpCircle size={16} /> Common AI & Candidate Pitfalls
                        </h4>
                        <ul>
                          {topic.commonAiPitfalls.map((pitfall, i) => (
                            <li key={i}>{pitfall}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="topic-checklist-box">
                        <h4>
                          <CheckCircle2 size={16} /> Human Verification Checklist
                        </h4>
                        <ul>
                          {topic.verificationChecklist.map((check, i) => (
                            <li key={i}>{check}</li>
                          ))}
                        </ul>
                      </div>

                      {topic.relatedQuestions.length > 0 && (
                        <div className="related-questions-bar">
                          <span className="related-label">Related Interview Q&As:</span>
                          {topic.relatedQuestions.map((qNum) => (
                            <button
                              key={qNum}
                              type="button"
                              className="related-q-chip"
                              onClick={() => {
                                setTab('interview');
                                setSearchQuery(`q${qNum}`);
                                setExpandedQuestionId(`py-q${qNum}`);
                              }}
                            >
                              Q{qNum}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {renderNextStepBanner(
            'studio',
            'Code & Exam Studio',
            'Write code and take 6 automated production exams in WebAssembly Pyodide',
          )}
        </section>
      )}

      {/* TAB 4: CODE & EXAM STUDIO */}
      {tab === 'studio' && (
        <section className="python-tab-pane">
          <div className="section-intro">
            <h2>Interactive Python Code & Exam Studio</h2>
            <p className="muted">
              Write production Python code, test it in an isolated Pyodide WebAssembly runtime, and
              prove readiness with automated production test suites.
            </p>
          </div>
          <PythonCodeStudio
            onExamCleared={() => {
              setPassedExams(loadExamProgress());
            }}
          />
          {renderNextStepBanner(
            'fastapi',
            '⚡ FastAPI Backend',
            'Build production microservices: lifespans, DI Depends, Pydantic schemas, and RFC 7807',
          )}
        </section>
      )}

      {/* TAB 5: FASTAPI PRODUCTION BACKEND */}
      {tab === 'fastapi' && (
        <section className="python-tab-pane">
          <PythonFastApiStudio
            onLabCleared={() => {
              setClearedFastApi(loadFastApiProgress());
            }}
          />
          {renderNextStepBanner(
            'rag',
            '🧠 Production RAG',
            'Build production retrieval-augmented generation: sliding chunking, cosine ranking, and guards',
          )}
        </section>
      )}

      {/* TAB 6: PRODUCTION RAG ARCHITECTURE */}
      {tab === 'rag' && (
        <section className="python-tab-pane">
          <PythonRagStudio
            onLabCleared={() => {
              setClearedRag(loadRagProgress());
            }}
          />
          {renderNextStepBanner(
            'ai-labs',
            '🤖 AI-FDE Labs',
            'Master token counting, tool dispatchers, SSE event streams, and eval benchmarks',
          )}
        </section>
      )}

      {/* TAB 7: AI-FDE PRODUCTION LABS */}
      {tab === 'ai-labs' && (
        <section className="python-tab-pane">
          <PythonAiLabsStudio
            onLabCleared={() => {
              setClearedAiLabs(loadAiLabProgress());
            }}
          />
          {renderNextStepBanner(
            'incidents',
            '🚨 On-Call Incidents',
            'Simulate senior firefighting: memory leaks, GIL locks, race conditions, and pool exhaustion',
          )}
        </section>
      )}

      {/* TAB 8: ON-CALL INCIDENTS */}
      {tab === 'incidents' && (
        <section className="python-tab-pane">
          <PythonIncidentsSimulator
            onIncidentResolved={() => {
              setResolvedIncidents(loadIncidentProgress());
            }}
          />
          {renderNextStepBanner(
            'starter-kit',
            '📦 Microservice Template',
            'Inspect standard production repository scaffolding with uv, ruff, mypy, and Docker',
          )}
        </section>
      )}

      {/* TAB 9: MICROSERVICE STARTER KIT */}
      {tab === 'starter-kit' && (
        <section className="python-tab-pane">
          <PythonStarterKitView />
          {renderNextStepBanner(
            'interview',
            '68 Interview Q&A Engine',
            'Master all 68 interview questions categorized by difficulty and tags',
          )}
        </section>
      )}

      {/* TAB 3: 68 INTERVIEW QUESTIONS ENGINE */}
      {tab === 'interview' && (
        <section className="python-tab-pane">
          <div className="interview-controls">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search questions, keywords (e.g. GIL, dunder, async), or number (e.g. q5)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="filter-row">
              <div className="level-chips">
                <span className="filter-title">Difficulty:</span>
                <button
                  type="button"
                  className={`filter-chip ${difficultyFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setDifficultyFilter('all')}
                >
                  All (68)
                </button>
                <button
                  type="button"
                  className={`filter-chip ${difficultyFilter === 'beginner' ? 'active' : ''}`}
                  onClick={() => setDifficultyFilter('beginner')}
                >
                  Basic (Q1–Q29)
                </button>
                <button
                  type="button"
                  className={`filter-chip ${difficultyFilter === 'intermediate' ? 'active' : ''}`}
                  onClick={() => setDifficultyFilter('intermediate')}
                >
                  Intermediate (Q30–Q51)
                </button>
                <button
                  type="button"
                  className={`filter-chip ${difficultyFilter === 'advanced' ? 'active' : ''}`}
                  onClick={() => setDifficultyFilter('advanced')}
                >
                  Advanced (Q52–Q68)
                </button>
              </div>

              {selectedTag && (
                <div className="active-tag-indicator">
                  <span>
                    Tag: <strong>#{selectedTag}</strong>
                  </span>
                  <button
                    type="button"
                    className="tag-clear-btn"
                    onClick={() => setSelectedTag('')}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Popular tags row */}
            <div className="tags-cloud">
              <span className="tags-label">Filter by Tag:</span>
              {[
                'internals',
                'pvm',
                'memory',
                'mutability',
                'oop',
                'mro',
                'dunder',
                'decorators',
                'generators',
                'gil',
                'concurrency',
                'async',
                'walrus',
                'pattern-matching',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-chip ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="questions-counter-bar">
            <span>
              Showing <strong>{filteredQuestions.length}</strong> of 68 questions
            </span>
            <span>
              Mastered: <strong>{masteredIds.size}</strong> / 68 ({masteredPercentage}%)
            </span>
          </div>

          <div className="questions-list">
            {filteredQuestions.length === 0 ? (
              <div className="empty-search-state">
                <Search size={32} />
                <p>No interview questions matched your query or filter.</p>
                <button
                  type="button"
                  className="button light small"
                  onClick={() => {
                    setSearchQuery('');
                    setDifficultyFilter('all');
                    setSelectedTag('');
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isExpanded = expandedQuestionId === q.id;
                const isMastered = masteredIds.has(q.number);

                return (
                  <article
                    key={q.id}
                    className={`question-card ${isExpanded ? 'expanded' : ''} ${isMastered ? 'mastered' : ''}`}
                  >
                    <header
                      className="question-card-header"
                      onClick={() => setExpandedQuestionId(isExpanded ? '' : q.id)}
                    >
                      <div className="q-left-area">
                        <label
                          className="mastered-checkbox-label"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isMastered}
                            onChange={() => toggleMastered(q.number)}
                          />
                          <span className="custom-check-box">
                            {isMastered && <Check size={14} />}
                          </span>
                        </label>
                        <span className="q-number-pill">Q{q.number}</span>
                        <span className={`diff-pill ${q.difficulty}`}>{q.difficulty}</span>
                        <h3 className="q-title">{q.question}</h3>
                      </div>
                      <div className="q-right-area">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>
                    </header>

                    {isExpanded && (
                      <div className="question-card-body">
                        <div className="pro-tip-box">
                          <span className="pro-tip-icon">
                            <Sparkles size={16} />
                          </span>
                          <div className="pro-tip-content">
                            <strong>What Senior Interviewers Look For:</strong>
                            <p>{q.interviewerNote}</p>
                          </div>
                        </div>

                        <div className="answer-text">
                          <p>{q.explanation}</p>
                        </div>

                        {q.code && (
                          <div className="code-block-wrapper">
                            <div className="code-block-header">
                              <span className="code-lang">python</span>
                              <button
                                type="button"
                                className="copy-btn"
                                onClick={() => copyCode(q.code!, q.id)}
                              >
                                {copiedCodeId === q.id ? (
                                  <>
                                    <Check size={14} /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy size={14} /> Copy snippet
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="code-pre">
                              <code>{q.code}</code>
                            </pre>
                          </div>
                        )}

                        <div className="q-tags-footer">
                          <span className="footer-label">Tags:</span>
                          {q.tags.map((t) => (
                            <button
                              key={t}
                              type="button"
                              className="footer-tag-chip"
                              onClick={() => setSelectedTag(t)}
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          {renderNextStepBanner(
            'flashcards',
            '🎴 Flashcards & Mock Screen',
            'Test active recall with 3D flip flashcards and 30-min timed technical interview screen',
          )}
        </section>
      )}

      {/* TAB 11: FLASHCARDS & TIMED MOCK SCREEN */}
      {tab === 'flashcards' && (
        <section className="python-tab-pane">
          <PythonFlashcards />
          {renderNextStepBanner(
            'quiz',
            'Tricky Gotchas Quiz',
            'Test your mental model against 10 common CPython runtime traps',
          )}
        </section>
      )}

      {/* TAB 12: GOTCHA QUIZZES */}
      {tab === 'quiz' && (
        <section className="python-tab-pane">
          <div className="section-intro">
            <h2>10 High-Yield Python Tricky Gotchas</h2>
            <p className="muted">
              Test your mental model against the most common interview traps and subtle runtime bugs
              in Python.
            </p>
          </div>

          <div className="quiz-score-header">
            <div>
              <h3>
                Score: {quizScore} / {PYTHON_QUIZ_QUESTIONS.length}
              </h3>
              <p className="muted">
                {quizSubmitted
                  ? quizScore >= 8
                    ? '🎉 Excellent! You have strong command of Python runtime mechanics.'
                    : 'Good practice. Review the explanations below to solidify edge-case behaviors.'
                  : `Answer all 10 questions to see your verified score.`}
              </p>
            </div>
            <div className="quiz-actions">
              {!quizSubmitted ? (
                <button
                  type="button"
                  className="button primary small"
                  disabled={Object.keys(quizAnswers).length < PYTHON_QUIZ_QUESTIONS.length}
                  onClick={() => setQuizSubmitted(true)}
                >
                  <CheckCircle2 size={16} /> Submit & Check All
                </button>
              ) : (
                <button
                  type="button"
                  className="button light small"
                  onClick={handleResetQuiz}
                >
                  <RotateCcw size={16} /> Retake Quiz
                </button>
              )}
            </div>
          </div>

          <div className="quiz-list">
            {PYTHON_QUIZ_QUESTIONS.map((q, idx) => {
              const selectedIdx = quizAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = isAnswered && selectedIdx === q.correctIndex;

              return (
                <article key={q.id} className="quiz-card">
                  <header className="quiz-card-header">
                    <span className="quiz-index">Question #{idx + 1}</span>
                    <span className={`diff-pill ${q.difficulty}`}>{q.difficulty}</span>
                    <span className="gotcha-tag">{q.gotchaConcept}</span>
                  </header>

                  <div className="quiz-question-text">
                    <pre>
                      <code>{q.question}</code>
                    </pre>
                  </div>

                  <div className="quiz-options">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      let optionClass = 'quiz-option';
                      if (isChosen) optionClass += ' selected';
                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) optionClass += ' correct';
                        else if (isChosen) optionClass += ' incorrect';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={optionClass}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                        >
                          <span className="option-marker">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="option-text">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`quiz-explanation-box ${isCorrect ? 'box-correct' : 'box-incorrect'}`}
                    >
                      <p className="explanation-title">
                        {isCorrect ? '✓ Correct Answer' : '✗ Incorrect'}
                      </p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {renderNextStepBanner(
            'lab',
            'Production Project Lab',
            'Capstone production architecture principles and complete AI-Native SDLC transition',
          )}
        </section>
      )}

      {/* TAB 13: PRODUCTION LAB */}
      {tab === 'lab' && (
        <section className="python-tab-pane">
          <div className="section-intro">
            <h2>Production AI-Native Python Service Architecture</h2>
            <p className="muted">
              How modern engineering teams build production-grade, maintainable Python backends in
              the AI era.
            </p>
          </div>

          <div className="lab-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">01</span>
                <h3>Strict Type & Schema Contracts</h3>
              </div>
              <p>
                Never pass untyped raw dictionaries across boundaries. Use Pydantic v2 schemas for
                inbound validation, serialization, and deterministic JSON schemas.
              </p>
              <pre className="pillar-code">
                <code>{`from pydantic import BaseModel, Field

class IngestEventRequest(BaseModel):
    event_id: str = Field(..., min_length=8)
    payload: dict
    timestamp: float`}</code>
              </pre>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">02</span>
                <h3>Resilient Async Networking</h3>
              </div>
              <p>
                External APIs fail. Implement exponential backoff with full jitter, connection
                pooling via <code>httpx.AsyncClient</code>, and circuit breaker protection.
              </p>
              <pre className="pillar-code">
                <code>{`# Exponential backoff with jitter
delay = min(max_delay, base * (2 ** attempt))
jitter = random.uniform(0, delay)
await asyncio.sleep(jitter)`}</code>
              </pre>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">03</span>
                <h3>Structured JSON Observability</h3>
              </div>
              <p>
                Eliminate unformatted string printing. Use <code>structlog</code> to emit structured
                JSON logs containing correlation IDs for distributed tracing.
              </p>
              <pre className="pillar-code">
                <code>{`logger.info("payment_processed",
    account_id="acc_4821",
    amount=150.00,
    trace_id="req_98af")`}</code>
              </pre>
            </div>

            <div className="pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">04</span>
                <h3>Deterministic Automated Test Suite</h3>
              </div>
              <p>
                Fast unit tests with <code>pytest</code>, clean fixtures, mocked external I/O using{' '}
                <code>unittest.mock</code>, and property-based verification.
              </p>
              <pre className="pillar-code">
                <code>{`@pytest.mark.asyncio
async def test_retry_on_network_failure(mocker):
    mocker.patch("client.fetch", side_effect=[503, 200])
    res = await service.safe_fetch()
    assert res.status_code == 200`}</code>
              </pre>
            </div>
          </div>

          <div className="lab-action-banner">
            <div>
              <h3>Ready to build your complete project?</h3>
              <p>
                Follow the 8-sprint production blueprint to implement your own AI-assisted backend
                service.
              </p>
            </div>
            <a className="button primary" href="#/production">
              <Layers size={16} /> Open Production Blueprint
            </a>
          </div>

          {/* All Track Modules Completed Banner */}
          <div className="next-learning-step-banner track-completed-banner">
            <div className="next-step-copy">
              <span className="next-step-badge completed">🎉 All 13 Python Modules Completed</span>
              <h4>You are Production-Ready for AI Systems Engineering</h4>
              <p>
                You have journeyed through Python runtime internals, production OOP & testing, FastAPI backend services, RAG pipelines, on-call firefighting, and senior technical interview readiness.
              </p>
            </div>
            <div className="next-step-actions-row">
              <a className="button primary" href="#/sdlc">
                <Workflow size={16} /> Open AI-Native SDLC Studio
              </a>
              <a className="button light" href="#/production">
                <Layers size={16} /> 8-Sprint Production Blueprint
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
