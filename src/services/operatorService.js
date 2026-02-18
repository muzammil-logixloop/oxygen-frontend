import apiClient from "./apiClient";

// Get logged-in operator's customer
export const getMyCustomer = async () => {
    try {
        const response = await apiClient.get("/operator/my-customer");
        return response.data;
    } catch (error) {
        console.error("Operator Service Error:", error);
        throw error;
    }
};
