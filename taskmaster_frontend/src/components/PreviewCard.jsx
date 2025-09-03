import React from 'react';

/**
 * PUBLIC_INTERFACE
 * PreviewCard renders a polished personal profile card with basic stats and links.
 *
 * Props:
 * - profile: {
 *     name?: string,
 *     title?: string,
 *     bio?: string,
 *     avatar_url?: string,
 *     slug?: string,
 *     stats?: { tasksCompleted?: number, activeProjects?: number, focusScore?: number },
 *     links?: Array<{ label: string, url: string }>
 *   }
 * - compact?: boolean - if true, reduces paddings and sizes
 *
 * Usage:
 * <PreviewCard profile={data} />
 */
export default function PreviewCard({ profile = {}, compact = false }) {
  const {
    name = 'Alex Johnson',
    title = 'Productivity Enthusiast',
    bio = 'Organizing tasks, tracking progress, and sharing insights.',
    avatar_url = '',
    slug,
    stats = {},
    links = [],
  } = profile || {};

  const avatarFallback =
    name?.trim()?.charAt(0)?.toUpperCase() || 'A';

  const statItems = [
    { key: 'tasksCompleted', label: 'Tasks', value: stats.tasksCompleted ?? 124 },
    { key: 'activeProjects', label: 'Projects', value: stats.activeProjects ?? 6 },
    { key: 'focusScore', label: 'Focus', value: stats.focusScore ?? 82 },
  ];

  return (
    <div
      className="card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: compact ? '0.75rem' : '1.25rem',
      }}
      aria-label="Public profile preview"
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(79,209,197,.08), rgba(246,173,85,.08))',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', display: 'grid', gap: compact ? '.75rem' : '1rem' }}>
        <div style={{ display: 'flex', gap: compact ? '.75rem' : '1rem', alignItems: 'center' }}>
          <div
            title="Avatar"
            style={{
              width: compact ? 60 : 80,
              height: compact ? 60 : 80,
              borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
              color: '#1a202c',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: compact ? '1.1rem' : '1.4rem',
              overflow: 'hidden',
              flex: '0 0 auto',
              boxShadow: '0 10px 30px rgba(0,0,0,.06)',
            }}
          >
            {avatar_url ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img
                src={avatar_url}
                alt={`${name} avatar image`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to initial if image fails
                  if (e?.target) e.target.remove();
                }}
              />
            ) : (
              <span>{avatarFallback}</span>
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: compact ? '1.15rem' : '1.35rem' }}>{name}</h2>
              {slug ? (
                <span
                  className="muted"
                  style={{
                    fontSize: '.85rem',
                    padding: '.2rem .45rem',
                    border: '1px solid var(--border)',
                    borderRadius: '.35rem',
                    background: '#fff',
                  }}
                >
                  @{slug}
                </span>
              ) : null}
            </div>
            <div className="muted" style={{ marginTop: '.15rem', fontSize: '.95rem' }}>{title}</div>
            {bio ? (
              <p style={{ margin: '.35rem 0 0', lineHeight: 1.35, fontSize: '.95rem' }}>{bio}</p>
            ) : null}
          </div>
        </div>

        <div
          aria-label="Stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
            gap: '.5rem',
          }}
        >
          {statItems.map((s) => (
            <div
              key={s.key}
              className="card"
              style={{
                padding: compact ? '.5rem' : '.65rem',
                textAlign: 'center',
                boxShadow: '0 8px 22px rgba(0,0,0,.04)',
              }}
            >
              <div className="muted" style={{ fontSize: '.8rem' }}>{s.label}</div>
              <div style={{ fontWeight: 800, fontSize: compact ? '1rem' : '1.1rem' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {Array.isArray(links) && links.length > 0 ? (
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {links.map((l, idx) => (
              <a
                key={`${l.url}-${idx}`}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ padding: '.5rem .75rem' }}
                aria-label={`External link: ${l.label}`}
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
