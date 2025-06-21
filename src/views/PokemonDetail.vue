<template>
  <div class="container mx-auto px-4">
    <router-link to="/pokemon" class="text-indigo-600 underline mb-4 block">&larr; Back</router-link>
    <div v-if="loading" class="text-gray-500">Loading...</div>
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
      </div>
    </div>
    <div v-else class="text-red-500">Pokémon not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const pokemon = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${route.params.name}`)
    pokemon.value = res.data
  } catch (e) {
    pokemon.value = null
  }
  loading.value = false
})
</script>