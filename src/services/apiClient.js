import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://oxygen.logixloop.com/api', // Added /api to match Nginx proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;