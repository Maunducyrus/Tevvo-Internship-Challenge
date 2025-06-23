<template>
  <div class="container mx-auto px-4">
    <router-link to="/countries" class="text-indigo-600 underline mb-4 block">&larr; Back</router-link>
    <div v-if="loading">
      <LoadingSkeleton />
    </div>
    <div v-else-if="error">
      <ErrorAlert :message="error" />
    </div>
    <div v-else-if="country">
      <div class="flex flex-col md:flex-row gap-8">
        <img :src="country.flags.png" :alt="country.name.common" class="w-48 h-32 object-cover rounded" />
        <div>
          <h2 class="text-2xl font-bold mb-2">{{ country.name.common }}</h2>
          <p><strong>Region:</strong> {{ country.region }}</p>
          <p><strong>Capital:</strong> {{ country.capital ? country.capital[0] : '-' }}</p>
          <p><strong>Population:</strong> {{ country.population.toLocaleString() }}</p>
          <p><strong>Languages:</strong> {{ languages }}</p>
          <button
            @click="toggleFavorite"
            class="mt-4 px-4 py-2 rounded border"
            :class="isFav ? 'bg-yellow-400 text-white' : 'bg-white text-yellow-500 border-yellow-400'"
          >
            {{ isFav ? 'Remove from Favorites' : 'Add to Favorites' }}
          </button>
        </div>
      </div>
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">
          Pokémons starting with "{{ country.name.common.charAt(0).toUpperCase() }}"
        </h3>
        <div v-if="pokemonsLoading">
          <LoadingSkeleton :count="6" />
        </div>
        <div v-else-if="pokemons.length">
          <div class="flex flex-wrap gap-4">
            <div
              v-for="poke in pokemons"
              :key="poke.name"
              class="border p-2 rounded flex flex-col items-center w-32 bg-white shadow"
            >
              <img :src="getImageUrl(poke)" :alt="poke.name" class="w-16 h-16 object-contain" />
              <router-link :to="`/pokemon/${poke.name}`" class="capitalize text-indigo-600 mt-2">{{ poke.name }}</router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500">No Pokémon found starting with this letter.</div>
      </div>
    </div>
    <div v-else>
      <ErrorAlert message="No country data found." />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import ErrorAlert from '../components/ErrorAlert.vue'

const route = useRoute()
const country = ref(null)
const loading = ref(true)
const error = ref('')
const pokemons = ref([])
const pokemonsLoading = ref(true)

const FAVORITES_KEY = 'favorites_countries'
const isFav = ref(false)

onMounted(async () => {
  loading.value = true
  error.value = ''
  console.log('Country code:', route.params.code)
  try {
    const url = `https://restcountries.com/v3.1/alpha/${route.params.code}?fields=cca3,name,region,capital,population,languages,flags`
    console.log('Fetching:', url)
    const res = await axios.get(url)
    console.log('API response:', res.data)
  if (res.data && typeof res.data === 'object') {
  country.value = res.data
  checkFav()
  fetchPokemons()
  } 
  else {
  error.value = 'No country found for this code.'
  } 
  } catch (e) {
    console.log('Axios error:', e)
    error.value = 'Failed to load country data.'
  }
  loading.value = false
})

async function fetchPokemons() {
  if (!country.value) return
  try {
    pokemonsLoading.value = true
    let listRes = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
    let firstLetter = country.value.name.common.charAt(0).toLowerCase()
    pokemons.value = listRes.data.results.filter(p =>
      p.name.charAt(0).toLowerCase() === firstLetter
    ).slice(0, 8)
  } catch (e) {
    // ignore errors here for brevity
  }
  pokemonsLoading.value = false
}

const languages = computed(() => {
  if (!country.value || !country.value.languages) return '-'
  return Object.values(country.value.languages).join(', ')
})

function getImageUrl(p) {
  const id = p.url.split('/').filter(Boolean).pop()
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

// Favorites logic
function checkFav() {
  let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  isFav.value = !!favs.find(c => c.cca3 === country.value?.cca3)
}
function toggleFavorite() {
  let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  if (isFav.value) {
    favs = favs.filter(c => c.cca3 !== country.value.cca3)
  } else {
    favs.push({
      cca3: country.value.cca3,
      name: country.value.name,
      flags: country.value.flags
    })
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
  isFav.value = !isFav.value
}
</script>