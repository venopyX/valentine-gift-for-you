import dotenv from 'dotenv';
import { generateStoryAndMemories } from './src/services/ai-generator.js';

// Load environment variables
dotenv.config();

// Test input
const testInput = {
  name: 'Alice',
  memories: [
    { text: 'Shared our first coffee together', date: '2024-01-15' },
    { text: 'Walked in the rain under one umbrella', date: '2024-01-28' },
    { text: 'Made heart-shaped cookies on a lazy Sunday', date: '2024-02-11' }
  ]
};

async function runTest() {
  try {
    // Validate environment variables
    const requiredEnvVars = ['CLOUDFLARE_API_KEY', 'CLOUDFLARE_ACCOUNT_ID'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}\nPlease check your .env file`);
    }

    const env = {
      CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID
    };

    console.log('\n=== Test Input ===');
    console.log(JSON.stringify(testInput, null, 2));
    
    console.log('\n=== Generating Story ===');
    console.time('Generation Time');
    
    const result = await generateStoryAndMemories(JSON.stringify(testInput), env);
    
    console.timeEnd('Generation Time');
    console.log('\n=== Generated Result ===');
    console.log(JSON.stringify(result, null, 2));
    
    // Validate the result structure
    const validateResult = (result) => {
      const required = ['story', 'shortMemories', 'sakecard'];
      const missing = required.filter(key => !result[key]);
      if (missing.length > 0) {
        throw new Error(`Missing required fields in result: ${missing.join(', ')}`);
      }
    };
    
    validateResult(result);
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

runTest();
