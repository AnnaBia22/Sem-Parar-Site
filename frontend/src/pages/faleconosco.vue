<template>
  <Header />
  <main class="container-contato">
    <h1 class="titulo-duvida">Ficou com alguma dúvida?</h1>
    <p class="subtitulo">Entre em contato com a gente</p>

    <div class="lista-contatos">
      <a 
        href="https://mail.google.com/mail/?view=cm&fs=1&to=sempararprojeto@gmail.com&su=Dúvida - Projeto Sem Parar" 
        target="_blank" 
        class="item-contato"
      >
        <div class="icon-wrapper">
          <img src="../assets/images/mail-icon.png" alt="Email" class="icon-img">
        </div>
        <div class="texto-contato">
          <span class="label">EMAIL</span>
          <span class="valor">sempararprojeto@gmail.com</span>
        </div>
      </a>

      <a href="https://ig.me/m/sempararprojeto" target="_blank" class="item-contato reverse">
        <div class="texto-contato align-right">
          <span class="label">INSTAGRAM</span>
          <span class="valor">@sempararprojeto</span>
        </div>
        <div class="icon-wrapper">
          <img src="../assets/images/instagram-color.png" alt="Instagram" class="icon-img">
        </div>
      </a>

      <a href="https://wa.me/5599999999999" target="_blank" class="item-contato">
        <div class="icon-wrapper">
          <img src="../assets/images/whatsapp-color.png" alt="WhatsApp" class="icon-img">
        </div>
        <div class="texto-contato">
          <span class="label">NÚMERO</span>
          <span class="valor">(99) 9999-9999</span>
        </div>
      </a>
    </div>
  </main>
  <Footer />
</template>

<script setup>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
</script>

<style scoped>
.container-contato {
  flex: 1;
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  padding: 30px 20px 40px;
  box-sizing: border-box;
  text-align: center;
  font-family: 'Ruda', sans-serif;
}

.titulo-duvida {
  font-family: 'Sugo Display', sans-serif;
  color: #ff9a16;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
}

.subtitulo {
  color: #333;
  margin-bottom: 40px;
  font-size: 0.9rem;
}

.lista-contatos {
  display: flex;
  flex-direction: column;
  gap: 21px;
  max-width: 600px;
  margin: 0 auto;
}

.item-contato {
  display: flex;
  align-items: center;
  background-color: #890d8e;
  padding: 8px;
  border-radius: 60px;
  text-decoration: none;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* Criamos uma camada invisível para o gradiente */
.item-contato::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #890d8e 0%, #ff9a16 100%);
  opacity: 0;
  transition: opacity 0.8s ease;
  z-index: -1; /* Fica atrás do texto e ícone */
}

/* Inversão para o Instagram */
.item-contato.reverse::before {
  background: linear-gradient(270deg, #890d8e 0%, #ff9a16 100%);
}

.item-contato:hover {
  transform: scale(1.03);
  box-shadow: 0 5px 20px rgba(255, 154, 22, 0.4);
}

/* Ao passar o mouse, a camada do gradiente aparece 100% cobrindo o roxo */
.item-contato:hover::before {
  opacity: 1;
}

.icon-wrapper {
  background: white;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* Garante que o ícone fique por cima do gradiente */
  position: relative; 
  z-index: 2;
}

.icon-img {
  width: 35px;
  height: auto;
}

.texto-contato {
  flex: 1;
  padding: 0 25px;
  display: flex;
  flex-direction: column;
  color: white;
  text-align: left;
  position: relative;
  z-index: 2;
}

.align-right {
  text-align: right;
}

.item-contato.reverse {
  flex-direction: row;
}

.label {
  font-family: 'Sugo Display', sans-serif;
  font-size: 1.4rem;
  margin: 0;
  line-height: 1.2;
}

.valor {
  font-size: 0.95rem;
  font-weight: 400;
}

@media (max-width: 480px) {
  .item-contato { padding: 8px; }
  .icon-wrapper { width: 55px; height: 55px; }
  .label { font-size: 1.2rem; }
  .valor { font-size: 0.8rem; }
}
</style>