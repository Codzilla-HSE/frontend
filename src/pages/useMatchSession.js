import {useEffect, useState} from 'react';
import {useWebSocket} from '../context/WebSocketContext';
import {useMatchStore} from "./useMatchStore.js";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

export const useMatchSession = (matchId) => {
    const {isConnected, publish} = useWebSocket();
    const navigate = useNavigate();
    const draftSessionDTO = useMatchStore((state) => state.draftSessionDTO);
    const isRedirect = useMatchStore((state) => state.matchStarted);
    const error = useMatchStore((state) => state.error);
    const resetStore = useMatchStore((state) => state.resetStore);

    const [sessionData, setSessionData] = useState(null);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionData(draftSessionDTO?.draftSession);
    }, [draftSessionDTO]);

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

    return {sessionData, error, sendBan, isConnected};
};
