import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';

export const Header = ({ activeSection, navigateToSection, toggleMusic, musicPlaying }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const sections = [
    { id: 'hero', label: 'HOME' },
    { id: 'story', label: 'OUR STORY' },
    { id: 'memories', label: 'MEMORIES' },
    { id: 'quotes', label: 'MESSAGES' },
    { id: 'future', label: 'TOMORROW' }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  const handleNavigation = (sectionId) => {
    navigateToSection(sectionId);
    setMenuOpen(false);
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2 bg-black/80 backdrop-blur-md' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-white font-light tracking-widest text-base sm:text-lg truncate">
            HAPPY BIRTHDAY
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigation(section.id)}
                className={`text-sm tracking-wider transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'text-white font-medium scale-105' 
                    : 'text-white/70 hover:text-white hover:scale-105'
                }`}
              >
                {section.label}
              </button>
            ))}
            
            <button 
              onClick={toggleMusic}
              className="ml-4 text-white/70 hover:text-white transition-colors"
              aria-label={musicPlaying ? "Mute music" : "Play music"}
            >
              {musicPlaying ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setMenuOpen(false)} />
        <nav className="relative z-50 flex flex-col items-center justify-center min-h-screen space-y-8 text-center">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavigation(section.id)}
              className={`text-2xl tracking-wider transition-all duration-300 ${
                activeSection === section.id 
                  ? 'text-white font-medium scale-110' 
                  : 'text-white/70'
              }`}
            >
              {section.label}
            </button>
          ))}
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            className="flex items-center space-x-3 text-white/70 hover:text-white mt-8"
          >
            {musicPlaying ? (
              <>
                <Volume2 className="w-6 h-6" />
                <span className="text-lg tracking-wider">MUTE MUSIC</span>
              </>
            ) : (
              <>
                <VolumeX className="w-6 h-6" />
                <span className="text-lg tracking-wider">PLAY MUSIC</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};