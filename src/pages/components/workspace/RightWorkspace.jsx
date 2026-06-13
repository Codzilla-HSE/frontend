import { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FileText, BarChart2, List } from 'lucide-react';
import PanelHeader from '../ui/PanelHeader';

const LANGUAGE_MAP = {
    54: 'C++',
    71: 'Python',
    63: 'JavaScript',
    0: 'SQL'
};

const STATUS_LABEL = {
    ACCEPTED: '✅ Принято',
    WRONG_ANSWER: '❌ Неверный ответ',
    COMPILE_ERROR: '⚠️ Ошибка компиляции',
    RUNTIME_ERROR: '💥 Ошибка выполнения',
    IN_QUEUE: '⏳ В очереди',
    PROCESSING: '🔄 Обработка',
};

export default function RightWorkspace({
    position = 'right',
    submissions = [],
    problem = null,
    statement = null,
    loadingStatement = false,
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const panelRef = useRef(null);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
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
                                    {loadingStatement ? (
                                        <p className="muted">Загрузка условия...</p>
                                    ) : (
                                        <>
                                            <h3>{problem?.name ?? 'Задача'}</h3>
                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                {problem?.type} · {problem?.level}
                                            </p>
                                            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '12px' }}>
                                                {statement ?? 'Условие задачи отсутствует.'}
                                            </pre>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="submissions-container">
                                    {(!submissions || submissions.length === 0) ? (
                                        <p className="empty-submissions">Посылок пока нет...</p>
                                    ) : (
                                        <div className="submissions-list">
                                            {submissions.map((sub, index) => (
                                                <div key={sub.id || index} className="submission-item">
                                                    <div className={`submission-status ${sub.status === 'ACCEPTED' ? 'accepted' : 'rejected'}`}>
                                                        {STATUS_LABEL[sub.status] ?? sub.status.replace(/_/g, ' ')}
                                                    </div>
                                                    <div className="submission-details">
                                                        ID: {sub.id} | {LANGUAGE_MAP[sub.languageId] ?? `lang:${sub.languageId}`} | {formatDate(sub.createdAt)}
                                                    </div>
                                                    {sub.resultDetails && (
                                                        <pre className="submission-result">
                                                            {sub.resultDetails}
                                                        </pre>
                                                    )}
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