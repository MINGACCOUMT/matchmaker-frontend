/**
 * WebSocket 聊天管理器
 */
class ChatWebSocket {
  constructor() {
    this.ws = null
    this.chatId = null
    this.userId = null
    this.token = null
    this.listeners = {}
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.isConnected = false
    this.typingTimer = null
  }

  /**
   * 连接 WebSocket
   */
  connect(chatId, token, userId) {
    this.chatId = chatId
    this.token = token
    this.userId = userId

    // 获取 WebSocket URL
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsHost = import.meta.env.VITE_WS_URL || window.location.host
    const wsUrl = `${wsProtocol}//${wsHost}/api/ws/chat/${chatId}?token=${token}`

    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected')
      this.isConnected = true
      this.reconnectAttempts = 0
      this.emit('connected')
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📩 WebSocket message:', data)

        switch (data.type) {
          case 'connected':
            this.emit('connected', data)
            break

          case 'message':
            this.emit('message', data)
            break

          case 'typing':
            this.emit('typing', data)
            break

          case 'user_online':
            this.emit('user_online', data)
            break

          case 'user_offline':
            this.emit('user_offline', data)
            break

          default:
            this.emit('message', data)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error)
      this.emit('error', error)
    }

    this.ws.onclose = (event) => {
      console.log('🔌 WebSocket disconnected')
      this.isConnected = false
      this.emit('disconnected', event)

      // 自动重连
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        setTimeout(() => this.connect(this.chatId, this.token, this.userId), this.reconnectDelay)
      }
    }
  }

  /**
   * 发送消息
   */
  sendMessage(content) {
    if (!this.isConnected || !this.ws) {
      console.error('WebSocket not connected')
      return false
    }

    this.ws.send(JSON.stringify({
      type: 'message',
      content: content,
      timestamp: new Date().toISOString()
    }))

    return true
  }

  /**
   * 发送输入状态
   */
  sendTyping(isTyping = true) {
    if (!this.isConnected || !this.ws) {
      return false
    }

    // 清除之前的定时器
    if (this.typingTimer) {
      clearTimeout(this.typingTimer)
    }

    // 发送输入状态
    this.ws.send(JSON.stringify({
      type: 'typing',
      is_typing: isTyping,
      timestamp: new Date().toISOString()
    }))

    // 3秒后自动停止输入状态
    if (isTyping) {
      this.typingTimer = setTimeout(() => {
        this.sendTyping(false)
      }, 3000)
    }

    return true
  }

  /**
   * 标记消息已读
   */
  markAsRead() {
    if (!this.isConnected || !this.ws) {
      return false
    }

    this.ws.send(JSON.stringify({
      type: 'read',
      timestamp: new Date().toISOString()
    }))

    return true
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.isConnected = false
    }
  }

  /**
   * 事件监听
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * 移除事件监听
   */
  off(event, callback) {
    if (!this.listeners[event]) return

    const index = this.listeners[event].indexOf(callback)
    if (index > -1) {
      this.listeners[event].splice(index, 1)
    }
  }

  /**
   * 触发事件
   */
  emit(event, data) {
    if (!this.listeners[event]) return

    this.listeners[event].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in ${event} handler:`, error)
      }
    })
  }

  /**
   * 检查是否连接
   */
  isReady() {
    return this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// 创建全局实例
const chatWebSocket = new ChatWebSocket()

export default chatWebSocket
