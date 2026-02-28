import { User } from 'lucide-react';

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
      
      <div className="header-profile" title="Профиль пользователя">
        <User size={24} />
      </div>
    </header>
  );
}