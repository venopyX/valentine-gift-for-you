<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-white relative overflow-hidden">
    <!-- Floating Hearts Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="n in 20" :key="n" 
           class="absolute animate-float"
           :style="`left: ${Math.random() * 100}%; animation-delay: -${Math.random() * 5}s; animation-duration: ${5 + Math.random() * 5}s`">
        <span class="text-pink-200 text-opacity-30 text-4xl">❤</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" 
         class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="text-center">
        <div class="heart-loader mb-6"></div>
        <p class="text-gray-700 font-roboto animate-pulse">Loading our precious memories...</p>
      </div>
    </div>

    <div class="container mx-auto p-6 relative z-10">
      <!-- Header with Decorative Elements -->
      <header class="text-center mb-16 relative" role="banner">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
        <h1 class="text-5xl font-great-vibes text-pink-600 mb-4 animate-fade-in">
          Our Memory Collection
        </h1>
        <p class="text-lg text-gray-700 font-roboto italic">
          ✨ Each heart holds a precious moment we've shared ✨
        </p>
        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
      </header>

      <!-- Memory Map Grid -->
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
           role="grid"
           aria-label="Memory collection grid">
        <div v-for="(memory, index) in memories" 
             :key="index"
             class="memory-card relative group"
             :class="{ 'revealed': revealedMemories[index] }"
             @click="revealMemory(index)"
             @keydown.enter="revealMemory(index)"
             @keydown.space.prevent="revealMemory(index)"
             tabindex="0"
             role="gridcell"
             :aria-label="`Memory ${index + 1}${revealedMemories[index] ? ': ' + memory.text : ''}`"
             :aria-expanded="revealedMemories[index]">
          
          <!-- Card Front -->
          <div class="card-front">
            <div class="glowing-heart">❤️</div>
            <div class="memory-number font-great-vibes text-2xl text-pink-600 mt-4">
              Memory #{{ index + 1 }}
            </div>
            <div class="absolute bottom-4 text-sm text-pink-400 opacity-75">Click to reveal</div>
          </div>

          <!-- Card Back -->
          <div class="card-back">
            <div class="relative h-full w-full bg-white rounded-2xl p-6 shadow-2xl">
              <div class="absolute -top-3 -left-3 text-4xl">💝</div>
              <div class="absolute -bottom-3 -right-3 text-4xl">💖</div>
              <p class="text-gray-700 font-roboto text-lg mb-4 italic">
                "{{ memory.text }}"
              </p>
              <div class="text-sm text-pink-500 font-semibold">
                {{ memory.date ? formatDate(memory.date) : 'A timeless moment' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="fixed bottom-8 right-8">
        <button @click="goToKeepsake" 
                class="navigation-button">
          Create Keepsake 🎁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { formatDate } from '../utils/formatDate'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// State
const revealedMemories = ref([])
const isInitialized = ref(false)
const isLoading = ref(true)

// Computed properties
const name = computed(() => userStore.name || route.query.name || 'My Love')

const memories = computed(() => {
  // First try to get AI-generated memories
  const generatedContent = userStore.generatedContent
  if (generatedContent?.shortMemories?.length > 0) {
    return generatedContent.shortMemories.map(memory => ({
      text: memory.memory || '',
      date: memory.date || ''
    }))
  }

  // Fallback to store memories
  if (userStore.memories?.length > 0) {
    return userStore.memories.map(memory => ({
      text: memory.text || '',
      date: memory.date || ''
    }))
  }

  return []
})

// Initialize revealed state for each memory
function initializeMemories() {
  revealedMemories.value = new Array(memories.value.length).fill(false)
  isInitialized.value = true
}

onMounted(async () => {
  if (!isInitialized.value) {
    try {
      isLoading.value = true
      // Initialize store and generate content
      await userStore.initFromUrl(true)
      initializeMemories()
    } catch (error) {
      console.error('Error initializing memories:', error)
      // Show error message to user
      announceToScreenReader('Error loading memories. Please try again.')
    } finally {
      isLoading.value = false
    }
  }
})

// Watch for store content changes
watch(
  () => userStore.generatedContent,
  (newContent) => {
    if (newContent?.shortMemories) {
      initializeMemories()
    }
  }
)

// Watch for memory changes
watch(
  () => userStore.memories,
  (newMemories) => {
    if (newMemories?.length > 0) {
      initializeMemories()
    }
  }
)

// Methods
function revealMemory(index) {
  if (index >= 0 && index < revealedMemories.value.length) {
    revealedMemories.value[index] = !revealedMemories.value[index]
    
    // Announce to screen readers
    const memory = memories.value[index]
    const action = revealedMemories.value[index] ? 'revealed' : 'hidden'
    announceToScreenReader(`Memory ${index + 1} ${action}: ${revealedMemories.value[index] ? memory.text : ''}`)
  }
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('class', 'sr-only')
  announcement.textContent = message
  document.body.appendChild(announcement)
  setTimeout(() => document.body.removeChild(announcement), 1000)
}

function goToKeepsake() {
  router.push({
    path: '/keepsake',
    query: {
      ...route.query,
      revealed: revealedMemories.value.join(',')
    }
  })
}
</script>

<style scoped>
/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(244, 114, 182, 0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(244, 114, 182, 0.8)); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

/* Heart Loader */
.heart-loader {
  width: 50px;
  height: 50px;
  position: relative;
  margin: 0 auto;
}

.heart-loader::before,
.heart-loader::after {
  content: "";
  position: absolute;
  top: 0;
  width: 25px;
  height: 40px;
  border-radius: 40px 40px 0 0;
  background-color: rgb(236, 72, 153);
  transform: rotate(-45deg);
  transform-origin: 100% 100%;
  animation: pulse 1s infinite;
}

.heart-loader::after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 0 100%;
}

/* Memory Cards */
.memory-card {
  perspective: 1000px;
  height: 320px;
  cursor: pointer;
  outline: none;
}

.memory-card:focus {
  outline: 2px solid rgb(236, 72, 153);
  outline-offset: 4px;
  border-radius: 1rem;
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
  background: linear-gradient(135deg, white, rgb(252, 231, 243));
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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

.glowing-heart {
  font-size: 4rem;
  animation: glow 2s infinite;
}

/* Navigation Button */
.navigation-button {
  background: linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119));
  color: white;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.navigation-button:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.navigation-button:active {
  transform: scale(0.98);
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
