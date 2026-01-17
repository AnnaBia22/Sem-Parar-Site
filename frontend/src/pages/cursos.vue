<script setup>
import { ref, onMounted } from 'vue';
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'; 
import LoadingStatus from '../components/loading.vue' 

const urlBase = 'http://localhost:1337';
// Endpoint com populate profundo para garantir que o 'icon' venha com a 'url'
const apiEndpoint = '/api/pagina-curso?populate[lista_cursos][populate][icon][populate]=*';

const cursos = ref([]);
const loading = ref(true);
const erro = ref(null);

// Função para extrair a URL da imagem do objeto do Strapi
const getImagemUrl = (curso) => {
  if (!curso || !curso.icon) return null;
  
  // Acessa o caminho data -> attributes -> url (padrão do Strapi v4/v5)
  const path = curso.icon.data?.attributes?.url || curso.icon.url || curso.icon.data?.url;

  if (!path) return null;
  return path.startsWith('http') ? path : `${urlBase}${path}`;
};

const fetchCursos = async () => {
  try {
    const req = await fetch(`${urlBase}${apiEndpoint}`);
    if (!req.ok) throw new Error(`Erro API: ${req.status}`);
    
    const res = await req.json();
    // Extrai a lista de cursos tratando a estrutura do Single Type
    const dados = res.data?.attributes?.lista_cursos || res.data?.lista_cursos;
    cursos.value = dados || [];
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    erro.value = "Erro ao carregar os dados.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCursos();
});
</script>

<template>
  <div class="main-wrapper">
    <Header />
    <LoadingStatus v-if="loading" />
    <div v-else class="page-container">
      <h1 class="titulo-principal">CURSOS</h1>
      <p class="subtitulo">Conheça as matérias em que temos cursos disponíveis focados em olimpíadas!</p>

      <div v-if="erro" class="aviso erro">⚠️ {{ erro }}</div>
      
      <div v-else class="grid-cursos">
        <div v-for="curso in cursos" :key="curso.id" class="card-wrapper">
          <a :href="curso.link_pag" class="card">
            <div class="icon-box">
              <img 
                v-if="getImagemUrl(curso)" 
                :src="getImagemUrl(curso)" 
                alt="Logo do curso" 
                class="icon-img"
              />
            </div>
            <h2 class="nome-curso">{{ curso.nome_curso }}</h2>
          </a>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-container {
  flex: 1;
  max-width: 1200px; 
  width: 100%;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
  font-family: 'Arial', sans-serif; 
}

.titulo-principal {
  font-family: 'Sugo Display', sans-serif;
  color: #ff9a16;
  font-size: 2.8rem;
  margin: 0 0 25px 0; 
}

.subtitulo {
  color: #1b1814;
  margin-bottom: 70px; 
  font-size: 1.1rem;
}

.grid-cursos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px; 
  row-gap: 50px;    
  width: 100%;
  box-sizing: border-box;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card {
  width: 100%;
  box-sizing: border-box;
  background: #fffdfc;
  border: 1px solid #e0e0e0;
  border-radius: 30px; 
  min-height: 180px; 
  padding: 0 50px; 
  
  /* Alinhamento Horizontal (Ícone e depois Texto) */
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha tudo à esquerda */
  gap: 30px; /* Espaço entre a logo e o texto */
  
  text-decoration: none;
  box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  position: relative;

  /* Alteração solicitada: 5px para cima */
  margin-top: -5px; 
}

.card:hover {
  transform: translateY(-10px);
  border-color: #890d8e;
}

.icon-box { 
  display: flex; 
  align-items: center; 
  justify-content: center;
  width: 100px;
  height: 100px;
  flex-shrink: 0; /* Impede o ícone de amassar */
}

.icon-img { 
  width: 100%;
  height: 100%;
  object-fit: contain; 
}

.nome-curso {
  color: #800080;
  font-size: 1.8rem; 
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 0.5px;
  text-align: left; /* Alinha o texto à esquerda */
}

@media (max-width: 768px) {
  .grid-cursos {
    grid-template-columns: 1fr; 
  }
  .card {
    min-height: 140px; 
    padding: 0 20px;
    margin-top: 0;
    justify-content: center; /* No mobile pode centralizar se preferir */
  }
}
</style>