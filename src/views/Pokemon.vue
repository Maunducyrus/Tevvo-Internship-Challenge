<template>
  <div class="container mx-auto px-4">
    <h2 class="text-xl font-bold mb-4">Pokémon</h2>
    <div v-if="error">
      <ErrorAlert :message="error" />
    </div>
    <div v-else>
      <div class="flex flex-wrap gap-4 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search Pokémon..."
          class="p-2 border rounded flex-1"
        />
        <select v-model="typeFilter" class="p-2 border rounded">
          <option value="">All Types</option>
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div v-if="loading">
        <LoadingSkeleton :count="6" />
      </div>
      <div class="grid md:grid-cols-3 gap-4" v-else>
        <div v-for="p in filteredPokemon" :key="p.name" class="border rounded p-4 shadow bg-white dark:bg-gray-800 flex flex-col items-center">
          <img :src="getImageUrl(p)" :alt="p.name" class="w-24 h-24 object-contain mb-2" />
          <h3 class="text-lg font-bold capitalize">{{ p.name }}</h3>
          <router-link
            :to="`/pokemon/${p.name}`"
            class="text-indigo-600 underline mt-2 inline-block"
            >Details</router-link
          >
          <button
            @click="toggleFavorite(p)"
            class="mt-2 text-yellow-500"
            :title="isFav(p) ? 'Remove from favorites' : 'Add to favorites'"
          >
            <span v-if="isFav(p)">★</span>
            <span v-else>☆</span>
          </button>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import ErrorAlert from '../components/ErrorAlert.vue'

const pokemon = ref([])
const allPokemon = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const offset = ref(0)
const limit = 21
const typeFilter = ref('')
const types = ref([])

const FAVORITES_KEY = 'favorites_pokemon'

const fetchTypes = async () => {
  try {
    const res = await axios.get('https://pokeapi.co/api/v2/type')
    types.value = res.data.results.map(t => t.name)
  } catch { /* ignore */ }
}

const fetchPokemon = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset.value}`)
    pokemon.value = res.data.results.map((p, i) => ({
      ...p,
      pokeId: offset.value + i + 1
    }))

    // Optionally fetch types for current page pokémon for filtering
    if (typeFilter.value) {
      await Promise.all(pokemon.value.map(async (p, idx) => {
        try {
          const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
          pokemon.value[idx].types = pokeRes.data.types.map(t => t.type.name)
        } catch { }
      }))
    }
  } catch (e) {
    error.value = 'Failed to load pokémon.'
  }
  loading.value = false
}

onMounted(() => {
  fetchPokemon()
  fetchTypes()
})

watch(offset, fetchPokemon)
watch(typeFilter, fetchPokemon)

const nextPage = () => {
  offset.value += limit
}
const prevPage = () => {
  if (offset.value > 0) offset.value -= limit
}

const filteredPokemon = computed(() => {
  let arr = pokemon.value
  if (search.value) arr = arr.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
  if (typeFilter.value) arr = arr.filter(p =>
    (p.types || []).includes(typeFilter.value)
  )
  return arr
})

function getImageUrl(p) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokeId || p.id}.png`
}

function getFavs() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
}
function isFav(p) {
  return !!getFavs().find(x => x.name === p.name)
}
function toggleFavorite(p) {
  let favs = getFavs()
  if (isFav(p)) {
    favs = favs.filter(x => x.name !== p.name)
  } else {
    favs.push({ name: p.name, pokeId: p.pokeId || p.id })
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
}
</script>