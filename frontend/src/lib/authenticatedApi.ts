import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make authenticated API calls
export const makeAuthenticatedRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  getToken?: () => Promise<string | null>
) => {
  try {
    const token = getToken ? await getToken() : null;
    
    const config: any = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Auth token added to request');
    } else {
      console.log('⚠️ No auth token available');
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }

    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.error('❌ API request failed:', error.response?.data || error.message);
    throw error;
  }
};

// Specific helper functions
export const authenticatedGet = (endpoint: string, getToken?: () => Promise<string | null>) =>
  makeAuthenticatedRequest('GET', endpoint, undefined, getToken);

export const authenticatedPost = (endpoint: string, data: any, getToken?: () => Promise<string | null>) =>
  makeAuthenticatedRequest('POST', endpoint, data, getToken);

export const authenticatedPut = (endpoint: string, data: any, getToken?: () => Promise<string | null>) =>
  makeAuthenticatedRequest('PUT', endpoint, data, getToken);

export const authenticatedDelete = (endpoint: string, getToken?: () => Promise<string | null>) =>
  makeAuthenticatedRequest('DELETE', endpoint, undefined, getToken);
