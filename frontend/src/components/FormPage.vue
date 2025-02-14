<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-white p-6">
    <div class="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-3xl font-great-vibes text-pink-600 text-center mb-8">Create Your Valentine Gift</h1>
      
      <form @submit.prevent="generateLink" class="space-y-6">
        <!-- Name Input -->
        <div class="mb-4">
          <label for="name" class="block text-gray-700 mb-2">Partner's Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter their name"
            aria-label="Recipient's name"
            maxlength="50"
          >
        </div>



        <!-- Memories Input -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Favorite Memories</label>
          <div v-for="(memory, index) in memories" :key="index" 
               class="space-y-2 mb-4 p-4 border rounded-lg bg-white shadow-sm">
            <div class="flex justify-between items-start gap-2">
              <div class="flex-1 space-y-2">
                <input
                  v-model="memories[index].text"
                  :placeholder="`Memory ${index + 1}`"
                  class="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  :aria-label="`Memory ${index + 1}`"
                  maxlength="200"
                />
                <div class="flex items-center gap-2">
                  <input
                    v-model="memories[index].date"
                    type="date"
                    :max="maxDate"
                    class="flex-1 border rounded p-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    :aria-label="`Date for memory ${index + 1}`"
                  />
                  <button
                    @click="memories[index].date = ''"
                    type="button"
                    class="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                  >
                    I forgot the date
                  </button>
                </div>
              </div>
              <button 
                @click="removeMemory(index)" 
                type="button"
                class="text-red-500 hover:text-red-700 transition-colors px-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                :aria-label="`Remove memory ${index + 1}`"
              >
                ✕
              </button>
            </div>
          </div>
          <button 
            @click="addMemory" 
            type="button"
            class="text-pink-500 text-sm hover:text-pink-700 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded px-2 py-1"
            :disabled="memories.length >= 6"
            aria-label="Add another memory"
          >
            + Add Another Memory ({{ memories.length }}/6)
          </button>
        </div>

        <!-- Generate Link Button -->
        <button
          type="submit"
          class="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 
                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          :disabled="!isFormValid"
        >
          Create Valentine
        </button>
      </form>
    </div>

    <!-- Link Dialog -->
    <Dialog v-model="showDialog">
      <div class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto mb-4">
          <img src="https://media.tenor.com/J4WA4IXVeBQAAAAC/love-you.gif" alt="Heart envelope" class="w-full h-full object-contain" />
        </div>
        <h2 class="text-2xl font-great-vibes text-pink-600">Your Valentine is Ready! 💝</h2>
        <p class="text-gray-600 mb-4">Share this special link with your valentine:</p>
        
        <div class="bg-pink-50 p-4 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <input
              ref="linkInput"
              type="text"
              :value="generatedLink"
              readonly
              class="flex-1 p-2 text-sm bg-white border rounded focus:ring-2 focus:ring-pink-500"
              aria-label="Generated Valentine link"
            />
            <button
              @click="copyLink"
              class="text-pink-600 hover:text-pink-700 transition-colors p-2
                     focus:outline-none focus:ring-2 focus:ring-pink-500 rounded"
              type="button"
              aria-label="Copy link to clipboard"
            >
              📋
            </button>
          </div>
          <p v-if="linkCopied" 
             class="text-green-600 text-sm"
             role="status">
            Link copied! 🎉
          </p>
        </div>

        <div class="flex gap-4 mt-6 justify-center">
          <button
            @click="previewValentine"
            class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600
                   transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Preview ❤️
          </button>
          <button
            @click="showDialog = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                   transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { sanitizeInput, validateDate } from '../utils/formatDate'
import Dialog from './ui/Dialog.vue'

const router = useRouter()
const userStore = useUserStore()

// State
const name = ref('')
const memories = ref([{ text: '', date: '' }])
const generatedLink = ref('')
const linkCopied = ref(false)
const showDialog = ref(false)
const linkInput = ref(null)

// Computed properties
const maxDate = computed(() => new Date().toISOString().split('T')[0])

const isFormValid = computed(() => {
  return name.value.trim() && 
         memories.value.some(m => m.text.trim()) &&
         memories.value.every(m => !m.date || validateDate(m.date))
})

// Methods
function addMemory() {
  if (memories.value.length < 6) {
    memories.value.push({ text: '', date: '' })
  }
}

function removeMemory(index) {
  if (memories.value.length > 1) {
    memories.value.splice(index, 1)
  }
}

function validateForm() {
  return memories.value.every(memory => {
    return !memory.date || validateDate(memory.date)
  })
}

function generateLink() {
  if (!validateForm()) return

  // Sanitize inputs
  const sanitizedName = sanitizeInput(name.value.trim())
  const sanitizedMemories = memories.value
    .filter(m => m.text.trim())
    .map(m => ({
      text: sanitizeInput(m.text.trim()),
      date: m.date
    }))

  // Save to store using updateUser
  userStore.updateUser({
    name: sanitizedName,
    memories: sanitizedMemories
  })

  // Generate shareable link with proper encoding
  const baseUrl = window.location.origin
  const queryParams = new URLSearchParams()
  
  // Encode name
  queryParams.set('name', encodeURIComponent(sanitizedName))
  
  // Encode memories
  const encodedMemories = sanitizedMemories
    .map(m => `${encodeURIComponent(m.text)}@${m.date || ''}`)
    .join('|')
  queryParams.set('memories', encodedMemories)

  generatedLink.value = `${baseUrl}/teaser?${queryParams}`
  showDialog.value = true
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(generatedLink.value)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function previewValentine() {
  router.push('/teaser' + generatedLink.value.split('teaser')[1])
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
</style>