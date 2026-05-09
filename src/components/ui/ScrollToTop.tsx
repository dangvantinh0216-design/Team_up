"use client";

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-primary hover-glow animate-fade-in"
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-xl)',
        right: 'var(--spacing-xl)',
        width: '45px',
        height: '45px',
        padding: 0,
        borderRadius: '50%',
        zIndex: 1000,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
