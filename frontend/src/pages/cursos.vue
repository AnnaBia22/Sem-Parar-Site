<script setup>
import { ref, onMounted } from 'vue';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';

const urlBase = 'http://localhost:1337';
// Populate profundo para garantir que a imagem venha
const apiEndpoint = '/api/pagina-curso?populate[lista_cursos][populate]=*'; 

const cursos = ref([]);
const loading = ref(true);
const erro = ref(null);

// --- FUNÇÃO CORRETORA DE IMAGENS ---
// Essa função resolve o problema do aninhamento (data.attributes)
const getImagemUrl = (icone) => {
  if (!icone) return null;

  // Caso 1: Strapi v4 Padrão (dentro de data -> attributes)
  if (icone.data && icone.data.attributes) {
    return `${urlBase}${icone.data.attributes.url}`;
  }
  
  // Caso 2: Strapi v5 ou achatado (direto na url)
  if (icone.url) {
    return `${urlBase}${icone.url}`;
  }

  return null;
};

const fetchCursos = async () => {
  try {
    let req = await fetch(`${urlBase}${apiEndpoint}`);
    
    // Fallback Singular/Plural
    if (req.status === 404) {
      req = await fetch(`${urlBase}/api/pagina-cursos?populate[lista_cursos][populate]=*`);
    }

    if (!req.ok) throw new Error(`Erro API: ${req.status}`);
    
    const res = await req.json();
    
    // Processamento da resposta (v4 vs v5)
    if (res.data && res.data.lista_cursos) {
        cursos.value = res.data.lista_cursos;
    } else if (res.data && res.data.attributes && res.data.attributes.lista_cursos) {
        cursos.value = res.data.attributes.lista_cursos;
    } else {
        erro.value = "Dados não encontrados.";
    }

  } catch (error) {
    console.error("Erro:", error);
    erro.value = "Falha na conexão com o Strapi.";
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
    <div class="page-container">
      <h1 class="titulo-principal">CURSOS</h1>
      <p class="subtitulo">Conheça as matérias em que temos cursos disponíveis focados em olimpíadas!</p>

      <div v-if="loading" class="aviso">🔄 Carregando...</div>
      <div v-else-if="erro" class="aviso erro">⚠️ {{ erro }}</div>
      
      <div v-else class="grid-cursos">
        <div v-for="curso in cursos" :key="curso.id" class="card-wrapper">
          
          <a :href="curso.link_pag" class="card">
            <div class="icon-box">
               <img 
                v-if="getImagemUrl(curso.icon)" 
                :src="getImagemUrl(curso.icon)" 
                alt="" 
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
/* Layout para garantir que o footer fique no final */
.main-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-container {
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
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
  margin-bottom: 60px;
  font-size: 1.1rem;
}

.aviso { margin: 20px; color: #676464; }

/* Grid */
.grid-cursos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 50px;
  width: 100%;
  box-sizing: border-box; /* Garante que o grid respeite limites */
}

/* Card Wrapper */
.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
}

/* O Card em si */
.card {
  width: 100%;
  box-sizing: border-box; /* 🚨 CORREÇÃO CRUCIAL: Padding fica 'dentro' da largura */
  background: #fffdfc;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  height: 90px;
  position: relative; /* Necessário para z-index funcionar no hover */
}

.card:hover {
  transform: translateY(-3px);
  border-color: #800080;
  box-shadow: 0 6px 15px rgba(128, 0, 128, 0.15);
  z-index: 10; /* Evita que o card fique "atrás" de vizinhos ao mover */
}

/* Elementos internos do card */
.icon-box { display: flex; align-items: center; justify-content: center; width: 40px; }
.icon-img { width: 40px; height: auto; object-fit: contain; }
.icon-placeholder { font-size: 24px; }

.nome-curso {
  color: #800080;
  font-size: 1.5rem;
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
  .titulo-principal {
    font-size: 2rem;
  }
}
</style>