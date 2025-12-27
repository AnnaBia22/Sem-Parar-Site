<template>
  <footer class="footer-container">
    <div class="footer-section left">
      <p>
        Layout por 
        <a href="https://github.com/AnnaBia22" target="_blank">Anna Travascio</a> e 
        <a href="https://github.com/maluqueirozz" target="_blank">Malu Queiroz</a>
      </p>
    </div>

    <div class="footer-section center">
      <div class="contact-info">
        <a href="mailto:emaildoprojeto@gmail.com">emaildoprojeto@gmail.com</a>
        <a href="https://www.instagram.com/sempararprojeto/" target="_blank">@sempararprojeto</a>
      </div>
      <p class="license">MIT LICENSE</p>
    </div>

    <div class="footer-section right">
      <p>© 2018 - {{ currentYear }}</p>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* Divide em 3 colunas */
  align-items: flex-end; /* Alinha os textos na base */
  padding: 10px 40px;
  background-color: #EBEBEB; /* Cor cinza do fundo da imagem */
  color: #1B1814;
  font-family: sans-serif;
  font-size: 13px;
  min-height: 60px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

/* Alinhamentos específicos */
.left {
  text-align: left;
  font-size: 10px;
  color: #9c9c9cff; /* Texto mais claro conforme a imagem */
}

.center {
  text-align: center;
  gap: 10px;
  align-items: center;
}

.right {
  text-align: right;
}

/* Estilização dos Links */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 16px;
  color: #000;
}

a {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.1s;
}

a:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.license {
  margin-top: 15px;
  font-size: 10px;
}

/* Responsividade simples para telas pequenas */
@media (max-width: 768px) {
  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
  }
  .left, .right {
    text-align: center;
  }
}
</style>