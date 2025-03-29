import axios from 'axios';

const API_BASE_URL = '/api/v1/hospital';

export const fetchHospitals = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.data; // Return only the hospital data
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};
