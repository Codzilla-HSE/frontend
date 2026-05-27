import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosConfig';

const BASE_URL = 'http://localhost:8080';

export const useQueueSSE = () => {
    const navigate = useNavigate();

    const [isModalOpen,  setIsModalOpen]  = useState(false);
    const [queueSize,    setQueueSize]    = useState(0);
    const [waitSeconds,  setWaitSeconds]  = useState(0);
    const [isConnecting, setIsConnecting] = useState(false);

    const esRef          = useRef(null);
    const timerRef       = useRef(null);
    const waitSecondsRef = useRef(0);

    const startTimer = useCallback((initialSeconds = 0) => {
        waitSecondsRef.current = initialSeconds;
        setWaitSeconds(initialSeconds);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            waitSecondsRef.current += 1;
            setWaitSeconds(waitSecondsRef.current);
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }, []);

    const openSSE = useCallback(() => {
        if (esRef.current) return;

        const es = new EventSource(`${BASE_URL}/matchmaking/queue/stream`, {
            withCredentials: true,
        });

        es.addEventListener('queue-size', (e) => {
            setQueueSize(Number(e.data));
        });

        es.addEventListener('match-found', (e) => {
            const sessionId = e.data;
            stopTimer();
            closeSSE();
            setIsModalOpen(false);
            navigate(`/match/${sessionId}/draft`);
        });

        es.onerror = () => {
        };

        esRef.current = es;
    }, [navigate, stopTimer]);

    const closeSSE = useCallback(() => {
        if (esRef.current) {
            esRef.current.close();
            esRef.current = null;
        }
    }, []);

    const enterQueue = useCallback(async () => {
        setIsConnecting(true);
        try {
            const { data } = await api.get('/matchmaking/queue/status');

            if (data.status === 'WAITING') {
                setQueueSize(data.queueSize);
                openSSE();
                startTimer(data.waitingSeconds);
            } else {
                await api.post('/matchmaking/queue');
                setQueueSize(data.queueSize + 1);
                openSSE();
                startTimer(0);
            }
            setIsModalOpen(true);
        } catch (err) {
            console.error('[Queue] enterQueue error:', err);
        } finally {
            setIsConnecting(false);
        }
    }, [openSSE, startTimer]);

    const leaveQueue = useCallback(async () => {
        try {
            await api.delete('/matchmaking/queue');
        } catch (err) {
            console.error('[Queue] leaveQueue error:', err);
        } finally {
            stopTimer();
            closeSSE();
            setIsModalOpen(false);
            setWaitSeconds(0);
        }
    }, [closeSSE, stopTimer]);

    useEffect(() => {
        return () => {
            stopTimer();
            closeSSE();
        };
    }, [stopTimer, closeSSE]);

    return {
        isModalOpen,
        queueSize,
        waitSeconds,
        isConnecting,
        enterQueue,
        leaveQueue,
    };
};