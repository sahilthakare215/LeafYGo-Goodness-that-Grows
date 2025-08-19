import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

// A selection of farming-related quotes
const quotes = [
  "The farmer has to be an optimist or he wouldn't still be a farmer.",
  "Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals, and happiness.",
  "Farming is a profession of hope.",
  "To be a farmer is to be an alchemist, turning sun, soil, and rain into sustenance.",
  "The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings."
];

function Footer() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Use a ref and useInView to detect when the footer enters the viewport
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true });

  useEffect(() => {
    let fadeOutTimer;
    let nextQuoteTimer;

    // The animation should only run if the footer is in view
    if (isInView) {
      const displayTime = currentQuoteIndex === 0 ? 3000 : 5000;
      const fadeOutDuration = 2500; // 2.5 seconds

      // First, make the quote visible
      setIsVisible(true);

      // Set a timer to start fading out after the display time
      fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, displayTime);

      // Set another timer to switch to the next quote after the fade-out completes
      nextQuoteTimer = setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }, displayTime + fadeOutDuration);
    }
    
    // Cleanup function to clear timers on unmount or before the effect re-runs
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextQuoteTimer);
    };
  }, [isInView, currentQuoteIndex]);

  const footerStyle = {
    backgroundColor: '#2A3A2C',
    color: '#F5F5DC',
    padding: '30px 20px',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.2rem',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  };

  const quoteStyle = {
    margin: 0,
    transition: 'opacity 2.5s ease-in-out',
    opacity: isVisible ? 1 : 0,
    minHeight: '2.4rem', // Prevents the layout from shifting between quotes
  };

  return (
    <footer ref={footerRef} style={footerStyle}>
      <p style={quoteStyle}>
        {quotes[currentQuoteIndex]}
      </p>
    </footer>
  );
}

export default Footer;