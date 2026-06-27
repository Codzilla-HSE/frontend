export default function ActionTimer({ timeLeft, totalDuration = 20, isMyTurn = true }) {

    const percentage = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));


    const getBarColor = () => {
        if (isMyTurn) {

            if (percentage > 50) return '#22c55e';
            if (percentage > 20) return '#eab308';
            return '#f97316';
        } else {

            if (percentage > 50) return '#a855f7';
            if (percentage > 20) return '#b91c1c';
            return '#ef4444';
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 10
        }}>
            <div style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: getBarColor(),
                transition: 'width 1s linear, background-color 0.5s ease',
            }} />
        </div>
    );
}