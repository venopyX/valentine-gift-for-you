<!-- src/components/FormPage.vue -->
<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow rounded">
    <form @submit.prevent="generateLink">
      <div class="mb-4">
        <label for="name" class="block text-gray-700">Recipient's Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="Enter recipient's name"
          class="w-full border-gray-300 border rounded p-2"
        />
      </div>
      <div class="mb-4">
        <label for="date" class="block text-gray-700">Special Date</label>
        <input
          id="date"
          v-model="date"
          type="date"
          required
          class="w-full border-gray-300 border rounded p-2"
        />
      </div>
      <div class="mb-4">
        <label for="memory" class="block text-gray-700">Favorite Memory</label>
        <input
          id="memory"
          v-model="memory"
          type="text"
          required
          placeholder="Enter a favorite memory"
          class="w-full border-gray-300 border rounded p-2"
        />
      </div>
      <button type="submit" class="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition">
        Generate Gift Link
      </button>
    </form>
    <div v-if="generatedLink" class="mt-6 p-4 border rounded bg-gray-50">
      <p class="mb-2 font-medium">Your gift link:</p>
      <input
        type="text"
        :value="generatedLink"
        readonly
        class="w-full border-gray-300 border rounded p-2 bg-white"
      />
      <p class="mt-2 text-sm text-gray-600">It has been copied to your clipboard.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const date = ref('')
const memory = ref('')
const generatedLink = ref('')

/**
 * Generates a unique gift link based on user input,
 * copies it to the clipboard, and displays it on the page.
 */
async function generateLink() {
  // Construct the gift link using current origin and query parameters
  const queryParams = new URLSearchParams({
    name: name.value,
    date: date.value,
    memories: memory.value
  }).toString()
  generatedLink.value = `${window.location.origin}/teaser?${queryParams}`

  // Copy the generated link to clipboard
  try {
    await navigator.clipboard.writeText(generatedLink.value)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}
</script>

<style scoped>
/* Additional scoped styles can be added here if needed */
</style>
