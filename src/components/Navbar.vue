<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <span class="text-2xl font-bold gradient-text">Matchmaker</span>
        </RouterLink>

        <!-- 导航链接（已登录） -->
        <div v-if="userStore.token" class="flex items-center space-x-2">
          <RouterLink
            to="/matches"
            class="nav-link flex items-center space-x-1"
            :class="{ 'nav-link-active': $route.name === 'Matches' }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span>匹配</span>
          </RouterLink>

          <RouterLink
            to="/chat"
            class="nav-link flex items-center space-x-1 relative"
            :class="{ 'nav-link-active': $route.name === 'Chat' }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span>聊天</span>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ unreadCount }}
            </span>
          </RouterLink>

          <RouterLink
            to="/profile"
            class="nav-link flex items-center space-x-1"
            :class="{ 'nav-link-active': $route.name === 'Profile' }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>资料</span>
          </RouterLink>

          <!-- 用户头像 -->
          <button
            @click="showUserMenu = !showUserMenu"
            class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg ml-2"
          >
            {{ userStore.user?.nickname?.charAt(0) || '?' }}
          </button>

          <!-- 用户菜单 -->
          <div v-if="showUserMenu" class="absolute top-16 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-fade-in">
            <div class="px-4 py-2 border-b border-gray-200">
              <p class="font-semibold text-gray-900">{{ userStore.user?.nickname }}</p>
              <p class="text-sm text-gray-500">{{ userStore.user?.email }}</p>
            </div>
            <RouterLink
              to="/profile"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              @click="showUserMenu = false"
            >
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>个人资料</span>
              </div>
            </RouterLink>
            <RouterLink
              to="/settings"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              @click="showUserMenu = false"
            >
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>设置</span>
              </div>
            </RouterLink>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>退出登录</span>
            </button>
          </div>
        </div>

        <!-- 未登录按钮 -->
        <div v-else class="flex items-center space-x-3">
          <RouterLink to="/login" class="btn btn-secondary px-6 py-2">
            登录
          </RouterLink>
          <RouterLink to="/register" class="btn btn-primary px-6 py-2">
            注册
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const showUserMenu = ref(false)
const unreadCount = ref(0)

const handleLogout = () => {
  userStore.logout()
  showUserMenu.value = false
  router.push('/')
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (showUserMenu.value && !event.target.closest('.nav-link')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
