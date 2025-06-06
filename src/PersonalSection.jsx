import React, { useRef, useEffect } from 'react';
import { Star, Coffee, HeartHandshake, Sunrise, Gift } from 'lucide-react';

export const PersonalSection = ({ id }) => {
  const timelineRef = useRef(null);

  const milestones = [
    {
      icon: <Coffee />,
      date: "2021",
      title: "Facebook Chatting",
      description: "Toh baate start hui thi, just a casual chat about life, dukh and dard aur fir kb pta nahi bestfriends ban gaye."
    },
    {
      icon: <HeartHandshake />,
      date: "Oct 2021",
      title: "First Meeting",
      description: "Durga pandal, mujhe kitna wait krwaya, aur notes lene ja rhi ye ghar me bahana bna kr aayi thi."
    },
    {
      icon: <Sunrise />,
      date: "2022",
      title: "Collage Meets",
      description: "Mai har month Allahabad aata tha, aur fir hum ghumne aur misti krne jaate the"
    },
    {
      icon: <Gift />,
      date: "2023",
      title: "Memories Together",
      description: "Kuch na kuch khaas krne ka try, ek dusre ke dosto se jalan, hak jatana, aur tera birthday bnana toh yaad rhega"
    },
    {
      icon: <Star />,
      date: "Today",
      title: "Always Together",
      description: "Aur aaj itne saalo ke baad bhi, itne ldayi, momories ke sath bestfriends hain, aur hamesha rahenge. Tere bina sab kuch adhoora hai."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className="min-h-screen bg-black py-20 relative z-10 snap-start">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl md:text-6xl font-thin text-white mb-6 tracking-wider text-center">
          Our Story
        </h2>
        <p className="text-lg sm:text-xl text-white/70 text-center mb-16 max-w-2xl mx-auto px-4">
          Every moment with you is a treasure, here are some of my favorites...
        </p>

        <div ref={timelineRef} className="max-w-4xl mx-auto relative">
          {/* Timeline line - hidden on mobile, shown on md+ */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500/50 via-purple-500/50 to-transparent"></div>

          {/* Mobile timeline line */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500/50 via-purple-500/50 to-transparent"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="timeline-item opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`flex items-start md:items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}>
                  <div className="flex-1">
                    <div className="ml-12 md:mx-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 hover:border-pink-500/30 transition-all duration-500 relative">
                      {/* Mobile date badge */}
                      <div className="md:hidden absolute -left-16 top-5 flex items-center">
                        <div className="w-6 h-6 bg-pink-500/20 border-2 border-pink-500 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex items-center mb-4 flex-wrap gap-2">
                        <span className="text-pink-400 flex-shrink-0">
                          {milestone.icon}
                        </span>
                        <span className="text-white/60 text-sm">
                          {milestone.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-light text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Desktop timeline dot */}
                  <div className="hidden md:flex w-8 h-8 bg-pink-500/20 border-2 border-pink-500 rounded-full items-center justify-center relative z-10">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  </div>

                  <div className="flex-1 hidden md:block"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Final message */}
          <div className="mt-16 text-center timeline-item opacity-0 translate-y-8 transition-all duration-700 ease-out px-4">
            <p className="text-white/90 text-lg sm:text-xl font-light italic">
              "Each milestone with you is a reminder of how blessed I am to have you in my life."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};