import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function LoginView() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login('guest@grile-admitere.ro', 'guest');
    navigate('/app');
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        Grile-Admitere
        <span>Pregătire Admitere Biologie</span>
      </div>

      <div className="auth-card">
        <h1>Bun venit!</h1>
        <p className="auth-subtitle">Apasă butonul pentru a începe să exersezi.</p>

        <button className="auth-submit" onClick={handleLogin}>
          Începe grile
        </button>
      </div>
    </div>
  );
}
