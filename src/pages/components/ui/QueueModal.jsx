import './QueueModal.css';

const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export default function QueueModal({ isOpen, queueSize, waitSeconds, onLeave }) {
    if (!isOpen) return null;

    return (
        <div className="queue-overlay">
            <div className="queue-modal">
                <div className="queue-modal__spinner" aria-hidden="true" />

                <h2 className="queue-modal__title">Поиск соперника</h2>

                <div className="queue-modal__stats">
                    <div className="queue-modal__stat">
                        <span className="queue-modal__stat-label">В очереди</span>
                        <span className="queue-modal__stat-value">{queueSize}</span>
                    </div>
                    <div className="queue-modal__stat">
                        <span className="queue-modal__stat-label">Ожидание</span>
                        <span className="queue-modal__stat-value queue-modal__timer">
                            {formatTime(waitSeconds)}
                        </span>
                    </div>
                </div>

                <button className="btn btn-danger queue-modal__leave" onClick={onLeave}>
                    Отменить поиск
                </button>
            </div>
        </div>
    );
}