<script setup lang="ts"></script>

<template>
  <div>
    <router-view class="h-full"></router-view>
    <footer
      class="fixed bottom-0 left-0 right-0 bg-gray-500 text-white text-center py-2 text-xs"
    >
      <p>
        Made with Vue3/Pinia/TailwindCSS by
        <strong>Kenny Amper | {{ currentYear }}</strong>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
