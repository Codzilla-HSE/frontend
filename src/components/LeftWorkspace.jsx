import { forwardRef } from 'react';
import Editor from "@monaco-editor/react";
import PanelHeader from './ui/PanelHeader';
import { RunButton, SubmitButton } from './ui/Buttons';
import Timer from './ui/Timer';
import { HorizontalResizer } from './ui/Resizers';

import codeIcon from '../assets/code.svg';
import terminalIcon from '../assets/terminal.svg';

const LeftWorkspace = forwardRef(({ 
  width, 
  splitState, 
  activeResizer, 
  startDragging, 
  language, 
  setLanguage, 
  code, 
  setCode 
}, ref) => {

  return (
    <div 
      className="column-container left-column" 
      ref={ref}
      style={{ width: `${width}%` }}
    >
      {/* Редактор кода */}
      <div className="panel panel-top" style={{ height: `${splitState}%` }}>
        <PanelHeader title="Код" iconIcon={codeIcon} />
        
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
           </div>
        </div>

        <div className="editor-wrapper">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 10 }
            }}
          />
        </div>
      </div>

      <HorizontalResizer 
        isDragging={activeResizer === 'left-horizontal'}
        onMouseDown={startDragging('left-horizontal')}
      />

       {/* Результаты тестов */}
      <div className="panel panel-bottom" style={{ height: `${100 - splitState}%` }}>
         <PanelHeader title="Результаты тестов" iconIcon={terminalIcon} />
         <div className="panel-content">
            <p style={{color: '#888', fontStyle: 'italic'}}>Здесь будут результаты запуска...</p>
         </div>
      </div>
    </div>
  );
});

export default LeftWorkspace;