import axios from 'axios';

const api = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {

                await axios.post('/auth/refresh', {}, { withCredentials: true });


                return api(originalRequest);
            } catch (refreshError) {

                console.error("Refresh token expired");
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
