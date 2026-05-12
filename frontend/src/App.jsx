import React, { useEffect, useState } from 'react';
import axios from 'axios';
import KPICards from './components/KPICards';
import AQIGauge from './components/AQIGauge';
import CityCompareChart from './components/CityCompareChart';
import TrendChart from './components/TrendChart';
import PollutantChart from './components/PollutantChart';
import HeatmapChart from './components/HeatmapChart';
import HealthAdvisory from './components/HealthAdvisory';
import { getAQIColor } from './utils';

const AREAS = [
  'Silk Board', 'Marathahalli', 'Hebbal', 'Whitefield',
  'Jayanagar', 'Koramangala', 'Yelahanka', 'BTM Layout'
];

export default function App() {
  const [stats,        setStats]        = useState(null);
  const [compare,      setCompare]      = useState([]);
  const [selectedArea, setSelectedArea] = useState('Silk Board');
  const [trend,        setTrend]        = useState([]);
  const [pollutants,   setPollutants]   = useState(null);
  const [latestAQI,    setLatestAQI]    = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [lastUpdated,  setLastUpdated]  = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get('/api/aqi/stats'),
      axios.get('/api/aqi/compare')
    ]).then(([s, c]) => {
      setStats(s.data);
      setCompare(c.data);
      setLoading(false);
      setLastUpdated(new Date());
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedArea) return;
    Promise.all([
      axios.get(`/api/aqi/trend/${encodeURIComponent(selectedArea)}`),
      axios.get(`/api/aqi/pollutants/${encodeURIComponent(selectedArea)}`)
    ]).then(([trendRes, pollRes]) => {
      setTrend(trendRes.data);
      setPollutants(pollRes.data);
      setLatestAQI(pollRes.data.aqi);
    }).catch(console.error);
  }, [selectedArea]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '14px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #00d4aa, #7c6bff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
          }}>🌬</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', letterSpacing: '-0.02em' }}>Bengaluru AQI</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Area-level Air Quality Monitor
            </div>
          </div>
        </div>

        {/* Area selector in header */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {AREAS.map(area => {
            const areaData = compare.find(c => c.city === area);
            const ac  = getAQIColor(areaData?.aqi || 0);
            const sel = area === selectedArea;
            return (
              <button key={area} onClick={() => setSelectedArea(area)} style={{
                padding: '5px 12px', borderRadius: '6px',
                border: `1px solid ${sel ? ac : 'var(--border)'}`,
                background: sel ? `${ac}20` : 'transparent',
                color: sel ? ac : 'var(--text-dim)',
                fontFamily: 'var(--font-mono)', fontWeight: sel ? '700' : '400',
                fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: ac, flexShrink: 0 }}/>
                {area}
                {areaData && <span style={{ fontSize: '10px', opacity: 0.75 }}>{areaData.aqi}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c853', animation: 'pulse 2s infinite' }}/>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-IN')}` : 'Loading...'}
          </span>
        </div>
      </header>

      <main style={{ padding: '24px 32px', maxWidth: '1600px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
            <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Fetching air quality data...</div>
          </div>
        ) : (
          <>
            <KPICards stats={stats} />

            {/* Health Advisory */}
            {latestAQI && (
              <div style={{ marginBottom: '16px' }}>
                <HealthAdvisory aqi={latestAQI} city={selectedArea} />
              </div>
            )}

            {/* ── ROW 1: 3 equal columns ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}>
              {/* Col 1: Live AQI Gauge */}
              <AQIGauge aqi={latestAQI || 0} city={selectedArea} pollutants={pollutants} />

              {/* Col 2: Pollutant Donut */}
              <PollutantChart data={pollutants} />

              {/* Col 3: 30-day Trend */}
              <TrendChart data={trend} city={selectedArea} />
            </div>

            {/* ── ROW 2: 2 equal columns ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}>
              {/* Col 1: Area bar comparison */}
              <CityCompareChart data={compare} />

              {/* Col 2: Heatmap */}
              <HeatmapChart />
            </div>

            {/* ── Footer ── */}
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              Bengaluru AQI Dashboard — React + Express + MongoDB + Docker → AWS EC2
              <br/>
              <span style={{ color: '#2a2a38' }}>Cloud Computing AAT — BMS College of Engineering</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
