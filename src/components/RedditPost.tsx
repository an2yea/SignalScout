import React from 'react';
import { motion } from 'framer-motion';

interface RedditPostProps {
  text: string;
  keywords: string[];
  position: { x: number; y: number };
  delay: number;
  isMatched?: boolean;
}

export const RedditPost: React.FC<RedditPostProps> = ({ 
  text, 
  keywords, 
  position, 
  delay, 
  isMatched = false 
}) => {
  const highlightKeywords = (text: string, keywords: string[]) => {
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="text-blue-400 font-medium">${keyword}</span>`
      );
    });
    return highlightedText;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={`absolute bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 max-w-xs border ${
        isMatched 
          ? 'border-blue-400/50 shadow-lg shadow-blue-400/20' 
          : 'border-gray-700/50'
      }`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="flex items-start space-x-2">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">r/</span>
        </div>
        <div className="flex-1">
          <p 
            className="text-gray-200 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: highlightKeywords(text, keywords) 
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};