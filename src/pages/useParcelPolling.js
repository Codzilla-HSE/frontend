import { useState, useEffect, useRef } from 'react'
import api from '../api/axiosConfig'

export const useParcelPolling = () => {
    const [submissions, setSubmissions] = useState([]);
    const [hasError, setHasError] = useState(false);
    const isMountedRef = useRef(true);
    const lastUpdateRef = useRef(null);

    useEffect(() => {
        isMountedRef.current = true;
        let timeoutId = null;

        const poll = async () => {
            if (!isMountedRef.current) return;

            const controller = new AbortController();

            try {
                const params = {};
                if (lastUpdateRef.current) {
                    params.lastUpdate = lastUpdateRef.current;
                }

                const response = await api.get('/my-submissions', {
                    signal: controller.signal,
                    params,
                    timeout: 25000
                });
		
		
                if (!isMountedRef.current) return;

                if (response.status === 200) {
		    setSubmissions(response.data);
		    setHasError(false);

		    if (response.data.length > 0) {
			const latest = response.data.reduce((max, sub) =>
			    sub.updatedAt > max ? sub.updatedAt : max,
			    response.data[0].updatedAt
			);
			lastUpdateRef.current = latest.endsWith('Z') ? latest : latest + 'Z';
		    } else if (!lastUpdateRef.current) {
			lastUpdateRef.current = new Date().toISOString();
		    }
		}

                if (isMountedRef.current) {
                    poll();
                }

            } catch (error) {
                if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;

                if (isMountedRef.current) {
                    console.error('Polling error:', error);
                    setHasError(true);
                    timeoutId = setTimeout(poll, 3000);
                }
            }
        };

        poll();

        return () => {
            isMountedRef.current = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return { submissions, hasError };
};
