import { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FileText, BarChart2 } from 'lucide-react';
import PanelHeader from '../ui/PanelHeader';

export default function RightWorkspace({ position = 'right' }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef(null);

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
            <FileText size={16} /> Условие & Метрики
          </div>
        </div>
      ) : (
        <PanelGroup direction="vertical">
          <Panel defaultSize={50} minSize={15} className="panel">
             <PanelHeader title="Условие задачи" Icon={FileText} />
             <div className="panel-content">
               <h3 style={{ marginTop: 0 }}>Заголовок задачи</h3>
               <p>Текст условия задачи будет загружаться сюда...</p>
             </div>
          </Panel>

          <PanelResizeHandle className="resizer-horizontal">
             <div className="resizer-line-horizontal"></div>
          </PanelResizeHandle>

          <Panel defaultSize={50} minSize={15} className="panel">
            <PanelHeader title="Метрики противника" Icon={BarChart2} />
            <div className="panel-content">
               <p>Данные по метрикам оппонента...</p>
            </div>
          </Panel>
        </PanelGroup>
      )}
    </Panel>
  );
}