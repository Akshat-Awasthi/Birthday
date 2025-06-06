import React, { useEffect, useRef } from 'react';
import { Sparkles, Heart, Map, Compass } from 'lucide-react';

export const FutureSection = ({ id }) => {
  const dreamsRef = useRef(null);

  const dreams = [
    {
      icon: <Map className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Adventures Together",
      description: "All the places we'll explore, from hidden city cafes to mountain peaks at sunrise.",
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Growing Love",
      description: "Watching our bond grow stronger with each passing day, building a lifetime of happiness.",
    },
    {
      icon: <Compass className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "New Horizons",
      description: "Discovering new passions and interests together, supporting each other's dreams.",
    },
    {
      icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Magic Moments",
      description: "Creating countless precious memories, from quiet evenings to grand celebrations.",
    }
  ];

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

    const dreamElements = dreamsRef.current.querySelectorAll('.dream-card');
    dreamElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 150}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className="min-h-screen bg-black py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl md:text-6xl font-thin text-white mb-4 sm:mb-6 tracking-wider text-center">
          Our Tomorrow
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/70 text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
          As we celebrate this special day, I dream of all the beautiful moments that await us...
        </p>

        <div 
          ref={dreamsRef}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto"
        >
          {dreams.map((dream, index) => (
            <div
              key={index}
              className="dream-card opacity-0 translate-y-8 transition-all duration-700 ease-out bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 sm:p-8 hover:border-pink-500/30 group"
            >
              <div className="text-pink-400 mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform">
                {dream.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-white mb-3 sm:mb-4">
                {dream.title}
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                {dream.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center px-4">
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-light italic max-w-2xl mx-auto">
            "The best is yet to come, my love. Every birthday marks not just another year, but another chapter in our beautiful story together."
          </p>
        </div>
      </div>
    </section>
  );
};