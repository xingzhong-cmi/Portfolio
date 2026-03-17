import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const awards = [
  { year: '2023', title: '优秀毕业作品奖', titleEn: 'Outstanding Graduate Work' },
  { year: '2022', title: '青年艺术家奖学金', titleEn: 'Young Artist Scholarship' },
  { year: '2021', title: '国际艺术双年展入围', titleEn: 'Biennale Shortlist' },
];

const education = [
  { year: '2019—2023', school: '中央美术学院', degree: '视觉艺术学士', degreeEn: 'BFA Visual Arts' },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMousePos({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-black py-20 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-16">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4">
            <span className="text-stroke">关于</span>
            <span className="text-acid-blue">.</span>
          </h2>
          <p className="font-mono text-white/50 text-sm tracking-widest uppercase">
            ABOUT THE ARTIST
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Text Content */}
          <div ref={contentRef}>
            {/* Bio */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
                林夕遥 <span className="text-white/40 font-normal">/ Lin Xiyao</span>
              </h3>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  出生于1999年，现居上海。作为一名视觉艺术家，我的创作跨越绘画、数字艺术与装置等多个领域，探索光、空间与情感之间的微妙关系。
                </p>
                <p className="font-mono text-sm text-white/50">
                  Born in 1999, based in Shanghai. As a visual artist, my practice spans painting, digital art, and installation, exploring the subtle relationships between light, space, and emotion.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="mb-12">
              <h4 className="font-mono text-xs text-acid-green tracking-widest uppercase mb-4">
                Education / 教育背景
              </h4>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 pb-3 border-b border-white/10"
                  >
                    <span className="font-mono text-sm text-white/40 w-28">
                      {edu.year}
                    </span>
                    <span className="text-white">{edu.school}</span>
                    <span className="text-white/50 text-sm">
                      {edu.degree} / {edu.degreeEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className="mb-12">
              <h4 className="font-mono text-xs text-acid-pink tracking-widest uppercase mb-4">
                Awards / 获奖经历
              </h4>
              <div className="space-y-3">
                {awards.map((award, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 pb-3 border-b border-white/10"
                  >
                    <span className="font-mono text-sm text-white/40 w-16">
                      {award.year}
                    </span>
                    <span className="text-white">{award.title}</span>
                    <span className="text-white/50 text-sm hidden md:inline">
                      / {award.titleEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <a
              href="mailto:linxiyao@example.com"
              className="inline-flex items-center gap-3 group"
            >
              <span className="w-12 h-px bg-white/30 group-hover:w-20 group-hover:bg-acid-green transition-all duration-300" />
              <span className="font-mono text-sm text-white group-hover:text-acid-green transition-colors">
                GET IN TOUCH
              </span>
            </a>
          </div>

          {/* Right - Portrait with Magnetic Tilt */}
          <div
            ref={imageRef}
            className="relative perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="relative preserve-3d transition-transform duration-200 ease-out"
              style={{
                transform: `rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg)`,
              }}
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src="/about-portrait.jpg"
                  alt="Lin Xiyao"
                  className="w-full h-full object-cover"
                />
                {/* Film grain overlay */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                  <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
                </div>
              </div>

              {/* Shine Effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
                style={{
                  opacity: Math.abs(mousePos.x) > 0.1 || Math.abs(mousePos.y) > 0.1 ? 0.3 : 0,
                  background: `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                }}
              />

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-acid-green/30" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-acid-pink/30" />

              {/* Floating Label */}
              <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm px-4 py-2">
                <span className="font-mono text-xs text-white/60">PHOTO BY</span>
                <span className="block text-sm text-white">Studio 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
