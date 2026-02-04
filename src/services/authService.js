import apiClient from './apiClient';

export const loginUser = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};

export const signupUser = async (username, email, password) => {
    const response = await apiClient.post('/auth/signup', { username, email, password });
    return response.data;
};

export const getMe = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
}

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
