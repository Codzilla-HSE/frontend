import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchResultOverlay.css';

const REDIRECT_DELAY_MS = 30_000;

export default function MatchResultOverlay({ outcome, newRating, ratingDelta }) {
    const navigate = useNavigate();
    const [secondsLeft, setSecondsLeft] = useState(Math.round(REDIRECT_DELAY_MS / 1000));
    const intervalRef = useRef(null);

    const isWin = outcome === 'WIN';

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    clearInterval(intervalRef.current);
                    navigate('/battle');
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [navigate]);

    const deltaSign  = isWin ? '+' : '−';
    const deltaClass = isWin ? 'delta-positive' : 'delta-negative';

    return (
        <div className={`overlay-root ${isWin ? 'overlay-win' : 'overlay-lose'}`}>

            <div className="overlay-headline">
                {isWin ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}
            </div>

            <div className="overlay-subtitle">
                {isWin ? 'RESPECT +' : 'WASTED'}
            </div>

            <div className="overlay-rating-card">
                <span className="rating-label">Текущий рейтинг:</span>
                <span className="rating-value">{newRating}</span>
                <span className={`rating-delta ${deltaClass}`}>
                    ({deltaSign}{ratingDelta})
                </span>
            </div>

            <div className="overlay-timer">
                Переход на страницу поиска через {secondsLeft} сек…
            </div>
        </div>
    );
}
