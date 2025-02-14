<!-- src/components/TeaserPage.vue -->
<template>
  <div class="min-h-screen relative flex flex-col justify-center items-center bg-gradient-to-br from-rose-100 via-pink-50 to-violet-100 p-6 overflow-hidden">
    <!-- Animated background patterns -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute inset-0 pattern-grid animate-slide-slow"></div>
    </div>

    <!-- Floating elements background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Hearts -->
      <div v-for="n in 15" :key="`heart-${n}`" 
           class="absolute text-2xl animate-float"
           :style="{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 7}s`,
             animationDuration: `${6 + Math.random() * 6}s`,
             opacity: 0.6
           }">
        ❤️
      </div>
      
      <!-- Sparkles -->
      <div v-for="n in 20" :key="`sparkle-${n}`"
           class="absolute w-2 h-2 bg-pink-200 rotate-45 animate-sparkle"
           :style="{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 4}s`,
             scale: `${0.5 + Math.random() * 1}`
           }">
      </div>
    </div>

    <audio ref="audio" :src="audioSrc" loop v-if="audioEnabled" />

    <!-- Main Content Container with Glass Effect -->
    <div class="relative z-10 w-full max-w-2xl mx-auto">
      <div class="backdrop-blur-sm bg-white/30 p-8 md:p-12 rounded-3xl shadow-2xl border border-white/40 animate-reveal">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="text-sm font-medium text-rose-600/70 tracking-wider mb-3 animate-fade-in" style="animation-delay: 0.5s">
            A Special Valentine's Surprise For
          </div>
          <h1 class="text-4xl md:text-6xl font-great-vibes text-rose-600 mb-6 animate-fade-in" style="animation-delay: 1s">
            {{ formattedName }}
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto"></div>
        </div>

        <!-- Message -->
        <div class="space-y-6 text-center animate-fade-in" style="animation-delay: 1.5s">
          <p class="text-xl md:text-2xl text-gray-700 max-w-lg mx-auto leading-relaxed font-serif italic">
            "A journey through our precious moments awaits..."
          </p>
          <p class="text-lg text-rose-500/90 animate-pulse font-medium tracking-wide">
            Your Valentine's adventure begins in {{ formatTime(countdown) }}
          </p>
        </div>

        <!-- Controls -->
        <div class="mt-10 flex flex-col items-center space-y-4 animate-fade-in" style="animation-delay: 2s">
          <button @click="goToPuzzle" 
                  class="group relative px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span class="relative flex items-center gap-2 text-white font-medium tracking-wide">
              Begin Journey
              <span class="text-lg">→</span>
            </span>
          </button>
          
          <button @click="toggleAudio" 
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-rose-500 transition-colors duration-300">
            <span class="text-lg">{{ audioEnabled ? '🔇' : '🔊' }}</span>
            {{ audioEnabled ? 'Mute Music' : 'Play Music' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Format name by replacing %20 with space and properly capitalizing
const formattedName = computed(() => {
  const rawName = route.query.name || userStore.name || 'Someone Special'
  return decodeURIComponent(rawName)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
})

const date = ref(route.query.date || userStore.date || '')
const memories = ref(
  route.query.memories 
    ? decodeURIComponent(route.query.memories).split(',') 
    : userStore.memories || []
)

// Store the data in Pinia
userStore.updateUser({
  name: formattedName.value,
  date: date.value,
  memories: memories.value
})

// Audio and countdown state
const audioEnabled = ref(false)
const audioSrc = '/assets/audio/romantic-melody.mp3'
const countdown = ref(10) // Increased to 10 seconds
let countdownTimer = null
let autoRedirectTimer = null

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function goToPuzzle() {
  clearInterval(countdownTimer)
  clearTimeout(autoRedirectTimer)
  router.push({
    path: '/puzzle',
    query: route.query
  })
}

function toggleAudio() {
  audioEnabled.value = !audioEnabled.value
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
  autoRedirectTimer = setTimeout(goToPuzzle, countdown.value * 1000)
})

onBeforeUnmount(() => {
  clearInterval(countdownTimer)
  clearTimeout(autoRedirectTimer)
})
</script>

<style scoped>
/* Pattern background */
.pattern-grid {
  background-size: 20px 20px;
  background-image: 
    linear-gradient(to right, rgba(219, 39, 119, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(219, 39, 119, 0.1) 1px, transparent 1px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-20px) rotate(10deg) scale(1.1);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1) rotate(45deg);
  }
}

@keyframes reveal {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float ease-in-out infinite;
}

.animate-sparkle {
  animation: sparkle ease-in-out infinite;
}

.animate-reveal {
  animation: reveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-slide-slow {
  animation: slide 20s linear infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
  opacity: 0;
}

/* Make sure to import these fonts in your main CSS file */
.font-great-vibes {
  font-family: 'Great Vibes', cursive;
}
</style>