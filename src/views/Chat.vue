<template>
  <div class="min-h-screen pt-20 px-4 py-8">
    <div class="max-w-4xl mx-auto h-[calc(100vh-8rem)] animate-fade-in">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-3xl font-bold gradient-text mb-2">聊天</h2>
          <p class="text-gray-500">与匹配的人开始对话</p>
        </div>
        <button @click="loadConversations" class="btn btn-secondary flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>刷新</span>
        </button>
      </div>

      <!-- 对话列表 -->
      <div class="card overflow-hidden h-full flex flex-col">
        <!-- 加载中 -->
        <div v-if="loading" class="flex items-center justify-center flex-1">
          <div class="loading-spinner mx-4"></div>
          <span class="text-gray-500">加载中...</span>
        </div>

        <!-- 空状态 -->
        <div v-else-if="conversations.length === 0" class="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
            <svg class="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-700 mb-2">还没有对话</h3>
          <p class="text-gray-500 mb-6">匹配成功后就可以开始聊天了</p>
          <RouterLink to="/matches" class="btn btn-primary">
            去匹配
          </RouterLink>
        </div>

        <!-- 对话列表 -->
        <div v-else class="flex-1 overflow-y-auto">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            @click="handleSelectConversation(conversation)"
            class="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
          >
            <!-- 用户头像 -->
            <div class="avatar flex-shrink-0">
              {{ conversation.other_user?.nickname?.charAt(0) || '?' }}
            </div>

            <!-- 用户信息 -->
            <div class="ml-4 flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-900 truncate">
                  {{ conversation.other_user?.nickname }}
                </h3>
                <span v-if="conversation.last_message_at" class="text-xs text-gray-400">
                  {{ formatTime(conversation.last_message_at) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 truncate">
                  {{ conversation.last_message || '开始对话...' }}
                </p>
                <span v-if="conversation.unread_count > 0" class="w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                  {{ conversation.unread_count }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 消息详情模态框 -->
      <div v-if="selectedConversation" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="card max-w-4xl w-full h-[80vh] flex flex-col animate-fade-in">
          <!-- 对话头部 -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center">
              <button @click="closeChat" class="mr-4 text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <div class="avatar">
                {{ selectedConversation.other_user?.nickname?.charAt(0) || '?' }}
              </div>
              <div class="ml-3">
                <h3 class="font-semibold text-gray-900">{{ selectedConversation.other_user?.nickname }}</h3>
                <p class="text-sm text-gray-500">在线</p>
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['message-bubble', message.sender_id === userId ? 'message-bubble-sent' : 'message-bubble-received']"
            >
              <p>{{ message.content }}</p>
              <p class="text-xs mt-1 opacity-70">{{ formatTime(message.created_at) }}</p>
            </div>

            <div v-if="messages.length === 0" class="text-center text-gray-400 py-8">
              开始发送第一条消息吧 💬
            </div>
          </div>

          <!-- 消息输入 -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex space-x-3">
              <input
                v-model="newMessage"
                type="text"
                placeholder="输入消息..."
                class="input flex-1"
                @keyup.enter="handleSendMessage"
              />
              <button
                @click="handleSendMessage"
                class="btn btn-primary px-6"
                :disabled="!newMessage.trim() || sending"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { chatAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const conversations = ref([])
const messages = ref([])
const selectedConversation = ref(null)
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)

const userId = computed(() => userStore.user?.id)

onMounted(async () => {
  await loadConversations()
})

const loadConversations = async () => {
  loading.value = true
  try {
    const response = await chatAPI.getConversations()
    conversations.value = response.conversations || []
  } catch (err) {
    console.error('加载对话失败:', err)
    conversations.value = []
  } finally {
    loading.value = false
  }
}

const handleSelectConversation = async (conversation) => {
  selectedConversation.value = conversation
  await loadMessages(conversation.id)
}

const loadMessages = async (chatId) => {
  try {
    const response = await chatAPI.getMessages(chatId)
    messages.value = response.messages || []
  } catch (err) {
    console.error('加载消息失败:', err)
    messages.value = []
  }
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  sending.value = true
  try {
    await chatAPI.sendMessage({
      conversation_id: selectedConversation.value.id,
      content: newMessage.value
    })
    newMessage.value = ''
    await loadMessages(selectedConversation.value.id)
  } catch (err) {
    console.error('发送消息失败:', err)
  } finally {
    sending.value = false
  }
}

const closeChat = () => {
  selectedConversation.value = null
  messages.value = []
  newMessage.value = ''
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString()
}
</script>
