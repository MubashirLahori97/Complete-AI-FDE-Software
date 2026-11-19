import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
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
  type PythonTrackTab,
  type PythonConceptTopic,
  type PythonInterviewQuestion,
} from './python-track-data';
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
              <span className="stat-label">Concept Deep Dives</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">68</span>
              <span className="stat-label">Interview Q&As</span>
            </div>
            <div className="python-stat-card">
              <span className="stat-number">10</span>
              <span className="stat-label">Gotcha Quizzes</span>
            </div>
            <div className="python-stat-card highlight">
              <span className="stat-number">{masteredIds.size}/68</span>
              <span className="stat-label">Mastered ({masteredPercentage}%)</span>
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

      {/* Navigation Tabs */}
      <nav className="python-nav-tabs" aria-label="Python Track Sections">
        <button
          type="button"
          className={`python-tab-btn ${tab === 'curriculum' ? 'active' : ''}`}
          onClick={() => setTab('curriculum')}
        >
          <Workflow size={16} />
          Stages & Roadmap
        </button>
        <button
          type="button"
          className={`python-tab-btn ${tab === 'topics' ? 'active' : ''}`}
          onClick={() => setTab('topics')}
        >
          <BookOpen size={16} />
          18 Concept Deep Dives
        </button>
        <button
          type="button"
          className={`python-tab-btn ${tab === 'interview' ? 'active' : ''}`}
          onClick={() => setTab('interview')}
        >
          <Award size={16} />
          68 Interview Q&A Engine
          <span className="tab-badge">{PYTHON_INTERVIEW_QUESTIONS.length}</span>
        </button>
        <button
          type="button"
          className={`python-tab-btn ${tab === 'quiz' ? 'active' : ''}`}
          onClick={() => setTab('quiz')}
        >
          <HelpCircle size={16} />
          Tricky Gotchas Quiz
          <span className="tab-badge">{PYTHON_QUIZ_QUESTIONS.length}</span>
        </button>
        <button
          type="button"
          className={`python-tab-btn ${tab === 'lab' ? 'active' : ''}`}
          onClick={() => setTab('lab')}
        >
          <Code2 size={16} />
          Production Project Lab
        </button>
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
        </section>
      )}

      {/* TAB 2: TOPICS DEEP DIVE */}
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
        </section>
      )}

      {/* TAB 4: GOTCHA QUIZZES */}
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
        </section>
      )}

      {/* TAB 5: PRODUCTION LAB */}
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
        </section>
      )}
    </div>
  );
}
