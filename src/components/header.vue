<template>
  <header class="navbar">
    <div class="logo-container">
      <img src="C:\Users\User\OneDrive\Área de Trabalho\Sem-Parar-Site\src\assets\images\logo.png" alt="Sem Parar" class="logo" />
    </div>

    <!-- ALTERAR FONTE -->
    <nav class="nav-links">
      <a href="#" class="nav-item">OLIMPÍADAS</a>
      <a href="#" class="nav-item">NOTÍCIAS</a>
      <a href="#" class="nav-item">QUEM SOMOS</a>
      <a href="#" class="nav-item">FALE CONOSCO</a>
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