'use client';

import React, { useRef, useEffect, useState } from 'react';

const AudioVisualizer = ({ isPlaying, audioData }) => {
  const canvasRef = useRef(null);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const containerWidth = Math.min(800, window.innerWidth - 20); // Max width of 800px with 10px margin on each side
      canvas.width = containerWidth;
      const newIsWideScreen = window.innerWidth > 800;
      setIsWideScreen(newIsWideScreen);
      canvas.height = newIsWideScreen ? 160 : 80; // Double height for wide screens
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const wavePoints = new Array(canvas.width).fill(canvas.height / 2);
    const speeds = new Array(canvas.width).fill(0);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let i = 0; i < wavePoints.length; i++) {
        if (isPlaying) {
          speeds[i] += (Math.random() - 0.5) * 0.1;
          speeds[i] *= 0.98; // Damping
          wavePoints[i] += speeds[i];
          wavePoints[i] = Math.max(0, Math.min(canvas.height, wavePoints[i]));
        } else {
          wavePoints[i] += (canvas.height / 2 - wavePoints[i]) * 0.05;
        }

        ctx.lineTo(i, wavePoints[i]);
      }

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(255, 100, 100, 0.5)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(100, 100, 255, 0.5)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, audioData]);

  return (
    <div className="w-full max-w-[800px] mx-auto px-[10px]">
      <canvas ref={canvasRef} className={`w-full rounded-lg ${isWideScreen ? 'h-40' : 'h-20'}`} />
    </div>
  );
};

export default AudioVisualizer;