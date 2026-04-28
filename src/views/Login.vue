<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="card max-w-md w-full">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">登录</h2>
        <p class="text-gray-600">欢迎回到 Matchmaker</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="请输入手机号"
            class="input"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            class="input"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div v-if="error" class="text-red-500 text-center">
          {{ error }}
        </div>

        <div class="text-center text-gray-600">
          还没有账号？
          <RouterLink to="/register" class="text-primary-600 hover:text-primary-700">立即注册</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  phone: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // TODO: 实现登录 API
    // const response = await authAPI.login(formData.value)
    // userStore.setToken(response.token)
    // userStore.setUser(response.user)
    
    // 临时模拟登录
    console.log('登录成功（临时模拟）')
    userStore.setToken('mock-token')
    userStore.setUser({ id: 1, phone: formData.value.phone })
    
    router.push('/matches')
  } catch (err) {
    console.error('登录失败:', err)
    error.value = err.response?.data?.detail || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
