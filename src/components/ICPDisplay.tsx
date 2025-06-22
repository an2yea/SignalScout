import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../services/analysisService';

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

  if (!parsedAnalysis) {
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

  const {
    "1": targetIndustry = "Not specified",
    "2": companySize = "Not specified", 
    "3": jobTitles = [],
    "4": painPoints = [],
    "5": geographicFocus = "Not specified",
    "6": keywords = [],
    "7": hashtags = [],
    "8": onlineCommunities = []
  } = parsedAnalysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Your ICP Analysis</h3>
        <button
          onClick={onDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          📥 Download JSON
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ICP Profile Section */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-400/30 pb-2">
            Ideal Customer Profile
          </h4>
          
          <div>
            <h5 className="text-white font-medium mb-2">🏢 Target Industry</h5>
            <p className="text-gray-300 text-sm">{targetIndustry}</p>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2">📊 Company Size</h5>
            <p className="text-gray-300 text-sm">{companySize}</p>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2">👥 Decision Makers</h5>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(jobTitles) && jobTitles.length > 0 ? (
                jobTitles.map((title: string, index: number) => (
                  <span key={index} className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {title}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2">💼 Pain Points</h5>
            <ul className="space-y-1">
              {Array.isArray(painPoints) && painPoints.length > 0 ? (
                painPoints.map((pain: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    {pain}
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Not specified</li>
              )}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2">🌍 Geographic Focus</h5>
            <p className="text-gray-300 text-sm">{geographicFocus}</p>
          </div>
        </div>

        {/* Signal Sources Section */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-400/30 pb-2">
            High-Intent Signal Sources
          </h4>

          <div>
            <h5 className="text-white font-medium mb-2">🔍 Keywords</h5>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(keywords) && keywords.length > 0 ? (
                keywords.map((keyword: string, index: number) => (
                  <span key={index} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-600/30">
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2"># Hashtags</h5>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(hashtags) && hashtags.length > 0 ? (
                hashtags.map((hashtag: string, index: number) => (
                  <span key={index} className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-xs border border-green-600/30">
                    {hashtag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-white font-medium mb-2">💬 Online Communities</h5>
            <ul className="space-y-1">
              {Array.isArray(onlineCommunities) && onlineCommunities.length > 0 ? (
                onlineCommunities.map((community: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    {community}
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Not specified</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <p className="text-gray-400 text-xs">
          Analysis generated on {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}; 