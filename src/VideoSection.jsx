import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Film } from 'lucide-react';

export const VideoSection = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const videos = Array.from({ length: 10 }, (_, i) => ({
    title: `Special Moments and moments`,
    src: `/videos/${i + 1}.mp4`,
    description: "Every video captures a beautiful memory of our journey"
  }));

  // Handle video playback
  const handleVideoPlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setUserInteracted(true);
      } catch (error) {
        console.error("Video playback failed:", error);
      }
    }
  };

  // Handle video container click
  const handleVideoClick = (e) => {
    // Prevent click from reaching the video element if we're swiping
    if (touchStart) return;
    
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        handleVideoPlay();
      } else {
        video.pause();
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
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
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <section id={id} className="min-h-screen bg-black py-20 relative z-10 snap-start">
      <div 
        ref={sectionRef}
        className="container mx-auto px-4 sm:px-6 opacity-0 translate-y-8 transition-all duration-700"
      >
        <h2 className="text-4xl md:text-6xl font-thin text-white mb-8 sm:mb-16 tracking-wider text-center">
          Our Special Moments
        </h2>

        <div 
          className="relative max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-2 rounded-full bg-black/50 text-white/75 hover:bg-black/75 hover:text-white transition-all touch-manipulation active:scale-95"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-2 rounded-full bg-black/50 text-white/75 hover:bg-black/75 hover:text-white transition-all touch-manipulation active:scale-95"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative overflow-hidden rounded-lg sm:rounded-xl w-full" style={{ aspectRatio: '16/9' }}>
            {videos.map((video, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentIndex 
                    ? 'translate-x-0 z-10' 
                    : index < currentIndex 
                    ? '-translate-x-full z-0' 
                    : 'translate-x-full z-0'
                }`}
                style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
                onClick={handleVideoClick}
              >
                <video
                  ref={index === currentIndex ? videoRef : null}
                  src={video.src}
                  className="w-full h-full object-contain touch-manipulation"
                  controls
                  playsInline
                  controlsList="nodownload nofullscreen"
                  preload="metadata"
                  poster={`/videos/${index + 1}.jpg`}
                  muted={!userInteracted}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/75 to-transparent pointer-events-none">
                  <p className="text-white text-center text-base sm:text-lg">{video.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating || index === currentIndex) return;
                  if (videoRef.current) {
                    videoRef.current.pause();
                  }
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 800);
                }}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 scale-100 hover:bg-white/50'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};