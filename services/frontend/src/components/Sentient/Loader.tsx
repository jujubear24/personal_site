'use client';

import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onFinished: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('SYSTEM BOOT');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const steps = [
      { pct: 20, text: 'ESTABLISHING CONNECTION' },
      { pct: 45, text: 'CALIBRATING OPTICS' },
      { pct: 70, text: 'SYNCHRONIZING MESH' },
      { pct: 90, text: 'DECRYPTING UPLINK' },
      { pct: 100, text: 'SYSTEM READY' },
    ];

    let currentStep = 0;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 8;
        const next = Math.min(prev + increment, 100);

        if (currentStep < steps.length && next >= steps[currentStep].pct) {
          setStatus(steps[currentStep].text);
          currentStep++;
        }

        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onFinished, 800);
      }, 500);
    }
  }, [progress, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-[#030712] transition-opacity duration-700 ease-in-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Central Pulse */}
      <div className="relative mb-12">
        <div className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-800 animate-spin-slow"></div>
        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border-t border-b border-amber-500/50 animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-0 m-auto w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"></div>
      </div>

      {/* Title */}
      <h1 className="font-serif italic text-3xl md:text-4xl text-gray-900 dark:text-white mb-6 tracking-tight animate-fadeIn">
        Sentient
      </h1>

      {/* Progress Bar */}
      <div className="w-64 h-0.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4 relative">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-200 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="h-6 flex items-center justify-center">
        <span className="font-mono text-[9px] text-gray-400 dark:text-gray-600 tracking-[0.3em] uppercase">
          {`> ${status}`}
          <span className="animate-pulse ml-1">_</span>
        </span>
      </div>

      {/* Corner Decorators */}
      <div className="absolute top-8 left-8 w-px h-8 bg-gray-300 dark:bg-gray-800"></div>
      <div className="absolute top-8 left-8 w-8 h-px bg-gray-300 dark:bg-gray-800"></div>
      <div className="absolute bottom-8 right-8 w-px h-8 bg-gray-300 dark:bg-gray-800"></div>
      <div className="absolute bottom-8 right-8 w-8 h-px bg-gray-300 dark:bg-gray-800"></div>
    </div>
  );
};

export default Loader;
