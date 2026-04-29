<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
    <div class="card max-w-md w-full card-hover">
      <!-- 成功图标 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-2xl">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-4xl font-bold gradient-text mb-3">欢迎加入！</h2>
        <p class="text-gray-500 text-lg">你的账号已创建成功 🎉</p>
      </div>

      <!-- 欢迎内容 -->
      <div class="space-y-6 mb-8">
        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            1
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">完善你的资料</h3>
            <p class="text-sm text-gray-500">添加头像、简介和标签，让别人更容易找到你</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            2
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">发现匹配</h3>
            <p class="text-sm text-gray-500">浏览推荐用户，找到你感兴趣的人</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            3
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">开始聊天</h3>
            <p class="text-sm text-gray-500">与匹配成功的人开始聊天，了解更多</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-3">
        <RouterLink to="/profile" class="btn btn-primary w-full text-lg font-semibold flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>完善资料</span>
        </RouterLink>

        <RouterLink to="/matches" class="btn btn-secondary w-full text-lg font-semibold flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span>开始匹配</span>
        </RouterLink>
      </div>

      <!-- 底部提示 -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">有问题？<a href="#" class="text-indigo-600 hover:text-indigo-700">联系我们</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
