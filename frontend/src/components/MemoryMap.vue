<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-white p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
        <p class="text-gray-700 font-roboto">Loading your memories...</p>
      </div>
    </div>
    <!-- Header -->
    <header class="text-center mb-12" role="banner">
      <h1 class="text-4xl font-great-vibes text-pink-600 mb-4">Our Memory Collection</h1>
      <p class="text-lg text-gray-700 font-roboto">Each heart holds a precious moment we've shared</p>
    </header>

    <!-- Memory Map Grid -->
    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
         role="grid"
         aria-label="Memory collection grid">
      <div v-for="(memory, index) in memories" 
           :key="index"
           class="memory-card relative"
           :class="{ 'revealed': revealedMemories[index] }"
           @click="revealMemory(index)"
           @keydown.enter="revealMemory(index)"
           @keydown.space.prevent="revealMemory(index)"
           tabindex="0"
           role="gridcell"
           :aria-label="`Memory ${index + 1}${revealedMemories[index] ? ': ' + memory.text : ''}`"
           :aria-expanded="revealedMemories[index]">
        <!-- Card Front (Heart) -->
        <div class="card-front"
             :aria-hidden="revealedMemories[index]">
          <div class="heart-icon text-6xl">❤️</div>
          <div class="memory-number font-great-vibes text-2xl text-pink-600">
            Memory #{{ index + 1 }}
          </div>
        </div>

        <!-- Card Back (Memory Content) -->
        <div class="card-back bg-white p-6 rounded-lg shadow-lg"
             :aria-hidden="!revealedMemories[index]">
          <p class="text-gray-700 font-roboto text-lg mb-4">{{ memory.text }}</p>
          <div class="text-sm text-pink-500">
            {{ memory.date ? formatDate(memory.date) : 'Date not specified' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="fixed bottom-6 right-6">
      <button @click="goToKeepsake" 
              class="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600
                     transform hover:scale-105 transition-all duration-300 shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              aria-label="Create keepsake card">
        Create Keepsake 🎁
      </button>
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
.memory-card {
  perspective: 1000px;
  height: 300px;
  cursor: pointer;
  outline: none;
}

.memory-card:focus {
  outline: 2px solid rgb(236, 72, 153);
  outline-offset: 2px;
  border-radius: 0.5rem;
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

/* Screen reader only class */
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