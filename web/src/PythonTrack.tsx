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
import './python-track.css';
import './modern-toolchain.css';
import './datalumina-track.css';

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
      {/* 1. TOP HORIZONTAL NAVIGATION (MINTLIFY / DATALUMINA STYLE) */}
      <header className="datalumina-top-nav">
        <div className="datalumina-nav-brand">
          <div className="brand-python-icon">🐍</div>
          <span>Python for AI & Systems</span>
          <span className="brand-badge">2026 EDITION</span>
        </div>

        {/* 6 Horizontal Navigation Tabs */}
        <nav className="datalumina-tabs-list" aria-label="Course Sections">
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
            <span>OOP & Protocols</span>
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
            <span>Systems & Async</span>
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
            <span>Interview & Studio</span>
          </button>
        </nav>

        {/* Top Right Quick Action */}
        <div className="datalumina-top-actions">
          <button
            type="button"
            className="action-studio-btn"
            onClick={() => {
              setTopTab('interview');
              setSelectedSubItem('studio');
            }}
          >
            <Play size={13} fill="currentColor" />
            <span>Open Code Studio</span>
          </button>
        </div>
      </header>

      {/* 2. THREE-COLUMN BODY LAYOUT */}
      <div className="datalumina-body-layout">
        {/* LEFT STICKY SIDEBAR */}
        <aside className="datalumina-sidebar" aria-label="Course Table of Contents">
          {topTab === 'getting-started' && (
            <div className="sidebar-category-block">
              <span className="sidebar-category-title">MODERN TOOLING & SETUP</span>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'toolchain' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('toolchain')}
              >
                <div className="sidebar-link-left">
                  <Zap size={14} />
                  <span className="sidebar-item-label">Modern uv & Ruff Setup</span>
                </div>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'toy-vs-prod' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('toy-vs-prod')}
              >
                <div className="sidebar-link-left">
                  <Workflow size={14} />
                  <span className="sidebar-item-label">Toy vs Production Code</span>
                </div>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'starter-kit' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('starter-kit')}
              >
                <div className="sidebar-link-left">
                  <Boxes size={14} />
                  <span className="sidebar-item-label">Microservice Scaffolding</span>
                </div>
              </button>
            </div>
          )}

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
              <span className="sidebar-category-title">STAGE 3: SYSTEMS & ASYNC (TOPICS 13–18)</span>
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

          {topTab === 'backends' && (
            <div className="sidebar-category-block">
              <span className="sidebar-category-title">ENTERPRISE BACKENDS & LABS</span>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'fastapi' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('fastapi')}
              >
                <div className="sidebar-link-left">
                  <Zap size={14} />
                  <span className="sidebar-item-label">⚡ FastAPI Microservices</span>
                </div>
                <span className="sidebar-diff-badge intermediate">{FASTAPI_LABS.length} labs</span>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'rag' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('rag')}
              >
                <div className="sidebar-link-left">
                  <Brain size={14} />
                  <span className="sidebar-item-label">🧠 Production RAG Pipeline</span>
                </div>
                <span className="sidebar-diff-badge intermediate">{RAG_LABS.length} labs</span>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'ai-labs' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('ai-labs')}
              >
                <div className="sidebar-link-left">
                  <Bot size={14} />
                  <span className="sidebar-item-label">🤖 AI-FDE Labs & Evals</span>
                </div>
                <span className="sidebar-diff-badge intermediate">{AI_FDE_LABS.length} labs</span>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'incidents' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('incidents')}
              >
                <div className="sidebar-link-left">
                  <AlertTriangle size={14} />
                  <span className="sidebar-item-label">🚨 On-Call Simulator</span>
                </div>
                <span className="sidebar-diff-badge advanced">{PRODUCTION_INCIDENTS.length} cases</span>
              </button>
            </div>
          )}

          {topTab === 'interview' && (
            <div className="sidebar-category-block">
              <span className="sidebar-category-title">VERIFICATION & STUDIO</span>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'studio' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('studio')}
              >
                <div className="sidebar-link-left">
                  <Terminal size={14} />
                  <span className="sidebar-item-label">💻 Pyodide Code Studio</span>
                </div>
                <span className="sidebar-diff-badge beginner">{PYTHON_EXAMS.length} exams</span>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'qa' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('qa')}
              >
                <div className="sidebar-link-left">
                  <Award size={14} />
                  <span className="sidebar-item-label">🎯 68 Interview Q&A Engine</span>
                </div>
                <span className="sidebar-diff-badge intermediate">68 Q&A</span>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'flashcards' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('flashcards')}
              >
                <div className="sidebar-link-left">
                  <Timer size={14} />
                  <span className="sidebar-item-label">🎴 Flashcards & Mock Screen</span>
                </div>
              </button>
              <button
                type="button"
                className={`sidebar-link-btn ${selectedSubItem === 'quiz' ? 'active' : ''}`}
                onClick={() => setSelectedSubItem('quiz')}
              >
                <div className="sidebar-link-left">
                  <HelpCircle size={14} />
                  <span className="sidebar-item-label">⚠️ Tricky Gotchas Quiz</span>
                </div>
                <span className="sidebar-diff-badge advanced">10 Qs</span>
              </button>
            </div>
          )}
        </aside>

        {/* CENTER MAIN READING PANE */}
        <main className="datalumina-main-content">
          {/* TAB 1: GETTING STARTED */}
          {topTab === 'getting-started' && (
            <div>
              {selectedSubItem === 'toolchain' && (
                <div>
                  <div className="reading-breadcrumbs">
                    <span>Getting Started</span>
                    <ChevronRight size={13} />
                    <span className="active">Modern Toolchain & uv Setup</span>
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
                </div>
                <h1>{activeTopic.title}</h1>
                <p className="reading-lead">{activeTopic.summary}</p>
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
                              {idx + 1}. {q.question}
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
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="quiz-explanation-box">
                                <p>{q.explanation}</p>
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
        </main>

        {/* RIGHT STICKY TABLE OF CONTENTS (TOC) */}
        <aside className="datalumina-right-toc" aria-label="On this page">
          {(topTab === 'basics' || topTab === 'oop' || topTab === 'systems') && (
            <>
              <div>
                <span className="toc-title">ON THIS PAGE</span>
                <nav className="toc-links-list">
                  <a href="#overview" className="toc-anchor-link">
                    1. Mental Model
                  </a>
                  <a href="#why-matters" className="toc-anchor-link">
                    2. Production Impact
                  </a>
                  <a href="#code" className="toc-anchor-link">
                    3. Code Blueprint
                  </a>
                  <a href="#pitfalls" className="toc-anchor-link">
                    4. Common Traps & Fixes
                  </a>
                  <a href="#checklist" className="toc-anchor-link">
                    5. Verification Checklist
                  </a>
                </nav>
              </div>

              <div className="toc-studio-card">
                <h5>⚡ Test In Browser</h5>
                <p>Execute this blueprint in the real Pyodide WebAssembly runtime with automated tests.</p>
                <button
                  type="button"
                  className="toc-studio-btn"
                  onClick={() => {
                    setTopTab('interview');
                    setSelectedSubItem('studio');
                  }}
                >
                  <Play size={12} fill="currentColor" />
                  <span>Launch Code Studio</span>
                </button>
              </div>
            </>
          )}

          {topTab === 'getting-started' && (
            <div>
              <span className="toc-title">SECTIONS</span>
              <nav className="toc-links-list">
                <button
                  type="button"
                  className="toc-anchor-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setSelectedSubItem('toolchain')}
                >
                  ⚡ uv & Ruff Setup
                </button>
                <button
                  type="button"
                  className="toc-anchor-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setSelectedSubItem('toy-vs-prod')}
                >
                  ⚖️ Toy vs Production
                </button>
                <button
                  type="button"
                  className="toc-anchor-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setSelectedSubItem('starter-kit')}
                >
                  📦 Microservice Scaffolding
                </button>
              </nav>
            </div>
          )}

          {topTab === 'backends' && (
            <div>
              <span className="toc-title">PRODUCTION LABS</span>
              <nav className="toc-links-list">
                <button
                  type="button"
                  className="toc-anchor-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setSelectedSubItem('fastapi')}
                >
                  ⚡ FastAPI Microservices
                </button>
                <button
                  type="button"
                  className="toc-anchor-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setSelectedSubItem('rag')}
                >
                  🧠 Production RAG
                </button>
                <button
                  type="button"
                  className="toc-anchor-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setSelectedSubItem('ai-labs')}
                >
                  🤖 AI-FDE Labs
                </button>
                <button
                  type="button"
                  className="toc-anchor-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setSelectedSubItem('incidents')}
                >
                  🚨 On-Call Incidents
                </button>
              </nav>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
