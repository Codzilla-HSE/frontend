import { useUser } from '../../../context/UserContext';
import { User, Settings, Swords, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {useState} from "react";

export default function Header({ onSettingsClick, onNavClick }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [imageError, setImageError] = useState(false);
  const handleGenericNav = () => {
    if (onNavClick) {
      onNavClick();
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    if (location.pathname === '/workspace') {
      const confirmLeave = window.confirm("Вы точно хотите покинуть битву? Ваш прогресс может быть потерян.");
      if (confirmLeave) {
        navigate('/battle');
      }
    } else {
      navigate('/battle');
    }
  };

  const handleSettings = () => {
    if (!user) {
      handleGenericNav();
      return;
    }
    
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  return (
    <header className="page-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="header-logo" onClick={handleGenericNav} style={{ cursor: 'pointer' }}>
          <h2>CodeZilla</h2>
        </div>
        <nav className="header-nav">
          <span onClick={handleGenericNav} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <Swords size={18} /> PVP
          </span>
        </nav>
      </div>
      
      <div className="header-actions">
        <div className="header-icon" title="Настройки" onClick={handleSettings}>
          <Settings size={22} />
        </div>
        
        {user ? (

          <div className="header-profile" title="Профиль пользователя" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.nickname}</span>
            <span onClick={() => navigate('/profile')}>
            {imageError || !user.iconUrl ? (
                <div className="avatar-placeholder">
                  <User size={20} />
                </div>
            ) : (
                <img
                    src={user.iconUrl}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    onError={() => setImageError(true)}
                />
            )}
              </span>
          </div>
        ) : (
          <button 
            className="btn" 
            onClick={handleGenericNav}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogIn size={16} /> Войти
          </button>
        )}
      </div>
    </header>
  );
}