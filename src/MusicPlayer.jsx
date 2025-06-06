import React, { useRef, useEffect, useState } from 'react';
import { Music, Pause, Play } from 'lucide-react';

const sectionSongs = {
  hero: {
    src: '/songs/jugrafiya.mp3',
    title: 'Birthday Intro ♪'
  },
  story: {
    src: '/songs/kashmir.mp3',
    title: 'Our Journey ♪'
  },
  memories: {
    src: '/songs/woh-din.mp3',
    title: 'Sweet Memories ♪'
  },
  quotes: {
    src: '/songs/locha.mp3',
    title: 'Love Notes ♪'
  },
  future: {
    src: '/songs/junoon.mp3',
    title: 'Dreams Ahead ♪'
  }
};

export const MusicPlayer = ({ playing, toggle, activeSection }) => {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState('Birthday Intro ♪');
  const [userInteracted, setUserInteracted] = useState(false);
  const [isChangingSection, setIsChangingSection] = useState(false);
  const [volume, setVolume] = useState(0);

  // Initialize audio context after user interaction
  const handleFirstInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
    toggle();
  };

  const loadAndPlayAudio = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.volume = 0;
      await audioRef.current.load();
      await audioRef.current.play();
      return true;
    } catch (error) {
      console.error("Audio playback failed:", error);
      return false;
    }
  };

  // Handle section changes
  useEffect(() => {
    const newSong = sectionSongs[activeSection];
    if (newSong?.src !== currentSong?.src) {
      setIsChangingSection(true);
      setCurrentSong(newSong);

      const handleSectionChange = async () => {
        if (audioRef.current && playing) {
          audioRef.current.src = newSong.src;
          const success = await loadAndPlayAudio();
          if (success) {
            // Start volume fade in only after successful play
            setVolume(0);
            requestAnimationFrame(() => {
              setVolume(1);
            });
          }
        }
        setIsChangingSection(false);
      };

      handleSectionChange();
    }
  }, [activeSection, playing]);

  // Handle volume changes smoothly
  useEffect(() => {
    if (!audioRef.current || isChangingSection) return;

    const targetVolume = playing ? 1 : 0;
    const startVolume = audioRef.current.volume;
    const duration = 500;
    const startTime = performance.now();

    const updateVolume = (currentTime) => {
      if (!audioRef.current || isChangingSection) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const newVolume = startVolume + (targetVolume - startVolume) * (1 - Math.cos(progress * Math.PI)) / 2;
      
      audioRef.current.volume = newVolume;

      if (progress < 1) {
        requestAnimationFrame(updateVolume);
      } else if (newVolume === 0) {
        audioRef.current.pause();
      }
    };

    requestAnimationFrame(updateVolume);
  }, [playing, volume, isChangingSection]);

  // Handle play state
  useEffect(() => {
    if (!audioRef.current || !userInteracted || isChangingSection) return;

    const handlePlayback = async () => {
      if (playing) {
        const success = await loadAndPlayAudio();
        if (!success) {
          toggle();
        }
      } else {
        audioRef.current.pause();
      }
    };

    handlePlayback();
  }, [playing, userInteracted, isChangingSection]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
      <div className="group relative">
        <button
          onClick={handleFirstInteraction}
          className="flex items-center space-x-2 bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20 hover:border-pink-500/30 transition-all duration-300 active:scale-95 touch-manipulation"
          disabled={isChangingSection}
        >
          <Music className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${playing ? 'animate-pulse' : ''}`} />
          <span className="text-white text-xs sm:text-sm font-light tracking-wider hidden sm:inline-block">
            {!userInteracted ? 'Playing' : isChangingSection ? 'Changing Song...' : playing ? 'Now Playing' : 'Play Music'}
          </span>
          {playing ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
          )}
        </button>
        
        <div className={`absolute -top-10 sm:-top-12 right-0 transform transition-all duration-300 ${
          playing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs text-white/80 whitespace-nowrap">
            {isChangingSection ? 'Loading...' : currentSong?.title}
          </div>
        </div>
        
        {playing && !isChangingSection && (
          <div className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2">
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              <span className="w-0.5 sm:w-1 h-3 bg-pink-400 animate-music-bar-1"></span>
              <span className="w-0.5 sm:w-1 h-4 bg-pink-400 animate-music-bar-2"></span>
              <span className="w-0.5 sm:w-1 h-2 bg-pink-400 animate-music-bar-3"></span>
            </div>
          </div>
        )}
      </div>
      <audio 
        ref={audioRef}
        preload="auto"
        loop
      />
    </div>
  );
};