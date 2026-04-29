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
        <!-- 三栏布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- 左栏 — 推荐用户 (3列) -->
          <div class="lg:col-span-3">
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800">推荐给你</h3>
                <select class="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-gray-500 outline-none">
                  <option>全部</option>
                  <option>同城</option>
                  <option>最新</option>
                </select>
              </div>

              <div class="space-y-4">
                <div
                  v-for="user in recommendedUsers"
                  :key="user.id"
                  class="flex items-center gap-3 p-3 rounded-2xl hover:bg-pink-50/50 transition-colors group"
                >
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {{ user.nickname.charAt(0) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1">
                      <span class="font-semibold text-sm text-gray-800 truncate">{{ user.nickname }}</span>
                      <span class="text-xs text-gray-400">{{ user.age }}岁</span>
                    </div>
                    <div class="text-xs text-gray-400 mb-1">{{ user.city }}</div>
                    <div class="progress-bar w-full">
                      <div class="progress-bar-fill" :style="{ width: user.matchScore + '%' }"></div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <button class="w-7 h-7 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors text-xs">
                      💕
                    </button>
                    <button class="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-300 transition-colors text-xs">
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <RouterLink to="/matches" class="flex items-center justify-center gap-1 mt-4 text-sm text-pink-400 hover:text-pink-500 font-medium">
                查看全部推荐
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </RouterLink>
            </div>
          </div>

          <!-- 中栏 — 匹配概览 (6列) -->
          <div class="lg:col-span-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-800">匹配概览</h3>
              <div class="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
                <button
                  v-for="view in views"
                  :key="view.key"
                  @click="activeView = view.key"
                  :class="[
                    'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
                    activeView === view.key ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-sm' : 'text-gray-500 hover:text-pink-400'
                  ]"
                >
                  {{ view.label }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="match in matchOverview"
                :key="match.id"
                class="card card-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 via-pink-400 to-purple-400 flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-white">
                    {{ match.nickname.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-800">{{ match.nickname }}</h4>
                    <p class="text-xs text-gray-500">{{ match.gender === 1 ? '男' : '女' }} · {{ match.age }}岁 · {{ match.city }}</p>
                  </div>
                </div>

                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ match.bio }}</p>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-for="tag in match.tags.slice(0, 3)" :key="tag" class="tag tag-pink text-xs">
                    {{ tag }}
                  </span>
                </div>

                <!-- 匹配度环形进度 -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="relative w-12 h-12">
                      <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path class="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" />
                        <path class="text-pink-400" :stroke-dasharray="match.matchScore + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                      </svg>
                      <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-pink-500">{{ match.matchScore }}%</span>
                    </div>
                    <span class="text-xs text-gray-500">匹配度</span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <RouterLink :to="`/profile?id=${match.id}`" class="btn btn-secondary flex-1 py-2 text-xs text-center">
                    查看详情
                  </RouterLink>
                  <RouterLink :to="`/chat/${match.id}`" class="btn btn-primary flex-1 py-2 text-xs text-center">
                    开始聊天
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- 右栏 — 数据统计 (3列) -->
          <div class="lg:col-span-3 space-y-6">
            <!-- 统计数字卡片 -->
            <div class="grid grid-cols-2 gap-3">
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">128</div>
                <div class="text-xs text-gray-500 mt-1">总推荐</div>
              </div>
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">24</div>
                <div class="text-xs text-gray-500 mt-1">已匹配</div>
              </div>
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">8</div>
                <div class="text-xs text-gray-500 mt-1">待处理</div>
              </div>
              <div class="card-sm text-center">
                <div class="text-2xl font-bold text-gradient">15</div>
                <div class="text-xs text-gray-500 mt-1">新消息</div>
              </div>
            </div>

            <!-- 匹配趋势折线图 -->
            <div class="card">
              <h4 class="text-sm font-bold text-gray-800 mb-4">匹配趋势</h4>
              <div class="h-32 relative">
                <svg class="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <!-- 网格线 -->
                  <line x1="0" y1="25" x2="200" y2="25" stroke="#F3F4F6" stroke-width="1" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#F3F4F6" stroke-width="1" />
                  <line x1="0" y1="75" x2="200" y2="75" stroke="#F3F4F6" stroke-width="1" />
                  <!-- 折线 -->
                  <polyline
                    points="0,70 40,55 80,60 120,35 160,25 200,20"
                    fill="none"
                    stroke="url(#lineGradient)"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- 填充区域 -->
                  <polygon
                    points="0,70 40,55 80,60 120,35 160,25 200,20 200,100 0,100"
                    fill="url(#areaGradient)"
                    opacity="0.3"
                  />
                  <!-- 数据点 -->
                  <circle cx="0" cy="70" r="3" fill="#FF8FAB" />
                  <circle cx="40" cy="55" r="3" fill="#FF8FAB" />
                  <circle cx="80" cy="60" r="3" fill="#FF8FAB" />
                  <circle cx="120" cy="35" r="3" fill="#FF8FAB" />
                  <circle cx="160" cy="25" r="3" fill="#FF8FAB" />
                  <circle cx="200" cy="20" r="3" fill="#FF8FAB" />
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#FFB6C1" />
                      <stop offset="100%" stop-color="#FF69B4" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#FF8FAB" stop-opacity="0.5" />
                      <stop offset="100%" stop-color="#FF8FAB" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>周一</span>
                <span>周三</span>
                <span>周五</span>
                <span>周日</span>
              </div>
            </div>

            <!-- 用户分布环形图 -->
            <div class="card">
              <h4 class="text-sm font-bold text-gray-800 mb-4">用户分布</h4>
              <div class="flex items-center justify-center">
                <div class="relative w-32 h-32">
                  <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path class="text-pink-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" />
                    <path class="text-pink-400" stroke-dasharray="55, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
                    <path class="text-purple-300" stroke-dasharray="30, 100" stroke-dashoffset="-55" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center flex-col">
                    <span class="text-lg font-bold text-gray-800">1.2k</span>
                    <span class="text-xs text-gray-400">用户</span>
                  </div>
                </div>
              </div>
              <div class="flex justify-center gap-4 mt-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
                  <span class="text-xs text-gray-500">女性 55%</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-300"></span>
                  <span class="text-xs text-gray-500">男性 30%</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-pink-200"></span>
                  <span class="text-xs text-gray-500">其他 15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const views = [
  { key: 'card', label: '卡片视图' },
  { key: 'list', label: '列表视图' }
]
const activeView = ref('card')

const recommendedUsers = ref([
  { id: 1, nickname: '小雨', age: 24, city: '北京', matchScore: 92 },
  { id: 2, nickname: '橙子', age: 26, city: '上海', matchScore: 88 },
  { id: 3, nickname: '米粒', age: 23, city: '广州', matchScore: 85 },
  { id: 4, nickname: '晴天', age: 25, city: '深圳', matchScore: 80 },
  { id: 5, nickname: '星星', age: 27, city: '成都', matchScore: 78 }
])

const matchOverview = ref([
  {
    id: 101,
    nickname: '小鹿',
    gender: 2,
    age: 24,
    city: '杭州',
    bio: '喜欢旅行和摄影，希望能找到志同道合的伴侣一起探索世界的美好。',
    tags: ['旅行', '摄影', '美食'],
    matchScore: 96
  },
  {
    id: 102,
    nickname: '阿杰',
    gender: 1,
    age: 28,
    city: '北京',
    bio: '程序员一枚，热爱生活，喜欢健身和阅读。',
    tags: ['健身', '阅读', '编程'],
    matchScore: 89
  },
  {
    id: 103,
    nickname: '婉儿',
    gender: 2,
    age: 25,
    city: '上海',
    bio: '音乐老师，喜欢弹吉他和唱歌，希望找到懂音乐的你。',
    tags: ['音乐', '吉他', '唱歌'],
    matchScore: 85
  },
  {
    id: 104,
    nickname: '大明',
    gender: 1,
    age: 27,
    city: '深圳',
    bio: '创业中，喜欢户外运动，周末经常爬山或骑行。',
    tags: ['户外', '骑行', '创业'],
    matchScore: 82
  }
])
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
