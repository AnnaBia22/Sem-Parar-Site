<script setup>
import { ref, onMounted } from 'vue';
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'; 

const urlBase = 'http://localhost:1337';
const apiEndpoint = '/api/pagina-curso?populate[lista_cursos][populate]=*'; 

const cursos = ref([]);
const loading = ref(true);
const erro = ref(null);

const getImagemUrl = (icone) => {
  if (!icone) return null;

  let url = null;

  if (Array.isArray(icone) && icone.length > 0) {
    url = icone[0].url;
  } 
  else if (icone.data) {
    if (Array.isArray(icone.data) && icone.data.length > 0) {
        url = icone.data[0].attributes.url;
    } else if (icone.data.attributes) {
        url = icone.data.attributes.url;
    }
  }
  else if (icone.url) {
    url = icone.url;
  }

  if (url) {
    if (url.startsWith('http')) return url;
    return `${urlBase}${url}`;
  }

  return null;
};

const fetchCursos = async () => {
  try {
    const req = await fetch(`${urlBase}${apiEndpoint}`);
    if (!req.ok) throw new Error(`Erro API: ${req.status}`);
    const res = await req.json();
    
    if (res.data) {
        const lista = res.data.attributes?.lista_cursos || res.data.lista_cursos;
        if (lista) cursos.value = lista;
    } 

  } catch (error) {
    console.error("Erro:", error);
    erro.value = "Erro ao carregar.";
  } finally {
    setTimeout(() => { loading.value = false; }, 500);
  }
};

onMounted(() => {
  fetchCursos();
});
</script>

<template>
  <div class="main-wrapper">
    <Header />
    <div class="page-container">
      <h1 class="titulo-principal">CURSOS</h1>
      <p class="subtitulo">Conheça as matérias em que temos cursos disponíveis focados em olimpíadas!</p>

      <div v-if="loading" class="loader-container">
        <div class="spinner"></div>
        <p class="loading-text">Carregando...</p>
      </div>
      
      <div v-else-if="erro" class="aviso erro">⚠️ {{ erro }}</div>

      <div v-else class="grid-cursos">
        <div v-for="curso in cursos" :key="curso.id" class="card-wrapper">
          <a :href="curso.link_pag" class="card">
            
            <div class="icon-box">
              <img 
                v-if="getImagemUrl(curso.icon)" 
                :src="getImagemUrl(curso.icon)" 
                alt="icone" 
                class="icon-img"
              />
              <span v-else class="icon-placeholder">📚</span>
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
/* Layout Global */
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

/* Tipografia */
.titulo-principal {
  color: #ff9900;
  font-size: 3rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 0px;
  letter-spacing: 1px;
}

.subtitulo {
  color: #1b1814;
  margin-bottom: 70px;
  font-size: 1.1rem;
}

/* Loader */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ff9900;
  border-top: 5px solid #800080;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-text {
  color: #890d8e;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Tratamento de Erro */
.aviso.erro {
    color: red;
    font-weight: bold;
    background: #fff0f0;
    padding: 20px;
    border-radius: 10px;
    display: inline-block;
}

/* Grid */
.grid-cursos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;
  row-gap: 50px;
  width: 100%;
  box-sizing: border-box;
}

/* Card Wrapper */
.card-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Card */
.card {
  width: 100%;
  box-sizing: border-box;
  background: #fffdfc;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  min-height: 180px; 
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  text-decoration: none;
  box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  position: relative;
}

.card:hover {
  transform: translateY(-5px);
  border-color: #8a0d8e25;
  box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.25);
  z-index: 10;
}

/* Elementos internos */
.icon-box { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.icon-img { 
  width: 80px;
  height: auto; 
  object-fit: contain; 
}

.icon-placeholder { font-size: 50px; }

.nome-curso {
  color: #800080;
  font-size: 1.8rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 0.5px;
}

/* Responsividade */
@media (max-width: 768px) {
  .grid-cursos {
    grid-template-columns: 1fr;
  }
  .card {
    min-height: 140px;
    padding: 0 20px;
  }
  .titulo-principal {
    font-size: 2rem;
  }
}
</style>