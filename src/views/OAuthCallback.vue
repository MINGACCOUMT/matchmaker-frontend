<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <svg class="animate-spin mx-auto h-10 w-10 text-pink-500 mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <p class="text-gray-600 text-lg">{{ statusText }}</p>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { oauthAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const statusText = ref('正在登录...')
const error = ref('')

onMounted(async () => {
  const provider = route.query.provider || localStorage.getItem('oauth_provider')
  const code = route.query.code
  const state = route.query.state

  if (!provider || !code) {
    error.value = '缺少授权信息'
    statusText.value = '登录失败'
    setTimeout(() => router.push('/login'), 2000)
    return
  }

  // Clean up stored provider
  localStorage.removeItem('oauth_provider')

  try {
    statusText.value = '正在验证...'
    const response = await oauthAPI.callback(provider, code, state)

    if (response.access_token) {
      userStore.setToken(response.access_token)
      userStore.setUser(response.user)
      statusText.value = '登录成功！'
      router.push('/matches')
    } else {
      throw new Error('登录失败')
    }
  } catch (err) {
    console.error('OAuth 登录失败:', err)
    error.value = err.response?.data?.detail || err.message || '登录失败，请重试'
    statusText.value = '登录失败'
    setTimeout(() => router.push('/login'), 2000)
  }
})
</script>
