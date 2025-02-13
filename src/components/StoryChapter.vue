<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-white p-6 flex flex-col items-center justify-center">
    <!-- Envelope Animation -->
    <div class="envelope-container mb-8" :class="{ 'opened': isEnvelopeOpened }">
      <div class="envelope">
        <div class="front flap"></div>
        <div class="front pocket"></div>
        <div class="letter" @click="openEnvelope">
          <div class="text-content" :class="{ 'show': isEnvelopeOpened }">
            <h1 class="text-3xl font-great-vibes text-pink-600 mb-6">Dear {{ name }},</h1>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p class="text-lg font-roboto" v-for="(paragraph, index) in storyParagraphs" :key="index"
                 :style="{ animationDelay: `${index * 0.5}s` }">
                {{ paragraph }}
              </p>
            </div>
            <p class="text-right mt-8 text-xl font-great-vibes text-pink-600">
              With all my love,<br>
              Your Valentine
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-center space-x-4" v-show="isEnvelopeOpened">
      <button @click="goToMap" 
              class="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600
                     transform hover:scale-105 transition-all duration-300 font-roboto">
        Explore Our Memories
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { generateMessage } from '../services/ai-generator'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const name = computed(() => userStore.name || route.query.name || 'My Love')
const date = computed(() => userStore.date || route.query.date || '')
const memories = computed(() => userStore.memories || [])

const isEnvelopeOpened = ref(false)

// Generate personalized story paragraphs
const storyParagraphs = computed(() => [
  generateMessage('loveLetter', { name: name.value, date: date.value }),
  'Every moment with you feels like a beautiful dream come true. Your smile lights up my world in ways that words cannot express.',
  'As we continue this journey together, I want to share with you some of our most precious memories that have made our story so special.',
  'Click the button below to revisit those magical moments we have shared together.'
])

function openEnvelope() {
  if (!isEnvelopeOpened.value) {
    isEnvelopeOpened.value = true
  }
}

function goToMap() {
  router.push({
    path: '/map',
    query: route.query
  })
}

// Auto-open envelope after a short delay
onMounted(() => {
  setTimeout(openEnvelope, 1000)
})
</script>

<style scoped>
.envelope-container {
  width: 300px;
  height: 200px;
  position: relative;
  transition: transform 0.5s;
}

.envelope {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.front.flap {
  position: absolute;
  width: 100%;
  height: 80px;
  bottom: 100%;
  background-color: #f8b4d9;
  clip-path: polygon(0 50%, 50% 0, 100% 50%, 100% 100%, 0 100%);
  transform-origin: bottom;
  transition: transform 0.5s ease-in-out;
}

.front.pocket {
  position: absolute;
  width: 100%;
  height: 80px;
  bottom: 0;
  background-color: #f8b4d9;
  clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%);
}

.letter {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  top: 10px;
  background-color: white;
  transition: transform 0.5s;
  transform-origin: bottom;
  cursor: pointer;
  padding: 20px;
  overflow-y: auto;
}

.text-content {
  opacity: 0;
  transition: opacity 0.5s;
  transition-delay: 0.5s;
}

.text-content.show {
  opacity: 1;
}

.opened .front.flap {
  transform: rotateX(180deg);
}

.opened .letter {
  transform: translateY(-60px);
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>