import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import {
  SYSTEMS_FLASHCARDS,
  SYSTEMS_QUIZ_QUESTIONS,
  loadFullStackProgress,
  saveFullStackProgress,
} from './fullstack-cs-data';
import './studio-pages.css';

type PracticeTab = 'quiz' | 'flashcards' | 'labs';

export default function PracticeHub() {
  const [tab, setTab] = useState<PracticeTab>('quiz');
  const [topicFilter, setTopicFilter] = useState('All');
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(() => loadFullStackProgress());

  const quizTopics = useMemo(() => {
    const set = new Set(SYSTEMS_QUIZ_QUESTIONS.map((q) => q.topic));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredQuestions = useMemo(
    () =>
      topicFilter === 'All'
        ? SYSTEMS_QUIZ_QUESTIONS
        : SYSTEMS_QUIZ_QUESTIONS.filter((q) => q.topic === topicFilter),
    [topicFilter],
  );

  const currentQuestion = filteredQuestions[qIndex] ?? filteredQuestions[0];
  const currentCard = SYSTEMS_FLASHCARDS[cardIndex] ?? SYSTEMS_FLASHCARDS[0];

  const answerQuestion = (optIdx: number) => {
    setSelectedOpt(optIdx);
    if (
      currentQuestion &&
      optIdx === currentQuestion.correctIndex &&
      !progress.correctQuizIds.includes(currentQuestion.id)
    ) {
      const next = {
        ...progress,
        correctQuizIds: [...progress.correctQuizIds, currentQuestion.id],
      };
      setProgress(next);
      saveFullStackProgress(next);
    }
  };

  const toggleCardKnown = () => {
    const known = progress.knownFlashcardIds.includes(currentCard.id);
    const nextIds = known
      ? progress.knownFlashcardIds.filter((id) => id !== currentCard.id)
      : [...progress.knownFlashcardIds, currentCard.id];
    const next = { ...progress, knownFlashcardIds: nextIds };
    setProgress(next);
    saveFullStackProgress(next);
  };

  return (
    <div className="studio-page">
      <header className="studio-page-head">
        <div>
          <h1>Practice Hub</h1>
          <p>
            Short, active recall beats passive reading. Drill 50 core engineering questions, flip
            through 56 concept flashcards, or open a live coding lab in your browser.
          </p>
        </div>
        <div className="studio-progress-pill">
          <CheckCircle2 size={16} color="#15803d" />
          <span>
            {progress.correctQuizIds.length} / {SYSTEMS_QUIZ_QUESTIONS.length} quizzes solved
          </span>
        </div>
      </header>

      <div className="studio-tabs" role="tablist" aria-label="Practice modes">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'quiz'}
          className={`studio-tab ${tab === 'quiz' ? 'is-active' : ''}`}
          onClick={() => setTab('quiz')}
        >
          5-Minute Quiz (50)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'flashcards'}
          className={`studio-tab ${tab === 'flashcards' ? 'is-active' : ''}`}
          onClick={() => setTab('flashcards')}
        >
          Flashcards ({SYSTEMS_FLASHCARDS.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'labs'}
          className={`studio-tab ${tab === 'labs' ? 'is-active' : ''}`}
          onClick={() => setTab('labs')}
        >
          Live Coding &amp; Bug Labs
        </button>
      </div>

      {tab === 'quiz' && currentQuestion && (
        <>
          <div className="studio-tabs" aria-label="Filter quiz by topic">
            {quizTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`studio-tab ${topicFilter === topic ? 'is-active' : ''}`}
                onClick={() => {
                  setTopicFilter(topic);
                  setQIndex(0);
                  setSelectedOpt(null);
                }}
              >
                {topic}
              </button>
            ))}
          </div>

          <section className="practice-card" aria-label="Active quiz question">
            <div className="fs-article-meta">
              <span>{currentQuestion.topic}</span>
              <span>
                Question {qIndex + 1} of {filteredQuestions.length}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.4 }}>
              {currentQuestion.question}
            </h2>
            <div className="fs-check-options">
              {currentQuestion.options.map((opt, idx) => {
                let cls = 'fs-check-opt';
                if (selectedOpt !== null) {
                  if (idx === currentQuestion.correctIndex) cls += ' is-correct';
                  else if (selectedOpt === idx) cls += ' is-wrong';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    className={cls}
                    onClick={() => answerQuestion(idx)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {selectedOpt !== null && (
              <p className="fs-check-feedback" role="status">
                <strong>
                  {selectedOpt === currentQuestion.correctIndex ? 'Correct. ' : 'Not quite. '}
                </strong>
                {currentQuestion.explanation}
              </p>
            )}
            <div className="practice-actions">
              <button
                type="button"
                className="button light"
                disabled={qIndex === 0}
                onClick={() => {
                  setQIndex((i) => Math.max(0, i - 1));
                  setSelectedOpt(null);
                }}
              >
                Previous
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  setQIndex((i) => (i + 1) % filteredQuestions.length);
                  setSelectedOpt(null);
                }}
              >
                Next question
              </button>
            </div>
          </section>
        </>
      )}

      {tab === 'flashcards' && currentCard && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            className={`practice-flashcard ${flipped ? 'is-flipped' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Flip flashcard"
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
          >
            <div className="fs-article-meta">
              <span>{currentCard.topic}</span>
              <span>
                Card {cardIndex + 1} of {SYSTEMS_FLASHCARDS.length}
              </span>
            </div>
            <div>
              <h3>{flipped ? 'Answer' : currentCard.front}</h3>
              {flipped && <p style={{ marginTop: 10 }}>{currentCard.back}</p>}
            </div>
            <span style={{ fontSize: 13, color: '#475569' }}>
              {flipped ? 'Click to see term again' : 'Click card to reveal explanation'}
            </span>
          </div>

          <div className="practice-actions">
            <button
              type="button"
              className="button light"
              onClick={() => {
                setCardIndex(
                  (i) => (i - 1 + SYSTEMS_FLASHCARDS.length) % SYSTEMS_FLASHCARDS.length,
                );
                setFlipped(false);
              }}
            >
              Previous card
            </button>
            <button type="button" className="button light" onClick={toggleCardKnown}>
              {progress.knownFlashcardIds.includes(currentCard.id)
                ? 'Marked as known'
                : 'Mark as known'}
            </button>
            <button
              type="button"
              className="button primary"
              onClick={() => {
                setCardIndex((i) => (i + 1) % SYSTEMS_FLASHCARDS.length);
                setFlipped(false);
              }}
            >
              Next card
            </button>
            <button
              type="button"
              className="button light"
              onClick={() => {
                setCardIndex(Math.floor(Math.random() * SYSTEMS_FLASHCARDS.length));
                setFlipped(false);
              }}
            >
              <RotateCcw size={14} />
              Random card
            </button>
          </div>
        </section>
      )}

      {tab === 'labs' && (
        <section className="practice-labs-grid" aria-label="Interactive coding and bug labs">
          <a className="practice-lab-link" href="#/python">
            <strong>Python &amp; FastAPI Code Studio</strong>
            <p>
              Run real Python in your browser, solve 6 production exams, and drill 68 Python
              interview questions.
            </p>
          </a>
          <a className="practice-lab-link" href="#/agentic-era">
            <strong>Catch Hidden AI Bugs (2030 Lab)</strong>
            <p>
              Audit AI-generated pull requests that pass tests yet hide security or concurrency
              flaws, and simulate cost and reliability.
            </p>
          </a>
          <a className="practice-lab-link" href="#/scenarios">
            <strong>Real-World Client Scenarios</strong>
            <p>
              Practice handling vague AI requests, production incidents, and scope creep with real
              engineering trade-offs.
            </p>
          </a>
          <a className="practice-lab-link" href="#/sdlc">
            <strong>AI-Era Workflow Studio</strong>
            <p>
              Walk through how teams write clear specs, add guardrails, verify AI output, and ship
              with safe rollbacks.
            </p>
          </a>
        </section>
      )}
    </div>
  );
}
