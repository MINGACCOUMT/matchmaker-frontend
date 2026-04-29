<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- 飘浮装饰 -->
    <div class="floating-decorations absolute inset-0 pointer-events-none overflow-hidden">
      <div class="star" style="top: 8%; left: 12%; animation-delay: 0s;">✨</div>
      <div class="heart" style="top: 18%; right: 12%; animation-delay: 1s;">💕</div>
      <div class="star" style="top: 35%; left: 6%; animation-delay: 2s;">⭐</div>
      <div class="heart" style="top: 55%; right: 8%; animation-delay: 0.5s;">💖</div>
      <div class="star" style="top: 72%; left: 18%; animation-delay: 1.5s;">✨</div>
      <div class="heart" style="top: 12%; left: 30%; animation-delay: 2.5s;">💗</div>
      <div class="star" style="top: 85%; right: 20%; animation-delay: 3s;">🌟</div>
    </div>

    <!-- 背景装饰圆 -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full relative z-10">
      <!-- 顶部区域 -->
      <div class="text-center mb-10">
        <div class="relative inline-block mb-6">
          <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-300 to-green-400 flex items-center justify-center shadow-lg relative z-10">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 text-2xl animate-bounce-slow">✨</div>
          <div class="absolute -bottom-1 -left-2 text-xl animate-bounce-slow" style="animation-delay: 0.5s;">🌸</div>
        </div>
        <h1 class="text-3xl font-bold text-gradient mb-2">注册成功！</h1>
        <p class="text-uki-text-secondary text-base">欢迎加入 UkiUki 🎉</p>
      </div>

      <!-- 三个功能卡片 -->
      <div class="grid grid-cols-3 gap-3 mb-8">
        <div class="card-sm text-center py-5 cursor-pointer hover:scale-[1.02] transition-transform" @click="goTo('/profile')">
          <div class="w-10 h-10 mx-auto rounded-full bg-pink-50 flex items-center justify-center text-xl mb-2">👤</div>
          <p class="text-xs font-medium text-gray-700">完善资料</p>
        </div>
        <div class="card-sm text-center py-5 cursor-pointer hover:scale-[1.02] transition-transform" @click="goTo('/matches')">
          <div class="w-10 h-10 mx-auto rounded-full bg-purple-50 flex items-center justify-center text-xl mb-2">🔍</div>
          <p class="text-xs font-medium text-gray-700">浏览推荐</p>
        </div>
        <div class="card-sm text-center py-5 cursor-pointer hover:scale-[1.02] transition-transform" @click="goTo('/matches')">
          <div class="w-10 h-10 mx-auto rounded-full bg-yellow-50 flex items-center justify-center text-xl mb-2">❤️</div>
          <p class="text-xs font-medium text-gray-700">开始匹配</p>
        </div>
      </div>

      <!-- 新手引导路径 -->
      <div class="card mb-8">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">新手引导路径</h3>
        <div class="space-y-3">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center gap-3 p-3 rounded-2xl transition-all"
            :class="step.done ? 'bg-green-50/60' : 'bg-gray-50/60'"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              :class="step.done ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-400'"
            >
              <span v-if="step.done">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium" :class="step.done ? 'text-green-700' : 'text-gray-700'">{{ step.label }}</p>
            </div>
            <button
              v-if="!step.done"
              @click="completeStep(index)"
              class="text-xs px-3 py-1.5 rounded-full bg-pink-50 text-pink-400 font-medium hover:bg-pink-100 transition-colors"
            >
              去完成
            </button>
            <span v-else class="text-xs text-green-500 font-medium">已完成</span>
          </div>
        </div>
      </div>

      <!-- 主按钮 -->
      <button @click="goTo('/matches')" class="btn btn-primary w-full py-3.5 text-base">
        进入 UkiUki 🎉
      </button>

      <p class="text-center text-xs text-gray-400 mt-4">
        完成以上步骤，让更多人看见优秀的你 ✨
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const steps = ref([
  { label: '上传头像，展示真实自己', done: false },
  { label: '填写资料，让TA更了解你', done: false },
  { label: '设置条件，找到心动的TA', done: false },
  { label: '开始探索，发现美好缘分', done: false },
])

const completeStep = (index) => {
  steps.value[index].done = true
}

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.floating-decorations .star,
.floating-decorations .heart {
  position: absolute;
  font-size: 20px;
  opacity: 0.6;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
    opacity: 0.8;
  }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
