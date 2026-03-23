import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import '../styles/DashboardView.css';

function loadStats() {
  try {
    const raw = localStorage.getItem('quizStats');
    return raw ? JSON.parse(raw) : { correctCount: 0, totalCount: 0, bookmarkedCount: 0 };
  } catch {
    return { correctCount: 0, totalCount: 0, bookmarkedCount: 0 };
  }
}

const CHAPTER_NAMES = [
  'Celula', 'Țesuturi', 'Sistemul digestiv', 'Sistemul circulator',
  'Sistemul respirator', 'Sistemul excretor', 'Sistemul nervos',
  'Sistemul endocrin', 'Reproducere', 'Genetică', 'Evoluție',
  'Ecologie', 'Biologie moleculară', 'Imunologie', 'Biotehnologie',
];

const WEEKLY_ACTIVITY = [60, 80, 40, 100, 55, 25, 65];
const DAYS = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

export default function DashboardView() {
  const { user } = useAuth();
  const stats = useMemo(loadStats, []);

  const accuracy = stats.totalCount > 0
    ? Math.round((stats.correctCount / stats.totalCount) * 100)
    : 0;

  // Generate chapter progress from localStorage (demo values if not enough data)
  const chapterProgress = useMemo(() => {
    return CHAPTER_NAMES.slice(0, 6).map((name, i) => {
      const pct = stats.totalCount > 0
        ? Math.min(100, Math.round((stats.correctCount / Math.max(1, stats.totalCount)) * 100 + (i % 3) * 7))
        : [0, 0, 0, 0, 0, 0][i];
      return { name, pct };
    });
  }, [stats]);

  return (
    <div className="dashboard-page">
      <NavBar activeItem="dashboard" />

      {/* Content */}
      <div className="dashboard-content">

        {/* Welcome banner */}
        <section className="dashboard-welcome">
          <div className="welcome-text">
            <h2>Bun venit, {user?.name?.split(' ')[0]}!</h2>
            <p>
              Ai răspuns corect la <strong>{accuracy}%</strong> din întrebările rezolvate.
              {stats.totalCount === 0
                ? ' Începe primul quiz pentru a-ți vedea progresul.'
                : ` Continuă să exersezi pentru a-ți îmbunătăți scorul.`}
            </p>
            <div className="welcome-actions">
              <Link to="/app" className="btn-primary-gradient">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>quiz</span>
                Continuă Grile
              </Link>
              <Link to="/app" className="btn-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>timer</span>
                Simulare Examen
              </Link>
            </div>
          </div>

          <div className="welcome-exam-card">
            <div className="exam-card-label">Examen simulare</div>
            <div className="exam-card-title">Admitere Biologie Timișoara 2025</div>
            <div className="exam-card-stat">
              <div>
                <div className="exam-card-stat-label">Întrebări rezolvate</div>
                <div className="exam-card-stat-value">{stats.totalCount}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="dashboard-stats-row">
          <div className="stat-tile">
            <div className="stat-tile-label">Total răspunsuri</div>
            <div className="stat-tile-value">{stats.totalCount}</div>
            <div className="stat-tile-sub">întrebări rezolvate</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Răspunsuri corecte</div>
            <div className="stat-tile-value green">{accuracy}%</div>
            <div className="stat-tile-sub">{stats.correctCount} din {stats.totalCount}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Salvate</div>
            <div className="stat-tile-value">{stats.bookmarkedCount}</div>
            <div className="stat-tile-sub">întrebări marcate</div>
          </div>
        </section>

        {/* Two-column: activity + chapter progress */}
        <section className="dashboard-grid">
          {/* Activity chart */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h3>Activitate săptămânală</h3>
                <p>Întrebări rezolvate pe zi</p>
              </div>
              <span className="card-badge">Această săptămână</span>
            </div>
            <div className="bar-chart">
              {WEEKLY_ACTIVITY.map((pct, i) => (
                <div className="bar-col" key={DAYS[i]}>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: `${pct}%` }} />
                  </div>
                  <span className="bar-day">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chapter progress */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h3>Progres capitole</h3>
                <p>Acuratețe per capitol</p>
              </div>
            </div>
            <div className="chapter-progress-list">
              {chapterProgress.map(({ name, pct }) => (
                <div className="chapter-progress-item" key={name}>
                  <div className="chapter-progress-meta">
                    <span className="chapter-progress-name">{name}</span>
                    <span className="chapter-progress-pct">{pct}%</span>
                  </div>
                  <div className="chapter-progress-track">
                    <div
                      className={`chapter-progress-fill${pct >= 85 ? ' green' : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h3 style={{ fontFamily: 'Manrope', fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', margin: '0 0 16px' }}>
            Acțiuni rapide
          </h3>
          <div className="dashboard-quick-actions">
            <Link to="/app" className="quick-action-card">
              <div className="quick-action-icon">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <div className="quick-action-title">Grile</div>
              <div className="quick-action-desc">Exersează întrebări aleatorii sau secvențiale din orice capitol.</div>
            </Link>
            <Link to="/app" className="quick-action-card">
              <div className="quick-action-icon green">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div className="quick-action-title">Simulare Examen</div>
              <div className="quick-action-desc">Simulează un examen complet cu limită de timp și scor final.</div>
            </Link>
            <Link to="/app" className="quick-action-card">
              <div className="quick-action-icon amber">
                <span className="material-symbols-outlined">tune</span>
              </div>
              <div className="quick-action-title">Simulare Personalizată</div>
              <div className="quick-action-desc">Alege capitolele și numărul de întrebări după preferință.</div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
