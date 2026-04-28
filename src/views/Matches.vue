<template>
  <div class="min-h-screen px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">为你推荐</h2>

      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-600">加载中...</div>
      </div>

      <div v-else-if="matches.length === 0" class="text-center py-12">
        <div class="text-gray-600">暂时没有推荐的匹配</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="match in matches"
          :key="match.id"
          class="card hover:shadow-xl transition-shadow"
        >
          <div class="flex items-center mb-4">
            <div class="w-20 h-20 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {{ match.nickname.charAt(0) }}
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-bold text-gray-900">{{ match.nickname }}</h3>
              <p class="text-sm text-gray-600">匹配度: {{ match.score }}%</p>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <p v-if="match.age" class="text-sm text-gray-600">年龄: {{ match.age }}岁</p>
            <p v-if="match.city" class="text-sm text-gray-600">城市: {{ match.city }}</p>
            <p v-if="match.occupation" class="text-sm text-gray-600">职业: {{ match.occupation }}</p>
          </div>

          <div class="flex space-x-2">
            <button
              @click="handleLike(match.id)"
              class="btn btn-primary flex-1"
            >
              喜欢
            </button>
            <button
              @click="handleChat(match.id)"
              class="btn btn-secondary flex-1"
            >
              聊天
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
    const response = await matchAPI.findMatches({
      user_id: userStore.user?.id || 1,
      limit: 10
    })
    
    matches.value = response.matched_users.map(user => ({
      id: user.id,
      nickname: user.nickname,
      score: Math.round(user.score),
      age: 25,
      city: '上海',
      occupation: '软件工程师'
    }))
    
    console.log('匹配列表:', matches.value)
  } catch (err) {
    console.error('加载匹配失败:', err)
    matches.value = []
  } finally {
    loading.value = false
  }
}

const handleLike = async (targetId) => {
  try {
    await matchAPI.likeUser(userStore.user?.id || 1, targetId)
    console.log('喜欢成功:', targetId)
    
    // 移除已喜欢的用户
    matches.value = matches.value.filter(m => m.id !== targetId)
  } catch (err) {
    console.error('喜欢失败:', err)
  }
}

const handleChat = (userId) => {
  router.push(`/chat/${userId}`)
}
</script>
