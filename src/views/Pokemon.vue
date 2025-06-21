<template>
  <div class="container mx-auto px-4">
    <h2 class="text-xl font-bold mb-4">Pokémon</h2>
    <div v-if="loading" class="text-gray-500">Loading Pokémon...</div>
    <div v-else>
      <input
        v-model="search"
        type="text"
        placeholder="Search Pokémon..."
        class="mb-4 p-2 border rounded w-full"
      />
      <div class="grid md:grid-cols-3 gap-4">
        <div v-for="p in filteredPokemon" :key="p.name" class="border rounded p-4 shadow bg-white">
          <img :src="getImageUrl(p)" :alt="p.name" class="w-24 h-24 object-contain mb-2" />
          <h3 class="text-lg font-bold capitalize">{{ p.name }}</h3>
          <router-link
            :to="`/pokemon/${p.name}`"
            class="text-indigo-600 underline mt-2 inline-block"
            >Details</router-link
          >
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-6 gap-4">
      <button
        class="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
        :disabled="offset === 0"
        @click="prevPage"
      >
        Previous
      </button>
      <button
        class="px-4 py-2 bg-indigo-600 text-white rounded"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const pokemon = ref([])
const loading = ref(true)
const search = ref('')
const offset = ref(0)
const limit = 21

const fetchPokemon = async () => {
  loading.value = true
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset.value}`)
  pokemon.value = res.data.results
  loading.value = false
}

onMounted(fetchPokemon)

const nextPage = () => {
  offset.value += limit
  fetchPokemon()
}
const prevPage = () => {
  if (offset.value > 0) {
    offset.value -= limit
    fetchPokemon()
  }
}

const filteredPokemon = computed(() => {
  if (!search.value) return pokemon.value
  return pokemon.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

function getImageUrl(p) {
  // The default API only gives name and url, extract id from url
  const id = p.url.split('/').filter(Boolean).pop()
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
</script>