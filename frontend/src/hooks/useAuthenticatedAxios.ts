import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useMemo } from 'react';

export const useAuthenticatedAxios = () => {
  const { getToken } = useAuth();

  const authenticatedAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:5000/api',
    });

    // Add request interceptor to include auth token
    instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Auth token added to request');
          } else {
            console.log('⚠️ No auth token available');
          }
        } catch (error) {
          console.error('❌ Error getting auth token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('🚫 Authentication failed');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken]);

  return authenticatedAxios;
};
