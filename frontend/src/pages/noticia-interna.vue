<template>
  <div class="layout-wrapper">
    <Header />
    
    <LoadingStatus v-if="loading" />
    
    <main class="container-interna" v-else-if="noticia">
      <header class="header-noticia">
        <h1 class="titulo-materia">{{ noticia.titulo }}</h1>
        <p class="subtitulo-materia">{{ noticia.subtitulo }}</p>
        
        <div class="assinatura-share">
          <div class="autor-info">
            Por: <strong>{{ noticia.autora }}</strong>, {{ noticia.instaautora }}<br>
            {{ noticia.dataExtenso }}
          </div>
          <div class="social-icons">
            <span class="icon">🔗</span>
            <span class="icon">📸</span>
            <span class="icon">💬</span>
          </div>
        </div>
      </header>

      <figure class="imagem-destaque" v-if="noticia.foto">
        <img :src="noticia.foto" :alt="noticia.titulo">
        <figcaption v-if="noticia.legenda">{{ noticia.legenda }}</figcaption>
      </figure>

      <div class="corpo-texto" v-html="renderizarBlocos(noticia.conteudoRaw)"></div>
    </main>
    
    <main class="container-interna centralizado" v-else>
      <h2>Notícia não encontrada</h2>
      <p>ID da notícia: {{ $route.params.id }}</p>
      <router-link to="/noticias">Voltar para notícias</router-link>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import LoadingStatus from '../components/loading.vue'

const route = useRoute()
const loading = ref(true)
const noticia = ref(null)
const baseUrl = "http://localhost:1337"

// Função para transformar os Blocos do Strapi em HTML
const renderizarBlocos = (blocos) => {
  if (!blocos || !Array.isArray(blocos)) return "";
  return blocos.map(bloco => {
    if (bloco.type === 'paragraph') {
      const texto = bloco.children.map(child => child.text).join('');
      return `<p style="margin-bottom: 20px;">${texto}</p>`;
    }
    // Adicione suporte para heading se necessário
    if (bloco.type === 'heading') {
       const texto = bloco.children.map(child => child.text).join('');
       return `<h2 style="margin: 20px 0;">${texto}</h2>`;
    }
    return "";
  }).join('');
}

onMounted(async () => {
  const id = route.params.id
  
  try {
    const res = await axios.get(`${baseUrl}/api/noticias/${id}?populate=*`)
    
    if (res.data && res.data.data) {
      const data = res.data.data.attributes || res.data.data
      
      const midiaCapa = data.capa?.[0] || data.capa?.data?.[0]?.attributes || data.capa?.data?.[0]

      noticia.value = {
        titulo: data.tituloprincipal,
        subtitulo: data.subtitulo,
        autora: data.autora,
        instaautora: data.instaautora,
        
        // --- FORMATAÇÃO DA DATA CORRIGIDA ---
        dataExtenso: data.data_postagem 
          ? new Date(data.data_postagem).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).replace(',', ' às') // Troca a vírgula pelo " às"
          : '',
        // ------------------------------------

        foto: midiaCapa?.url ? baseUrl + midiaCapa.url : null,
        legenda: data.descricao_capa,
        conteudoRaw: data.conteudo
      }
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes da notícia:", error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container-interna { 
  flex: 1;
  width: 100%; 
  max-width: 100vw; 
  padding: 20px; 
  box-sizing: border-box; 
  margin: 0 auto;
}

.centralizado {
  text-align: center;
  padding-top: 100px;
}

.titulo-materia { 
  font-family: 'Sugo Display', sans-serif; 
  color: #25074f; 
  font-size: 3rem; 
  margin-bottom: 10px; 
}

.subtitulo-materia {
  font-size: 1.4rem;
  color: #555;
  margin-bottom: 20px;
}

.assinatura-share { 
  display: flex; 
  justify-content: space-between; 
  border-bottom: 1px solid #eee; 
  padding-bottom: 15px; 
  margin-bottom: 25px; 
}

.imagem-destaque {
  margin: 0 0 30px 0;
}

.imagem-destaque img { 
  width: 100%; 
  max-height: 600px; 
  object-fit: cover; 
  border-radius: 10px; 
}

.corpo-texto { 
  font-size: 1.2rem; 
  line-height: 1.8; 
  margin-top: 30px; 
  max-width: 800px; 
  margin-left: auto;
  margin-right: auto;
}
</style>