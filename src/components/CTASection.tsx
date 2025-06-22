import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyzeWebsite, downloadAnalysis, type AnalysisResult } from '../services/analysisService';
import { triggerN8nWorkflow, downloadN8nResponse } from '../services/n8nService';
import { RedditSignals } from '../services/redditSignalService';
import { ICPDisplay } from './ICPDisplay';
import { RedditPostCards, type RedditPostResult } from './RedditPostCards';
import testData from '../../analyses/test_data_response.json';

// A simple URL validation function
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const CTASection: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);
  const [n8nResponse, setN8nResponse] = useState<string | null>(null);
  const [redditPosts, setRedditPosts] = useState<RedditPostResult[] | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true') {
      const mockAnalysisResult: AnalysisResult = {
        url: 'https://example.com',
        analysis: JSON.stringify({
          "companyName": "ExampleCorp",
          "oneLiner": "We make testing easy.",
          "icp": {
            "jobTitles": ["Software Engineer in Test", "QA Manager"],
            "industries": ["Software Development", "IT Services"],
            "problem": "Testing is often costly and time-consuming, slowing down development cycles.",
            "solution": "Our platform provides a mock data-driven testing environment, reducing API costs and speeding up development.",
            "topics": ["software testing", "quality assurance", "devops", "continous integration"]
          }
        }),
        redditSignals: JSON.stringify({
          "keywords": ["testing framework", "mocking API", "test data generation"],
          "subreddits": ["r/softwaretesting", "r/QualityAssurance", "r/developersIndia"]
        }),
        timestamp: new Date().toISOString()
      };
      setAnalysisResult(mockAnalysisResult);
      setRedditPosts(testData as RedditPostResult[]);
    }
  }, []);

  const isUrlValid = isValidUrl(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUrlValid) {
      setError('Please enter a valid URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setN8nResponse(null);
    setRedditPosts(null);

    try {
      const result = await analyzeWebsite(url);
      setAnalysisResult(result);
      setUrl(''); // Clear the input on success
      
      // Auto-download the analysis - REMOVED
      // downloadAnalysis(result);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerN8n = async () => {
    setIsTriggering(true);
    setTriggerStatus(null);
    setError(null);

    try {
      let redditSignals: RedditSignals | undefined;
      
      // Parse Reddit signals from analysis result if available
      if (analysisResult?.redditSignals) {
        try {
          const cleanedSignals = analysisResult.redditSignals.replace(/```json\n?|\n?```/g, '');
          redditSignals = JSON.parse(cleanedSignals);
          console.log('Using Reddit signals from analysis:', redditSignals);
        } catch (parseError) {
          console.error('Failed to parse Reddit signals, using fallback:', parseError);
        }
      }

      const result = await triggerN8nWorkflow(redditSignals);
      setTriggerStatus(result.message);
      setN8nResponse(result.response);
      
      // Parse Reddit posts from n8n response
      try {
        const parsedPosts: RedditPostResult[] = JSON.parse(result.response);
        setRedditPosts(parsedPosts);
        console.log('Parsed Reddit posts:', parsedPosts);
      } catch (parseError) {
        console.error('Failed to parse n8n response as Reddit posts:', parseError);
        setRedditPosts(null);
      }
      
      // Auto-download the n8n response
      if (analysisResult?.url) {
        downloadN8nResponse(result.response, analysisResult.url);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to trigger workflow');
    } finally {
      setIsTriggering(false);
    }
  };

  const handleDownloadAgain = () => {
    if (analysisResult) {
      downloadAnalysis(analysisResult);
    }
  };

  const handleDownloadN8nResponse = () => {
    if (n8nResponse && analysisResult?.url) {
      downloadN8nResponse(n8nResponse, analysisResult.url);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setTriggerStatus(null);
    setN8nResponse(null);
    setRedditPosts(null);
  };

  return (
    <div id="cta-section" className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {!analysisResult ? (
          // Input Form Section
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center flex items-center justify-center min-h-screen"
          >
            <div>
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Find users you didn't even know were looking for you.
                </h1>
                <p className="text-gray-300 text-xl leading-relaxed max-w-3xl mx-auto">
                  Drop your company URL. We scan Reddit to surface high-intent customers talking about your category.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="max-w-lg mx-auto">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-lg"
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={!isUrlValid || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Find My Users'}
                </motion.button>
              </form>

              <div className="mt-4 min-h-[1.5rem]">
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {triggerStatus && <p className="text-purple-400 text-sm mt-2">{triggerStatus}</p>}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleTriggerN8n}
                  disabled={isTriggering}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTriggering ? 'Triggering...' : 'Trigger Reddit Search'}
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-8">
                Built by GTM hackers
              </p>
            </div>
          </motion.div>
        ) : (
          // Results Section
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🎯 Your ICP Analysis is Ready!
              </h2>
              <p className="text-gray-300 mb-6">
                Here's your ideal customer profile and where to find high-intent prospects
              </p>
              <button
                onClick={handleNewAnalysis}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                ← Analyze Another Website
              </button>
            </div>

            <ICPDisplay 
              result={analysisResult} 
              onDownload={handleDownloadAgain}
            />

            {/* Reddit Posts Results */}
            {redditPosts && redditPosts.length > 0 && (
              <div className="mt-12">
                <RedditPostCards 
                  posts={redditPosts} 
                  onDownload={() => downloadN8nResponse(n8nResponse || JSON.stringify(redditPosts), analysisResult?.url || '')}
                />
              </div>
            )}

            <div className="text-center space-y-4">
              {(!redditPosts || redditPosts.length === 0) && (
                <button
                  onClick={handleTriggerN8n}
                  disabled={isTriggering || !analysisResult?.redditSignals}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTriggering ? 'Triggering...' : 'Start Reddit Hunt 🎯'}
                </button>
              )}
              
              {triggerStatus && (
                <p className="text-purple-400 text-sm">{triggerStatus}</p>
              )}

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <p className="text-gray-500 text-sm mt-8">
                Built by GTM hackers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};