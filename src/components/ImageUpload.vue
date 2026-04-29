<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">📷 图片上传</h2>

      <!-- 头像上传 -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">头像</h3>
        
        <div class="flex items-center space-x-4">
          <!-- 当前头像 -->
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
            <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.nickname" class="w-full h-full object-cover" />
            <span v-else>{{ user.nickname?.charAt(0).toUpperCase() || '?' }}</span>
          </div>

          <!-- 上传按钮 -->
          <label class="relative cursor-pointer bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition">
            <span>📷 上传头像</span>
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/gif"
              @change="handleAvatarUpload"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        <!-- 上传进度 -->
        <div v-if="uploadProgress > 0" class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-pink-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ uploadProgress }}%</p>
        </div>

        <!-- 上传成功提示 -->
        <div v-if="uploadSuccess" class="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          ✅ {{ uploadSuccess }}
        </div>

        <!-- 上传错误提示 -->
        <div v-if="uploadError" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          ❌ {{ uploadError }}
        </div>
      </div>

      <!-- 相册上传 -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">相册</h3>

        <!-- 上传按钮 -->
        <label class="relative cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-2 rounded-lg transition block text-center">
          <span class="text-lg">➕ 上传照片</span>
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/gif"
            multiple
            @change="handleGalleryUpload"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <!-- 相册预览 -->
      <div v-if="gallery.length > 0">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">我的照片 ({{ gallery.length }})</h3>
        
        <div class="grid grid-cols-3 gap-4">
          <div 
            v-for="photo in gallery" 
            :key="photo.id"
            class="relative group cursor-pointer"
            @click="selectPhoto(photo)"
          >
            <!-- 图片 -->
            <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                :src="photo.file_url" 
                :alt="photo.filename"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- 删除按钮 -->
            <button 
              @click.stop="deletePhoto(photo)"
              class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition opacity-100"
              title="删除"
            >
              ✕
            </button>

            <!-- 设为头像按钮 -->
            <button 
              @click.stop="setAvatar(photo)"
              class="absolute top-2 left-2 w-6 h-6 bg-pink-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition opacity-100"
              :class="{ 'opacity-100': isAvatar(photo) }"
              title="设为头像"
            >
              👤
            </button>

            <!-- 头像标记 -->
            <div 
              v-if="isAvatar(photo)"
              class="absolute bottom-2 left-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-bold"
            >
              头像
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/index'

const userStore = useUserStore()
const user = ref(userStore.user)

// 上传状态
const uploadProgress = ref(0)
const uploadSuccess = ref('')
const uploadError = ref('')
const gallery = ref([])

// 获取相册
const fetchGallery = async () => {
  try {
    const response = await api.get('/api/v1/upload/gallery')
    gallery.value = response.images || []
  } catch (error) {
    console.error('Failed to fetch gallery:', error)
  }
}

// 头像上传
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    uploadError.value = '只支持 JPG、PNG、GIF 格式'
    return
  }

  // 验证文件大小（10MB）
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = '文件太大，最大允许 10MB'
    return
  }

  uploadProgress.value = 0
  uploadSuccess.value = ''
  uploadError.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/api/v1/upload/upload-avatar', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          uploadProgress.value = percentCompleted
        }
      }
    })

    // 更新用户信息
    userStore.setUser(response.user)

    uploadSuccess.value = response.message
    uploadProgress.value = 0

    // 清空成功提示
    setTimeout(() => {
      uploadSuccess.value = ''
    }, 3000)

    // 重新获取相册
    await fetchGallery()
  } catch (error) {
    uploadError.value = error.response?.data?.detail || '上传失败'
    uploadProgress.value = 0
  }
}

// 相册上传
const handleGalleryUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  for (const file of files) {
    // 验证文件类型
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      uploadError.value = `不支持的文件类型：${file.name}`
      return
    }

    // 验证文件大小
    if (file.size > 10 * 1024 * 1024) {
      uploadError.value = `文件太大：${file.name}（最大 10MB）`
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/api/v1/upload/upload-gallery', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
          }
        }
      })

      uploadSuccess.value = `${file.name} 上传成功`
      uploadProgress.value = 0

      setTimeout(() => {
        uploadSuccess.value = ''
      }, 2000)

      // 重新获取相册
      await fetchGallery()
    } catch (error) {
      uploadError.value = `${file.name} 上传失败`
      uploadProgress.value = 0
    }
  }
}

// 选择照片
const selectPhoto = (photo) => {
  console.log('Selected photo:', photo)
}

// 删除照片
const deletePhoto = async (photo) => {
  if (!confirm('确定要删除这张照片吗？')) {
    return
  }

  try {
    await api.delete(`/api/v1/upload/gallery/${photo.filename}`)
    
    // 从相册中移除
    const index = gallery.value.findIndex(p => p.filename === photo.filename)
    if (index > -1) {
      gallery.value.splice(index, 1)
    }
  } catch (error) {
    uploadError.value = '删除失败'
  }
}

// 设为头像
const setAvatar = async (photo) => {
  try {
    const response = await api.post('/api/v1/upload/set-avatar', {
      filename: photo.filename
    })

    // 更新用户信息
    userStore.setUser(response.user)

    uploadSuccess.value = '头像设置成功'

    setTimeout(() => {
      uploadSuccess.value = ''
    }, 3000)
  } catch (error) {
    uploadError.value = '设置头像失败'
  }
}

// 检查是否是当前头像
const isAvatar = (photo) => {
  return user.value?.avatar_url?.includes(photo.filename) || false
}

// 组件挂载时获取相册
onMounted(() => {
  fetchGallery()
})
</script>
