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

          <!-- 左栏 — 推荐给你 -->
          <div class="lg:col-span-3 space-y-6">
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800">推荐给你</h3>
                <select v-model="recommendFilter" class="text-xs bg-pink-50 text-pink-500 border border-pink-100 rounded-lg px-2 py-1 outline-none cursor-pointer">
                  <option value="all">全部</option>
                  <option value="nearby">附近</option>
                  <option value="new">最新</option>
                </select>
              </div>

              <div v-if="loadingRecommend" class="text-center text-gray-400 py-8">加载中...</div>
              <div v-else-if="recommendedUsers.length === 0" class="text-center text-gray-400 py-8">暂无推荐</div>
              <div v-else class="space-y-3">
                <div
                  v-for="user in recommendedUsers.slice(0, 6)"
                  :key="user.id"
                  class="flex flex-col gap-2 p-3 rounded-2xl hover:bg-pink-50/50 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {{ user.nickname?.charAt(0) || '?' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1">
                        <span class="font-semibold text-sm text-gray-800 truncate">{{ user.nickname }}</span>
                        <span class="text-xs text-gray-400">{{ user.age }}岁</span>
                      </div>
                      <div class="text-xs text-gray-400 truncate">{{ user.city || '未知城市' }}</div>
                    </div>
                  </div>
                  <!-- 匹配度进度条 -->
                  <div class="flex items-center gap-2">
                    <div class="flex-1 progress-bar h-1.5">
                      <div class="progress-bar-fill" :style="{ width: (user.matchScore || Math.floor(Math.random() * 40 + 60)) + '%' }"></div>
                    </div>
                    <span class="text-[10px] text-pink-500 font-medium">{{ user.matchScore || Math.floor(Math.random() * 40 + 60) }}%</span>
                  </div>
                  <!-- 操作按钮 -->
                  <div class="flex items-center gap-2 mt-1">
                    <button @click="handleLike(user)" class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-pink-50 text-pink-500 text-xs font-medium hover:bg-pink-100 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      心动
                    </button>
                    <button @click="handlePass(user)" class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-gray-50 text-gray-400 text-xs font-medium hover:bg-gray-100 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      不感兴趣
                    </button>
                  </div>
                </div>
              </div>

              <div class="mt-4 text-center">
                <RouterLink to="/discover" class="text-xs text-pink-500 hover:text-pink-600 font-medium inline-flex items-center gap-1 transition-colors">
                  查看全部推荐
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- 中栏 — 匹配概览 -->
          <div class="lg:col-span-6 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-800">匹配概览</h3>
              <div class="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-0.5">
                <button
                  @click="matchView = 'grid'"
                  :class="matchView === 'grid' ? 'bg-pink-50 text-pink-500' : 'text-gray-400 hover:text-gray-600'"
                  class="px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                  网格
                </button>
                <button
                  @click="matchView = 'list'"
                  :class="matchView === 'list' ? 'bg-pink-50 text-pink-500' : 'text-gray-400 hover:text-gray-600'"
                  class="px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                  列表
                </button>
              </div>
            </div>

            <div v-if="loadingMatches" class="card text-center text-gray-400 py-16">加载中...</div>
            <div v-else-if="matches.length === 0" class="card text-center text-gray-400 py-16">暂无匹配数据</div>
            <div v-else :class="matchView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'">
              <div
                v-for="match in matches"
                :key="match.id"
                class="card p-5 flex flex-col"
              >
                <div class="flex items-start gap-4">
                  <div class="relative flex-shrink-0">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                      {{ match.nickname?.charAt(0) || match.user?.nickname?.charAt(0) || '?' }}
                    </div>
                    <!-- 环形进度 -->
                    <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-sm border border-pink-100 flex items-center justify-center">
                      <span class="text-[9px] font-bold text-pink-500">{{ match.matchScore || Math.floor(Math.random() * 30 + 70) }}%</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-gray-800">{{ match.nickname || match.user?.nickname || '未知' }}</span>
                      <span class="text-xs text-gray-400">{{ match.age || match.user?.age || '-' }}岁</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ match.bio || match.user?.bio || '这个人很懒，还没有写简介~' }}</p>
                    <div class="flex flex-wrap gap-1.5 mt-2">
                      <span v-for="(tag, idx) in (match.tags || match.user?.tags || []).slice(0, 3)" :key="idx" class="tag" :class="['tag-pink','tag-purple','tag-blue','tag-yellow','tag-green'][idx % 5]">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                  <button class="flex-1 py-2 rounded-xl border border-gray-100 text-gray-500 text-xs font-medium hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200 transition-colors">
                    查看详情
                  </button>
                  <RouterLink to="/chat" class="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-300 to-pink-400 text-white text-xs font-medium text-center shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
                    开始聊天
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- 右栏 — 数据统计 -->
          <div class="lg:col-span-3 space-y-6">
            <!-- 统计数字卡片 -->
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
                <div class="text-2xl font-bold text-gradient">{{ stats.pending }}</div>
                <div class="text-xs text-gray-500 mt-1">待处理</div>
              </div>
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">{{ stats.messages }}</div>
                <div class="text-xs text-gray-500 mt-1">新消息</div>
              </div>
            </div>

            <!-- 匹配趋势折线图 -->
            <div class="card">
              <h4 class="text-sm font-bold text-gray-800 mb-4">匹配趋势</h4>
              <div class="flex items-end justify-between h-32 gap-1.5">
                <div
                  v-for="(val, idx) in trendData"
                  :key="idx"
                  class="flex-1 rounded-t-lg relative group"
                  :style="{ height: val + '%', background: 'linear-gradient(to top, #FFE4EC, #FF8FAB)' }"
                >
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {{ val }}
                  </div>
                </div>
              </div>
              <div class="flex justify-between mt-2 text-[10px] text-gray-400">
                <span>周一</span>
                <span>周二</span>
                <span>周三</span>
                <span>周四</span>
                <span>周五</span>
                <span>周六</span>
                <span>周日</span>
              </div>
            </div>

            <!-- 用户分布环形图 -->
            <div class="card">
              <h4 class="text-sm font-bold text-gray-800 mb-4">用户分布</h4>
              <div class="flex items-center justify-center">
                <div class="relative w-32 h-32 rounded-full" style="background: conic-gradient(#FF8FAB 0% 45%, #D4BBFC 45% 75%, #FFE4EC 75% 100%);">
                  <div class="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                    <span class="text-lg font-bold text-gradient">1,204</span>
                    <span class="text-[10px] text-gray-400">总用户</span>
                  </div>
                </div>
              </div>
              <div class="flex justify-center gap-4 mt-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
                  <span class="text-[10px] text-gray-500">女性 45%</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-300"></span>
                  <span class="text-[10px] text-gray-500">男性 30%</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-pink-100"></span>
                  <span class="text-[10px] text-gray-500">其他 25%</span>
                </div>
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
import { userAPI, matchAPI } from '@/api'
import MatchModal from '@/components/MatchModal.vue'

