import { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(1800);

  useEffect(() => {
    if (seconds <= 0) return;
    const timerId = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(timerId);
  }, [seconds]);

  const formatTime = (ts) => {
    const h = Math.floor(ts / 3600);
    const m = Math.floor((ts % 3600) / 60);
    const s = ts % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  };

  return (
    <div className="timer-display" title="Оставшееся время">
      {formatTime(seconds)}
    </div>
  );
}