<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
/* Estilos globais para garantir que o corpo ocupe a tela toda */
html, body, #app {
  height: 100%;
  margin: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ocupa no mínimo a altura da tela toda */
}
</style>
