import React, { useEffect } from 'react';
import { redditService } from '../services/redditService';

export const RedditCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        console.error('Reddit OAuth error:', error);
        window.opener?.postMessage({ type: 'REDDIT_AUTH_ERROR', error }, window.location.origin);
        window.close();
        return;
      }

      if (code && state) {
        try {
          await redditService.exchangeCodeForToken(code, state);
          window.opener?.postMessage({ type: 'REDDIT_AUTH_SUCCESS' }, window.location.origin);
          window.close();
        } catch (error) {
          console.error('Failed to exchange code for token:', error);
          window.opener?.postMessage({ type: 'REDDIT_AUTH_ERROR', error }, window.location.origin);
          window.close();
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-lg mb-4">🔄 Processing Reddit authentication...</div>
        <div className="text-gray-400">This window will close automatically.</div>
      </div>
    </div>
  );
}; 