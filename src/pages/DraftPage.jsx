import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMatchSession} from './useMatchSession.jsx';
import {useNavigate} from 'react-router-dom';
import './DraftPage.css';
import {useUser} from "../context/UserContext.jsx";
import Header from "./components/layout/Header.jsx";
import ActionTimer from "./components/ui/ActionTimer.jsx";
import SettingsModal from "./components/ui/SettingsModal.jsx";

const DraftPage = () => {
    const navigate = useNavigate();
    const {matchId} = useParams();
    const {sessionData, sendBan, isConnected, opponent} = useMatchSession(matchId);
    const {user, logout} = useUser();
    const [wsTimeLeft, setWsTimeLeft] = useState(20);
    const [showSettings, setShowSettings] = useState(false);

    const amIFirstUser = user?.id === sessionData?.firstUserId;
    const isMyTurn = amIFirstUser ? sessionData?.firstUserMove : !sessionData?.firstUserMove;

    useEffect(() => {
        if (!isConnected || !sessionData) return;
        const interval = setInterval(() => {
            setWsTimeLeft((prev) => {
                if (prev === null || prev <= 0) return 20;
                return +(prev - 0.1).toFixed(1);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isMyTurn, isConnected, sessionData]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isConnected) return <div className="loader">Установка соединения с сервером...</div>;
    if (!sessionData) return <div className="loader">Загрузка данных драфта...</div>;


    const {optionsStates: categories} = sessionData;

    return (
        <div className="layout-container">
            <Header onSettingsClick={() => setShowSettings(true)}/>

            {wsTimeLeft !== null && (
                <ActionTimer
                    timeLeft={wsTimeLeft}
                    totalDuration={20}
                    isMyTurn={isMyTurn}
                />
            )}

            <div className="draft-container">

                <header className="draft-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px',
                    gap: '20px'
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>


                        {/* Оппонент внутри Хедера */}
                        {opponent ? (
                            <div className="draft-opponent-panel" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: '#1e293b',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                border: '1px solid #334155'
                            }}>
                                <img
                                    /* Ссылка есть всегда */
                                    src={opponent.iconUrl}
                                    alt="Avatar"
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #475569'
                                    }}
                                    /* ОБРАБОТЧИК ОШИБКИ: если картинки нет по ссылке, заменяем на заглушку */
                                    onError={(e) => {
                                        // Чтобы избежать бесконечного цикла, если и заглушка упадет:
                                        if (e.target.src !== 'https://img.icons8.com/windows/32/94a3b8/user-male-circle.png') {
                                            e.target.src = 'https://img.icons8.com/windows/32/94a3b8/user-male-circle.png';
                                            e.target.style.padding = '4px'; // Немного отступа для иконки
                                            e.target.style.background = '#334155';
                                        }
                                    }}
                                />

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <span
                                        style={{color: '#94a3b8', fontSize: '11px', lineHeight: '1.2'}}>Оппонент</span>
                                    <strong style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        lineHeight: '1.2'
                                    }}>{opponent.nickname}</strong>
                                </div>
                                <div style={{
                                    marginLeft: '6px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    color: '#f59e0b',
                                    fontWeight: 'bold'
                                }}>
                                    ★ {opponent.rating ?? 1000}
                                </div>
                            </div>
                        ) : (
                            <div style={{color: '#64748b', fontSize: '14px'}}>Загрузка оппонента...</div>
                        )}
                    </div>

                    {/* Индикатор хода */}
                    <div
                        className="draft-turn-indicator"
                        style={{
                            backgroundColor: isMyTurn ? '#22c55e' : '#ef4444',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            color: '#fff',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {isMyTurn ? "Вы баните опцию" : "Оппонент банит опцию"}
                    </div>
                </header>

                <main className="draft-main">
                    <div className="draft-list">
                        {categories.map(({category, options, active}) => {


                            const remainCount = options ? options.filter(o => !o.banned).length : 0;

                            const isCategoryFinished = !active && remainCount === 1;

                            return (
                                <div
                                    key={category}
                                    className={`draft-category-card ${active ? 'active' : ''} ${isCategoryFinished ? 'finished' : ''}`}
                                    style={isCategoryFinished ? {opacity: 1} : {}} // Возвращаем полную яркость завершенной карточке
                                >
                                    <div className="draft-category-header">
                                        <h2 className="draft-category-title">{category}</h2>
                                        {active && <span className="draft-active-badge">Текущий выбор</span>}
                                        {isCategoryFinished && <span className="draft-active-badge" style={{
                                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                            color: '#4caf50',
                                            borderColor: 'rgba(76, 175, 80, 0.2)'
                                        }}>Выбрано</span>}
                                    </div>

                                    <div className="draft-options-list">
                                        {options && options.length > 0 ? (
                                            // Копируем массив через [...] и сортируем по свойству option (строка с именем)
                                            [...options]
                                                .sort((a, b) => a.option.localeCompare(b.option))
                                                .map(({option, banned}) => {
                                                    const isClickable = active && !banned;

                                                    let btnClass = "draft-ban-btn";
                                                    if (banned) {
                                                        btnClass += " banned";
                                                    } else if (isCategoryFinished) {
                                                        btnClass += " selected-winner";
                                                    }

                                                    return (
                                                        <button
                                                            key={option}
                                                            disabled={!isClickable}
                                                            onClick={() => sendBan(category, option)}
                                                            className={btnClass}
                                                        >
                                                            {option}
                                                        </button>
                                                    );
                                                })
                                        ) : (
                                            <p className="muted">Опций не осталось</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
                <SettingsModal
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    onLogout={handleLogout}
                />
            </div>
        </div>
    );
};

export default DraftPage;