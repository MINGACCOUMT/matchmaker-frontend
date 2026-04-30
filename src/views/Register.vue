<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8 animate-fade-in">
    <div class="card max-w-xl w-full card-hover">
      <!-- Logo 和标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl shadow-2xl mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <h2 class="text-4xl font-bold gradient-text mb-2">创建账号</h2>
        <p class="text-gray-500 text-lg">加入 Matchmaker，遇见你的另一半</p>
      </div>

      <!-- 进度指示器 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700">步骤 {{ step }} / 2</span>
          <span class="text-xs text-gray-400">{{ step === 1 ? '验证邮箱' : '完善信息' }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" :style="{ width: step === 1 ? '50%' : '100%' }"></div>
        </div>
      </div>

      <!-- 步骤 1：邮箱 + 验证码 -->
      <div v-if="step === 1" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">邮箱地址</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </span>
            <input
              v-model="formData.email"
              type="email"
              placeholder="请输入邮箱"
              class="input pl-12"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">验证码</label>
          <div class="flex gap-3">
            <div class="relative flex-1">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              <input
                v-model="formData.verifyCode"
                type="text"
                placeholder="请输入验证码"
                class="input pl-12"
                maxlength="6"
              />
            </div>
            <button
              type="button"
              class="btn btn-primary whitespace-nowrap text-sm px-5"
              :disabled="countdown > 0 || !formData.email"
              @click="sendVerifyCode"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
            </button>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-primary w-full text-lg font-semibold"
          :disabled="!canNext"
          @click="goNext"
        >
          下一步
        </button>
      </div>

      <!-- 步骤 2：密码 + 昵称 + 性别 + 生日 -->
      <form v-else @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">密码</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </span>
            <input
              v-model="formData.password"
              type="password"
              placeholder="至少6位密码"
              class="input pl-12"
              required
              minlength="6"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">昵称</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">性别</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </span>
              <select v-model="formData.gender" class="input pl-12 appearance-none cursor-pointer" required>
                <option value="">请选择性别</option>
                <option value="1">男</option>
                <option value="2">女</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">生日</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </span>
              <input
                v-model="formData.birth_date"
                type="date"
                class="input pl-12 cursor-pointer"
                required
              />
            </div>
          </div>
        </div>

        <!-- 用户协议 -->
        <div class="flex items-start gap-3">
          <input
            id="agreement"
            v-model="agreed"
            type="checkbox"
            class="mt-1 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400 cursor-pointer"
          />
          <label for="agreement" class="text-sm text-gray-600 cursor-pointer select-none">
            我已阅读并同意
            <a href="#" class="text-indigo-600 hover:text-indigo-700">《用户协议》</a>
            和
            <a href="#" class="text-indigo-600 hover:text-indigo-700">《隐私政策》</a>
          </label>
        </div>

        <!-- 按钮组 -->
        <div class="flex gap-4">
          <button
            type="button"
            class="btn btn-secondary flex-1 text-base font-semibold"
            @click="goBack"
          >
            返回上一步
          </button>
          <button
            type="submit"
            class="btn btn-primary flex-1 text-base font-semibold"
            :disabled="loading || !agreed"
          >
            <span v-if="!loading">完成注册</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              注册中...
            </span>
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            {{ error }}
          </div>
        </div>
      </form>

      <!-- 底部链接 -->
      <div class="mt-8 text-center text-gray-600">
        已有账号？
        <RouterLink to="/login" class="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
          立即登录
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const step = ref(1)
const countdown = ref(0)
let timer = null

const agreed = ref(false)

const formData = ref({
  email: '',
  verifyCode: '',
  password: '',
  nickname: '',
  gender: '',
  birth_date: '',
  bio: '',
  tags: ''
})

const loading = ref(false)
const error = ref('')

const canNext = computed(() => {
  return (
    formData.value.email &&
    formData.value.verifyCode &&
    formData.value.verifyCode.length >= 4
  )
})

const sendVerifyCode = () => {
  if (!formData.value.email || countdown.value > 0) return

  // TODO: 调用发送验证码 API（如需要）
  // 当前模拟倒计时效果
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const goNext = () => {
  if (!canNext.value) return
  error.value = ''
  step.value = 2
}

const goBack = () => {
  step.value = 1
  error.value = ''
}

const handleRegister = async () => {
  if (!agreed.value) return
  loading.value = true
  error.value = ''

  try {
    const payload = {
      email: formData.value.email,
      password: formData.value.password,
      nickname: formData.value.nickname,
      gender: parseInt(formData.value.gender) || 0,
      birth_date: formData.value.birth_date || null,
      bio: formData.value.bio || null,
      tags: formData.value.tags
        ? JSON.stringify(formData.value.tags.split(',').map(t => t.trim()).filter(Boolean))
        : '[]'
    }

    const response = await authAPI.register(payload)
    console.log('注册成功:', response)

    if (response.access_token) {
      userStore.setToken(response.access_token)
      userStore.setUser(response.user)
    }

    router.push('/welcome')
  } catch (err) {
    console.error('注册失败:', err)
    let msg = '注册失败，请重试'
    if (err.response?.data?.detail) {
      const detail = err.response.data.detail
      msg = Array.isArray(detail) ? detail.map(d => d.msg).join('; ') : detail
    } else if (err.message) {
      msg = err.message
    }
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>
