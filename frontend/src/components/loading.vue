<template>
  <div class="loading-overlay">
    <div class="loader"></div>
    <p class="loading-text">Carregando...</p>
  </div>
</template>

<style scoped>
.loading-overlay {
  display: flex;
  flex: 1; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh; 
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #ff9a16; /* Laranja */
  border-bottom-color: #890d8e; /* Roxo */
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loading-text {
  margin-top: 15px;
  font-family: 'Ruda', sans-serif;
  color: #890d8e;
  font-weight: bold;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>
