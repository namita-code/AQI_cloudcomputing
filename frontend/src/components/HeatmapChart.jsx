import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAQIColor } from '../utils';

const AREAS = [
  'Silk Board', 'Marathahalli', 'Hebbal', 'Whitefield',
  'Jayanagar', 'Koramangala', 'Yelahanka', 'BTM Layout'
];

export default function HeatmapChart() {
  const [data,    setData]    = useState({});
  const [dates,   setDates]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      AREAS.map(area =>
        axios.get(`/api/aqi/trend/${encodeURIComponent(area)}`)
          .then(r => ({ area, readings: r.data }))
      )
    ).then(results => {
      const map = {};
      let allDates = [];
      results.forEach(({ area, readings }) => {
        map[area] = {};
        readings.forEach(r => {
          const d = new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          map[area][d] = r.aqi;
          if (!allDates.includes(d)) allDates.push(d);
        });
      });
      setData(map);
      setDates(allDates);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '12px'
    }}>
      Loading heatmap…
    </div>
  );

  const CELL_W = 18, CELL_H = 22, GAP = 2;
  const LABEL_W = 86;
  const totalW  = LABEL_W + dates.length * (CELL_W + GAP);

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      animation: 'fadeUp 0.6s ease 0.2s both',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          30-Day Heatmap · All Areas
        </div>
        <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '2px' }}>
          AQI Calendar
        </div>
      </div>

      {/* Scrollable heatmap */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }}>
        <svg width={totalW} height={AREAS.length * (CELL_H + GAP) + 30}>
          {/* Date labels */}
          {dates.map((d, di) =>
            di % 5 === 0 ? (
              <text key={di}
                x={LABEL_W + di * (CELL_W + GAP) + CELL_W / 2} y={12}
                textAnchor="middle" fill="#4a4a5a" fontSize="8" fontFamily="DM Mono, monospace">
                {d}
              </text>
            ) : null
          )}

          {/* Rows */}
          {AREAS.map((area, ai) => (
            <g key={area}>
              <text
                x={LABEL_W - 6} y={24 + ai * (CELL_H + GAP) + CELL_H / 2}
                textAnchor="end" dominantBaseline="middle"
                fill="#6b6b80" fontSize="10" fontFamily="DM Mono, monospace">
                {area}
              </text>
              {dates.map((d, di) => {
                const aqiVal = data[area]?.[d];
                const bg = aqiVal ? getAQIColor(aqiVal) : '#1a1a24';
                const opacity = aqiVal ? 0.2 + (aqiVal / 500) * 0.75 : 0.15;
                return (
                  <g key={di}>
                    <rect
                      x={LABEL_W + di * (CELL_W + GAP)}
                      y={24 + ai * (CELL_H + GAP)}
                      width={CELL_W} height={CELL_H} rx="3"
                      fill={bg} opacity={opacity}/>
                    <title>{area} · {d}: AQI {aqiVal ?? 'N/A'}</title>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#6b6b80' }}>Low</span>
        {['#00c853','#ffd600','#ff6d00','#d50000','#7b1fa2','#880e4f'].map((c, i) => (
          <div key={i} style={{ width: 18, height: 12, borderRadius: '3px', background: c, opacity: 0.8 }} />
        ))}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#6b6b80' }}>High</span>
      </div>
    </div>
  );
}
