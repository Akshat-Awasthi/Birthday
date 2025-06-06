import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Calendar, Star } from 'lucide-react';

export const GallerySection = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const galleryRef = useRef(null);

  const memories = [
    {
      title: "Our First Dance",
      date: "July 2023",
      description: "The moment we first danced together under the stars, your smile lit up the entire night.",
      image: "/api/placeholder/800/600",
      special: "This was the beginning of our beautiful journey together."
    },
    {
      title: "Sunset Adventures",
      date: "September 2023",
      description: "Chasing sunsets together, making every moment count. Your adventurous spirit makes life extraordinary.",
      image: "/api/placeholder/800/600",
      special: "You taught me to appreciate life's simple beauties."
    },
    {
      title: "Cozy Movie Nights",
      date: "December 2023",
      description: "Those perfect winter evenings, wrapped in blankets, sharing dreams and hot chocolate.",
      image: "/api/placeholder/800/600",
      special: "Your presence makes every moment feel like home."
    },
    {
      title: "Birthday Eve Last Year",
      date: "March 2024",
      description: "The night before your last birthday, planning surprises and creating memories.",
      image: "/api/placeholder/800/600",
      special: "Seeing your joy makes my world complete."
    }
  ];

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

    if (Math.abs(diff) > 50) { // minimum swipe distance
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
    <section id={id} className="min-h-screen bg-black py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl md:text-6xl font-thin text-white mb-16 tracking-wider text-center">
          Our Story Together
        </h2>
        
        <div 
          ref={galleryRef}
          className="max-w-5xl mx-auto opacity-0 translate-y-12 transition-all duration-1000 ease-out"
        >
          <div className="relative">
            <div 
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-2xl hover:border-pink-500/30 transition-all duration-500"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div className="aspect-w-16 aspect-h-12 sm:aspect-h-9 overflow-hidden">
                <img 
                  src={memories[currentIndex].image} 
                  alt={memories[currentIndex].title}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                  }`}
                />
              </div>
              
              <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                <div className={`space-y-4 sm:space-y-6 transition-all duration-500 ${
                  isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <h3 className="text-2xl sm:text-3xl font-light text-white order-2 sm:order-1">
                      {memories[currentIndex].title}
                    </h3>
                    <div className="flex items-center space-x-2 order-1 sm:order-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                      <span className="text-white/70 text-sm">{memories[currentIndex].date}</span>
                    </div>
                  </div>
                  
                  <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                    {memories[currentIndex].description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-pink-400">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="text-sm sm:text-base italic">
                      {memories[currentIndex].special}
                    </p>
                  </div>
                  
                  <div className="pt-2 sm:pt-4 flex justify-end">
                    <button className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-sm sm:text-base">Cherish this moment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons - Hidden on mobile (using swipe instead) */}
            <button 
              onClick={goToPrev}
              className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous memory"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              onClick={goToNext}
              className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next memory"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          {/* Navigation dots */}
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