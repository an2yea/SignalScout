import React, { useEffect, useRef } from 'react';

interface ConnectionLinesProps {
  isActive: boolean;
  posts: Array<{ position: { x: number; y: number }; isMatched?: boolean }>;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ isActive, posts }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Clear existing paths
    svg.innerHTML = '';

    if (isActive) {
      posts.forEach((post, index) => {
        const postX = (post.position.x / 100) * rect.width;
        const postY = (post.position.y / 100) * rect.height;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${centerX} ${centerY} Q ${(centerX + postX) / 2} ${(centerY + postY) / 2 - 50} ${postX} ${postY}`;
        
        path.setAttribute('d', d);
        path.setAttribute('stroke', post.isMatched ? '#60a5fa' : '#374151');
        path.setAttribute('stroke-width', post.isMatched ? '2' : '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0');
        
        if (post.isMatched) {
          path.setAttribute('filter', 'drop-shadow(0 0 4px rgba(96, 165, 250, 0.5))');
        }

        svg.appendChild(path);

        // Animate the path
        setTimeout(() => {
          path.style.transition = 'opacity 0.8s ease-out';
          path.style.opacity = post.isMatched ? '0.8' : '0.4';
        }, 5000 + index * 200);
      });
    }
  }, [isActive, posts]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};