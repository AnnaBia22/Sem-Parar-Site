import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/home.vue'
import Quem from '../pages/quemsomos.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/quem-somos', component: Quem },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
