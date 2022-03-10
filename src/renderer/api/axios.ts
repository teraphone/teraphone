import axios from 'axios';

// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'https://api.dally.app';

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosPublic;
