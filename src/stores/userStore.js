import { defineStore } from 'pinia'
import { parseAndStoreParams } from '../services/url-params'

/**
 * User store manages data shared between the front-end and future back-end logic.
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    date: '',
    memories: []
  }),
  actions: {
    /**
     * Initializes the store from URL parameters and stores them as cookies.
     */
    initFromUrl() {
      const params = parseAndStoreParams()
      this.name = params.name || ''
      this.date = params.date || ''
      this.memories = params.memories ? params.memories.split(',') : []
    },
    /**
     * Updates the user store with new data.
     * @param {Object} data - Object containing user data to update.
     * @param {string} [data.name] - Recipient's name.
     * @param {string} [data.date] - Special date.
     * @param {string|string[]} [data.memories] - Memory or list of memories.
     */
    updateUser(data) {
      if (data.name !== undefined) this.name = data.name
      if (data.date !== undefined) this.date = data.date
      if (data.memories !== undefined) {
        this.memories = Array.isArray(data.memories)
          ? data.memories
          : data.memories.split(',')
      }
    }
  }
})
