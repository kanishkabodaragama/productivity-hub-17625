import React, { useEffect, useMemo, useState } from 'react';
import PreviewCard from '../components/PreviewCard';
import { useAuth } from './auth-context-alias';
import { savePublicProfile } from '../lib/publishService';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Publish page: Preview and publish a personal public profile to Supabase
 * table "public_profiles" (with mock fallback).
 *
 * Form fields:
 * - slug (unique), name, title, bio, avatar_url, stats (tasksCompleted, activeProjects, focusScore), links (label+url)
 */
export default function Publish() {
  const { user } = useAuth();
  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch (_e) {
      return null;
    }
  }, []);

  const userMeta = user?.user_metadata || {};
  const [slug, setSlug] = useState(safeSlug(userMeta.name || user?.email?.split('@')[0] || 'user'));
  const [name, setName] = useState(userMeta.name || '');
  const [title, setTitle] = useState('Productivity Enthusiast');
  const [bio, setBio] = useState(userMeta.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(userMeta.avatar_url || '');
  const [tasksCompleted, setTasksCompleted] = useState(124);
  const [activeProjects, setActiveProjects] = useState(6);
  const [focusScore, setFocusScore] = useState(82);
  const [links, setLinks] = useState([{ label: 'Website', url: 'https://example.com' }]);

  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    // try to keep slug safe as user types a name
    if (!slug) {
      setSlug(safeSlug(name || 'user'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const profile = {
    slug,
    name: name || 'Your name',
    title,
    bio,
    avatar_url: avatarUrl,
    stats: { tasksCompleted, activeProjects, focusScore },
    links,
  };

  const handleAddLink = () => setLinks((l) => [...l, { label: '', url: '' }]);
  const handleRemoveLink = (idx) => setLinks((l) => l.filter((_, i) => i !== idx));
  const updateLink = (idx, key, val) =>
    setLinks((l) => l.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));

  const handlePublish = async (e) => {
    e.preventDefault();
    setSaving(true);
    setInfo('');
    setErr('');
    try {
      if (!slug || !name) {
        throw new Error('Please provide at least a slug and a name.');
      }
      const payload = {
        slug: safeSlug(slug),
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl.trim(),
        stats: { tasksCompleted, activeProjects, focusScore },
        links: links
          .filter((l) => l.label && l.url)
          .map((l) => ({ label: String(l.label).trim(), url: String(l.url).trim() })),
      };
      const { error } = await savePublicProfile(payload, user?.id || null);
      if (error) throw error;

      const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
      const publicUrl = `${siteUrl}/u/${payload.slug}`;
      setInfo(`Published! Your public URL: ${publicUrl}`);
    } catch (error) {
      setErr(error.message || 'Publish failed.');
    } finally {
      setSaving(false);
    }
  };

  const siteUrl = (process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')) + `/u/${slug || 'user'}`;

  return (
    <div className="container" style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '.75rem', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Publish</h1>
        <span className="muted">Preview and publish your public profile</span>
      </div>

      <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Profile Details</h3>
              <span className="muted" style={{ fontSize: '.85rem' }}>
                Fill your details and preview on the right
              </span>
            </div>
            {!supabase ? (
              <span className="muted" style={{ fontSize: '.8rem' }}>(Mock mode)</span>
            ) : null}
          </div>

          {info ? (
            <div role="status" style={{ background: 'rgba(79, 209, 197, .15)', border: '1px solid #4FD1C5', color: '#065666', padding: '.75rem', borderRadius: '.5rem', marginBottom: '.75rem' }}>
              {info}
            </div>
          ) : null}
          {err ? (
            <div role="alert" style={{ background: 'rgba(246, 173, 85, .15)', border: '1px solid #F6AD55', color: '#744210', padding: '.75rem', borderRadius: '.5rem', marginBottom: '.75rem' }}>
              {err}
            </div>
          ) : null}

          <form className="form" onSubmit={handlePublish}>
            <label className="form-label">
              Public URL
              <input type="text" value={siteUrl} readOnly aria-label="Public URL" />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <label className="form-label">
                Slug (unique)
                <input
                  type="text"
                  placeholder="your-name"
                  value={slug}
                  onChange={(e) => setSlug(safeSlug(e.target.value))}
                  required
                />
              </label>
              <label className="form-label">
                Name
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="form-label">
              Title
              <input type="text" placeholder="What describes you?" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>

            <label className="form-label">
              Bio
              <input type="text" placeholder="Tell visitors a little about you" value={bio} onChange={(e) => setBio(e.target.value)} />
            </label>

            <label className="form-label">
              Avatar URL
              <input type="url" placeholder="https://…" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            </label>

            <div aria-label="Stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '.75rem' }}>
              <label className="form-label">
                Tasks Completed
                <input
                  type="number"
                  value={tasksCompleted}
                  onChange={(e) => setTasksCompleted(Number(e.target.value))}
                />
              </label>
              <label className="form-label">
                Active Projects
                <input
                  type="number"
                  value={activeProjects}
                  onChange={(e) => setActiveProjects(Number(e.target.value))}
                />
              </label>
              <label className="form-label">
                Focus Score
                <input
                  type="number"
                  value={focusScore}
                  onChange={(e) => setFocusScore(Number(e.target.value))}
                />
              </label>
            </div>

            <fieldset style={{ border: '1px solid var(--border)', borderRadius: '.5rem', padding: '.75rem' }}>
              <legend className="muted" style={{ padding: '0 .5rem' }}>Links</legend>
              <div style={{ display: 'grid', gap: '.5rem' }}>
                {links.map((l, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Label (e.g., Website)"
                      value={l.label}
                      onChange={(e) => updateLink(idx, 'label', e.target.value)}
                    />
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={l.url}
                      onChange={(e) => updateLink(idx, 'url', e.target.value)}
                    />
                    <button type="button" className="btn ghost" onClick={() => handleRemoveLink(idx)} aria-label="Remove link">
                      ✕
                    </button>
                  </div>
                ))}
                <div>
                  <button type="button" className="btn small" onClick={handleAddLink}>
                    Add link
                  </button>
                </div>
              </div>
            </fieldset>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.5rem' }}>
              <button type="submit" className="btn primary" disabled={saving} style={{ height: 44 }}>
                {saving ? 'Publishing…' : 'Publish'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div style={{ marginBottom: '.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Live Preview</h3>
            <span className="muted" style={{ fontSize: '.85rem' }}>This is how your public page will look</span>
          </div>
          <PreviewCard profile={profile} />
          <div className="muted" style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
            Tip: Share your public URL after publishing: <strong>{siteUrl}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function safeSlug(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\- ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/\-+/g, '-')
    .slice(0, 48);
}
