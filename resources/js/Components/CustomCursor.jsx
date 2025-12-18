import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const isInteractiveElement = (element) => {
      if (!element) return false;
      
      // If it's not an Element node (e.g., text node), get parent
      let el = element;
      if (el.nodeType !== 1) {
        el = el.parentElement;
        if (!el) return false;
      }
      
      // Check if it's directly an interactive element
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
        return true;
      }
      
      // Try to find closest interactive element safely
      try {
        if (el && typeof el.closest === 'function') {
          const closestLink = el.closest('a');
          const closestButton = el.closest('button');
          const closestInput = el.closest('input, textarea, select');
          return !!(closestLink || closestButton || closestInput);
        }
      } catch (err) {
        // If closest fails, try walking up the parent chain
        let parent = el.parentElement;
        while (parent) {
          if (parent.tagName === 'A' || parent.tagName === 'BUTTON' || parent.tagName === 'INPUT' || parent.tagName === 'TEXTAREA' || parent.tagName === 'SELECT') {
            return true;
          }
          parent = parent.parentElement;
        }
      }
      
      return false;
    };

    const handleMouseEnter = (e) => {
      try {
        if (isInteractiveElement(e.target)) {
          setIsHovering(true);
        }
      } catch (err) {
        // Silently fail
      }
    };

    const handleMouseLeave = (e) => {
      try {
        if (isInteractiveElement(e.target)) {
          setIsHovering(false);
        }
      } catch (err) {
        // Silently fail
      }
    };

    window.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      <div
        className={`cursor-invert ${isHovering ? 'hover' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      <div
        className="cursor-icon"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <span className="material-symbols-outlined">near_me</span>
      </div>
    </>
  );
};

