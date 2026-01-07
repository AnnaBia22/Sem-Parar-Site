<script setup>
import { ref, onMounted } from 'vue';
import Footer from '../components/footer.vue';

const dadosHome = ref(null);
const carregando = ref(true);
const erro = ref(null);
const STRAPI_URL = 'http://localhost:1337';

const buscarDados = async () => {
  try {
    // CORREÇÃO: Removi o asterisco do menu também para evitar conflitos.
    // Usamos populate=* dentro do menu para garantir que traga link e texto.
    const query = [
      '?populate[menu_navegacao][populate]=*', 
      '&populate[banner_destaques][populate]=imagem',
      '&populate[cursos_abertos][populate]=icon',
      '&populate[lista_depoimentos][populate]=foto_aluna',
      '&populate[Logo][fields]=url'
    ].join('');
    
    const resposta = await fetch(`${STRAPI_URL}/api/home${query}`);
    
    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      throw new Error(`Erro API: ${resposta.status} - ${erroTexto}`);
    }

    const json = await resposta.json();
    dadosHome.value = json.data.attributes;
  } catch (e) {
    console.error("Erro detalhado:", e);
    erro.value = `Ocorreu um erro: ${e.message}`;
  } finally {
    carregando.value = false;
  }
};

const getImgUrl = (midia) => {
  if (!midia || !midia.data) return '';
  if (Array.isArray(midia.data)) {
      if (midia.data.length > 0) return `${STRAPI_URL}${midia.data[0].attributes.url}`;
      return '';
  }
  if (midia.data && midia.data.attributes) {
      return `${STRAPI_URL}${midia.data.attributes.url}`;
  }
  return '';
};

onMounted(() => {
  buscarDados();
});
</script>

