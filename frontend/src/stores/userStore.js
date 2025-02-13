import { defineStore } from 'pinia'
import { parseAndStoreParams } from '../services/url-params'
import { AI_API } from '../services/ai-generator'
import Cookies from 'js-cookie'

/**
 * @typedef {Object} Memory
 * @property {string} text - The memory text
 * @property {string} date - The date of the memory
 */

/**
 * @typedef {Object} GeneratedContent
 * @property {string} story - One-line romantic story
 * @property {Array<{memory: string, date: string}>} shortMemories - Formatted memories
 * @property {Object} sakecard - Card with poem and memories
 * @property {string} sakecard.poem - Romantic poem
 * @property {Object} sakecard.memoryHighlight - Highlighted memories
 * @property {string[]} sakecard.memoryHighlight.memories - Key memories
 */

const COOKIE_KEYS = {
  GENERATED_CONTENT: 'generatedContent',
  NAME: 'name',
  MEMORIES: 'memories'
}

/**
 * User store manages user data and AI-generated content
 */
export const useUserStore = defineStore('user', {
  state: () => {
    // Try to load memories from cookies
    let memories = []
    try {
      const savedMemories = Cookies.get(COOKIE_KEYS.MEMORIES)
      if (savedMemories) {
        memories = JSON.parse(savedMemories)
      }
    } catch (e) {
      console.error('Error loading memories from cookies:', e)
    }

    // Try to load generated content from cookies
    let generatedContent = null
    try {
      const savedContent = Cookies.get(COOKIE_KEYS.GENERATED_CONTENT)
      if (savedContent) {
        generatedContent = JSON.parse(savedContent)
      }
    } catch (e) {
      console.error('Error loading generated content from cookies:', e)
    }

    return {
      name: Cookies.get(COOKIE_KEYS.NAME) || '',
      memories,
      generatedContent,
      isGenerating: false,
      error: null
    }
  },
  actions: {
    /**
     * Initializes the store from URL parameters and optionally generates content
     * @param {boolean} [generateContent=false] - Whether to generate AI content after initialization
     * @returns {Promise<void>}
     */
    async initFromUrl(generateContent = false) {
      const params = parseAndStoreParams()
      const urlName = params.name
      const urlMemories = params.memories

      // Only update name if URL has it and it's different
      if (urlName && urlName !== this.name) {
        this.name = urlName
        Cookies.set(COOKIE_KEYS.NAME, urlName)
      }

      // Only update memories if URL has them and they're different
      if (urlMemories && urlMemories.length > 0) {
        const memoriesChanged = JSON.stringify(urlMemories) !== JSON.stringify(this.memories)
        if (memoriesChanged) {
          this.memories = urlMemories
          Cookies.set(COOKIE_KEYS.MEMORIES, JSON.stringify(urlMemories))
        }
      }

      // Generate new content only if needed
      if (generateContent && (!this.generatedContent || this.shouldRegenerateContent())) {
        await this.generateContent()
      }
    },
    /**
     * Updates the user store with new data.
     * @param {Object} data - Object containing user data to update.
     * @param {string} [data.name] - Recipient's name.
     * @param {Array<{text: string, date: string}>} [data.memories] - List of memories with dates.
     * @param {boolean} [generateContent=false] - Whether to generate new AI content after update
     */
    async updateUser(data, generateContent = false) {
      let hasUpdates = false

      if (data.name !== undefined && data.name !== this.name) {
        this.name = data.name
        Cookies.set(COOKIE_KEYS.NAME, data.name)
        hasUpdates = true
      }

      if (data.memories !== undefined) {
        this.memories = data.memories
        Cookies.set(COOKIE_KEYS.MEMORIES, JSON.stringify(data.memories))
        hasUpdates = true
      }

      if (generateContent && (hasUpdates || this.shouldRegenerateContent())) {
        await this.generateContent()
      }
    },

    /**
     * Generates AI content based on current user data
     * @returns {Promise<GeneratedContent|null>} Generated content or null if generation fails
     */
    async generateContent() {
      if (!this.name || this.memories.length === 0) {
        this.error = 'Name and memories are required to generate content'
        return null
      }

      this.isGenerating = true
      this.error = null
      
      try {
        const result = await AI_API.generate({
          name: this.name,
          memories: this.memories.map(m => ({
            text: m.text,
            date: m.date
          }))
        })
        this.generatedContent = result
        
        // Save generated content to cookies
        Cookies.set(COOKIE_KEYS.GENERATED_CONTENT, JSON.stringify(result))
        
        return result
      } catch (error) {
        console.error('Error generating content:', error)
        this.error = error.message
        return null
      } finally {
        this.isGenerating = false
      }
    },

    /**
     * Checks if content should be regenerated based on data changes
     * @private
     * @returns {boolean}
     */
    shouldRegenerateContent() {
      if (!this.generatedContent) return true
      if (!this.memories || this.memories.length === 0) return false

      // Check if the current memories match the generated content memories
      const currentMemoryTexts = new Set(this.memories.map(m => m.text))
      const generatedMemoryTexts = new Set(
        this.generatedContent.shortMemories?.map(m => m.memory) || []
      )

      // Don't regenerate if we have content and no memories changed
      if (currentMemoryTexts.size === generatedMemoryTexts.size) {
        let allMatch = true
        for (const text of currentMemoryTexts) {
          if (!generatedMemoryTexts.has(text)) {
            allMatch = false
            break
          }
        }
        if (allMatch) return false
      }

      return true
    }
  }
})
