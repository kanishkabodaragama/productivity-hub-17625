import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/**
 * PUBLIC_INTERFACE
 * OverviewChart renders a compact bar chart summarizing totals for quick insight cards.
 *
 * Props:
 * - data?: Array<{ name: string; value: number; secondary?: number }>
 * - height?: number (defaults to 260)
 *
 * If no data is provided, a mock series is used. The chart uses brand colors:
 * - Primary (#2B6CB0) for the main series
 * - Accent (#F6AD55) for the secondary series (when present)
 */
export default function OverviewChart({ data, height = 260 }) {
  const mock = [
    { name: 'Mon', value: 12, secondary: 8 },
    { name: 'Tue', value: 18, secondary: 11 },
    { name: 'Wed', value: 9, secondary: 14 },
    { name: 'Thu', value: 22, secondary: 18 },
    { name: 'Fri', value: 16, secondary: 10 },
    { name: 'Sat', value: 8, secondary: 6 },
    { name: 'Sun', value: 13, secondary: 9 },
  ];

  const series = Array.isArray(data) && data.length ? data : mock;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={series}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#718096', fontSize: 12 }} />
          <YAxis tick={{ fill: '#718096', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,.08)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="value"
            name="Completed"
            fill="#2B6CB0"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="secondary"
            name="Created"
            fill="#F6AD55"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
