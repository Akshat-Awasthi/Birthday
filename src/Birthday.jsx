import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { GallerySection } from './GallerySection';
import { QuotesSection } from './QuotesSection';
import { PersonalSection } from './PersonalSection';
import { FutureSection } from './FutureSection';
import { VideoSection } from './VideoSection';
import { BackgroundAnimation } from './BackgroundAnimation';
import { LoadingScreen } from './Loading';
import { MusicPlayer } from './MusicPlayer';
import { PasswordPage } from './PasswordPage';

export const Birthday = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial render
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [musicPlaying, setMusicPlaying] = useState(true);

  // Section detection using scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (window.scrollY / scrollHeight) * 100;
      
      // Update active section based on scroll percentage
      let newSection;
      if (scrollPercentage < 16.67) {
        newSection = 'hero';
      } else if (scrollPercentage < 33.33) {
        newSection = 'story';
      } else if (scrollPercentage < 50) {
        newSection = 'memories';
      } else if (scrollPercentage < 66.67) {
        newSection = 'videos';
      } else if (scrollPercentage < 83.33) {
        newSection = 'quotes';
      } else {
        newSection = 'future';
      }

      // If entering video section, pause the music
      if (newSection === 'videos' && activeSection !== 'videos' && musicPlaying) {
        setMusicPlaying(false);
      }
      
      setActiveSection(newSection);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Call once to set initial section
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, musicPlaying]);

  // Password and loading handlers
  const handleCorrectPassword = () => {
    setIsAuthenticated(true);
    // Store authentication status in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    setLoading(true);
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

  const scrollToSection = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="birthday-experience relative overflow-hidden">
      <BackgroundAnimation activeSection={activeSection} />
      
      <Header 
        activeSection={activeSection} 
        navigateToSection={scrollToSection}
        toggleMusic={() => setMusicPlaying(!musicPlaying)}
        musicPlaying={musicPlaying}
      />
      
      <MusicPlayer 
        playing={musicPlaying} 
        toggle={() => setMusicPlaying(!musicPlaying)} 
        activeSection={activeSection}
      />
      
      <main className="relative overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-black">
        <HeroSection id="hero" />
        <PersonalSection id="story" />
        <GallerySection id="memories" />
        <VideoSection id="videos" />
        <QuotesSection id="quotes" />
        <FutureSection id="future" />
      </main>
      
      <footer className="py-8 text-center text-white backdrop-blur-md bg-black/70">
        <p className="font-light tracking-wider">"Always Remember: Main hu na"</p>
        <p className="mt-4 text-sm">Crafted with love by Amazing Akshat</p>
      </footer>
    </div>
  );
};

export default Birthday;