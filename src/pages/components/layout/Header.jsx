import { User, Settings, Swords, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ user, onSettingsClick }) {
  const navigate = useNavigate();
  const location = useLocation(); // Позволяет узнать текущий путь

  const handleLogoClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (location.pathname === '/workspace') {
      const confirmLeave = window.confirm("Вы точно хотите покинуть битву? Ваш прогресс может быть потерян.");
      if (confirmLeave) {
        navigate('/buttle');
      }
    } else {
      navigate('/buttle');
    }
  };

  return (
    <header className="page-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="header-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <h2>CodeZilla</h2>
        </div>
        <nav className="header-nav">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Swords size={18} /> PVP
          </span>
        </nav>
      </div>
      
      <div className="header-actions">
        <div className="header-icon" title="Настройки" onClick={onSettingsClick}>
          <Settings size={22} />
        </div>
        
        {user ? (
          <div className="header-profile" title="Профиль пользователя" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.nickname}</span>
             <User size={24} />
          </div>
        ) : (
          <button 
            className="btn" 
            onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogIn size={16} /> Войти
          </button>
        )}
      </div>
    </header>
  );
}