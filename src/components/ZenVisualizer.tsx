import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Waves, Compass, Activity, Volume2, ShieldAlert } from "lucide-react";

interface ZenVisualizerProps {
  language: "es" | "en" | "pt";
  soundRain: boolean;
  soundWaves: boolean;
  soundBowl: boolean;
  soundBirds: boolean;
  soundBonfire: boolean;
  soundCosmicWind: boolean;
  soundBells: boolean;
  soundMusic: boolean;
  
  rainVolume: number;
  wavesVolume: number;
  bowlVolume: number;
  birdsVolume: number;
  bonfireVolume: number;
  cosmicWindVolume: number;
  bellsVolume: number;
  musicVolume: number;
  
  breathingState: "idle" | "inhale" | "hold1" | "exhale" | "hold2";
}

type VisualizerMode = "mandala" | "waves" | "particles";

const SOUND_THEMES = {
  rain: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(14, 116, 144, 0.35) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(6, 182, 212, 0.35)",
    shadow: "rgba(6, 182, 212, 0.2)"
  },
  waves: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 118, 110, 0.35) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(20, 184, 166, 0.35)",
    shadow: "rgba(20, 184, 166, 0.2)"
  },
  bowl: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(180, 83, 9, 0.3) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(245, 158, 11, 0.35)",
    shadow: "rgba(245, 158, 11, 0.2)"
  },
  birds: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(161, 98, 7, 0.3) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(234, 179, 8, 0.35)",
    shadow: "rgba(234, 179, 8, 0.2)"
  },
  bonfire: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(194, 65, 12, 0.35) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(249, 115, 22, 0.35)",
    shadow: "rgba(249, 115, 22, 0.2)"
  },
  cosmicWind: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(67, 56, 202, 0.35) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(99, 102, 241, 0.35)",
    shadow: "rgba(99, 102, 241, 0.2)"
  },
  bells: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(109, 40, 217, 0.35) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(139, 92, 246, 0.35)",
    shadow: "rgba(139, 92, 246, 0.2)"
  },
  music: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(4, 120, 87, 0.35) 50%, rgba(15, 23, 42, 0.8) 100%)",
    border: "rgba(16, 185, 129, 0.35)",
    shadow: "rgba(16, 185, 129, 0.2)"
  },
  default: {
    bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.2) 50%, rgba(15, 23, 42, 0.4) 100%)",
    border: "rgba(30, 41, 59, 0.6)",
    shadow: "rgba(16, 185, 129, 0.05)"
  }
};

