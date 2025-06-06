import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { GallerySection } from './GallerySection';
import { QuotesSection } from './QuotesSection';
import { PersonalSection } from './PersonalSection';
import { FutureSection } from './FutureSection';
import { BackgroundAnimation } from './BackgroundAnimation';
import { LoadingScreen } from './Loading';
import { MusicPlayer } from './MusicPlayer';
import { PasswordPage } from './PasswordPage';

export const Birthday = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [musicPlaying, setMusicPlaying] = useState(false);

  const handleCorrectPassword = () => {
    setIsAuthenticated(true);
    setLoading(true);
    // Start loading animation after password is correct
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  if (!isAuthenticated) {
    return <PasswordPage onCorrectPassword={handleCorrectPassword} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="birthday-experience relative overflow-hidden">
      {/* Background particle animation using Three.js */}
      <BackgroundAnimation activeSection={activeSection} />
      
      {/* Header Navigation */}
      <Header 
        activeSection={activeSection} 
        navigateToSection={section => {
          setActiveSection(section);
          document.getElementById(section).scrollIntoView({ 
            behavior: 'smooth' 
          });
        }}
        toggleMusic={() => setMusicPlaying(!musicPlaying)}
        musicPlaying={musicPlaying}
      />
      
      {/* Music Controller (subtle UI in corner) */}
      <MusicPlayer playing={musicPlaying} toggle={() => setMusicPlaying(!musicPlaying)} />
      
      {/* Main Content Sections */}
      <main>
        <HeroSection id="hero" />
        <PersonalSection id="story" />
        <GallerySection id="memories" />
        <QuotesSection id="quotes" />
        <FutureSection id="future" />
      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-white/60 backdrop-blur-md bg-black/30">
        <p className="font-light tracking-wider">"Every moment of your life is a brush stroke on the canvas of your legacy."</p>
        <p className="mt-4 text-sm">Crafted with love and devotion.</p>
      </footer>
    </div>
  );
};

export default Birthday;