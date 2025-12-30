import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/home.vue'
import QuemSomos from '../pages/quemsomos.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/quem-somos', component: QuemSomos }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
