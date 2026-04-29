<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="card max-w-md w-full">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">注册账号</h2>
        <p class="text-gray-600">开始你的 Matchmaker 之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="请输入邮箱"
            class="input"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            class="input"
            required
            minlength="6"
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
            v-model="formData.birth_date"
            type="date"
            class="input"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
          <textarea
            v-model="formData.bio"
            class="input"
            rows="3"
            placeholder="介绍一下自己..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">标签（用逗号分隔）</label>
          <input
            v-model="formData.tags"
            type="text"
            placeholder="例如：旅行,美食,电影"
            class="input"
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
  email: '',
  password: '',
  nickname: '',
  gender: '',
  birth_date: '',
  bio: '',
  tags: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await authAPI.register(formData.value)
    console.log('注册成功:', response)

    // 保存 token 和用户信息
    if (response.access_token) {
      userStore.setToken(response.access_token)
      userStore.setUser(response.user)
    }

    // 跳转到匹配页
    router.push('/matches')
  } catch (err) {
    console.error('注册失败:', err)
    error.value = err.response?.data?.detail || err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
