import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const commonConfig = {
    baseURL: BASE_URL,
    withCredentials: true,
};

const attachInterceptors = (instance) => {
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                    return instance(originalRequest);
                } catch (refreshError) {
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