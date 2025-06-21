import React from 'react';
import { motion } from 'framer-motion';

interface ScrollNudgeProps {
  isVisible: boolean;
  onReplay: () => void;
}

export const ScrollNudge: React.FC<ScrollNudgeProps> = ({ isVisible, onReplay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <p className="text-gray-300 text-sm font-medium">
          Ready to see who's talking about you?
        </p>
        
        {/* Animated down arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-blue-400"
          >
            <path 
              d="M7 10L12 15L17 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-blue-400 text-xs font-medium">Get Started</span>
        </motion.div>
        
        {/* Replay button */}
        <button
          onClick={onReplay}
          className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors duration-200"
        >
          Replay animation
        </button>
      </div>
    </motion.div>
  );
};