import { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { Code, Terminal, Import, RotateCcw, Expand } from 'lucide-react';

import PanelHeader from '../ui/PanelHeader';
import { RunButton, SubmitButton } from '../ui/Buttons';
import Timer from '../ui/Timer';
import ConfirmModal from '../ui/ConfirmModal';

const DEFAULT_CODE = "# Напишите ваш код здесь...\n";

export default function LeftWorkspace({ isDarkMode, position = 'left' }) {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [showResetModal, setShowResetModal] = useState(false);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const codeContainerRef = useRef(null); 

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setCode(evt.target.result);
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmReset = () => {
    setCode(DEFAULT_CODE);
    setShowResetModal(false);
  };

  const toggleEditorFullscreen = () => {
    if (!document.fullscreenElement) {
      codeContainerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Panel 
      ref={panelRef}
      collapsible={true}
      collapsedSize={3}
      onCollapse={() => setIsCollapsed(true)}
      onExpand={() => setIsCollapsed(false)}
      defaultSize={50} 
      minSize={4} 
      className={`column-container ${position}-column`}
    >
      {isCollapsed ? (
        <div 
          className="collapsed-vertical-bar" 
          onClick={() => panelRef.current?.expand()}
          title="Развернуть"
        >
          <div className="collapsed-text">
            <Code size={16} /> Код & Тесты
          </div>
        </div>
      ) : (
        <PanelGroup direction="vertical">
          <Panel defaultSize={70} minSize={15} className="panel">
            <div 
              ref={codeContainerRef} 
              style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-panel)' }}
            >
              <PanelHeader title="Код" Icon={Code} />
              
              <div className="toolbar-container">
                 <div className="toolbar">
                    <RunButton />
                    <SubmitButton />
                    <Timer />
                    
                    <select 
                      className="language-select" 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="javascript">JavaScript</option>
                    </select>

                    <button className="btn icon-btn" onClick={() => setShowResetModal(true)} title="Сбросить код">
                      <RotateCcw size={16} />
                    </button>

                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileImport} accept=".js,.py,.cpp,.txt" />
                    <button className="btn icon-btn" onClick={() => fileInputRef.current.click()} title="Загрузить из файла">
                      <Import size={16} />
                    </button>
                    
                    <button className="btn icon-btn" onClick={toggleEditorFullscreen} title="Развернуть/свернуть окно">
                      <Expand size={16} />
                    </button>
                 </div>
              </div>

              <div className="editor-wrapper">
                <Editor
                  height="100%"
                  theme={isDarkMode ? "vs-dark" : "light"}
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value)}
                  options={{ fontSize: 15, minimap: { enabled: false }, automaticLayout: true, padding: { top: 10 } }}
                />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="resizer-horizontal">
             <div className="resizer-line-horizontal"></div>
          </PanelResizeHandle>

          <Panel defaultSize={30} minSize={15} className="panel">
             <PanelHeader title="Результаты тестов" Icon={Terminal} />
             <div className="panel-content">
                <p style={{color: 'var(--text-secondary)', fontStyle: 'italic'}}>Здесь будут результаты запуска...</p>
             </div>
          </Panel>
        </PanelGroup>
      )}

      <ConfirmModal 
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmReset}
        title="Сбросить решение?"
        text="Весь написанный вами код будет удален и заменен на стандартный шаблон. Это действие нельзя отменить."
      />
    </Panel>
  );
}