import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../api/axiosConfig';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SettingsModal from './components/ui/SettingsModal';
import toast from 'react-hot-toast';
import './MatchHistoryPage.css';

function formatDate(iso) {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '';
    }
}

function MatchRow({ entry }) {
    const won = entry.won;
    const Arrow = won ? ArrowUp : ArrowDown;
    return (
        <div className={`mh-row ${won ? 'mh-row--win' : 'mh-row--lose'}`}>
            <div className="mh-result">
                <span className={`mh-badge ${won ? 'mh-badge--win' : 'mh-badge--lose'}`}>
                    {won ? 'Победа' : 'Поражение'}
                </span>
            </div>
            <div className="mh-opponent">
                <span className="mh-vs">против</span>
                <span className="mh-nickname">{entry.opponentNickname}</span>
                {entry.finishedAt && <span className="mh-date">{formatDate(entry.finishedAt)}</span>}
            </div>
            <div className={`mh-rating ${won ? 'mh-rating--win' : 'mh-rating--lose'}`}>
                <Arrow size={18} />
                <span>{entry.rating ?? '—'}</span>
            </div>
        </div>
    );
}

export default function MatchHistoryPage() {
    const navigate = useNavigate();
    const { logout } = useUser();
    const [showSettings, setShowSettings] = useState(false);

    const [matches, setMatches] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get('/match/history');
                if (!cancelled) setMatches(res.data ?? []);
            } catch (err) {
                if (!cancelled) toast.error('Не удалось загрузить историю матчей');
                console.error('[MatchHistory] load error:', err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <Header onSettingsClick={() => setShowSettings(true)} />

            <main className="mh-main">
                <h1 className="mh-title">История матчей</h1>
                <p className="mh-subtitle">Ваши прошедшие битвы</p>

                {isLoading ? (
                    <div className="mh-loading">Загрузка истории...</div>
                ) : !matches || matches.length === 0 ? (
                    <div className="mh-empty">Пока что вы не сыграли ни одного матча</div>
                ) : (
                    <div className="mh-board">
                        {matches.map((entry) => (
                            <MatchRow key={entry.matchId} entry={entry} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onLogout={handleLogout}
            />
        </div>
    );
}
