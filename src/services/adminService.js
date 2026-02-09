import apiClient from './apiClient';

// Customers
export const getCustomers = async () => {
    const response = await apiClient.get('/admin/customers');
    return response.data;
};

export const createCustomer = async (data) => {
    const response = await apiClient.post('/admin/customers', data);
    return response.data;
};

// Chambers
export const getChambers = async () => {
    const response = await apiClient.get('/admin/chambers');
    return response.data;
};

export const createChamber = async (data) => {
    const response = await apiClient.post('/admin/chambers', data);
    return response.data;
};

export const assignUserToCustomer = async (userId, customerId) => {
    const response = await apiClient.post('/admin/assign-user', { userId, customerId });
    return response.data;
}

// Users
export const getUsers = async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
};

export const createUser = async (data) => {
    const response = await apiClient.post('/admin/users', data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
};

export const statstics = async () => {
    const response = await apiClient.get('/admin/dashboard-stats');
    return response.data;
}