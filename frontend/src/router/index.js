import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/home.vue'
import QuemSomos from '../pages/quemsomos.vue'
import FaleConosco from '../pages/faleconosco.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/quem-somos', component: QuemSomos },
  { path: '/fale-conosco', component: FaleConosco },
  { path: '/noticias', component: () => import('../pages/noticias.vue') },
  { path: '/noticias/:id', component: () => import('../pages/noticia-interna.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
