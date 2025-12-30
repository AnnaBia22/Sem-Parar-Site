<script setup>
import { ref } from 'vue';

// Menu e Cards
const menuItems = ['QUEM SOMOS?', 'NOTÍCIAS', 'CURSOS', 'FALE CONOSCO'];

const cards = [
  { id: 1, title: 'FÍSICA', icon: '💡' },
  { id: 2, title: 'ASTRONOMIA', icon: '🪐' },
  { id: 3, title: 'MATEMÁTICA', icon: '📐' }
];
</script>

<template>
  <div class="landing-page">
    
    <header>
      <div class="container header-content">
        <div class="logo-area">
          <img class="logo" src="../assets/images/logo.png" alt="Logo Projeto Sem Parar">
        </div>
        
        <nav>
          <ul class="nav-list">
            <li v-for="item in menuItems" :key="item" class="nav-item">
              <a href="#">{{ item }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="container">
        <div class="banner-container">
          <img class="banner-img" src="../assets/images/bannerinicial.png" alt="Banner Olimpíada">
        </div>
        <p class="hero-text">
          Lorem sed non fermentum tortor. Pellentesque finibus felis lorem. Aenean orci ante,
          pellentesque et purus quis, dapibus laoreet elit. In hac habitasse platea dictumst.
        </p>
      </div>
    </section>

    <section class="inscricoes">
      <div class="container"> <h2 class="section-title text-orange">Inscrições abertas</h2>
        
        <div class="cards-container">
          <div v-for="card in cards" :key="card.id" class="card">
            <span class="card-icon">{{ card.icon }}</span>
            <span class="card-title">{{ card.title }}</span>
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
          <button class="arrow-btn">
            <img src="../assets/images/setaesquerda.png" alt="Anterior">
          </button>
          
          <div class="content-wrapper">
            <img class="foto-aluna" src="../assets/images/alunaexemplo.png" alt="Foto da Aluna">
            <p class="testimonial-text">
              Lorem Proin dui leo, rhoncus ut suscipit quis, blandit vitae erat.
              Suspendisse ante tortor, ultrices sit amet sapien eget, consequat venenatis felis.
              Maecenas maximus nunc lectus, eu vestibulum risus ultricies quis.
              Ut sit amet ornare velit.
            </p>
          </div>

          <button class="arrow-btn">
            <img src="../assets/images/setadireita.png" alt="Próximo">
          </button>
        </div>
      </div>

      <div class="decorative-element">
        <div class="img-placeholder deco-img">ELEMENTOS VISUAIS</div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* --- CONFIGURAÇÕES GERAIS --- */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

.landing-page {
  font-family: 'Roboto', sans-serif;
  width: 100%;
  /* Removemos o max-width daqui para permitir seções full-width */
  background-color: #fffff5;
}

/* Nova classe utilitária para centralizar o conteúdo interno */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px; /* Margem de segurança nas laterais em mobile */
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

.card-icon {
  font-size: 2rem;
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
}
.arrow-btn:hover {
  background: #e68a00;
  transform: translateY(-2px);
}

.arrow-btn img {
  width: 15px;
  height: auto;
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
    /* No mobile, talvez você queira que eles ocupem a largura total */
    width: 100%; 
    max-width: 300px; /* Limite para não ficar gigante no tablet */
  }
  
  .title-orange, .title-purple {
    font-size: 2rem;
  }
}
</style>