import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
type User = { username: string; role: "staff" | "customer"; csrf: string };
type Saved = { id: number; text: string };
type Citation = { id: string; version: number; text: string };
type Answer = {
  mode: string;
  answer: string;
  citations: Citation[];
  request_id: string;
};
class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
async function api(path: string, options: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch("/api" + path, {
      ...options,
      credentials: "same-origin",
    });
  } catch {
    throw new RequestError(
      0,
      "Connection lost. Your draft is kept. The save outcome may be unknown; retry uses the same action key.",
    );
  }
  if (!response.ok)
    throw new RequestError(
      response.status,
      response.status === 401
        ? "Sign in again. Your draft is kept."
        : response.status === 422
          ? "Check the fields and limits."
          : response.status === 429
            ? "Request limit reached. Try again in the next budget window."
            : "The service could not complete this action.",
    );
  if (response.status === 204) return null;
  return (await response.json()) as unknown;
}
function asUser(value: unknown): User {
  if (
    !record(value) ||
    typeof value.username !== "string" ||
    !["staff", "customer"].includes(String(value.role)) ||
    typeof value.csrf !== "string"
  )
    throw new Error("Invalid sign-in response");
  return value as User;
}
function asMessages(value: unknown): Saved[] {
  if (
    !record(value) ||
    !Array.isArray(value.messages) ||
    !value.messages.every(
      (item) =>
        record(item) &&
        Number.isInteger(item.id) &&
        typeof item.text === "string",
    )
  )
    throw new Error("Invalid message response");
  return value.messages as Saved[];
}
function asAnswer(value: unknown): Answer {
  if (
    !record(value) ||
    typeof value.mode !== "string" ||
    typeof value.answer !== "string" ||
    typeof value.request_id !== "string" ||
    !Array.isArray(value.citations) ||
    !value.citations.every(
      (item) =>
        record(item) &&
        typeof item.id === "string" &&
        typeof item.text === "string" &&
        Number.isInteger(item.version),
    )
  )
    throw new Error("Invalid answer response");
  return value as Answer;
}
function App() {
  const [user, setUser] = useState<User | null>(null),
    [name, setName] = useState("amina"),
    [password, setPassword] = useState("");
  const [text, setText] = useState(""),
    [question, setQuestion] = useState("Can I return unopened goods?"),
    [messages, setMessages] = useState<Saved[]>([]),
    [answer, setAnswer] = useState<Answer | null>(null);
  const [status, setStatus] = useState("Checking your session…"),
    [busy, setBusy] = useState(false);
  const action = useRef({ text: "", key: "" }),
    generation = useRef(0),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    void api("/auth/me")
      .then((value) => {
        if (mounted.current) {
          setUser(asUser(value));
          setStatus("Signed in.");
        }
      })
      .catch(() => {
        if (mounted.current)
          setStatus("Use a local learning account to sign in.");
      });
    return () => {
      mounted.current = false;
      generation.current++;
    };
  }, []);
  useEffect(() => {
    const id = ++generation.current;
    setMessages([]);
    setAnswer(null);
    if (user)
      void api("/messages")
        .then((value) => {
          if (id === generation.current) setMessages(asMessages(value));
        })
        .catch((error) => {
          if (id === generation.current) setStatus(error.message);
        });
  }, [user]);
  const headers = () => ({
    "Content-Type": "application/json",
    "X-CSRF-Token": user?.csrf || "",
  });
  const perform = async (work: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try {
      await work();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Action failed");
      if (error instanceof RequestError && error.status === 401) setUser(null);
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  return (
    <main>
      <header>
        <p className="eyebrow">Your runnable capstone</p>
        <h1>Amina’s shop</h1>
        <p>
          Real API and stored data. The assistant’s execution mode is shown with
          every answer.
        </p>
      </header>
      <p role="status" className="status">
        {status}
      </p>
      {!user ? (
        <section>
          <h2>Sign in</h2>
          <p>
            Local practice accounts: amina (staff), sara or omar (customers),
            bilal (other-shop staff). Password: learn-with-amina. Use these only
            on your local learning service.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void perform(async () => {
                const value = await api("/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: name, password }),
                });
                setUser(asUser(value));
                setPassword("");
                setStatus("Signed in.");
              });
            }}
          >
            <label htmlFor="username">Username</label>
            <input
              id="username"
              autoComplete="username"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button disabled={busy}>Sign in</button>
          </form>
        </section>
      ) : (
        <>
          <section>
            <p>
              Signed in as <strong>{user.username}</strong> ({user.role}).
            </p>
            <button
              disabled={busy}
              onClick={() =>
                void perform(async () => {
                  await api("/auth/logout", {
                    method: "POST",
                    headers: headers(),
                  });
                  setUser(null);
                  setStatus("Signed out. Your draft remains on this page.");
                })
              }
            >
              Sign out
            </button>
          </section>
          <section>
            <h2>Save a message</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void perform(async () => {
                  const trimmed = text.trim();
                  if (!trimmed) {
                    setStatus("Write a message first.");
                    return;
                  }
                  if (action.current.text !== trimmed)
                    action.current = {
                      text: trimmed,
                      key: crypto.randomUUID(),
                    };
                  setStatus("Saving. Your draft is kept while we wait.");
                  const value = await api("/messages", {
                    method: "POST",
                    headers: {
                      ...headers(),
                      "Idempotency-Key": action.current.key,
                    },
                    body: JSON.stringify({ text: trimmed }),
                  });
                  if (
                    !record(value) ||
                    !Number.isInteger(value.id) ||
                    typeof value.text !== "string"
                  )
                    throw new Error("Invalid save response. Draft kept.");
                  setMessages((previous) => [
                    ...previous.filter((item) => item.id !== value.id),
                    value as Saved,
                  ]);
                  setText("");
                  action.current = { text: "", key: "" };
                  setStatus("Message saved.");
                });
              }}
            >
              <label htmlFor="message">Your message (1–200 characters)</label>
              <textarea
                id="message"
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={200}
                required
              />
              <button disabled={busy}>Save message</button>
            </form>
            <h3>Messages you may see</h3>
            {messages.length ? (
              <ul>
                {messages.map((message) => (
                  <li key={message.id}>{message.text}</li>
                ))}
              </ul>
            ) : (
              <p>No permitted messages yet.</p>
            )}
          </section>
          {user.role === "staff" && (
            <section>
              <h2>Ask about a policy</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const id = generation.current;
                  void perform(async () => {
                    setStatus("Finding permitted policy evidence…");
                    const value = asAnswer(
                      await api("/ask", {
                        method: "POST",
                        headers: headers(),
                        body: JSON.stringify({ text: question }),
                      }),
                    );
                    if (id === generation.current) {
                      setAnswer(value);
                      setStatus(
                        value.citations.length
                          ? "Review the source before using this answer."
                          : "No verified answer; ask a person.",
                      );
                    }
                  });
                }}
              >
                <label htmlFor="question">Policy question</label>
                <textarea
                  id="question"
                  maxLength={500}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  required
                />
                <button disabled={busy}>Find an answer</button>
              </form>
              {answer && (
                <article>
                  <p className="eyebrow">Mode: {answer.mode}</p>
                  <p>{answer.answer}</p>
                  <h3>Sources to inspect</h3>
                  {answer.citations.length ? (
                    answer.citations.map((source) => (
                      <blockquote key={source.id}>
                        <p>{source.text}</p>
                        <cite>
                          {source.id} · version {source.version}
                        </cite>
                      </blockquote>
                    ))
                  ) : (
                    <p>No supporting source returned.</p>
                  )}
                  <p className="small">Request id: {answer.request_id}</p>
                </article>
              )}
            </section>
          )}
        </>
      )}
      <footer>
        <p>
          Independent extension: implement one accepted requirement, test its
          real boundaries, and explain it to a reviewer.
        </p>
      </footer>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
