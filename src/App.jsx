// src/App.jsx
import { useState, useEffect } from 'react';
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ActionBar from './components/layout/ActionBar';
import LeftWorkspace from './components/workspace/LeftWorkspace';
import RightWorkspace from './components/workspace/RightWorkspace';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="layout-container">
      <Header />
      
      <ActionBar 
        toggleSwap={() => setIsSwapped(!isSwapped)} 
        toggleFullscreen={toggleFullscreen} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        isDarkMode={isDarkMode} 
      />

      <main className="workspace">
        <PanelGroup direction="horizontal">
          {isSwapped ? <RightWorkspace /> : <LeftWorkspace isDarkMode={isDarkMode} />}
          
          <PanelResizeHandle className="resizer-vertical">
            <div className="resizer-line-vertical"></div>
          </PanelResizeHandle>
          
          {isSwapped ? <LeftWorkspace isDarkMode={isDarkMode} /> : <RightWorkspace />}
        </PanelGroup>
      </main>

      <Footer />
    </div>
  );
}

export default App;