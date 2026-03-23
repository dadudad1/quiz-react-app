import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import '../styles/ProfileView.css';

function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function loadRandomizePref() {
  try {
    const raw = localStorage.getItem('randomizeAnswers');
    return raw !== null ? JSON.parse(raw) : true;
  } catch {
    return true;
  }
}

export default function ProfileView() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(user?.name || '');
  const [savedName, setSavedName] = useState(false);
  const [randomize, setRandomize] = useState(loadRandomizePref);

  useEffect(() => {
    setEditName(user?.name || '');
  }, [user?.name]);

  const handleSaveName = () => {
    if (!editName.trim()) return;
    updateUser({ name: editName.trim() });
    setSavedName(true);
    setTimeout(() => setSavedName(false), 2500);
  };

  const handleToggleRandomize = () => {
    const next = !randomize;
    setRandomize(next);
    try {
      localStorage.setItem('randomizeAnswers', JSON.stringify(next));
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <NavBar activeItem="profile" />

      <div className="profile-content">
        <div>
          <h1 className="profile-page-title">Profil & Setări</h1>
          <p className="profile-page-subtitle">Gestionează contul și preferințele de studiu.</p>
        </div>

        {/* Profile header */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">{getInitials(user?.name)}</div>
          <div className="profile-header-info">
            <div className="profile-header-name">{user?.name}</div>
            <div className="profile-header-email">{user?.email}</div>
            <div className="profile-header-badge">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>school</span>
              Student
            </div>
          </div>
        </div>

        {/* Account settings */}
        <div className="profile-section">
          <div className="profile-section-header">
            <span className="material-symbols-outlined">manage_accounts</span>
            <h2>Setări cont</h2>
          </div>

          <div className="profile-edit-form">
            <div className="profile-edit-row">
              <div className="profile-edit-field">
                <label htmlFor="editName">Nume afișat</label>
                <input
                  id="editName"
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Numele tău"
                />
              </div>
              <button
                className="profile-save-btn"
                onClick={handleSaveName}
                disabled={!editName.trim() || editName.trim() === user?.name}
              >
                Salvează
              </button>
            </div>

            {savedName && (
              <div className="profile-save-success">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                Numele a fost actualizat!
              </div>
            )}

            <div className="profile-edit-field">
              <label htmlFor="editEmail">Email</label>
              <input
                id="editEmail"
                type="email"
                value={user?.email || ''}
                disabled
                title="Modificarea emailului va fi disponibilă după integrarea backend-ului."
              />
            </div>
          </div>
        </div>

        {/* Study preferences */}
        <div className="profile-section">
          <div className="profile-section-header">
            <span className="material-symbols-outlined">tune</span>
            <h2>Preferințe studiu</h2>
          </div>

          <div
            className="profile-setting-row"
            style={{ cursor: 'pointer' }}
            onClick={handleToggleRandomize}
          >
            <div className="profile-setting-left">
              <div className="profile-setting-icon">
                <span className="material-symbols-outlined">shuffle</span>
              </div>
              <div className="profile-setting-text">
                <div className="profile-setting-title">Răspunsuri aleatorii</div>
                <div className="profile-setting-desc">
                  {randomize ? 'Variantele sunt amestecate la fiecare întrebare.' : 'Variantele sunt afișate în ordine fixă (A, B, C…).'}
                </div>
              </div>
            </div>
            <label className="profile-toggle" onClick={e => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={randomize}
                onChange={handleToggleRandomize}
              />
              <span className="profile-toggle-slider" />
            </label>
          </div>

          <div className="profile-setting-row">
            <div className="profile-setting-left">
              <div className="profile-setting-icon">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div className="profile-setting-text">
                <div className="profile-setting-title">Notificări email</div>
                <div className="profile-setting-desc">Rezumat zilnic și reminder-e de studiu.</div>
              </div>
            </div>
            <label className="profile-toggle">
              <input type="checkbox" defaultChecked />
              <span className="profile-toggle-slider" />
            </label>
          </div>

          <div className="profile-setting-row">
            <div className="profile-setting-left">
              <div className="profile-setting-icon">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <div className="profile-setting-text">
                <div className="profile-setting-title">Mod întunecat</div>
                <div className="profile-setting-desc">Disponibil în curând.</div>
              </div>
            </div>
            <label className="profile-toggle">
              <input type="checkbox" disabled />
              <span className="profile-toggle-slider" style={{ opacity: 0.4 }} />
            </label>
          </div>
        </div>

        {/* Danger zone */}
        <div className="profile-danger-section">
          <div className="profile-section-header">
            <span className="material-symbols-outlined">logout</span>
            <h2>Cont</h2>
          </div>
          <button className="btn-danger" onClick={handleLogout}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Deconectează-te
          </button>
        </div>
      </div>
    </div>
  );
}
