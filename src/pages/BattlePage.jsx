import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SettingsModal from './components/ui/SettingsModal';
import './BattlePage.css';

export default function BattlePage() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="battle-main">
        <h1 className="battle-title">Арена CodeZilla</h1>
        <p className="battle-subtitle">
          Выбери задачу, напиши оптимальный код и разгроми соперника
        </p>

        <button className="btn-battle" onClick={() => navigate('/workspace')}>
          В БОЙ!
        </button>
      </main>

      <Footer />

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}