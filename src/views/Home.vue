<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-primary-600">Matchmaker</h1>
          </div>
          <div class="flex items-center space-x-4">
            <RouterLink v-if="!userStore.token" to="/login" class="btn btn-secondary">登录</RouterLink>
            <RouterLink v-if="!userStore.token" to="/register" class="btn btn-primary">注册</RouterLink>
            <div v-else class="flex items-center space-x-4">
              <RouterLink to="/matches" class="btn btn-secondary">匹配</RouterLink>
              <RouterLink to="/profile" class="btn btn-secondary">资料</RouterLink>
              <button @click="handleLogout" class="btn btn-primary">退出</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="flex-1 flex items-center justify-center px-4">
      <div class="card max-w-md w-full">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">找到你的真爱</h2>
          <p class="text-gray-600">Matchmaker 帮助你找到心仪的伴侣</p>
        </div>
        <div class="space-y-4">
          <RouterLink to="/register" class="btn btn-primary w-full text-center block">开始使用</RouterLink>
          <RouterLink to="/login" class="btn btn-secondary w-full text-center block">已有账号？登录</RouterLink>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2024 Matchmaker. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>
