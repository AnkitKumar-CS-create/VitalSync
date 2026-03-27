import axios from 'axios';

// Backend ka base URL set karo
const API_URL = 'http://localhost:8080/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example: Health data fetch karne ka function
export const getHealthRecords = async () => {
  try {
    const response = await api.get('/records'); // Backend endpoint: /api/records
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export default api;