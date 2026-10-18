// Header account button: "Sign in" when signed out, a profile circle with a
// small dropdown ("My progress", "Sign out") when signed in.

import { useEffect, useState } from 'react';
import { getSupabase, isCloudEnabled } from './client';
import './cloud.css';

interface Props {
  onOpenAccount(): void;
}

export default function AccountButton({ onOpenAccount }: Props) {
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isCloudEnabled()) return;
    const client = getSupabase();
    if (!client) return;
    client.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setMenuOpen(false);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setMenuOpen(false);
    try {
      await getSupabase()?.auth.signOut();
    } catch {
      /* staying signed in is visible enough: the circle stays */
    }
  };

  if (!email) {
    return (
      <button type="button" className="cloud-signin-btn" onClick={onOpenAccount}>
        Sign in
      </button>
    );
  }

  const initial = email.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="cloud-account-wrap">
      <button
        type="button"
        className="cloud-avatar-btn"
        aria-label={`Account for ${email}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {initial}
      </button>
      {menuOpen && (
        <>
          <button
            type="button"
            className="cloud-menu-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="cloud-menu" role="menu">
            <div className="cloud-menu-email">{email}</div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onOpenAccount();
              }}
            >
              My progress
            </button>
            <button type="button" role="menuitem" onClick={signOut}>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
