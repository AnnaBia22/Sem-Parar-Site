<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import Footer from '../components/footer.vue';
import LoadingStatus from '../components/loading.vue';

const baseUrl = "https://sem-parar-back.onrender.com";
const dadosHome = ref(null);
const loading = ref(true);
const indiceBanner = ref(0);

const fetchData = async () => {
  loading.value = true;
  try {
    const query = '?populate[banner_destaques][populate]=imagem&populate[cursos_abertos][populate]=icon&populate[lista_depoimentos]=*';
    const res = await axios.get(`${baseUrl}/api/home${query}`);
    dadosHome.value = res.data?.data?.attributes || res.data?.data;
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    loading.value = false;
  }
};

const getImgUrl = (midia) => {
  if (!midia) return '';
  const data = midia.data?.attributes || midia.attributes || midia;
  const url = data.url || midia.url;
  return url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : '';
};

const depoimentosEstaticos = [
  {
    texto: "Fui aluna em 2022 e em 2023 da turma de Astronomia do Projeto Sem Parar e, no meio do ano de 2023, me tornei professora voluntária do projeto na mesma turma, para o preparatório para a OBA. Depois, me tornei produtora de materiais, participando da confecção de alguns dos materiais para a OBA e Seletivas. O projeto me mostrou como é verdadeiramente fantástico fazer ciência e aprender ainda mais sobre diversas áreas que não são tão lecionadas na grade curricular das instituições de ensino ,como a Geologia e a Astrofísica. Nesse projeto, pude me sentir mais confiante em público, durante as aulas que ministrei para a OBA, o que foi muitíssimo importante para o meu crescimento pessoal e profissional como cientista. É incrível ver a força de tantas meninas e mulheres lutando pela suas brilhantes jornadas científicas. Com carinho, Yasmim Santos Silva. ☆.  ",
    autora: "Yasmim Santos Silva"
  },
  {
    texto: "Sou muito grata a tudo que o sem parar me ofereceu, foi por meio do projeto que tive meu primeiro contato com a OBI e, sem dúvidas, ele foi essencial para que eu gostasse de programação competitiva e mesmo após 5 anos posso dizer que as aulas que tive no projeto fizeram diferença na minha vida. Se não fosse o projeto acho que eu não teria sequer me engajado tanto com a programação competitiva. Espero que o projeto continue sempre sendo uma motivação para que possamos ver  cada vez mais meninas premiadas nas olimpíadas.",
    autora: "Pietra Gullo Salgado Chaves"
  },
  {
    texto: "O projeto é incrível! Foi muito importante pra mim porque foi uma porta de entrada para o mundo da informática, coisa que eu não sabia nadica de nada. Comecei a me interessar mais por programação (fiz o curso iniciante em 2023 e o intermediário em 2024) e sou muito grata ao apoio que tive das professoras e das próprias alunas. Esse tipo de iniciativa é muito importante.",
    autora: "Melina Regina Pereira Boscoli Santos "
  }
];

const indiceDepoimento = ref(0);

const proximoDepoimento = () => {
  indiceDepoimento.value = (indiceDepoimento.value + 1) % depoimentosEstaticos.length;
};

const depoimentoAnterior = () => {
  indiceDepoimento.value = (indiceDepoimento.value - 1 + depoimentosEstaticos.length) % depoimentosEstaticos.length;
};

onMounted(fetchData);
</script>

<template>
  <div class="page-wrapper">
    <header class="main-header">
      <img src="../assets/images/logo.png" alt="Sem Parar" class="main-logo">
      <nav class="pill-nav">
        <router-link to="/quem-somos" class="nav-pill">QUEM SOMOS</router-link>
        <router-link to="/noticias" class="nav-pill">NOTÍCIAS</router-link>
        <router-link to="/cursos" class="nav-pill">CURSOS</router-link>
        <router-link to="/fale-conosco" class="nav-pill">FALE CONOSCO</router-link>
      </nav>
    </header>

    <LoadingStatus v-if="loading" />

    <main v-else class="content">
      <section class="hero-section">
        <div class="banner-box">
          <img src="../assets/images/Banner fixo - Bem-vinda .png" 
               class="hero-img">
        </div>
        <div class="hero-description">
          <p>O Projeto Sem Parar busca fortalecer a representatividade feminina nas ciências, 
             oferecendo cursos preparatórios gratuitos para olimpíadas científicas em todo o Brasil.</p>
        </div>
      </section>

    <section v-if="dadosHome?.cursos_abertos?.length > 0" class="inscricoes-section">
  <h2 class="section-title">Inscrições abertas</h2>
  <div class="inscricoes-grid">
    <div v-for="curso in dadosHome.cursos_abertos" :key="curso.id" class="curso-pill-card">
      <img :src="getImgUrl(curso.icon)" class="curso-icon">
      <span class="curso-nome">{{ curso.nome_curso }}</span>
    </div>
  </div>
