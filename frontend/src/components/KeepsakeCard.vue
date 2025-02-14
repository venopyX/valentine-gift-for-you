<template>
    <div :style="{
      minHeight: '100vh',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgb(252, 231, 243) 0%, rgb(255, 255, 255) 100%)'
    }">
      <!-- Keepsake Card -->
      <div ref="cardRef" :style="{
        maxWidth: '42rem',
        width: '100%',
        background: 'linear-gradient(135deg, rgb(255, 245, 247) 0%, rgb(255, 255, 255) 100%)',
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        border: '1px solid rgba(248, 180, 217, 0.2)'
      }">
        <div :style="{ textAlign: 'center', marginBottom: '2rem' }">
          <h1 :style="{
            fontSize: '2.25rem',
            fontFamily: 'Great Vibes, cursive',
            color: 'rgb(219, 39, 119)',
            marginBottom: '1rem'
          }">Happy Valentine's Day</h1>
          <h2 :style="{
            fontSize: '1.5rem',
            fontFamily: 'Great Vibes, cursive',
            color: 'rgb(236, 72, 153)'
          }">{{ name }}</h2>
        </div>
  
      <!-- Love Poem -->
      <div class="poem-section">
        <div class="decorative-heart left">♥</div>
        <p>{{ poem }}</p>
        <div class="decorative-heart right">♥</div>
      </div>

      <!-- Memory Grid -->
      <div class="memories-section">
        <h3>Our Special Moments</h3>
        <div class="memory-grid">
          <div v-for="(memory, index) in displayedMemories"
               :key="index"
               class="memory-card">
            <p class="memory-text">{{ memory.text }}</p>
            <p class="memory-date">
              {{ memory.date ? formatDate(memory.date) : 'Date not specified' }}
            </p>
          </div>
        </div>
      </div>
  
        <!-- Signature -->
        <div :style="{ textAlign: 'right' }">
          <p :style="{
            fontFamily: 'Great Vibes, cursive',
            fontSize: '1.5rem',
            color: 'rgb(219, 39, 119)'
          }">With Love,</p>
          <p :style="{
            fontFamily: 'Great Vibes, cursive',
            fontSize: '1.25rem',
            color: 'rgb(236, 72, 153)'
          }">Your Valentine</p>
          <p :style="{
            fontSize: '0.875rem',
            color: 'rgb(107, 114, 128)',
            marginTop: '0.5rem'
          }">{{ formatDate(date) }}</p>
        </div>
  
        <!-- Decorative Elements -->
        <div :style="{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          fontSize: '2.25rem',
          animation: 'float-slow 3s ease-in-out infinite'
        }">❤️</div>
        <div :style="{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          fontSize: '2.25rem',
          animation: 'float-slow 3s ease-in-out infinite',
          animationDelay: '200ms'
        }">❤️</div>
      </div>
  
    <!-- Download Button -->
    <button @click="downloadCard"
            :disabled="isGenerating"
            class="download-button relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                   transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-pink-500/25">
      <span class="relative z-10 flex items-center gap-2">
        <span v-if="!isGenerating">🎁 Save Your Valentine</span>
        <span v-else class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Card...
        </span>
      </span>
      <div class="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
    </button>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import html2canvas from 'html2canvas'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cardRef = ref(null)
const isGenerating = ref(false)

// Computed properties and methods from your original code remain the same
const name = computed(() => {
  const urlName = route.query.name
  return urlName ? decodeURIComponent(urlName) : userStore.name || 'My Love'
})

const date = computed(() => {
  const urlDate = route.query.date
  return urlDate ? decodeURIComponent(urlDate) : userStore.date || ''
})

const memories = computed(() => {
  return userStore.memories || []
})

const poem = computed(() => {
  const generatedContent = userStore.generatedContent
  return generatedContent?.sakecard?.poem || 'Your personalized poem will appear here...'
})

