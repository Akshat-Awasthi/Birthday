import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const GallerySection = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const galleryRef = useRef(null);

  const memories = Array.from({ length: 27 }, (_, i) => ({
    image: `/photos/${i + 1}.jpeg`,
    caption: `Memories`
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          galleryRef.current.style.opacity = "1";
          galleryRef.current.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      setTouchStart(null);
    }
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % memories.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <section id={id} className="min-h-screen bg-black py-20 relative z-10 snap-start">
      <div 
        ref={galleryRef} 
        className="container mx-auto px-4 sm:px-6 opacity-0 translate-y-8 transition-all duration-700"
      >
        <h2 className="text-4xl md:text-6xl font-thin text-white mb-8 sm:mb-16 tracking-wider text-center">
          Our Beautiful Memories
        </h2>

        <div 
          className="relative max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-2 rounded-full bg-black/50 text-white/75 hover:bg-black/75 hover:text-white transition-all touch-manipulation active:scale-95"
            aria-label="Previous memory"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-2 rounded-full bg-black/50 text-white/75 hover:bg-black/75 hover:text-white transition-all touch-manipulation active:scale-95"
            aria-label="Next memory"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative overflow-hidden rounded-xl" style={{ minHeight: "60vh" }}>
            {memories.map((memory, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-in-out ${
                  index === currentIndex 
                    ? 'translate-x-0 z-10' 
                    : index < currentIndex 
                    ? '-translate-x-full z-0' 
                    : 'translate-x-full z-0'
                }`}
                style={{ height: "60vh", pointerEvents: index === currentIndex ? 'auto' : 'none' }}
              >
                <img
                  src={memory.image}
                  alt={memory.caption}
                  className="max-w-full max-h-full object-contain"
                  style={{ display: "block" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/75 to-transparent">
                  <p className="text-white text-center text-lg">{memory.caption}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {memories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating || index === currentIndex) return;
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 800);
                }}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 scale-100 hover:bg-white/50'
                }`}
                aria-label={`Go to memory ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};