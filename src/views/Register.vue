<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="card max-w-md w-full">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">注册账号</h2>
        <p class="text-gray-600">开始你的 Matchmaker 之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
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
          <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
          <input
            v-model="formData.nickname"
            type="text"
            placeholder="请输入昵称"
            class="input"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">性别</label>
          <select v-model="formData.gender" class="input" required>
            <option value="">请选择性别</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">生日</label>
          <input
            v-model="formData.birthday"
            type="date"
            class="input"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div v-if="error" class="text-red-500 text-center">
          {{ error }}
        </div>

        <div class="text-center text-gray-600">
          已有账号？
          <RouterLink to="/login" class="text-primary-600 hover:text-primary-700">立即登录</RouterLink>
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
  nickname: '',
  gender: '',
  birthday: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await authAPI.register(formData.value)
    console.log('注册成功:', response)
    
    // 注册成功后跳转到登录页
    router.push('/login')
  } catch (err) {
    console.error('注册失败:', err)
    error.value = err.response?.data?.detail || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
