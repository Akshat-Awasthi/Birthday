import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const HeroSection = ({ id }) => {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Animated text reveal effect
  useEffect(() => {
    if (!textRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(textRef.current);
    
    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
    };
  }, []);

  // Peaceful falling petals animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const petals = [];
    let animationFrameId;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Handle mouse and touch interactions
    const handleInteraction = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      
      setMousePosition({
        x: x / window.innerWidth,
        y: y / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchmove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    // Create petal object
    class Petal {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height - 50;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.color = [
          'rgba(255, 234, 242, 0.8)',  // Light pink
          'rgba(255, 241, 250, 0.8)',  // Very light pink
          'rgba(255, 226, 234, 0.8)',  // Soft pink
          'rgba(255, 218, 226, 0.7)'   // Dusty rose
        ][Math.floor(Math.random() * 4)];
        this.wobble = 0;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
      }
      
      update(mouseInfluence) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.wobble += this.wobbleSpeed;
        this.rotation += this.rotationSpeed;
        
        // Add subtle influence from mouse position
        if (mouseInfluence.x && mouseInfluence.y) {
          const centerX = mouseInfluence.x * canvas.width;
          const centerY = mouseInfluence.y * canvas.height;
          const dx = this.x - centerX;
          const dy = this.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) / 1500;
            this.x += Math.cos(angle) * force;
            this.y += Math.sin(angle) * force;
          }
        }
        
        // Reset when off screen
        if (this.y > canvas.height + this.size) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * -100 - this.size;
        }
      }
      
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        
        // Heart shape for petal
        const size = this.size;
        ctx.moveTo(0, -size / 2);
        ctx.bezierCurveTo(
          size / 2, -size,
          size, -size / 2,
          0, size / 2
        );
        ctx.bezierCurveTo(
          -size, -size / 2,
          -size / 2, -size,
          0, -size / 2
        );
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Initial petals
    const createPetals = () => {
      const petalCount = Math.min(
        Math.floor(canvas.width * canvas.height / (isMobile ? 30000 : 20000)), 
        isMobile ? 50 : 100
      );
      for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
      }
    };
    
    createPetals();
    
    // Add soft glow backdrop
    const drawGlowBackdrop = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      
      gradient.addColorStop(0, 'rgba(255, 240, 245, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw soft glow
      drawGlowBackdrop();
      
      // Update and draw petals
      petals.forEach(petal => {
        petal.update(mousePosition);
        petal.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);
  
  return (
    <section
      id={id}
      className="h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 to-purple-900 snap-start"
    >
      {/* Canvas for falling petals */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-hidden="true" />
      
      {/* Subtle starry background */}
      <div className="absolute inset-0 z-0 opacity-30">
        {[...Array(isMobile ? 50 : 100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Content overlay */}
      <div
        ref={textRef}
        className="relative z-50 container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-white mb-8 transform translate-y-8 transition-all duration-1000 delay-200 ease-out">
          Happy Birthday, Chutki ❤️
        </h1>
        <p className="max-w-xl mx-auto text-lg sm:text-xl md:text-2xl font-light text-white/90 mb-8 sm:mb-12 transform translate-y-8 transition-all duration-1000 delay-500 ease-out px-4">
          In the quiet moments of this special day, may you feel the depth of my love and the warmth of my wishes for you.
        </p>
        <div className="transform translate-y-8 transition-all duration-1000 delay-700 ease-out">
          <button
            onClick={() =>
              document.getElementById('memories').scrollIntoView({ behavior: 'smooth' })
            }
            className="px-8 sm:px-10 py-3 border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 rounded-full uppercase tracking-widest text-sm sm:text-base"
          >
            Our Journey Together
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="animate-bounce opacity-60">
            <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;