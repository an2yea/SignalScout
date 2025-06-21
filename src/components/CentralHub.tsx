import React from 'react';
import { motion } from 'framer-motion';

interface CentralHubProps {
  isActive: boolean;
}

export const CentralHub: React.FC<CentralHubProps> = ({ isActive }) => {
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* Outer pulse rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/30"
          initial={{ width: 60, height: 60, opacity: 0 }}
          animate={isActive ? {
            width: [60, 120 + ring * 40, 200 + ring * 60],
            height: [60, 120 + ring * 40, 200 + ring * 60],
            opacity: [0.8, 0.4, 0]
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: ring * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Central hub */}
      <motion.div
        className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg"
        animate={isActive ? {
          boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.5)",
            "0 0 40px rgba(59, 130, 246, 0.8)",
            "0 0 20px rgba(59, 130, 246, 0.5)"
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-2 bg-white/20 rounded-full" />
        <div className="absolute inset-4 bg-white/40 rounded-full" />
      </motion.div>
    </div>
  );
};