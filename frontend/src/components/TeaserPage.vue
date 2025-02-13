<!-- src/components/TeaserPage.vue -->
<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 to-white p-6 overflow-hidden">
    <audio ref="audio" :src="audioSrc" loop v-if="audioEnabled" />
    
    <!-- Floating Hearts Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="n in 20" :key="n" 
           class="absolute animate-float"
           :style="{
             left: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${5 + Math.random() * 5}s`
           }">
        ❤️
      </div>
    </div>

    <!-- Main Content -->
    <div class="text-center z-10 animate-reveal">
      <h1 class="text-4xl md:text-5xl font-great-vibes text-pink-600 mb-6">
        Dear {{ name }}
      </h1>
      <p class="text-xl md:text-2xl text-gray-700 max-w-lg mx-auto leading-relaxed font-roboto">
        A magical journey of love and memories awaits you...
      </p>
      <p class="text-lg text-pink-500 mt-4 animate-pulse">
        Your Valentine's adventure begins in {{ countdown }} seconds
      </p>
    </div>

    <!-- Controls -->
    <div class="mt-8 flex flex-col items-center space-y-4 z-10">
      <button @click="goToPuzzle" 
              class="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 
                     transform hover:scale-105 transition-all duration-300 font-roboto">
        Begin Journey
      </button>
      <button @click="toggleAudio" 
              class="text-sm text-gray-600 hover:text-pink-500 transition-colors duration-300">
        {{ audioEnabled ? '🔇 Mute Music' : '🔊 Play Music' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Extract and store parameters
const name = ref(route.query.name || 'Someone Special')
const date = ref(route.query.date || '')
const memories = ref(route.query.memories ? route.query.memories.split(',') : [])

// Store the data in Pinia
userStore.updateUser({
  name: name.value,
  date: date.value,
  memories: memories.value
})

// Audio state
const audioEnabled = ref(false)
const audioSrc = '/assets/audio/romantic-melody.mp3' // You'll need to add this file
const countdown = ref(5)
let countdownTimer = null
let autoRedirectTimer = null

function goToPuzzle() {
  clearInterval(countdownTimer)
  clearTimeout(autoRedirectTimer)
  router.push({
    path: '/puzzle',
    query: route.query // Preserve URL parameters
  })
}

function toggleAudio() {
  audioEnabled.value = !audioEnabled.value
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
    }
  }, 3000)
}

onMounted(() => {
  startCountdown()
  autoRedirectTimer = setTimeout(goToPuzzle, 5000)
})

onBeforeUnmount(() => {
  clearInterval(countdownTimer)
  clearTimeout(autoRedirectTimer)
})
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float ease-in-out infinite;
  opacity: 0.6;
}

.animate-reveal {
  animation: reveal 1s ease-out forwards;
}

/* Font imports */
.font-great-vibes {
  font-family: 'Great Vibes', cursive;
}

.font-roboto {
  font-family: 'Roboto', sans-serif;
}
</style>
