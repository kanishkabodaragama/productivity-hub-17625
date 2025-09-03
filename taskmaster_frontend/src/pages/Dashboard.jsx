import React from 'react';
import OverviewChart from '../components/charts/OverviewChart';
import TrendsChart from '../components/charts/TrendsChart';

/**
 * PUBLIC_INTERFACE
 * Dashboard page renders a responsive, card-based overview with mock metrics and charts.
 *
 * Layout:
 * - Header
 * - Stat cards (grid)
 * - Two charts: Overview (bar) and Trends (line)
 * - Recent activity (mock list)
 */
export default function Dashboard() {
  const stats = [
    { label: 'Tasks Completed', value: 124, delta: '+12%', color: 'var(--primary)' },
    { label: 'Active Projects', value: 6, delta: '+1', color: 'var(--secondary)' },
    { label: 'Upcoming Deadlines', value: 9, delta: '-2', color: 'var(--accent)' },
    { label: 'Focus Score', value: '82', delta: '+5', color: 'var(--primary)' },
  ];

  const overviewData = [
    { name: 'Mon', value: 12, secondary: 8 },
    { name: 'Tue', value: 18, secondary: 11 },
    { name: 'Wed', value: 9, secondary: 14 },
    { name: 'Thu', value: 22, secondary: 18 },
    { name: 'Fri', value: 16, secondary: 10 },
    { name: 'Sat', value: 8, secondary: 6 },
    { name: 'Sun', value: 13, secondary: 9 },
  ];

  const trendsData = [
    { date: 'Week 1', completed: 8, planned: 10 },
    { date: 'Week 2', completed: 12, planned: 12 },
    { date: 'Week 3', completed: 10, planned: 14 },
    { date: 'Week 4', completed: 15, planned: 16 },
    { date: 'Week 5', completed: 18, planned: 18 },
    { date: 'Week 6', completed: 16, planned: 17 },
  ];

  // Future-proofed placeholders for potential async data loading
  const isLoading = false; // hook up to real loading state when data is fetched asynchronously
  const hasStats = Array.isArray(stats) && stats.length > 0;

  return (
    <div className="container" style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '.75rem', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
        <span className="muted">Overview and trends</span>
      </div>

      {/* Stat cards */}
      <section
        className="cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={`sk-${i}`} className="card" aria-hidden>
                <div className="muted" style={{ fontSize: '.85rem' }}>Loading…</div>
                <div className="spinner" style={{ margin: '.75rem auto' }} />
              </div>
            ))}
          </>
        ) : !hasStats ? (
          <div className="card empty" style={{ gridColumn: '1 / -1' }}>
            No statistics to display yet.
          </div>
        ) : (
          stats.map((s) => (
            <div
              key={s.label}
              className="card"
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,.04)',
              }}
            >
              <div className="muted" style={{ fontSize: '.85rem' }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '.5rem', marginTop: '.25rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: '.85rem', color: s.color }}>{s.delta}</div>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, rgba(226,232,240,.6), ' + s.color + ')',
                  marginTop: '.65rem',
                  opacity: .7
                }}
              />
            </div>
          ))
        )}
      </section>

      {/* Charts row */}
      <section
        className="cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr .8fr',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div
          className="card"
          style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            padding: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Weekly Overview</h3>
            <span className="muted" style={{ fontSize: '.85rem' }}>Completed vs Created</span>
          </div>
          <OverviewChart data={overviewData} />
        </div>

        <div
          className="card"
          style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            padding: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Focus Trends</h3>
            <span className="muted" style={{ fontSize: '.85rem' }}>Completed vs Planned</span>
          </div>
          <TrendsChart data={trendsData} />
        </div>
      </section>

      {/* Recent activity list (mock) */}
      <section
        className="card"
        style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Recent Activity</h3>
          <span className="muted" style={{ fontSize: '.85rem' }}>Last 24 hours</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '.5rem' }}>
          {[
            { time: '10:24', text: 'Completed task "Refactor auth context"' },
            { time: '09:12', text: 'Created task "Plan sprint backlog"' },
            { time: '08:55', text: 'Updated project "Website Refresh"' },
            { time: '07:40', text: 'Completed task "Fix CI warnings"' },
          ].map((item, idx) => (
            <li key={idx} style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: idx % 2 === 0 ? 'var(--secondary)' : 'var(--accent)',
                  boxShadow: '0 0 0 3px rgba(0,0,0,.04)',
                }}
              />
              <span className="muted" style={{ fontSize: '.8rem', width: 56 }}>{item.time}</span>
              <span style={{ fontSize: '.95rem' }}>{item.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
