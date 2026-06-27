import {useEffect, useState} from 'react';
import {useWebSocket} from '../context/WebSocketContext';
import {useMatchStore} from "./useMatchStore.js";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {api} from "../api/axiosConfig.js";
import {useUser} from "../context/UserContext.jsx";
import React from 'react';

export const useMatchSession = (matchId) => {
    const {isConnected, publish} = useWebSocket();
    const navigate = useNavigate();
    const draftSessionDTO = useMatchStore((state) => state.draftSessionDTO);
    const isRedirect = useMatchStore((state) => state.matchStarted);
    const error = useMatchStore((state) => state.error);
    const resetStore = useMatchStore((state) => state.resetStore);
    const [opponent, setOpponent] = useState(null);
    const {user} = useUser();
    const [sessionData, setSessionData] = useState(null);
    const matchSubmissions = useMatchStore((state) => state.matchSubmissions);
    const userSubmissions = matchSubmissions
        .filter(sub => sub.userId === user?.id);
    console.log(`user id : ${user?.id}`);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionData(draftSessionDTO?.draftSession);
    }, [draftSessionDTO]);

    useEffect(() => {
        if (!sessionData || !user?.id) return;

        const amIFirstUser = user.id === sessionData.firstUserId;
        const opponentId = amIFirstUser ? sessionData.secondUserId : sessionData.firstUserId;

        if (!opponentId) {
            console.log(`session data: ${sessionData}`);
            console.log(`opponent id : ${opponentId}`);
            return;
        };

        api.get(`user/info/${opponentId}`)
            .then(response => {
                setOpponent(response.data);
            })
            .catch(err => {
                console.error("Ошибка загрузки данных оппонента в хуке:", err);
            });
    }, [sessionData, user.id]);

    useEffect(() => {
        if (error?.message) {
            toast.error(error?.message);
        }
    }, [error]);

    useEffect(() => {
        if (isRedirect) {
            resetStore();
            navigate(`/match/${matchId}/workspace`);
        }
    }, [isRedirect, matchId, navigate, resetStore]);

    useEffect(() => {
        if (matchSubmissions.length === 0) return;

        const lastSubmission = matchSubmissions[0];

        if (lastSubmission.userId !== user?.id) {
            const statusStr = lastSubmission.status;
            const isAccepted = statusStr === 'ACCEPTED';
            const formattedStatus = statusStr ? statusStr.replace(/_/g, ' ') : 'UNKNOWN';

            const statusColor = isAccepted ? '#22c55e' : '#ef4444';
            const statusIcon = isAccepted ? '⚔️' : '⚠️';
            const actionText = isAccepted ? 'РЕШИЛ ЗАДАЧУ!' : 'ОШИБСЯ НА ТЕСТАХ';

            toast.custom((t) => {
                const animationStyle = t.visible
                    ? { transform: 'translateY(0)', opacity: 1, transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
                    : { transform: 'translateY(100px)', opacity: 0, transition: 'all 0.3s ease-in' };

                return React.createElement('div', {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            backgroundColor: '#1e293b',
                            color: '#fff',
                            padding: '14px 18px',
                            borderRadius: '8px',
                            borderLeft: `5px solid ${statusColor}`,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            minWidth: '320px',
                            marginRight: '20px',
                            marginBottom: '20px',
                            ...animationStyle
                        }
                    },
                    React.createElement('span', { style: { fontSize: '22px', lineHeight: '1' } }, statusIcon),
                    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px' } },
                        React.createElement('span', { style: { fontSize: '10px', color: '#64748b', fontWeight: '700', letterSpacing: '0.8px' } }, 'ЛОГ МАТЧА'),
                        React.createElement('span', { style: { fontSize: '14px', fontWeight: '800', color: statusColor, letterSpacing: '0.3px' } }, `ОППОНЕНТ ${actionText}`),
                        React.createElement('span', { style: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' } },
                            'Вердикт: ',
                            React.createElement('code', { style: { color: '#e2e8f0', background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: '4px' } }, formattedStatus)
                        )
                    )
                );
            }, {
                duration: 4000,
                position: 'bottom-right'
            });
        }

    }, [matchSubmissions.length, user?.id]);

    const sendBan = (category, value) => {
        publish(`/app/${matchId}/ban`, {category: category, banObject: value});
    };

    return {sessionData, opponent, error, sendBan, isConnected, userSubmissions};
};
