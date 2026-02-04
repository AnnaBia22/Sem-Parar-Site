<template>
  <Header />
  <LoadingStatus v-if="loading" />

  <template v-else>
    <main class="container" v-if="materia">
      <section class="intro">
        <h1 class="titulo-principal">
          {{ materia.attributes?.titulo || materia.titulo || "Título não encontrado" }}
        </h1>
        <div class="descricao-box">
          <p v-for="(p, i) in textoCoordenacao" :key="i">{{ p }}</p>
        </div>
      </section>

      <section class="secao-abas">
        <div class="abas-container">
          <button :class="['tab-btn', { active: abaAtiva === 'inscricoes' }]" @click="abaAtiva = 'inscricoes'">
            INSCRIÇÕES ABERTAS
          </button>
          <button :class="['tab-btn', { active: abaAtiva === 'materiais' }]" @click="abaAtiva = 'materiais'">
            MATERIAIS E EXERCÍCIOS
          </button>
        </div>

        <div class="conteudo-aba">
          <div v-if="abaAtiva === 'inscricoes'" class="fade-in">
            <h2 class="titulo-roxo">Cursos Disponíveis</h2>
            
            <div v-if="getInscricoes.length > 0" class="lista-itens">
              <div v-for="item in getInscricoes" :key="item.id" class="card-item">
                <div class="info">
                  <strong>{{ item.nome }}</strong>
                  <span>Prazo: {{ item.data_limite }}</span>
                </div>
                <a :href="item.link" target="_blank" class="btn-acao btn-verde">INSCREVER-SE</a>
              </div>
            </div>
            
            <div v-else class="aviso-vazio">
              <p>No momento, não temos inscrições abertas para esta matéria.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </template>
  <Footer />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import LoadingStatus from '../components/loading.vue'

const route = useRoute()
const baseUrl = "https://sem-parar-back.onrender.com"
const materia = ref(null)
const loading = ref(true)
const abaAtiva = ref('inscricoes')

const fetchData = async () => {
  loading.value = true
  materia.value = null
  try {
    const slugDaUrl = route.params.slug?.trim().toLowerCase()
    const res = await axios.get(`${baseUrl}/api/materias?populate[inscricoes][populate]=*&populate[materiais][populate]=*`)
    
    if (res.data?.data) {
      const encontrada = res.data.data.find(m => {
        const s = (m.attributes?.slug || m.slug)?.toString().trim().toLowerCase()
        return s === slugDaUrl
      })
      if (encontrada) {
        materia.value = encontrada
      }
    }
  } catch (error) {
    console.error("Erro:", error)
  } finally {
    loading.value = false
  }
}

const textoCoordenacao = computed(() => {
  const desc = materia.value?.attributes?.descricao || materia.value?.descricao
  if (!desc) return ["Conteúdo em breve..."]
  if (Array.isArray(desc)) {
    return desc.map(block => block.children ? block.children.map(c => c.text).join('') : "").filter(t => t.trim() !== "")
  }
  return [desc]
})

const getInscricoes = computed(() => {
  if (!materia.value) return [];
  // Tenta pegar de todas as formas que o Strapi pode enviar
  const lista = materia.value.attributes?.inscricoes || materia.value.inscricoes;
  return Array.isArray(lista) ? lista : [];
});

// Faça o mesmo para os materiais, já deixando pronto:
const getMateriais = computed(() => {
  if (!materia.value) return [];
  const lista = materia.value.attributes?.materiais || materia.value.materiais;
  return Array.isArray(lista) ? lista : [];
});

onMounted(fetchData)
watch(() => route.params.slug, fetchData)
</script>

<style scoped>
/* Estilos baseados no seu "Quem Somos" */
.container { flex: 1; width: 100%; max-width: 1080px; margin: 0 auto; padding: 40px 60px; font-family: 'Ruda', sans-serif; }

.titulo-principal {
  font-family: 'Sugo Display', sans-serif; /* Mesma fonte */
  color: #ff9a16;                          /* Mesmo laranja */
  font-size: 2.8rem;                       /* Mesmo tamanho do Quem Somos */
  margin: 0 0 25px 0;                      /* Mesmo espaçamento */
  text-align: center;                      /* Centralizado */
  text-transform: uppercase;               /* Reforço para caixa alta */
}

.descricao-box { max-width: 850px; margin: 0 auto 50px; text-align: center; color: #444; line-height: 1.6; }

/* Design das Abas */
.abas-container { display: flex; justify-content: center; gap: 5px; margin-bottom: -1px; }

.tab-btn {
  font-family: 'Sugo Display', sans-serif;
  padding: 15px 30px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  color: #890d8e;
  cursor: pointer;
  font-size: 1.1rem;
  border-radius: 10px 10px 0 0;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #ffffff;
  border-bottom: 3px solid #ff9a16; /* Destaque laranja */
  color: #25074f;
}

.conteudo-aba {
  background: white;
  padding: 40px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid #eee;
}

.titulo-roxo { font-family: 'Sugo Display', sans-serif; color: #890d8e; font-size: 1.8rem; margin-bottom: 30px; }

/* Itens da Lista */
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.btn-acao {
  font-family: 'Sugo Display', sans-serif;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  font-size: 0.9rem;
}

.btn-verde { background-color: #28a745; }
.btn-roxo { background-color: #890d8e; }

/* Estilo do Aviso Vazio */
.aviso-vazio {
  text-align: center;
  padding: 50px 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.aviso-vazio p { font-weight: bold; color: #666; margin: 10px 0; }
.aviso-vazio span { font-size: 0.9rem; color: #999; }

.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>