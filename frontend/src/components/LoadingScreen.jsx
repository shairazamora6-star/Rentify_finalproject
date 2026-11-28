import { useState, useEffect } from 'react';
import RentifyLogo from '../components/RentifyLogo';
import './LoadingScreen.css';

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onLoaded) onLoaded();
          return 100;
        }
        return prev + 15;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [onLoaded]);

  return (
    <div className="loading-screen" role="status" aria-label="Loading Rentify">
      <div className="loading-glow" />
      <div className="loading-card">
        <div className="loading-logo-wrap">
          <RentifyLogo size={52} />
        </div>
        <h2>rentify<span className="dot">.</span></h2>
        <p className="loading-tagline">Preparing your neighborhood marketplace…</p>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="loading-percentage">{progress}%</span>
      </div>
    </div>
  );
}