<template>
  <div class="landing-page">

    <div v-if="carregando" class="aviso carregando">
      🔄 Buscando dados do site...
    </div>

    <div v-else-if="erro" class="aviso erro">
      <h3>❌ Algo deu errado!</h3>
      <p>{{ erro }}</p>
      <p style="font-size: 0.8rem; margin-top: 10px;">Dica: Verifique se o Strapi está rodando e se o conteúdo está Publicado.</p>
    </div>

    <div v-else-if="dadosHome">
      
      <header>
        <div class="container header-content">
          <div class="logo-area">
            <img v-if="dadosHome.Logo" class="logo" :src="getImgUrl(dadosHome.Logo)" alt="Logo Projeto Sem Parar">
          </div>
          
          <nav>
            <ul class="nav-list">
              <li v-for="item in dadosHome.menu_navegacao" :key="item.id" class="nav-item">
                <a :href="item.url">{{ item.texto }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section class="hero">
        <div class="container">
          <div class="banner-container" v-if="dadosHome.banner_destaques && dadosHome.banner_destaques.length > 0">
            <img class="banner-img" :src="getImgUrl(dadosHome.banner_destaques[0].imagem)" alt="Banner Destaque">
          </div>
          
          <p class="hero-text">
            {{ dadosHome.texto_intro }}
          </p>
        </div>
      </section>

      <section class="inscricoes">
        <div class="container"> 
          <h2 class="section-title text-orange">Inscrições abertas</h2>
          
          <div class="cards-container">
            <div v-for="curso in dadosHome.cursos_abertos" :key="curso.id" class="card">
              <img :src="getImgUrl(curso.icon)" class="card-icon-img" style="width: 50px; height: 50px; object-fit: contain;">
              
              <div class="card-content">
                <span class="card-title">{{ curso.nome_curso }}</span>
                <a :href="curso.link_pag" class="btn-curso">VER MAIS</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="depoimentos">
        <div class="container">
          <div class="depoimentos-header">
            <h2 class="title-orange">DEPOIMENTOS</h2>
            <h2 class="title-purple">DE ALUNAS</h2>
          </div>

          <div class="carousel-container">
            <div class="content-wrapper" v-if="dadosHome.lista_depoimentos && dadosHome.lista_depoimentos.length > 0">
              <img class="foto-aluna" :src="getImgUrl(dadosHome.lista_depoimentos[0].foto_aluna)" alt="Foto da Aluna">
              <div class="texto-wrapper">
                <p class="testimonial-text">"{{ dadosHome.lista_depoimentos[0].texto_depoimento }}"</p>
                <p class="aluna-nome">- {{ dadosHome.lista_depoimentos[0].nome_aluna }}</p>
              </div>
            </div>
             <div v-else>
               <p style="text-align:center">Nenhum depoimento encontrado.</p>
            </div>
          </div>
        </div>

        <div class="decorative-element">
          <div class="img-placeholder deco-img">ELEMENTOS VISUAIS</div>
        </div>
      </section>

    </div>
    
    <Footer />
  </div>
</template>

<style scoped>
/* CSS EXTRA PARA OS AVISOS */
.aviso {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  font-weight: bold;
}
.carregando { color: #25074f; }
.erro { color: red; background-color: #fee; border: 1px solid red; margin: 20px; border-radius: 10px;}

/* --- SEU CSS ORIGINAL CONTINUA ABAIXO --- */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

.landing-page {
  font-family: 'Roboto', sans-serif;
  width: 100%;
  background-color: #fffff5;
}

/* ... O RESTO DO SEU CSS ... */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
/* ... (Mantenha o resto do seu CSS aqui) */
/* --- HEADER --- */
header {
  padding: 20px 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 400px;
  max-width: 100%;
  margin-bottom: 0px;
  object-fit: contain;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 15px;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
}
.nav-item a {
  background-color: #25074f;
  color: #fffff5;
  text-decoration: none;
  width: 200px; 
  height: 45px; 
  display: flex; 
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1rem;
  transition: background 0.3s;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  text-align: center;
}

.nav-item a:hover {
  background-color: #3e0c85;
}

/* --- HERO SECTION --- */
.hero {
  padding: 20px 0;
  text-align: center;
}

.banner-img {
  width: 100%;
  max-width: 1200px;
  object-fit: cover;
  margin-bottom: 30px;
}

.hero-text {
  color: #1b1814;
  font-size: 1rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
}

/* --- INSCRIÇÕES (FULL WIDTH) --- */
.inscricoes {
  background-color: #25074f;
  padding: 1px 0px 70px 0px;
  margin-top: 10px;
  width: 100%;
}

.text-orange {
  color: #ff9a16;
  margin-bottom: 30px;
  font-size: 3.5rem;
  text-align: center;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.card {
  background: #fffff5;
  border-radius: 15px;
  padding: 15px 40px;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon-img {
    margin-right: 15px;
}

.card-title {
  color: #890d8e;
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
}

/* --- DEPOIMENTOS --- */
.depoimentos {
  padding: 60px 0;
  position: relative;
  overflow: hidden; 
}

.depoimentos-header {
  margin-bottom: 30px;
  padding-left: 50px;
}

@media (max-width: 768px) {
  .depoimentos-header {
    padding-left: 0;
    text-align: center;
  }
}

.title-orange {
  color: #ff9900;
  font-size: 3.5rem;
  margin: 0;
  line-height: 1;
}

.title-purple {
  color: #800080;
  font-size: 3.5rem;
  margin-left: 100px;
  margin-top: 0px;
  font-weight: 900;
  text-transform: uppercase;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.content-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
  max-width: 900px;
}

.foto-aluna {
  width: 300px;
  border-radius: 30px;
  object-fit: cover;
  flex-shrink: 0;
}

.testimonial-text {
  color: #1b1814;
  line-height: 1.6;
  font-size: 1rem;
  text-align: left;
}
.btn-curso {
    display:block; 
    margin-top:5px; 
    font-weight:bold; 
    color: #890d8e;
    text-decoration: none;
    font-size: 0.8rem;
}

/* Elemento decorativo */
.decorative-element {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
}

.deco-img {
  width: 150px;
  height: 150px;
  border-radius: 0 100% 0 0;
}

/* Responsividade Mobile */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    text-align: center;
  }
  
  .testimonial-text {
    text-align: center;
  }
  
  .nav-list {
    flex-direction: column;
    width: 100%;
  }
  
  .nav-item a {
    width: 100%; 
    max-width: 300px; 
  }
  
  .title-orange, .title-purple {
    font-size: 2rem;
  }
}
</style>