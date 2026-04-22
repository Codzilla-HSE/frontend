import axios from 'axios';
import {useUser} from "../context/UserContext.jsx";

const BASE_URL = 'http://localhost:8080';

const commonConfig = {
    baseURL: BASE_URL,
    withCredentials: true,
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304
};



const attachInterceptors = (instance) => {
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const {logout} = useUser();
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                    return instance(originalRequest);
                } catch (refreshError) {
                    logout();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
    return instance;
};
export const api = attachInterceptors(axios.create({
    ...commonConfig,
    headers: { 'Content-Type': 'application/json' }
}));

export const multipartApi = attachInterceptors(axios.create({
    ...commonConfig,
}));
