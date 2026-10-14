import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, MessageCircle, Plus, RotateCcw, Store } from 'lucide-react';
import { downloadFile } from './state';

const counterFile = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Amina's message counter</title>
<style>*{box-sizing:border-box}body{font:18px/1.6 system-ui,sans-serif;background:#fff9ed;color:#263d31;margin:0;padding:20px}main{max-width:440px;margin:32px auto;background:white;padding:28px;border-radius:20px;border:1px solid #cdd9c8}h1{font-size:26px}button{font:inherit;padding:14px 20px;border:0;border-radius:12px;background:#254b3e;color:white;cursor:pointer;width:100%;margin-top:16px}output{display:block;text-align:center;font-size:64px;font-weight:600;margin:20px 0;background:#edf4e4;border-radius:16px}#reset{background:none;color:#254b3e;text-decoration:underline}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px}summary{cursor:pointer;padding:12px 0}</style></head>
<body><main><h1>Amina's message counter</h1><p>One new message arrives. Press the green button to add it.</p><output id="total" aria-label="Message count" aria-live="polite">10</output><button id="add">Add 1 message</button><button id="reset">Start again</button><details><summary>See the code</summary><pre>let messages = 10;
// Each time you press Add 1 message:
messages = messages + 1;</pre></details></main>
<script>let messages=10;const total=document.getElementById('total');document.getElementById('add').addEventListener('click',function(){messages=messages+1;total.textContent=messages;});document.getElementById('reset').addEventListener('click',function(){messages=10;total.textContent=messages;});</script></body></html>`;

export default function AminaLesson() {
  const [messages, setMessages] = useState(10);
  const phase = messages === 10 ? 'start' : messages === 11 ? 'changed' : 'explore';
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [phase]);
  const title =
    phase === 'start'
      ? 'Help Amina count.'
      : phase === 'changed'
        ? 'Now you have 11.'
        : 'Meet a variable.';
  return (
    <div className="amina-page">
      <header className="amina-header">
        <span className="amina-brand">
          <Store size={22} aria-hidden="true" />
          Amina’s shop
        </span>
        <a href="#/" className="amina-course-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Leave lesson
        </a>
      </header>
      <main className="amina-main">
        <section className="amina-card">
          <h1 ref={heading} tabIndex={-1}>
            {title}
          </h1>
          <p className="amina-story">
            {phase === 'start'
              ? 'Amina has 10 messages. One more arrives.'
              : phase === 'changed'
                ? '10 + 1 = 11.'
                : 'A variable is a name for a value that can change.'}
          </p>
          <div className="amina-counter">
            <span className="amina-counter-label">
              <MessageCircle size={21} aria-hidden="true" />
              <span>
                {phase === 'start' ? (
                  'Messages'
                ) : (
                  <>
                    Name: <code>messages</code>
                  </>
                )}
              </span>
            </span>
            <output aria-label="Message count" aria-live="polite" aria-atomic="true">
              {messages}
            </output>
            <span className="amina-value-label" aria-hidden={phase !== 'explore'}>
              {phase === 'explore' ? 'Value' : '\u00a0'}
            </span>
          </div>
          <p className="amina-instruction">
            {phase === 'start'
              ? 'Press Add 1 message.'
              : phase === 'changed'
                ? 'Press again to add 1.'
                : 'You can keep adding messages.'}
          </p>
          <button className="amina-button" onClick={() => setMessages((count) => count + 1)}>
            <Plus size={22} aria-hidden="true" />
            Add 1 message
          </button>
          {phase === 'explore' && (
            <p className="amina-remember">That’s the whole lesson.</p>
          )}
        </section>
        {phase === 'explore' && (
          <div className="amina-after-lesson">
            <button
              className="amina-reset"
              onClick={() => {
                setMessages(10);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Start again
            </button>
            <details className="amina-details">
              <summary>More, when you’re ready</summary>
              <div>
                <p>This is your small project: a message counter.</p>
                <button
                  className="amina-download"
                  onClick={() =>
                    downloadFile('amina-message-counter.html', counterFile, 'text/html')
                  }
                >
                  <Download size={17} aria-hidden="true" />
                  Download my counter
                </button>
                <p className="amina-small">
                  Open the downloaded file in your browser to use it offline.
                </p>
                <details className="amina-code">
                  <summary>Show me the code</summary>
                  <p>JavaScript is a language for giving a computer instructions.</p>
                  <pre>
                    <code>{'let messages = 10;\nmessages = messages + 1;'}</code>
                  </pre>
                  <p>
                    The first line starts the number at 10. The second adds 1 and keeps the new
                    number under the same name.
                  </p>
                  <p>The green button repeats the second line each time you press it.</p>
                </details>
              </div>
            </details>
          </div>
        )}
        <p className="amina-footer">One button. Take your time.</p>
      </main>
    </div>
  );
}
