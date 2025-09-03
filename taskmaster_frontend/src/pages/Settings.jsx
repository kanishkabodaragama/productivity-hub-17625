import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Settings page: User profile and preferences management.
 * 
 * - ProfileForm: edit Supabase user metadata (name, avatar_url, bio)
 * - PreferencesForm: toggle theme preference (light/dark), persists in localStorage and (optional) syncs to user metadata
 * 
 * UX:
 * - Clean, modern cards, aligned with brand colors
 * - Responsive grid layout
 * - Inline success/error toasts-like banners and disabled states while saving
 */
export default function Settings() {
  return (
    <div className="container" style={{ maxWidth: 880 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '.75rem', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Settings</h1>
        <span className="muted">Manage your profile and preferences</span>
      </div>

      <section
        className="cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1rem',
        }}
        aria-label="Settings sections"
      >
        <a id="profile" href="#profile" className="visually-hidden" aria-hidden="true">Profile</a>
        <ProfileForm />
        <a id="preferences" href="#preferences" className="visually-hidden" aria-hidden="true">Preferences</a>
        <PreferencesForm />
      </section>
    </div>
  );
}

/**
 * Helpers
 */
function successBanner(msg) {
  return (
    <div role="status" style={{ background: 'rgba(79, 209, 197, .15)', border: '1px solid #4FD1C5', color: '#065666', padding: '.75rem', borderRadius: '.5rem' }}>
      {msg}
    </div>
  );
}
function errorBanner(msg) {
  return (
    <div role="alert" style={{ background: 'rgba(246, 173, 85, .15)', border: '1px solid #F6AD55', color: '#744210', padding: '.75rem', borderRadius: '.5rem' }}>
      {msg}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * ProfileForm allows editing Supabase user metadata (name, avatar_url, bio).
 */
function ProfileForm() {
  const { user } = useAuth();
  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch (_e) {
      return null;
    }
  }, []);

  const initialMeta = user?.user_metadata || {};
  const [name, setName] = useState(initialMeta.name || '');
  const [avatarUrl, setAvatarUrl] = useState(initialMeta.avatar_url || '');
  const [bio, setBio] = useState(initialMeta.bio || '');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    // Sync when user changes
    setName(initialMeta.name || '');
    setAvatarUrl(initialMeta.avatar_url || '');
    setBio(initialMeta.bio || '');
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo('');
    setErr('');
    if (!user || !supabase) {
      setErr('Not authenticated or Supabase unavailable.');
      return;
    }
    setLoading(true);
    try {
      const updates = {
        data: {
          ...(user?.user_metadata ?? {}),
          name: name.trim(),
          avatar_url: avatarUrl.trim(),
          bio: bio.trim(),
        },
      };
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      setInfo('Profile updated successfully.');
    } catch (error) {
      setErr(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const avatarFallback = name?.trim()?.charAt(0)?.toUpperCase() || (user?.email?.charAt(0)?.toUpperCase() || 'U');

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Profile</h3>
          <span className="muted" style={{ fontSize: '.85rem' }}>Update your personal information</span>
        </div>
      </div>

      {info ? <div style={{ marginTop: '.5rem' }}>{successBanner(info)}</div> : null}
      {err ? <div style={{ marginTop: '.5rem' }}>{errorBanner(err)}</div> : null}

      <form className="form" onSubmit={handleSubmit} style={{ marginTop: '.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: '1rem', alignItems: 'center' }}>
          <div
            aria-label="Avatar preview"
            title="Avatar preview"
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
              color: '#1a202c',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              overflow: 'hidden',
            }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img
                src={avatarUrl}
                alt="Avatar image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setAvatarUrl('')}
              />
            ) : (
              <span>{avatarFallback}</span>
            )}
          </div>

          <div style={{ display: 'grid', gap: '.75rem' }}>
            <label className="form-label">
              Name
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="form-label">
              Avatar URL
              <input
                type="url"
                placeholder="https://…"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </label>
          </div>
        </div>

        <label className="form-label">
          Bio
          <input
            type="text"
            placeholder="Tell us a little about you"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn ghost" onClick={() => { setName(initialMeta.name || ''); setAvatarUrl(initialMeta.avatar_url || ''); setBio(initialMeta.bio || ''); }}>
            Reset
          </button>
          <button className="btn primary" type="submit" disabled={loading} style={{ height: 44 }}>
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * PreferencesForm manages theme preference (light/dark).
 * - Persists in localStorage under "tm_theme"
 * - Applies to document.documentElement data-theme attribute
 * - Optionally sync to Supabase user metadata: user_metadata.theme
 */
function PreferencesForm() {
  const { user } = useAuth();
  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch (_e) {
      return null;
    }
  }, []);

  const localKey = 'tm_theme';
  let initialTheme = 'light';
  try {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(localKey);
      if (saved === 'dark' || saved === 'light') {
        initialTheme = saved;
      } else if (user?.user_metadata?.theme === 'dark' || user?.user_metadata?.theme === 'light') {
        initialTheme = user.user_metadata.theme;
      }
    }
  } catch (_e) {
    if (user?.user_metadata?.theme === 'dark' || user?.user_metadata?.theme === 'light') {
      initialTheme = user.user_metadata.theme;
    }
  }

  const [theme, setTheme] = useState(initialTheme === 'dark' ? 'dark' : 'light');
  const [syncCloud, setSyncCloud] = useState(true); // default true: sync to user metadata when available
  const [info, setInfo] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  // Apply theme immediately when changed
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(localKey, theme);
    } catch (_e) {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    // Ensure initial application on mount
    document.documentElement.setAttribute('data-theme', theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (e) => {
    e.preventDefault();
    setInfo('');
    setErr('');
    setSaving(true);
    try {
      // Persist locally
      localStorage.setItem(localKey, theme);
      document.documentElement.setAttribute('data-theme', theme);

      // Optionally sync to Supabase user metadata
      if (syncCloud && user && supabase) {
        const { error } = await supabase.auth.updateUser({
          data: { ...user.user_metadata, theme },
        });
        if (error) throw error;
      }
      setInfo('Preferences saved.');
    } catch (error) {
      setErr(error.message || 'Unable to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Preferences</h3>
          <span className="muted" style={{ fontSize: '.85rem' }}>Theme and personalization</span>
        </div>
      </div>

      {info ? <div style={{ marginTop: '.5rem' }}>{successBanner(info)}</div> : null}
      {err ? <div style={{ marginTop: '.5rem' }}>{errorBanner(err)}</div> : null}

      <form className="form" onSubmit={handleSave} style={{ marginTop: '.75rem' }}>
        <fieldset style={{ border: '1px solid var(--border)', borderRadius: '.5rem', padding: '.75rem' }}>
          <legend className="muted" style={{ padding: '0 .5rem' }}>Theme</legend>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', margin: 0 }}>
              <input
                type="radio"
                name="theme"
                checked={theme === 'light'}
                onChange={() => setTheme('light')}
                aria-label="Light theme"
              />
              <span>Light</span>
            </label>
            <label className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', margin: 0 }}>
              <input
                type="radio"
                name="theme"
                checked={theme === 'dark'}
                onChange={() => setTheme('dark')}
                aria-label="Dark theme"
              />
              <span>Dark</span>
            </label>
          </div>
        </fieldset>

        <label className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
          <input
            type="checkbox"
            checked={syncCloud}
            onChange={(e) => setSyncCloud(e.target.checked)}
            aria-label="Sync theme to account"
            id="sync-theme-cloud"
          />
          <span htmlFor="sync-theme-cloud">Sync theme to my account</span>
        </label>

        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn ghost" onClick={() => setTheme('light')}>
            Reset to light
          </button>
          <button className="btn primary" type="submit" disabled={saving} style={{ height: 44 }}>
            {saving ? 'Saving…' : 'Save preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
