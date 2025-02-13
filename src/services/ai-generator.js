/**
 * Generates a personalized message based on the provided type and parameters.
 * @param {string} type - The type of message to generate ("loveLetter", "poem", "memory").
 * @param {Object} params - The parameters containing user details.
 * @param {string} params.name - The recipient's name.
 * @param {string} params.date - The special date.
 * @param {string|string[]} params.memories - A comma-separated string or an array of memories.
 * @returns {string} The generated message.
 */
export const generateMessage = (type, params) => {
    const { name, date, memories } = params;
    const memoriesArray = Array.isArray(memories) ? memories : (memories ? memories.split(',') : []);
    const prompts = {
      loveLetter: `Dear ${name}, from the moment our paths crossed on ${date}, my heart found its home.`,
      poem: `Roses are red, violets are blue, ${name}, my heart sings a melody just for you.`,
      memory: memoriesArray.length
        ? `Remember when we ${memoriesArray[Math.floor(Math.random() * memoriesArray.length)]}?`
        : `Cherishing every moment with you, ${name}.`
    }
    return prompts[type] || `Hello ${name}, every day with you is a beautiful adventure.`
  }
  