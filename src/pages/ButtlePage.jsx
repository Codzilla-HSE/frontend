import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './ButtlePage.css';
import './WorkspacePage.css';

export default function ButtlePage() {
  const navigate = useNavigate();
  const currentUser = { nickname: "CodeNinja" };
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <Header user={currentUser} onSettingsClick={() => setShowSettings(true)} />
      
      <main className="buttle-main">
        <h1 className="buttle-title">Арена CodeZilla</h1>
        <p className="buttle-subtitle">
          Выбери задачу, напиши оптимальный код и разгроми соперника
        </p>

        <button className="btn-battle" onClick={() => navigate('/workspace')}>
          В БОЙ!
        </button>
      </main>

      <Footer />

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Настройки</h3>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button 
                className="btn" 
                style={{ background: '#d32f2f', color: '#fff', border: 'none' }} 
                onClick={handleLogout}
              >
                Выйти
              </button>
              <button className="btn" onClick={() => setShowSettings(false)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}