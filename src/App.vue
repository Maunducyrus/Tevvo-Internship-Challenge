<template>
  <div :class="{ 'dark': darkMode }" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <nav class="bg-white dark:bg-gray-800 shadow mb-8">
      <div class="container mx-auto flex justify-between items-center py-4">
        <h1 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Tevvo Build Challenge</h1>
        <div class="flex gap-4 items-center">
          <router-link class="hover:underline" to="/">Home</router-link>
          <router-link class="hover:underline" to="/countries">Countries</router-link>
          <router-link class="hover:underline" to="/pokemon">Pokemon</router-link>
          <router-link class="hover:underline" to="/favorites">Favorites</router-link>
          <button @click="toggleDark" class="px-2 py-1 border rounded ml-2">
            {{ darkMode ? "🌙" : "☀️" }}
          </button>
        </div>
      </div>
      <div class="container mx-auto py-2">
        <form @submit.prevent="search">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Global Search countries or pokémon..."
            class="w-full p-2 border rounded"
          />
        </form>
      </div>
    </nav>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const darkMode = ref(localStorage.getItem('darkMode') === '1')
function toggleDark() {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value ? '1' : '0')
}
watch(darkMode, (val) => {
  if (val) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}, { immediate: true })

const searchTerm = ref('')
const router = useRouter()
function search() {
  if (searchTerm.value.trim()) {
    router.push({ name: 'SearchResults', query: { q: searchTerm.value.trim() } })
    searchTerm.value = ''
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>