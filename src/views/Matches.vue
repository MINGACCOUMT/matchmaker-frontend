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
              {{ match.nickname?.charAt(0) || '?' }}
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-bold text-gray-900">{{ match.nickname }}</h3>
              <p class="text-sm text-gray-600">{{ match.gender === 1 ? '男' : '女' }} · {{ match.age }}岁</p>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <p v-if="match.bio" class="text-sm text-gray-600 line-clamp-2">{{ match.bio }}</p>
            <div v-if="match.tags?.length" class="flex flex-wrap gap-1">
              <span v-for="tag in match.tags" :key="tag" class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                {{ tag }}
              </span>
            </div>
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
