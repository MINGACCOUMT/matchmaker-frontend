<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- 飘浮装饰 -->
    <div class="floating-decorations absolute inset-0 pointer-events-none overflow-hidden">
      <div class="star" style="top: 10%; left: 10%; animation-delay: 0s;">✨</div>
      <div class="heart" style="top: 20%; right: 15%; animation-delay: 1s;">💕</div>
      <div class="star" style="top: 60%; left: 8%; animation-delay: 2s;">⭐</div>
      <div class="heart" style="top: 70%; right: 10%; animation-delay: 0.5s;">💖</div>
      <div class="star" style="top: 40%; right: 20%; animation-delay: 1.5s;">✨</div>
      <div class="heart" style="top: 15%; left: 25%; animation-delay: 2.5s;">💗</div>
      <div class="star" style="top: 80%; left: 30%; animation-delay: 3s;">🌟</div>
    </div>

    <!-- 背景装饰圆 -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="card max-w-md w-full relative z-10">
      <!-- 插画区域 -->
      <div class="illustration text-center -mt-20 mb-6">
        <div class="inline-block relative">
          <div class="w-32 h-32 mx-auto bg-gradient-to-br from-pink-300 via-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-uki-pink text-6xl relative z-10">
            💕
          </div>
          <div class="absolute -top-2 -right-2 text-3xl animate-bounce-slow">✨</div>
          <div class="absolute -bottom-1 -left-3 text-2xl animate-bounce-slow" style="animation-delay: 0.5s;">🌸</div>
        </div>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gradient mb-2">欢迎回来</h2>
        <p class="text-uki-text-secondary text-sm">登录你的 UkiUki 账号 ✨</p>
      </div>

      <!-- Tab 切换 -->
      <div class="flex justify-center mb-6 bg-white rounded-full p-1 shadow-sm border border-gray-100">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
            activeTab === tab.key
              ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-md'
              : 'text-gray-500 hover:text-pink-400'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
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
            placeholder="请输入密码"
            class="input"
            required
          />
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-500 cursor-pointer">
            <input type="checkbox" class="rounded border-gray-300 text-pink-400 focus:ring-pink-300" />
            记住我
          </label>
          <a href="#" class="text-pink-400 hover:text-pink-500">忘记密码？</a>
        </div>

        <button type="submit" class="btn btn-primary w-full py-3.5" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div v-if="error" class="text-red-500 text-center text-sm bg-red-50 rounded-xl py-2">
          {{ error }}
        </div>

        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-100"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white/80 text-gray-400 rounded-full">或者</span>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button type="button" class="btn-social">
            <span class="text-xl">📱</span>
          </button>
          <button type="button" class="btn-social">
            <span class="text-xl">💬</span>
          </button>
          <button type="button" class="btn-social">
            <span class="text-xl">📧</span>
          </button>
        </div>

        <div class="text-center text-gray-500 text-sm pt-2">
          还没有账号？
          <RouterLink to="/register" class="text-pink-400 hover:text-pink-500 font-medium">立即注册 🌸</RouterLink>
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

const tabs = [
  { key: 'email', label: '邮箱登录' },
  { key: 'phone', label: '手机登录' },
]
const activeTab = ref('email')

const formData = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await authAPI.login(formData.value)
    console.log('登录成功:', response)

    if (response.access_token) {
      userStore.setToken(response.access_token)
      userStore.setUser(response.user)
    }

    router.push('/matches')
  } catch (err) {
    console.error('登录失败:', err)
    error.value = err.response?.data?.detail || err.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.illustration {
  position: relative;
}

.btn-social {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-social:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 143, 171, 0.2);
  border-color: #FF8FAB;
}

.floating-decorations .star,
.floating-decorations .heart {
  position: absolute;
  font-size: 20px;
  opacity: 0.6;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
    opacity: 0.8;
  }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
