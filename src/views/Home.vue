<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-[-10%] right-[-5%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-[40%] left-[10%] text-4xl opacity-20 animate-float pointer-events-none">✨</div>
    <div class="absolute top-[20%] right-[15%] text-3xl opacity-20 animate-float pointer-events-none" style="animation-delay: 1s;">💖</div>
    <div class="absolute bottom-[20%] right-[20%] text-3xl opacity-20 animate-float pointer-events-none" style="animation-delay: 2s;">🌸</div>

    <!-- 导航栏 -->
    <nav class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-md">
              💕
            </div>
            <h1 class="text-2xl font-bold text-gradient">UkiUki</h1>
          </div>
          <div class="flex items-center space-x-3">
            <template v-if="!userStore.token">
              <RouterLink to="/login" class="btn btn-secondary px-5">登录</RouterLink>
              <RouterLink to="/register" class="btn btn-primary px-5">注册</RouterLink>
            </template>
            <template v-else>
              <RouterLink to="/matches" class="btn btn-secondary px-5">匹配</RouterLink>
              <RouterLink to="/profile" class="btn btn-secondary px-5">资料</RouterLink>
              <button @click="handleLogout" class="btn btn-primary px-5">退出</button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="flex-1 flex items-center justify-center px-4 relative z-10">
      <div class="text-center max-w-2xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-pink-500 mb-6 shadow-sm border border-pink-100">
          <span>✨</span>
          <span>找到属于你的缘分</span>
          <span>✨</span>
        </div>

        <h2 class="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          遇见你的<br>
          <span class="text-gradient">心动瞬间</span>
        </h2>

        <p class="text-lg text-gray-500 mb-10 leading-relaxed">
          UkiUki 是一个温暖的交友社区，在这里发现志同道合的伙伴，<br>
          开启属于你的浪漫故事 🌸
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/register" class="btn btn-primary px-8 py-4 text-lg inline-flex items-center justify-center gap-2">
            开始使用
            <span>💕</span>
          </RouterLink>
          <RouterLink to="/login" class="btn btn-secondary px-8 py-4 text-lg inline-flex items-center justify-center gap-2">
            已有账号？登录
            <span>✨</span>
          </RouterLink>
        </div>

        <div class="mt-16 flex justify-center gap-8 text-gray-400">
          <div class="flex flex-col items-center gap-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">💖</div>
            <span class="text-xs">真心</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🔒</div>
            <span class="text-xs">安全</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🌸</div>
            <span class="text-xs">温暖</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="relative z-10 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-400 text-sm">&copy; 2024 UkiUki. 用心连接每一份缘分 💕</p>
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

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
}
</style>
