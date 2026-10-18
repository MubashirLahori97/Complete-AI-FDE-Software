// Sign-in / create-account modal for FDE Academy cloud save.
// Works against ../cloud/client + ../cloud/sync (worker B's modules).

import { useEffect, useState } from 'react';
import { getSupabase, isCloudEnabled } from './client';
import { pullMergePush } from './sync';
import './cloud.css';

type Tab = 'signup' | 'signin' | 'magic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  open: boolean;
  onClose(): void;
  onAuthed(): void;
}

function friendlyError(tab: Tab, message: string): string {
  const lower = message.toLowerCase();
  if (tab === 'signin' && lower.includes('invalid login credentials')) {
    return 'Wrong email or password — try again.';
  }
  if (tab === 'signup' && lower.includes('already registered')) {
    return 'This email already has an account — try signing in.';
  }
  if (lower.includes('email') && lower.includes('invalid')) {
    return "That email doesn't look right.";
  }
  return 'Something went wrong — check your connection and try again.';
}

export default function AuthModal({ open, onClose, onAuthed }: Props) {
  const [tab, setTab] = useState<Tab>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const cloudOn = isCloudEnabled();

  useEffect(() => {
    if (open) {
      setError('');
      setInfo('');
      setBusy(false);
    }
  }, [open, tab ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const finishSignIn = async () => {
    // Merge cloud progress into this device, then hand control to the parent.
    await pullMergePush();
    onAuthed();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInfo('');
    if (!EMAIL_RE.test(email.trim())) {
      setError("That email doesn't look right.");
      return;
    }
    if (tab !== 'magic' && password.length < 6) {
      setError('Password needs at least 6 characters.');
      return;
    }
    const client = getSupabase();
    if (!client) {
      setError('Something went wrong — check your connection and try again.');
      return;
    }
    setBusy(true);
    try {
      if (tab === 'signup') {
        const { error } = await client.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        await finishSignIn();
      } else if (tab === 'signin') {
        const { error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        await finishSignIn();
      } else {
        const { error } = await client.auth.signInWithOtp({ email: email.trim() });
        if (error) throw error;
        setInfo('We sent you a sign-in link — check your inbox.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(friendlyError(tab, message));
    } finally {
      setBusy(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'signup', label: 'Create account' },
    { id: 'signin', label: 'Sign in' },
    { id: 'magic', label: 'Magic link' },
  ];

  return (
    <div
      className="cloud-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Account"
    >
      <div className="cloud-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cloud-modal-head">
          <h2>Your account</h2>
          <button className="cloud-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {!cloudOn ? (
          <p className="cloud-note" role="note">
            Accounts need the site owner to switch on cloud save — your progress still saves on
            this device.
          </p>
        ) : (
          <>
            <p className="cloud-sub">
              Save your progress in the cloud, so it follows you to your other devices.
            </p>
            <div className="cloud-tabs" role="tablist" aria-label="Account actions">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`cloud-tab ${tab === t.id ? 'is-active' : ''}`}
                  onClick={() => setTab(t.id)}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
            {error && (
              <p className="cloud-error" role="alert">
                {error}
              </p>
            )}
            {info && (
              <p className="cloud-info" role="status">
                {info}
              </p>
            )}
            <form onSubmit={submit}>
              <div className="cloud-field">
                <label htmlFor="cloud-email">Email</label>
                <input
                  id="cloud-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              {tab !== 'magic' && (
                <div className="cloud-field">
                  <label htmlFor="cloud-password">Password</label>
                  <input
                    id="cloud-password"
                    type="password"
                    autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                </div>
              )}
              <button className="cloud-btn" type="submit" disabled={busy}>
                {busy
                  ? 'One moment…'
                  : tab === 'signup'
                    ? 'Create account'
                    : tab === 'signin'
                      ? 'Sign in'
                      : 'Send me a sign-in link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
