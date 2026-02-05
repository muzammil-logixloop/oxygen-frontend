import apiClient from './apiClient';

export const getMyChambers = async () => {
    const response = await apiClient.get('/ops/chambers');
    return response.data;
};

export const getChamberDetails = async (id) => {
    const response = await apiClient.get(`/ops/chambers/${id}`);
    return response.data;
};

// export const submitChecklist = async (formData) => {
//     // formData must be FormData object if file included
//     const response = await apiClient.post('/ops/checklists', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     });
//     return response.data;
// };

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

export const submitChecklist = async (payload) => {
  const res = await apiClient.post('/ops/checklists/submit', payload);
  return res.data;
};
