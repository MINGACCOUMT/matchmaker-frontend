<template>
  <div class="min-h-screen px-4 py-8 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-[-10%] right-[-5%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-md">
              💬
            </div>
            <h2 class="text-2xl font-bold text-gradient">聊天</h2>
          </div>
          <RouterLink to="/matches" class="btn btn-secondary px-5 py-2">
            ← 返回匹配
          </RouterLink>
        </div>

        <div class="space-y-4 h-[500px] overflow-y-auto mb-4 p-4 bg-gradient-to-b from-pink-50/50 to-purple-50/30 rounded-3xl border border-pink-100/50">
          <div v-if="messages.length === 0" class="text-center text-gray-400 py-12">
            <div class="text-4xl mb-2">✨</div>
            <div>暂时没有消息</div>
            <div class="text-sm mt-1">打个招呼吧 💕</div>
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
                'max-w-xs md:max-w-sm px-5 py-3 rounded-2xl text-[15px] leading-relaxed',
                message.senderId === userId
                  ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white rounded-br-md shadow-uki-pink'
                  : 'bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-100'
              ]"
            >
              {{ message.text }}
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSend" class="flex space-x-3">
          <input
            v-model="newMessage"
            type="text"
            placeholder="输入消息..."
            class="input flex-1"
            required
          />
          <button type="submit" class="btn btn-primary px-6" :disabled="loading">
            {{ loading ? '发送中...' : '发送 💕' }}
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
    const convs = await chatAPI.getConversations()
    const conv = convs.conversations?.find(c => c.other_user?.id === userId)
    if (conv) {
      conversationId.value = conv.id
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

  const tempId = Date.now()
  messages.value.push({
    id: tempId,
    senderId: 1,
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
