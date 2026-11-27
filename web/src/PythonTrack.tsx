import { useMemo, useState, type ReactNode } from 'react';

function renderInlineCode(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
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
  Cpu,
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
  getAllQuestionTags,
  getTopicsByDifficulty,
  loadMasteredQuestions,
  saveMasteredQuestions,
  loadQuizAnswers,
  saveQuizAnswers,
  searchInterviewQuestions,
  type PythonDifficulty,
  type PythonConceptTopic,
  type PythonInterviewQuestion,
} from './python-track-data';
import PythonCodeStudio from './PythonCodeStudio';
import PythonIncidentsSimulator from './PythonIncidentsSimulator';
import PythonAiLabsStudio from './PythonAiLabsStudio';
import PythonFastApiStudio from './PythonFastApiStudio';
import PythonRagStudio from './PythonRagStudio';
import PythonStarterKitView from './PythonStarterKitView';
import PythonFlashcards from './PythonFlashcards';
import ModernToolchainExplorer from './ModernToolchainExplorer';
import CommonPitfallsAccordion from './CommonPitfallsAccordion';
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
import { HalfLifeBadge, PageHeading } from './ui';
import './python-track.css';
import './modern-toolchain.css';
import './datalumina-track.css';
import './agentic-era.css';

export type DataluminaTopTab =
  | 'getting-started'
  | 'basics'
  | 'oop'
  | 'systems'
  | 'backends'
  | 'interview';