const userStore = useUserStore()

const recommendedUsers = ref([])
const matches = ref([])
const loadingRecommend = ref(false)
const loadingMatches = ref(false)
const showMatchModal = ref(false)
const matchedUser = ref(null)
const recommendFilter = ref('all')
const matchView = ref('grid')

const stats = ref({ total: 0, matched: 0, pending: 0, messages: 0 })
const trendData = ref([35, 52, 48, 65, 58, 78, 85])

const loadRecommendedUsers = async () => {
  loadingRecommend.value = true
  try {
    const res = await userAPI.discover()
    recommendedUsers.value = res.users || res.data || []
    stats.value.total = recommendedUsers.value.length
  } catch (err) {
    console.error('加载推荐失败:', err)
    recommendedUsers.value = []
  } finally {
    loadingRecommend.value = false
  }
}

const loadMatches = async () => {
  loadingMatches.value = true
  try {
    const res = await matchAPI.getMatches()
    matches.value = res.matches || res.data || []
    stats.value.matched = matches.value.length
    stats.value.pending = Math.max(0, stats.value.total - stats.value.matched)
    stats.value.messages = Math.floor(Math.random() * 10)
  } catch (err) {
    console.error('加载匹配失败:', err)
    matches.value = []
  } finally {
    loadingMatches.value = false
  }
}

const handleLike = async (user) => {
  try {
    const res = await matchAPI.likeUser(user.id)
    if (res.matched) {
      matchedUser.value = user
      showMatchModal.value = true
      stats.value.matched++
    }
    // Remove from recommended list
    recommendedUsers.value = recommendedUsers.value.filter(u => u.id !== user.id)
    stats.value.total = recommendedUsers.value.length
  } catch (err) {
    console.error('like 失败:', err)
  }
}

const handlePass = (user) => {
  recommendedUsers.value = recommendedUsers.value.filter(u => u.id !== user.id)
  stats.value.total = recommendedUsers.value.length
}

onMounted(() => {
  loadRecommendedUsers()
  loadMatches()
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
