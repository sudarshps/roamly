import axios from 'axios';

const useAxiosWithAuth = () => {
  const baseURL = process.env.BASE_URL
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });

  return axiosInstance;
};

export default useAxiosWithAuth;