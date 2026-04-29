<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
    <!-- 关闭按钮 -->
    <button @click="$emit('close')" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition">
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- 容器 -->
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- 头部 -->
      <div class="p-6 bg-gradient-to-r from-pink-500 to-red-500">
        <h2 class="text-2xl font-bold text-white text-center">💕 滑卡</h2>
        <p class="text-pink-100 text-center mt-1">左滑喜欢，右滑跳过</p>
      </div>

      <!-- 卡片堆栈 -->
      <div class="relative h-[600px] bg-gray-50">
        <!-- 所有卡片（绝对定位实现堆栈效果） -->
        <transition-group name="card">
          <div
            v-for="(card, index) in cardStack"
            :key="card.id"
            class="absolute inset-0 flex items-center justify-center"
            :style="{ 
              transform: `translateY(-${index * 10}px) scale(${1 - index * 0.05})`,
              opacity: 1 - index * 0.1,
              zIndex: 100 - index
            }"
          >
            <!-- 卡片内容 -->
            <div 
              class="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
              @touchstart="handleTouchStart($event, index)"
              @mousedown="handleMouseDown($event, index)"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
              @mouseup="handleMouseUp"
            >
              <!-- 用户头像 -->
              <div class="relative h-64 bg-gradient-to-br from-pink-400 to-red-500">
                <img 
                  :src="card.avatar_url" 
                  :alt="card.nickname"
                  class="w-full h-full object-cover"
                />
                
                <!-- 年龄和性别 -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div class="flex items-center justify-between text-white">
                    <div class="flex items-center space-x-2">
                      <span class="text-lg">{{ card.nickname }}, {{ calculateAge(card.birthday) }}</span>
                      <span class="text-sm bg-white/20 px-2 py-1 rounded-full">
                        {{ card.gender === 1 ? '男' : '女' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 用户信息 -->
              <div class="p-4">
                <!-- 个人简介 -->
                <div v-if="card.profile?.self_intro" class="mb-3">
                  <p class="text-gray-700 text-sm leading-relaxed">
                    {{ card.profile.self_intro }}
                  </p>
                </div>

                <!-- 兴趣标签 -->
                <div v-if="card.profile?.tags?.length" class="mb-3">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="tag in card.profile.tags" 
                      :key="tag"
                      class="text-xs bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 px-2 py-1 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 职天按钮 -->
                <button
                  @click="handleChat(card)"
                  class="w-full mt-2 bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-red-600 transition"
                >
                  💬 开始聊天
                </button>
              </div>
            </div>

            <!-- 左右操作提示 -->
            <div class="absolute inset-0 flex items-center justify-between pointer-events-none">
              <!-- 左滑提示（喜欢） -->
              <div 
                v-if="index === 0"
                class="absolute left-4 w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center animate-bounce opacity-50"
              >
                👍
              </div>

              <!-- 右滑提示（跳过） -->
              <div 
                v-if="index === 0"
                class="absolute right-4 w-16 h-16 rounded-full bg-gray-500 text-white flex items-center justify-center animate-bounce opacity-50"
              >
                👎
              </div>
            </div>
          </div>
        </transition-group>

        <!-- 空状态 -->
        <div v-if="cardStack.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="text-6xl mb-4">🎉</div>
            <div class="text-gray-500 text-lg">暂时没有更多卡片了</div>
            <button 
              @click="$emit('refresh')"
              class="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition"
            >
              🔄 刷新卡片
            </button>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="p-4 bg-gray-50 flex justify-center space-x-4">
        <button 
          @click="handleBatchLike"
          :disabled="swiping"
          class="px-6 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ❤️ 批量喜欢
        </button>
        <button 
          @click="handleBatchPass"
          :disabled="swiping"
          class="px-6 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💔 批量跳过
        </button>
        <button 
          @click="handleRefresh"
          :disabled="loading"
          class="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition disabled:opacity-50"
        >
          🔄 刷新
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/index'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close', 'refresh'])

const cardStack = ref([])
const loading = ref(false)
const swiping = ref(false)

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)
const currentCardIndex = ref(0)

// 鼠标相关
const isDragging = ref(false)
const dragStartX = ref(0)

