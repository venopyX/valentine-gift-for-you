<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-white p-6">
    <!-- Header -->
    <header class="text-center mb-12">
      <h1 class="text-4xl font-great-vibes text-pink-600 mb-4">Our Memory Collection</h1>
      <p class="text-lg text-gray-700 font-roboto">Each heart holds a precious moment we've shared</p>
    </header>

    <!-- Memory Map Grid -->
    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(memory, index) in memoriesWithDefault" 
           :key="index"
           class="memory-card"
           :class="{ 'revealed': revealedMemories[index] }"
           @click="revealMemory(index)">
        <!-- Card Front (Heart) -->
        <div class="card-front">
          <div class="heart-icon text-6xl">❤️</div>
          <div class="memory-number font-great-vibes text-2xl text-pink-600">
            Memory #{{ index + 1 }}
          </div>
        </div>

        <!-- Card Back (Memory Content) -->
        <div class="card-back bg-white p-6 rounded-lg shadow-lg">
          <p class="text-gray-700 font-roboto text-lg mb-4">{{ memory }}</p>
          <div class="text-sm text-pink-500">{{ formatDate(date) }}</div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="fixed bottom-6 right-6">
      <button @click="goToKeepsake" 
              class="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600
                     transform hover:scale-105 transition-all duration-300 shadow-lg">
        Create Keepsake 🎁
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { generateMessage } from '../services/ai-generator'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const name = computed(() => userStore.name || route.query.name || 'My Love')
const date = computed(() => userStore.date || route.query.date || '')
const memories = computed(() => {
  const userMemories = userStore.memories || []
  return Array.isArray(userMemories) ? userMemories : [userMemories]
})

// Default memories if none provided
const defaultMemories = [
  'Our first meeting - a moment that changed everything',
  'That time we laughed until we cried',
  'Dancing in the rain together',
  'Our midnight adventures and starlit conversations',
  'The way you smile when you\'re truly happy',
  'Those quiet moments when words aren\'t needed'
]

const memoriesWithDefault = computed(() => {
  const userMemories = memories.value
  if (!userMemories.length) return defaultMemories
  return [...userMemories, ...defaultMemories.slice(userMemories.length)].slice(0, 6)
})

const revealedMemories = ref(new Array(6).fill(false))

function revealMemory(index) {
  revealedMemories.value[index] = !revealedMemories.value[index]
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function goToKeepsake() {
  router.push({
    path: '/keepsake',
    query: route.query
  })
}
</script>

<style scoped>
.memory-card {
  perspective: 1000px;
  height: 300px;
  cursor: pointer;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-front {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-back {
  transform: rotateY(180deg);
}

.revealed .card-front {
  transform: rotateY(180deg);
}

.revealed .card-back {
  transform: rotateY(0);
}

.heart-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>