const displayedMemories = computed(() => {
  return memories.value.slice(0, 4)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}

const shouldRegenerateContent = () => {
  const urlMemories = route.query.memories
  const urlName = route.query.name
  return urlMemories !== undefined && (
    urlName !== userStore.name ||
    JSON.stringify(userStore.memories) !== JSON.stringify(userStore.initFromUrl(urlMemories))
  )
}

const downloadCard = async () => {
  try {
    isGenerating.value = true
    // Wait for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const canvas = await html2canvas(cardRef.value, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: null,
      onclone: (clonedDoc) => {
        // Ensure all decorative elements are visible in the screenshot
        const clonedElement = clonedDoc.querySelector('.pattern-hearts')
        if (clonedElement) {
          clonedElement.style.opacity = '0.1'
        }
      }
    })
    
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `valentine-card-${name.value.toLowerCase().replace(/\s+/g, '-')}.png`
    link.click()
  } catch (error) {
    console.error('Error generating card:', error)
  } finally {
    isGenerating.value = false
  }
}

watch(
  () => [route.query.memories, route.query.name],
  async () => {
    if (shouldRegenerateContent()) {
      await userStore.initFromUrl(true)
    }
  }
)

onMounted(async () => {
  if (!userStore.generatedContent || shouldRegenerateContent()) {
    await userStore.initFromUrl(true)
  }
})
</script>

<style>
.valentine-container {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff1f2 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  color: #fecdd3;
  font-size: 24px;
  pointer-events: none;
  animation: float-heart infinite ease-in-out;
}

.keepsake-card {
  max-width: 42rem;
  width: 100%;
  background: linear-gradient(135deg, #fff5f6 0%, #ffffff 100%);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  border: 1px solid rgba(251, 207, 232, 0.3);
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.keepsake-card:hover {
  transform: translateY(-5px);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h1 {
  font-size: 2.5rem;
  color: #db2777;
  font-family: 'Great Vibes', cursive;
  margin-bottom: 0.5rem;
}

.card-header h2 {
  font-size: 1.8rem;
  color: #ec4899;
  font-family: 'Great Vibes', cursive;
}

.poem-section {
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  padding: 0 3rem;
}

.poem-section p {
  font-size: 1.125rem;
  color: #4b5563;
  font-family: 'Roboto', sans-serif;
  line-height: 1.75;
  font-style: italic;
}

.decorative-heart {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fecdd3;
  font-size: 2rem;
}

.decorative-heart.left {
  left: 0;
}

.decorative-heart.right {
  right: 0;
}

.memories-section {
  margin-bottom: 2rem;
}

.memories-section h3 {
  font-size: 1.8rem;
  color: #db2777;
  font-family: 'Great Vibes', cursive;
  text-align: center;
  margin-bottom: 1rem;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.memory-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff5f6 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1px solid rgba(251, 207, 232, 0.3);
  transition: all 0.3s ease;
}

.memory-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(251, 207, 232, 0.3);
}

.memory-text {
  color: #4b5563;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 0.5rem;
}

.memory-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.signature-section {
  text-align: right;
}

.signature-text {
  font-size: 1.8rem;
  color: #db2777;
  font-family: 'Great Vibes', cursive;
}

.signature-name {
  font-size: 1.5rem;
  color: #ec4899;
  font-family: 'Great Vibes', cursive;
}

.signature-date {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

.corner-heart {
  position: absolute;
  color: #fecdd3;
  font-size: 2rem;
}

.corner-heart.top-left {
  top: 1rem;
  left: 1rem;
}

.corner-heart.top-right {
  top: 1rem;
  right: 1rem;
}

.corner-heart.bottom-left {
  bottom: 1rem;
  left: 1rem;
}

.corner-heart.bottom-right {
  bottom: 1rem;
  right: 1rem;
}

.download-button {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(219, 39, 119, 0.2);
}

.download-button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 20px -3px rgba(219, 39, 119, 0.3);
}

.download-button:active {
  transform: scale(0.95);
}

.download-button.generating {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.2rem;
}

.spinner {
  animation: spin 1s linear infinite;
  width: 20px;
  height: 20px;
}

.spinner circle {
  stroke-dasharray: 150;
  stroke-dashoffset: 50;
  stroke: currentColor;
  transform-origin: center;
}

@keyframes float-heart {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .keepsake-card {
    padding: 1.5rem;
  }

  .memory-grid {
    grid-template-columns: 1fr;
  }

  .card-header h1 {
    font-size: 2rem;
  }

  .card-header h2 {
    font-size: 1.5rem;
  }
}
</style>
