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

    <section v-if="temEquipe" class="secao-time">
      <h2 class="titulo-laranja">NOSSO TIME</h2>
      
      <div v-for="secao in secoesEquipe" :key="secao.id" class="subsecao-materia">
        <h3 class="titulo-roxo">{{ secao.label }}</h3>
        
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
      </div>
    </section>

    <section v-if="secaoLegados" class="secao-time">
      <h2 class="titulo-laranja">LEGADOS</h2>
      <div class="grid-membros">
        <div v-for="membro in secaoLegados.membros" :key="membro.id" class="polaroid-container">
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

const baseUrl = "https://sem-parar-back.onrender.com"
const voluntarias = ref([])
const loading = ref(true)

const dataIntro = {

  titulo: "QUEM SOMOS",

  descricao: [

    "O Sem Parar nasceu em 2018 a partir do sonho de meninas do Ensino Médio que acreditavam na educação e na ciência como caminhos de transformação. Inicialmente voltado para a preparação de meninas para olimpíadas de Matemática, especialmente de escolas públicas do interior do Ceará e de Fortaleza, o projeto cresceu ao longo dos anos e, em 2020, migrou para o formato on-line, ampliando seu alcance para todo o Brasil.",



    "Guiado pelo lema “meninas ensinando meninas”, o Sem Parar oferece cursos gratuitos preparatórios para olimpíadas científicas em diversas áreas do conhecimento. Por meio de aulas, materiais didáticos, listas de exercícios, simulados e uma grande comunidade colaborativa, buscamos fortalecer a representatividade feminina em um espaço historicamente masculino, promovendo pertencimento, acolhimento e excelência acadêmica.",



    "Hoje, o projeto é formado por um time de mais de 30 voluntárias, todas meninas, atuando nas áreas de Astronomia, Biologia, Física, Informática, Matemática e Química. Desde 2020, já impactamos mais de 3000 alunas e conquistamos centenas de premiações, incluindo participações e medalhas em olimpíadas nacionais e internacionais. Em algumas edições de olimpíadas internacionais femininas, como a EGMO e a EGOI, equipes brasileiras foram compostas 100% por alunas e voluntárias do Sem Parar.",



    "Seguimos construindo pontes entre regiões, saberes e sonhos, estimulando o protagonismo feminino nas ciências e abrindo caminhos para novos futuros.",

   

    "Conheça as voluntárias que fazem tudo isso acontecer nas mais diversas áreas."

  ]

}



const nomesCategorias = {
  Administracao: "ADMINISTRAÇÃO",
  Desenvolvedoras: "DESENVOLVEDORAS",
  Informatica: "INFORMÁTICA",
  Matematica: "MATEMÁTICA",
  Fisica: "FÍSICA",
  Biologia: "BIOLOGIA",
  Quimica: "QUÍMICA",
  Astronomia: "ASTRONOMIA",
  Midia: "MÍDIA",
  Legados: "LEGADOS"
}

onMounted(async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/voluntarias?populate=*&pagination[pageSize]=100`)
    voluntarias.value = Array.isArray(res.data.data) ? res.data.data : []
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
  } finally {
    loading.value = false
  }
})

const todasSecoes = computed(() => {
  const categoriasOrdem = ['Administracao', 'Desenvolvedoras', 'Informatica', 'Matematica', 'Fisica', 'Biologia', 'Quimica', 'Astronomia', 'Midia', 'Legados']
  
  return categoriasOrdem.map(cat => {
    const membros = voluntarias.value.filter(v => {
      const c = v.attributes?.categoria || v.categoria
      return c?.toLowerCase().trim() === cat.toLowerCase().trim()
    }).map(m => {
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
    return { id: cat, label: nomesCategorias[cat], membros }
  }).filter(s => s.membros.length > 0)
})

const secoesEquipe = computed(() => todasSecoes.value.filter(s => s.id !== 'Legados'))
const secaoLegados = computed(() => todasSecoes.value.find(s => s.id === 'Legados'))
const temEquipe = computed(() => secoesEquipe.value.length > 0)
</script>

<style scoped>
.container {
  flex: 1;
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  padding: 40px 60px 40px; 
  box-sizing: border-box;
  font-family: 'Ruda', sans-serif;
}

.intro {
  text-align: center;
  margin-bottom: 60px;
}

.titulo-principal {
  font-family: 'Sugo Display', sans-serif;
  color: #ff9a16;
  font-size: 2.8rem;
  margin: 0 0 25px 0; 
  text-align: center;
}

.descricao-box {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: #444;
}

.secao-time { margin-bottom: 80px; }
.subsecao-materia { margin-bottom: 60px; }

.titulo-laranja {
  font-family: 'Sugo Display', sans-serif;
  color: #ff9a16;
  font-size: 2.8rem;
  margin-bottom: 30px;
  text-transform: uppercase;
  text-align: left;
}

.titulo-roxo {
  font-family: 'Sugo Display', sans-serif;
  color: #890d8e;
  font-size: 1.8rem;
  margin: 0 0 30px 40px;
  display: block;
  text-transform: uppercase;
}


.grid-membros {
  display: flex;
  flex-wrap: wrap;       /* ESSENCIAL: permite que as imagens desçam para a próxima linha */
  gap: 40px;
  justify-content: center; /* Centraliza as imagens dentro do grid */
  max-width: 1080px;      /* (240px * 4) + (40px * 3) = limita a 4 por linha */
  margin: 0 auto;        /* Centraliza o bloco inteiro do grid na página e remove a margem lateral */
  width: 100%;
}

.polaroid-container {
  width: 240px;
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
}

.polaroid-container:hover .card-flip { transform: rotateY(180deg); }

.card-front, .card-back {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  backface-visibility: hidden;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.card-front { background: #ebebeb; display: flex; flex-direction: column; }

.foto-placeholder {
  background: #FFFFFF;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin-bottom: 15px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.foto-placeholder img { width: 100%; height: 100%; object-fit: cover; }

.info-membro { text-align: center; }
.nome { font-family: 'Sugo Display', sans-serif; color: #25074f; font-weight: bold; display: block; font-size: 1.1rem; }
.cargo { font-size: 0.8rem; color: #555; display: block; margin-top: 5px; font-style: italic; }

/* 4. AJUSTES NO VERSO DO CARD */
.card-back {
  background: #f8f8f8;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo-bio {
  font-family: 'Sugo Display', sans-serif;
  color: #890d8e;
  margin-bottom: 5px;
  margin-top: 0;
  font-size: 1.4rem;
  border-bottom: 2px solid #ff9a16;
  flex-shrink: 0; /* Não deixa o título achatar */
}

.texto-bio { 
  font-size: 0.9rem; 
  line-height: 1.5; 
  color: #333; 
  padding: 0 5px;
  overflow-y: auto; /* Habilita rolagem */
  width: 100%;
  text-align: center;
}

/* Scrollbar personalizada discreta */
.texto-bio::-webkit-scrollbar { width: 4px; }
.texto-bio::-webkit-scrollbar-thumb { background: #ff9a16; border-radius: 10px; }

@media (max-width: 768px) {
  .titulo-roxo { margin-left: 10px; font-size: 1.5rem; }
  .grid-membros { justify-content: center; }
  .titulo-laranja { text-align: center; }
}
</style>