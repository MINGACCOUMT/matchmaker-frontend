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

      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gradient mb-2">加入我们</h2>
        <p class="text-uki-text-secondary text-sm">开启你的 UkiUki 之旅 🍷</p>
      </div>

      <!-- 进度指示器 -->
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center gap-2">
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step >= 1 ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-md' : 'bg-gray-100 text-gray-400'
            ]"
          >1</div>
          <div class="w-16 h-1 rounded-full overflow-hidden bg-gray-100">
            <div
              class="h-full bg-gradient-to-r from-pink-300 to-pink-400 transition-all duration-500"
              :style="{ width: step >= 2 ? '100%' : '0%' }"
            ></div>
          </div>
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step >= 2 ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-md' : 'bg-gray-100 text-gray-400'
            ]"
          >2</div>
        </div>
      </div>
      <div class="flex justify-center gap-12 text-xs text-gray-500 mb-6 -mt-5">
        <span :class="step === 1 ? 'text-pink-500 font-medium' : ''">验证账号</span>
        <span :class="step === 2 ? 'text-pink-500 font-medium' : ''">完善资料</span>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- 第一步：邮箱/手机号 + 验证码 -->
        <template v-if="step === 1">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱或手机号</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </span>
              <input
                v-model="formData.account"
                type="text"
                placeholder="请输入邮箱或手机号"
                class="input pl-12"
                required
              />
            </div>
          </div>

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

        <!-- 第二步：密码 + 昵称 + 性别 + 生日 -->
        <template v-if="step === 2">
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
                placeholder="至少6位密码"
                class="input pl-12 pr-12"
                required
                minlength="6"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              <input
                v-model="formData.nickname"
                type="text"
                placeholder="给自己起个好听的昵称"
                class="input pl-12"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-5">
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
          </div>
        </template>

        <div v-if="error" class="text-red-500 text-center text-sm bg-red-50 rounded-xl py-2">
          {{ error }}
        </div>

        <!-- 步骤按钮 -->
        <div class="flex gap-3">
          <button
            v-if="step === 2"
            type="button"
            @click="step = 1"
            class="btn btn-secondary flex-1 py-3"
          >
            上一步
          </button>
          <button
            v-if="step === 1"
            type="button"
            @click="goStep2"
            class="btn btn-primary flex-1 py-3"
          >
            下一步
          </button>
          <button
            v-else
            type="submit"
            class="btn btn-primary flex-1 py-3"
            :disabled="loading"
          >
            {{ loading ? '注册中...' : '立即注册 ✨' }}
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
          已有账号？
          <RouterLink to="/login" class="text-pink-400 hover:text-pink-500 font-medium">立即登录 🍷</RouterLink>
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

const step = ref(1)
const showPassword = ref(false)
const agreed = ref(false)
const loading = ref(false)
const error = ref('')
const countdown = ref(0)
let timer = null

const formData = ref({
  account: '',
  code: '',
  password: '',
  nickname: '',
  gender: '',
  birth_date: ''
})

const sendCode = () => {
  if (!formData.value.account) {
    error.value = '请先输入邮箱或手机号'
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

const goStep2 = () => {
  if (!formData.value.account || !formData.value.code) {
    error.value = '请填写邮箱/手机号和验证码'
    return
  }
  error.value = ''
  step.value = 2
}

const handleRegister = async () => {
  if (!agreed.value) {
    error.value = '请先同意用户协议和隐私政策'
    return
  }
  loading.value = true
  error.value = ''

  try {
    const response = await authAPI.register({
      email: formData.value.account,
      password: formData.value.password,
      nickname: formData.value.nickname,
      gender: formData.value.gender,
      birth_date: formData.value.birth_date
    })
    console.log('注册成功:', response)

    if (response.access_token) {
      userStore.setToken(response.access_token)
      userStore.setUser(response.user)
    }

    router.push('/welcome')
  } catch (err) {
    console.error('注册失败:', err)
    error.value = err.response?.data?.detail || err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}

const handleSubmit = () => {
  if (step.value === 1) {
    goStep2()
  } else {
    handleRegister()
  }
}
</script>

<style scoped>
.illustration {
  position: relative;
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
