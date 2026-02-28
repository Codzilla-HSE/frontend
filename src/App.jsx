import { useState, useEffect, useRef, useCallback } from 'react';
import LeftWorkspace from './components/LeftWorkspace';
import RightWorkspace from './components/RightWorkspace';
import { VerticalResizer } from './components/ui/Resizers';
import './App.css';

function App() {
  const [mainSplitState, setMainSplitState] = useState(50);
  const [leftColSplitState, setLeftColSplitState] = useState(70);
  const [rightColSplitState, setRightColSplitState] = useState(50);

  const [activeResizer, setActiveResizer] = useState(null);

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# Напишите ваш код здесь...');

  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);

  const startDragging = useCallback((resizerId) => (e) => {
    setActiveResizer(resizerId);
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!activeResizer) return;

    const handleMouseMove = (e) => {
      if (activeResizer === 'main-vertical') {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 80) setMainSplitState(newWidth);
      } 
      else if (activeResizer === 'left-horizontal' && leftColumnRef.current) {
        const rect = leftColumnRef.current.getBoundingClientRect();
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        if (newHeight > 15 && newHeight < 85) setLeftColSplitState(newHeight);
      }
      else if (activeResizer === 'right-horizontal' && rightColumnRef.current) {
        const rect = rightColumnRef.current.getBoundingClientRect();
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        if (newHeight > 15 && newHeight < 85) setRightColSplitState(newHeight);
      }
    };

    const handleMouseUp = () => setActiveResizer(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeResizer]);

  let cursorStyle = 'default';
  if (activeResizer === 'main-vertical') cursorStyle = 'col-resize';
  if (activeResizer === 'left-horizontal' || activeResizer === 'right-horizontal') cursorStyle = 'row-resize';

  return (
    <div className="layout-container" style={{ cursor: cursorStyle }}>
      
      {/* ШАПКА СТРАНИЦЫ */}
      <header className="page-header">
        <h2>CodeZilla</h2>
      </header>

      {/* РАБОЧЕЕ ПРОСТРАНСТВО */}
      <main className="workspace">
        
        <LeftWorkspace 
          ref={leftColumnRef}
          width={mainSplitState}
          splitState={leftColSplitState}
          activeResizer={activeResizer}
          startDragging={startDragging}
          language={language}
          setLanguage={setLanguage}
          code={code}
          setCode={setCode}
        />

        <VerticalResizer 
          isDragging={activeResizer === 'main-vertical'} 
          onMouseDown={startDragging('main-vertical')} 
        />

        <RightWorkspace 
          ref={rightColumnRef}
          width={100 - mainSplitState}
          splitState={rightColSplitState}
          activeResizer={activeResizer}
          startDragging={startDragging}
        />

      </main>

      {/* ДНО / ФУТЕР (если понадобится) */}
      {/* <footer className="page-footer"> ... </footer> */}
      
    </div>
  );
}

export default App;