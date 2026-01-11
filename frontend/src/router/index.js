import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/home.vue'
import QuemSomos from '../pages/quemsomos.vue'
import FaleConosco from '../pages/faleconosco.vue'
// 1. ADICIONEI ESTA LINHA (Importando o arquivo que criamos)
import Cursos from '../pages/cursos.vue' 

const routes = [
  { path: '/', component: Home },
  { path: '/quem-somos', component: QuemSomos },
  { path: '/fale-conosco', component: FaleConosco },
  // 2. ADICIONEI ESTA LINHA (Criando o endereço /cursos)
  { path: '/cursos', component: Cursos }, 
  { path: '/noticias', component: () => import('../pages/noticias.vue') },
  { path: '/noticias/:id', component: () => import('../pages/noticia-interna.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})