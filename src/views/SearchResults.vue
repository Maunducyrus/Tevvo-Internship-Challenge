<template>
  <div class="container mx-auto px-4">
    <h2 class="text-xl font-bold mb-4">Search Results for "{{ $route.query.q }}"</h2>
    <div v-if="loading">
      <LoadingSkeleton :count="4" />
    </div>
    <div v-else>
      <template v-if="countries.length">
        <h3 class="text-lg font-semibold mb-2">Countries</h3>
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div
            v-for="country in countries"
            :key="country.cca3"
            class="border rounded p-4 shadow bg-white"
          >
            <img :src="country.flags.png" :alt="country.name.common" class="w-24 h-16 object-cover mb-2 rounded" />
            <h4 class="text-lg font-bold">{{ country.name.common }}</h4>
            <router-link :to="`/countries/${country.cca3}`" class="text-indigo-600 underline mt-2 inline-block">Details</router-link>
          </div>
        </div>
      </template>
      <template v-if="pokemons.length">
        <h3 class="text-lg font-semibold mb-2">Pokémon</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div
            v-for="p in pokemons"
            :key="p.name"
            class="border rounded p-4 shadow bg-white flex flex-col items-center"
          >
            <img :src="getImageUrl(p)" :alt="p.name" class="w-16 h-16 object-contain mb-2" />
            <h4 class="font-bold capitalize">{{ p.name }}</h4>
            <router-link :to="`/pokemon/${p.name}`" class="text-indigo-600 underline mt-2 inline-block">Details</router-link>
          </div>
        </div>
      </template>
      <div v-if="!countries.length && !pokemons.length && !loading" class="text-gray-500">No results found.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'

const countries = ref([])
const pokemons = ref([])
const loading = ref(true)
const query = ref('')

const getImageUrl = (p) => {
  // Use pokeId if available for sprite
  const id = p.pokeId || p.id || (p.url ? p.url.split('/').filter(Boolean).pop() : '')
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

const fetchResults = async () => {
  loading.value = true
  countries.value = []
  pokemons.value = []
  query.value = decodeURIComponent(window.location.search.replace(/^.*q=/, ''))
  try {
    // Countries
    let cres = await axios.get('https://restcountries.com/v3.1/all')
    let q = query.value.toLowerCase()
    countries.value = cres.data.filter(c =>
      c.name.common.toLowerCase().includes(q)
    )
    // Pokémon (limit to 1000 for demo)
    let pres = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
    pokemons.value = pres.data.results.filter(p =>
      p.name.toLowerCase().includes(q)
    ).map((p, i) => ({ ...p, pokeId: i + 1 }))
  } catch (e) {}
  loading.value = false
}

onMounted(fetchResults)
watch(() => window.location.search, fetchResults)
</script>