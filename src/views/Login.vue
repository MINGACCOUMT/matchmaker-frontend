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
        <h1 class="text-3xl font-bold text-gradient mb-2">欢迎来到 UkiUki</h1>
        <p class="text-uki-text-secondary text-sm">遇见心动的你 ✨</p>
      </div>

      <!-- Tab 切换 -->
      <div class="flex mb-6 border-b border-gray-100">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'flex-1 pb-3 text-sm font-medium transition-all duration-200 relative',
            activeTab === tab.key
              ? 'text-pink-500'
              : 'text-gray-400 hover:text-pink-300'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full"
          ></span>
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- 账号输入 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ activeTab === 'password' ? '邮箱/手机号' : '手机号' }}
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </span>
            <input
              v-model="formData.account"
              type="text"
              :placeholder="activeTab === 'password' ? '请输入邮箱或手机号' : '请输入手机号'"
              class="input pl-12"
              required
            />
          </div>
        </div>

        <!-- 密码登录模式 -->
        <template v-if="activeTab === 'password'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
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
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-gray-500 cursor-pointer">
              <input v-model="rememberMe" type="checkbox" class="rounded border-gray-300 text-pink-400 focus:ring-pink-300 w-4 h-4" />
              记住我
            </label>
            <a href="#" class="text-pink-400 hover:text-pink-500">忘记密码？</a>
          </div>
        </template>

        <!-- 短信登录模式 -->
        <template v-else>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">验证码</label>
            <div class="flex gap-3">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </span>
                <input
                  v-model="formData.code"
                  type="text"
                  placeholder="请输入验证码"
                  class="input pl-12"
                  required
                  maxlength="6"
                />
              </div>
              <button
                type="button"
                @click="sendCode"
                :disabled="countdown > 0"
                class="btn btn-outline whitespace-nowrap px-4 py-2.5 text-sm"
                :class="countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>
        </template>

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
            <span class="px-4 bg-white/80 text-gray-400 rounded-full">第三方登录</span>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button type="button" class="btn-social" title="微信登录">
            <svg class="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05a5.79 5.79 0 01-.153-1.323c0-3.668 3.617-6.64 8.074-6.64.244 0 .485.017.724.037C17.07 4.727 13.293 2.188 8.691 2.188zM5.785 6.635a.943.943 0 110 1.886.943.943 0 010-1.886zm5.408 0a.943.943 0 110 1.886.943.943 0 010-1.886zm5.453 4.696c-3.946 0-7.147 2.56-7.147 5.718 0 3.157 3.201 5.717 7.147 5.717.72 0 1.413-.093 2.06-.26a.712.712 0 01.587.08l1.558.913a.266.266 0 00.137.044c.13 0 .237-.11.237-.244 0-.06-.023-.118-.039-.175l-.319-1.21a.483.483 0 01.175-.544c1.5-1.11 2.456-2.757 2.456-4.59 0-3.158-3.2-5.717-7.146-5.717l-.706.246zm-2.516 2.94a.755.755 0 110 1.51.755.755 0 010-1.51zm5.032 0a.755.755 0 110 1.51.755.755 0 010-1.51z"/>
            </svg>
          </button>
          <button type="button" class="btn-social" title="QQ登录">
            <svg class="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.21 0 6.287.257 6.287-.43 0-.687-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.747 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"/>
            </svg>
          </button>
          <button type="button" class="btn-social" title="抖音登录">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.26 0 .5.04.74.11V9.35a6.37 6.37 0 00-.74-.04A6.34 6.34 0 003.14 15.65a6.34 6.34 0 006.33 6.34 6.34 6.34 0 006.33-6.34V9.01a8.18 8.18 0 004.77 1.53V7.1a4.85 4.85 0 01-1.98-.41z" fill="#000"/>
            </svg>
          </button>
        </div>

        <!-- 用户协议 -->
        <div class="flex items-start gap-2 pt-2">
          <input
            v-model="agreed"
            type="checkbox"
            class="mt-0.5 rounded border-gray-300 text-pink-400 focus:ring-pink-300 w-4 h-4"
          />
          <span class="text-xs text-gray-500 leading-relaxed">
            我已阅读并同意
            <a href="#" class="text-pink-400 hover:text-pink-500">《用户协议》</a>
            和
            <a href="#" class="text-pink-400 hover:text-pink-500">《隐私政策》</a>
          </span>
        </div>

        <div class="text-center text-gray-500 text-sm pt-2">
          还没有账号？
          <RouterLink to="/register" class="text-pink-400 hover:text-pink-500 font-medium">注册新账号 🌸</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const tabs = [
  { key: 'password', label: '密码登录' },
  { key: 'sms', label: '短信登录' },
]
const activeTab = ref('password')

const formData = ref({
  account: '',
  password: '',
  code: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const agreed = ref(false)
const loading = ref(false)
const error = ref('')
const countdown = ref(0)

let timer = null

watch(activeTab, () => {
  error.value = ''
  formData.value.password = ''
  formData.value.code = ''
})

const sendCode = () => {
  if (!formData.value.account) {
    error.value = '请先输入手机号'
    return
  }
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleLogin = async () => {
  if (!agreed.value) {
    error.value = '请先同意用户协议和隐私政策'
    return
  }
  loading.value = true
  error.value = ''

  try {
    const payload = activeTab.value === 'password'
      ? { email: formData.value.account, password: formData.value.password }
      : { phone: formData.value.account, code: formData.value.code }
    const response = await authAPI.login(payload)
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
