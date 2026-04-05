import axios from 'axios';
import {useUser} from "../context/UserContext.jsx";

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const {logout} = useUser();

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {

                await axios.post('http://localhost:8080/auth/refresh', {}, { withCredentials: true });


                return api(originalRequest);
            } catch (refreshError) {
                logout();
                console.error("Refresh token expired");
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;