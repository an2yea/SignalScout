import React, { useState, useEffect } from 'react';
import { NetworkBackground } from './components/NetworkBackground';
import { CentralHub } from './components/CentralHub';
import { RedditPost } from './components/RedditPost';
import { ConnectionLines } from './components/ConnectionLines';
import { ScrollNudge } from './components/ScrollNudge';
import { CTASection } from './components/CTASection';

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
    position: { x: 75, y: 25 },
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
  const [showScrollNudge, setShowScrollNudge] = useState(false);
  const [autoScrollTriggered, setAutoScrollTriggered] = useState(false);

  useEffect(() => {
    const timeline = [
      { phase: 1, delay: 0 },      // Start pulse (0s)
      { phase: 2, delay: 1000 },   // Show Reddit posts (1s)
      { phase: 3, delay: 4000 },   // Connect lines (4s)
      { phase: 4, delay: 7000 },   // Show scroll nudge (7s)
      { phase: 5, delay: 10000 },  // Auto scroll (10s)
    ];

    timeline.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setAnimationPhase(phase);
        if (phase === 4) {
          setShowScrollNudge(true);
        }
        if (phase === 5) {
          setAutoScrollTriggered(true);
          // Auto scroll to CTA section
          const ctaSection = document.getElementById('cta-section');
          if (ctaSection) {
            ctaSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
          // Hide scroll nudge after scroll starts
          setTimeout(() => setShowScrollNudge(false), 1000);
        }
      }, delay);
    });
  }, []);

  const handleReplayAnimation = () => {
    setAnimationPhase(0);
    setShowScrollNudge(false);
    setAutoScrollTriggered(false);
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Restart animation after scroll completes
    setTimeout(() => {
      const timeline = [
        { phase: 1, delay: 0 },
        { phase: 2, delay: 1000 },
        { phase: 3, delay: 4000 },
        { phase: 4, delay: 7000 },
        { phase: 5, delay: 10000 },
      ];

      timeline.forEach(({ phase, delay }) => {
        setTimeout(() => {
          setAnimationPhase(phase);
          if (phase === 4) {
            setShowScrollNudge(true);
          }
          if (phase === 5) {
            setAutoScrollTriggered(true);
            const ctaSection = document.getElementById('cta-section');
            if (ctaSection) {
              ctaSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
            setTimeout(() => setShowScrollNudge(false), 1000);
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
        
        {/* Scroll nudge */}
        <ScrollNudge 
          isVisible={showScrollNudge} 
          onReplay={handleReplayAnimation}
        />
      </div>
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

export default App;