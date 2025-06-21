import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OverlayFormProps {
  isVisible: boolean;
}

export const OverlayForm: React.FC<OverlayFormProps> = ({ isVisible }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scanning URL:', url);
    // Handle form submission here
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 max-w-lg w-full mx-4 border border-gray-700/50 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Find users you didn't even know were looking for you.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Drop your company URL. We scan Reddit to surface high-intent customers talking about your category.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourcompany.com"
              className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Find My Users
          </motion.button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Built by GTM hackers
        </p>
      </motion.div>
    </motion.div>
  );
};