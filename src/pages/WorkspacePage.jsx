import { useUser } from '../context/UserContext';
import SettingsModal from './components/ui/SettingsModal';
import { useState, useEffect } from 'react';
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {useNavigate, useParams} from 'react-router-dom';
import { useParcelPolling } from './useParcelPolling';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LeftWorkspace from './components/workspace/LeftWorkspace';
import RightWorkspace from './components/workspace/RightWorkspace';
import './WorkspacePage.css';
import MatchResultOverlay from './MatchResultOverlay';
import { useMatchStore } from "./useMatchStore.js";

function WorkspacePage() {
  const {matchId} = useParams();
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { submissions } = useParcelPolling();

  const matchResult = useMatchStore((state) => state.matchResult);

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
            <RightWorkspace position="left" submissions={submissions}  />
          ) : (
            <LeftWorkspace isDarkMode={isDarkMode} position="left" submissions = {submissions} matchId = {matchId} />
          )}
          
          <PanelResizeHandle className="resizer-vertical">
            <div className="resizer-line-vertical"></div>
          </PanelResizeHandle>
          
          {isSwapped ? (
            <LeftWorkspace isDarkMode={isDarkMode} position="right" />
          ) : (
            <RightWorkspace position="right" submissions={submissions} />
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

      {matchResult && (
          <MatchResultOverlay
              outcome={matchResult.outcome}
              newRating={matchResult.newRating}
              ratingDelta={matchResult.ratingDelta}
          />
      )}

    </div>
  );
}

export default WorkspacePage;