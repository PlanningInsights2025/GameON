import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
  },
};

export const sportService = {
  list: async () => {
    const res = await API.get('/sports');
    return res.data;
  },
  get: async (id) => {
    const res = await API.get(`/sports/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/sports', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/sports/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/sports/${id}`);
    return res.data;
  },
};

export const disciplineService = {
  list: async (params) => {
    const res = await API.get('/disciplines', { params });
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/disciplines', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/disciplines/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/disciplines/${id}`);
    return res.data;
  },
};

export const productService = {
  list: async (filters) => {
    const res = await API.get('/products', { params: filters });
    return res.data;
  },
  get: async (id) => {
    const res = await API.get(`/products/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/products', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/products/${id}`);
    return res.data;
  },
};

export const orderService = {
  create: async (data) => {
    const res = await API.post('/orders', data);
    return res.data;
  },
  list: async () => {
    const res = await API.get('/orders');
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await API.put(`/orders/${id}/status`, { status });
    return res.data;
  },
};

export const otpService = {
  send: async (email) => {
    const res = await API.post('/otp/send', { email });
    return res.data;
  },
  verify: async (email, otp) => {
    const res = await API.post('/otp/verify', { email, otp });
    return res.data;
  },
};

export const bannerService = {
  list: async () => {
    const res = await API.get('/banners');
    return res.data;
  },
  getActive: async () => {
    const res = await API.get('/banners/active');
    return res.data;
  },
  get: async (id) => {
    const res = await API.get(`/banners/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/banners', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/banners/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/banners/${id}`);
    return res.data;
  },
  toggleStatus: async (id) => {
    const res = await API.patch(`/banners/${id}/toggle`);
    return res.data;
  },
};

export const reviewService = {
  list: async (productId) => {
    const res = await API.get(`/reviews/product/${productId}`);
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/reviews', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/reviews/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/reviews/${id}`);
    return res.data;
  },
};
