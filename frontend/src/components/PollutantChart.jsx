import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const POLLUTANT_COLORS = {
  pm25: '#ff6b35',
  pm10: '#ffd600',
  no2:  '#7c6bff',
  co:   '#00d4aa',
  o3:   '#00c853',
  so2:  '#f48fb1'
};

const POLLUTANT_LABELS = {
  pm25: 'PM2.5', pm10: 'PM10', no2: 'NO₂', co: 'CO', o3: 'O₃', so2: 'SO₂'
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a1a24', border: `1px solid ${payload[0].payload.color}40`,
      borderRadius: '8px', padding: '10px', fontFamily: 'DM Mono, monospace', fontSize: '12px'
    }}>
      <div style={{ color: payload[0].payload.color, fontWeight: '700' }}>{payload[0].name}</div>
      <div style={{ color: '#e8e8f0' }}>{payload[0].value.toFixed(1)} µg/m³</div>
    </div>
  );
};

export default function PollutantChart({ data }) {
  if (!data?.pollutants) return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '12px'
    }}>No data</div>
  );

  const total = Object.values(data.pollutants).reduce((s, v) => s + (v || 0), 0);

  const chartData = Object.entries(data.pollutants)
    .filter(([, v]) => v != null && v > 0)
    .map(([key, value]) => ({
      name:    POLLUTANT_LABELS[key] || key,
      value:   parseFloat(value.toFixed(1)),
      color:   POLLUTANT_COLORS[key] || '#ffffff',
      percent: total > 0 ? Math.round((value / total) * 100) : 0,
    }));

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      animation: 'fadeUp 0.6s ease 0.2s both',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Pollutant Breakdown
        </div>
        <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: '2px' }}>
          {data.city} — <span style={{ fontWeight: '400' }}>{data.dominantPollutant} Dominant</span>
        </div>
      </div>

      {/* Donut */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={58} outerRadius={88}
              paddingAngle={3} dataKey="value" strokeWidth={0}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color}
                  style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)`, cursor: 'pointer' }}/>
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with percentages — 2-column grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '6px 16px', marginTop: '8px'
      }}>
        {chartData.map((entry, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }}/>
              <span style={{ fontFamily: 'DM Mono', fontSize: '11px', color: '#9b9bb0' }}>{entry.name}</span>
            </div>
            <span style={{ fontFamily: 'DM Mono', fontSize: '11px', color: entry.color, fontWeight: '700' }}>
              {entry.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
