import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://matchmaker-api-bi2k.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API 方法
export const authAPI = {
  register: (data) => api.post('/api/v1/register', data),
  login: (data) => api.post('/api/v1/login', data),
  logout: () => api.post('/api/v1/logout')
}

export const userAPI = {
  getProfile: (userId) => api.get(`/api/v1/profile/${userId}`),
  updateProfile: (userId, data) => api.put(`/api/v1/profile/${userId}`, data)
}

export const matchAPI = {
  findMatches: (data) => api.post('/api/v1/find', data),
  likeUser: (userId, targetId) => api.post(`/api/v1/like/${userId}/${targetId}`)
}
