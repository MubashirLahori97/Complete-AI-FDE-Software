import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Filter,
  Flame,
  HelpCircle,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  Tag,
  Timer,
  XCircle,
} from 'lucide-react';
import {
  PYTHON_INTERVIEW_QUESTIONS,
  loadMasteredQuestions,
  saveMasteredQuestions,
  type PythonDifficulty,
  type PythonInterviewQuestion,
} from './python-track-data';

export default function PythonFlashcards() {
  const [mode, setMode] = useState<'flashcards' | 'mock-screen'>('flashcards');
  const [filterDifficulty, setFilterDifficulty] = useState<PythonDifficulty | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(() => loadMasteredQuestions());

  // Mock Screen State
  const [mockQuestions, setMockQuestions] = useState<PythonInterviewQuestion[]>([]);
  const [mockActiveIndex, setMockActiveIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30 * 60); // 30 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [candidateNotes, setCandidateNotes] = useState<Record<number, string>>({});
  const [rubricScores, setRubricScores] = useState<Record<string, boolean>>({});
  const [isMockFinished, setIsMockFinished] = useState(false);

  // Filtered Flashcards
  const activeDeck = useMemo(() => {
    if (filterDifficulty === 'all') return PYTHON_INTERVIEW_QUESTIONS;
    return PYTHON_INTERVIEW_QUESTIONS.filter((q) => q.difficulty === filterDifficulty);
  }, [filterDifficulty]);

  const currentCard: PythonInterviewQuestion = activeDeck[currentIndex] || activeDeck[0];

  // Flip card
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * activeDeck.length));
  };

  const handleToggleMastered = (id: number) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveMasteredQuestions(next);
      return next;
    });
  };

  // Keyboard navigation for flashcards
  useEffect(() => {
    if (mode !== 'flashcards') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, activeDeck.length]);

  // Mock Interview Setup
  const startNewMock = () => {
    const beginners = PYTHON_INTERVIEW_QUESTIONS.filter((q) => q.difficulty === 'beginner').sort(
      () => 0.5 - Math.random(),
    );
    const intermediates = PYTHON_INTERVIEW_QUESTIONS.filter(
      (q) => q.difficulty === 'intermediate',
    ).sort(() => 0.5 - Math.random());
    const advanceds = PYTHON_INTERVIEW_QUESTIONS.filter((q) => q.difficulty === 'advanced').sort(
      () => 0.5 - Math.random(),
    );

    const picked = [
      ...beginners.slice(0, 2),
      ...intermediates.slice(0, 2),
      ...advanceds.slice(0, 1),
    ];

    setMockQuestions(picked);
    setMockActiveIndex(0);
    setTimerSeconds(30 * 60);
    setIsTimerRunning(true);
    setCandidateNotes({});
    setRubricScores({});
    setIsMockFinished(false);
  };

  // Timer Tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setIsMockFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const masteredCount = activeDeck.filter((q) => masteredIds.has(q.number)).length;
  const masteredPercentage = Math.round((masteredCount / activeDeck.length) * 100);

  return (
    <div className="flashcards-engine-container">
      {/* Mode Switcher */}
      <div className="flashcards-mode-nav">
        <button
          onClick={() => setMode('flashcards')}
          className={`mode-tab-btn ${mode === 'flashcards' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          <span>Spaced Repetition Flashcards</span>
        </button>
        <button
          onClick={() => {
            setMode('mock-screen');
            if (mockQuestions.length === 0) {
              startNewMock();
            }
          }}
          className={`mode-tab-btn ${mode === 'mock-screen' ? 'active' : ''}`}
        >
          <Timer size={16} />
          <span>30-Min Timed Technical Screen</span>
        </button>
      </div>

      {mode === 'flashcards' ? (
        /* FLASHCARD MODE */
        <div className="flashcards-view">
          {/* Deck Controls Header */}
          <div className="deck-controls-bar">
            <div className="deck-filter-group">
              <Filter size={15} />
              <button
                onClick={() => {
                  setFilterDifficulty('all');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`filter-pill ${filterDifficulty === 'all' ? 'active' : ''}`}
              >
                All (68)
              </button>
              <button
                onClick={() => {
                  setFilterDifficulty('beginner');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`filter-pill ${filterDifficulty === 'beginner' ? 'active' : ''}`}
              >
                Beginner
              </button>
              <button
                onClick={() => {
                  setFilterDifficulty('intermediate');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`filter-pill ${filterDifficulty === 'intermediate' ? 'active' : ''}`}
              >
                Intermediate
              </button>
              <button
                onClick={() => {
                  setFilterDifficulty('advanced');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`filter-pill ${filterDifficulty === 'advanced' ? 'active' : ''}`}
              >
                Advanced
              </button>
            </div>

            <div className="deck-progress-indicator">
              <span>
                Mastered: {masteredCount} / {activeDeck.length} ({masteredPercentage}%)
              </span>
              <div className="progress-track-mini">
                <div
                  className="progress-fill-mini"
                  style={{ width: `${masteredPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Flashcard Flip Area */}
          <div className="flashcard-scene" onClick={handleFlip}>
            <div className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}>
              {/* Card Front */}
              <div className="flashcard-face flashcard-front">
                <div className="card-top-bar">
                  <span className={`diff-pill ${currentCard.difficulty}`}>
                    {currentCard.difficulty}
                  </span>
                  <span className="card-number-tag">
                    #{currentCard.number} of {activeDeck.length}
                  </span>
                </div>

                <div className="card-question-box">
                  <HelpCircle size={28} className="question-icon" />
                  <h3>{currentCard.question}</h3>
                  <p className="card-summary-hint">{currentCard.summary}</p>
                </div>

                <div className="card-footer-tags">
                  <div className="tags-cluster">
                    {currentCard.tags.map((t, idx) => (
                      <span key={idx} className="tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="flip-instruction">Click card or press [Space] to flip</span>
                </div>
              </div>

              {/* Card Back */}
              <div className="flashcard-face flashcard-back">
                <div className="card-top-bar">
                  <span className="card-number-tag">Senior Engineering Answer</span>
                  <span className="flip-instruction">Click to flip front</span>
                </div>

                <div className="card-answer-box">
                  <p className="explanation-text">{currentCard.explanation}</p>

                  {currentCard.code && (
                    <div className="card-code-block">
                      <pre>
                        <code>{currentCard.code}</code>
                      </pre>
                    </div>
                  )}

                  <div className="interviewer-insight-callout">
                    <div className="callout-header">
                      <Lightbulb size={16} />
                      <span>Senior Interviewer Insight:</span>
                    </div>
                    <p>{currentCard.interviewerNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Action Toolbar */}
          <div className="flashcard-actions-bar">
            <button onClick={handlePrev} className="nav-card-btn" title="Previous (Left Arrow)">
              <ChevronLeft size={18} /> Prev
            </button>

            <button
              onClick={() => handleToggleMastered(currentCard.number)}
              className={`master-toggle-btn ${
                masteredIds.has(currentCard.number) ? 'mastered' : ''
              }`}
            >
              {masteredIds.has(currentCard.number) ? (
                <>
                  <CheckCircle2 size={16} /> Mastered
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Mark as Known
                </>
              )}
            </button>

            <button onClick={handleShuffle} className="nav-card-btn" title="Random Shuffle">
              <Shuffle size={16} /> Shuffle
            </button>

            <button onClick={handleNext} className="nav-card-btn" title="Next (Right Arrow)">
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* MOCK TECHNICAL SCREEN MODE */
        <div className="mock-screen-view">
          {/* Mock Top Banner */}
          <div className="mock-timer-banner">
            <div className="mock-title-block">
              <h3>Senior Python Technical Screen (Simulated 30-Min Loop)</h3>
              <p>5 questions selected across difficulty levels. Answer out loud or type notes.</p>
            </div>

            <div className="timer-controls">
              <div className={`countdown-clock ${timerSeconds < 300 ? 'urgent' : ''}`}>
                <Clock size={18} />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={() => setIsTimerRunning((prev) => !prev)}
                className="timer-toggle-btn"
              >
                {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
              </button>
              <button onClick={startNewMock} className="timer-reset-btn">
                <RotateCcw size={14} />
                <span>New Session</span>
              </button>
            </div>
          </div>

          {/* Mock Questions Selector Tabs */}
          <div className="mock-tabs-strip">
            {mockQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setMockActiveIndex(idx)}
                className={`mock-tab-btn ${mockActiveIndex === idx ? 'active' : ''}`}
              >
                <span>Q{idx + 1}</span>
                <span className={`diff-dot ${q.difficulty}`} />
              </button>
            ))}
          </div>

          {/* Active Question Arena */}
          {mockQuestions[mockActiveIndex] && (
            <div className="mock-question-arena">
              <div className="question-header">
                <span className={`diff-pill ${mockQuestions[mockActiveIndex].difficulty}`}>
                  {mockQuestions[mockActiveIndex].difficulty}
                </span>
                <h4>
                  Question {mockActiveIndex + 1}: {mockQuestions[mockActiveIndex].question}
                </h4>
              </div>

              <div className="mock-split-grid">
                {/* Left: Candidate Notes & Verbal Practice */}
                <div className="mock-candidate-panel">
                  <div className="panel-header">
                    <Code2 size={16} />
                    <span>Your Talking Points / Code Solution:</span>
                  </div>
                  <textarea
                    value={candidateNotes[mockActiveIndex] || ''}
                    onChange={(e) =>
                      setCandidateNotes((prev) => ({
                        ...prev,
                        [mockActiveIndex]: e.target.value,
                      }))
                    }
                    placeholder="Type key concepts to hit: (e.g. Memory layout, GIL implications, Big-O time complexity, Python 3.12 syntax...)"
                    className="candidate-notes-area"
                    rows={12}
                  />

                  {/* Rubric Checklist */}
                  <div className="rubric-checklist">
                    <h5>Interviewer Rubric Checkpoints:</h5>
                    <label className="rubric-item">
                      <input
                        type="checkbox"
                        checked={Boolean(rubricScores[`q${mockActiveIndex}-core`])}
                        onChange={(e) =>
                          setRubricScores((prev) => ({
                            ...prev,
                            [`q${mockActiveIndex}-core`]: e.target.checked,
                          }))
                        }
                      />
                      <span>Clearly defined internal mechanism (not just surface API)</span>
                    </label>
                    <label className="rubric-item">
                      <input
                        type="checkbox"
                        checked={Boolean(rubricScores[`q${mockActiveIndex}-perf`])}
                        onChange={(e) =>
                          setRubricScores((prev) => ({
                            ...prev,
                            [`q${mockActiveIndex}-perf`]: e.target.checked,
                          }))
                        }
                      />
                      <span>Addressed performance / memory trade-offs (Time & Space)</span>
                    </label>
                    <label className="rubric-item">
                      <input
                        type="checkbox"
                        checked={Boolean(rubricScores[`q${mockActiveIndex}-prod`])}
                        onChange={(e) =>
                          setRubricScores((prev) => ({
                            ...prev,
                            [`q${mockActiveIndex}-prod`]: e.target.checked,
                          }))
                        }
                      />
                      <span>Highlighted production gotchas or concurrency caveats</span>
                    </label>
                  </div>
                </div>

                {/* Right: Golden Model Answer & Senior Tip */}
                <div className="mock-reference-panel">
                  <div className="panel-header">
                    <Sparkles size={16} />
                    <span>Reference Answer & Evaluation Criteria:</span>
                  </div>
                  <div className="reference-content">
                    <p className="reference-explanation">
                      {mockQuestions[mockActiveIndex].explanation}
                    </p>

                    {mockQuestions[mockActiveIndex].code && (
                      <pre className="reference-code">
                        <code>{mockQuestions[mockActiveIndex].code}</code>
                      </pre>
                    )}

                    <div className="interviewer-tip-card">
                      <Lightbulb size={16} />
                      <div>
                        <strong>What Strong Candidates Say:</strong>
                        <p>{mockQuestions[mockActiveIndex].interviewerNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation between mock questions */}
              <div className="mock-footer-nav">
                <button
                  disabled={mockActiveIndex === 0}
                  onClick={() => setMockActiveIndex((prev) => Math.max(0, prev - 1))}
                  className="mock-nav-btn"
                >
                  <ChevronLeft size={16} /> Previous Question
                </button>

                {mockActiveIndex < mockQuestions.length - 1 ? (
                  <button
                    onClick={() => setMockActiveIndex((prev) => prev + 1)}
                    className="mock-nav-btn primary"
                  >
                    Next Question <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setIsMockFinished(true);
                    }}
                    className="mock-nav-btn finish"
                  >
                    <Award size={16} /> Complete Technical Screen
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Finished Screen Modal / Summary */}
          {isMockFinished && (
            <div className="mock-finished-card">
              <Award size={36} className="finish-icon" />
              <h4>Technical Screen Complete!</h4>
              <p>
                You completed all 5 mock interview questions. Check off your rubric points above to
                identify any weak spots before live engineering interviews.
              </p>
              <button onClick={startNewMock} className="studio-btn primary">
                Start Another Mock Screen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
