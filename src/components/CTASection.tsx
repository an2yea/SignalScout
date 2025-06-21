import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const CTASection: React.FC = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scanning URL:', url);
    // Handle form submission here
  };

  return (
    <div id="cta-section" className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-2xl w-full text-center"
      >
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
              required
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg"
          >
            Find My Users
          </motion.button>
        </form>

        <p className="text-gray-500 text-sm mt-8">
          Built by GTM hackers
        </p>
      </motion.div>
    </div>
  );
};