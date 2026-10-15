import { useState } from 'react';
import { ArrowRight, RotateCcw, TicketCheck } from 'lucide-react';
import { lessons, quizzes } from './data';
import { localDate, type Progress } from './state';
import { reviewLesson } from './motivation';
import { Companion, WinMoment } from './MissionUI';

export default function QuickChallenge({
  progress,
  update,
}: {
  progress: Progress;
  update: (next: Progress) => void;
}) {
  const [received, setReceived] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [reviewDay] = useState(() => (progress.warmupSolved ? reviewLesson(progress) : undefined));
  const review = reviewDay ? quizzes[reviewDay][0] : undefined;
  const options = review ? review.options : ['9', '12', '15'];
  const correct = choice !== null && (review ? choice === review.answer : choice === 0);
  const answer = (index: number) => {
    setChoice(index);
    if (review && reviewDay && index === review.answer) {
      const first = !progress.reviewWins[reviewDay];
      update({ ...progress, reviewWins: { ...progress.reviewWins, [reviewDay]: localDate() } });
      setWon(first);
    } else if (!review && index === 0 && received) {
      setWon(!progress.warmupSolved);
      if (!progress.warmupSolved) update({ ...progress, warmupSolved: true });
    }
  };
  return (
    <section
      className="quick-challenge"
      aria-label={review ? 'Memory challenge' : 'One-minute challenge'}
    >
      <div className="challenge-top">
        <span className="challenge-label">
          {review ? 'REMEMBER THIS?' : 'TRY A ONE-MINUTE CHALLENGE'}
        </span>
        <span className="challenge-reward">
          {review
            ? progress.reviewWins[reviewDay!]
              ? 'Practise again'
              : '+5 XP'
            : progress.warmupSolved
              ? 'Practise again'
              : '+10 XP'}
        </span>
      </div>
      {review ? (
        <>
          <p className="challenge-context">
            From mission {reviewDay}: {lessons[reviewDay! - 1].title}
          </p>
          <h3>{review.prompt}</h3>
        </>
      ) : (
        <>
          <div className="ticket-counter">
            <div>
              <TicketCheck size={22} />
              <span>OPEN TICKETS</span>
            </div>
            <strong key={received ? 'received' : 'start'}>{received ? 12 : 10}</strong>
            <Companion mood={correct ? 'win' : 'ready'} />
          </div>
          <p>A support team starts with 10 tickets. Two more arrive. Make the number change.</p>
          <button
            className="button challenge-action"
            disabled={received}
            onClick={() => setReceived(true)}
          >
            {received ? '2 tickets received ✓' : 'Receive 2 tickets'}
            <ArrowRight size={16} />
          </button>
          <h3>
            {received
              ? 'Now close 3 tickets. How many remain?'
              : 'Then you will close 3. Can you predict the result?'}
          </h3>
        </>
      )}
      <div className="challenge-answers" role="group" aria-label="Challenge answers">
        {options.map((label, index) => (
          <button
            key={label}
            disabled={!review && !received}
            aria-pressed={choice === index}
            className={choice === index ? (correct ? 'answer-right' : 'answer-rethink') : ''}
            onClick={() => answer(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {choice !== null && (
        <p className={`challenge-feedback ${correct ? 'correct' : ''}`} role="status">
          {correct
            ? review
              ? review.explanation
              : 'You got it: 10 + 2 − 3 = 9. You just traced a program.'
            : review
              ? 'Try another answer. Think about the rule you practised in this mission.'
              : 'Start at 12 after the new tickets arrive, then take away 3. Try again.'}
        </p>
      )}
      {correct && (
        <WinMoment
          title={
            won
              ? review
                ? 'Memory refreshed. +5 XP'
                : 'Your first small win. +10 XP'
              : 'Nice work. You traced it again.'
          }
        >
          These points are saved once. Keep your next step small.
        </WinMoment>
      )}
      <button
        className="challenge-reset"
        onClick={() => {
          setReceived(false);
          setChoice(null);
          setWon(false);
        }}
      >
        <RotateCcw size={13} />
        Try again
      </button>
    </section>
  );
}
