import React from 'react';
import '../styles/FutureImplementationsModal.css';

const FutureImplementationsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Implementări Viitoare</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <h3>În Curând</h3>
          <ul className="features-list">
            <li>
              <strong>Grile de admitere 2025</strong>
              <p>Adaugă grilele de admitere 2025 în aplicație.</p>
            </li>
            <li>
              <strong>Progres pe capitole</strong>
              <p>Urmărește performanța ta pentru fiecare capitol în parte.</p>
            </li>
            <li>
              <strong>Mod de învățare</strong>
              <p>Focus pe întrebările cu răspunsuri greșite pentru a îmbunătăți rezultatele.</p>
            </li>
            <li>
              <strong>Lansare aplicație mobilă</strong>
              <p>Accesează aplicația pe orice dispozitiv cu Android sau iOS.</p>
            </li>
          </ul>
          
          <h3>Sugestii?</h3>
          <p className="suggestions-text">
            Ai idei pentru îmbunătățirea aplicației? Completează 
            <a href="https://forms.gle/m347WXBf3U2Jz9KDA" className="contact-link" target="_blank" rel="noopener noreferrer">formularul de sugestii</a>
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Închide</button>
        </div>
      </div>
    </div>
  );
};

export default FutureImplementationsModal; 