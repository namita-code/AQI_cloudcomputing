import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getAQIColor } from '../utils';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const aqi = payload[0].value;
  const color = getAQIColor(aqi);
  return (
    <div style={{
      background: '#1a1a24', border: `1px solid ${color}40`,
      borderRadius: '8px', padding: '10px', fontFamily: 'DM Mono, monospace', fontSize: '12px'
    }}>
      <div style={{ color: '#6b6b80', marginBottom: '4px' }}>{label}</div>
      <div style={{ color }}>AQI: <strong>{aqi}</strong></div>
    </div>
  );
};

// Custom label rendered inside the chart, left-anchored so it never clips
const RefLabel = ({ viewBox, value, color }) => {
  const { x, y } = viewBox;
  return (
    <text
      x={x + 6}
      y={y - 5}
      fill={color}
      fontSize={10}
      fontFamily="DM Mono, monospace"
    >
      {value}
    </text>
  );
};

export default function TrendChart({ data, city }) {
  if (!data?.length) return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '12px'
    }}>No trend data</div>
  );

  const formatted = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    aqi: d.aqi
  }));

  const avgAQI = Math.round(data.reduce((s, d) => s + d.aqi, 0) / data.length);
  const accentColor = getAQIColor(avgAQI);

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      animation: 'fadeUp 0.6s ease 0.3s both',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            30-Day Trend
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '2px' }}>
            {city} AQI History
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg</div>
          <div style={{ color: accentColor, fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{avgAQI}</div>
        </div>
      </div>

      {/* Chart — right margin generous so labels don't clip */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted} margin={{ top: 16, right: 16, bottom: 4, left: -20 }}>
            <defs>
              <linearGradient id="areaGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
            <XAxis dataKey="date"
              tick={{ fill: '#6b6b80', fontFamily: 'DM Mono', fontSize: 10 }}
              axisLine={false} tickLine={false} interval={4} />
            <YAxis
              tick={{ fill: '#6b6b80', fontFamily: 'DM Mono', fontSize: 10 }}
              axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />

            {/* Moderate line — label inside, left side */}
            <ReferenceLine y={100} stroke="#ffd60050" strokeDasharray="4 4"
              label={<RefLabel value="Moderate" color="#ffd600aa" />} />

            {/* Unhealthy line — label inside, left side */}
            <ReferenceLine y={200} stroke="#d5000050" strokeDasharray="4 4"
              label={<RefLabel value="Unhealthy" color="#d50000aa" />} />

            <Area type="monotone" dataKey="aqi" stroke={accentColor} strokeWidth={2}
              fill="url(#areaGrad3)" dot={false} activeDot={{ r: 5, fill: accentColor }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
