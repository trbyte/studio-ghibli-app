import React, { useState, useEffect, useRef } from 'react';

export const Carousel3D = ({ movies = [], onSelectMovie }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [radius, setRadius] = useState(1000);
  
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const autoRotateRef = useRef(null);
  
  // Limit to 12 movies for better spacing and visibility in the ring
  const displayMovies = movies;
  const quantity = displayMovies.length;
  const angleStep = quantity > 0 ? 360 / quantity : 0;

  // Handle Resize for Radius to ensure cards don't overlap too much on smaller screens
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setRadius(550);
      else if (width < 1024) setRadius(750);
      else setRadius(1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setRotation(prev => prev + angleStep);
      } else if (e.key === 'ArrowRight') {
        setRotation(prev => prev - angleStep);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [angleStep]);

  // Auto-Rotation logic
  useEffect(() => {
    const startAutoRotate = () => {
      autoRotateRef.current = window.setInterval(() => {
        if (!isDragging) {
          setRotation(prev => prev - 0.08);
        }
      }, 50);
    };

    startAutoRotate();
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [isDragging]);

  // Drag/Swipe Handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startRotationRef.current = rotation;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    const sensitivity = 0.15;
    setRotation(startRotationRef.current + deltaX * sensitivity);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap to the nearest card
    setRotation(Math.round(rotation / angleStep) * angleStep);
  };

  if (displayMovies.length === 0) {
    return null;
  }

  return (
    <div 
      className="carousel-wrapper relative z-20 select-none"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      <div 
        className="carousel-inner"
        style={{ 
          transform: `rotateX(-8deg) rotateY(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {displayMovies.map((movie, index) => {
          const rotationY = (index * angleStep);
          
          // Calculate if this card is roughly "in front" to apply a focus effect
          const normalizedRotation = ((rotationY + rotation) % 360 + 360) % 360;
          // Find the closest card to 0 degrees (directly in front)
          const distanceFromFront = Math.min(normalizedRotation, 360 - normalizedRotation);
          
          // Find the index of the card closest to front
          const allDistances = displayMovies.map((_, idx) => {
            const rotY = (idx * angleStep);
            const normRot = ((rotY + rotation) % 360 + 360) % 360;
            return Math.min(normRot, 360 - normRot);
          });
          const minDistance = Math.min(...allDistances);
          const closestIndex = allDistances.indexOf(minDistance);
          
          // Only highlight the single closest card
          const isFront = index === closestIndex && distanceFromFront < 30;

          return (
            <div
              key={movie.id}
              className={`carousel-card group cursor-pointer bg-slate-900 transition-all duration-500 ${isFront ? 'ring-2 ring-yellow-400/40 z-50' : 'z-0'}`}
              onClick={() => {
                if (!isDragging) {
                  // Calculate the rotation needed to center this card
                  // The card is at rotationY degrees, so we need to rotate by -rotationY to center it
                  // Normalize to find the shortest rotation path
                  const targetRotation = -rotationY;
                  const currentNormalized = ((rotation % 360) + 360) % 360;
                  const targetNormalized = ((targetRotation % 360) + 360) % 360;
                  
                  // Calculate the difference and choose shortest path
                  let diff = targetNormalized - currentNormalized;
                  if (Math.abs(diff) > 180) {
                    diff = diff > 0 ? diff - 360 : diff + 360;
                  }
                  
                  // Update rotation smoothly
                  setRotation(rotation + diff);
                  
                  // Call onSelectMovie after rotation animation completes
                  if (onSelectMovie) {
                    setTimeout(() => {
                      onSelectMovie(movie);
                    }, 400);
                  }
                }
              }}
              style={{
                transform: `rotateY(${rotationY}deg) translateZ(${radius}px) rotateX(8deg) ${isFront ? 'scale(1.08)' : 'scale(0.92)'}`,
                opacity: isFront ? 1 : 0.6,
                filter: isFront ? 'none' : 'blur(0.5px) brightness(0.5)',
              }}
            >
              <img
                src={movie.image || movie.movie_banner}
                alt={movie.title}
                className="carousel-card-img transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 border-[1px] border-white/10 group-hover:border-yellow-400/50 rounded-xl transition-colors duration-500 pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 transform translate-z-20">
                <span className="text-yellow-400 text-[8px] sm:text-[9px] md:text-[10px] font-mono font-bold">{movie.release_date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

