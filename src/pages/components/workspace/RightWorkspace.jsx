import { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FileText, BarChart2, List } from 'lucide-react';
import PanelHeader from '../ui/PanelHeader';

export default function RightWorkspace({ position = 'right', submissions = [] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
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
             <div className="panel-header tabs-header">
               <div 
                 className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                 onClick={() => setActiveTab('description')}
               >
                 <FileText size={16} />
                 <span>Условие задачи</span>
               </div>

               <div 
                 className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
                 onClick={() => setActiveTab('submissions')}
               >
                 <List size={16} />
                 <span>Сабмиты</span>
               </div>
             </div>

            <div className="panel-content">
              {activeTab === 'description' ? (
                <div className="task-description">
                  <h3>Заголовок задачи</h3>
                  <p>Текст условия задачи будет загружаться сюда...</p>
                </div>
              ) : (
                <div className="submissions-container">
                  {(!submissions || !Array.isArray(submissions) || submissions.length === 0) ? (
                    <p className="empty-submissions">Посылок пока нет или данные загружаются...</p>
                  ) : (
                    <div className="submissions-list">
                      {submissions.map((sub, index) => (
                        <div key={sub.id || index} className="submission-item">
                          <div className={`submission-status ${sub.status === 'Accepted' ? 'accepted' : 'rejected'}`}>
                            {sub.status || 'Pending...'}
                          </div>
                          <div className="submission-details">
                            Язык: {sub.language || 'Неизвестно'} | Память: {sub.memory || '0'} MB
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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