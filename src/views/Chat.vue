<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="max-w-4xl mx-auto p-4">
      <!-- 会话列表 -->
      <div v-if="!selectedChat" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b bg-gradient-to-r from-pink-500 to-red-500">
          <h2 class="text-xl font-bold text-white">消息列表</h2>
        </div>

        <div v-if="loading" class="p-8 text-center text-gray-500">
          加载中...
        </div>

        <div v-else-if="conversations.length === 0" class="p-8 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>暂无消息</p>
          <router-link to="/discover" class="text-pink-500 hover:underline mt-2 inline-block">去发现新朋友</router-link>
        </div>

        <div v-else>
          <div
            v-for="conv in conversations"
            :key="conv.id"
            @click="selectChat(conv)"
            class="p-4 border-b hover:bg-pink-50 cursor-pointer transition"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                  {{ conv.other_user.nickname?.charAt(0).toUpperCase() || '?' }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{{ conv.other_user.nickname || '未知用户' }}</h3>
                  <p class="text-sm text-gray-500 truncate max-w-xs">{{ conv.last_message || '暂无消息' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-400">{{ formatDate(conv.last_message_at) }}</p>
                <span v-if="conv.unread_count > 0" class="inline-block mt-1 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                  {{ conv.unread_count }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天界面 -->
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
        <!-- 聊天头部 -->
        <div class="p-4 border-b bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button @click="backToConversations" class="text-white hover:text-pink-200 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-bold">
              {{ selectedChat.other_user.nickname?.charAt(0).toUpperCase() || '?' }}
            </div>
            <div>
              <h2 class="font-bold text-white">{{ selectedChat.other_user.nickname || '未知用户' }}</h2>
              <p class="text-xs text-pink-200">
                {{ isOnline ? '🟢 在线' : '⚪ 离线' }}
                {{ isTyping ? '- 正在输入...' : '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div v-if="loadingMessages" class="text-center text-gray-500 py-8">
            加载中...
          </div>

          <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>还没有消息，打个招呼吧！</p>
          </div>

          <div v-else>
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="[
                'flex',
                msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'max-w-xs px-4 py-2 rounded-2xl shadow',
                  msg.sender_id === currentUserId
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                    : 'bg-white text-gray-800'
                ]"
              >
                <p>{{ msg.content }}</p>
                <p :class="[
                  'text-xs mt-1 text-right',
                  msg.sender_id === currentUserId ? 'text-pink-200' : 'text-gray-400'
                ]">
                  {{ formatTime(msg.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入框 -->
        <div class="p-4 border-t bg-white">
          <div class="flex items-center space-x-2">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              @input="handleTyping"
              type="text"
              placeholder="输入消息..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || !isWebSocketConnected"
              class="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import chatWebSocket from '@/utils/websocket.js'

const router = useRouter()

// 数据
const conversations = ref([])
const messages = ref([])
const selectedChat = ref(null)
const loading = ref(true)
const loadingMessages = ref(false)
const newMessage = ref('')
const currentUserId = ref(null)
const isOnline = ref(false)
const isTyping = ref(false)

// WebSocket 连接状态
const isWebSocketConnected = computed(() => chatWebSocket.isConnected)

const messagesContainer = ref(null)

// 获取当前用户
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    currentUserId.value = JSON.parse(userStr).id
  }
}

// 加载会话列表
const loadConversations = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/chat/conversations', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    conversations.value = data.conversations || []
  } catch (error) {
    console.error('加载会话列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 选择聊天
const selectChat = async (conv) => {
  selectedChat.value = conv
  loadingMessages.value = true
  messages.value = []

  // 连接 WebSocket
  const token = localStorage.getItem('token')
  if (token) {
    chatWebSocket.connect(conv.id, token, currentUserId.value)
  }

  // 加载消息
  try {
    const response = await fetch(`/api/chat/messages/${conv.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    messages.value = data.messages || []
  } catch (error) {
    console.error('加载消息失败:', error)
  } finally {
    loadingMessages.value = false
    scrollToBottom()
  }
}

// 返回会话列表
const backToConversations = () => {
  chatWebSocket.disconnect()
  selectedChat.value = null
  messages.value = []
  loadConversations()
}

// 发送消息
const sendMessage = () => {
  const content = newMessage.value.trim()
  if (!content) return

  // 通过 WebSocket 发送
  if (chatWebSocket.isReady()) {
    chatWebSocket.sendMessage(content)
    newMessage.value = ''
  }
}

// 处理输入状态
const handleTyping = () => {
  if (chatWebSocket.isReady()) {
    chatWebSocket.sendTyping(true)
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString()
}

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// WebSocket 事件处理
const setupWebSocketListeners = () => {
  chatWebSocket.on('connected', (data) => {
    console.log('WebSocket connected:', data)
  })

  chatWebSocket.on('message', (data) => {
    messages.value.push(data)
    scrollToBottom()

    // 检查是否有新会话
    if (!selectedChat.value || selectedChat.value.id !== data.chat_id) {
      loadConversations()
    }
  })

  chatWebSocket.on('typing', (data) => {
    if (data.user_id !== currentUserId.value) {
      isTyping.value = data.is_typing
    }
  })

  chatWebSocket.on('user_online', (data) => {
    if (selectedChat.value && selectedChat.value.other_user.id === data.user_id) {
      isOnline.value = true
    }
  })

  chatWebSocket.on('user_offline', (data) => {
    if (selectedChat.value && selectedChat.value.other_user.id === data.user_id) {
      isOnline.value = false
    }
  })

  chatWebSocket.on('disconnected', () => {
    console.log('WebSocket disconnected')
  })

  chatWebSocket.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
}

// 移除 WebSocket 监听器
const removeWebSocketListeners = () => {
  chatWebSocket.disconnect()
}

// 生命周期
onMounted(() => {
  getCurrentUser()
  loadConversations()
  setupWebSocketListeners()
})

onUnmounted(() => {
  removeWebSocketListeners()
})
</script>
