<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import LoadingStatus from '../components/loading.vue';

import { baseUrl } from '../constants/api.js'
const dadosHome = ref(null);
const cursos = ref([]);
const loading = ref(true);
const totalVoluntarias = ref(40);

const fetchData = async () => {
  try {
    const query = '?populate[banner_destaques][populate]=imagem&populate[cursos_abertos][populate]=icon&populate[lista_depoimentos]=*';
    const res = await axios.get(`${baseUrl}/api/home${query}`);
    dadosHome.value = res.data?.data?.attributes || res.data?.data;
  } catch (error) {
    console.error("Erro ao carregar home:", error);
  }
};

const fetchCursos = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/pagina-curso?populate[lista_cursos][populate]=*`);
    cursos.value = res.data?.data?.lista_cursos || [];
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
  }
};

const fetchTotalVoluntarias = async () => {
  try {
    const query = "?pagination[pageSize]=1&filters[categoria][$ne]=Legados";
    const res = await axios.get(`${baseUrl}/api/voluntarias${query}`);
    const total = res.data?.meta?.pagination?.total;
    if (typeof total === "number") totalVoluntarias.value = total;
  } catch (error) {
    console.error("Erro ao carregar total de voluntárias:", error);
  }
};

const getIconUrl = (icone) => {
  if (!icone) return null;
  let url = null;
  if (Array.isArray(icone) && icone.length > 0) {
    url = icone[0].url;
  } else if (icone.data) {
    const d = Array.isArray(icone.data) ? icone.data[0] : icone.data;
    url = d?.attributes?.url;
  } else if (icone.url) {
    url = icone.url;
  }
  if (!url) return null;
  return url.startsWith('http') ? url : `${baseUrl}${url}`;
};

const depoimentosEstaticos = [
  {
    texto: "Sou muito grata a tudo que o Sem Parar me ofereceu, foi por meio do projeto que tive meu primeiro contato com a OBI e, sem dúvidas, ele foi essencial para que eu gostasse de programação competitiva e mesmo após 5 anos posso dizer que as aulas que tive no projeto fizeram diferença na minha vida. Se não fosse o projeto acho que eu não teria sequer me engajado tanto com a programação competitiva. Espero que o projeto continue sempre sendo uma motivação para que possamos ver cada vez mais meninas premiadas nas olimpíadas.",
    autora: "Pietra Gullo Salgado Chaves"
  },
  {
    texto: "Fui aluna em 2022 e em 2023 da turma de Astronomia do Projeto Sem Parar e, no meio do ano de 2023, me tornei professora voluntária do projeto na mesma turma, para o preparatório para a OBA. Depois, me tornei produtora de materiais, participando da confecção de alguns dos materiais para a OBA e Seletivas. O projeto me mostrou como é verdadeiramente fantástico fazer ciência e aprender ainda mais sobre diversas áreas que não são tão lecionadas na grade curricular das instituições de ensino, como a Geologia e a Astrofísica. Nesse projeto, pude me sentir mais confiante em público, durante as aulas que ministrei para a OBA, o que foi muitíssimo importante para o meu crescimento pessoal e profissional como cientista. É incrível ver a força de tantas meninas e mulheres lutando pela suas brilhantes jornadas científicas. Com carinho, Yasmim Santos Silva. ☆",
    autora: "Yasmim Santos Silva"
  },
  {
    texto: "O projeto é incrível! Foi muito importante pra mim porque foi uma porta de entrada para o mundo da informática, coisa que eu não sabia nadica de nada. Comecei a me interessar mais por programação (fiz o curso iniciante em 2023 e o intermediário em 2024) e sou muito grata ao apoio que tive das professoras e das próprias alunas. Esse tipo de iniciativa é muito importante.",
    autora: "Melina Regina Pereira Boscoli Santos"
  }
];

const indiceDepoimento = ref(0);
const direcaoDepoimento = ref('next');

const proximoDepoimento = () => {
  direcaoDepoimento.value = 'next';
  indiceDepoimento.value = (indiceDepoimento.value + 1) % depoimentosEstaticos.length;
};

const depoimentoAnterior = () => {
  direcaoDepoimento.value = 'prev';
  indiceDepoimento.value = (indiceDepoimento.value - 1 + depoimentosEstaticos.length) % depoimentosEstaticos.length;
};

const SLIDE_DURATION = 280;

// Hooks de transição via JS (em vez de classes CSS): garante a animação
// mesmo quando o navegador não dispara requestAnimationFrame/transitionend
// (ex.: aba em segundo plano), além de funcionar normalmente no uso real.
const makeSlideLeave = (direcaoRef) => (el, done) => {
  const offset = direcaoRef.value === 'next' ? -36 : 36;
  el.style.transition = `opacity ${SLIDE_DURATION}ms ease, transform ${SLIDE_DURATION}ms ease`;
  el.style.opacity = '0';
  el.style.transform = `translateX(${offset}px)`;
  setTimeout(done, SLIDE_DURATION);
};

const makeSlideEnter = (direcaoRef) => (el, done) => {
  const offset = direcaoRef.value === 'next' ? 36 : -36;
  el.style.transition = 'none';
  el.style.opacity = '0';
  el.style.transform = `translateX(${offset}px)`;
  void el.offsetHeight; // força o navegador a aplicar o estado inicial antes de animar
  el.style.transition = `opacity ${SLIDE_DURATION}ms ease, transform ${SLIDE_DURATION}ms ease`;
  el.style.opacity = '1';
  el.style.transform = 'translateX(0)';
  setTimeout(done, SLIDE_DURATION);
};

const onTestimonialLeave = makeSlideLeave(direcaoDepoimento);
const onTestimonialEnter = makeSlideEnter(direcaoDepoimento);

const mentoresEstaticos = [
  {
    nome: "Yasmim Santos Silva",
    cargo: "Mentora de Astronomia",
    bio: "Técnica em Química pelo IFCE e astrônoma amadora. Cientista cidadã pela NASA/MCTI/IASC e bailarina.",
    foto: null
  },
  {
    nome: "Heloísa Guedes de Azevedo Oliveira Mysczak",
    cargo: "Mentora de Matemática",
    bio: "De Curitiba. Descobri as olimpíadas de matemática no 8º ano e me apaixonei pelo ambiente maravilhoso das competições femininas.",
    foto: null
  },
  {
    nome: "Malu Araujo Azevedo",
    cargo: "Mentora de Informática",
    bio: "Meu nome é Malu, sou de Campo Grande (MS) e estou no segundo ano do ensino médio integrado em Eletrotécnica. Gosto muito da área de STEM, principalmente de programar, estudar física e montar PCBs.",
    foto: null
  },
  {
    nome: "Aini do Rio Apa Vincenzi",
    cargo: "Mentora de Física",
    bio: "Apaixonada por astrofísica e educação. Acredito que podemos usar a ciência para inspirar jovens a terem sonhos e lutarem por eles.",
    foto: null
  },
  {
    nome: "Julia Rampelotto Cardoso",
    cargo: "Mentora de Biologia",
    bio: "Une paixão por saúde pública e educação a um compromisso genuíno com o impacto social, atuando como professora voluntária e liderando a comissão acadêmica da Olimpíada Feminina de Biologia.",
    foto: null
  },
  {
    nome: "Ana Júlia Fernandes Mota da Silva",
    cargo: "Coordenadora de Química",
    bio: "Oi, meninas! Sou Ana Júlia e durante meu ensino médio estudei para olimpíadas de química e amo ensinar e compartilhar essa matéria tão rica e interessante!",
    foto: null
  }
];

const fetchFotosMentoras = async () => {
  try {
    const nomes = mentoresEstaticos.map(m => m.nome);
    const query = nomes.map((nome, i) => `filters[$or][${i}][nome][$eq]=${encodeURIComponent(nome)}`).join('&');
    const res = await axios.get(`${baseUrl}/api/voluntarias?${query}&populate[foto]=true`);
    const encontradas = res.data?.data || [];
    for (const mentor of mentoresEstaticos) {
      const match = encontradas.find(v => v.nome === mentor.nome);
      const url = match?.foto?.url;
      if (url) mentor.foto = url.startsWith('http') ? url : `${baseUrl}${url}`;
    }
  } catch (error) {
    console.error("Erro ao carregar fotos das mentoras:", error);
  }
};

const indiceMentor = ref(0);
const direcaoMentor = ref('next');

const proximoMentor = () => {
  direcaoMentor.value = 'next';
  indiceMentor.value = (indiceMentor.value + 1) % mentoresEstaticos.length;
};

const mentorAnterior = () => {
  direcaoMentor.value = 'prev';
  indiceMentor.value = (indiceMentor.value - 1 + mentoresEstaticos.length) % mentoresEstaticos.length;
};

const onMentorLeave = makeSlideLeave(direcaoMentor);
const onMentorEnter = makeSlideEnter(direcaoMentor);

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchData(), fetchCursos(), fetchTotalVoluntarias(), fetchFotosMentoras()]);
  loading.value = false;
});
</script>

<template>
  <div class="page-wrapper">
    <Header />

    <!-- HERO -->
    <section class="intro-section">
      <img src="../assets/images/icone-simbolo.png" alt="" aria-hidden="true" class="intro-logo" />
      <div class="section-inner intro-hero">
        <span class="intro-eyebrow">Projeto Sem Parar</span>
        <h1 class="intro-title">Meninas ensinando meninas</h1>
        <p class="intro-text">
          O Projeto Sem Parar nasceu em 2018 para fortalecer a representatividade feminina nas ciências,
          oferecendo cursos preparatórios gratuitos para olimpíadas científicas em todo o Brasil.
        </p>
        <router-link to="/quem-somos" class="btn btn-hero">Quem somos</router-link>
      </div>
    </section>

    <LoadingStatus v-if="loading" />

    <main v-else class="content">

      <!-- STATS -->
      <section class="stats-band">
        <div class="section-inner stats-inner">
          <div class="stat">
            <span class="stat-number">2018</span>
            <span class="stat-label">ano de fundação</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ totalVoluntarias }}</span>
            <span class="stat-label">voluntárias</span>
          </div>
          <div class="stat">
            <span class="stat-number">+3.000</span>
            <span class="stat-label">alunas impactadas</span>
          </div>
          <div class="stat">
            <span class="stat-number">5</span>
            <span class="stat-label">regiões do Brasil alcançadas</span>
          </div>
        </div>
      </section>

      <!-- ÁREAS -->
      <section v-if="cursos.length" class="areas-section">
        <div class="section-inner">
          <h2 class="section-heading">Nossas áreas de olimpíadas</h2>
          <p class="section-sub">Seis frentes, uma missão: aproximar meninas da ciência.</p>

          <div class="areas-grid">
            <router-link
              v-for="curso in cursos"
              :key="curso.id"
              :to="curso.link_pag"
              class="area-tile"
            >
              <img
                v-if="getIconUrl(curso.icon)"
                :src="getIconUrl(curso.icon)"
                :alt="curso.nome_curso"
                class="area-icon"
              />
              <span class="area-name">{{ curso.nome_curso }}</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- SPOTLIGHT: QUEM ENSINA -->
      <section class="spotlight-section">
        <div class="section-inner">
          <span class="spotlight-label">Conheça quem ensina</span>

          <div class="spotlight-carousel">
            <button @click="mentorAnterior" class="arrow-btn" aria-label="Mentora anterior">←</button>

            <Transition :css="false" mode="out-in" @enter="onMentorEnter" @leave="onMentorLeave">
              <div class="spotlight-inner" :key="indiceMentor">
                <div class="spotlight-photo">
                  <img :src="mentoresEstaticos[indiceMentor].foto" :alt="mentoresEstaticos[indiceMentor].nome" />
                </div>
                <div class="spotlight-text">
                  <h2 class="spotlight-name">{{ mentoresEstaticos[indiceMentor].nome }}</h2>
                  <p class="spotlight-role">{{ mentoresEstaticos[indiceMentor].cargo }}</p>
                  <p class="spotlight-bio">{{ mentoresEstaticos[indiceMentor].bio }}</p>
                  <router-link to="/quem-somos" class="btn btn-outline-purple">Conheça todo o time</router-link>
                </div>
              </div>
            </Transition>

            <button @click="proximoMentor" class="arrow-btn" aria-label="Próxima mentora">→</button>
          </div>
        </div>
      </section>

      <!-- DEPOIMENTOS -->
      <section class="depoimentos-section">
        <div class="section-inner">
          <div class="depo-titles">
            <h2 class="title-orange">DEPOIMENTOS</h2>
            <h3 class="title-purple">DE ALUNAS</h3>
          </div>

          <div class="testimonial-container">
            <button @click="depoimentoAnterior" class="arrow-btn" aria-label="Depoimento anterior">←</button>

            <Transition
              :css="false"
              mode="out-in"
              @enter="onTestimonialEnter"
              @leave="onTestimonialLeave"
            >
              <div class="testimonial-card" :key="indiceDepoimento">
                <span class="quote-mark">&ldquo;</span>
                <p class="testi-text">{{ depoimentosEstaticos[indiceDepoimento].texto }}</p>
                <span class="testi-author">{{ depoimentosEstaticos[indiceDepoimento].autora }}</span>
              </div>
            </Transition>

            <button @click="proximoDepoimento" class="arrow-btn" aria-label="Próximo depoimento">→</button>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* ESTRUTURA */
.page-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #fff; }
.content { flex: 1; }

/* largura de leitura consistente dentro de seções full-bleed */
.section-inner { max-width: 1180px; margin: 0 auto; padding: 0 32px; box-sizing: border-box; }

/* BOTÕES (mesmo padrão em todo o site) */
.btn {
  display: inline-block;
  font-family: 'Sugo Display', sans-serif;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  padding: 13px 30px;
  border-radius: 999px;
  transition: all 0.25s ease;
  border: 2px solid transparent;
}
.btn-outline-purple { background: transparent; color: #890d8e; border-color: #890d8e; }
.btn-outline-purple:hover { background: #890d8e; color: #fff; transform: translateY(-2px); }

/* HERO */
.intro-section {
  position: relative;
  background: #25074f;
  overflow: hidden;
  padding: 110px 0;
}
.intro-logo {
  position: absolute;
  z-index: 0;
  top: -272px;
  right: -247px;
  transform: scaleX(-1);
  width: 700px;
  max-width: 55vw;
  height: auto;
  opacity: 1;
}
.intro-hero { position: relative; z-index: 1; max-width: 880px; margin-left: 0; padding-left: 48px; padding-right: 48px; box-sizing: border-box; }
.intro-eyebrow {
  display: block;
  color: #ff9a16;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.9rem;
  margin-bottom: 16px;
}
.intro-title {
  font-family: 'Sugo Display', sans-serif;
  color: #fff;
  font-size: 3.2rem;
  margin: 0 0 22px 0;
  line-height: 1.1;
}
.intro-text { color: #e4d5ef; font-size: 1.1rem; line-height: 1.7; margin: 0 0 32px 0; max-width: 700px; }
.btn-hero {
  display: inline-block;
  font-family: 'Sugo Display', sans-serif;
  font-weight: bold;
  font-size: 1rem;
  text-decoration: none;
  color: #25074f;
  background: #ff9a16;
  padding: 15px 34px;
  border-radius: 6px;
  transition: all 0.25s ease;
}
.btn-hero:hover { background: #ffb04d; transform: translateY(-2px); }

@media (max-width: 768px) {
  .intro-section { padding: 80px 0; }
  .intro-title { font-size: 2.2rem; }
  .intro-logo { top: -127px; right: -127px; width: 360px; max-width: 65vw; opacity: 0.3; }
}

/* STATS */
.stats-band { background: #fff; padding: 44px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
.stats-inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 28px; }
.stat { flex: 1 1 180px; text-align: center; }
.stat-number {
  display: block;
  font-family: 'Ruda', sans-serif;
  font-weight: 700;
  color: #ff9a16;
  font-size: 2.6rem;
  line-height: 1;
}
.stat-label {
  display: block;
  margin-top: 8px;
  color: #4a2b63;
  font-weight: bold;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* ÁREAS */
.areas-section { padding: 70px 0; text-align: center; }
.section-heading {
  font-family: 'Sugo Display', sans-serif;
  color: #25074f;
  font-size: 2.2rem;
  margin: 0 0 8px 0;
}
.section-sub { color: #666; margin: 0 0 40px 0; }
.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.area-tile {
  background: #fff;
  border: 1px solid #e2e2e8;
  border-radius: 8px;
  padding: 28px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.area-tile:hover {
  border-color: #890d8e;
  background: #faf7fb;
}
.area-icon { width: 56px; height: 56px; object-fit: contain; }
.area-name {
  font-family: 'Sugo Display', sans-serif;
  color: #890d8e;
  font-size: 1rem;
  text-transform: uppercase;
}

/* SPOTLIGHT */
.spotlight-section { background: #f7f7fb; padding: 70px 0; }
.spotlight-label {
  display: block;
  color: #ff9a16;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.85rem;
  margin-bottom: 20px;
}
.spotlight-carousel {
  display: flex;
  align-items: center;
  gap: 20px;
}
.spotlight-inner {
  display: flex;
  align-items: center;
  gap: 56px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.spotlight-photo { flex: 0 0 320px; }
.spotlight-photo img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}
.spotlight-text { flex: 1; }
.spotlight-name {
  font-family: 'Sugo Display', sans-serif;
  color: #25074f;
  font-size: 2rem;
  margin: 0 0 4px 0;
}
.spotlight-role { color: #890d8e; font-weight: bold; margin: 0 0 16px 0; }
.spotlight-bio { color: #4a2b63; line-height: 1.6; max-width: 520px; margin: 0 0 24px 0; }

@media (max-width: 768px) {
  .spotlight-carousel { align-items: flex-start; gap: 10px; }
  .spotlight-inner { flex-direction: column; text-align: center; gap: 24px; overflow: visible; }
  .spotlight-photo { flex-basis: auto; width: 100%; max-width: 220px; margin: 0 auto; }
  .spotlight-bio { margin-left: auto; margin-right: auto; }
  .spotlight-carousel .arrow-btn { width: 32px; height: 32px; font-size: 0.85rem; margin-top: 118px; }
}

/* DEPOIMENTOS */
.depoimentos-section { background: #f7f7fb; padding: 70px 0 90px; }
.depo-titles { text-align: center; margin-bottom: 40px; }
.title-orange { color: #ff9a16; font-size: 2.6rem; margin: 0; font-family: 'Sugo Display', sans-serif; }
.title-purple { color: #890d8e; font-size: 2rem; margin: -6px 0 0 0; font-family: 'Sugo Display', sans-serif; }
.testimonial-container { display: flex; align-items: center; gap: 20px; justify-content: center; }
.testimonial-card {
  position: relative;
  background: #fff;
  border: 1px solid #e2e2e8;
  padding: 48px;
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.quote-mark {
  position: absolute;
  top: 16px;
  left: 36px;
  font-family: Georgia, serif;
  font-size: 5rem;
  color: #890d8e33;
  line-height: 1;
}
.testi-text { color: #4a2b63; font-style: italic; line-height: 1.6; margin: 0; }
.testi-author { display: block; margin-top: 20px; font-weight: bold; color: #890d8e; }
.arrow-btn {
  background: #fff;
  border: 2px solid #890d8e;
  color: #890d8e;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.arrow-btn:hover { background: #890d8e; color: #fff; }

@media (max-width: 768px) {
  .stats-inner { justify-content: center; text-align: center; }

  .testimonial-container { flex-wrap: wrap; justify-content: center; gap: 16px; }
  .testimonial-card { order: 1; flex-basis: 100%; padding: 36px 24px 28px; }
  .testimonial-container .arrow-btn { order: 2; }
  .quote-mark { top: 10px; left: 18px; font-size: 3.5rem; }
}

</style>
