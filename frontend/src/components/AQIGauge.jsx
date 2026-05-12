import React, { useEffect, useState } from 'react';
import { getAQIColor, getAQICategory } from '../utils';

const SEGMENTS = [
  { color: '#00c853', max: 50  },
  { color: '#ffd600', max: 100 },
  { color: '#ff6d00', max: 150 },
  { color: '#d50000', max: 200 },
  { color: '#7b1fa2', max: 300 },
  { color: '#880e4f', max: 500 },
];

const START_DEG = 180;
const SWEEP_DEG = 180;

function aqiToDeg(aqi) {
  return START_DEG + (Math.min(500, Math.max(0, aqi)) / 500) * SWEEP_DEG;
}
function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcBandPath(cx, cy, r1, r2, sDeg, eDeg) {
  const s1 = polar(cx, cy, r2, sDeg), e1 = polar(cx, cy, r2, eDeg);
  const s2 = polar(cx, cy, r1, eDeg), e2 = polar(cx, cy, r1, sDeg);
  const lg = (eDeg - sDeg > 180) ? 1 : 0;
  return `M${s1.x} ${s1.y} A${r2} ${r2} 0 ${lg} 1 ${e1.x} ${e1.y} L${s2.x} ${s2.y} A${r1} ${r1} 0 ${lg} 0 ${e2.x} ${e2.y}Z`;
}

export default function AQIGauge({ aqi, city, pollutants }) {
  const [displayAQI, setDisplayAQI] = useState(0);
  const [needleDeg,  setNeedleDeg]  = useState(START_DEG);

  useEffect(() => {
    if (!aqi) return;
    let start = null;
    const targetDeg = aqiToDeg(aqi);
    function animate(ts) {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / 1400, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayAQI(Math.round(aqi * ease));
      setNeedleDeg(START_DEG + (targetDeg - START_DEG) * ease);
      if (p < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [aqi]);

  const color = getAQIColor(aqi || 0);
  const cat   = getAQICategory(aqi || 0);

  const W = 320, H = 195;
  const cx = W / 2, cy = 168;
  const RO = 128, RI = 98;

  let cum = 0;
  const bands = SEGMENTS.map((seg, i) => {
    const prev = i === 0 ? 0 : SEGMENTS[i - 1].max;
    const frac = (seg.max - prev) / 500;
    const s = START_DEG + cum * SWEEP_DEG;
    const e = s + frac * SWEEP_DEG;
    cum += frac;
    return { ...seg, s, e };
  });

  const fillDeg    = aqiToDeg(aqi || 0);
  const needleTip  = polar(cx, cy, RO - 4, needleDeg);
  const needleBase = polar(cx, cy, RI + 8,  needleDeg);

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px 20px 18px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      animation: 'fadeUp 0.6s ease 0.1s both',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Live AQI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c853', animation: 'pulse 2s infinite' }}/>
          <span style={{ fontSize: '11px', color: '#00c853', fontFamily: 'var(--font-mono)' }}>Live</span>
        </div>
      </div>

      {/* City name */}
      <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '2px', letterSpacing: '-0.02em' }}>
        {city}
      </div>

      {/* Gauge */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'hidden', display: 'block', maxHeight: '185px' }}>
          <defs>
            <filter id="nGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Dim track */}
          {bands.map((b, i) => (
            <path key={i} d={arcBandPath(cx, cy, RI, RO, b.s, b.e)} fill={b.color} opacity="0.18"/>
          ))}

          {/* Lit fill */}
          {bands.map((b, i) => {
            if (b.s >= fillDeg) return null;
            return (
              <path key={i} d={arcBandPath(cx, cy, RI, RO, b.s, Math.min(b.e, fillDeg))}
                fill={b.color} opacity="0.95"/>
            );
          })}

          {/* Dividers */}
          {bands.map((b, i) => {
            const p1 = polar(cx, cy, RI - 1, b.s), p2 = polar(cx, cy, RO + 1, b.s);
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#0a0a0f" strokeWidth="2"/>;
          })}

          {/* Cover bottom half — clean semicircle edge */}
          <rect x={0} y={cy} width={W} height={H - cy + 2} fill="#111118"/>

          {/* Needle */}
          <line x1={needleBase.x} y1={needleBase.y} x2={needleTip.x} y2={needleTip.y}
            stroke={color} strokeWidth="2.5" strokeLinecap="round" filter="url(#nGlow)"/>
          <circle cx={cx} cy={cy} r={7} fill={color} filter="url(#nGlow)"/>
          <circle cx={cx} cy={cy} r={3} fill="#111118"/>

          {/* AQI value */}
          <text x={cx} y={cy - 40} textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize="68" fontWeight="900" fontFamily="Syne, sans-serif"
            filter="url(#nGlow)">
            {displayAQI}
          </text>

          {/* "AQI" label */}
          <text x={cx} y={cy - 3} textAnchor="middle"
            fill="#4a4a5a" fontSize="10" fontFamily="DM Mono, monospace" letterSpacing="3">
            AQI
          </text>

          {/* Category pill */}
          <rect x={cx - 52} y={cy + 7} width="104" height="22" rx="11"
            fill={`${color}22`} stroke={`${color}55`} strokeWidth="1"/>
          <text x={cx} y={cy + 20} textAnchor="middle"
            fill={color} fontSize="10" fontWeight="700" fontFamily="Syne, sans-serif" letterSpacing="1.5">
            {cat.toUpperCase()}
          </text>
        </svg>
      </div>

      {/* Dominant pollutant row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '10px 14px', marginTop: '10px',
        fontFamily: 'var(--font-mono)', fontSize: '12px',
      }}>
        <span style={{ color: 'var(--text-dim)' }}>Dominant Pollutant</span>
        {pollutants?.dominantPollutant ? (
          <span style={{
            color: color, fontWeight: '700',
            background: `${color}18`, padding: '3px 12px',
            borderRadius: '5px', border: `1px solid ${color}40`,
          }}>
            {pollutants.dominantPollutant}
          </span>
        ) : <span style={{ color: 'var(--text-dim)' }}>—</span>}
      </div>
    </div>
  );
}
