<template>
  <div class="relative w-full max-w-md mx-auto h-[520px] select-none">
    <!-- 卡片堆叠 -->
    <div
      v-for="(user, index) in visibleUsers"
      :key="user.id"
      class="absolute inset-0 w-full h-full"
      :style="getCardStyle(index)"
      @mousedown="startDrag($event, index)"
      @touchstart="startDrag($event, index)"
    >
      <div
        class="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100"
        :style="index === 0 ? dragStyle : {}"
      >
        <!-- 头像区 -->
        <div class="relative h-[65%] bg-gradient-to-br from-pink-200 to-purple-200">
          <div
            v-if="user.avatar_url"
            class="w-full h-full"
          >
            <img :src="user.avatar_url" class="w-full h-full object-cover" alt="avatar" />
          </div>
          <div v-else class="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
            {{ user.nickname?.charAt(0) || '?' }}
          </div>

          <!-- Like/Nope 水印 -->
          <div
            v-if="index === 0 && dragOffset.x !== 0"
            class="absolute top-8 border-4 font-black text-5xl tracking-widest uppercase px-4 py-2 rounded-xl transform -rotate-12 transition-opacity duration-150"
            :class="dragOffset.x > 0 ? 'right-8 border-green-400 text-green-400' : 'left-8 border-red-400 text-red-400'"
            :style="{ opacity: Math.min(Math.abs(dragOffset.x) / 150, 1) }"
          >
            {{ dragOffset.x > 0 ? 'LIKE' : 'NOPE' }}
          </div>
        </div>

        <!-- 信息区 -->
        <div class="p-5 h-[35%] flex flex-col">
          <div class="flex items-baseline gap-2 mb-2">
            <h3 class="text-2xl font-bold text-gray-800">{{ user.nickname }}</h3>
            <span class="text-lg text-gray-500">{{ user.age }}岁</span>
            <span class="text-sm px-2 py-0.5 rounded-full bg-pink-100 text-pink-500">{{ user.gender === 1 ? '男' : '女' }}</span>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">{{ user.bio || '这个人很懒，什么都没写~' }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in (user.tags || []).slice(0, 4)" :key="tag" class="tag tag-pink text-xs">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="users.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
      <div class="text-6xl mb-4">🎉</div>
      <p class="text-lg font-medium">今日推荐已看完</p>
      <p class="text-sm mt-1">明天再来吧~</p>
    </div>

    <!-- 按钮区 -->
    <div v-if="users.length > 0" class="absolute -bottom-20 left-0 right-0 flex items-center justify-center gap-6">
      <button
        @click="swipe('left')"
        class="w-14 h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-2xl text-red-400 hover:scale-110 hover:bg-red-50 transition-all"
      >
        ✕
      </button>
      <button
        @click="swipe('right')"
        class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 shadow-lg shadow-pink-200 flex items-center justify-center text-2xl text-white hover:scale-110 transition-all"
      >
        💕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  users: { type: Array, default: () => [] }
})
const emit = defineEmits(['like', 'dislike'])

const visibleUsers = computed(() => props.users.slice(0, 3))

const dragOffset = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })

const getCardStyle = (index) => {
  if (index === 0) return { zIndex: 30 }
  if (index === 1) return { zIndex: 20, transform: 'scale(0.95) translateY(10px)', opacity: 0.7 }
  if (index === 2) return { zIndex: 10, transform: 'scale(0.9) translateY(20px)', opacity: 0.4 }
  return { zIndex: 0, opacity: 0 }
}

const dragStyle = computed(() => {
  if (!isDragging.value && dragOffset.value.x === 0) return {}
  const rotate = dragOffset.value.x * 0.05
  return {
    transform: `translateX(${dragOffset.value.x}px) translateY(${dragOffset.value.y}px) rotate(${rotate}deg)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s ease-out'
  }
})

const startDrag = (e, index) => {
  if (index !== 0) return
  isDragging.value = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  startPos.value = { x: clientX, y: clientY }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', endDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  dragOffset.value = {
    x: clientX - startPos.value.x,
    y: clientY - startPos.value.y
  }
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', endDrag)

  if (Math.abs(dragOffset.value.x) > 100) {
    const direction = dragOffset.value.x > 0 ? 'right' : 'left'
    finishSwipe(direction)
  } else {
    dragOffset.value = { x: 0, y: 0 }
  }
}

const swipe = (direction) => {
  dragOffset.value = { x: direction === 'right' ? 300 : -300, y: 0 }
  setTimeout(() => finishSwipe(direction), 200)
}

const finishSwipe = (direction) => {
  const user = props.users[0]
  if (!user) return
  dragOffset.value = { x: 0, y: 0 }
  if (direction === 'right') {
    emit('like', user)
  } else {
    emit('dislike', user)
  }
}
</script>
