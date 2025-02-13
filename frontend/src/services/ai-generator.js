/**
 * AI Generator Service for Valentine's Gift
 * This service uses Cloudflare's AI via a proxy server to generate romantic stories and poems.
 * @module services/ai-generator
 */

/**
 * @typedef {Object} Memory
 * @property {string} text - The memory text
 * @property {string} date - The date of the memory (YYYY-MM-DD)
 */

/**
 * @typedef {Object} Input
 * @property {string} name - The name of the person
 * @property {Memory[]} memories - Array of memories
 */

/**
 * @typedef {Object} Output
 * @property {string} story - A one-line romantic story
 * @property {Memory[]} shortMemories - Array of formatted memories
 * @property {Object} sakecard - Card with poem and highlighted memories
 * @property {string} sakecard.poem - A romantic poem
 * @property {Object} sakecard.memoryHighlight - Highlighted memories
 * @property {string[]} sakecard.memoryHighlight.memories - Array of key memories
 */

/**
 * @typedef {Object} Env
 * @property {string} CLOUDFLARE_API_KEY - The Cloudflare API key
 * @property {string} CLOUDFLARE_ACCOUNT_ID - The Cloudflare account ID
 */

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create a safer API wrapper for browser usage
const AI_API = {
  /**
   * Generate a story and memories using the AI service
   * @param {Object} input - Input data containing name and memories
   * @param {Object} env - Environment variables
   * @returns {Promise<Object>} Generated content
   */
  async generate(input) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
      }

      const result = await response.json();
      
      // Parse the response
      if (result.result?.choices?.[0]?.message?.content) {
        try {
          const content = result.result.choices[0].message.content;
          console.log('Received content:', content);
          const parsedContent = JSON.parse(content);
          
          // Validate the response structure
          if (!parsedContent.story || !parsedContent.shortMemories || !parsedContent.sakecard) {
            throw new Error('Response missing required fields');
          }
          
          return parsedContent;
        } catch (parseError) {
          console.error('Parse error:', parseError);
          throw new Error('Failed to parse AI response');
        }
      }
      
      console.error('Invalid response:', result);
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }
};

export { AI_API };

// For backward compatibility
export const generateStoryAndMemories = async (inputJson) => {
  const inputData = JSON.parse(inputJson);
  return AI_API.generate(inputData);
};
