<template>
  <div class="page-container">
    <header class="header-simples">
      <router-link to="/" class="link-voltar">⬅ Voltar para Home</router-link>
    </header>

    <main class="content">
      <div v-if="carregando" class="loading">
        <p>Carregando cursos...</p>
      </div>

      <div v-else-if="erro" class="error">
        <p>{{ erro }}</p>
      </div>

      <div v-else-if="dadosPage" class="cursos-wrapper">
        <h1 class="page-title">
          {{ dadosPage.attributes.titulo || 'Nossos Cursos' }}
        </h1>

        <div class="cursos-grid">
          <div 
            v-for="curso in dadosPage.attributes.lista_cursos" 
            :key="curso.id" 
            class="curso-card"
          >
            <div class="card-icon" v-if="curso.icon && curso.icon.data">
              <img 
                :src="`${STRAPI_URL}${curso.icon.data.attributes.url}`" 
                :alt="curso.titulo" 
              />
            </div>

            <div class="card-content">
              <h3>{{ curso.titulo }}</h3>
              <p>{{ curso.descricao }}</p>
              
              <a 
                v-if="curso.link" 
                :href="curso.link" 
                target="_blank" 
                class="btn-curso"
              >
                Acessar
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Footer from '../components/footer.vue'; // Verifique se o caminho está certo

// --- VARIÁVEIS ---
const dadosPage = ref(null);
const carregando = ref(true);
const erro = ref(null);
const STRAPI_URL = 'http://localhost:1337';

// --- BUSCAR DADOS ---
const buscarDados = async () => {
  try {
    // Ajuste da query para popular a lista e o ícone dentro da lista
    // IMPORTANTE: Verifique no Strapi se o nome do componente repetível é 'lista_cursos'
    const query = '?populate[lista_cursos][populate]=icon';
    
    // Ajustado para '/api/cursos' conforme sua solicitação
    const resposta = await fetch(`${STRAPI_URL}/api/cursos${query}`);

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    const json = await resposta.json();
    
    // O Strapi retorna { data: { attributes: ... } } para Single Types
    dadosPage.value = json.data;

  } catch (e) {
    console.error(e);
    erro.value = 'Não foi possível carregar os cursos. Verifique sua conexão ou o Strapi.';
  } finally {
    carregando.value = false;
  }
};

onMounted(() => {
  buscarDados();
});
</script>

<style scoped>
/* Container Principal */
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif; /* Use a fonte do seu projeto */
  background-color: #f9f9f9;
}

.header-simples {
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.link-voltar {
  text-decoration: none;
  color: #6a1b9a; /* Cor roxa do tema */
  font-weight: bold;
}

.content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
  box-sizing: border-box;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 2rem;
}

/* Grid Layout */
.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

/* Card do Curso */
.curso-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.curso-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

/* Ícone */
.card-icon img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 20px;
}

.card-content h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.card-content p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

/* Botão */
.btn-curso {
  display: inline-block;
  padding: 10px 20px;
  background-color: #6a1b9a;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-top: auto; /* Empurra o botão para o final */
  transition: background 0.3s;
}

.btn-curso:hover {
  background-color: #4a148c;
}

/* Loading e Error */
.loading, .error {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
}
</style>