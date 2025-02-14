<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-white relative overflow-hidden">
    <!-- Floating Hearts Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="n in 20" :key="n" 
           class="absolute animate-float"
           :style="`left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 5}s; animation-duration: ${5 + Math.random() * 5}s`">
        <svg class="w-4 h-4 text-pink-300 opacity-50" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </div>

    <div class="relative p-6 flex flex-col items-center justify-center min-h-screen">
      <!-- Envelope Animation -->
      <div class="envelope-container relative mb-8 group" 
           :class="{ 'opened': isEnvelopeOpened }"
           @mouseenter="!isEnvelopeOpened && (isHovering = true)"
           @mouseleave="isHovering = false">
        <div class="envelope transform transition-transform duration-500 hover:scale-105">
          <div class="front flap" :class="{ 'hover-effect': isHovering }"></div>
          <div class="front pocket"></div>
          <div class="letter" @click="openEnvelope">
            <div class="text-content scroll-smooth" :class="{ 'show': isEnvelopeOpened }">
              <h1 class="text-4xl font-great-vibes text-pink-600 mb-8 animate-fade-in">
                Dear {{ name }},
              </h1>
              <div class="space-y-6 text-gray-700 leading-relaxed">
                <p v-for="(paragraph, index) in storyParagraphs" 
                   :key="index"
                   class="text-lg font-roboto animate-slide-up"
                   :style="{ animationDelay: `${index * 0.5 + 0.5}s` }">
                  {{ paragraph }}
                </p>
              </div>
              <div class="text-right mt-12 animate-fade-in" style="animation-delay: 2.5s">
                <p class="text-2xl font-great-vibes text-pink-600">
                  With all my love,
                </p>
                <p class="text-3xl font-great-vibes text-pink-600 mt-2">
                  Your Valentine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="mt-8 flex justify-center space-x-4" 
           v-show="isEnvelopeOpened"
           v-motion
           :initial="{ opacity: 0, y: 20 }"
           :enter="{ opacity: 1, y: 0, transition: { delay: 2000 } }">
        <button @click="goToMap"
                class="relative px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 
                       text-white rounded-full text-lg font-medium
                       transform hover:scale-105 transition-all duration-300
                       hover:shadow-lg hover:shadow-pink-500/25
                       active:scale-95">
          <span class="relative z-10">Explore Our Memories</span>
          <div class="absolute inset-0 rounded-full bg-white opacity-0 
                      hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
const store = useUserStore()

const name = computed(() => store.name || route.query.name || 'My Love')
const memories = computed(() => store.memories || [])
const isEnvelopeOpened = ref(false)
const isHovering = ref(false)

onMounted(async () => {
  await store.initFromUrl(true)
  setTimeout(openEnvelope, 1000)
})

const storyParagraphs = computed(() => {
  const generatedContent = store.generatedContent
  if (generatedContent?.story) {
    return [
      generatedContent.story,
      'Every moment with you feels like a beautiful dream come true. Your smile lights up my world in ways that words cannot express.',
      'As we continue this journey together, I want to share with you some of our most precious memories that have made our story so special.',
      'Click the button below to revisit those magical moments we have shared together.'
    ]
  }
  return [
    'Every moment with you feels like a beautiful dream come true. Your smile lights up my world in ways that words cannot express.',
    'As we continue this journey together, I want to share with you some of our most precious memories that have made our story so special.',
    'Click the button below to revisit those magical moments we have shared together.'
  ]
})

function openEnvelope() {
  if (!isEnvelopeOpened.value) {
    isEnvelopeOpened.value = true
    isHovering.value = false
  }
}

function goToMap() {
  router.push({
    path: '/map',
    query: route.query
  })
}
</script>

<style scoped>
.envelope-container {
  width: 340px;
  height: 240px;
  position: relative;
  transition: transform 0.5s;
}

.envelope {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #fff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.front.flap {
  position: absolute;
  width: 100%;
  height: 90px;
  bottom: 100%;
  background: linear-gradient(45deg, #f8b4d9 0%, #f687b3 100%);
  clip-path: polygon(0 50%, 50% 0, 100% 50%, 100% 100%, 0 100%);
  transform-origin: bottom;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.front.flap.hover-effect {
  transform: rotateX(20deg);
}

.front.pocket {
  position: absolute;
  width: 100%;
  height: 90px;
  bottom: 0;
  background: linear-gradient(45deg, #f687b3 0%, #f8b4d9 100%);
  clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%);
}

.letter {
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 15px;
  top: 15px;
  background-color: white;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;
  cursor: pointer;
  padding: 30px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.text-content {
  opacity: 0;
  transition: opacity 0.8s;
  transition-delay: 0.8s;
}

.text-content.show {
  opacity: 1;
}

.opened .front.flap {
  transform: rotateX(180deg);
}

.opened .letter {
  transform: translateY(-70px);
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.animate-float {
  animation: float infinite ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.8s ease-out forwards;
}

/* Custom scrollbar for the letter */
.letter::-webkit-scrollbar {
  width: 8px;
}

.letter::-webkit-scrollbar-track {
  background: #fdf2f8;
  border-radius: 4px;
}

.letter::-webkit-scrollbar-thumb {
  background: #f8b4d9;
  border-radius: 4px;
}

.letter::-webkit-scrollbar-thumb:hover {
  background: #f687b3;
}
</style>