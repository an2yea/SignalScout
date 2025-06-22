import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeWebsite, downloadAnalysis, type AnalysisResult } from '../services/analysisService';
import { triggerN8nWorkflow } from '../services/n8nService';
import { ICPDisplay } from './ICPDisplay';

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

    try {
      const result = await analyzeWebsite(url);
      setAnalysisResult(result);
      setUrl(''); // Clear the input on success
      
      // Auto-download the analysis
      downloadAnalysis(result);
      
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
      const result = await triggerN8nWorkflow();
      setTriggerStatus(result.message);
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

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setTriggerStatus(null);
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

            <div className="text-center space-y-4">
              <div className="mt-8">
                <button
                  onClick={handleTriggerN8n}
                  disabled={isTriggering}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTriggering ? 'Triggering...' : 'Trigger Reddit Search'}
                </button>
              </div>

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