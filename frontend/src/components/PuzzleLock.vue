<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 to-white p-6">
    <!-- Puzzle Container -->
    <div class="max-w-md w-full text-center">
      <h1 class="text-3xl md:text-4xl font-great-vibes text-pink-600 mb-8">
        Unlock Your Valentine's Journey
      </h1>

      <!-- Heart-shaped Lock -->
      <div class="relative w-64 h-64 mx-auto mb-8">
        <div class="absolute inset-0 heart-shape bg-pink-500 transform transition-transform"
             :class="{ 'rotate-unlock': isUnlocked }">
          <!-- Lock Design -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div v-if="!isUnlocked" class="text-white text-6xl">🔒</div>
            <div v-else class="text-white text-6xl">🔓</div>
          </div>
        </div>
      </div>

      <!-- Puzzle Interface -->
      <div class="space-y-6 mb-8">
        <p class="text-gray-700 text-lg font-roboto">
          Arrange the letters to spell a special word:
        </p>
        
        <!-- Letter Tiles -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <button v-for="(letter, index) in shuffledLetters" 
                  :key="index"
                  @click="selectLetter(letter, index)"
                  :disabled="selectedIndices.includes(index)"
                  class="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center
                         text-xl font-bold text-pink-600 transition-transform hover:scale-110"
                  :class="{ 'opacity-50': selectedIndices.includes(index) }">
            {{ letter }}
          </button>
        </div>

        <!-- Answer Display -->
        <div class="flex justify-center gap-2 mb-4">
          <div v-for="(letter, index) in currentAnswer" 
               :key="'answer-' + index"
               class="w-12 h-12 rounded-lg border-2 border-pink-300 flex items-center justify-center
                      text-xl font-bold text-pink-600 bg-white">
            {{ letter || '_' }}
          </div>
        </div>

        <!-- Reset Button -->
        <button @click="resetPuzzle"
                class="px-4 py-2 text-sm text-pink-600 hover:text-pink-700 transition-colors">
          Reset Puzzle
        </button>

        <!-- Hint -->
        <p v-if="showHint" class="text-sm text-gray-500 animate-fade-in">
          Hint: It's the most beautiful name in the world 💖
        </p>
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
const userStore = useUserStore()

// Get the name from the store or URL
const targetWord = computed(() => userStore.name || route.query.name || 'LOVE')

// State
const shuffledLetters = ref([])
const currentAnswer = ref([])
const selectedIndices = ref([])
const isUnlocked = ref(false)
const showHint = ref(false)

// Shuffle the letters of the name
function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Initialize the puzzle
function initializePuzzle() {
  const letters = targetWord.value.toUpperCase().split('')
  shuffledLetters.value = shuffleArray(letters)
  currentAnswer.value = new Array(letters.length).fill('')
  selectedIndices.value = []
  isUnlocked.value = false
  showHint.value = false
}

// Handle letter selection
function selectLetter(letter, index) {
  const emptyIndex = currentAnswer.value.findIndex(l => l === '')
  if (emptyIndex !== -1) {
    currentAnswer.value[emptyIndex] = letter
    selectedIndices.value.push(index)

    // Check if puzzle is solved
    if (!currentAnswer.value.includes('') && 
        currentAnswer.value.join('') === targetWord.value.toUpperCase()) {
      isUnlocked.value = true
      setTimeout(() => {
        router.push({
          path: '/story',
          query: route.query
        })
      }, 2000)
    } else if (!currentAnswer.value.includes('')) {
      // Wrong answer - show hint and reset after delay
      showHint.value = true
      setTimeout(resetPuzzle, 2000)
    }
  }
}

// Reset the puzzle
function resetPuzzle() {
  currentAnswer.value = new Array(targetWord.value.length).fill('')
  selectedIndices.value = []
  showHint.value = false
}

// Initialize on mount
onMounted(() => {
  initializePuzzle()
})
</script>

<style scoped>
.heart-shape {
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: center;
}

.heart-shape:before,
.heart-shape:after {
  content: '';
  width: 50%;
  height: 80%;
  background: currentColor;
  border-radius: 50px 50px 0 0;
  position: absolute;
  top: 0;
}

.heart-shape:before {
  left: 50%;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
}

.heart-shape:after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}

.rotate-unlock {
  animation: unlockAnimation 1s forwards;
}

@keyframes unlockAnimation {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.font-great-vibes {
  font-family: 'Great Vibes', cursive;
}

.font-roboto {
  font-family: 'Roboto', sans-serif;
}
</style>
