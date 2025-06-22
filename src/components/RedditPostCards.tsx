import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { redditService } from '../services/redditService';

export interface RedditPostResult {
  postId: string;
  postUrl: string;
  postTitle: string;
  author: string;
  fitScore: 'high' | 'medium' | 'low';
  who: string;
  matched_signals: string[];
  rationale: string[];
  comment: string;
}

interface RedditPostCardsProps {
  posts: RedditPostResult[];
  onDownload: () => void;
}

export const RedditPostCards: React.FC<RedditPostCardsProps> = ({ posts, onDownload }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (redditService.isAuthenticated()) {
      try {
        const user = await redditService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to get user info:', error);
        setIsAuthenticated(false);
      }
    }
  };

  const handleRedditLogin = () => {
    const authUrl = redditService.generateAuthUrl();
    window.open(authUrl, 'reddit-auth', 'width=600,height=600');
    
    // Listen for auth completion
    const authListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'REDDIT_AUTH_SUCCESS') {
        checkAuthStatus();
        window.removeEventListener('message', authListener);
      } else if (event.data.type === 'REDDIT_AUTH_ERROR') {
        console.error('Reddit auth error:', event.data.error);
        alert('Failed to authenticate with Reddit. Please try again.');
        window.removeEventListener('message', authListener);
      }
    };
    
    window.addEventListener('message', authListener);
  };

  const handlePostComment = async (post: RedditPostResult) => {
    if (!isAuthenticated) {
      handleRedditLogin();
      return;
    }

    setCommentingPostId(post.postId);
    
    try {
      await redditService.postComment(post.postId, post.comment);
      
      // Show success message
      alert('Comment posted successfully! 🎉');
      
      // Open the Reddit post to view the comment
      window.open(post.postUrl, '_blank');
      
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert(`Failed to post comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCommentingPostId(null);
    }
  };

  const getFitScoreColor = (score: string) => {
    switch (score) {
      case 'high':
        return 'text-green-400 bg-green-900/20 border-green-400/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30';
      case 'low':
        return 'text-red-400 bg-red-900/20 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-400/30';
    }
  };

  const getFitScoreIcon = (score: string) => {
    switch (score) {
      case 'high':
        return '🎯';
      case 'medium':
        return '⚡';
      case 'low':
        return '💡';
      default:
        return '📊';
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-8 border border-gray-600/50 text-center"
      >
        <div className="text-gray-400 text-lg">🔍</div>
        <h3 className="text-xl font-semibold text-white mt-2 mb-2">No Reddit Posts Found</h3>
        <p className="text-gray-400">No matching posts were found for your search criteria.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h3 className="text-2xl font-bold text-white">🎯 High-Intent Reddit Posts</h3>
          <button
            onClick={onDownload}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
            title="Download Reddit Post Results"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-gray-400">Found {posts.length} matching post{posts.length !== 1 ? 's' : ''} from your target audience</p>
        
        {/* Reddit Auth Status */}
        <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-600/30">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <span>✅</span>
              <span>Logged in as u/{currentUser.name}</span>
              <button
                onClick={() => {
                  redditService.logout();
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}
                className="ml-2 text-xs text-gray-400 hover:text-gray-300 underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <span>⚠️</span>
              <span>Not logged into Reddit</span>
              <button
                onClick={handleRedditLogin}
                className="ml-2 text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
              >
                Login to Reddit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {posts.map((post, index) => (
          <motion.div
            key={post.postId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            {/* Header with title and fit score */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 mr-4">
                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200 block"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {post.postTitle}
                </a>
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <span className="text-orange-400 mr-1">u/</span>
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>r/{post.postUrl.split('/r/')[1]?.split('/')[0] || 'unknown'}</span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getFitScoreColor(post.fitScore)} flex items-center gap-1`}>
                <span>{getFitScoreIcon(post.fitScore)}</span>
                <span className="capitalize">{post.fitScore} Fit</span>
              </div>
            </div>

            {/* Matched signals */}
            {post.matched_signals && post.matched_signals.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-cyan-400 mb-2">🔍 Matched Signals</h4>
                <div className="flex flex-wrap gap-2">
                  {post.matched_signals.map((signal, signalIndex) => (
                    <span
                      key={signalIndex}
                      className="px-2 py-1 bg-cyan-900/20 text-cyan-300 text-xs rounded-md border border-cyan-600/30"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rationale */}
            {post.rationale && post.rationale.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-purple-400 mb-2">💡 Why This Matters</h4>
                <ul className="space-y-1">
                  {post.rationale.map((reason, reasonIndex) => (
                    <li
                      key={reasonIndex}
                      className="text-sm text-gray-300 flex items-start"
                    >
                      <span className="text-purple-400 mr-2 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested comment */}
            {post.comment && (
              <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-600/30">
                <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                  💬 Suggested Response
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{post.comment}"
                </p>
                <div className="flex gap-2 flex-wrap mt-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(post.comment)}
                    className="text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-600/30 hover:bg-green-900/30 transition-colors"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => handlePostComment(post)}
                    disabled={commentingPostId === post.postId}
                    className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded border border-blue-600/30 hover:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentingPostId === post.postId ? (
                      <>⏳ Posting...</>
                    ) : isAuthenticated ? (
                      <>🚀 Post Comment</>
                    ) : (
                      <>🔐 Login & Post</>
                    )}
                  </button>
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-900/20 text-gray-400 px-2 py-1 rounded border border-gray-600/30 hover:bg-gray-900/30 transition-colors"
                  >
                    👁️ View Post
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}; 