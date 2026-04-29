<template>
  <div class="min-h-screen px-4 py-8 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-[-10%] right-[-5%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-md">
          💕
        </div>
        <h2 class="text-3xl font-bold text-gradient">为你推荐</h2>
      </div>

      <div v-if="loading" class="text-center py-16">
        <div class="inline-block w-12 h-12 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin mb-4"></div>
        <div class="text-gray-500">正在寻找缘分 ✨...</div>
      </div>

      <div v-else-if="matches.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🌸</div>
        <div class="text-gray-500 text-lg">暂时没有推荐的匹配</div>
        <p class="text-gray-400 text-sm mt-2">稍后再来看看吧 ✨</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="match in matches"
          :key="match.id"
          class="card hover:shadow-uki-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-center mb-5">
            <div class="w-20 h-20 bg-gradient-to-br from-pink-300 via-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-white">
              {{ match.nickname?.charAt(0) || '?' }}
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-bold text-gray-800">{{ match.nickname }}</h3>
              <p class="text-sm text-gray-500">{{ match.gender === 1 ? '男 ♂️' : '女 ♀️' }} · {{ match.age }}岁</p>
            </div>
          </div>

          <div class="space-y-3 mb-5">
            <p v-if="match.bio" class="text-sm text-gray-600 line-clamp-2 leading-relaxed">{{ match.bio }}</p>
            <div v-if="match.tags?.length" class="flex flex-wrap gap-2">
              <span v-for="tag in match.tags" :key="tag" class="tag tag-pink">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="handleLike(match.id)"
              class="btn btn-primary flex-1 py-2.5"
            >
              <span class="mr-1">💕</span> 喜欢
            </button>
            <button
              @click="handleChat(match.id)"
              class="btn btn-secondary flex-1 py-2.5"
            >
              <span class="mr-1">💬</span> 聊天
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { matchAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const matches = ref([])
const loading = ref(false)

onMounted(async () => {
  await loadMatches()
})

const loadMatches = async () => {
  loading.value = true

  try {
    const response = await matchAPI.discoverUsers()
    matches.value = (response.users || []).map(user => ({
      id: user.id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      gender: user.gender,
      age: user.age,
      bio: user.bio,
      tags: user.tags || []
    }))
  } catch (err) {
    console.error('加载推荐失败:', err)
    matches.value = []
  } finally {
    loading.value = false
  }
}

const handleLike = async (targetId) => {
  try {
    await matchAPI.likeUser(targetId)
    console.log('喜欢成功:', targetId)
    matches.value = matches.value.filter(m => m.id !== targetId)
  } catch (err) {
    console.error('喜欢失败:', err)
  }
}

const handleChat = (userId) => {
  router.push(`/chat/${userId}`)
}
</script>
