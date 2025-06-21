import React, { useState, useEffect } from 'react';
import { NetworkBackground } from './components/NetworkBackground';
import { CentralHub } from './components/CentralHub';
import { RedditPost } from './components/RedditPost';
import { ConnectionLines } from './components/ConnectionLines';
import { OverlayForm } from './components/OverlayForm';

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
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const timeline = [
      { phase: 1, delay: 0 },      // Start pulse
      { phase: 2, delay: 2000 },   // Show Reddit posts
      { phase: 3, delay: 5000 },   // Connect lines
      { phase: 4, delay: 8000 },   // Show overlay
    ];

    timeline.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setAnimationPhase(phase);
        if (phase === 4) {
          setShowOverlay(true);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden font-inter">
      {/* Network background */}
      <NetworkBackground opacity={showOverlay ? 0.1 : 0.3} />
      
      {/* Central hub with pulses */}
      <CentralHub isActive={animationPhase >= 1} />
      
      {/* Reddit posts */}
      {animationPhase >= 2 && redditPosts.map((post, index) => (
        <RedditPost
          key={index}
          text={post.text}
          keywords={post.keywords}
          position={post.position}
          delay={index * 0.3}
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
      
      {/* Overlay form */}
      <OverlayForm isVisible={showOverlay} />
    </div>
  );
}

export default App;