import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useUser} from "./UserContext.jsx";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const {user} = useUser();
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/game-ws'),
            reconnectDelay: 5000,
            onConnect: () => setIsConnected(true),
            onDisconnect: () => setIsConnected(false),
            debug: (str) => console.log(`[STOMP Debug] ${str}`),
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
                setIsConnected(false);
            }
        };
    }, [user]);

    const subscribe = (destination, callback) => {
        if (stompClientRef.current && isConnected) {
            return stompClientRef.current.subscribe(destination, callback);
        }
        return null;
    };

    const publish = (destination, body) => {
        if (stompClientRef.current && isConnected) {
            stompClientRef.current.publish({
                destination,
                body: JSON.stringify(body),
            });
        }
    };

    return (

        <WebSocketContext.Provider value={{ isConnected, subscribe, publish }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);