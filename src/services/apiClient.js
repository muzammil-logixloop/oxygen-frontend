import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend runs on different port
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
