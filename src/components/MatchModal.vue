<template>
  <Teleport to="body">
    <Transition name="match-fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="close">
        <div class="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-bounce-in">
          <!-- 标题 -->
          <div class="text-4xl mb-2">🎉</div>
          <h2 class="text-2xl font-black text-gray-800 mb-1">匹配成功！</h2>
          <p class="text-sm text-gray-500 mb-6">你们互相喜欢了对方</p>

          <!-- 头像对对碰 -->
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
              {{ me?.nickname?.charAt(0) || '?' }}
            </div>
            <div class="text-3xl animate-pulse">💕</div>
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
              {{ matchUser?.nickname?.charAt(0) || '?' }}
            </div>
          </div>

          <p class="text-lg font-bold text-gray-800 mb-1">{{ matchUser?.nickname }}</p>
          <p class="text-sm text-gray-500 mb-6">{{ matchUser?.age }}岁 · {{ matchUser?.gender === 1 ? '男' : '女' }}</p>

          <!-- 按钮 -->
          <div class="space-y-3">
            <button
              @click="goChat"
              class="w-full btn btn-primary py-3 text-base font-bold"
            >
              发起聊天 💌
            </button>
            <button
              @click="close"
              class="w-full btn btn-secondary py-3 text-sm"
            >
              继续滑动
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  show: Boolean,
  me: Object,
  matchUser: Object
})
const emit = defineEmits(['close'])

const router = useRouter()

const close = () => emit('close')

const goChat = () => {
  if (props.matchUser?.id) {
    router.push(`/chat/${props.matchUser.id}`)
  }
  close()
}
</script>

<style scoped>
.match-fade-enter-active,
.match-fade-leave-active {
  transition: opacity 0.3s ease;
}
.match-fade-enter-from,
.match-fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
</style>
