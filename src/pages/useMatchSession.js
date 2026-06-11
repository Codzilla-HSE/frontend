import {useEffect, useState} from 'react';
import {useWebSocket} from '../context/WebSocketContext';
import {useMatchStore} from "./useMatchStore.js";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {api} from "../api/axiosConfig.js";
import {useUser} from "../context/UserContext.jsx";

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
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionData(draftSessionDTO?.draftSession);
    }, [draftSessionDTO]);

    useEffect(() => {
        if (!sessionData || !user?.id) return;

        const amIFirstUser = user.id === sessionData.firstUserId;
        const opponentId = amIFirstUser ? sessionData.secondUserId : sessionData.firstUserId;

        if (!opponentId) return;

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

    const sendBan = (category, value) => {
        publish(`/app/${matchId}/ban`, {category: category, banObject: value});
    };

    return {sessionData, opponent, error, sendBan, isConnected};
};
