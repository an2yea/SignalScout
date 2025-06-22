import React, { useState } from 'react';
import { postCommentToReddit } from '../services/n8nRedditPosterService';

const TestRedditPost: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePostComment = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await postCommentToReddit("1lcssom", "test");
      setResult(JSON.stringify(response, null, 2));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h2>Test Reddit Comment Post</h2>
      <button onClick={handlePostComment} disabled={isLoading}>
        {isLoading ? 'Posting...' : 'Post Test Comment to Reddit'}
      </button>
      {result && <pre>Success: {result}</pre>}
      {error && <pre style={{ color: 'red' }}>Error: {error}</pre>}
    </div>
  );
};

export default TestRedditPost; 