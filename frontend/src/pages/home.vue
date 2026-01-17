<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Footer from '../components/footer.vue';

const STRAPI_URL = 'http://localhost:1337';
const dadosHome = ref(null);
const carregando = ref(true);
const erro = ref(null);

const indiceDepoimento = ref(0);
const indiceBanner = ref(0);
let bannerTimer = null; 

const getImgUrl = (midia) => {
  if (!midia) return '';
  
  let url = null;

  if (midia.url) {
    url = midia.url;
  } else if (midia.data) {
    if (Array.isArray(midia.data) && midia.data.length > 0) {
      url = midia.data[0].attributes.url;
    } else if (midia.data.attributes) {
      url = midia.data.attributes.url;
    }
  } else if (Array.isArray(midia) && midia.length > 0) {
    const item = midia[0];
    if (item.url) url = item.url;
    else if (item.attributes) url = item.attributes.url;
  }

  if (url) {
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  
  return '';
};

const buscarDados = async () => {
  try {
    const query = '?populate[menu_navegacao]=*&populate[banner_destaques][populate]=imagem&populate[cursos_abertos][populate]=icon&populate[lista_depoimentos]=*&populate[Logo][fields]=url';
    
    const resposta = await fetch(`${STRAPI_URL}/api/home${query}`);
    
    if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);

    const json = await resposta.json();
    dadosHome.value = json.data.attributes || json.data;

    iniciarBannerAutomatico();

  } catch (e) {
    console.error(e);
    erro.value = "Não foi possível carregar o conteúdo.";
  } finally {
    carregando.value = false;
  }
};

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

const proximoBanner = () => {
  if (!dadosHome.value?.banner_destaques) return;
  if (indiceBanner.value === dadosHome.value.banner_destaques.length - 1) {
    indiceBanner.value = 0;
  } else {
    indiceBanner.value++;
  }
};

const iniciarBannerAutomatico = () => {
  bannerTimer = setInterval(proximoBanner, 8000);
};

onMounted(() => {
  buscarDados();
});

onUnmounted(() => {
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
        </div>
      </section>

      <section class="inscricoes">
        <div class="container"> 
          <h2 class="section-title text-orange">Inscrições abertas</h2>
          
          <div class="cards-container">
            <div v-for="card in (dadosHome.cursos_abertos || [])" :key="card.id" class="card">
              <img :src="getImgUrl(card.icon)" class="card-icon-img">
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
                  
                  <div class="texto-wrapper">
                    <p class="testimonial-text">"{{ dadosHome.lista_depoimentos[indiceDepoimento].texto_depoimento }}"</p>
                    <p class="aluna-nome">
                         {{ dadosHome.lista_depoimentos[indiceDepoimento].nome_aluna }}
                    </p>
                    <small class="contador-depoimento">
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

.loading-state { text-align: center; padding: 20px; font-weight: bold; color: #666; }
.landing-page { font-family: 'Roboto', sans-serif; width: 100%; background-color: #fffff5; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.img-placeholder { background-color: #eee; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #aaa; }

header { padding: 20px 0; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.logo { width: 400px; max-width: 100%; margin-bottom: 0px; object-fit: contain; }
.nav-list { list-style: none; display: flex; gap: 15px; padding: 0; flex-wrap: wrap; justify-content: center; }
.nav-item a { background-color: #25074f; color: #fffff5; text-decoration: none; width: 200px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 25px; font-weight: bold; text-transform: uppercase; font-size: 1rem; transition: background 0.3s; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); text-align: center; }
.nav-item a:hover { background-color: #3e0c85; }

.hero { padding: 20px 0; text-align: center; }
.banner-container { min-height: 300px; display: flex; justify-content: center; align-items: center; }
.banner-img { width: 100%; max-width: 1200px; object-fit: cover; margin-bottom: 30px; display: block; }
.hero-text { color: #1b1814; font-size: 1rem; max-width: 800px; margin: 0 auto; line-height: 1.5; }

.inscricoes { background-color: #25074f; padding: 1px 0px 70px 0px; margin-top: 10px; width: 100%; }
.text-orange { color: #ff9a16; margin-bottom: 30px; font-size: 3.5rem; text-align: center; }
.cards-container { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.card { background: #fffff5; border-radius: 15px; padding: 15px 40px; display: flex; align-items: center; gap: 15px; width: 200px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s; }
.card:hover { transform: translateY(-5px); }
.card-icon-img { width: 50px; height: 50px; object-fit: contain; }
.card-title { color: #890d8e; font-weight: 900; font-size: 1.1rem; text-transform: uppercase; display: block; }
.btn-curso { display: block; margin-top: 5px; font-size: 0.9rem; color: #ff9a16; text-decoration: none; font-weight: bold; }

.depoimentos { 
  padding: 60px 0; 
  position: relative; 
  overflow: hidden;
}
.depoimentos-header { margin-bottom: 30px; padding-left: 50px; }
.title-orange { color: #ff9900; font-size: 3.5rem; margin: 0; line-height: 1; }
.title-purple { color: #800080; font-size: 3.5rem; margin-left: 100px; margin-top: 0px; font-weight: 900; text-transform: uppercase; }
.carousel-container { display: flex; align-items: center; justify-content: center; gap: 30px; }
.arrow-btn { background: #ff9900; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.3s; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); z-index: 2; }
.arrow-btn:hover { background: #e68a00; transform: translateY(-2px); }
.arrow-btn img { width: 15px; height: auto; }

.wrapper-fixo {
  position: relative;
  width: 900px;
  max-width: 100%;
  min-height: 250px; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.texto-wrapper {
  max-width: 850px; 
  width: 100%;
  text-align: center; 
}

.testimonial-text {
  color: #1b1814;
  line-height: 1.6;
  font-size: 1.1rem;
  text-align: center; 
}

.aluna-nome {
  font-weight: bold;
  margin-top: 20px;
  display: block;
  text-transform: uppercase;
}

.contador-depoimento {
  color: #666; 
  margin-top: 5px; 
  display: block;
}

.decorative-element { position: absolute; bottom: 0; left: 0; z-index: -1; }
.deco-img { width: 150px; height: 150px; border-radius: 0 100% 0 0; }

@media (max-width: 768px) {
  .depoimentos-header { padding-left: 0; text-align: center; }
  .content-wrapper { flex-direction: column; text-align: center; }
  .nav-list { flex-direction: column; width: 100%; }
  .nav-item a { width: 100%; max-width: 300px; }
  .title-orange, .title-purple { font-size: 2rem; }
  .wrapper-fixo { min-height: 350px; }
}
</style>