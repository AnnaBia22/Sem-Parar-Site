<template>
  <header class="navbar">
    <div class="logo-container">
  <router-link to="/">
    <img 
      src="../assets/images/logo.png" 
      alt="Sem Parar" 
      class="logo" 
    />
  </router-link>
</div>

    <!-- ALTERAR FONTE -->
    <nav class="nav-links">
  <router-link to="/#" class="nav-item">OLIMPÍADAS</router-link>
  <router-link to="/noticias" class="nav-item">NOTÍCIAS</router-link>
  <router-link to="/quem-somos" class="nav-item">QUEM SOMOS</router-link>
  <router-link to="/#" class="nav-item">FALE CONOSCO</router-link>
    </nav>
  </header>
</template>

<script setup>
// Aqui você pode adicionar lógica de navegação se necessário
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 30px;
  background-color: #EBEBEB;
  border-bottom: 2px solid #ddd;
  font-family: Sugo Display, sans-serif;
  height: 60px;
}

/* Logo */
.logo {
  height: 70px; /* Ajuste conforme o tamanho original */
}

/* Links de Navegação */
.nav-links {
  display: flex;
  gap: 25px; /* Espaçamento entre os itens */
}

.nav-item {
  text-decoration: none;
  color: #890d8e;
  font-weight: bold;
  font-size: 14px;
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
</style>