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
            <button @click="compartilharGeral" title="Compartilhar" class="btn-icon">
              <img src="../assets/images/share.png" alt="Compartilhar" class="icon-img icon-purple">
            </button>
            
            <button @click="compartilharInstagram" title="Compartilhar no Instagram" class="btn-icon">
              <img src="../assets/images/instagram.png" alt="Instagram" class="icon-img icon-purple">
            </button>

            <a :href="'https://api.whatsapp.com/send?text=' + encodeURIComponent(noticia.titulo + ' ' + urlAtual)" target="_blank" class="btn-icon">
              <img src="../assets/images/whatsapp.png" alt="WhatsApp" class="icon-img icon-purple">
            </a>
          </div>
        </div>
      </header>

      <figure class="imagem-destaque" v-if="noticia.foto">
        <img :src="noticia.foto" :alt="noticia.titulo">
        <figcaption v-if="noticia.legenda" class="legenda-centralizada">
          {{ noticia.legenda }}
        </figcaption>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import LoadingStatus from '../components/loading.vue'

const route = useRoute()
const loading = ref(true)
const noticia = ref(null)
const baseUrl = "https://sem-parar-back.onrender.com"
const urlAtual = computed(() => window.location.href)

const compartilharGeral = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: noticia.value.titulo,
        text: noticia.value.subtitulo,
        url: window.location.href,
      });
    } catch (err) { console.log('Cancelado'); }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado!");
  }
}

const compartilharInstagram = async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: noticia.value.titulo, url: window.location.href });
    } catch (err) { console.log('Cancelado'); }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado! Cole no seu Stories ou Direct.");
  }
}

const renderizarBlocos = (blocos) => {
  if (!blocos || !Array.isArray(blocos)) return "";
  return blocos.map(bloco => {
    if (bloco.type === 'paragraph') {
      const texto = bloco.children.map(child => child.text).join('');
      return `<p style="margin-bottom: 20px;">${texto}</p>`;
    }
    if (bloco.type === 'heading') {
       const texto = bloco.children.map(child => child.text).join('');
       return `<h2 style="margin: 20px 0; font-family: 'Sugo Display', sans-serif;">${texto}</h2>`;
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
        instaautora: data.instaautora || "@equipe",
        dataExtenso: data.data_postagem 
          ? new Date(data.data_postagem).toLocaleString('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }).replace(',', ' às')
          : '',
        foto: midiaCapa?.url ? baseUrl + midiaCapa.url : null,
        legenda: data.descricao_capa,
        conteudoRaw: data.conteudo
      }
    }
  } catch (error) { console.error(error); } finally { loading.value = false; }
})
</script>

<style scoped>
.layout-wrapper { display: flex; flex-direction: column; min-height: 100vh; }

.container-interna { 
  flex: 1; width: 100%; max-width: 100vw; 
  padding: 40px 20px; /* Igualado ao Quem Somos e Notícias */
  box-sizing: border-box; margin: 0 auto;
}

.titulo-materia { 
  font-family: 'Sugo Display', sans-serif; 
  color: #25074f; font-size: 3rem; 
  margin: 0 0 10px 0; line-height: 1.1;
}

.subtitulo-materia { font-size: 1.4rem; color: #555; margin-bottom: 20px; }

.assinatura-share { 
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 25px; 
}

.social-icons { display: flex; gap: 15px; }

.btn-icon {
  background: none; border: none; cursor: pointer; padding: 5px;
  display: flex; align-items: center; transition: transform 0.2s, filter 0.2s;
}

.btn-icon:hover { transform: scale(1.1); }

.icon-purple:hover {
  filter: invert(13%) sepia(95%) saturate(5453%) hue-rotate(296deg) brightness(81%) contrast(106%);
}

.icon-img { width: 28px; height: auto; }

.imagem-destaque { margin: 0 0 30px 0; }
.imagem-destaque img { width: 100%; max-height: 600px; object-fit: cover; border-radius: 10px; }

.legenda-centralizada {
  text-align: center; font-size: 0.9rem; color: #666;
  margin-top: 10px; font-style: italic; display: block;
}

.corpo-texto { 
  font-size: 1.2rem; line-height: 1.8; margin-top: 30px; 
  max-width: 800px; margin-left: auto; margin-right: auto;
}
</style>