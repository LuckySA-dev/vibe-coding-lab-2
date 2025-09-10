import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Books API
export const booksApi = {
  getAll: () => api.get('/books'),
  getById: (id: string) => api.get(`/books/${id}`),
  create: (data: any) => api.post('/books', data),
  update: (id: string, data: any) => api.put(`/books/${id}`, data),
  delete: (id: string) => api.delete(`/books/${id}`),
  borrow: (id: string) => api.post(`/books/${id}/borrow`),
  return: (id: string) => api.post(`/books/${id}/return`),
};

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};
