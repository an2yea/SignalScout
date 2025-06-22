import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccessMessage(`Success! Analysis saved to analyses/${data.analysisFile}`);
      setUrl(''); // Clear the input on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerN8n = async () => {
    setIsTriggering(true);
    setTriggerStatus(null);
    setError(null);

    try {
      const response = await fetch('/api/trigger-n8n', {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger workflow');
      }
      setTriggerStatus(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTriggering(false);
    }
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
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={!isUrlValid || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Scanning...' : 'Find My Users'}
          </motion.button>
        </form>

        <div className="mt-4 h-6">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
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
      </motion.div>
    </div>
  );
};