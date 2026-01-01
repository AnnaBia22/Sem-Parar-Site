import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/home.vue'
import QuemSomos from '../pages/quemsomos.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/quem-somos', component: QuemSomos },
  { path: '/noticias', component: () => import('../pages/noticias.vue') },
  { path: '/noticias/:id', component: () => import('../pages/noticia-interna.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
