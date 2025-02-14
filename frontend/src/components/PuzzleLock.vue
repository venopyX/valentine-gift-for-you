<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 to-white p-6 overflow-hidden">
    <!-- Floating Hearts Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="n in 12" :key="n"
           class="absolute animate-float"
           :style="`left: ${Math.random() * 100}%; animation-delay: -${Math.random() * 5}s; animation-duration: ${5 + Math.random() * 5}s`">
        <span class="text-pink-200 text-opacity-20 text-3xl">❤</span>
      </div>
    </div>

    <!-- Puzzle Container -->
    <div class="mx-8 max-w-full w-full text-center relative z-10">
      <div class="flex flex-col items-center mb-8">
        <div class="glow-effect mb-4">
          <h1 class="text-3xl md:text-4xl font-great-vibes text-pink-600">
            Unlock Your Valentine's Journey
          </h1>
        </div>

        <!-- Heart-shaped Lock -->
        <!-- Heart Container -->
        <div class="heart-container relative">
          <!-- SVG Heart -->
          <div class="w-48 h-48 relative">
            <svg class="heart-shape" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:rgb(236, 72, 153);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(219, 39, 119);stop-opacity:1" />
                </linearGradient>
                <linearGradient id="unlocked-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:rgb(167, 243, 208);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(110, 231, 183);stop-opacity:1" />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgb(236, 72, 153)" flood-opacity="0.3"/>
                </filter>
              </defs>
              <path
                :class="{ 'unlocked': isUnlocked }"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="url(#heart-gradient)"
                filter="url(#shadow)"
              />
            </svg>

            <!-- Lock Icon Container -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div v-if="!isUnlocked"
                   class="text-6xl animate-bounce-gentle lock-icon"
                   style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
                🔒
              </div>
              <div v-else
                   class="text-6xl animate-pop lock-icon"
                   style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
                🔓
              </div>
            </div>

            <!-- Sparkles when unlocked -->
            <div v-if="isUnlocked" class="sparkles">
              <span class="sparkle" style="--delay: 0s">✨</span>
              <span class="sparkle" style="--delay: 0.3s">✨</span>
              <span class="sparkle" style="--delay: 0.6s">✨</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Puzzle Interface -->
      <div class="space-y-6 mb-8 bg-white bg-opacity-90 p-6 rounded-xl shadow-lg backdrop-blur-sm max-w-screen px-4 mx-auto">
        <p class="text-gray-700 text-lg font-roboto">
          Arrange the letters to spell a special word:
        </p>

        <!-- Letter Tiles -->
        <div class="flex flex-wrap justify-center gap-3 mb-6">
          <button v-for="(letter, index) in shuffledLetters"
                  :key="index"
                  @click="selectLetter(letter, index)"
                  :disabled="selectedIndices.includes(index)"
                  class="letter-tile"
                  :class="{ 'opacity-50 cursor-not-allowed': selectedIndices.includes(index) }">
            {{ letter }}
          </button>
        </div>

        <!-- Answer Display -->
        <div class="flex justify-center gap-3 mb-6">
          <div v-for="(letter, index) in currentAnswer"
               :key="'answer-' + index"
               class="answer-slot"
               :class="{ 'populated': letter }">
            {{ letter || '_' }}
          </div>
        </div>

        <!-- Reset Button -->
        <button @click="resetPuzzle"
                class="reset-button">
          Reset Puzzle
        </button>

        <!-- Hint -->
        <p v-if="showHint" class="text-sm text-gray-500 animate-fade-in mt-4">
          Hint: It's the most beautiful name in the world 💝
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

// Get and decode the name from the store or URL
const targetWord = computed(() => {
  const name = userStore.name || route.query.name || 'LOVE'
  // Decode URL-encoded spaces and normalize multiple spaces
  return decodeURIComponent(name).replace(/\s+/g, ' ')
})

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
    const currentWord = currentAnswer.value.join('')
    const targetUpperCase = targetWord.value.toUpperCase()

    if (!currentAnswer.value.includes('') && currentWord === targetUpperCase) {
      isUnlocked.value = true
      setTimeout(() => {
        router.push({
          path: '/story',
          query: {
            ...route.query,
            name: targetWord.value // Ensure we pass the decoded name forward
          }
        })
      }, 2000)
    } else if (!currentAnswer.value.includes('')) {
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
/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pop {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

.animate-pop {
  animation: pop 0.5s ease-out forwards;
}

/* Heart Shape & Lock */
.heart-container {
  background-color: transparent;
}

.heart-shape {
  width: 100%;
  height: 100%;
  transition: all 0.5s ease;
  transform-origin: center;
}

.heart-shape path {
  transition: all 0.5s ease;
}

.heart-shape path.unlocked {
  fill: url(#unlocked-gradient);
  transform: scale(1.1);
}

.lock-icon {
  transform-origin: center;
  z-index: 20;
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

@keyframes pop {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-pop {
  animation: pop 0.5s ease-out forwards;
}

.sparkles {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0;
  animation: sparkle-fade 1.5s ease-in-out infinite;
  animation-delay: var(--delay);
}

.sparkle:nth-child(1) {
  top: 20%;
  left: 20%;
}

.sparkle:nth-child(2) {
  top: 20%;
  right: 20%;
}

.sparkle:nth-child(3) {
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes sparkle-fade {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

#gradient {
  background: linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119));
}

#unlocked-gradient {
  background: linear-gradient(135deg, rgb(167, 243, 208), rgb(110, 231, 183));
}

/* Letter Tiles */
.letter-tile {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, white, rgb(252, 231, 243));
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: rgb(219, 39, 119);
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.letter-tile:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 12px rgba(236, 72, 153, 0.2);
}

.letter-tile:active:not(:disabled) {
  transform: scale(0.95);
}

/* Answer Slots */
.answer-slot {
  width: 3rem;
  height: 3rem;
  border: 2px dashed rgb(236, 72, 153);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: rgb(219, 39, 119);
  transition: all 0.3s ease;
}

.answer-slot.populated {
  border-style: solid;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Reset Button */
.reset-button {
  padding: 0.5rem 1rem;
  color: rgb(236, 72, 153);
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
}

.reset-button:hover {
  color: rgb(219, 39, 119);
  background: rgb(252, 231, 243);
}

/* Sparkles Effect */
.sparkles::before,
.sparkles::after {
  content: '✨';
  position: absolute;
  animation: sparkle 1s ease-in-out infinite;
}

.sparkles::before {
  left: 20%;
  top: 20%;
  animation-delay: -0.5s;
}

.sparkles::after {
  right: 20%;
  top: 20%;
}

/* Glow Effect */
.glow-effect {
  position: relative;
}

.glow-effect::after {
  content: '';
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent 70%);
  z-index: -1;
  filter: blur(10px);
}

/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
