<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in relative overflow-hidden">
    <!-- 飘浮装饰 -->
    <div class="absolute top-10 left-10 text-pink-300 opacity-40 animate-float">
      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
    <div class="absolute top-20 right-16 text-purple-300 opacity-30 animate-float-delay">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
    <div class="absolute bottom-20 left-16 text-pink-200 opacity-40 animate-float">
      <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
    <div class="absolute bottom-10 right-10 text-purple-200 opacity-30 animate-float-delay">
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>

    <div class="max-w-md w-full relative z-10">
      <!-- 插画 Logo 区域 -->
      <div class="flex justify-center -mb-10 relative z-20">
        <div class="w-24 h-24 bg-gradient-to-br from-pink-300 via-purple-400 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
      </div>

      <!-- 登录卡片 -->
      <div class="card w-full pt-14 pb-8 px-8">
        <!-- 品牌区 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gradient mb-2">欢迎来到 UkiUki</h1>
          <p class="text-gray-500 text-base">遇见心动的你</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">邮箱 / 手机号</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </span>
              <input
                v-model="formData.email"
                type="text"
                placeholder="请输入邮箱或手机号"
                class="input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">密码</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="input pl-12 pr-12"
                required
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end">
            <a href="#" class="text-sm text-pink-500 hover:text-pink-600 font-medium" @click.prevent="handleForgotPassword">
              忘记密码？
            </a>
          </div>

          <!-- 用户协议 -->
          <div class="flex items-start">
            <input
              id="agreement"
              v-model="agreed"
              type="checkbox"
              class="mt-1 w-4 h-4 text-pink-500 rounded border-gray-300 focus:ring-pink-400 cursor-pointer"
            />
            <label for="agreement" class="ml-2 text-sm text-gray-500 cursor-pointer select-none">
              我已阅读并同意
              <a href="#" class="text-pink-500 hover:text-pink-600 font-medium" @click.prevent>《用户协议》</a>
              和
              <a href="#" class="text-pink-500 hover:text-pink-600 font-medium" @click.prevent>《隐私政策》</a>
            </label>
          </div>

          <!-- 登录按钮 -->
          <button type="submit" class="btn btn-primary w-full text-lg font-semibold" :disabled="loading">
            <span v-if="!loading">登录</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              登录中...
            </span>
          </button>

          <!-- 注册按钮 -->
          <RouterLink to="/register" class="btn btn-outline w-full text-center block">
            注册新账号
          </RouterLink>

          <!-- 错误提示 -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              {{ error }}
            </div>
          </div>
        </form>

        <!-- 第三方登录 -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"/>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-400">其他方式登录</span>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-center gap-6">
            <button
              type="button"
              class="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-green-500 hover:shadow-md hover:scale-105 transition-all"
              @click="socialLogin('微信')"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 0 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
            </button>
            <button
              type="button"
              class="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-blue-500 hover:shadow-md hover:scale-105 transition-all"
              @click="socialLogin('QQ')"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 5.58 2 10c0 2.03.88 3.87 2.3 5.23-.1.55-.5 2.04-.58 2.37-.09.35.12.52.36.36.24-.16 2.45-1.65 2.87-1.95.83.23 1.72.36 2.64.36.28 0 .55-.02.82-.04-.7-2.08.1-4.1 1.6-5.38 1.4-1.16 3.2-1.62 4.83-1.5C16.8 5.5 14.6 2 12 2zm-2 4c.83 0 1.5.67 1.5 1.5S10.83 9 10 9s-1.5-.67-1.5-1.5S9.17 6 10 6zm4 0c.83 0 1.5.67 1.5 1.5S14.83 9 14 9s-1.5-.67-1.5-1.5S13.17 6 14 6zm-2 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
            <button
              type="button"
              class="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-900 hover:shadow-md hover:scale-105 transition-all"
              @click="socialLogin('抖音')"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.3 0 .59.05.86.13V9.1a6.37 6.37 0 0 0-.86-.06A6.34 6.34 0 0 0 2.75 15.38 6.34 6.34 0 0 0 9.09 21.72a6.34 6.34 0 0 0 6.34-6.34V9.91a8.13 8.13 0 0 0 4.78 1.54V7.91a4.78 4.78 0 0 1-.62-.22z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const agreed = ref(false)

const handleLogin = async () => {
  if (!agreed.value) {
    error.value = '请先阅读并同意《用户协议》和《隐私政策》'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await authAPI.login({
      email: formData.value.email,
      password: formData.value.password
    })
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

const handleForgotPassword = () => {
  alert('找回密码功能正在开发中，敬请期待')
}

const socialLogin = (platform) => {
  console.log(`${platform}登录暂未支持`)
  alert(`${platform}登录暂未支持`)
}
</script>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-delay {
  animation: float 6s ease-in-out 3s infinite;
}
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
