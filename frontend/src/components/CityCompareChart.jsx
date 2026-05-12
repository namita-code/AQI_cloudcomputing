import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { getAQIColor } from '../utils';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = getAQIColor(d.aqi);
  return (
    <div style={{
      background: '#1a1a24', border: `1px solid ${color}60`,
      borderRadius: '8px', padding: '10px 14px', fontFamily: 'DM Mono, monospace'
    }}>
      <div style={{ color, fontWeight: '700', fontSize: '14px' }}>{d.city}</div>
      <div style={{ color: '#e8e8f0', fontSize: '13px', marginTop: '3px' }}>
        AQI <span style={{ color, fontWeight: '700' }}>{d.aqi}</span>
      </div>
      <div style={{ color: '#6b6b80', fontSize: '10px', marginTop: '2px' }}>{d.category}</div>
      <div style={{ color: '#6b6b80', fontSize: '10px' }}>↑ {d.dominantPollutant}</div>
    </div>
  );
};

export default function CityCompareChart({ data }) {
  if (!data?.length) return null;
  const sorted = [...data].sort((a, b) => b.aqi - a.aqi);

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      animation: 'fadeUp 0.6s ease 0.1s both',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Area Comparison · Bengaluru
        </div>
        <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Current AQI by Area
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sorted} margin={{ top: 4, right: 8, bottom: 44, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
            <XAxis
              dataKey="city"
              tick={{ fill: '#6b6b80', fontFamily: 'DM Mono', fontSize: 11 }}
              axisLine={false} tickLine={false}
              interval={0} angle={-30} textAnchor="end"
            />
            <YAxis
              tick={{ fill: '#6b6b80', fontFamily: 'DM Mono', fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
            <Bar dataKey="aqi" radius={[5, 5, 0, 0]} maxBarSize={48}>
              {sorted.map((entry, i) => (
                <Cell key={i} fill={getAQIColor(entry.aqi)}
                  style={{ filter: `drop-shadow(0 0 5px ${getAQIColor(entry.aqi)}50)` }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
