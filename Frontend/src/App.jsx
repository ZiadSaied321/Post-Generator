import React, { useState } from 'react';
import Button from './components/button.jsx';

// API Call
const generatePost = async (prompt, postType, postTone) => {
  try {
    const response = await fetch('http://localhost:3001/generate-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, postType, postTone }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate post');
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error('Error generating post:', error);
    throw error;
  }
};

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [postType, setPostType] = useState('');
  const [postTone, setPostTone] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const post = await generatePost(prompt, postType, postTone);
      setGeneratedPost(post);
    } catch (error) {
      setError('Failed to generate post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5 text-center">LinkedIn Post Generator</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="postType" className="block text-sm font-medium text-gray-700">Post Type</label>
              <select
                id="postType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                required
              >
                <option value="">Select a post type</option>
                <option value="thought leadership">Thought Leadership</option>
                <option value="industry news">Industry News</option>
                <option value="company update">Company Update</option>
                <option value="personal achievement">Personal Achievement</option>
                <option value="job opportunity">Job Opportunity</option>
              </select>

            </div>
            <div>
              <label htmlFor="postTone" className="block text-sm font-medium text-gray-700">Post Tone</label>
              <select
                id="postTone"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={postTone}
                onChange={(e) => setPostTone(e.target.value)}
                required
              >
                <option value="">Select a tone</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="inspirational">Inspirational</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Post Idea</label>
              <textarea
                id="prompt"
                className="mt-1 block w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter your post idea..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            <Button btnTxt={"Generate Post"} loading={isLoading} />
          </form>
          {generatedPost && (
            <div className="mt-5">
              <h2 className="text-xl font-semibold mb-2">Generated Post:</h2>
              <p className="bg-gray-100 p-3 rounded-lg">{generatedPost}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;