</section>

      <section class="depoimentos-section">
        <div class="depo-titles">
          <h2 class="title-orange">DEPOIMENTOS</h2>
          <h3 class="title-purple">DE ALUNAS</h3>
        </div>
        
       <div class="testimonial-container">
    <button @click="depoimentoAnterior" class="arrow-btn left">←</button>
    
    <div class="testimonial-card">
      <Transition name="fade" mode="out-in">
        <div :key="indiceDepoimento">
          <p class="testi-text">"{{ depoimentosEstaticos[indiceDepoimento].texto }}"</p>
          <span class="testi-author">{{ depoimentosEstaticos[indiceDepoimento].autora }}</span>
        </div>
      </Transition>
    </div>

    <button @click="proximoDepoimento" class="arrow-btn right">→</button>
  </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* ESTRUTURA E STICKY FOOTER */
.page-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #fff; }
.content { flex: 1; }

/* HEADER ESTILO FIGMA */
.main-header { display: flex; flex-direction: column; align-items: center; padding: 20px 0; }
.main-logo { width: 400px; margin-bottom: 0px; }
.pill-nav { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
.nav-pill { 
  background-color: #25074f; 
  color: #fff; 
  padding: 10px 20px; 
  border-radius: 60px; 
  text-decoration: none; 
  font-weight: bold; 
  font-size: 1.1rem; 
  font-family: 'Sugo Display', sans-serif;
  
  /* Adicione esta linha para a transição ficar suave */
  transition: all 0.3s ease; 
  display: inline-block;
}

.nav-pill:hover {
  background-color: #ff9a16; /* Muda para o laranja do projeto */
  color: #25074f;           /* Muda o texto para roxo escuro para dar contraste */
  transform: translateY(-3px); /* Dá um leve pulinho para cima */
  box-shadow: 0 5px 15px rgba(0,0,0,0.2); /* Adiciona uma sombra ao flutuar */
}

/* Efeito ativo (quando a pessoa clica) */
.nav-pill:active {
  transform: translateY(0);
}

/* HERO */
.hero-section { max-width: 1600px; margin: 0 auto; padding: 0 20px; }
.hero-img { width: 100%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.hero-description { text-align: center; padding: 30px 0; color: #555; font-size: 1rem; line-height: 1.6; }

/* SEÇÃO INSCRIÇÕES (FUNDO ROXO) */
.inscricoes-section { background-color: #25074f; padding: 50px 20px; text-align: center; }
.section-title { color: #ff9a16; font-family: 'Sugo Display', sans-serif; font-size: 2.5rem; margin-bottom: 40px; }
.inscricoes-grid { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
.curso-pill-card { 
  background: #fff; border-radius: 12px; padding: 10px 30px; 
  display: flex; align-items: center; gap: 15px; min-width: 220px;
}
.curso-icon { width: 35px; height: 35px; }
.curso-nome { color: #890d8e; font-weight: bold; text-transform: uppercase; font-size: 1rem; }

/* DEPOIMENTOS */
.depoimentos-section { max-width: 1000px; margin: 60px auto; padding: 0 20px; position: relative; }
.title-orange { color: #ff9a16; font-size: 3rem; margin: 0; font-family: 'Sugo Display', sans-serif; }
.title-purple { color: #890d8e; font-size: 2.5rem; margin: -10px 0 40px 80px; font-family: 'Sugo Display', sans-serif; }
.testimonial-container { display: flex; align-items: center; gap: 20px; justify-content: center; }
.testimonial-card { 
  background: #f2f2f2; padding: 40px; border-radius: 20px; 
  max-width: 700px; text-align: center; 
}
.testi-text { color: #666; font-style: italic; line-height: 1.6; }
.testi-author { display: block; margin-top: 20px; font-weight: bold; color: #444; }
.arrow-btn { background: #ff9a16; border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; }

@media (max-width: 768px) {
  .title-purple { margin-left: 0; text-align: center; }
  .depo-titles { text-align: center; }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Garante que o card tenha uma altura mínima para não achatar */
.testimonial-card {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>