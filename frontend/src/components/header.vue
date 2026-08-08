<template>
  <header class="navbar">
    <div class="logo-container">
  <router-link to="/">
    <img 
      src="../assets/images/logo-navbar.png"
      alt="Sem Parar" 
      class="logo" 
    />
  </router-link>
    </div>

    <!-- ALTERAR FONTE -->
    <nav class="nav-links">
  <router-link to="/cursos" class="nav-item">CURSOS</router-link>
  <router-link to="/noticias" class="nav-item">NOTÍCIAS</router-link>
  <router-link to="/quem-somos" class="nav-item">QUEM SOMOS</router-link>
  <router-link to="/fale-conosco" class="nav-item">FALE CONOSCO</router-link>
    </nav>
  </header>
</template>

<script setup>
// Aqui você pode adicionar lógica de navegação se necessário
</script>

<style scoped>
/* Estilo do fundo e layout principal */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 30px;
  background-color: #25074f;
  border-bottom: 2px solid #1a0538;
  font-family: Sugo Display, sans-serif;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Logo */
.logo {
  height: 42px;
}

/* Links de Navegação */
.nav-links {
  display: flex;
  gap: 25px; /* Espaçamento entre os itens */
}

.nav-item {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  position: relative;
  padding-bottom: 5px;
}

/* Linha laranja abaixo do texto ao passar o mouse ou ativo */
.nav-item::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: #ff9a16; /* Laranja da imagem */
  bottom: 0;
  left: 0;
}

.nav-item:hover {
  color: #ff9a16;
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    justify-content: center;
    height: auto;
    padding: 10px 16px;
    row-gap: 8px;
  }
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px 16px;
  }
  .nav-item {
    font-size: 14px;
  }
}
</style>