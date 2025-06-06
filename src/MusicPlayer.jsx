import React, { useRef, useEffect } from 'react';
import { Music, Pause, Play } from 'lucide-react';

export const MusicPlayer = ({ playing, toggle }) => {
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  return (
    <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
      <div className="group relative">
        <button
          onClick={toggle}
          className="flex items-center space-x-2 bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20 hover:border-pink-500/30 transition-all duration-300 active:scale-95 touch-manipulation"
        >
          <Music className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${playing ? 'animate-pulse' : ''}`} />
          <span className="text-white text-xs sm:text-sm font-light tracking-wider hidden sm:inline-block">
            {playing ? 'Now Playing' : 'Play Music'}
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
            Birthday Melody ♪
          </div>
        </div>
        
        {playing && (
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
        src="/birthday-song.mp3" 
        loop
        preload="auto"
      />
    </div>
  );
};