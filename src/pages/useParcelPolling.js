import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

export const useParcelPolling = () => {
    const [submissions, setSubmissions] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [isPolling, setIsPolling] = useState(true);

    useEffect(() => { 
        let isMounted = true;
        let timeoutId = null;

        const controller = new AbortController();

        const poll = async () => {
            if (!isMounted || !isPolling) return;

            try {
                const response = await api.get('/submissions', {
                    signal: controller.signal
                });

                if (isMounted) {
                    console.log('Backend response:', response.data);
                    setSubmissions(response.data);
                    setHasError(false);

                    poll();
                }
            } catch (error) {
                if (error.name == 'CanceledError' || error.message == 'canceled') {
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