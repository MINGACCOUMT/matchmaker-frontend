<template>
  <div class="min-h-screen relative overflow-hidden pb-8">
    <!-- 飘浮装饰 -->
    <div class="floating-decorations absolute inset-0 pointer-events-none overflow-hidden">
      <div class="star" style="top: 5%; left: 8%; animation-delay: 0s;">✨</div>
      <div class="heart" style="top: 15%; right: 10%; animation-delay: 1s;">💕</div>
      <div class="star" style="top: 40%; left: 5%; animation-delay: 2s;">⭐</div>
      <div class="heart" style="top: 60%; right: 8%; animation-delay: 0.5s;">💖</div>
      <div class="star" style="top: 80%; left: 15%; animation-delay: 1.5s;">✨</div>
    </div>

    <!-- 背景装饰圆 -->
    <div class="absolute top-[-5%] right-[-10%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-5%] left-[-10%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 max-w-lg mx-auto px-4 pt-4">
      <!-- 顶部导航栏 -->
      <div class="flex items-center justify-between mb-6">
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 class="text-lg font-bold text-gray-800">设置</h1>
        <button class="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </div>

      <!-- 用户信息卡片 -->
      <div class="card mb-4 flex items-center gap-4">
        <div class="relative">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 via-pink-400 to-purple-400 flex items-center justify-center text-2xl shadow-uki-pink">
            🌸
          </div>
          <button class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-xs border border-gray-100">
            ✏️
          </button>
        </div>
        <div class="flex-1">
          <h2 class="font-bold text-gray-800">Uki 用户</h2>
          <p class="text-xs text-gray-400 mt-0.5">ID: 88888888</p>
        </div>
        <RouterLink to="/profile" class="text-sm text-pink-400 hover:text-pink-500 font-medium">编辑资料 →</RouterLink>
      </div>

      <!-- 个人设置 -->
      <div class="card mb-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">个人设置</h3>
        <div class="space-y-1">
          <div class="setting-item" @click="goTo('/profile')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">个人资料</span>
            </div>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div class="setting-item" @click="showToast('修改头像')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">修改头像</span>
            </div>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div class="setting-item" @click="showToast('主题色')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
              </div>
              <span class="text-sm text-gray-700">主题色</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-pink-400"></span>
              <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 账号管理 -->
      <div class="card mb-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">账号管理</h3>
        <div class="space-y-1">
          <div class="setting-item" @click="showToast('账号与安全')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">账号与安全</span>
            </div>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div class="setting-item" @click="showToast('修改密码')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">修改密码</span>
            </div>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div class="setting-item" @click="showToast('绑定手机')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">绑定手机</span>
            </div>
            <span class="text-xs text-gray-400">已绑定 138****8888</span>
          </div>
          <div class="setting-item" @click="showToast('绑定邮箱')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">绑定邮箱</span>
            </div>
            <span class="text-xs text-pink-400">未绑定</span>
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="card mb-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">隐私设置</h3>
        <div class="space-y-1">
          <div class="setting-item" @click="showToast('隐私权限管理')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">隐私权限管理</span>
            </div>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div class="setting-item">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
              </div>
              <span class="text-sm text-gray-700">隐藏在线状态</span>
            </div>
            <input type="checkbox" class="toggle" v-model="settings.hideOnline" />
          </div>
          <div class="setting-item" @click="showToast('谁可以看我的资料')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">谁可以看我的资料</span>
            </div>
            <span class="text-xs text-gray-400 mr-1">所有人</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div class="setting-item" @click="showToast('黑名单管理')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              </div>
              <span class="text-sm text-gray-700">黑名单管理</span>
            </div>
            <span class="text-xs text-gray-400">0 人</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="card mb-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">通知设置</h3>
        <div class="space-y-1">
          <div class="setting-item">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">消息通知</span>
            </div>
            <input type="checkbox" class="toggle" v-model="settings.msgNotify" />
          </div>
          <div class="setting-item">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">声音提醒</span>
            </div>
            <input type="checkbox" class="toggle" v-model="settings.sound" />
          </div>
          <div class="setting-item">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">震动提醒</span>
            </div>
            <input type="checkbox" class="toggle" v-model="settings.vibrate" />
          </div>
          <div class="setting-item">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">邮件通知</span>
            </div>
            <input type="checkbox" class="toggle" v-model="settings.emailNotify" />
          </div>
        </div>
      </div>

      <!-- 系统设置 -->
      <div class="card mb-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">系统设置</h3>
        <div class="space-y-1">
          <div class="setting-item">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              </div>
              <span class="text-sm text-gray-700">深色模式</span>
            </div>
            <input type="checkbox" class="toggle" v-model="settings.darkMode" />
          </div>
          <div class="setting-item" @click="showToast('语言与地区')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <span class="text-sm text-gray-700">语言与地区</span>
            </div>
            <span class="text-xs text-gray-400 mr-1">简体中文</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>

      <!-- 退出登录 -->
      <button @click="logout" class="w-full py-3.5 rounded-2xl bg-white/80 backdrop-blur text-red-400 font-semibold text-sm shadow-sm hover:bg-white transition-all mb-6">
        退出登录
      </button>

      <!-- 版本号 -->
      <p class="text-center text-xs text-gray-300">UkiUki v1.0.0</p>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast" class="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800/90 text-white text-sm px-4 py-2 rounded-full z-50 shadow-lg">
        {{ toast }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const settings = ref({
  hideOnline: false,
  msgNotify: true,
  sound: true,
  vibrate: false,
  emailNotify: true,
  darkMode: false,
})

const toast = ref('')
const showToast = (msg) => {
  toast.value = msg
  setTimeout(() => toast.value = '', 1500)
}

const goTo = (path) => {
  router.push(path)
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  cursor: pointer;
  border-radius: 12px;
  transition: background 0.2s ease;
}
.setting-item:hover {
  background: rgba(255, 143, 171, 0.04);
}

.floating-decorations .star,
.floating-decorations .heart {
  position: absolute;
  font-size: 18px;
  opacity: 0.5;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-16px) rotate(8deg);
    opacity: 0.7;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
