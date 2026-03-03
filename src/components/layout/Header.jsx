import { User, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="page-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="header-logo">
          <h2>CodeZilla</h2>
        </div>
        <nav className="header-nav">
          <span>Задачи</span>
          <span>Контест</span>
        </nav>
      </div>
      
      {/* Новый блок с иконками */}
      <div className="header-actions">
        <div className="header-icon" title="Настройки">
          <Settings size={22} />
        </div>
        <div className="header-icon" title="Профиль пользователя">
          <User size={24} />
        </div>
      </div>
    </header>
  );
}