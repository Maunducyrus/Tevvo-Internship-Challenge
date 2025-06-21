<template>
  <div class="container mx-auto px-4" v-if="country">
    <router-link to="/countries" class="text-indigo-600 underline mb-4 block">&larr; Back</router-link>
    <div class="flex flex-col md:flex-row gap-8">
      <img :src="country.flags.png" :alt="country.name.common" class="w-48 h-32 object-cover rounded" />
      <div>
        <h2 class="text-2xl font-bold mb-2">{{ country.name.common }}</h2>
        <p><strong>Region:</strong> {{ country.region }}</p>
        <p><strong>Capital:</strong> {{ country.capital ? country.capital[0] : '-' }}</p>
        <p><strong>Population:</strong> {{ country.population.toLocaleString() }}</p>
        <p><strong>Languages:</strong> {{ languages }}</p>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto px-4">Loading...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const country = ref(null)

onMounted(async () => {
  const res = await axios.get(`https://restcountries.com/v3.1/alpha/${route.params.code}`)
  country.value = res.data[0]
})

const languages = computed(() => {
  if (!country.value || !country.value.languages) return '-'
  return Object.values(country.value.languages).join(', ')
})
</script>