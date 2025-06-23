<template>
  <div class="container mx-auto px-4">
    <router-link to="/pokemon" class="text-indigo-600 underline mb-4 block">&larr; Back</router-link>
    <div v-if="loading">
      <LoadingSkeleton />
    </div>
    <div v-else-if="error">
      <ErrorAlert :message="error" />
    </div>
    <div v-else-if="pokemon" class="flex flex-col md:flex-row gap-8">
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="w-48 h-48 object-contain rounded" />
      <div>
        <h2 class="text-2xl font-bold capitalize mb-2">{{ pokemon.name }}</h2>
        <p><strong>ID:</strong> {{ pokemon.id }}</p>
        <p><strong>Type:</strong> {{ pokemon.types.map(t => t.type.name).join(', ') }}</p>
        <p><strong>Height:</strong> {{ pokemon.height }}</p>
        <p><strong>Weight:</strong> {{ pokemon.weight }}</p>
        <p><strong>Stats:</strong></p>
        <ul class="ml-4 list-disc">
          <li v-for="s in pokemon.stats" :key="s.stat.name">
            {{ s.stat.name }}: {{ s.base_stat }}
          </li>
        </ul>
        <button
          @click="toggleFavorite"
          class="mt-4 px-4 py-2 rounded border"
          :class="isFav ? 'bg-yellow-400 text-white' : 'bg-white text-yellow-500 border-yellow-400'"
        >
          {{ isFav ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>
    </div>
    <div v-else class="text-red-500">Pokémon not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import ErrorAlert from '../components/ErrorAlert.vue'

const route = useRoute()
const pokemon = ref(null)
const loading = ref(true)
const error = ref('')
const FAVORITES_KEY = 'favorites_pokemon'
const isFav = ref(false)

onMounted(async () => {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${route.params.name}`)
    pokemon.value = res.data
    checkFav()
  } catch (e) {
    error.value = 'Failed to load Pokémon.'
    pokemon.value = null
  }
  loading.value = false
})

function getFavs() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
}
function checkFav() {
  isFav.value = !!getFavs().find(x => x.name === pokemon.value?.name)
}
function toggleFavorite() {
  let favs = getFavs()
  if (isFav.value) {
    favs = favs.filter(x => x.name !== pokemon.value.name)
  } else {
    favs.push({ name: pokemon.value.name, id: pokemon.value.id })
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
  isFav.value = !isFav.value
}
</script>