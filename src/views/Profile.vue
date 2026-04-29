<template>
  <div class="min-h-screen px-4 py-8 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-[-10%] right-[-5%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <div class="card">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-md">
            🌸
          </div>
          <h2 class="text-3xl font-bold text-gradient">个人资料</h2>
        </div>

        <form @submit.prevent="handleUpdate" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
              <input
                v-model="formData.nickname"
                type="text"
                class="input"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">性别</label>
              <select v-model="formData.gender" class="input" required>
                <option value="1">男 ♂️</option>
                <option value="2">女 ♀️</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">生日</label>
              <input
                v-model="formData.birthday"
                type="date"
                class="input"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">身高 (cm)</label>
              <input
                v-model="formData.height"
                type="number"
                class="input"
                placeholder="请输入身高"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">职业</label>
              <input
                v-model="formData.occupation"
                type="text"
                class="input"
                placeholder="请输入职业"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">城市</label>
              <input
                v-model="formData.city"
                type="text"
                class="input"
                placeholder="请输入城市"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
            <textarea
              v-model="formData.bio"
              class="input"
              rows="4"
              placeholder="介绍一下自己..."
            ></textarea>
          </div>

          <div class="flex items-center gap-4">
            <button type="submit" class="btn btn-primary px-8" :disabled="loading">
              {{ loading ? '保存中...' : '保存 ✨' }}
            </button>

            <div v-if="success" class="text-pink-500 flex items-center gap-1 bg-pink-50 px-4 py-2 rounded-full text-sm">
              <span>💖</span> 保存成功！
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userAPI } from '@/api'

const formData = ref({
  nickname: '',
  gender: 1,
  birthday: '',
  height: '',
  occupation: '',
  city: '',
  bio: ''
})

const loading = ref(false)
const success = ref(false)

onMounted(async () => {
  try {
    const response = await userAPI.getMe()
    if (response) {
      formData.value.nickname = response.nickname || ''
      formData.value.gender = response.gender || 1
      formData.value.birthday = response.birthday || ''
      formData.value.bio = response.profile?.self_intro || ''
    }
  } catch (err) {
    console.error('加载资料失败:', err)
  }
})

const handleUpdate = async () => {
  loading.value = true
  success.value = false

  try {
    await userAPI.updateMe({
      nickname: formData.value.nickname,
      gender: formData.value.gender,
      birthday: formData.value.birthday,
      bio: formData.value.bio
    })
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (err) {
    console.error('更新失败:', err)
  } finally {
    loading.value = false
  }
}
</script>
