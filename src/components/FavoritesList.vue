<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Your Favorites</h2>
    <div v-if="!countries.length && !pokemons.length" class="text-gray-500">
      No favorites yet.
    </div>
    <div v-if="countries.length">
      <h3 class="text-lg font-semibold mb-2">Countries</h3>
      <div class="flex flex-wrap gap-4 mb-8">
        <div
          v-for="c in countries"
          :key="c.cca3"
          class="border rounded p-4 bg-white w-48"
        >
          <img :src="c.flags.png || c.flags.svg" :alt="c.name.common || c.name" class="w-20 h-12 object-cover mb-2 rounded" />
          <router-link :to="`/countries/${c.cca3}`" class="font-bold text-indigo-600">
            {{ c.name.common || c.name }}
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="pokemons.length">
      <h3 class="text-lg font-semibold mb-2">Pokémon</h3>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="p in pokemons"
          :key="p.name"
          class="border rounded p-4 bg-white w-32 flex flex-col items-center"
        >
          <img :src="getImageUrl(p)" :alt="p.name" class="w-16 h-16 object-contain mb-1" />
          <router-link :to="`/pokemon/${p.name}`" class="capitalize text-indigo-600">{{ p.name }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const FAVORITES_COUNTRIES_KEY = 'favorites_countries'
const FAVORITES_POKEMON_KEY = 'favorites_pokemon'

const countries = ref([])
const pokemons = ref([])

onMounted(() => {
  countries.value = JSON.parse(localStorage.getItem(FAVORITES_COUNTRIES_KEY) || '[]')
  pokemons.value = JSON.parse(localStorage.getItem(FAVORITES_POKEMON_KEY) || '[]')
})

function getImageUrl(p) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id || p.pokeId}.png`
}
</script>