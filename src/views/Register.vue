<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- 飘浮装饰 -->
    <div class="floating-decorations absolute inset-0 pointer-events-none overflow-hidden">
      <div class="star" style="top: 10%; left: 10%; animation-delay: 0s;">✨</div>
      <div class="heart" style="top: 20%; right: 15%; animation-delay: 1s;">💕</div>
      <div class="star" style="top: 60%; left: 8%; animation-delay: 2s;">⭐</div>
      <div class="heart" style="top: 70%; right: 10%; animation-delay: 0.5s;">💖</div>
      <div class="star" style="top: 40%; right: 20%; animation-delay: 1.5s;">✨</div>
    </div>

    <!-- 背景装饰圆 -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="card max-w-lg w-full relative z-10">
      <!-- 插画区域 -->
      <div class="illustration text-center -mt-20 mb-6">
        <div class="inline-block relative">
          <div class="w-32 h-32 mx-auto bg-gradient-to-br from-purple-300 via-pink-300 to-pink-400 rounded-full flex items-center justify-center shadow-uki-pink text-6xl relative z-10">
            🌸
          </div>
          <div class="absolute -top-2 -right-2 text-3xl animate-bounce-slow">✨</div>
          <div class="absolute -bottom-1 -left-3 text-2xl animate-bounce-slow" style="animation-delay: 0.5s;">💫</div>
        </div>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gradient mb-2">加入我们</h2>
        <p class="text-uki-text-secondary text-sm">开启你的 UkiUki 之旅 🌷</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="至少6位"
              class="input"
              required
              minlength="6"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">性别</label>
            <select v-model="formData.gender" class="input" required>
              <option value="">请选择</option>
              <option value="1">男 ♂️</option>
              <option value="2">女 ♀️</option>
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
            <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
            <input
              v-model="formData.tags"
              type="text"
              placeholder="旅行,美食,电影"
              class="input"
            />
          </div>
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

        <button type="submit" class="btn btn-primary w-full py-3.5" :disabled="loading">
          {{ loading ? '注册中...' : '立即注册 ✨' }}
        </button>

        <div v-if="error" class="text-red-500 text-center text-sm bg-red-50 rounded-xl py-2">
          {{ error }}
        </div>

        <div class="text-center text-gray-500 text-sm pt-2">
          已有账号？
          <RouterLink to="/login" class="text-pink-400 hover:text-pink-500 font-medium">立即登录 🌷</RouterLink>
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

    if (response.access_token) {
      userStore.setToken(response.access_token)
      userStore.setUser(response.user)
    }

    router.push('/matches')
  } catch (err) {
    console.error('注册失败:', err)
    error.value = err.response?.data?.detail || err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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
