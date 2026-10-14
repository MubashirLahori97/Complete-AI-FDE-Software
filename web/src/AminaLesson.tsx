import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Lightbulb,
  MessageCircle,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { downloadFile } from './state';

const steps = ['Meet Amina', 'Understand the idea', 'Try it yourself', 'Remember it'];
const choices = ['The number it refers to', 'The name unreadMessages', 'Nothing can change'];
const explanations = [
  'Exactly. The name stays unreadMessages. Its value can change from 10 to 12, or from 10 to 15.',
  'The name can stay unreadMessages. It is the number connected to that name that changes. Try the first answer.',
  'We watched the number change when new messages arrived. A variable lets a program keep track of a changing value. Try again.',
];

function ShopArt() {
  return (
    <svg className="amina-shop-art" viewBox="0 0 340 200" fill="none" aria-hidden="true">
      <ellipse cx="169" cy="184" rx="139" ry="10" fill="#dce7d7" />
      <path d="M64 77h211v103H64z" fill="#fffcf2" stroke="#385c4b" strokeWidth="3" />
      <path d="M58 64h223v24H58z" fill="#edb7a1" stroke="#385c4b" strokeWidth="3" />
      <path
        d="M59 65 74 42h191l15 23"
        fill="#ddebb9"
        stroke="#385c4b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M104 42 97 65m47-23-2 23m46-23 2 23m46-23 7 23" stroke="#385c4b" strokeWidth="3" />
      <rect x="101" y="13" width="136" height="30" rx="7" fill="#385c4b" />
      <text
        x="169"
        y="34"
        textAnchor="middle"
        fill="#fffcf2"
        fontSize="15"
        fontFamily="DM Sans, sans-serif"
        fontWeight="600"
      >
        AMINA’S SHOP
      </text>
      <rect
        x="82"
        y="106"
        width="93"
        height="55"
        rx="4"
        fill="#e7efe5"
        stroke="#385c4b"
        strokeWidth="3"
      />
      <path d="M129 107v53m-45-27h89" stroke="#385c4b" strokeWidth="2" />
      <rect
        x="194"
        y="105"
        width="56"
        height="75"
        rx="4"
        fill="#efceb8"
        stroke="#385c4b"
        strokeWidth="3"
      />
      <rect
        x="204"
        y="117"
        width="36"
        height="33"
        rx="2"
        fill="#fffcf2"
        stroke="#385c4b"
        strokeWidth="2"
      />
      <circle cx="238" cy="161" r="3" fill="#385c4b" />
      <path
        d="M44 178v-25m0 11c-17-2-17-18-17-18 17-1 19 18 19 18m-1-7c13-3 14-18 14-18-17 2-16 18-16 18"
        stroke="#628167"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M30 173h27l-5 13H35z" fill="#edb7a1" stroke="#385c4b" strokeWidth="2" />
      <rect
        x="284"
        y="139"
        width="29"
        height="42"
        rx="3"
        fill="#ddebb9"
        stroke="#385c4b"
        strokeWidth="2"
      />
      <path d="M291 153h15m-15 8h11" stroke="#385c4b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CounterFile(amount: number) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Amina's message counter</title>
<style>body{font:18px/1.6 system-ui,sans-serif;background:#fff9ed;color:#263d31;margin:0;padding:24px}main{max-width:520px;margin:60px auto;background:white;padding:32px;border-radius:20px;border:1px solid #cdd9c8}h1{font-size:28px}label{display:block}input,button{font:inherit;padding:12px;border-radius:8px;border:1px solid #628167}input{width:90px;margin:8px 12px 8px 0}button{background:#254b3e;color:white;cursor:pointer}output{display:block;font-size:32px;margin-top:24px}p{margin:12px 0}</style></head>
<body><main><h1>Amina's message counter</h1><p>This practice counter starts with 10 unread messages each time you run it.</p>
<form id="counter"><label for="arriving">How many new messages arrive? (0–20)</label><input id="arriving" type="number" min="0" max="20" step="1" value="${amount}" required><button>Run my counter</button></form>
<output id="total" aria-live="polite">10 unread messages</output><p id="explanation">Change the input and see how the value changes.</p>
<details><summary>See the JavaScript instructions</summary><pre>let unreadMessages = 10;
unreadMessages = unreadMessages + newMessages;
console.log(unreadMessages);</pre><p>newMessages is the number you enter. unreadMessages refers to the updated count.</p></details></main>
<script>document.getElementById('counter').addEventListener('submit',function(event){event.preventDefault();const newMessages=Number(document.getElementById('arriving').value);if(!Number.isInteger(newMessages)||newMessages<0||newMessages>20)return;let unreadMessages=10;unreadMessages=unreadMessages+newMessages;document.getElementById('total').textContent=unreadMessages+' unread messages';document.getElementById('explanation').textContent='10 + '+newMessages+' = '+unreadMessages;});</script></body></html>`;
}

export default function AminaLesson() {
  const [step, setStep] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [amount, setAmount] = useState('2');
  const [prediction, setPrediction] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [taskPassed, setTaskPassed] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, finished]);
  const restart = () => {
    setStep(0);
    setArrived(false);
    setAmount('2');
    setPrediction('');
    setResult(null);
    setFeedback('');
    setTaskPassed(false);
    setAnswer(null);
    setFinished(false);
  };
  const runCounter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMessages = Number(amount);
    if (!amount.trim() || !Number.isInteger(newMessages) || newMessages < 0 || newMessages > 20) {
      setFeedback('Enter a whole number from 0 to 20. For this task, five new messages arrive.');
      setResult(null);
      setTaskPassed(false);
      return;
    }
    if (!prediction.trim() || !/^\d+$/.test(prediction.trim())) {
      setFeedback(
        'Make a guess first: what will the total be? Write a whole number in the second box.',
      );
      setResult(null);
      setTaskPassed(false);
      return;
    }
    const total = 10 + newMessages;
    setResult(total);
    const correct = newMessages === 5 && Number(prediction) === total;
    setTaskPassed(correct);
    setFeedback(
      newMessages !== 5
        ? `Your counter added ${newMessages}, so it shows ${total}. Amina received five new messages. Change the first box to 5 and try again.`
        : !correct
          ? `The counter shows 15: start at 10, then add 5. Your guess was ${prediction}. Update your guess and run it again.`
          : 'You predicted 15, and your counter shows 15. You changed an input and checked the result. That is how we test a small program.',
    );
  };
  const edit = (field: 'amount' | 'prediction', value: string) => {
    if (field === 'amount') setAmount(value);
    else setPrediction(value);
    setResult(null);
    setFeedback('');
    setTaskPassed(false);
  };
  return (
    <div className="amina-page">
      <header className="amina-header">
        <a href="#/" className="amina-brand">
          <span className="amina-brand-mark">
            <MessageCircle size={22} aria-hidden="true" />
          </span>
          FDE academy<span className="amina-sample-tag">Sample lesson</span>
        </a>
        <a href="#/" className="amina-course-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to the course
        </a>
      </header>
      <main className="amina-main">
        <div className="amina-progress">
          <span>{finished ? 'You finished this sample' : `Step ${step + 1} of 4`}</span>
          <span>{finished ? 'One idea learned' : steps[step]}</span>
          <div
            className="amina-progress-track"
            role="progressbar"
            aria-label="Sample lesson progress"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={finished ? 4 : step}
          >
            {steps.map((name, index) => (
              <span
                key={name}
                className={index < step || finished ? 'done' : index === step ? 'current' : ''}
              />
            ))}
          </div>
        </div>
        {step === 0 && (
          <section className="amina-card amina-story-card">
            <p className="amina-kicker">A small story. One new idea.</p>
            <h1 ref={heading} tabIndex={-1}>
              Amina needs a hand.
            </h1>
            <p className="amina-intro">
              Amina runs a small shop. Let’s help her count the customer messages she has not read.
            </p>
            <div className="amina-scene">
              <ShopArt />
              <div className="amina-speech">
                <span className="amina-person" aria-hidden="true">
                  A
                </span>
                <div>
                  <strong>Amina</strong>
                  <p>“Two new messages just arrived. Add them to my count.”</p>
                </div>
              </div>
            </div>
            <div className="amina-inbox">
              <div>
                <MessageCircle size={23} aria-hidden="true" />
                <span>Unread messages</span>
              </div>
              <output aria-label="Amina’s unread message count" aria-live="polite">
                {arrived ? 12 : 10}
              </output>
              <div className="amina-message-dots" aria-hidden="true">
                {Array.from({ length: arrived ? 12 : 10 }, (_, index) => (
                  <span key={index} className={index >= 10 ? 'new' : ''} />
                ))}
              </div>
            </div>
            {!arrived ? (
              <>
                <p className="amina-instruction">First, add the two new messages.</p>
                <button className="amina-button primary" onClick={() => setArrived(true)}>
                  <Plus size={19} aria-hidden="true" />
                  Add two messages
                </button>
              </>
            ) : (
              <>
                <div className="amina-feedback success" role="status">
                  <CheckCircle2 size={20} aria-hidden="true" />
                  <p>
                    <strong>10 + 2 = 12.</strong> The count changed. You just told the computer to
                    update a number.
                  </p>
                </div>
                <button className="amina-button primary" onClick={() => setStep(1)}>
                  What did the computer remember?
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
                <button className="amina-text-button" onClick={() => setArrived(false)}>
                  Try that again
                </button>
              </>
            )}
            <p className="amina-reassurance">No installation needed. Take your time.</p>
          </section>
        )}
        {step === 1 && (
          <section className="amina-card">
            <p className="amina-kicker">Give the idea a name</p>
            <h1 ref={heading} tabIndex={-1}>
              A name for a changing number.
            </h1>
            <p className="amina-intro">
              The computer needs a way to refer to Amina’s message count. We give that number a
              name: <code>unreadMessages</code>.
            </p>
            <div className="amina-variable">
              <span className="amina-variable-label">Name</span>
              <code>unreadMessages</code>
              <ArrowRight size={22} aria-hidden="true" />
              <div>
                <span className="amina-variable-label">Current value</span>
                <strong>12</strong>
              </div>
            </div>
            <div className="amina-definition">
              <Lightbulb size={22} aria-hidden="true" />
              <div>
                <h2>This is a variable.</h2>
                <p>
                  A <strong>variable</strong> is a name a program uses to keep track of a value. A{' '}
                  <strong>value</strong> is the information it refers to. Here, the value is a
                  number.
                </p>
              </div>
            </div>
            <p>
              The name stays <code>unreadMessages</code>. When new messages arrive, the value can
              change from <strong>10</strong> to <strong>12</strong>.
            </p>
            <p>
              You already understand the idea: <strong>keep the name, update the number.</strong>
            </p>
            <details className="amina-details">
              <summary>Show me what this looks like in code</summary>
              <div className="amina-code-explained">
                <p>
                  These are JavaScript instructions. JavaScript is one language we can use to tell a
                  computer what to do.
                </p>
                <ol>
                  <li>
                    <code>let unreadMessages = 10;</code>
                    <p>
                      Start with 10. The word <code>let</code> creates the variable. Here,{' '}
                      <code>=</code> means “store this value under this name.”
                    </p>
                  </li>
                  <li>
                    <code>unreadMessages = unreadMessages + 2;</code>
                    <p>
                      Read the old value (10), add 2, and store the result (12) under the same name.
                      This is an update, not an equation you have to solve.
                    </p>
                  </li>
                  <li>
                    <code>console.log(unreadMessages);</code>
                    <p>
                      Show the current value in the program’s text output: 12. The button in our
                      story showed that value on the page instead.
                    </p>
                  </li>
                </ol>
                <p>
                  You do not need to memorise the punctuation today. Follow what each instruction
                  does.
                </p>
              </div>
            </details>
            <button className="amina-button primary" onClick={() => setStep(2)}>
              Let me try it
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </section>
        )}
        {step === 2 && (
          <section className="amina-card">
            <p className="amina-kicker">Your small project</p>
            <h1 ref={heading} tabIndex={-1}>
              Make Amina a message counter.
            </h1>
            <p className="amina-intro">
              Start again with <strong>10 unread messages</strong>. This time,{' '}
              <strong>five new messages</strong> arrive. Change the first box from 2 to 5, predict
              the total, then run your counter.
            </p>
            <form className="amina-counter-form" onSubmit={runCounter} noValidate>
              <div className="amina-starting-count">
                <span>Starting count</span>
                <strong>10</strong>
                <small>Every run starts here.</small>
              </div>
              <div className="amina-field">
                <label htmlFor="amina-new">How many new messages arrive?</label>
                <input
                  id="amina-new"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="20"
                  step="1"
                  value={amount}
                  onChange={(event) => edit('amount', event.target.value)}
                  aria-describedby="amina-new-help"
                />
                <p id="amina-new-help">For Amina’s task, enter 5.</p>
              </div>
              <div className="amina-field">
                <label htmlFor="amina-guess">What will the total be?</label>
                <input
                  id="amina-guess"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="30"
                  step="1"
                  placeholder="Your guess"
                  value={prediction}
                  onChange={(event) => edit('prediction', event.target.value)}
                  aria-describedby="amina-guess-help"
                />
                <p id="amina-guess-help">Think: 10 plus the new messages.</p>
              </div>
              <button className="amina-button primary" type="submit">
                Run my counter
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
            {feedback && (
              <div
                className={`amina-feedback ${taskPassed ? 'success' : 'try-again'}`}
                role="status"
              >
                {taskPassed ? (
                  <CheckCircle2 size={20} aria-hidden="true" />
                ) : (
                  <Lightbulb size={20} aria-hidden="true" />
                )}
                <div>
                  {result !== null && (
                    <div className="amina-result">
                      <strong aria-label="Your counter result">{result}</strong>
                      <span>unread messages</span>
                      <small>
                        10 + {amount} = {result}
                      </small>
                    </div>
                  )}
                  <p>{feedback}</p>
                </div>
              </div>
            )}
            <details className="amina-details">
              <summary>I need a hint</summary>
              <p>
                Start at 10. Count five more: 11, 12, 13, 14, 15. Put <strong>5</strong> in the
                first box and your predicted total in the second.
              </p>
            </details>
            {taskPassed && (
              <button className="amina-button primary" onClick={() => setStep(3)}>
                I did it. What should I remember?
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}
          </section>
        )}
        {step === 3 && (
          <section className="amina-card">
            <p className="amina-kicker">
              {finished ? 'A small win worth keeping' : 'One quick check'}
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {finished ? 'You helped Amina.' : 'What changed?'}
            </h1>
            {!finished ? (
              <>
                <p className="amina-intro">
                  Your counter went from 10 to 15 unread messages. The variable was named{' '}
                  <code>unreadMessages</code> before and after.
                </p>
                <fieldset className="amina-quiz">
                  <legend>When new messages arrive, what changes?</legend>
                  {choices.map((choice, index) => (
                    <button
                      type="button"
                      key={choice}
                      className={answer === index ? 'selected' : ''}
                      aria-pressed={answer === index}
                      onClick={() => setAnswer(index)}
                    >
                      <span className="amina-choice-dot" aria-hidden="true">
                        {answer === index && <Check size={15} />}
                      </span>
                      {choice}
                    </button>
                  ))}
                </fieldset>
                {answer !== null && (
                  <div
                    className={`amina-feedback ${answer === 0 ? 'success' : 'try-again'}`}
                    role="status"
                  >
                    <p>{explanations[answer]}</p>
                  </div>
                )}
                {answer === 0 && (
                  <button className="amina-button primary" onClick={() => setFinished(true)}>
                    Finish my sample lesson
                    <Check size={18} aria-hidden="true" />
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="amina-finish-art" aria-hidden="true">
                  <CheckCircle2 size={45} />
                  <span>One idea learned</span>
                </div>
                <p className="amina-intro">
                  You changed a message count, predicted the result, and checked it. You can now
                  explain a <strong>variable</strong>: a name a program uses to keep track of a
                  value that can change.
                </p>
                <div className="amina-takeaway">
                  <span>The name</span>
                  <code>unreadMessages</code>
                  <span>The value after your update</span>
                  <strong>15</strong>
                </div>
                <p>
                  This is useful in real apps: counting messages, keeping score, or tracking items
                  in a basket all need values that can change.
                </p>
                <button
                  className="amina-button primary"
                  onClick={() =>
                    downloadFile(
                      'amina-message-counter.html',
                      CounterFile(Number(amount)),
                      'text/html',
                    )
                  }
                >
                  Keep my working counter
                  <Download size={18} aria-hidden="true" />
                </button>
                <p className="amina-download-help">
                  Downloads one HTML file. Open it in your browser to try other numbers, even
                  offline.
                </p>
                <div className="amina-next-note">
                  <strong>Before we build more lessons</strong>
                  <p>
                    Tell me in our chat which part felt clear and where you wanted more help. This
                    sample is here for you to try.
                  </p>
                </div>
                <button className="amina-text-button" onClick={restart}>
                  <RotateCcw size={16} aria-hidden="true" />
                  Try the lesson again
                </button>
              </>
            )}
          </section>
        )}
        {step > 0 && !finished && (
          <button className="amina-back" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back one step
          </button>
        )}
        <footer className="amina-footer">
          Amina’s shop is a practice story. Learn one idea, try one thing, take your time.
        </footer>
      </main>
    </div>
  );
}
