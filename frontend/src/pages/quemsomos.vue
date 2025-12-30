<template>
  <Header />

  <LoadingStatus v-if="loading" />

  <main class="container" v-else>
    <section v-if="dataIntro" class="intro">
      <h1 class="titulo-principal">{{ dataIntro.titulo }}</h1>
      <div class="descricao-box">
        <p v-for="(p, i) in dataIntro.descricao" :key="i">{{ p }}</p>
      </div>
    </section>

    <section v-for="secao in secoesDinamicas" :key="secao.id" class="secao-time">
      
      <h2 v-if="secao.tipoTitulo === 'laranja'" class="titulo-laranja">
        {{ secao.id === 'Coordenadoras' ? 'NOSSO TIME' : 'LEGADOS' }}
      </h2>
      
      <h3 :class="secao.tipoTitulo === 'laranja' ? 'titulo-roxo' : 'titulo-materia-roxo'">
        {{ secao.label }}
      </h3>
      
      <div class="grid-membros">
        <div v-for="membro in secao.membros" :key="membro.id" class="polaroid-container">
          <div class="card-flip">
            <div class="card-front">
              <div class="foto-placeholder">
                <img :src="membro.foto" :alt="membro.nome">
              </div>
              <div class="info-membro">
                <span class="nome">{{ membro.nome }}</span>
                <span class="cargo">{{ membro.cargo }}</span>
              </div>
            </div>

            <div class="card-back">
              <h4 class="titulo-bio">Bio</h4>
              <p class="texto-bio">{{ membro.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <Footer />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import LoadingStatus from '../components/loading.vue'
import axios from 'axios'

const baseUrl = "http://localhost:1337"
const voluntarias = ref([])
const loading = ref(true)

const dataIntro = {
  titulo: "QUEM SOMOS",
  descricao: [
    "O projeto Sem Parar é uma iniciativa dedicada a empoderar meninas nas ciências.",
    "Conheça as voluntárias que fazem tudo isso acontecer nas mais diversas áreas."
  ]
}

const nomesCategorias = {
  Coordenadoras: "COORDENADORAS GERAIS",
  Informatica: "INFORMÁTICA",
  Matematica: "MATEMÁTICA",
  Fisica: "FÍSICA",
  Biologia: "BIOLOGIA",
  Quimica: "QUÍMICA",
  Astronomia: "ASTRONOMIA",
  Legados: "LEGADOS"
}

onMounted(async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/voluntarias?populate=*`)
    console.log("Dados da API:", res.data.data)
    voluntarias.value = Array.isArray(res.data.data) ? res.data.data : []
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
  } finally {
    loading.value = false
  }
})

const secoesDinamicas = computed(() => {
  if (!voluntarias.value.length) return []

  const categoriasOrdem = ['Coordenadoras', 'Informatica', 'Matematica', 'Fisica', 'Biologia', 'Quimica', 'Astronomia', 'Legados']

  return categoriasOrdem.map(cat => {
    const membrosFiltrados = voluntarias.value.filter(v => {
      const c = v.attributes?.categoria || v.categoria
      return c?.toLowerCase().trim() === cat.toLowerCase().trim()
    }).map(m => {
      // Extração segura de dados
      const attr = m.attributes || m
      let bioTexto = "Bio não informada."
      
      if (attr.bio) {
        if (typeof attr.bio === 'string') bioTexto = attr.bio
        else if (Array.isArray(attr.bio)) bioTexto = attr.bio[0]?.children?.[0]?.text || bioTexto
      }

      const imgUrl = attr.imagem?.data?.attributes?.url || attr.imagem?.url

      return {
        id: m.id,
        nome: attr.nome || "Sem nome",
        cargo: attr.cargo || "Voluntária",
        bio: bioTexto,
        foto: imgUrl ? `${baseUrl}${imgUrl}` : "https://via.placeholder.com/240"
      }
    })

    return {
      id: cat,
      label: nomesCategorias[cat],
      tipoTitulo: (cat === 'Coordenadoras' || cat === 'Legados') ? 'laranja' : 'roxo',
      membros: membrosFiltrados
    }
  }).filter(s => s.membros.length > 0)
})
</script>

<style scoped>
.container {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Ruda', sans-serif;
}

.intro {
  text-align: center;
  margin-bottom: 60px;
}

.titulo-principal, .titulo-laranja, .titulo-roxo, .titulo-bio, .nome {
  font-family: 'Sugo Display', sans-serif;
}

.titulo-principal {
  color: #ff9a16;
  font-size: 2.8rem;
  margin-bottom: 25px;
}

.secao-time {
  text-align: left;
  margin-bottom: 80px;
}

.titulo-laranja {
  color: #ff9a16;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.titulo-roxo {
  color: #890d8e;
  font-size: 1.8rem;
  margin: 0 0 40px 50px;
  display: block;
}

/* GRID AJUSTADO */
.grid-membros {
  display: grid;
  /* Usamos auto-fill e definimos um tamanho fixo para o card não esticar */
  grid-template-columns: repeat(auto-fill, 240px); 
  gap: 40px;
  justify-content: flex-start; /* Alinha os cards à esquerda na seção */
}

/* CONTAINER DO GIRO */
.polaroid-container {
  width: 240px; /* Largura idêntica ao grid column */
  height: 360px;
  perspective: 1000px;
  cursor: pointer;
}

.card-flip {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  transform-origin: center center; /* Garante o eixo no meio */
}

.polaroid-container:hover .card-flip {
  transform: rotateY(180deg);
}

/* ESTILIZAÇÃO DAS FACES */
.card-front, .card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Suporte para Safari */
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Garante que padding não mude o tamanho total */
}

.card-front {
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  z-index: 2;
  transform: rotateY(0deg); /* Ponto de partida */
}

.foto-placeholder {
  background: #FFFFFF;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin-bottom: 15px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.foto-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-membro {
  text-align: center;
}

.nome {
  color: #25074f;
  font-weight: bold;
  display: block;
  font-size: 1.1rem;
}

.cargo {
  font-family: 'Ruda', sans-serif;
  font-size: 0.8rem;
  color: #555;
  display: block;
  margin-top: 5px;
  font-style: italic;
}

/* VERSO */
.card-back {
  background: #f8f8f8;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.titulo-bio {
  color: #890d8e;
  margin-bottom: 15px;
  font-size: 1.4rem;
  border-bottom: 2px solid #ff9a16;
}

.texto-bio {
  font-family: 'Ruda', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
  padding: 0 5px;
}

@media (max-width: 768px) {
  .titulo-roxo { margin-left: 20px; }
  .grid-membros { 
    justify-content: center; /* Centraliza o grid em telas pequenas */
    grid-template-columns: repeat(auto-fill, 240px);
  }
}
</style>