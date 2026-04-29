<template>
  <div class="min-h-screen px-4 py-8">
    <div class="max-w-4xl mx-auto animate-fade-in">
      <!-- 标题栏 -->
      <div class="mb-8">
        <h2 class="text-4xl font-bold gradient-text mb-2">我的资料</h2>
        <p class="text-gray-500 text-lg">管理你的个人信息</p>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="loading-spinner mx-4"></div>
        <span class="text-gray-500 text-lg">加载中...</span>
      </div>

      <!-- 资料卡片 -->
      <div v-else class="card mb-6">
        <!-- 头像区域 -->
        <div class="flex items-center mb-8 pb-8 border-b border-gray-200">
          <div class="avatar avatar-lg flex-shrink-0">
            {{ profile.nickname?.charAt(0) || '?' }}
          </div>
          <div class="ml-6 flex-1">
            <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ profile.nickname }}</h3>
            <p class="text-gray-500 text-lg">{{ profile.email }}</p>
          </div>
          <button class="btn btn-secondary flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>更换头像</span>
          </button>
        </div>

        <!-- 基本信息 -->
        <div class="mb-8">
          <h4 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            基本信息
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">昵称</label>
              <input
                v-model="formData.nickname"
                type="text"
                placeholder="请输入昵称"
                class="input"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">邮箱</label>
              <input
                :value="profile.email"
                type="email"
                disabled
                class="input bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">性别</label>
              <select v-model="formData.gender" class="input">
                <option value="">请选择性别</option>
                <option value="1">男</option>
                <option value="2">女</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">生日</label>
              <input
                v-model="formData.birth_date"
                type="date"
                class="input"
              />
            </div>
          </div>
        </div>

        <!-- 扩展资料 -->
        <div v-if="profile.profile" class="mb-8">
          <h4 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            扩展资料
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">身高</label>
              <input
                v-model="formData.height"
                type="number"
                placeholder="请输入身高"
                class="input"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">体重</label>
              <input
                v-model="formData.weight"
                type="number"
                placeholder="请输入体重"
                class="input"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">学历</label>
              <select v-model="formData.education" class="input">
                <option value="">请选择学历</option>
                <option value="1">高中</option>
                <option value="2">大专</option>
                <option value="3">本科</option>
                <option value="4">硕士</option>
                <option value="5">博士</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">职业</label>
              <input
                v-model="formData.occupation"
                type="text"
                placeholder="请输入职业"
                class="input"
              />
            </div>
          </div>
        </div>

        <!-- 个人简介和标签 -->
        <div class="mb-8">
          <h4 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            个人简介
          </h4>
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">自我介绍</label>
            <textarea
              v-model="formData.bio"
              class="input"
              rows="4"
              placeholder="介绍一下自己..."
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">兴趣标签</label>
            <div v-if="profile.profile?.tags?.length" class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in profile.profile.tags" :key="tag" class="badge badge-secondary">
                {{ tag }}
              </span>
            </div>
            <input
              v-model="formData.tags"
              type="text"
              placeholder="用逗号分隔，如：旅行,美食,电影"
              class="input"
            />
          </div>
        </div>

        <!-- 保存按钮 -->
        <div class="flex space-x-4">
          <button
            @click="handleSave"
            class="btn btn-primary flex-1 flex items-center justify-center space-x-2"
            :disabled="saving"
          >
            <svg v-if="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{{ saving ? '保存中...' : '保存修改' }}</span>
          </button>
          <button
            @click="loadProfile"
            class="btn btn-secondary"
            :disabled="saving"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userAPI } from '@/api'

const profile = ref({})
const formData = ref({
  nickname: '',
  gender: '',
  birth_date: '',
  height: '',
  weight: '',
  education: '',
  occupation: '',
  bio: '',
  tags: ''
})

const loading = ref(false)
const saving = ref(false)

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  loading.value = true
  try {
    const response = await userAPI.getMe()
    profile.value = response

    formData.value = {
      nickname: response.nickname || '',
      gender: response.gender || '',
      birth_date: response.birthday || '',
      height: response.profile?.height || '',
      weight: response.profile?.weight || '',
      education: response.profile?.education || '',
      occupation: response.profile?.occupation || '',
      bio: response.profile?.self_intro || '',
      tags: response.profile?.tags?.join(',') || ''
    }
  } catch (err) {
    console.error('加载资料失败:', err)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    await userAPI.updateMe(formData.value)
    alert('保存成功！')
    await loadProfile()
  } catch (err) {
    console.error('保存失败:', err)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}
</script>
