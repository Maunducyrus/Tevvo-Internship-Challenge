<template>
  <div class="animate-pulse flex flex-wrap gap-4">
    <div
      v-for="n in count"
      :key="n"
      class="bg-gray-200 dark:bg-gray-700 rounded h-24 w-48"
    ></div>
  </div>
</template>
<script setup>
defineProps({ count: { type: Number, default: 4 } })
</script>