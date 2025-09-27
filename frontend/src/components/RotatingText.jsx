// src/components/RotatingText.jsx

import  { useState, useEffect } from 'react';
import './RotatingText.css'; // We'll create this CSS file next

const RotatingText = ({ words, period = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(words[index]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsFadingOut(true); // Start the fade-out animation

      setTimeout(() => {
        // After fade-out, update the word and fade back in
        setIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsFadingOut(false);
      }, 500); // This duration should match the CSS animation duration
      
    }, period);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [words, period]);
  
  // Update the current word whenever the index changes
  useEffect(() => {
    setCurrentWord(words[index]);
  }, [index, words]);

  return (
    <span className={`rotating-word ${isFadingOut ? 'fade-out' : 'fade-in'}`}>
      {currentWord}
    </span>
  );
};

export default RotatingText;