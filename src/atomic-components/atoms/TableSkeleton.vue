<template>
  <div class="animate-pulse">
    <!-- Table Row Skeleton -->
    <div class="flex mb-2 border-b border-gray-200">
      <div class="flex-1 p-2" v-for="n in 7" :key="n">
        <div class="h-3 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  </div>
</template>
