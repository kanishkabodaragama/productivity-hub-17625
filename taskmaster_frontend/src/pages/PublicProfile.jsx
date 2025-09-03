import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PreviewCard from '../components/PreviewCard';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * PublicProfile page
 * Fetches a user's published public profile by slug from Supabase public table "public_profiles".
 * Falls back to sample data if Supabase is not configured or if no record exists.
 *
 * Route params:
 * - slug: string
 *
 * Returns a minimal, polished public page view.
 */
export default function PublicProfile() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState('');

  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch (_e) {
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setErr('');
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('public_profiles')
            .select('*')
            .eq('slug', slug)
            .limit(1)
            .maybeSingle();

          if (error) throw error;
          if (active) {
            if (data) {
              // Ensure shape for PreviewCard
              setProfile({
                name: data.name,
                title: data.title,
                bio: data.bio,
                avatar_url: data.avatar_url,
                slug: data.slug,
                stats: {
                  tasksCompleted: data.tasksCompleted ?? undefined,
                  activeProjects: data.activeProjects ?? undefined,
                  focusScore: data.focusScore ?? undefined,
                },
                links: Array.isArray(data.links) ? data.links : [],
              });
            } else {
              // No record found, show sample
              setProfile(sampleData(slug));
            }
          }
        } else {
          // Supabase not configured, use sample
          if (active) setProfile(sampleData(slug));
        }
      } catch (e) {
        if (active) {
          setErr(e.message || 'Unable to load profile.');
          setProfile(sampleData(slug));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [slug, supabase]);

  return (
    <div style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 820, paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>Personal Site</h1>
            <span className="muted" style={{ fontSize: '.9rem' }}>@{slug}</span>
          </div>
          <Link to="/" className="btn">Back to Home</Link>
        </div>

        {err ? (
          <div
            role="alert"
            style={{
              background: 'rgba(246, 173, 85, .15)',
              border: '1px solid #F6AD55',
              color: '#744210',
              padding: '.75rem',
              borderRadius: '.5rem',
              marginBottom: '.75rem',
            }}
          >
            {err}
          </div>
        ) : null}

        {loading ? (
          <div className="card" style={{ display: 'grid', gap: '.5rem' }}>
            <div className="spinner" aria-label="Loading" />
            <div className="muted" style={{ textAlign: 'center' }}>Loading profile…</div>
          </div>
        ) : (
          <PreviewCard profile={profile} />
        )}

        <footer style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--muted)' }}>
          Powered by TaskMaster
        </footer>
      </div>
    </div>
  );
}

function sampleData(slug) {
  return {
    name: 'Alex Johnson',
    title: 'Productivity Enthusiast',
    bio: `This is a demo public profile for @${slug}. Publish your own to replace this demo content.`,
    avatar_url: '',
    slug,
    stats: { tasksCompleted: 124, activeProjects: 6, focusScore: 82 },
    links: [
      { label: 'Website', url: 'https://example.com' },
      { label: 'GitHub', url: 'https://github.com/' },
    ],
  };
}
