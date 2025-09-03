import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/**
 * PUBLIC_INTERFACE
 * TrendsChart renders a responsive line chart for visualizing trends over time.
 *
 * Props:
 * - data?: Array<{ date: string; completed: number; planned: number }>
 * - height?: number (defaults to 300)
 *
 * Uses primary color (#2B6CB0) for "Completed" and secondary color (#4FD1C5) for "Planned".
 */
export default function TrendsChart({ data, height = 300 }) {
  const mock = [
    { date: 'Week 1', completed: 8, planned: 10 },
    { date: 'Week 2', completed: 12, planned: 12 },
    { date: 'Week 3', completed: 10, planned: 14 },
    { date: 'Week 4', completed: 15, planned: 16 },
    { date: 'Week 5', completed: 18, planned: 18 },
    { date: 'Week 6', completed: 16, planned: 17 },
  ];

  const series = Array.isArray(data) && data.length ? data : mock;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
          data={series}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          {!hasData ? (
            <text x="50%" y="50%" textAnchor="middle" fill="#a0aec0" fontSize="12">
              Showing sample data
            </text>
          ) : null}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#718096', fontSize: 12 }} />
          <YAxis tick={{ fill: '#718096', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,.08)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="#2B6CB0"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="planned"
            name="Planned"
            stroke="#4FD1C5"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
