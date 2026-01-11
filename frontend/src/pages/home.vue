<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Footer from '../components/footer.vue';

// --- VARIÁVEIS DO SISTEMA ---
const dadosHome = ref(null);
const carregando = ref(true);
const erro = ref(null);
const STRAPI_URL = 'http://localhost:1337';

// Controles de Navegação
const indiceDepoimento = ref(0);
const indiceBanner = ref(0);
let bannerTimer = null; // Variável para guardar o "robô" do banner

// --- BUSCAR DADOS NO STRAPI ---
const buscarDados = async () => {
  try {
    const query = [
      '?populate[menu_navegacao]=*',
      '&populate[banner_destaques][populate]=imagem',
      '&populate[cursos_abertos][populate]=icon',
      '&populate[lista_depoimentos][populate]=foto_aluna',
      '&populate[Logo][fields]=url'
    ].join('');
    
    const resposta = await fetch(`${STRAPI_URL}/api/home${query}`);
    
    if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);

    const json = await resposta.json();
    dadosHome.value = json.data.attributes || json.data;

    // Assim que os dados chegam, ligamos o Banner Automático
    iniciarBannerAutomatico();

  } catch (e) {
    console.error(e);
    erro.value = "Não foi possível carregar o conteúdo.";
  } finally {
    carregando.value = false;
  }
};

// --- FUNÇÃO DE IMAGEM ---
const getImgUrl = (midia) => {
  if (!midia) return '';
  if (midia.url) return `${STRAPI_URL}${midia.url}`;
  if (midia.data && midia.data.attributes) return `${STRAPI_URL}${midia.data.attributes.url}`;
  if (Array.isArray(midia) && midia.length > 0) {
    const item = midia[0];
    if (item.url) return `${STRAPI_URL}${item.url}`;
    if (item.attributes) return `${STRAPI_URL}${item.attributes.url}`;
  }
  return '';
};

// --- LÓGICA DO CARROSSEL DE DEPOIMENTOS ---
const proximoDepoimento = () => {
  if (!dadosHome.value?.lista_depoimentos) return;
  if (indiceDepoimento.value === dadosHome.value.lista_depoimentos.length - 1) {
    indiceDepoimento.value = 0;
  } else {
    indiceDepoimento.value++;
  }
};

const anteriorDepoimento = () => {
  if (!dadosHome.value?.lista_depoimentos) return;
  if (indiceDepoimento.value === 0) {
    indiceDepoimento.value = dadosHome.value.lista_depoimentos.length - 1;
  } else {
    indiceDepoimento.value--;
  }
};

// --- LÓGICA DO BANNER AUTOMÁTICO ---
const proximoBanner = () => {
  if (!dadosHome.value?.banner_destaques) return;
  
  // Lógica circular (se for o último, volta pro zero)
  if (indiceBanner.value === dadosHome.value.banner_destaques.length - 1) {
    indiceBanner.value = 0;
  } else {
    indiceBanner.value++;
  }
};

const iniciarBannerAutomatico = () => {
  // CONFIGURAÇÃO: Troca de imagem a cada 8000 milissegundos (8 segundos)
  // Antes estava 5000 (5 segundos)
  bannerTimer = setInterval(proximoBanner, 8000);
};

// --- CICLO DE VIDA ---
onMounted(() => {
  buscarDados();
});

onUnmounted(() => {
  // Desliga o timer quando sair da página para não gastar memória
  if (bannerTimer) clearInterval(bannerTimer);
});
</script>

