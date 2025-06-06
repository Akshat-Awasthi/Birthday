import React, { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';

export const QuotesSection = ({ id }) => {
  const quotesRef = useRef(null);

  const quotes = [
    {
      text: "In your smile, I find the strength to face any challenge.",
      context: "From our first coffee date"
    },
    {
      text: "Your laughter is the melody that makes my heart dance.",
      context: "During our beach vacation"
    },
    {
      text: "With you, every moment feels like a celebration of life.",
      context: "Our weekend adventures"
    },
    {
      text: "You don't just light up a room, you illuminate my entire world.",
      context: "What I think every time I see you"
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

    const quoteElements = quotesRef.current.querySelectorAll('.quote-card');
    quoteElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 150}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className="min-h-screen bg-black py-20 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl md:text-6xl font-thin text-white mb-8 sm:mb-16 tracking-wider text-center">
          Words from My Heart
        </h2>

        <div 
          ref={quotesRef}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="quote-card opacity-0 translate-y-8 transition-all duration-700 ease-out bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 sm:p-8 hover:border-pink-500/30 group"
            >
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mb-4 sm:mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-4">
                {quote.text}
              </p>
              <p className="text-sm text-white/60 italic">
                {quote.context}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};