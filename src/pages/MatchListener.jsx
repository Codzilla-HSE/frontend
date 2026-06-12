import { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useMatchStore } from './useMatchStore.js';

export const MatchListener = ({ matchId, children }) => {
    const { isConnected, subscribe } = useWebSocket();

    const handleIncomingMessage = useMatchStore((state) => state.handleIncomingMessage);
    const handleErrorMessage = useMatchStore((state) => state.handleErrorMessage);
    const resetStore = useMatchStore((state) => state.resetStore);
    useEffect(() => {
        if (!isConnected) return;

        const sessionSub = subscribe(`/topic/match/${matchId}`, (msg) => {
            try {
                const msg_j = JSON.parse(msg.body);
                handleIncomingMessage(msg_j);
            } catch (err) {
                console.error(err);
            }
        });

        const errorSub = subscribe('/user/queue/errors', (msg) => {
            try {
                const payload = JSON.parse(msg.body);
                handleErrorMessage(payload);
            } catch (err) {
                console.error(err);
            }
        });

        const resultSub = subscribe('/user/queue/match-result', (msg) => {
            try {
                handleIncomingMessage(JSON.parse(msg.body));
            } catch (err) {
                console.error(err);
            }
        });

        return () => {
            if (sessionSub) sessionSub.unsubscribe();
            if (errorSub) errorSub.unsubscribe();
            if (resultSub)  resultSub.unsubscribe();
            resetStore();
        };
    }, [isConnected, matchId, handleIncomingMessage, handleErrorMessage, resetStore, subscribe]);

    return children;
};