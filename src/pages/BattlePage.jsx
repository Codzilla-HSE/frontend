import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SettingsModal from './components/ui/SettingsModal';
import QueueModal from './components/ui/QueueModal';
import { useQueueSSE } from './useQueueSSE';
import './BattlePage.css';

if (typeof global === 'undefined') {
    window.global = window;
}

export default function BattlePage() {
    const navigate = useNavigate();
    const { logout } = useUser();
    const [showSettings, setShowSettings] = useState(false);

    const { isModalOpen, queueSize, waitSeconds, isConnecting, enterQueue, leaveQueue } =
        useQueueSSE();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <Header onSettingsClick={() => setShowSettings(true)} />

            <main className="battle-main">
                <h1 className="battle-title">Арена CodZilla</h1>
                <p className="battle-subtitle">
                    Выбери задачу, напиши оптимальный код и разгроми соперника
                </p>

                <button
                    className="btn-battle"
                    onClick={enterQueue}
                    disabled={isConnecting}
                >
                    {isConnecting ? 'Подключение...' : 'В БОЙ!'}
                </button>
            </main>

            <Footer />

            <QueueModal
                isOpen={isModalOpen}
                queueSize={queueSize}
                waitSeconds={waitSeconds}
                onLeave={leaveQueue}
            />

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onLogout={handleLogout}
            />
        </div>
    );
}