export function ZenVisualizer({
  language,
  soundRain,
  soundWaves,
  soundBowl,
  soundBirds,
  soundBonfire,
  soundCosmicWind,
  soundBells,
  soundMusic,
  rainVolume,
  wavesVolume,
  bowlVolume,
  birdsVolume,
  bonfireVolume,
  cosmicWindVolume,
  bellsVolume,
  musicVolume,
  breathingState,
}: ZenVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<VisualizerMode>("mandala");
  const [sensitivity, setSensitivity] = useState<number>(1.2);
  const [syncBreathe, setSyncBreathe] = useState<boolean>(true);

  // Determine the dominant active sound profile based on state and volume
  const activeList = [
    { id: "rain", active: soundRain, vol: rainVolume },
    { id: "waves", active: soundWaves, vol: wavesVolume },
    { id: "bowl", active: soundBowl, vol: bowlVolume },
    { id: "birds", active: soundBirds, vol: birdsVolume },
    { id: "bonfire", active: soundBonfire, vol: bonfireVolume },
    { id: "cosmicWind", active: soundCosmicWind, vol: cosmicWindVolume },
    { id: "bells", active: soundBells, vol: bellsVolume },
    { id: "music", active: soundMusic, vol: musicVolume },
  ].filter(s => s.active);

  const dominant = activeList.length > 0 
    ? activeList.reduce((prev, curr) => curr.vol > prev.vol ? curr : prev, activeList[0]).id
    : "default";

  const currentTheme = SOUND_THEMES[dominant as keyof typeof SOUND_THEMES] || SOUND_THEMES.default;

  
  // Local dimensions state (to react to ResizeObserver)
  const [dimensions, setDimensions] = useState({ width: 300, height: 220 });

  // Translation dictionary internal to the component to avoid editing global types
  const localDict = {
    es: {
      title: "Visualizador Zen",
      subtitle: "Geometría sagrada que vibra al ritmo de tus sonidos y respiración.",
      modeLabel: "Modo de Arte",
      mandala: "Mandala Sagrada",
      waves: "Ondas de Fluidez",
      particles: "Órbita Estelar",
      sensitivity: "Sensibilidad",
      syncBreathe: "Sincronizar Respiración",
      activeSounds: "Canales de Energía Activos",
      noSounds: "Inicia sonidos ambientales abajo para activar el movimiento sagrado."
    },
    en: {
      title: "Zen Visualizer",
      subtitle: "Sacred geometry vibrating to the rhythm of your sounds and breath.",
      modeLabel: "Art Mode",
      mandala: "Sacred Mandala",
      waves: "Fluid Waves",
      particles: "Starry Orbit",
      sensitivity: "Sensitivity",
      syncBreathe: "Synchronize Breath",
      activeSounds: "Active Energy Channels",
      noSounds: "Start ambient sounds below to activate the sacred movement."
    },
    pt: {
      title: "Visualizador Zen",
      subtitle: "Geometria sagrada que vibra ao ritmo dos seus sons e respiração.",
      modeLabel: "Modo de Arte",
      mandala: "Mandala Sagrada",
      waves: "Ondas de Fluidez",
      particles: "Órbita Estelar",
      sensitivity: "Sensibilidade",
      syncBreathe: "Sincronizar Respiração",
      activeSounds: "Canais de Energia Ativos",
      noSounds: "Ative sons ambientais abaixo para iniciar o movimento sagrado."
    }
  };

  const t = localDict[language];

  // Observe container size to adapt canvas resolution
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      // Ensure dimensions are positive
      setDimensions({
        width: Math.max(100, Math.floor(width)),
        height: Math.max(100, Math.floor(height || 220))
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animation logic using requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    // Track smooth, interpolated values for volume to prevent sudden visual jumps
    const volumes = {
      rain: 0,
      waves: 0,
      bowl: 0,
      birds: 0,
      bonfire: 0,
      wind: 0,
      bells: 0,
      music: 0,
      breathScale: 1.0,
    };

    // Particles system state
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      angle?: number;
      radius?: number;
      speed?: number;
      type?: "spark" | "rain" | "chirp";
    }
    const particles: Particle[] = [];

    // Initialize stars for Starry Orbit background
    const bgStars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 40; i++) {
      bgStars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.002 + 0.0005,
      });
    }

    const draw = () => {
      frame++;
      const { width, height } = dimensions;
      ctx.clearRect(0, 0, width, height);

      // 1. Smoothly interpolate volumes (linear feedback filter)
      const targetRain = soundRain ? rainVolume : 0;
      const targetWaves = soundWaves ? wavesVolume : 0;
      const targetBowl = soundBowl ? bowlVolume : 0;
      const targetBirds = soundBirds ? birdsVolume : 0;
      const targetBonfire = soundBonfire ? bonfireVolume : 0;
      const targetWind = soundCosmicWind ? cosmicWindVolume : 0;
      const targetBells = soundBells ? bellsVolume : 0;
      const targetMusic = soundMusic ? musicVolume : 0;

      volumes.rain += (targetRain - volumes.rain) * 0.08;
      volumes.waves += (targetWaves - volumes.waves) * 0.05;
      volumes.bowl += (targetBowl - volumes.bowl) * 0.06;
      volumes.birds += (targetBirds - volumes.birds) * 0.08;
      volumes.bonfire += (targetBonfire - volumes.bonfire) * 0.08;
      volumes.wind += (targetWind - volumes.wind) * 0.06;
      volumes.bells += (targetBells - volumes.bells) * 0.07;
      volumes.music += (targetMusic - volumes.music) * 0.06;

      // 2. Breathing Sync scaling
      let targetBreathScale = 1.0;
      if (syncBreathe) {
        if (breathingState === "inhale") {
          // Slow rise from 0.85 to 1.3
          targetBreathScale = 1.25 + Math.sin(frame * 0.04) * 0.05;
        } else if (breathingState === "exhale") {
          // Slow shrink to 0.85
          targetBreathScale = 0.82 + Math.sin(frame * 0.04) * 0.03;
        } else if (breathingState === "hold1") {
          // Stay expanded and glow
          targetBreathScale = 1.25 + Math.sin(frame * 0.1) * 0.03;
        } else if (breathingState === "hold2") {
          // Stay small
          targetBreathScale = 0.82 + Math.sin(frame * 0.08) * 0.02;
        } else {
          // Idle ambient pulse
          targetBreathScale = 1.0 + Math.sin(frame * 0.015) * 0.04;
        }
      } else {
        targetBreathScale = 1.0 + Math.sin(frame * 0.012) * 0.05;
      }
      volumes.breathScale += (targetBreathScale - volumes.breathScale) * 0.04;

      // Calculate aggregate sound energy for global visual modulation
      const totalEnergy = (
        volumes.rain +
        volumes.waves +
        volumes.bowl +
        volumes.birds +
        volumes.bonfire +
        volumes.wind +
        volumes.bells +
        volumes.music
      ) * sensitivity;

      // Center coords
      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.28;

      // Draw subtle dark background with a radial emerald glow at the center
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.7);
      bgGrad.addColorStop(0, "rgba(6, 78, 59, 0.18)"); // emerald-950/18
      bgGrad.addColorStop(0.5, "rgba(15, 23, 42, 0.08)"); // slate-900/08
      bgGrad.addColorStop(1, "rgba(2, 6, 23, 0.4)"); // slate-950/40
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw background stars
      bgStars.forEach(star => {
        star.alpha += (Math.random() - 0.5) * 0.05;
        star.alpha = Math.max(0.1, Math.min(0.8, star.alpha));
        
        // Speed shifts with cosmic wind
        const currentSpeed = star.speed * (1 + volumes.wind * 4);
        star.x += currentSpeed;
        if (star.x > 1) {
          star.x = 0;
          star.y = Math.random();
        }

        ctx.fillStyle = `rgba(251, 191, 36, ${star.alpha * (0.3 + totalEnergy * 0.2)})`; // Gold twinkling stars
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn procedural particles based on active sounds
      // Rain particles
      if (soundRain && Math.random() < 0.25 * volumes.rain) {
        particles.push({
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 0.5 - 0.2,
          vy: Math.random() * 4 + 4 + volumes.rain * 4,
          size: Math.random() * 1 + 0.5,
          color: "rgba(52, 211, 153, ", // emerald-400
          alpha: Math.random() * 0.4 + 0.1,
          decay: 0.005,
          type: "rain"
        });
      }

      // Bonfire sparks
      if (soundBonfire && Math.random() < 0.3 * volumes.bonfire) {
        particles.push({
          x: cx + (Math.random() - 0.5) * (baseRadius * 0.7),
          y: height - 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2 + 1.5 + volumes.bonfire * 3),
          size: Math.random() * 2.5 + 1.2,
          color: "rgba(245, 158, 11, ", // amber-500 (warm gold)
          alpha: Math.random() * 0.8 + 0.2,
          decay: 0.012 + Math.random() * 0.01,
          type: "spark"
        });
      }

      // Birds sparkling chirps
      if (soundBirds && Math.random() < 0.03 * volumes.birds) {
        const px = Math.random() * width;
        const py = Math.random() * (height * 0.6);
        // create a tiny burst of 8 particles
        for (let k = 0; k < 8; k++) {
          const pAngle = (k / 8) * Math.PI * 2;
          const pSpeed = Math.random() * 1.5 + 0.8;
          particles.push({
            x: px,
            y: py,
            vx: Math.cos(pAngle) * pSpeed,
            vy: Math.sin(pAngle) * pSpeed - 0.3,
            size: Math.random() * 1.8 + 0.8,
            color: "rgba(253, 224, 71, ", // yellow-300
            alpha: 1.0,
            decay: 0.025 + Math.random() * 0.02,
            type: "chirp"
          });
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.type === "spark") {
          // add gentle drift/wobble
          p.vx += Math.sin(frame * 0.05 + p.y) * 0.05;
        }

        if (p.alpha <= 0 || p.x < -10 || p.x > width + 10 || p.y > height + 10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect for bonfire sparks and birds chirps
        if (p.type === "spark" || p.type === "chirp") {
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.type === "spark" ? "#f59e0b" : "#fde047";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // -----------------------------------------------------------------
      // MODE 1: MANDALA OF LIGHT (Sacred Geometry)
      // -----------------------------------------------------------------
      if (mode === "mandala") {
        const radius = baseRadius * volumes.breathScale * (1 + totalEnergy * 0.08);
        const rotationSpeed = 0.003 + (volumes.music * 0.015) + (volumes.wind * 0.008) + (volumes.bowl * 0.004);
        const rotationAngle = frame * rotationSpeed;

        // Draw Singing Bowl golden ripple wave expanding
        if (soundBowl) {
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 * volumes.bowl * (1 + Math.sin(frame * 0.1) * 0.3)})`;
          ctx.lineWidth = 2 + volumes.bowl * 4;
          const bowlRadiusOffset = (frame * 1.5) % (Math.min(width, height) * 0.45);
          ctx.beginPath();
          ctx.arc(cx, cy, radius + bowlRadiusOffset, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Celestial Bells flashing expansions
        if (soundBells) {
          const bellCycle = (frame * 0.05) % Math.PI;
          const bellFlash = Math.abs(Math.sin(bellCycle)) * volumes.bells;
          if (bellFlash > 0.1) {
            ctx.shadowBlur = 20 * bellFlash;
            ctx.shadowColor = "#fbbf24";
            ctx.strokeStyle = `rgba(251, 191, 36, ${bellFlash * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, radius * (1 + bellFlash * 0.4), 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }

        // --- Core Mandala Geometry ---
        // Spokes and circles count
        const lobes = 12 + (soundMusic ? 4 : 0);

        // Subtly colored background glow inside the mandala
        ctx.fillStyle = `rgba(16, 185, 129, ${0.03 + volumes.music * 0.05})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // 1. Draw outer gold decorative ring with notches
        ctx.strokeStyle = `rgba(217, 119, 6, ${0.4 + totalEnergy * 0.2})`; // amber-600
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        // notches
        for (let i = 0; i < lobes * 4; i++) {
          const a = (i / (lobes * 4)) * Math.PI * 2 + rotationAngle * 0.5;
          const len = i % 4 === 0 ? 8 : 4;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
          ctx.lineTo(cx + Math.cos(a) * (radius - len), cy + Math.sin(a) * (radius - len));
          ctx.stroke();
        }

        // 2. Interlocking Emerald Petals (Sacred Seed of Life pattern)
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.55 + totalEnergy * 0.25})`; // emerald-500
        ctx.lineWidth = 1.5 + volumes.music * 1.5;
        
        for (let i = 0; i < lobes; i++) {
          const angleOffset = (i / lobes) * Math.PI * 2 + rotationAngle;
          
          // Petal centers orbit around the core
          const petalCenterDist = radius * 0.5;
          const px = cx + Math.cos(angleOffset) * petalCenterDist;
          const py = cy + Math.sin(angleOffset) * petalCenterDist;

          ctx.beginPath();
          // Draw a circle centered on the orbit ring, passing through the mandala center
          ctx.arc(px, py, petalCenterDist, 0, Math.PI * 2);
          ctx.stroke();

          // Draw an elegant gold line radiating to the petal center
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.12 + totalEnergy * 0.1})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
          
          // Reset stroke for next petals
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.55 + totalEnergy * 0.25})`;
          ctx.lineWidth = 1.5 + volumes.music * 1.5;
        }

        // 3. Central glowing flower core
        const coreRadius = radius * 0.25;
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.8 + totalEnergy * 0.2})`; // gold (amber-400)
        ctx.lineWidth = 1.8;
        
        ctx.beginPath();
        for (let i = 0; i < lobes / 2; i++) {
          const a = (i / (lobes / 2)) * Math.PI * 2 - rotationAngle * 1.5;
          const rMod = coreRadius * (1 + Math.sin(frame * 0.08 + i) * 0.15 * (1 + totalEnergy * 0.5));
          const p1x = cx + Math.cos(a) * rMod;
          const p1y = cy + Math.sin(a) * rMod;
          const p2x = cx + Math.cos(a + Math.PI / (lobes / 2)) * rMod * 0.5;
          const p2y = cy + Math.sin(a + Math.PI / (lobes / 2)) * rMod * 0.5;
          
          if (i === 0) ctx.moveTo(p1x, p1y);
          ctx.lineTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
        }
        ctx.closePath();
        ctx.stroke();

        // Concentric inner circle
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // 4. Subtle glowing center dot
        ctx.fillStyle = `rgba(251, 191, 36, ${0.9 + totalEnergy * 0.1})`;
        ctx.shadowBlur = 10 + totalEnergy * 15;
        ctx.shadowColor = "#f59e0b";
        ctx.beginPath();
        ctx.arc(cx, cy, 4 + totalEnergy * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // -----------------------------------------------------------------
      // MODE 2: COSMIC WAVES (Ambient Ripple)
      // -----------------------------------------------------------------
      else if (mode === "waves") {
        const waveCount = 4;
        const speedMultiplier = 1 + volumes.wind * 1.5;

        // Draw singing bowl rings behind waves
        if (soundBowl) {
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.1 * volumes.bowl})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, baseRadius * volumes.breathScale * (1.5 + Math.sin(frame * 0.05) * 0.2), 0, Math.PI * 2);
          ctx.stroke();
        }

        for (let w = 0; w < waveCount; w++) {
          // Calculate wave height & styling based on sound volumes
          const stepOffset = w * (Math.PI / 2);
          const baseHeight = height * 0.5 + Math.sin(frame * 0.01 + stepOffset) * (15 * volumes.breathScale);
          const amplitude = (12 + w * 8) * (1 + volumes.waves * 2 + volumes.wind * 1.2 + volumes.rain * 0.8) * sensitivity;
          const frequency = (0.005 + w * 0.003) * (1 + volumes.rain * 0.5);
          const horizontalShift = frame * (0.015 - w * 0.003) * speedMultiplier;

          // Build gradient for the wave line
          const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
          if (w % 2 === 0) {
            waveGrad.addColorStop(0, `rgba(16, 185, 129, ${0.15 - w * 0.03})`); // emerald
            waveGrad.addColorStop(0.5, `rgba(251, 191, 36, ${0.35 - w * 0.05})`); // gold
            waveGrad.addColorStop(1, `rgba(5, 150, 105, ${0.15 - w * 0.03})`); // emerald dark
          } else {
            waveGrad.addColorStop(0, `rgba(245, 158, 11, ${0.25 - w * 0.04})`); // gold amber
            waveGrad.addColorStop(0.5, `rgba(52, 211, 153, ${0.4 - w * 0.06})`); // emerald light
            waveGrad.addColorStop(1, `rgba(217, 119, 6, ${0.25 - w * 0.04})`); // amber-600
          }

          ctx.strokeStyle = waveGrad;
          ctx.lineWidth = (4.0 - w * 0.8) * (1 + totalEnergy * 0.5);
          ctx.beginPath();

          for (let x = 0; x <= width + 10; x += 8) {
            const y = baseHeight + Math.sin(x * frequency + horizontalShift) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // If it's the front wave, draw filled area with very high transparency
          if (w === 0) {
            ctx.fillStyle = `rgba(16, 185, 129, ${0.015 + volumes.waves * 0.03})`;
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let x = 0; x <= width + 10; x += 8) {
              const y = baseHeight + Math.sin(x * frequency + horizontalShift) * amplitude;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Draw dynamic breathing focus point centered on waves
        const pulseSize = 14 + Math.sin(frame * 0.04) * 4 * volumes.breathScale + totalEnergy * 6;
        ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
        ctx.strokeStyle = "rgba(251, 191, 36, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, height * 0.5, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // concentric breathing guide circle
        ctx.strokeStyle = "rgba(52, 211, 153, 0.25)";
        ctx.beginPath();
        ctx.arc(cx, height * 0.5, pulseSize * 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // -----------------------------------------------------------------
      // MODE 3: STAR SEED / PARTICLE ORBIT
      // -----------------------------------------------------------------
      else {
        // Draw cosmic swirl in background
        const orbitRadius = baseRadius * volumes.breathScale * (1 + totalEnergy * 0.15);
        const orbitSpeed = 0.008 + (volumes.music * 0.012) + (volumes.wind * 0.01);
        const starCount = 18;

        // Draw core energy node
        const coreSize = 12 + Math.sin(frame * 0.03) * 3 + (volumes.bowl * 15);
        const coreGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, coreSize * 1.5);
        coreGrad.addColorStop(0, "rgba(251, 191, 36, 1.0)"); // Gold
        coreGrad.addColorStop(0.4, "rgba(52, 211, 153, 0.8)"); // Emerald
        coreGrad.addColorStop(1, "rgba(6, 78, 59, 0)"); // Fade
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreSize * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Gold orbit path
        ctx.strokeStyle = "rgba(245, 158, 11, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw celestial bodies orbiting the center
        for (let i = 0; i < starCount; i++) {
          const angle = (i / starCount) * Math.PI * 2 + frame * orbitSpeed;
          const distOffset = Math.sin(frame * 0.02 + i) * 15 * (1 + volumes.music);
          const px = cx + Math.cos(angle) * (orbitRadius + distOffset);
          const py = cy + Math.sin(angle) * (orbitRadius + distOffset);

          const size = (3 + (i % 3) * 2) * (1 + totalEnergy * 0.1);
          const alpha = 0.3 + ((i % 5) / 5) * 0.6;
          const isGold = i % 2 === 0;

          // Connect stars with fine web lines if celestial bells or background music is loud
          if (volumes.music > 0.1 || volumes.bells > 0.1) {
            const nextAngle = ((i + 1) / starCount) * Math.PI * 2 + frame * orbitSpeed;
            const nextDistOffset = Math.sin(frame * 0.02 + i + 1) * 15 * (1 + volumes.music);
            const npx = cx + Math.cos(nextAngle) * (orbitRadius + nextDistOffset);
            const npy = cy + Math.sin(nextAngle) * (orbitRadius + nextDistOffset);

            ctx.strokeStyle = `rgba(16, 185, 129, ${0.08 * (volumes.music + volumes.bells)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(npx, npy);
            ctx.stroke();
          }

          ctx.fillStyle = isGold
            ? `rgba(251, 191, 36, ${alpha})` // gold
            : `rgba(52, 211, 153, ${alpha})`; // emerald

          ctx.beginPath();
          ctx.arc(px, py, size / 2, 0, Math.PI * 2);
          ctx.fill();

          // Tiny flares
          if (isGold && Math.random() < 0.05) {
            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.8})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(px - size * 1.5, py);
            ctx.lineTo(px + size * 1.5, py);
            ctx.moveTo(px, py - size * 1.5);
            ctx.lineTo(px, py + size * 1.5);
            ctx.stroke();
          }
        }
      }

      // Draw active indicator badge inside the canvas at the corner (beautiful visual feedback)
      if (totalEnergy > 0.02) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
        ctx.strokeStyle = "rgba(52, 211, 153, 0.2)";
        ctx.lineWidth = 1;
        
        const badgeW = 95;
        const badgeH = 18;
        const badgeX = 12;
        const badgeY = 12;
        const radius = 4;
        
        ctx.beginPath();
        ctx.moveTo(badgeX + radius, badgeY);
        ctx.lineTo(badgeX + badgeW - radius, badgeY);
        ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + radius);
        ctx.lineTo(badgeX + badgeW, badgeY + badgeH - radius);
        ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - radius, badgeY + badgeH);
        ctx.lineTo(badgeX + radius, badgeY + badgeH);
        ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - radius);
        ctx.lineTo(badgeX, badgeY + radius);
        ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText("● AUDIO REACTIVE", badgeX + 16, badgeY + 11.5);

        // Blinking indicator circle
        ctx.fillStyle = Math.sin(frame * 0.15) > 0 ? "#10b981" : "rgba(16, 185, 129, 0.3)";
        ctx.beginPath();
        ctx.arc(badgeX + 8, badgeY + badgeH / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions, mode, sensitivity, syncBreathe,
      soundRain, soundWaves, soundBowl, soundBirds, soundBonfire, soundCosmicWind, soundBells, soundMusic,
      rainVolume, wavesVolume, bowlVolume, birdsVolume, bonfireVolume, cosmicWindVolume, bellsVolume, musicVolume,
      breathingState]);

  // Count active channels
  const activeChannels = [soundRain, soundWaves, soundBowl, soundBirds, soundBonfire, soundCosmicWind, soundBells, soundMusic].filter(Boolean).length;

  return (
    <div 
      className="relative overflow-hidden rounded-3xl p-6 flex flex-col gap-4 w-full border transition-all duration-1000 ease-in-out shadow-xl" 
      id="zen-visualizer-container"
      style={{
        borderColor: currentTheme.border,
        boxShadow: `0 10px 30px -10px ${currentTheme.shadow}`,
      }}
    >
      {/* Animated and hue-shifting background layer */}
      <div 
        className="absolute inset-0 z-0 animate-zen-bg opacity-90 transition-all duration-1000 ease-in-out"
        style={{
          background: currentTheme.bgGradient,
        }}
      />
      
      {/* Content wrapper to stay above background and keep clean non-shifted colors */}
      <div className="relative z-10 flex flex-col gap-4 w-full">
        <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> {t.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.subtitle}
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
          <Sparkles className="w-3 h-3" />
          {language === "en" ? "ACTIVE" : language === "pt" ? "ATIVO" : "ACTIVO"}
        </span>
      </div>

      {/* Canvas container with relative sizing */}
      <div 
        ref={containerRef}
        className="relative w-full h-[220px] bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-900/60 shadow-inner flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 block w-full h-full cursor-pointer"
          title="Click inside sounds panel to activate background noises"
        />

        {activeChannels === 0 && (
          <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none px-6">
            <p className="text-[10px] text-slate-500 bg-slate-950/90 py-1.5 px-3 rounded-full border border-slate-900 inline-flex items-center gap-1.5 max-w-xs mx-auto">
              <Volume2 className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>{t.noSounds}</span>
            </p>
          </div>
        )}
      </div>

      {/* Visualizer Settings & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* Art Mode selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.modeLabel}</label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950/50 p-1 rounded-xl border border-slate-900">
            <button
              onClick={() => setMode("mandala")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                mode === "mandala"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Mandala</span>
            </button>
            <button
              onClick={() => setMode("waves")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                mode === "waves"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Waves" : "Ondas"}</span>
            </button>
            <button
              onClick={() => setMode("particles")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                mode === "particles"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Orbit" : "Órbita"}</span>
            </button>
          </div>
        </div>

        {/* Adjust sensitivity & sync toggles */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.sensitivity}</span>
              <span className="text-[10px] font-bold text-slate-300">{Math.round(sensitivity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-950/30 px-3 py-1.5 rounded-xl border border-slate-900/60">
            <span className="text-[10px] font-bold text-slate-300">{t.syncBreathe}</span>
            <button
              onClick={() => setSyncBreathe(!syncBreathe)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                syncBreathe ? "bg-emerald-500" : "bg-slate-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  syncBreathe ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Energy Channels Status Line */}
      <div className="flex items-center gap-1.5 mt-1 border-t border-slate-900/60 pt-3">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{t.activeSounds}:</span>
        <div className="flex flex-wrap gap-1 items-center">
          {activeChannels === 0 ? (
            <span className="text-[9px] text-slate-600 font-semibold italic">None active</span>
          ) : (
            <>
              {soundRain && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-sky-950/40 text-sky-400 border border-sky-900/30">☔ Lluvia</span>}
              {soundWaves && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-teal-950/40 text-teal-400 border border-teal-900/30">🌊 Mar</span>}
              {soundBowl && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-950/40 text-amber-400 border border-amber-900/30">🔔 Cuenco</span>}
              {soundBirds && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-yellow-950/40 text-yellow-400 border border-yellow-900/30">🐦 Aves</span>}
              {soundBonfire && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-950/40 text-orange-400 border border-orange-900/30">🔥 Fogata</span>}
              {soundCosmicWind && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">🌀 Viento</span>}
              {soundBells && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-violet-950/40 text-violet-400 border border-violet-900/30">✨ Campanillas</span>}
              {soundMusic && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">🎵 Música</span>}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
