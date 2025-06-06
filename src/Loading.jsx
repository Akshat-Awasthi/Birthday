import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LoadingScreen = () => {
  const containerRef = useRef(null);
  const loadingTextRef = useRef(null);
  
  useEffect(() => {
    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Gold/champagne particle material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      transparent: true,
      color: 0xf0d890,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 2;
    
    // Loading text animation
    let dots = '';
    const loadingInterval = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      if (loadingTextRef.current) {
        loadingTextRef.current.textContent = `PREPARING YOUR CELEBRATION${dots}`;
      }
    }, 400);
    
    // Progress counter
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      const progressElement = document.getElementById('loading-progress');
      if (progressElement) {
        progressElement.textContent = `${progress}%`;
        document.getElementById('progress-bar-fill').style.width = `${progress}%`;
      }
    }, 150);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
        clearInterval(loadingInterval);
        clearInterval(progressInterval);
        window.removeEventListener('resize', handleResize);
    
        // Check if containerRef.current exists before removing the renderer DOM element
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="relative w-full h-full" ref={containerRef}></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-thin text-white/90 tracking-widest mb-12">HAPPY BIRTHDAY</h1>
        <div ref={loadingTextRef} className="text-xl text-white/70 mb-8">PREPARING YOUR CELEBRATION</div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div id="progress-bar-fill" className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-300 ease-out"></div>
        </div>
        <div id="loading-progress" className="mt-2 text-white/50">0%</div>
      </div>
    </div>
  );
};