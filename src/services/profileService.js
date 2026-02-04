import apiClient from './apiClient';

export const getProfile = async () => {
    const response = await apiClient.get('/profile');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
};

export const uploadProfileImage = async (formData) => {
    const response = await apiClient.post('/profile/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
