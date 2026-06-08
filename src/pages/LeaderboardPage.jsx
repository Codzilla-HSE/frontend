import defaultAvatar from '../../public/default-avatar.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { api } from '../api/axiosConfig';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SettingsModal from './components/ui/SettingsModal';
import toast from 'react-hot-toast';
import './LeaderboardPage.css';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function LeaderboardRow({ entry }) {
    const isTop3 = entry.rank <= 3;
    return (
        <div className={`lb-row ${entry.isCurrentUser ? 'lb-row--me' : ''} ${isTop3 ? `lb-row--top${entry.rank}` : ''}`}>
            <div className="lb-rank">
                {MEDALS[entry.rank] || `#${entry.rank}`}
            </div>
            <div className="lb-user">
                <img
                    className="lb-avatar"
                    src={entry.avatarUrl}
                    alt={entry.nickname}
                    onError={(e) => {
                        if (e.currentTarget.dataset.fallback) return;
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = defaultAvatar;
                    }}
                />
                <span className="lb-nickname">{entry.nickname}</span>
                {entry.isCurrentUser && <span className="lb-you-badge">вы</span>}
            </div>
            <div className="lb-rating">{entry.rating}</div>
        </div>
    );
}

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const { logout } = useUser();
    const [showSettings, setShowSettings] = useState(false);

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get('/leaderboard');
                if (!cancelled) setData(res.data);
            } catch (err) {
                if (!cancelled) toast.error('Не удалось загрузить рейтинг');
                console.error('[Leaderboard] load error:', err);
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

    const topRanks = new Set((data?.top ?? []).map((e) => e.rank));
    const bottom = (data?.bottom ?? []).filter((e) => !topRanks.has(e.rank));

    const meRank = data?.currentUser?.rank;
    const meAlreadyShown =
        topRanks.has(meRank) || bottom.some((e) => e.rank === meRank);
    const showMeSeparately = data?.currentUser && !meAlreadyShown;

    const lastTopRank = data?.top?.[data.top.length - 1]?.rank ?? 0;
    const firstBottomRank = bottom[0]?.rank ?? null;
    const hasGap = firstBottomRank != null && firstBottomRank > lastTopRank + 1;

    return (
        <div className="layout-container">
            <Header onSettingsClick={() => setShowSettings(true)} />

            <main className="lb-main">
                <h1 className="lb-title">Зал славы</h1>
                <p className="lb-subtitle">Лучшие бойцы CodZilla</p>

                {isLoading ? (
                    <div className="lb-loading">Загрузка рейтинга...</div>
                ) : !data || data.totalUsers === 0 ? (
                    <div className="lb-empty">Пока никого нет в рейтинге</div>
                ) : (
                    <div className="lb-board">
                        <div className="lb-header-row">
                            <div className="lb-rank">Место</div>
                            <div className="lb-user">Игрок</div>
                            <div className="lb-rating">Рейтинг</div>
                        </div>

                        {data.top.map((e) => (
                            <LeaderboardRow key={`top-${e.rank}`} entry={e} />
                        ))}

                        {showMeSeparately && (
                            <>
                                <div className="lb-divider">⋯</div>
                                <LeaderboardRow entry={data.currentUser} />
                            </>
                        )}

                        {hasGap && !showMeSeparately && (
                            <div className="lb-divider">⋯</div>
                        )}

                        {bottom.map((e) => (
                            <LeaderboardRow key={`bottom-${e.rank}`} entry={e} />
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