import { useState, useEffect, useRef } from 'react'
import api from '../api/axiosConfig'

export const useParcelPolling = () => {
    const [submissions, setSubmissions] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [isPolling, setIsPolling] = useState(true);
    
    const lastUpdateRef = useRef(null);

    useEffect(() => { 
        let isMounted = true;
        let timeoutId = null;

        const controller = new AbortController();

        const poll = async () => {
            if (!isMounted || !isPolling) return;

            try {
                const params = {};
                if (lastUpdateRef.current) {
                    params.lastUpdate = lastUpdateRef.current;
                }

                const response = await api.get('/my-submissions', {
                    signal: controller.signal,
                    params: params,
                    timeout: 25000
                });

                if (isMounted) {
                    if (response.status === 200) {
                        setSubmissions(response.data);
                        setHasError(false);
                        
                        if (response.data.length > 0) {
                            const latest = response.data.reduce((max, sub) => 
                                sub.updatedAt > max ? sub.updatedAt : max, response.data[0].updatedAt);
                            lastUpdateRef.current = latest;
                        }
                    } 
                    timeoutId = setTimeout(poll, 500);
                }
            } catch (error) {
                if (error.name === 'CanceledError' || error.message === 'canceled') {
                    return;
                }
                
                if (isMounted) {
                    console.error('Error while getting submissions list:', error);
                    setHasError(true);
                    timeoutId = setTimeout(poll, 3000);
                }
            }
        };

        poll();

        return () => {
            isMounted = false;
            controller.abort();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isPolling]);

    return { submissions, hasError, setIsPolling };
};