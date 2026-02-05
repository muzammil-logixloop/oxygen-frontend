import apiClient from './apiClient';

export const getMyChambers = async () => {
    const response = await apiClient.get('/ops/chambers');
    return response.data;
};

export const getChamberDetails = async (id) => {
    const response = await apiClient.get(`/ops/chambers/${id}`);
    return response.data;
};

export const reportIssue = async (formData) => {
    const response = await apiClient.post('/ops/issues', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


export const getChecklistTemplate = async (type) => {
  const res = await apiClient.get(`/ops/checklists/template/${type}`);
  return res.data;
};

export const submitChecklist = async (payload, isFormData = false) => {
  const res = await apiClient.post('/ops/checklists/submit', payload, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
    }
  });
  return res.data;
};

export const getMyChecklists = async () => {
  const res = await apiClient.get('/ops/checklists/my-submissions'); // adjust the path if different
  return res.data;
};