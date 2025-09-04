import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyzeWebsite, downloadAnalysis, type AnalysisResult } from '../services/analysisService';
import { triggerN8nWorkflow, downloadN8nResponse } from '../services/n8nService';
import { RedditSignals } from '../services/redditSignalService';
import { ICPDisplay } from './ICPDisplay';
import { RedditPostCards, type RedditPostResult } from './RedditPostCards';
import atlanICP from '../../data/atlan_icp.json';
import atlanRedditSignals from '../../data/reddit_signals.json';
import atlanRedditPosts from '../../data/reddit_posts.json';


export const CTASection: React.FC = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showRedditPosts, setShowRedditPosts] = useState(false);
  const [redditPosts, setRedditPosts] = useState<RedditPostResult[] | null>(null);

  useEffect(() => {
    // Automatically load Atlan ICP data
    const atlanAnalysisResult: AnalysisResult = {
      url: 'https://atlan.com',
      analysis: JSON.stringify(atlanICP),
      redditSignals: JSON.stringify(atlanRedditSignals),
      timestamp: new Date().toISOString()
    };
    setAnalysisResult(atlanAnalysisResult);
    setShowAnalysis(true);
  }, []);


  const handleShowRedditPosts = () => {
    // Load hardcoded Reddit posts
    const transformedPosts = atlanRedditPosts.map(post => ({
      ...post,
      id: post.postId,
      url: post.postUrl,
      title: post.postTitle,
      subreddit: post.postUrl.match(/\/r\/([^/]+)/)?.[1] || 'dataengineering',
      upvotes: Math.floor(Math.random() * 100) + 20,
      comments: Math.floor(Math.random() * 50) + 5,
      timestamp: '2 days ago'
    }));
    setRedditPosts(transformedPosts as any);
    setShowRedditPosts(true);
  };

  const handleDownloadAgain = () => {
    if (analysisResult) {
      downloadAnalysis(analysisResult);
    }
  };

  return (
    <div id="cta-section" className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {showAnalysis && analysisResult ? (
          // Results Section
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🎯 Atlan's ICP Analysis
              </h2>
              <p className="text-gray-300 mb-6">
                Here's Atlan's ideal customer profile and where to find high-intent prospects across social media
              </p>
            </div>

            <ICPDisplay 
              result={analysisResult} 
              onDownload={handleDownloadAgain}
            />

            {/* Social Media Posts Results */}
            {showRedditPosts && redditPosts && redditPosts.length > 0 && (
              <div className="mt-12">
                <RedditPostCards 
                  posts={redditPosts} 
                  onDownload={() => downloadAnalysis(analysisResult)}
                />
              </div>
            )}

            <div className="text-center space-y-4">
              {!showRedditPosts && (
                <button
                  onClick={handleShowRedditPosts}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-md"
                >
                  Start Social Media Hunt 🎯
                </button>
              )}

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <p className="text-gray-500 text-sm mt-8">
                Built by GTM hackers
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-300">Loading Atlan ICP Analysis...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};