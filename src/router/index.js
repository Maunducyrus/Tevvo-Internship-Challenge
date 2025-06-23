import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Countries from '../views/Countries.vue'
import CountryDetail from '../views/CountryDetail.vue'
import Pokemon from '../views/Pokemon.vue'
import PokemonDetail from '../views/PokemonDetail.vue'
import Favorites from '../views/Favorites.vue'
import SearchResults from '../views/SearchResults.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/countries', name: 'Countries', component: Countries },
  { path: '/countries/:code', name: 'CountryDetail', component: CountryDetail, props: true },
  { path: '/pokemon', name: 'Pokemon', component: Pokemon },
  { path: '/pokemon/:name', name: 'PokemonDetail', component: PokemonDetail, props: true },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/search', name: 'SearchResults', component: SearchResults },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router