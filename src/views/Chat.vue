<template>
  <div class="min-h-screen px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">聊天</h2>
          <RouterLink to="/matches" class="btn btn-secondary">返回匹配</RouterLink>
        </div>

        <div class="space-y-4 h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
          <div v-if="messages.length === 0" class="text-center text-gray-600 py-12">
            暂时没有消息
          </div>
          
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex',
              message.senderId === userId ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-xs px-4 py-2 rounded-lg',
                message.senderId === userId
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-900'
              ]"
            >
              {{ message.text }}
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSend" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="输入消息..."
            class="input flex-1"
            required
          />
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '发送中...' : '发送' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = Number(route.params.userId)

const messages = ref([
  { id: 1, senderId: 2, text: '你好！很高兴认识你' },
  { id: 2, senderId: 1, text: '你好！我也是' }
])

const newMessage = ref('')
const loading = ref(false)

const handleSend = () => {
  if (!newMessage.value.trim()) return

  messages.value.push({
    id: messages.value.length + 1,
    senderId: 1,
    text: newMessage.value
  })

  newMessage.value = ''

  // TODO: 实现 WebSocket 实时聊天
  console.log('发送消息:', newMessage.value)
}

onMounted(() => {
  console.log('聊天用户 ID:', userId)
  
  // TODO: 加载历史消息
  // loadMessages(userId)
})
</script>