// 加载卡片
const loadCards = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/v1/swipe/matches')
    cardStack.value = response.matches || []
    currentCardIndex.value = 0
  } catch (error) {
    console.error('Failed to load cards:', error)
  } finally {
    loading.value = false
  }
}

// 计算年龄
const calculateAge = (birthday) => {
  if (!birthday) return '?'
  
  const today = new Date()
  const birthDate = new Date(birthday)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// 触摸开始
const handleTouchStart = (event, index) => {
  if (index !== 0) return
  
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  swiping.value = true
}

// 触摸移动
const handleTouchMove = (event) => {
  if (!swiping.value) return
  
  const touchX = event.touches[0].clientX
  const deltaX = touchX - touchStartX.value
  
  // 卡片跟随手指移动
  if (Math.abs(deltaX) > 10) {
    const rotation = deltaX * 0.1
    const card = document.querySelectorAll('.card')[currentCardIndex.value]
    if (card) {
      card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`
    }
  }
}

// 触摸结束
const handleTouchEnd = async (event) => {
  if (!swiping.value) return
  
  swiping.value = false
  
  const touchX = event.changedTouches[0].clientX
  const deltaX = touchX - touchStartX.value
  
  // 左滑：喜欢
  if (deltaX < -100) {
    await handleLike()
  }
  // 右滑：跳过
  else if (deltaX > 100) {
    await handlePass()
  }
  // 恢复卡片位置
  else {
    const card = document.querySelectorAll('.card')[currentCardIndex.value]
    if (card) {
      card.style.transform = 'translateX(0) rotate(0deg)'
    }
  }
}

// 鼠标按下
const handleMouseDown = (event, index) => {
  if (index !== 0) return
  
  isDragging.value = true
  dragStartX.value = event.clientX
  swiping.value = true
}

// 鼠标移动
const handleMouseMove = (event) => {
  if (!isDragging.value) return
  
  const deltaX = event.clientX - dragStartX.value
  
  // 卡片跟随鼠标移动
  if (Math.abs(deltaX) > 10) {
    const rotation = deltaX * 0.05
    const card = document.querySelectorAll('.card')[currentCardIndex.value]
    if (card) {
      card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`
    }
  }
}

// 鼠标抬起
const handleMouseUp = async () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  swiping.value = false
  
  // 根据最终位置判断操作
  // 这里简化处理，实际需要更复杂的逻辑
}

// 喜欢
const handleLike = async () => {
  if (cardStack.value.length === 0) return
  
  const currentCard = cardStack.value[0]
  
  try {
    await api.post('/api/v1/swipe/batch-like', { match_ids: [currentCard.id] })
    
    // 移除顶部卡片
    cardStack.value.shift()
  } catch (error) {
    console.error('Failed to like:', error)
  }
}

// 跳过
const handlePass = async () => {
  if (cardStack.value.length === 0) return
  
  const currentCard = cardStack.value[0]
  
  try {
    await api.post('/api/v1/swipe/batch-unlike', { match_ids: [currentCard.id] })
    
    // 移除顶部卡片
    cardStack.value.shift()
  } catch (error) {
    console.error('Failed to pass:', error)
  }
}

// 批量喜欢
const handleBatchLike = async () => {
  if (cardStack.value.length === 0) return
  
  const allIds = cardStack.value.map(card => card.id)
  
  try {
    await api.post('/api/v1/swipe/batch-like', { match_ids: allIds })
    
    // 清空所有卡片
    cardStack.value = []
  } catch (error) {
    console.error('Failed to batch like:', error)
  }
}

// 批量跳过
const handleBatchPass = async () => {
  if (cardStack.value.length === 0) return
  
  const allIds = cardStack.value.map(card => card.id)
  
  try {
    await api.post('/api/v1/swipe/batch-unlike', { match_ids: allIds })
    
    // 清空所有卡片
    cardStack.value = []
  } catch (error) {
    console.error('Failed to batch pass:', error)
  }
}

// 聊天
const handleChat = (card) => {
  emit('close')
  
  // 导航到聊天页面
  router.push({ name: 'Chat', query: { user_id: card.id } })
}

// 刷新
const handleRefresh = () => {
  loadCards()
}

// 组件挂载
onMounted(() => {
  loadCards()
})
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
