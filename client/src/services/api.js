import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send HttpOnly cookie
});

export default API;
