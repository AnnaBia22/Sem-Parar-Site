<script setup>
import { ref, onMounted } from 'vue';
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'; 
import LoadingStatus from '../components/loading.vue' 
import axios from 'axios'

const urlBase = 'http://localhost:1337';
const apiEndpoint = '/api/pagina-curso?populate[lista_cursos][populate]=*';

const cursos = ref([]);
const loading = ref(true);
const erro = ref(null);

// LOCAL: Dentro do <script setup>
const getImagemUrl = (curso) => {
  // Tenta encontrar o campo de imagem por vários nomes possíveis
  const imgObj = curso.icon || curso.icone || curso.logo || curso.imagem;
  
  if (!imgObj) return null;

  // Tenta extrair a URL de todos os formatos que o Strapi costuma enviar
  const url = imgObj.url || 
              imgObj.data?.url || 
              imgObj.data?.attributes?.url || 
              imgObj.attributes?.url;

  if (url) {
    return url.startsWith('http') ? url : `${urlBase}${url}`;
  }
  return null;
};

const fetchCursos = async () => {
  try {
    let req = await fetch(`${urlBase}${apiEndpoint}`);
    
    if (req.status === 404) {
      req = await fetch(`${urlBase}/api/pagina-cursos?populate[lista_cursos][populate]=*`);
    }

    if (!req.ok) throw new Error(`Erro API: ${req.status}`);
    const res = await req.json();
    
    if (res.data && res.data.lista_cursos) {
        cursos.value = res.data.lista_cursos;
    } else if (res.data && res.data.attributes && res.data.attributes.lista_cursos) {
        cursos.value = res.data.attributes.lista_cursos;
    } else {
        erro.value = "Dados não encontrados.";
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
  text-align: center;
}

.subtitulo {
  color: #1b1814;
  margin-bottom: 70px; 
  font-size: 1.1rem;
}

.aviso { margin: 20px; color: #676464; }

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
  padding: 0 40px; 
  display: flex;
  align-items: center;
  justify-content: center; 
  gap: 30px; 
  text-decoration: none;
  box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.25);
  box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  position: relative;
  
  /* 🔥 ALTERAÇÃO: Curso 5px mais para cima */
  margin-top: -5px; 
}

.card:hover {
  transform: translateY(-10px); /* Aumentado o hover para compensar o margin negativo */
  border-color: #890d8e;
  box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.25);
  z-index: 10;
}

.icon-box { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.icon-img { 
  width: 80px; 
  height: 80px; /* Definido altura fixa para garantir que apareça bem ao lado do texto */
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

@media (max-width: 768px) {
  .grid-cursos {
    grid-template-columns: 1fr; 
  }
  .card {
    min-height: 140px; 
    padding: 0 20px;
    margin-top: 0; /* No mobile remove o margin negativo se desejar padrão */
  }
  .titulo-principal {
    font-size: 2rem;
  }
}
</style>