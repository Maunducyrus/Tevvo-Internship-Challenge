<template>
  <div class="container mx-auto px-4">
    <h2 class="text-xl font-bold mb-4">Countries</h2>
    <div v-if="error">
      <ErrorAlert :message="error" />
    </div>
    <div v-else>
      <div class="flex flex-wrap gap-4 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search country..."
          class="p-2 border rounded flex-1"
        />
        <select v-model="region" class="p-2 border rounded">
          <option value="">All Regions</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
      <div v-if="loading">
        <LoadingSkeleton :count="6" />
      </div>
      <div class="grid md:grid-cols-3 gap-4" v-else>
        <div
          v-for="country in paginatedCountries"
          :key="country.cca3"
          class="border rounded p-4 shadow bg-white dark:bg-gray-800 flex flex-col"
        >
          <img :src="country.flags.png" :alt="country.name.common" class="w-24 h-16 object-cover mb-2 rounded" />
          <h3 class="text-lg font-bold">{{ country.name.common }}</h3>
          <p>{{ country.region }}</p>
          <router-link
            :to="`/countries/${country.cca3}`"
            class="text-indigo-600 underline mt-2 inline-block"
            >Details</router-link
          >
          <button
            @click="toggleFavorite(country)"
            class="ml-auto mt-2 text-yellow-500"
            :title="isFav(country) ? 'Remove from favorites' : 'Add to favorites'"
          >
            <span v-if="isFav(country)">★</span>
            <span v-else>☆</span>
          </button>
        </div>
      </div>
      <div class="flex justify-center mt-6 gap-4">
        <button
          class="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
          :disabled="page === 0"
          @click="page--"
        >
          Previous
        </button>
        <button
          class="px-4 py-2 bg-indigo-600 text-white rounded"
          :disabled="(page+1)*perPage >= filteredCountries.length"
          @click="page++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import ErrorAlert from '../components/ErrorAlert.vue'

const countries = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const region = ref('')
const page = ref(0)
const perPage = 12

onMounted(async () => {
  try {
    const res = await axios.get('https://restcountries.com/v3.1/all')
    countries.value = res.data
  } catch (e) {
    error.value = 'Failed to load countries.'
  }
  loading.value = false
})

const regions = computed(() => {
  // gather all unique regions from the countries list
  const set = new Set()
  for (const c of countries.value) set.add(c.region)
  return Array.from(set).filter(Boolean).sort()
})

const filteredCountries = computed(() => {
  let arr = countries.value
  if (region.value) arr = arr.filter(c => c.region === region.value)
  if (search.value) arr = arr.filter(c =>
    c.name.common.toLowerCase().includes(search.value.toLowerCase())
  )
  return arr
})

const paginatedCountries = computed(() => {
  const start = page.value * perPage
  return filteredCountries.value.slice(start, start + perPage)
})

// Favorites logic
const FAVORITES_KEY = 'favorites_countries'
function getFavs() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
}
function isFav(country) {
  return !!getFavs().find(c => c.cca3 === country.cca3)
}
function toggleFavorite(country) {
  let favs = getFavs()
  if (isFav(country)) {
    favs = favs.filter(c => c.cca3 !== country.cca3)
  } else {
    favs.push({ cca3: country.cca3, name: country.name, flags: country.flags })
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
}
</script>