import React from 'react';
import { getAQIColor, getHealthAdvice, getAQIEmoji } from '../utils';

export default function HealthAdvisory({ aqi, city }) {
  if (!aqi) return null;
  const color = getAQIColor(aqi);
  const advice = getHealthAdvice(aqi);
  const emoji = getAQIEmoji(aqi);

  return (
    <div style={{
      background: `${color}10`,
      border: `1px solid ${color}40`,
      borderLeft: `4px solid ${color}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      animation: 'fadeUp 0.6s ease 0.2s both'
    }}>
      <div style={{ fontSize: '32px' }}>{emoji}</div>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
          Health Advisory — {city}
        </div>
        <div style={{ color, fontWeight: '600', fontSize: '14px' }}>{advice}</div>
      </div>
    </div>
  );
}
