import React from 'react';
import { motion } from 'framer-motion';
import { RedditSignals } from '../services/redditSignalService';

interface RedditSignalsDisplayProps {
  redditSignalsJson: string;
}

export const RedditSignalsDisplay: React.FC<RedditSignalsDisplayProps> = ({ redditSignalsJson }) => {
  // Parse the Reddit signals JSON
  let parsedSignals: RedditSignals | null = null;
  try {
    // Remove any markdown code block formatting if present
    const cleanedSignals = redditSignalsJson.replace(/```json\n?|\n?```/g, '');
    parsedSignals = JSON.parse(cleanedSignals);
  } catch (error) {
    console.error('Failed to parse Reddit signals JSON:', error);
  }

  if (!parsedSignals) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50 mt-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">🔍 Reddit Signals</h3>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-x-auto">
            {redditSignalsJson}
          </pre>
        </div>
      </motion.div>
    );
  }

  const { subreddits, keyword_clusters, boolean_search_query, reddit_search_url } = parsedSignals;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50 mt-6 max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-6">🔍 Reddit Signal Intelligence</h3>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subreddits Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/30 rounded-lg p-5 border border-gray-600/30"
        >
          <h4 className="text-lg font-semibold text-orange-400 border-b border-orange-400/30 pb-2 mb-4">
            📊 Target Subreddits
          </h4>
          
          <div className="space-y-3">
            {Array.isArray(subreddits) && subreddits.length > 0 ? (
              subreddits.map((subreddit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-orange-900/10 rounded-lg p-3 border-l-2 border-orange-500/50"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-orange-300 font-medium text-sm">{subreddit.name}</h5>
                    <span className="text-gray-400 text-xs">
                      {subreddit.members?.toLocaleString()} members
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs">{subreddit.why_relevant}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No subreddits specified</p>
            )}
          </div>
        </motion.div>

        {/* Search Tools Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/30 rounded-lg p-5 border border-gray-600/30"
        >
          <h4 className="text-lg font-semibold text-cyan-400 border-b border-cyan-400/30 pb-2 mb-4">
            🔗 Search Tools
          </h4>
          
          <div className="space-y-4">
            {boolean_search_query && (
              <div>
                <h5 className="text-cyan-300 font-medium text-sm mb-2">Boolean Search Query</h5>
                <div className="bg-cyan-900/10 rounded p-3 border border-cyan-600/30">
                  <code className="text-cyan-200 text-xs break-all">
                    {boolean_search_query}
                  </code>
                </div>
              </div>
            )}

            {reddit_search_url && (
              <div>
                <h5 className="text-cyan-300 font-medium text-sm mb-2">Reddit Search URL</h5>
                <div className="bg-cyan-900/10 rounded p-3 border border-cyan-600/30">
                  <a 
                    href={reddit_search_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-200 text-xs break-all hover:text-cyan-100 transition-colors"
                  >
                    {reddit_search_url}
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Keyword Clusters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/30 rounded-lg p-5 border border-gray-600/30 mt-6"
      >
        <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-400/30 pb-2 mb-4">
          🎯 Keyword Clusters
        </h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.isArray(keyword_clusters) && keyword_clusters.length > 0 ? (
            keyword_clusters.map((cluster, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-purple-900/10 rounded-lg p-3 border border-purple-600/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="text-purple-300 font-medium text-sm">{cluster.cluster}</h5>
                  <span className="text-purple-400 text-xs bg-purple-800/30 px-2 py-1 rounded">
                    {cluster.usp_link}
                  </span>
                </div>
                <div className="text-gray-300 text-xs">
                  {cluster.keywords.split('; ').map((keyword, keyIndex) => (
                    <span 
                      key={keyIndex}
                      className="inline-block bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs mr-1 mb-1"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-sm col-span-full">No keyword clusters specified</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}; 