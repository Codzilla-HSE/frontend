import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FileText, BarChart2 } from 'lucide-react';
import PanelHeader from '../ui/PanelHeader';

export default function RightWorkspace() {
  return (
    <Panel defaultSize={50} minSize={20} className="column-container right-column">
      <PanelGroup direction="vertical">
        
        {/* Панель Условия */}
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

        {/* Панель Метрик */}
        <Panel defaultSize={50} minSize={15} className="panel">
          <PanelHeader title="Метрики противника" Icon={BarChart2} />
          <div className="panel-content">
             <p>Данные по метрикам оппонента...</p>
          </div>
        </Panel>

      </PanelGroup>
    </Panel>
  );
}