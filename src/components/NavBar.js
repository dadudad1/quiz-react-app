import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FutureImplementationsModal from './FutureImplementationsModal';
import '../styles/NavBar.css';

function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * activeItem: 'dashboard' | 'quiz' | 'simulation' | 'customSimulation' | 'profile'
 * onModeChange: optional — when provided, mode buttons call it instead of navigating
 */
export default function NavBar({ activeItem, onModeChange }) {
  const { user } = useAuth();
  const location = useLocation();
  const onAppPage = location.pathname === '/app';
  const [modalOpen, setModalOpen] = useState(false);

  const modeLink = (mode, label, icon) => {
    const isActive = activeItem === mode;

    if (onAppPage && onModeChange) {
      return (
        <button
          className={`navbar-link${isActive ? ' active' : ''}`}
          onClick={() => onModeChange(mode)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
          <span className="navbar-link-label">{label}</span>
        </button>
      );
    }

    return (
      <Link
        to="/app"
        state={{ mode }}
        className={`navbar-link${isActive ? ' active' : ''}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
        <span className="navbar-link-label">{label}</span>
      </Link>
    );
  };

  return (
    <>
      <FutureImplementationsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <nav className="app-navbar">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          Grile-Admitere
        </Link>

        {/* Center links */}
        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`navbar-link${activeItem === 'dashboard' ? ' active' : ''}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dashboard</span>
            <span className="navbar-link-label">Dashboard</span>
          </Link>

          {modeLink('quiz', 'Grile', 'quiz')}
          {modeLink('simulation', 'Simulare Examen', 'timer')}
          {modeLink('customSimulation', 'Simulare Personalizată', 'tune')}

          <Link
            to="/profile"
            className={`navbar-link${activeItem === 'profile' ? ' active' : ''}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>settings</span>
            <span className="navbar-link-label">Setări</span>
          </Link>
        </div>

        {/* Right: news + donate + avatar */}
        <div className="navbar-right">
          <button
            className="navbar-action-btn"
            onClick={() => setModalOpen(true)}
            title="Noutăți & Implementări Viitoare"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>campaign</span>
            <span className="navbar-action-label">Noutăți</span>
          </button>

          <a
            href="https://revolut.me/dragoscdk"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-donate-btn"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>favorite</span>
            <span className="navbar-action-label">Donează</span>
          </a>

          {user && (
            <Link to="/profile" className="navbar-avatar-btn">
              <div className="navbar-avatar-circle">{getInitials(user.name)}</div>
              <span className="navbar-avatar-name">{user.name}</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
