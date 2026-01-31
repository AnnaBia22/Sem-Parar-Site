<template>
  <Header />
  <LoadingStatus v-if="loading" />

  <main class="container" v-else>
    <h1 class="titulo-pagina">NOTÍCIAS</h1>

    <div class="lista-noticias">
      <RouterLink 
        v-for="noticia in noticias" 
        :key="noticia.id" 
        :to="'/noticias/' + noticia.id" 
        class="card-horizontal"
      >
        <div class="foto-noticia">
          <img :src="noticia.foto" :alt="noticia.titulo">
        </div>
        
        <div class="info-noticia">
          <h2 class="titulo-card">{{ noticia.titulo }}</h2>
          <h3 class="subtitulo-card">{{ noticia.subtitulo }}</h3>
          <span class="meta-dados">{{ noticia.dataFormato }} - {{ noticia.autora }}</span>
        </div>
      </RouterLink>
    </div>
  </main>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import LoadingStatus from '../components/loading.vue'

const baseUrl = "https://sem-parar-back.onrender.com"
const noticias = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/noticias?populate=*&sort=data_postagem:desc`)
    
    if (res.data && res.data.data) {
      noticias.value = res.data.data.map(n => {
        const attr = n.attributes || n
        const midiaCapa = attr.capa?.data?.[0]?.attributes || attr.capa?.[0]
        const imgUrl = midiaCapa?.url

        return {
          id: n.documentId || n.id,
          titulo: attr.tituloprincipal || "Sem título",
          subtitulo: attr.subtitulo || "",
          autora: attr.autora || "Equipe",
          dataFormato: attr.data_postagem 
            ? new Date(attr.data_postagem).toLocaleDateString('pt-BR') 
            : 'Sem data',
          foto: imgUrl ? `${baseUrl}${imgUrl}` : 'https://picsum.photos/400/250'
        }
      })
    }
  } catch (e) { 
    console.error("Erro ao carregar notícias:", e) 
  } finally { 
    loading.value = false 
  }
})
</script>

<style scoped>
.container { 
  flex: 1; 
  width: 100%; 
  max-width: 100vw; 
  margin: 0 auto; 
  padding: 40px 20px; /* Igualado ao Quem Somos */
  box-sizing: border-box;
}

.titulo-pagina { 
  font-family: 'Sugo Display', sans-serif; 
  color: #ff9a16; 
  text-align: center; 
  font-size: 2.8rem; 
  margin: 0 0 20px 0; /* Removido margin-top para alinhar no topo */
}

.lista-noticias { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  width: 100%;
}

.card-horizontal {
  display: flex;
  background: #eeeeee;
  border-radius: 12px;
  padding: 12px 30px; 
  text-decoration: none;
  transition: transform 0.2s;
  align-items: center;
  gap: 30px;
  width: 100%;
  box-sizing: border-box;
}

.card-horizontal:hover { 
  transform: scale(1.002); 
  box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
}

.foto-noticia { 
  width: 200px; 
  height: 110px; 
  background: #4a0000; 
  border-radius: 8px; 
  overflow: hidden; 
  flex-shrink: 0; 
}

.foto-noticia img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.info-noticia { 
  display: flex; 
  flex-direction: column; 
  flex: 1; 
  gap: 2px; 
  color: #333; 
}

.titulo-card { 
  font-family: 'Sugo Display', sans-serif; 
  font-size: 1.8rem; 
  margin: 0; 
  color: #25074f; 
}

.subtitulo-card { 
  font-family: 'Ruda', sans-serif; 
  font-size: 1.1rem; 
  font-weight: normal; 
  margin: 0; 
  color: #555; 
}

.meta-dados { 
  font-size: 0.85rem; 
  color: #890d8e; 
  margin-top: 4px; 
  font-weight: bold; 
}

@media (max-width: 768px) {
  .card-horizontal { 
    flex-direction: column; 
    text-align: center; 
    padding: 20px;
  }
  .foto-noticia { 
    width: 100%; 
    height: 180px;
  }
}
</style>