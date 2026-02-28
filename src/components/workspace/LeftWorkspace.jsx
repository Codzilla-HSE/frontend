import { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { Code, Terminal, Upload, RotateCcw } from 'lucide-react';

import PanelHeader from '../ui/PanelHeader';
import { RunButton, SubmitButton } from '../ui/Buttons';
import Timer from '../ui/Timer';
import ConfirmModal from '../ui/ConfirmModal';

const DEFAULT_CODE = "# Напишите ваш код здесь...\n";

export default function LeftWorkspace({ isDarkMode }) {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [showResetModal, setShowResetModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setCode(evt.target.result);
    reader.readAsText(file);
    e.target.value = ''; // Сброс инпута
  };

  const confirmReset = () => {
    setCode(DEFAULT_CODE);
    setShowResetModal(false);
  };

  return (
    <Panel defaultSize={50} minSize={20} className="column-container left-column">
      <PanelGroup direction="vertical">
        
        {/* Панель Кода */}
        <Panel defaultSize={70} minSize={15} className="panel">
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

                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} accept=".js,.py,.cpp,.txt" />
                <button className="btn icon-btn" onClick={() => fileInputRef.current.click()} title="Загрузить из файла">
                  <Upload size={16} />
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
        </Panel>

        <PanelResizeHandle className="resizer-horizontal">
           <div className="resizer-line-horizontal"></div>
        </PanelResizeHandle>

         {/* Панель Тестов */}
        <Panel defaultSize={30} minSize={15} className="panel">
           <PanelHeader title="Результаты тестов" Icon={Terminal} />
           <div className="panel-content">
              <p style={{color: 'var(--text-secondary)', fontStyle: 'italic'}}>Здесь будут результаты запуска...</p>
           </div>
        </Panel>

      </PanelGroup>

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