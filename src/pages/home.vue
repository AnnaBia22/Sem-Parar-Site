<script setup>
 import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
</script>
<template>
  <!-- HERO -->
  <section class="hero">
    <img src="@/assets/images/hero.png" alt="Olimpíada" />
    <p>
      Projeto voluntário focado em educação e oportunidades
      para estudantes.
    </p>
  </section>

  <!-- INSCRIÇÕES -->
  <section class="inscricoes">
    <h2>Inscrições abertas</h2>

    <div class="cards">
      <CourseCard title="Física" />
      <CourseCard title="Astronomia" />
      <CourseCard title="Matemática" />
    </div>
  </section>

  <!-- DEPOIMENTOS -->
  <section class="depoimentos">
    <h2>Depoimentos de alunas</h2>

    <div class="depoimento-box">
      <img src="@/assets/images/aluna.jpg" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Ut enim ad minim veniam.
      </p>
    </div>
  </section>
</template>

<script setup>
import CourseCard from '@/components/CourseCard.vue'
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 40px;
}

.hero img {
  max-width: 100%;
  border-radius: 10px;
}

.inscricoes {
  background: #2c065c;
  color: white;
  padding: 40px;
  text-align: center;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.depoimentos {
  padding: 40px;
}

.depoimento-box {
  display: flex;
  gap: 20px;
  align-items: center;
}

.depoimento-box img {
  width: 150px;
  border-radius: 10px;
}
</style>
