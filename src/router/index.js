import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Countries from '../views/Countries.vue'
import CountryDetail from '../views/CountryDetail.vue'
import Pokemon from '../views/Pokemon.vue'
import PokemonDetail from '../views/PokemonDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/countries', name: 'Countries', component: Countries },
  { path: '/countries/:code', name: 'CountryDetail', component: CountryDetail, props: true },
  { path: '/pokemon', name: 'Pokemon', component: Pokemon },
  { path: '/pokemon/:name', name: 'PokemonDetail', component: PokemonDetail, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router