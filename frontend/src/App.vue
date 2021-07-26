<template>
  <Header />
  <div class="main">
    <router-view />
  </div>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Header from './components/Header.vue'

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  @apply bg-gray-50 min-h-screen pb-5 select-none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.content {
  @apply w-11/12 max-w-5xl m-auto;
}
.card {
  @apply m-auto mt-5 shadow-lg rounded-lg bg-white;
}
.card-header {
  @apply border-b p-4;
}
.card-title {
  @apply font-medium text-lg;
}
.card-subtitle {
  @apply font-normal text-sm text-gray-500;
}
.card-body {
  @apply text-sm p-4;
}
.card-footer {
  @apply text-right pl-4 pr-4 pb-4;
}
</style>