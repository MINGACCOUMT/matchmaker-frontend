<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-[-10%] right-[-5%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-[40%] left-[10%] text-4xl opacity-20 animate-float pointer-events-none">✨</div>
    <div class="absolute top-[20%] right-[15%] text-3xl opacity-20 animate-float pointer-events-none" style="animation-delay: 1s;">💖</div>
    <div class="absolute bottom-[20%] right-[20%] text-3xl opacity-20 animate-float pointer-events-none" style="animation-delay: 2s;">🌸</div>

    <!-- 顶部导航 -->
    <nav class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-md">
              💕
            </div>
            <h1 class="text-2xl font-bold text-gradient">UkiUki</h1>
          </div>

          <!-- 搜索框 -->
          <div class="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div class="relative w-full">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                type="text"
                placeholder="搜索感兴趣的人..."
                class="input pl-12 py-2.5 text-sm"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- 通知铃铛 -->
            <button class="relative w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-100 hover:bg-pink-50 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white"></span>
            </button>

            <!-- 用户头像 -->
            <RouterLink to="/profile" class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition-transform">
              {{ userStore.user?.nickname?.charAt(0) || 'U' }}
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="flex-1 px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- 左栏 — 推荐用户 -->
          <div class="lg:col-span-3">
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800">推荐给你</h3>
              </div>
              <div v-if="loading" class="text-center text-gray-400 py-8">加载中...</div>
              <div v-else class="space-y-4">
                <div
                  v-for="user in recommendedUsers.slice(0, 5)"
                  :key="user.id"
                  class="flex items-center gap-3 p-3 rounded-2xl hover:bg-pink-50/50 transition-colors"
                >
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {{ user.nickname?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1">
                      <span class="font-semibold text-sm text-gray-800 truncate">{{ user.nickname }}</span>
                      <span class="text-xs text-gray-400">{{ user.age }}岁</span>
                    </div>
                    <div class="text-xs text-gray-400">{{ user.gender === 1 ? '男' : '女' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 中栏 — 滑动卡片 -->
          <div class="lg:col-span-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-800">发现</h3>
              <span class="text-xs text-gray-400">剩余 {{ users.length }} 人</span>
            </div>
            <SwipeCard
              :users="users"
              @like="handleLike"
              @dislike="handleDislike"
            />
          </div>

          <!-- 右栏 — 统计 -->
          <div class="lg:col-span-3 space-y-6">
            <div class="grid grid-cols-2 gap-3">
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">{{ stats.total }}</div>
                <div class="text-xs text-gray-500 mt-1">总推荐</div>
              </div>
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">{{ stats.matched }}</div>
                <div class="text-xs text-gray-500 mt-1">已匹配</div>
              </div>
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">{{ stats.liked }}</div>
                <div class="text-xs text-gray-500 mt-1">喜欢</div>
              </div>
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">{{ stats.messages }}</div>
                <div class="text-xs text-gray-500 mt-1">消息</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 匹配成功弹窗 -->
    <MatchModal
      :show="showMatchModal"
      :me="userStore.user"
      :match-user="matchedUser"
      @close="showMatchModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { matchAPI } from '@/api'
import SwipeCard from '@/components/SwipeCard.vue'
import MatchModal from '@/components/MatchModal.vue'

const userStore = useUserStore()

const users = ref([])
const recommendedUsers = ref([])
const loading = ref(false)
const showMatchModal = ref(false)
const matchedUser = ref(null)
const stats = ref({ total: 0, matched: 0, liked: 0, messages: 0 })

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await matchAPI.discoverUsers()
    users.value = res.users || []
    recommendedUsers.value = res.users || []
    stats.value.total = users.value.length
  } catch (err) {
    console.error('加载失败:', err)
  } finally {
    loading.value = false
  }
}

const handleLike = async (user) => {
  users.value.shift()
  stats.value.liked++
  try {
    const res = await matchAPI.likeUser(user.id)
    if (res.matched) {
      matchedUser.value = user
      showMatchModal.value = true
      stats.value.matched++
    }
  } catch (err) {
    console.error('like 失败:', err)
  }
}

const handleDislike = (user) => {
  users.value.shift()
}

onMounted(() => {
  loadUsers()
})
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
