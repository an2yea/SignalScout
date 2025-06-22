import { useState, useEffect } from 'react';
import { NetworkBackground } from './components/NetworkBackground';
import { CentralHub } from './components/CentralHub';
import { CTASection } from './components/CTASection';
import { RedditPost } from './components/RedditPost';
import { ConnectionLines } from './components/ConnectionLines';
import { RedditCallback } from './components/RedditCallback';
import { TestRedditCards } from './components/TestRedditCards';
import TestRedditPost from './components/TestRedditPost';

const redditPosts = [
  {
    text: "Looking for a tool that syncs Notion + Slack",
    keywords: ["sync", "Notion", "Slack"],
    position: { x: 20, y: 30 },
    isMatched: true
  },
  {
    text: "Need help automating Stripe workflows",
    keywords: ["automate", "Stripe", "workflows"],
    position: { x: 60, y: 25 },
    isMatched: true
  },
  {
    text: "Hiring AI infra engineer",
    keywords: ["AI", "infra", "engineer"],
    position: { x: 25, y: 70 }
  },
  {
    text: "Best CRM for small teams?",
    keywords: ["CRM", "teams"],
    position: { x: 80, y: 65 }
  },
  {
    text: "Anyone using headless CMS for e-commerce?",
    keywords: ["headless", "CMS", "e-commerce"],
    position: { x: 15, y: 50 }
  },
  {
    text: "Looking for API monitoring solution",
    keywords: ["API", "monitoring"],
    position: { x: 70, y: 45 }
  }
];

function App() {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [autoScrollTriggered, setAutoScrollTriggered] = useState(false);

  // Check if this is the Reddit OAuth callback
  if (window.location.pathname === '/auth/reddit/callback') {
    return <RedditCallback />;
  }

  // Check if this is the test page
  if (window.location.pathname === '/test-reddit') {
    return <TestRedditCards />;
  }

  // Check if this is the test page for posting to reddit
  if (window.location.pathname === '/test-reddit-post') {
    return <TestRedditPost />;
  }

  useEffect(() => {
    const timeline = [
      { phase: 1, delay: 0 },      // Start pulse (0s)
      { phase: 2, delay: 1000 },   // Show Reddit posts (1s)
      { phase: 3, delay: 2200 },   // Connect lines (2.2s - after last post appears)
      { phase: 4, delay: 3500 },   // Auto scroll (3.5s - shortly after connections)
    ];

    timeline.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setAnimationPhase(phase);
        if (phase === 4) {
          setAutoScrollTriggered(true);
          // Auto scroll to CTA section
          const ctaSection = document.getElementById('cta-section');
          if (ctaSection) {
            ctaSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, delay);
    });
  }, []);

  const handleReplayAnimation = () => {
    setAnimationPhase(0);
    setAutoScrollTriggered(false);
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Restart animation after scroll completes
    setTimeout(() => {
      const timeline = [
        { phase: 1, delay: 0 },
        { phase: 2, delay: 1000 },
        { phase: 3, delay: 2200 },
        { phase: 4, delay: 3500 },
      ];

      timeline.forEach(({ phase, delay }) => {
        setTimeout(() => {
          setAnimationPhase(phase);
          if (phase === 4) {
            setAutoScrollTriggered(true);
            const ctaSection = document.getElementById('cta-section');
            if (ctaSection) {
              ctaSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        }, delay);
      });
    }, 500);
  };

  return (
    <div className="font-inter">
      {/* Hero Animation Section */}
      <div className="min-h-screen bg-gray-950 relative overflow-hidden">
        {/* Network background */}
        <NetworkBackground opacity={0.3} />
        
        {/* Central hub with pulses */}
        <CentralHub isActive={animationPhase >= 1} />
        
        {/* Reddit posts */}
        {animationPhase >= 2 && redditPosts.map((post, index) => (
          <RedditPost
            key={index}
            text={post.text}
            keywords={post.keywords}
            position={post.position}
            delay={index * 0.2}
            isMatched={post.isMatched}
          />
        ))}
        
        {/* Connection lines */}
        {animationPhase >= 3 && (
          <ConnectionLines 
            isActive={true} 
            posts={redditPosts}
          />
        )}
        
        {/* Replay button - only show after scroll */}
        {autoScrollTriggered && (
          <div className="absolute top-8 right-8">
            <button
              onClick={handleReplayAnimation}
              className="text-gray-400 hover:text-gray-200 text-sm underline transition-colors duration-200 bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm"
            >
              ↻ Replay animation
            </button>
          </div>
        )}
      </div>
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

export default App;