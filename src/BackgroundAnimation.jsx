import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import particlePng from '../public/particle.svg'


export const BackgroundAnimation = ({ activeSection }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef(null);
  
  // Romantic, peaceful color themes based on active section
  const sectionColors = useMemo(() => ({
    hero: {
      colorA: new THREE.Color(0.05, 0.02, 0.1),      // Deep indigo
      colorB: new THREE.Color(0.12, 0.05, 0.15),     // Soft purple
      particleColor: new THREE.Color(0.7, 0.6, 0.9)  // Lavender particles
    },
    memories: {
      colorA: new THREE.Color(0.03, 0.05, 0.12),     // Deep blue
      colorB: new THREE.Color(0.08, 0.05, 0.15),     // Blue-purple
      particleColor: new THREE.Color(0.6, 0.7, 0.9)  // Soft blue particles
    },
    wishes: {
      colorA: new THREE.Color(0.08, 0.04, 0.1),      // Warm purple
      colorB: new THREE.Color(0.14, 0.06, 0.12),     // Muted rose
      particleColor: new THREE.Color(0.9, 0.7, 0.8)  // Rose gold particles
    },
    celebrate: {
      colorA: new THREE.Color(0.06, 0.02, 0.08),     // Deep purple
      colorB: new THREE.Color(0.12, 0.08, 0.16),     // Lighter purple
      particleColor: new THREE.Color(0.8, 0.7, 1.0)  // Light purple particles
    }
  }), []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene and Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 150;
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Soft gradient background
    const bgGeometry = new THREE.PlaneGeometry(2, 2);
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        colorA: { value: sectionColors.hero.colorA },
        colorB: { value: sectionColors.hero.colorB },
        intensity: { value: 1.0 }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform float intensity;
        
        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);
          
          float res = mix(
            mix(sin(dot(ip, vec2(13.1, 73.7))),
                sin(dot(ip + vec2(1.0, 0.0), vec2(13.1, 73.7))), u.x),
            mix(sin(dot(ip + vec2(0.0, 1.0), vec2(13.1, 73.7))),
                sin(dot(ip + vec2(1.0, 1.0), vec2(13.1, 73.7))), u.x), u.y);
          return res * 0.5 + 0.5;
        }
        
        void main() {
          vec2 uv = gl_FragCoord.xy / resolution;
          
          // Subtle soft noise
          float slowTime = time * 0.05;
          float noiseValue = noise(uv * 3.0 + slowTime) * 0.05;
          
          // Gradient with subtle movement
          vec3 color = mix(
            colorA, 
            colorB, 
            uv.y + noiseValue + 0.05 * sin(slowTime + uv.x * 2.0)
          );
          
          // Gentle vignette
          float vignette = 1.0 - smoothstep(0.4, 1.5, length(uv - 0.5) * 1.8);
          color = mix(color * 0.6, color, vignette);
          
          gl_FragColor = vec4(color * intensity, 1.0);
        }
      `,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.material.depthTest = false;
    bgMesh.renderOrder = -1;
    scene.add(bgMesh);

    // Soft particles system with fluid distribution (not box-like)
    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 800 : 1500;
    
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const opacities = new Float32Array(particlesCount);
    const colors = new Float32Array(particlesCount * 3);
    
    const particleColor = sectionColors.hero.particleColor;
    
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Create particles with fluid, non-box distribution
      // Using spiral and Gaussian distributions
      let x, y, z;
      
      if (Math.random() < 0.6) {
        // Gaussian-like distribution for center density
        const r = Math.pow(Math.random(), 2) * 150;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
        z = r * Math.cos(phi);
      } else {
        // Spiral distribution for outer particles
        const turns = 5;
        const t = Math.random() * turns * Math.PI * 2;
        // Varying the radius based on the turn to create a spiral effect
        const radius = 50 + t * 5;
        const height = (Math.random() - 0.5) * 150;
        
        x = radius * Math.cos(t);
        y = height;
        z = radius * Math.sin(t);
      }
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Varied but soft particle sizes
      sizes[i] = 0.5 + Math.random() * 3.5;
      
      // Varied opacity for depth
      opacities[i] = 0.1 + Math.random() * 0.5;
      
      // Subtle color variations
      colors[i3] = particleColor.r + Math.random() * 0.1 - 0.05;
      colors[i3 + 1] = particleColor.g + Math.random() * 0.1 - 0.05;
      colors[i3 + 2] = particleColor.b + Math.random() * 0.1 - 0.05;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Soft particle texture
    const particleTexture = new THREE.TextureLoader().load();

    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: particleTexture },
        activeSection: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute vec3 color;
        uniform float time;
        uniform float activeSection;
        
        varying vec3 vColor;
        varying float vOpacity;
        
        // Simplex noise for more organic movement
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vColor = color;
          vOpacity = opacity;
          
          // More organic movement using simplex noise
          vec3 pos = position;
          float slowTime = time * 0.1;
          float noiseScale = 0.02;
          float amplitudeFactor = 8.0;
          
          // Section-specific fluid movements
          if (activeSection < 0.5) {
            // Hero section - fluid flowing wave
            pos.x += sin(slowTime * 0.5 + pos.y * 0.01 + pos.z * 0.01) * 5.0;
            pos.y += cos(slowTime * 0.6 + pos.x * 0.01 + pos.z * 0.01) * 4.0;
            pos.z += sin(slowTime * 0.7 + pos.x * 0.01 + pos.y * 0.01) * 3.0;
          } else if (activeSection < 1.5) {
            // Memories section - gentle swirling motion
            float angle = slowTime * 0.1;
            float r = length(pos.xz);
            float currentAngle = atan(pos.z, pos.x);
            float newAngle = currentAngle + angle * (1.0 - r / 200.0);
            pos.x = r * cos(newAngle);
            pos.z = r * sin(newAngle);
            pos.y += snoise(vec2(pos.x * noiseScale, pos.z * noiseScale + slowTime * 0.1)) * amplitudeFactor;
          } else if (activeSection < 2.5) {
            // Wishes section - rising particles with wave effect
            float noise1 = snoise(vec2(pos.x * noiseScale, pos.z * noiseScale + slowTime * 0.2));
            float noise2 = snoise(vec2(pos.z * noiseScale, pos.x * noiseScale - slowTime * 0.15));
            
            pos.x += noise1 * 5.0;
            pos.z += noise2 * 5.0;
            pos.y += noise1 * noise2 * 3.0;
            
            // Gentle rising effect
            pos.y += slowTime * 3.0;
            if (pos.y > 100.0) pos.y -= 200.0;
          } else {
            // Celebration section - expansion and contraction with noise
            vec3 dir = normalize(pos);
            float dist = length(pos);
            float noiseVal = snoise(vec2(dist * 0.01 + slowTime * 0.1, dir.x * dir.z * 0.1));
            
            pos += dir * (sin(slowTime * 0.3 + dist * 0.02) * 8.0 + noiseVal * 5.0);
            
            // Add some perpendicular motion to create vortex effect
            vec3 perp = vec3(-dir.z, 0.0, dir.x);
            pos += perp * sin(slowTime * 0.2 + dist * 0.01) * 3.0;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size adjustments with distance
          gl_PointSize = size * (200.0 / -mvPosition.z);
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vOpacity;
      
      void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        if (texColor.a < 0.1) discard;
        
        // Soft glow effect with controlled opacity
        gl_FragColor = vec4(vColor, vOpacity * texColor.a);
      }
    `,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  particlesRef.current = particles;
  scene.add(particles);

  const animate = () => {
    const time = performance.now() * 0.001;
    bgMaterial.uniforms.time.value = time;
    particlesMaterial.uniforms.time.value = time;

    renderer.render(scene, camera);
    animationRef.current = requestAnimationFrame(animate);
  };

  animate();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bgMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animationRef.current);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
  };
}, [sectionColors]);

useEffect(() => {
  if (particlesRef.current && sectionColors[activeSection]) {
    const { colorA, colorB, particleColor } = sectionColors[activeSection];
    const bgMaterial = sceneRef.current.children.find(
      (child) => child.material && child.material.uniforms
    ).material;
    bgMaterial.uniforms.colorA.value = colorA;
    bgMaterial.uniforms.colorB.value = colorB;

    const particlesMaterial = particlesRef.current.material;
    particlesMaterial.uniforms.activeSection.value = activeSection;
    particlesMaterial.uniforms.pointTexture.value = particleColor;
  }
}, [activeSection, sectionColors]);

return (
  <div
    ref={containerRef}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }}
  />
);
};