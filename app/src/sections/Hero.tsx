import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface HeroProps {
  onMenuClick: () => void;
}

export default function Hero({ onMenuClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(charRefs.current, { opacity: 0, z: -500 });
      gsap.set(subtitleRef.current, { opacity: 0 });
      gsap.set(imageRef.current, { scale: 1.2 });

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      // Background image zoom
      tl.to(imageRef.current, {
        scale: 1,
        duration: 1.8,
        ease: 'power3.out',
      });

      // Characters 3D fly in
      tl.to(
        charRefs.current.filter((_, i) => i !== 1), // "林" and "遥"
        {
          opacity: 1,
          z: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'expo.out',
        },
        '-=1.4'
      );

      // Middle character glitch effect
      tl.to(
        charRefs.current[1],
        {
          opacity: 1,
          z: 0,
          duration: 0.8,
          ease: 'steps(5)',
        },
        '-=0.8'
      );

      // Subtitle typewriter effect
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          duration: 1,
          ease: 'none',
        },
        '-=0.4'
      );

      // Continuous floating animation for characters
      charRefs.current.forEach((char, i) => {
        if (char) {
          gsap.to(char, {
            y: Math.sin(i * 0.5) * 8,
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        rotateX: mousePos.y * -5,
        rotateY: mousePos.x * 5,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [mousePos]);

  const chars = ['林', '夕', '遥'];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ transformOrigin: 'center center' }}
      >
        <img
          src="/hero-portrait.jpg"
          alt="Artist Portrait"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      </div>

      {/* 3D Title Container */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        <div
          ref={titleRef}
          className="relative preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Main Title */}
          <h1 className="flex items-center justify-center gap-2 md:gap-8">
            {chars.map((char, i) => (
              <span
                key={i}
                ref={(el) => { charRefs.current[i] = el; }}
                className={`text-[20vw] md:text-[18vw] lg:text-[15vw] font-black leading-none select-none ${
                  i === 1
                    ? 'text-white'
                    : 'text-stroke text-white/90'
                }`}
                style={{
                  transform: `translateZ(${i === 1 ? 50 : 0}px)`,
                  textShadow: i === 1 ? '0 0 40px rgba(255,255,255,0.3)' : 'none',
                }}
                data-text={char}
              >
                {char}
              </span>
            ))}
          </h1>

          {/* RGB Split Effect on hover area */}
          <div className="absolute inset-0 pointer-events-none">
            <span
              className="absolute top-0 left-0 text-[20vw] md:text-[18vw] lg:text-[15vw] font-black leading-none text-acid-pink opacity-0 mix-blend-screen"
              style={{ transform: 'translateX(-3px)' }}
            >
              林
            </span>
            <span
              className="absolute top-0 right-0 text-[20vw] md:text-[18vw] lg:text-[15vw] font-black leading-none text-acid-green opacity-0 mix-blend-screen"
              style={{ transform: 'translateX(3px)' }}
            >
              遥
            </span>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center font-mono text-sm md:text-base tracking-[0.3em] text-white/80 uppercase"
      >
        视觉艺术家 / Visual Artist / 2023届
      </p>

      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="absolute top-8 right-8 z-50 group"
      >
        <div className="relative px-6 py-3 border border-white/30 bg-black/50 backdrop-blur-sm transition-all duration-300 group-hover:border-acid-green group-hover:bg-acid-green/10">
          <span className="font-mono text-sm tracking-widest text-white group-hover:text-acid-green transition-colors">
            MENU
          </span>
        </div>
      </button>

      {/* Bottom Left Info */}
      <div className="absolute bottom-8 left-8 font-mono text-xs text-white/50">
        <p>BASED IN SHANGHAI</p>
        <p>AVAILABLE FOR WORK</p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-white/50 tracking-widest rotate-90 origin-center translate-y-4">
          SCROLL
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
