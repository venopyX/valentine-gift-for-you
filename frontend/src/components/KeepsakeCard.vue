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
        <div :style="{ marginBottom: '2rem', textAlign: 'center' }">
          <p :style="{
            fontSize: '1.125rem',
            fontFamily: 'Roboto, sans-serif',
            color: 'rgb(55, 65, 81)',
            lineHeight: '1.75',
            fontStyle: 'italic'
          }">
            {{ poem }}
          </p>
        </div>
  
        <!-- Memory Highlights -->
        <div :style="{ marginBottom: '2rem' }">
          <h3 :style="{
            fontSize: '1.25rem',
            fontFamily: 'Great Vibes, cursive',
            color: 'rgb(219, 39, 119)',
            textAlign: 'center',
            marginBottom: '1rem'
          }">Our Special Moments</h3>
          <div :style="{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }">
            <div v-for="(memory, index) in displayedMemories"
                 :key="index"
                 :style="{
                   padding: '1rem',
                   background: 'rgb(253, 242, 248)',
                   borderRadius: '0.5rem'
                 }">
              <div :style="{
                color: 'rgb(55, 65, 81)',
                fontFamily: 'Roboto, sans-serif'
              }">
                <p>{{ memory.text }}</p>
                <p :style="{
                  fontSize: '0.875rem',
                  color: 'rgb(156, 163, 175)',
                  marginTop: '0.5rem'
                }">
                  {{ memory.date ? formatDate(memory.date) : 'Date not specified' }}
                </p>
              </div>
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
              :style="{
                background: isGenerating ? 'rgb(219, 39, 119, 0.5)' : 'rgb(219, 39, 119)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '9999px',
                transform: isGenerating ? 'none' : 'scale(1)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }">
        <span v-if="!isGenerating">🎁 Save Your Valentine</span>
        <span v-else class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Card...
        </span>
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
  
  // Computed properties for data management
  const name = computed(() => {
    const urlName = route.query.name
    if (urlName) {
      // If URL has name parameter, use it
      return decodeURIComponent(urlName)
    }
    // Otherwise use stored name or default
    return userStore.name || 'My Love'
  })
  
  const date = computed(() => {
    const urlDate = route.query.date
    if (urlDate) {
      // If URL has date parameter, use it
      return decodeURIComponent(urlDate)
    }
    // Otherwise use stored date or empty string
    return userStore.date || ''
  })
  
  const memories = computed(() => {
    const urlMemories = route.query.memories
    const storeMemories = userStore.memories


    // If no URL memories, use stored memories
    return storeMemories || []
  })
  
  // Generate a romantic poem using the AI service
  const poem = computed(() => {
    const generatedContent = userStore.generatedContent
    return generatedContent?.sakecard?.poem || 'Your personalized poem will appear here...'
  })
  
  // Select memories to display
  const displayedMemories = computed(() => {
    return memories.value.slice(0, 4)
  })
  
  // Format date for display
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
  
  // Check if we need to regenerate content
  const shouldRegenerateContent = () => {
    const urlMemories = route.query.memories
    const urlName = route.query.name

    // Check if URL parameters have changed from stored values
    return urlMemories !== undefined && (
      urlName !== userStore.name ||
      JSON.stringify(userStore.memories) !== JSON.stringify(userStore.initFromUrl(urlMemories))
    )
  }

  // Download card as image
  const downloadCard = async () => {
    try {
      isGenerating.value = true
      const canvas = await html2canvas(cardRef.value, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: null
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
  
  // Watch for route changes
  watch(
    () => [route.query.memories, route.query.name],
    async () => {
      if (shouldRegenerateContent()) {
        await userStore.initFromUrl(true)
      }
    }
  )
  
  // Initialize on mount
  onMounted(async () => {
    // Only initialize if we don't have content or URL parameters changed
    if (!userStore.generatedContent || shouldRegenerateContent()) {
      await userStore.initFromUrl(true)
    }
  })
  </script>
  
  <style>
  @keyframes float-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  </style>
