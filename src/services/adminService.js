import apiClient from './apiClient';

// ================= CUSTOMERS =================
export const getCustomers = async () => {
    const response = await apiClient.get('/admin/customers');
    return response.data;
};

export const createCustomer = async (data) => {
    const response = await apiClient.post('/admin/customers', data);
    return response.data;
};

// ✅ Update Customer
export const updateCustomer = async (id, data) => {
    const response = await apiClient.put(`/admin/customers/${id}`, data);
    return response.data;
};

// ✅ Delete Customer
export const deleteCustomer = async (id) => {
    const response = await apiClient.delete(`/admin/customers/${id}`);
    return response.data;
};

// ================= CHAMBERS =================
export const getChambers = async () => {
    const response = await apiClient.get('/admin/chambers');
    return response.data;
};

export const createChamber = async (data) => {
    const response = await apiClient.post('/admin/chambers', data);
    return response.data;
};

// ✅ Update Chamber
export const updateChamber = async (id, data) => {
    const response = await apiClient.put(`/admin/chambers/${id}`, data);
    return response.data;
};

// ✅ Delete Chamber
export const deleteChamber = async (id) => {
    const response = await apiClient.delete(`/admin/chambers/${id}`);
    return response.data;
};

// ================= USERS =================
export const getUsers = async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
};

export const createUser = async (data) => {
    const response = await apiClient.post('/admin/users', data);
    return response.data;
};

// ✅ Update User
export const updateUser = async (id, data) => {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
};

// ================= DASHBOARD =================
export const statistics = async () => {
    const response = await apiClient.get('/admin/dashboard-stats');
    return response.data;
};
