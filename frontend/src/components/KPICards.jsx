import React from 'react';
import { getAQIColor } from '../utils';

export default function KPICards({ stats, latest }) {
  const cards = [
    {
      label: 'Total Readings',
      value: stats?.totalReadings?.toLocaleString() || '—',
      sub: '8 areas × 30 days',
      icon: '📊',
      color: '#7c6bff'
    },
    {
      label: 'Avg AQI (All Areas)',
      value: stats?.avgAQI || '—',
      sub: 'Rolling average',
      icon: '📈',
      color: getAQIColor(stats?.avgAQI || 0)
    },
    {
      label: 'Most Polluted',
      value: stats?.worstCity || '—',
      sub: 'Highest current AQI',
      icon: '🏭',
      color: '#d50000'
    },
    {
      label: 'Cleanest Air',
      value: stats?.bestCity || '—',
      sub: 'Lowest current AQI',
      icon: '🌿',
      color: '#00c853'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
      animation: 'fadeUp 0.6s ease both'
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
          animationDelay: `${i * 0.1}s`,
          animation: 'fadeUp 0.6s ease both',
          transition: 'border-color 0.3s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = card.color}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: card.color, opacity: 0.8
          }} />
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
          <div style={{
            fontSize: '28px', fontWeight: '800', color: card.color,
            fontFamily: 'var(--font-display)', lineHeight: 1,
            textShadow: `0 0 20px ${card.color}40`
          }}>
            {card.value}
          </div>
          <div style={{
            fontSize: '12px', fontWeight: '600', color: 'var(--text)',
            marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            {card.label}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
