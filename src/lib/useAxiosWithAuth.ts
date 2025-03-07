import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

const useAxiosWithAuth = () => {
  const { getToken } = useAuth();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
  });

  useEffect(() => {
    // Add a request interceptor to attach the token
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          console.error('Error fetching token:', error);
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);

  return axiosInstance;
};

export default useAxiosWithAuth;