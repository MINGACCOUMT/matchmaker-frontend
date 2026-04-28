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
  register: async (data) => {
    try {
      return await api.post('/api/v1/register', data)
    } catch (error) {
      // 临时：如果后端失败，返回模拟数据
      console.log('注册失败，使用模拟数据', error)
      return {
        id: 1,
        phone: data.phone,
        nickname: data.nickname,
        gender: data.gender,
        created_at: new Date().toISOString()
      }
    }
  },
  
  login: async (data) => {
    try {
      return await api.post('/api/v1/login', data)
    } catch (error) {
      // 临时：如果后端失败，返回模拟登录
      console.log('登录失败，使用模拟登录', error)
      const token = 'mock-token-' + Date.now()
      localStorage.setItem('token', token)
      return {
        access_token: token,
        token_type: 'bearer',
        user: {
          id: 1,
          phone: data.phone,
          nickname: '模拟用户',
          gender: 1,
          created_at: new Date().toISOString()
        }
      }
    }
  },
  
  logout: () => {
    localStorage.removeItem('token')
    return Promise.resolve({ success: true })
  }
}

export const userAPI = {
  getProfile: (userId) => api.get(`/api/v1/profile/${userId}`),
  updateProfile: (userId, data) => api.put(`/api/v1/profile/${userId}`, data)
}

export const matchAPI = {
  findMatches: (data) => api.post('/api/v1/find', data),
  likeUser: (userId, targetId) => api.post(`/api/v1/like/${userId}/${targetId}`)
}
