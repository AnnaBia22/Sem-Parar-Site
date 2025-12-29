<template>
  <Header />

  <main class="container">
    <section class="intro">
      <h1 class="titulo-principal">{{ data.titulo }}</h1>
      <div class="descricao-box">
        <p v-for="(paragrafo, index) in data.descricao" :key="index">
          {{ paragrafo }}
        </p>
      </div>
    </section>

    <section v-for="(secao, sIdx) in data.secoes" :key="sIdx" class="secao-time">
      <h2 class="titulo-laranja">{{ secao.titulo }}</h2>
      <h3 v-if="secao.subtitulo" class="titulo-roxo">{{ secao.subtitulo }}</h3>
      
      <div class="grid-membros">
        <div v-for="(membro, mIdx) in secao.membros" :key="mIdx" class="polaroid-container">
          <div class="card-flip">
            
            <div class="card-front">
              <div class="foto-placeholder">
                <img :src="membro.imagem" :alt="membro.nome">
              </div>
              <div class="info-membro">
                <span class="nome">{{ membro.nome }}</span>
                <span class="cargo">{{ membro.cargo }}</span>
              </div>
            </div>

            <div class="card-back">
              <h4 class="titulo-bio">Bio</h4>
              <p class="texto-bio">{{ membro.bio }}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  </main>

  <Footer />
</template>

<script setup>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import { quemSomosData as data } from '../router/quemsomos.js'
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Ruda', sans-serif;
}

.intro {
  text-align: center;
  margin-bottom: 60px;
}

.titulo-principal, .titulo-laranja, .titulo-roxo, .titulo-bio, .nome {
  font-family: 'Sugo Display', sans-serif;
}

.titulo-principal {
  color: #ff9a16;
  font-size: 2.8rem;
  margin-bottom: 25px;
}

.secao-time {
  text-align: left;
  margin-bottom: 80px;
}

.titulo-laranja {
  color: #ff9a16;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.titulo-roxo {
  color: #890d8e;
  font-size: 1.8rem;
  margin: 0 0 40px 50px;
  display: block;
}

/* GRID AJUSTADO */
.grid-membros {
  display: grid;
  /* Usamos auto-fill e definimos um tamanho fixo para o card não esticar */
  grid-template-columns: repeat(auto-fill, 240px); 
  gap: 40px;
  justify-content: flex-start; /* Alinha os cards à esquerda na seção */
}

/* CONTAINER DO GIRO */
.polaroid-container {
  width: 240px; /* Largura idêntica ao grid column */
  height: 360px;
  perspective: 1000px;
  cursor: pointer;
}

.card-flip {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  transform-origin: center center; /* Garante o eixo no meio */
}

.polaroid-container:hover .card-flip {
  transform: rotateY(180deg);
}

/* ESTILIZAÇÃO DAS FACES */
.card-front, .card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Suporte para Safari */
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Garante que padding não mude o tamanho total */
}

.card-front {
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  z-index: 2;
  transform: rotateY(0deg); /* Ponto de partida */
}

.foto-placeholder {
  background: #FFFFFF;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin-bottom: 15px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.foto-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-membro {
  text-align: center;
}

.nome {
  color: #25074f;
  font-weight: bold;
  display: block;
  font-size: 1.1rem;
}

.cargo {
  font-family: 'Ruda', sans-serif;
  font-size: 0.8rem;
  color: #555;
  display: block;
  margin-top: 5px;
  font-style: italic;
}

/* VERSO */
.card-back {
  background: #f8f8f8;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.titulo-bio {
  color: #890d8e;
  margin-bottom: 15px;
  font-size: 1.4rem;
  border-bottom: 2px solid #ff9a16;
}

.texto-bio {
  font-family: 'Ruda', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
  padding: 0 5px;
}

@media (max-width: 768px) {
  .titulo-roxo { margin-left: 20px; }
  .grid-membros { 
    justify-content: center; /* Centraliza o grid em telas pequenas */
    grid-template-columns: repeat(auto-fill, 240px);
  }
}
</style>