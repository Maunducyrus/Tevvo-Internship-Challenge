<template>
  <div>
    <nav class="bg-white shadow mb-8">
      <div class="container mx-auto flex justify-between items-center py-4">
        <h1 class="text-2xl font-bold text-indigo-600">Tevvo Build Challenge</h1>
        <div class="flex gap-4">
          <router-link class="hover:underline" to="/">Home</router-link>
          <router-link class="hover:underline" to="/countries">Countries</router-link>
          <router-link class="hover:underline" to="/pokemon">Pokemon</router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>