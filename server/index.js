// Simple Express server to proxy AI requests
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from the root .env file
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { input } = req.body;

    const systemMessage = `You are a romantic AI that generates stories and poems based on shared memories.
The user will send the name of their lover with memories they had together.
Now, your response will be to surprise the person whose name is provided based on the context.
Return ONLY a JSON object with this exact structure(if you wanna make few more lines, use escape character like backslash and n i.e. \n):
{
  "story": "[one-line romantic story featuring the person's name]",
  "shortMemories": [
    {
      "memory": "[concise memory text]",
      "date": "[YYYY-MM-DD]"
    }
  ],
  "sakecard": {
    "poem": "[single-line poem with spaces, NO newlines]",
    "memoryHighlight": {
      "memories": ["[key memory 1]", "[key memory 2]"]
    }
  }
}

IMPORTANT:
- Do not use any newlines (\n) in the text fields
- Keep all text in a single line, using spaces instead of newlines
- The response must be valid JSON that can be parsed with JSON.parse()`;
    
    // Use environment variables from .env
    const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    
    if (!CLOUDFLARE_API_KEY || !CLOUDFLARE_ACCOUNT_ID) {
      throw new Error('Missing API credentials in server environment');
    }

    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: `JSON response for ${input.name} based on our past memories: ${input.memories.map(m => `${m.text} (${m.date})`).join(', ')}`
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudflare API Error:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Cloudflare API Response:', result);

    // Check if we have a valid response
    if (!result.result?.response) {
      console.error('Invalid Cloudflare response:', result);
      throw new Error(result.errors?.[0]?.message || 'Invalid response from Cloudflare API');
    }

    // Parse the response as JSON
    try {
      const parsedContent = JSON.parse(result.result.response);
      
      // Validate the response structure
      if (!parsedContent.story || !parsedContent.shortMemories || !parsedContent.sakecard) {
        console.error('Invalid content structure:', parsedContent);
        throw new Error('AI response missing required fields');
      }

      res.json({
        result: {
          choices: [{
            message: {
              content: JSON.stringify(parsedContent)
            }
          }]
        }
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', result.result.response);
      throw new Error('AI response was not in valid JSON format');
    }
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate content. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
