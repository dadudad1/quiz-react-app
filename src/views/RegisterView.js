import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function RegisterView() {
  const { register, authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    const ok = register(name, email, password, confirmPassword);
    if (ok) {
      navigate('/dashboard');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        Grile-Admitere
        <span>Pregătire Admitere Biologie</span>
      </div>

      <div className="auth-card">
        <h1>Creează cont</h1>
        <p className="auth-subtitle">Înregistrează-te și începe să înveți eficient.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {authError && (
            <div className="auth-error">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
              {authError}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="name">Nume complet</label>
            <input
              id="name"
              type="text"
              placeholder="Ion Popescu"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@exemplu.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Parolă</label>
            <input
              id="password"
              type="password"
              placeholder="Minim 6 caractere"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirmă parola</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Se creează contul…' : 'Creează cont'}
          </button>
        </form>

        <div className="auth-footer">
          Ai deja cont?
          <Link to="/login">Autentifică-te</Link>
        </div>
      </div>
    </div>
  );
}
