<template>
  <div id="app" class="min-h-screen bg-gradient-uki">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F7 0%, #F8F0FC 100%);
}
</style>