<template>
  <div class="landing-page">
    
    <div v-if="carregando" class="loading-state">Carregando...</div>
    
    <div v-if="dadosHome"> 
       
       <header>
        <div class="container header-content">
          <div class="logo-area">
            <img v-if="dadosHome.Logo" class="logo" :src="getImgUrl(dadosHome.Logo)" alt="Logo">
          </div>
          
          <nav>
            <ul class="nav-list">
              <li v-for="item in (dadosHome.menu_navegacao || [])" :key="item.id" class="nav-item">
                <a :href="item.url">{{ item.texto }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section class="hero">
        <div class="container">
          <div class="banner-container" v-if="dadosHome.banner_destaques && dadosHome.banner_destaques.length > 0">
            
            <Transition name="fade" mode="out-in">
              <img 
                :key="indiceBanner" 
                class="banner-img" 
                :src="getImgUrl(dadosHome.banner_destaques[indiceBanner].imagem)" 
                alt="Banner"
              >
            </Transition>
            
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
            <div v-for="card in (dadosHome.cursos_abertos || [])" :key="card.id" class="card">
              <img :src="getImgUrl(card.icon)" class="card-icon-img" style="width: 50px; height: 50px; object-fit: contain;">
              <div class="card-content">
                 <span class="card-title">{{ card.nome_curso }}</span>
                 <a :href="card.link_pag" class="btn-curso">SAIBA MAIS</a>
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
            <button class="arrow-btn" @click="anteriorDepoimento">
              <img src="../assets/images/setaesquerda.png" alt="Anterior">
            </button>
            
            <div class="wrapper-fixo" v-if="dadosHome.lista_depoimentos && dadosHome.lista_depoimentos.length > 0">
              <Transition name="fade" mode="out-in">
                <div class="content-wrapper" :key="indiceDepoimento">
                  <img class="foto-aluna" :src="getImgUrl(dadosHome.lista_depoimentos[indiceDepoimento].foto_aluna)" alt="Foto da Aluna">
                  <div class="texto-wrapper">
                    <p class="testimonial-text">"{{ dadosHome.lista_depoimentos[indiceDepoimento].texto_depoimento }}"</p>
                    <p class="aluna-nome" style="font-weight: bold; margin-top: 10px;">
                        - {{ dadosHome.lista_depoimentos[indiceDepoimento].nome_aluna }}
                    </p>
                    <small style="color: #666; margin-top:5px; display:block;">
                      {{ indiceDepoimento + 1 }} / {{ dadosHome.lista_depoimentos.length }}
                    </small>
                  </div>
                </div>
              </Transition>
            </div>

            <button class="arrow-btn" @click="proximoDepoimento">
              <img src="../assets/images/setadireita.png" alt="Próximo">
            </button>
          </div>
        </div>

        <div class="decorative-element">
          <div class="img-placeholder deco-img">ELEMENTOS</div>
        </div>
      </section>

    </div>
    
    <Footer />
  </div>
</template>

<style scoped>
/* --- CONFIGURAÇÃO DA ANIMAÇÃO SUAVE --- */
.fade-enter-active,
.fade-leave-active {
  /* Aumentado para 1.5s para criar o efeito suave e lento */
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- CONFIGURAÇÕES GERAIS --- */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

.loading-state { text-align: center; padding: 20px; font-weight: bold; color: #666; }

.landing-page {
  font-family: 'Roboto', sans-serif;
  width: 100%;
  background-color: #fffff5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.img-placeholder {
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #aaa;
}

/* --- HEADER --- */
header { padding: 20px 0; }

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

.nav-item a:hover { background-color: #3e0c85; }

/* --- HERO SECTION --- */
.hero { padding: 20px 0; text-align: center; }

.banner-container {
    /* Define altura mínima para o banner não "pular" na troca */
    min-height: 300px; 
    display: flex;
    justify-content: center;
    align-items: center;
}

.banner-img {
  width: 100%;
  max-width: 1200px;
  object-fit: cover;
  margin-bottom: 30px;
  /* Garante que a imagem respeite a animação */
  display: block; 
}

.hero-text {
  color: #1b1814;
  font-size: 1rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
}

/* --- INSCRIÇÕES --- */
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

.card:hover { transform: translateY(-5px); }
.card-title {
  color: #890d8e;
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
  display: block;
}
.btn-curso {
    display: block;
    margin-top: 5px;
    font-size: 0.9rem;
    color: #ff9a16; 
    text-decoration: none;
    font-weight: bold;
}

/* --- DEPOIMENTOS --- */
.depoimentos {
  padding: 60px 0;
  position: relative;
  overflow: hidden; 
}

.depoimentos-header { margin-bottom: 30px; padding-left: 50px; }

@media (max-width: 768px) {
  .depoimentos-header { padding-left: 0; text-align: center; }
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

.arrow-btn {
  background: #ff9900;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  z-index: 2; 
}
.arrow-btn:hover { background: #e68a00; transform: translateY(-2px); }
.arrow-btn img { width: 15px; height: auto; }

/* Wrapper Fixo para evitar que a altura mude durante a animação */
.wrapper-fixo {
  position: relative;
  width: 900px; /* Largura máxima do conteúdo */
  max-width: 100%;
  min-height: 350px; /* Altura mínima estimada do depoimento */
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
  width: 100%;
  justify-content: center;
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
.texto-wrapper {
    max-width: 500px;
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
  .content-wrapper { flex-direction: column; text-align: center; }
  .testimonial-text { text-align: center; }
  .nav-list { flex-direction: column; width: 100%; }
  .nav-item a { width: 100%; max-width: 300px; }
  .title-orange, .title-purple { font-size: 2rem; }
  
  .wrapper-fixo {
      min-height: 500px; /* Mais altura no mobile pois empilha */
  }
}
</style>