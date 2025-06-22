import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../services/analysisService';
import { RedditSignalsDisplay } from './RedditSignalsDisplay';
import { downloadJson } from '../services/analysisService';

interface ICPDisplayProps {
  result: AnalysisResult;
  onDownload: () => void;
}

export const ICPDisplay: React.FC<ICPDisplayProps> = ({ result, onDownload }) => {
  // Parse the analysis JSON
  let parsedAnalysis: any = null;
  try {
    // Remove any markdown code block formatting if present
    const cleanedAnalysis = result.analysis.replace(/```json\n?|\n?```/g, '');
    parsedAnalysis = JSON.parse(cleanedAnalysis);
  } catch (error) {
    console.error('Failed to parse analysis JSON:', error);
  }

  if (!parsedAnalysis || !parsedAnalysis.summary || !parsedAnalysis.icp) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Analysis Complete</h3>
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-x-auto">
            {result.analysis}
          </pre>
        </div>
        <button
          onClick={onDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Download Analysis
        </button>
      </motion.div>
    );
  }

  const { summary, icp } = parsedAnalysis;
  const { firmographics, personas, pains_triggers, success_metrics } = icp;

  const handleDownload = () => {
    downloadJson(result.analysis, `icp_analysis_${new URL(result.url).hostname.replace(/\./g, '_')}.json`);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50 max-w-5xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">🎯 Your ICP Analysis</h3>
          <button
            onClick={handleDownload}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
            title="Download ICP Analysis"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 mb-6 border border-blue-500/30"
        >
          <h4 className="text-lg font-semibold text-blue-300 mb-2">📋 Company Overview </h4>
          <p className="text-gray-200 text-sm leading-relaxed">{summary}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Firmographics Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/30 rounded-lg p-5 border border-gray-600/30"
          >
            <h4 className="text-lg font-semibold text-green-400 border-b border-green-400/30 pb-2 mb-4">
              🏢 Firmographics
            </h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-white font-medium mb-1 text-sm">Industry</h5>
                <p className="text-gray-300 text-sm bg-gray-800/50 rounded px-3 py-2">
                  {firmographics?.industry || 'Not specified'}
                </p>
              </div>

              <div>
                <h5 className="text-white font-medium mb-1 text-sm">Company Size</h5>
                <p className="text-gray-300 text-sm bg-gray-800/50 rounded px-3 py-2">
                  {firmographics?.company_size || 'Not specified'}
                </p>
              </div>

              {firmographics?.region && (
                <div>
                  <h5 className="text-white font-medium mb-1 text-sm">Region</h5>
                  <p className="text-gray-300 text-sm bg-gray-800/50 rounded px-3 py-2">
                    {firmographics.region}
                  </p>
                </div>
              )}

              {firmographics?.annual_revenue && (
                <div>
                  <h5 className="text-white font-medium mb-1 text-sm">Annual Revenue</h5>
                  <p className="text-gray-300 text-sm bg-gray-800/50 rounded px-3 py-2">
                    {firmographics.annual_revenue}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Personas Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/30 rounded-lg p-5 border border-gray-600/30"
          >
            <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-400/30 pb-2 mb-4">
              👥 Key Personas
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {Array.isArray(personas) && personas.length > 0 ? (
                personas.map((persona: string, index: number) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-blue-600/20 text-blue-300 px-3 py-2 rounded-full text-sm border border-blue-600/30 font-medium"
                  >
                    {persona}
                  </motion.span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Not specified</span>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Pain Points & Triggers Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/30 rounded-lg p-5 border border-gray-600/30"
          >
            <h4 className="text-lg font-semibold text-red-400 border-b border-red-400/30 pb-2 mb-4">
              🔥 Pain Points & Triggers
            </h4>
            
            <ul className="space-y-2">
              {Array.isArray(pains_triggers) && pains_triggers.length > 0 ? (
                pains_triggers.map((pain: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-gray-300 text-sm flex items-start bg-red-900/10 rounded px-3 py-2 border-l-2 border-red-500/50"
                  >
                    <span className="text-red-400 mr-2 font-bold">•</span>
                    {pain}
                  </motion.li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Not specified</li>
              )}
            </ul>
          </motion.div>

          {/* Success Metrics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/30 rounded-lg p-5 border border-gray-600/30"
          >
            <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-400/30 pb-2 mb-4">
              📈 Success Metrics
            </h4>
            
            <ul className="space-y-2">
              {Array.isArray(success_metrics) && success_metrics.length > 0 ? (
                success_metrics.map((metric: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-gray-300 text-sm flex items-start bg-purple-900/10 rounded px-3 py-2 border-l-2 border-purple-500/50"
                  >
                    <span className="text-purple-400 mr-2 font-bold">📊</span>
                    {metric}
                  </motion.li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Not specified</li>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 pt-4 border-t border-gray-600/30"
        >
          <p className="text-gray-400 text-xs text-center">
            🤖 Analysis generated by GTM strategist AI on {new Date(result.timestamp).toLocaleString()}
          </p>
        </motion.div>
      </motion.div>

      {/* Reddit Signals Display */}
      {result.redditSignals && (
        <RedditSignalsDisplay 
          redditSignalsJson={result.redditSignals} 
          onDownload={() => downloadJson(result.redditSignals || '', `reddit_signals_${new URL(result.url).hostname.replace(/\./g, '_')}.json`)}
        />
      )}
    </div>
  );
}; 