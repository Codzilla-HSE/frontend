import { useState, useEffect } from 'react';
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LeftWorkspace from './components/workspace/LeftWorkspace';
import RightWorkspace from './components/workspace/RightWorkspace';
import './WorkspacePage.css';

function WorkspacePage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const currentUser = { nickname: "CodeNinja" };

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

      <main className="workspace">
        <PanelGroup direction="horizontal">
          {isSwapped ? (
            <RightWorkspace position="left" />
          ) : (
            <LeftWorkspace isDarkMode={isDarkMode} position="left" />
          )}
          
          <PanelResizeHandle className="resizer-vertical">
            <div className="resizer-line-vertical"></div>
          </PanelResizeHandle>
          
          {isSwapped ? (
            <LeftWorkspace isDarkMode={isDarkMode} position="right" />
          ) : (
            <RightWorkspace position="right" />
          )}
        </PanelGroup>
      </main>

      <Footer />

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Настройки</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '15px 0' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <span>Светлая тема</span>
                <input 
                  type="checkbox" 
                  checked={!isDarkMode} 
                  onChange={() => setIsDarkMode(!isDarkMode)} 
                />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <span>Поменять панели местами</span>
                <input 
                  type="checkbox" 
                  checked={isSwapped} 
                  onChange={() => setIsSwapped(!isSwapped)} 
                />
              </label>
            </div>
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

export default WorkspacePage;