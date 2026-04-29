<template>
  <div class="min-h-screen px-4 py-8">
    <Navbar />
    
    <div class="max-w-4xl mx-auto">
      <!-- 标题栏 -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold gradient-text">💕 发现</h2>
          <p class="text-gray-500 text-lg">发现附近的人</p>
        </div>
        
        <!-- 筛选按钮 -->
        <button
          @click="showFilters = !showFilters"
          class="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h4a1 1 0 011-1v4a1 1 0 011-1H3a1 1 0 01-1v-4z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4v6m0-6l6 6"></path>
          </svg>
          <span>筛选</span>
        </button>
      </div>

      <!-- 筛选器 -->
      <div v-if="showFilters" class="mb-6 bg-white rounded-lg shadow-lg p-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">筛选条件</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">性别</label>
            <select v-model="filters.gender" class="input">
              <option value="">全部</option>
              <option value="1">男</option>
              <option value="2">女</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">年龄范围</label>
            <div class="flex space-x-2">
              <input v-model="filters.min_age" type="number" placeholder="最小年龄" class="input flex-1" />
              <input v-model="filters.max_age" type="number" placeholder="最大年龄" class="input flex-1" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">距离</label>
            <select v-model="filters.distance" class="input">
              <option value="">不限</option>
              <option value="5">5公里内</option>
              <option value="10">10公里内</option>
              <option value="20">20公里内</option>
              <option value="50">50公里内</option>
            </select>
          </div>
        </div>
        
        <div class="flex space-x-4 mt-4">
          <button @click="applyFilters" class="btn btn-primary flex-1">应用筛选</button>
          <button @click="resetFilters" class="btn btn-secondary flex-1">重置</button>
        </div>
      </div>

      <!-- 滑卡组件 -->
      <CardSwipe 
        v-if="!showFilters"
        @close="handleCardClose"
        @refresh="handleCardRefresh"
      />

      <!-- 空状态 -->
      <div v-if="!showFilters && cardCount === 0" class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">暂时没有匹配</h3>
        <p class="text-gray-500 text-lg mb-6">试试调整筛选条件或稍后再来</p>
        <button @click="handleCardRefresh" class="btn btn-primary">
          🔄 刷新
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import CardSwipe from '@/components/CardSwipe.vue'

const showFilters = ref(false)
const cardCount = ref(0)

const filters = ref({
  gender: '',
  min_age: '',
  max_age: '',
  distance: ''
})

const applyFilters = () => {
  console.log('Applying filters:', filters.value)
  // TODO: 调用筛选 API
  showFilters.value = false
}

const resetFilters = () => {
  filters.value = {
    gender: '',
    min_age: '',
    max_age: '',
    distance: ''
  }
  console.log('Filters reset')
  // TODO: 重新加载所有用户
}

const handleCardClose = () => {
  console.log('CardSwipe closed')
}

const handleCardRefresh = () => {
  console.log('Refreshing cards')
  // TODO: 重新加载卡片
}

onMounted(() => {
  // TODO: 加载卡片数量
})
</script>
