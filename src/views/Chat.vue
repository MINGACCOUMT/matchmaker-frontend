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
import { chatAPI } from '@/api'

const route = useRoute()
const userId = Number(route.params.userId)

const messages = ref([])
const newMessage = ref('')
const loading = ref(false)
const conversationId = ref(null)

onMounted(async () => {
  try {
    // 1. 获取会话列表，找到与该用户的会话
    const convs = await chatAPI.getConversations()
    const conv = convs.conversations?.find(c => c.other_user?.id === userId)
    if (conv) {
      conversationId.value = conv.id
      // 2. 加载历史消息
      const msgs = await chatAPI.getMessages(conv.id)
      messages.value = (msgs.messages || []).map(m => ({
        id: m.id,
        senderId: m.sender_id,
        text: m.content
      }))
    }
  } catch (err) {
    console.error('加载聊天失败:', err)
  }
})

const handleSend = async () => {
  if (!newMessage.value.trim() || !conversationId.value) return

  const content = newMessage.value.trim()
  loading.value = true

  // 先添加到本地
  const tempId = Date.now()
  messages.value.push({
    id: tempId,
    senderId: 1, // 当前用户
    text: content
  })
  newMessage.value = ''

  try {
    await chatAPI.sendMessage(conversationId.value, content)
  } catch (err) {
    console.error('发送失败:', err)
  } finally {
    loading.value = false
  }
}
</script>
