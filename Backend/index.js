const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate post function
async function generatePost(prompt, postType, postTone) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const fullPrompt = `Generate a ${postType} LinkedIn post with a ${postTone} tone based on the following idea: ${prompt}. The post should be concise, engaging, and formatted for LinkedIn.`;
  
  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post');
  }
}

// API endpoint for generating posts
app.post('/generate-post', async (req, res) => {
  const { prompt, postType, postTone } = req.body;

  if (!prompt || !postType || !postTone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const generatedPost = await generatePost(prompt, postType, postTone);
    res.json({ post: generatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});