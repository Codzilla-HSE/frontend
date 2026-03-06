import { useUser } from '../context/UserContext';
import SettingsModal from './components/ui/SettingsModal';
import { useState, useEffect } from 'react';
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LeftWorkspace from './components/workspace/LeftWorkspace';
import RightWorkspace from './components/workspace/RightWorkspace';
import './WorkspacePage.css';

function WorkspacePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <Header onSettingsClick={() => setShowSettings(true)} />

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

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={handleLogout}
        themeConfig={{ isDarkMode, setIsDarkMode }}
        workspaceConfig={{ isSwapped, setIsSwapped }}
      />

    </div>
  );
}

export default WorkspacePage;