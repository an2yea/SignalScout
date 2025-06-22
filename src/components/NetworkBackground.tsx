import React, { useEffect, useRef } from 'react';

interface NetworkBackgroundProps {
  opacity?: number;
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = ({ opacity = 0.3 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate constellation points
    const points: { x: number; y: number; connections: number[] }[] = [];
    const numPoints = 50;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: []
      });
    }

    // Create connections between nearby points
    points.forEach((point, i) => {
      points.forEach((otherPoint, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(point.x - otherPoint.x, 2) + Math.pow(point.y - otherPoint.y, 2)
          );
          if (distance < 150 && point.connections.length < 3) {
            point.connections.push(j);
          }
        }
      });
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
      ctx.lineWidth = 1;
      
      points.forEach((point) => {
        point.connections.forEach(connectionIndex => {
          const connectedPoint = points[connectionIndex];
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(connectedPoint.x, connectedPoint.y);
          ctx.stroke();
        });
      });

      // Draw points
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.fill();
      });
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
    />
  );
};