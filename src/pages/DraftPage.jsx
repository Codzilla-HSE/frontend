import React from 'react';
import { useParams } from 'react-router-dom';
import { useMatchSession } from './useMatchSession.js';

const DraftPage = () => {

    const { matchId } = useParams();
    const { sessionData, sendBan, isConnected } = useMatchSession(matchId);

    if (!isConnected) return <div className="loader">Установка соединения с сервером...</div>;
    if (!sessionData) return <div className="loader">Загрузка данных драфта...</div>;

    const { remainOptions, firstUserMove } = sessionData;

    return (
        <div style={styles.container}>

            <header style={styles.header}>
                <h1>Draft Session #{matchId.substring(0, 8)}</h1>
                <div style={{
                    ...styles.turnIndicator,
                    backgroundColor: firstUserMove ? '#3b82f6' : '#ef4444'
                }}>
                    {firstUserMove ? "Ход Игрока 1" : "Ход Игрока 2"}
                </div>
            </header>

            <main style={styles.main}>

                <div style={styles.grid}>
                    {Object.entries(remainOptions).map(([category, options]) => (
                        <div key={category} style={styles.categoryCard}>
                            <h2 style={styles.categoryTitle}>{category}</h2>
                            <div style={styles.optionsList}>
                                {options.length > 0 ? (
                                    options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => sendBan(category, option)}
                                            style={styles.banButton}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                                        >
                                            Ban {option}
                                        </button>
                                    ))
                                ) : (
                                    <p style={styles.emptyText}>Опций не осталось</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer style={styles.footer}>
                <p>Выберите категорию и опцию, которую хотите исключить из матча.</p>
            </footer>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '20px',
        color: '#1e293b'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px'
    },
    turnIndicator: {
        padding: '10px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
    },
    errorBanner: {
        backgroundColor: '#fef2f2',
        border: '1px solid #fee2e2',
        color: '#dc2626',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        animation: 'shake 0.5s ease'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
    },
    categoryCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        border: '1px solid #e2e8f0'
    },
    categoryTitle: {
        fontSize: '1.25rem',
        marginBottom: '15px',
        color: '#475569',
        borderLeft: '4px solid #64748b',
        paddingLeft: '10px'
    },
    optionsList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
    },
    banButton: {
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic'
    },
    footer: {
        marginTop: '40px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem'
    }
};

export default DraftPage;