export default function PythonTrack({ progress }: { progress?: Progress }) {
  // Navigation State
  const [topTab, setTopTab] = useState<DataluminaTopTab>('getting-started');
  const [selectedSubItem, setSelectedSubItem] = useState<string>('toolchain');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-1');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Search & Filters for Interview engine
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<PythonDifficulty | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string>('py-q1');

  // Persistence State
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

  // Topic Lookup
  const activeTopic = useMemo(() => {
    return PYTHON_TOPICS.find((t) => t.id === selectedTopicId) || PYTHON_TOPICS[0];
  }, [selectedTopicId]);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

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
    PYTHON_QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  }, [quizAnswers]);

  // Topic Navigation helpers
  const currentTopicIndex = PYTHON_TOPICS.findIndex((t) => t.id === activeTopic.id);
  const prevTopic = currentTopicIndex > 0 ? PYTHON_TOPICS[currentTopicIndex - 1] : null;
  const nextTopic =
    currentTopicIndex < PYTHON_TOPICS.length - 1 ? PYTHON_TOPICS[currentTopicIndex + 1] : null;

  const navigateToTopic = (t: PythonConceptTopic) => {
    setSelectedTopicId(t.id);
    if (t.number <= 6) setTopTab('basics');
    else if (t.number <= 12) setTopTab('oop');
    else setTopTab('systems');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="datalumina-wrapper">
      <div className="courses-hub-bar" role="navigation" aria-label="Course tracks">
        <strong style={{ fontSize: 14 }}>Course tracks</strong>
        <div className="courses-hub-links">
          <a className="courses-hub-link" href="#/curriculum">
            Build with AI (30 lessons)
          </a>
          <a className="courses-hub-link" href="#/fullstack">
            Full-Stack &amp; CS Foundations
          </a>
          <a className="courses-hub-link is-active" href="#/python">
            Python &amp; FastAPI
          </a>
          <a className="courses-hub-link" href="#/agentic-era">
            AI-Era Lab
          </a>
        </div>
      </div>

      <PageHeading
        title="Python & FastAPI Studio"
        description="Learn modern Python, OOP, async systems, and production FastAPI—and run real Python tests directly in your browser."
        action={
          <button
            type="button"
            className="button primary"
            onClick={() => {
              setTopTab('interview');
              setSelectedSubItem('studio');
            }}
          >
            <Play size={15} fill="currentColor" />
            Open Code Studio
          </button>
        }
      />

      {/* 1. UNIFIED SECTION TABS */}
      <nav className="python-unified-tabs" aria-label="Course Sections">
        <button
          type="button"
          className={`datalumina-tab-item ${topTab === 'getting-started' ? 'active' : ''}`}
          onClick={() => {
            setTopTab('getting-started');
            setSelectedSubItem('toolchain');
          }}
        >
          <Zap size={14} />
          <span>Getting Started</span>
        </button>

        <button
          type="button"
          className={`datalumina-tab-item ${topTab === 'basics' ? 'active' : ''}`}
          onClick={() => {
            setTopTab('basics');
            setSelectedTopicId('topic-1');
          }}
        >
          <BookOpen size={14} />
          <span>Python Basics</span>
        </button>

        <button
          type="button"
          className={`datalumina-tab-item ${topTab === 'oop' ? 'active' : ''}`}
          onClick={() => {
            setTopTab('oop');
            setSelectedTopicId('topic-7');
          }}
        >
          <Layers size={14} />
          <span>OOP &amp; Protocols</span>
        </button>

        <button
          type="button"
          className={`datalumina-tab-item ${topTab === 'systems' ? 'active' : ''}`}
          onClick={() => {
            setTopTab('systems');
            setSelectedTopicId('topic-13');
          }}
        >
          <Cpu size={14} />
          <span>Systems &amp; Async</span>
        </button>

        <button
          type="button"
          className={`datalumina-tab-item ${topTab === 'backends' ? 'active' : ''}`}
          onClick={() => {
            setTopTab('backends');
            setSelectedSubItem('fastapi');
          }}
        >
          <Terminal size={14} />
          <span>Production Backends</span>
        </button>

        <button
          type="button"
          className={`datalumina-tab-item ${topTab === 'interview' ? 'active' : ''}`}
          onClick={() => {
            setTopTab('interview');
            setSelectedSubItem('studio');
          }}
        >
          <Award size={14} />
          <span>Interview &amp; Studio</span>
        </button>
      </nav>

      {/* 2. WORKSPACE LAYOUT (2-col for Topic Reader; Full-Width + Horizontal Sub-Pills for Studios) */}
      {(topTab === 'getting-started' || topTab === 'backends' || topTab === 'interview') && (
        <div className="python-sub-pills" role="tablist" aria-label="Module selector">
          {topTab === 'getting-started' && (
            <>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'toolchain' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('toolchain')}
              >
                <Zap size={14} /> Modern uv &amp; Ruff Setup
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'toy-vs-prod' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('toy-vs-prod')}
              >
                <Workflow size={14} /> Toy vs Production Code
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'starter-kit' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('starter-kit')}
              >
                <Boxes size={14} /> Microservice Scaffolding
              </button>
            </>
          )}
          {topTab === 'backends' && (
            <>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'fastapi' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('fastapi')}
              >
                <Zap size={14} /> FastAPI Microservices ({FASTAPI_LABS.length})
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'rag' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('rag')}
              >
                <Brain size={14} /> Production RAG ({RAG_LABS.length})
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'ai-labs' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('ai-labs')}
              >
                <Bot size={14} /> AI-FDE Labs ({AI_FDE_LABS.length})
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'incidents' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('incidents')}
              >
                <AlertTriangle size={14} /> On-Call Simulator ({PRODUCTION_INCIDENTS.length})
              </button>
            </>
          )}
          {topTab === 'interview' && (
            <>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'studio' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('studio')}
              >
                <Terminal size={14} /> Pyodide Code Studio ({PYTHON_EXAMS.length} exams)
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'qa' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('qa')}
              >
                <Award size={14} /> 68 Interview Q&amp;As
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'flashcards' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('flashcards')}
              >
                <Timer size={14} /> Flashcards &amp; Mock Screen
              </button>
              <button
                type="button"
                className={`python-sub-pill ${selectedSubItem === 'quiz' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('quiz')}
              >
                <HelpCircle size={14} /> Tricky Gotchas Quiz (10)
              </button>
            </>
          )}
        </div>
      )}

      <div
        className={`datalumina-body-layout ${
          topTab === 'getting-started' || topTab === 'backends' || topTab === 'interview'
            ? 'is-full-width'
            : ''
        }`}
      >
        {(topTab === 'basics' || topTab === 'oop' || topTab === 'systems') && (
          <aside className="datalumina-sidebar" aria-label="Course Table of Contents">

          {topTab === 'basics' && (
            <div className="sidebar-category-block">
              <span className="sidebar-category-title">STAGE 1: FOUNDATIONS (TOPICS 1–6)</span>
              {PYTHON_TOPICS.slice(0, 6).map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`sidebar-link-btn ${selectedTopicId === topic.id ? 'active' : ''}`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <div className="sidebar-link-left">
                    <span className="sidebar-item-num">#{topic.number}</span>
                    <span className="sidebar-item-label">{topic.title.split(':')[0]}</span>
                  </div>
                  <span className={`sidebar-diff-badge ${topic.difficulty}`}>
                    {topic.duration.split(' ')[0]}m
                  </span>
                </button>
              ))}
            </div>
          )}

          {topTab === 'oop' && (
            <div className="sidebar-category-block">
              <span className="sidebar-category-title">STAGE 2: OOP & PROTOCOLS (TOPICS 7–12)</span>
              {PYTHON_TOPICS.slice(6, 12).map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`sidebar-link-btn ${selectedTopicId === topic.id ? 'active' : ''}`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <div className="sidebar-link-left">
                    <span className="sidebar-item-num">#{topic.number}</span>
                    <span className="sidebar-item-label">{topic.title.split(':')[0]}</span>
                  </div>
                  <span className={`sidebar-diff-badge ${topic.difficulty}`}>
                    {topic.duration.split(' ')[0]}m
                  </span>
                </button>
              ))}
            </div>
          )}

          {topTab === 'systems' && (
            <div className="sidebar-category-block">
              <span className="sidebar-category-title">STAGE 3: SYSTEMS &amp; ASYNC (TOPICS 13–18)</span>
              {PYTHON_TOPICS.slice(12, 18).map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`sidebar-link-btn ${selectedTopicId === topic.id ? 'active' : ''}`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <div className="sidebar-link-left">
                    <span className="sidebar-item-num">#{topic.number}</span>
                    <span className="sidebar-item-label">{topic.title.split(':')[0]}</span>
                  </div>
                  <span className={`sidebar-diff-badge ${topic.difficulty}`}>
                    {topic.duration.split(' ')[0]}m
                  </span>
                </button>
              ))}
            </div>
          )}
          </aside>
        )}

        {/* CENTER MAIN READING PANE */}
        <div className="datalumina-main-content">
          {/* TAB 1: GETTING STARTED */}
          {topTab === 'getting-started' && (
            <div>
              {selectedSubItem === 'toolchain' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Getting Started</span>
                    <ChevronRight size={13} />
                    <span className="active">Modern Toolchain &amp; uv Setup</span>
                  </div>
                  <div className="datalumina-callout note" style={{ marginTop: 0 }}>
                    <Sparkles size={19} className="callout-icon" />
                    <div className="callout-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="callout-title">2028–2030 X-Ray Vision Mode</span>
                        <HalfLifeBadge tier="law" />
                        <HalfLifeBadge tier="tool" />
                      </div>
                      <p>
                        You are not studying Python to out-type AI agents—you are building{' '}
                        <strong>X-Ray Runtime Vision</strong> (memory, concurrency, event loops,
                        ACID locks) so you can spot subtle bugs in AI-generated code in seconds.
                        CLI tools like <code>uv</code> and <code>ruff</code> are swappable adapters;
                        runtime physics lasts 20+ years.
                      </p>
                    </div>
                  </div>
                  <ModernToolchainExplorer />
                </div>
              )}

              {selectedSubItem === 'toy-vs-prod' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Getting Started</span>
                    <ChevronRight size={13} />
                    <span className="active">Toy vs Production Code</span>
                  </div>
                  <div className="reading-header">
                    <span className="tag-badge badge-stage">PRODUCTION PARADIGM SHIFT</span>
                    <h1>Why Tutorial Code Breaks in Real Production Systems</h1>
                    <p className="reading-lead">
                      Most developers learn Python through flat scripts and loose dictionaries. In enterprise software,
                      untyped code causes silent runtime crashes, security breaches, and unobservable failures.
                    </p>
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
                </div>
              )}

              {selectedSubItem === 'starter-kit' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Getting Started</span>
                    <ChevronRight size={13} />
                    <span className="active">Microservice Template Scaffolding</span>
                  </div>
                  <PythonStarterKitView />
                </div>
              )}
            </div>
          )}

          {/* TABS 2, 3, 4: EDITORIAL LESSON READER FOR TOPICS (1–18) */}
          {(topTab === 'basics' || topTab === 'oop' || topTab === 'systems') && (
            <article className="datalumina-lesson-doc">
              <nav className="reading-breadcrumbs" aria-label="Breadcrumbs">
                <span>{activeTopic.stage}</span>
                <ChevronRight size={13} />
                <span className="active">Topic #{activeTopic.number}</span>
              </nav>

              <header className="reading-header">
                <div className="reading-header-tags">
                  <span className="tag-badge badge-stage">{activeTopic.stage.split(':')[0]}</span>
                  <span className={`sidebar-diff-badge ${activeTopic.difficulty}`}>
                    {activeTopic.difficulty}
                  </span>
                  <span className="tag-badge badge-duration">{activeTopic.duration}</span>
                  <HalfLifeBadge tier={activeTopic.number === 18 ? 'pattern' : 'law'} />
                </div>
                <h1>{activeTopic.title}</h1>
                <p className="reading-lead">{activeTopic.summary}</p>
                <nav className="inline-toc-strip" aria-label="On this page">
                  <a href="#overview">1. Mental Model</a>
                  <a href="#why-matters">2. Production Impact</a>
                  <a href="#code">3. Code Blueprint</a>
                  <a href="#pitfalls">4. Common Traps</a>
                  <a href="#checklist">5. Checklist</a>
                </nav>
              </header>

              {/* 1. MENTAL MODEL ADMONITION */}
              <div id="overview" className="datalumina-callout tip">
                <Lightbulb size={20} className="callout-icon" />
                <div className="callout-body">
                  <span className="callout-title">Core Mental Model</span>
                  <p>{activeTopic.mentalModel}</p>
                </div>
              </div>

              {/* 2. WHY IT MATTERS IN PRODUCTION */}
              <div id="why-matters" className="datalumina-callout note">
                <Flame size={20} className="callout-icon" />
                <div className="callout-body">
                  <span className="callout-title">Why It Matters in Production</span>
                  <p>{activeTopic.whyItMatters}</p>
                </div>
              </div>

              {/* 3. SYNTAX-HIGHLIGHTED CODE BLOCK */}
              <section id="code" className="reading-code-block">
                <div className="code-header-bar">
                  <span className="code-lang-label">Python 3.12+ Blueprint</span>
                  <button
                    type="button"
                    className="code-copy-btn"
                    onClick={() => copyCode(activeTopic.codeExample, activeTopic.id)}
                  >
                    {copiedCodeId === activeTopic.id ? (
                      <>
                        <Check size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="code-pre-block">
                  <code>{activeTopic.codeExample}</code>
                </pre>
              </section>

              {/* 4. COLLAPSIBLE COMMON PITFALLS ACCORDION */}
              <section id="pitfalls">
                <CommonPitfallsAccordion
                  topicId={activeTopic.id}
                  pitfalls={activeTopic.commonAiPitfalls}
                />
              </section>

              {/* 5. HUMAN VERIFICATION CHECKLIST */}
              <section id="checklist" className="reading-checklist-box">
                <h4>
                  <CheckCircle2 size={16} /> Human Verification Checklist
                </h4>
                <ul>
                  {activeTopic.verificationChecklist.map((check, i) => (
                    <li key={i}>{check}</li>
                  ))}
                </ul>
              </section>

              {/* Related Questions Bar */}
              {activeTopic.relatedQuestions.length > 0 && (
                <div className="related-questions-bar">
                  <span className="related-label">Related Interview Q&As:</span>
                  {activeTopic.relatedQuestions.map((qNum) => (
                    <button
                      key={qNum}
                      type="button"
                      className="related-q-chip"
                      onClick={() => {
                        setTopTab('interview');
                        setSelectedSubItem('qa');
                        setSearchQuery(`q${qNum}`);
                        setExpandedQuestionId(`py-q${qNum}`);
                      }}
                    >
                      Q{qNum}
                    </button>
                  ))}
                </div>
              )}

              {/* 6. PAGINATION FOOTER CARDS (PREV / NEXT TOPIC) */}
              <nav className="datalumina-pagination-grid" aria-label="Pagination">
                {prevTopic ? (
                  <button
                    type="button"
                    className="pagination-nav-card prev"
                    onClick={() => navigateToTopic(prevTopic)}
                  >
                    <span className="pagination-label">
                      <ArrowLeft size={13} /> Previous Topic
                    </span>
                    <span className="pagination-title">
                      #{prevTopic.number}. {prevTopic.title.split(':')[0]}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {nextTopic && (
                  <button
                    type="button"
                    className="pagination-nav-card next"
                    onClick={() => navigateToTopic(nextTopic)}
                  >
                    <span className="pagination-label">
                      Next Topic <ArrowRight size={13} />
                    </span>
                    <span className="pagination-title">
                      #{nextTopic.number}. {nextTopic.title.split(':')[0]}
                    </span>
                  </button>
                )}
              </nav>
            </article>
          )}

          {/* TAB 5: PRODUCTION BACKENDS & LABS */}
          {topTab === 'backends' && (
            <div>
              {selectedSubItem === 'fastapi' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Production Backends</span>
                    <ChevronRight size={13} />
                    <span className="active">⚡ FastAPI Microservices</span>
                  </div>
                  <PythonFastApiStudio />
                </div>
              )}
              {selectedSubItem === 'rag' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Production Backends</span>
                    <ChevronRight size={13} />
                    <span className="active">🧠 Production RAG Pipeline</span>
                  </div>
                  <PythonRagStudio />
                </div>
              )}
              {selectedSubItem === 'ai-labs' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Production Backends</span>
                    <ChevronRight size={13} />
                    <span className="active">🤖 AI-FDE Labs & Dispatchers</span>
                  </div>
                  <PythonAiLabsStudio />
                </div>
              )}
              {selectedSubItem === 'incidents' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Production Backends</span>
                    <ChevronRight size={13} />
                    <span className="active">🚨 On-Call Incident Simulator</span>
                  </div>
                  <PythonIncidentsSimulator />
                </div>
              )}
            </div>
          )}

          {/* TAB 6: INTERVIEW & STUDIO */}
          {topTab === 'interview' && (
            <div>
              {selectedSubItem === 'studio' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Verification & Studio</span>
                    <ChevronRight size={13} />
                    <span className="active">💻 In-Browser Pyodide Code Studio</span>
                  </div>
                  <PythonCodeStudio />
                </div>
              )}

              {selectedSubItem === 'qa' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Verification & Studio</span>
                    <ChevronRight size={13} />
                    <span className="active">🎯 68 GeeksforGeeks Interview Questions</span>
                  </div>

                  <div className="interview-controls">
                    <div className="search-bar">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search interview questions (e.g. 'GIL', 'generator', 'q63')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          className="clear-search"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="filter-row">
                      <div className="filter-group">
                        <span className="filter-label">Difficulty:</span>
                        <button
                          type="button"
                          className={`filter-chip ${difficultyFilter === 'all' ? 'active' : ''}`}
                          onClick={() => setDifficultyFilter('all')}
                        >
                          All ({PYTHON_INTERVIEW_QUESTIONS.length})
                        </button>
                        <button
                          type="button"
                          className={`filter-chip ${difficultyFilter === 'beginner' ? 'active' : ''}`}
                          onClick={() => setDifficultyFilter('beginner')}
                        >
                          Beginner (28)
                        </button>
                        <button
                          type="button"
                          className={`filter-chip ${difficultyFilter === 'intermediate' ? 'active' : ''}`}
                          onClick={() => setDifficultyFilter('intermediate')}
                        >
                          Intermediate (22)
                        </button>
                        <button
                          type="button"
                          className={`filter-chip ${difficultyFilter === 'advanced' ? 'active' : ''}`}
                          onClick={() => setDifficultyFilter('advanced')}
                        >
                          Advanced (18)
                        </button>
                        <button
                          type="button"
                          className={`filter-chip ${selectedTag === 'gil' || selectedTag === 'async' || selectedTag === 'internals' ? 'active' : ''}`}
                          onClick={() => {
                            setDifficultyFilter('advanced');
                            setSearchQuery('');
                          }}
                          title="Focus on concurrency, memory, GIL, and async questions that catch real AI-generated production bugs"
                        >
                          🛡️ High-Signal for AI PR Review
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="interview-questions-list">
                    {filteredQuestions.map((q) => {
                      const isExpanded = expandedQuestionId === q.id;
                      const isMastered = masteredIds.has(q.number);
                      return (
                        <article
                          key={q.id}
                          className={`question-item ${isExpanded ? 'expanded' : ''} ${isMastered ? 'mastered' : ''}`}
                        >
                          <header
                            className="question-header"
                            onClick={() => setExpandedQuestionId(isExpanded ? '' : q.id)}
                          >
                            <div className="q-left">
                              <span className="q-number">#{q.number}</span>
                              <span className={`diff-pill ${q.difficulty}`}>{q.difficulty}</span>
                              <h4>{q.question}</h4>
                            </div>
                            <div className="q-right">
                              <button
                                type="button"
                                className={`mastered-btn ${isMastered ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMastered(q.number);
                                }}
                              >
                                {isMastered ? (
                                  <>
                                    <CheckCircle2 size={16} /> Mastered
                                  </>
                                ) : (
                                  <>Mark Mastered</>
                                )}
                              </button>
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>
                          </header>

                          {isExpanded && (
                            <div className="question-body">
                              <p className="q-summary">{q.summary}</p>
                              <div className="q-explanation">
                                <h5>Detailed Explanation:</h5>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{q.explanation}</p>
                              </div>

                              {q.code && (
                                <div className="code-block-wrapper">
                                  <pre className="code-pre">
                                    <code>{q.code}</code>
                                  </pre>
                                </div>
                              )}

                              <div className="interviewer-note">
                                <strong>What Senior Interviewers Look For:</strong>
                                <p>{q.interviewerNote}</p>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedSubItem === 'flashcards' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Verification & Studio</span>
                    <ChevronRight size={13} />
                    <span className="active">🎴 Flashcards & Mock Screen</span>
                  </div>
                  <PythonFlashcards />
                </div>
              )}

              {selectedSubItem === 'quiz' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Verification & Studio</span>
                    <ChevronRight size={13} />
                    <span className="active">⚠️ 10 Tricky Runtime Gotchas Quiz</span>
                  </div>

                  <div className="quiz-container">
                    <header className="quiz-header">
                      <h2>10 CPython Traps & Subtle Behavioral Gotchas</h2>
                      <p>
                        Test your mental model of Python internals: closures, mutable default arguments,
                        and garbage collection.
                      </p>
                      {quizSubmitted && (
                        <div className="quiz-score-banner">
                          <h3>
                            Score: {quizScore} / {PYTHON_QUIZ_QUESTIONS.length} Correct
                          </h3>
                          <button
                            type="button"
                            className="button light small"
                            onClick={handleResetQuiz}
                          >
                            <RotateCcw size={14} /> Retake Quiz
                          </button>
                        </div>
                      )}
                    </header>

                    <div className="quiz-questions-grid">
                      {PYTHON_QUIZ_QUESTIONS.map((q, idx) => {
                        const selectedAnswer = quizAnswers[q.id];
                        const isCorrect = selectedAnswer === q.correctIndex;
                        return (
                          <div key={q.id} className="quiz-card">
                            <span className="quiz-cat-badge">{q.gotchaConcept}</span>
                            <h4>
                              {idx + 1}. {renderInlineCode(q.question)}
                            </h4>
                            <div className="quiz-options-list">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswer === optIdx;
                                let optClass = 'quiz-opt-btn';
                                if (isSelected) optClass += ' selected';
                                if (quizSubmitted) {
                                  if (optIdx === q.correctIndex) optClass += ' correct';
                                  else if (isSelected) optClass += ' wrong';
                                }
                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    className={optClass}
                                    onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                  >
                                    <span className="opt-letter">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span>{renderInlineCode(opt)}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="quiz-explanation-box">
                                <p>{renderInlineCode(q.explanation)}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!quizSubmitted && (
                      <div className="quiz-submit-bar">
                        <button
                          type="button"
                          className="button primary"
                          onClick={() => setQuizSubmitted(true)}
                        >
                          Submit Quiz & Check Gotcha Explanations
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
