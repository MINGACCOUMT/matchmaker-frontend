<template>
  <div id="app" class="min-h-screen bg-gradient-uki">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 主内容 -->
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
