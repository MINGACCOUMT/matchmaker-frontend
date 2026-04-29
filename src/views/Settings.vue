<template>
  <div class="min-h-screen pt-20 px-4 py-8">
    <div class="max-w-4xl mx-auto animate-fade-in">
      <!-- 标题 -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">设置</h2>
        <p class="text-gray-500">管理你的账户和偏好设置</p>
      </div>

      <!-- 设置分组 -->
      <div class="space-y-6">
        <!-- 账户设置 -->
        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            账户设置
          </h3>

          <div class="space-y-6">
            <!-- 邮箱 -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">邮箱地址</p>
                <p class="text-sm text-gray-500">{{ userStore.user?.email }}</p>
              </div>
              <button class="btn btn-secondary px-4">
                修改
              </button>
            </div>

            <!-- 密码 -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">密码</p>
                <p class="text-sm text-gray-500">修改你的登录密码</p>
              </div>
              <button class="btn btn-secondary px-4">
                修改
              </button>
            </div>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            隐私设置
          </h3>

          <div class="space-y-6">
            <!-- 账号可见性 -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">账号可见性</p>
                <p class="text-sm text-gray-500">控制其他人是否可以看到你的资料</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <!-- 在线状态 -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">在线状态</p>
                <p class="text-sm text-gray-500">让其他人看到你的在线状态</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            通知设置
          </h3>

          <div class="space-y-6">
            <!-- 新消息通知 -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">新消息通知</p>
                <p class="text-sm text-gray-500">收到新消息时发送通知</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <!-- 新匹配通知 -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">新匹配通知</p>
                <p class="text-sm text-gray-500">有新匹配时发送通知</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <!-- 营销邮件 -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">营销邮件</p>
                <p class="text-sm text-gray-500">接收产品更新和促销信息</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- 关于 -->
        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            关于
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p class="font-medium text-gray-900">版本</p>
                <p class="text-sm text-gray-500">v1.0.0</p>
              </div>
            </div>

            <div class="space-y-2">
              <a href="#" class="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">隐私政策</span>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </a>

              <a href="#" class="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">服务条款</span>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </a>

              <a href="#" class="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">联系我们</span>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- 危险操作 -->
        <div class="card border-red-200">
          <h3 class="text-xl font-bold text-red-600 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            危险操作
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div>
                <p class="font-medium text-gray-900">删除账号</p>
                <p class="text-sm text-gray-500">永久删除你的账号和所有数据</p>
              </div>
              <button class="btn bg-red-500 text-white hover:bg-red-600 px-6">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
