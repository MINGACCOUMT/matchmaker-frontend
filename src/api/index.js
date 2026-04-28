import axios from 'axios'

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://matchmaker-api-bi2k.onrender.com'
).replace(/\/$/, '')

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
  (error) => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API 方法
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve({ success: true })
  }
}

export const userAPI = {
  getMe: () => api.get('/api/users/me'),
  updateMe: (data) => api.put('/api/users/me', data),
  discover: () => api.get('/api/users/discover')
}

export const matchAPI = {
  getMatches: () => api.get('/api/matches'),
  discoverUsers: () => api.get('/api/users/discover'),
  likeUser: (toUserId) => api.post('/api/matches/like', { to_user_id: toUserId })
}

export const chatAPI = {
  getConversations: () => api.get('/api/chat/conversations'),
  getMessages: (conversationId) => api.get(`/api/chat/messages/${conversationId}`),
  sendMessage: (conversationId, content) => api.post('/api/chat/messages', {
    conversation_id: conversationId,
    content
  })
}
