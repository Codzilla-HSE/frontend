import React from 'react';
import { useParams } from 'react-router-dom';
import useMatchSession from './useMatchSession.js';
import './DraftPage.css';

const DraftPage = () => {
    const { matchId } = useParams();
    const { sessionData, sendBan, isConnected } = useMatchSession(matchId);

    if (!isConnected) return <div className="loader">Установка соединения с сервером...</div>;
    if (!sessionData) return <div className="loader">Загрузка данных драфта...</div>;

    const { optionsStates: categories, firstUserMove } = sessionData;

    return (
        <div className="draft-container">
            <header className="draft-header">
                <h1 className="draft-title">Draft Session #{matchId.substring(0, 8)}</h1>
                <div
                    className="draft-turn-indicator"
                    style={{ backgroundColor: firstUserMove ? '#3b82f6' : '#ef4444' }}
                >
                    {firstUserMove ? "Ход Игрока 1" : "Ход Игрока 2"}
                </div>
            </header>

            <main className="draft-main">
                <div className="draft-list">
                    {categories.map(({ category, options, active }) => {


                        const remainCount = options ? options.filter(o => !o.banned).length : 0;

                        const isCategoryFinished = !active && remainCount === 1;

                        return (
                            <div
                                key={category}
                                className={`draft-category-card ${active ? 'active' : ''} ${isCategoryFinished ? 'finished' : ''}`}
                                style={isCategoryFinished ? { opacity: 1 } : {}} // Возвращаем полную яркость завершенной карточке
                            >
                                <div className="draft-category-header">
                                    <h2 className="draft-category-title">{category}</h2>
                                    {active && <span className="draft-active-badge">Текущий выбор</span>}
                                    {isCategoryFinished && <span className="draft-active-badge" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', borderColor: 'rgba(76, 175, 80, 0.2)' }}>Выбрано</span>}
                                </div>

                                <div className="draft-options-list">
                                    {options && options.length > 0 ? (
                                        options.map(({ option, banned }) => {
                                            const isClickable = active && !banned;

                                            // Определяем классы стилей для кнопки
                                            let btnClass = "draft-ban-btn";

                                            if (banned) {
                                                btnClass += " banned";
                                            } else if (isCategoryFinished) {
                                                // Если категория завершена и опция не забанена — это наш победитель!
                                                btnClass += " selected-winner";
                                            }

                                            return (
                                                <button
                                                    key={option}
                                                    disabled={!isClickable}
                                                    onClick={() => sendBan(category, option)}
                                                    className={btnClass}
                                                >
                                                    {banned ? `${option}` : isCategoryFinished ? `${option}` : `${option}`}
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
        </div>
    );
};

export default DraftPage;
