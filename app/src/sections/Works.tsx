import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Artwork {
  id: number;
  title: string;
  titleEn: string;
  category: string;
  year: string;
  material: string;
  image: string;
  color: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: '静默之声',
    titleEn: 'Voice of Silence',
    category: '油画',
    year: '2023',
    material: '布面油画',
    image: '/artwork-1.jpg',
    color: '#7b00ff',
  },
  {
    id: 2,
    title: '数字混乱',
    titleEn: 'Digital Chaos',
    category: '数字艺术',
    year: '2023',
    material: '数字媒介',
    image: '/artwork-2.jpg',
    color: '#21d94f',
  },
  {
    id: 3,
    title: '城市几何',
    titleEn: 'Urban Geometry',
    category: '混合材质',
    year: '2022',
    material: '混凝土、金属、玻璃',
    image: '/artwork-3.jpg',
    color: '#ff6a00',
  },
  {
    id: 4,
    title: '有机形态',
    titleEn: 'Organic Forms',
    category: '雕塑',
    year: '2022',
    material: '石膏、氧化铜',
    image: '/artwork-4.jpg',
    color: '#0075eb',
  },
  {
    id: 5,
    title: '光之涟漪',
    titleEn: 'Ripples of Light',
    category: '装置艺术',
    year: '2021',
    material: '光纤、LED',
    image: '/artwork-5.jpg',
    color: '#ff2d53',
  },
];

export default function Works() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Accordion entrance animation
      gsap.fromTo(
        accordionRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: accordionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative min-h-screen bg-black py-20 px-4 md:px-8"
    >
      {/* Section Title */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4"
        >
          <span className="text-stroke">作品</span>
          <span className="text-acid-green">.</span>
        </h2>
        <p className="font-mono text-white/50 text-sm tracking-widest uppercase">
          SELECTED WORKS / 2019—2023
        </p>
      </div>

      {/* Accordion Gallery */}
      <div
        ref={accordionRef}
        className="flex h-[70vh] gap-2 md:gap-4"
      >
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="accordion-card relative cursor-pointer group"
            onMouseEnter={() => setHoveredId(artwork.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  hoveredId === artwork.id
                    ? 'opacity-40'
                    : 'opacity-70'
                }`}
                style={{ backgroundColor: artwork.color }}
              />
            </div>

            {/* Content - Always visible */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
              {/* Top - Category & Year */}
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-white/70 tracking-wider">
                  {artwork.category}
                </span>
                <span
                  className="font-mono text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: artwork.color }}
                >
                  {artwork.year}
                </span>
              </div>

              {/* Bottom - Title & Info */}
              <div>
                <h3
                  className={`text-2xl md:text-4xl font-black text-white mb-2 transition-all duration-500 ${
                    hoveredId === artwork.id
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-70'
                  }`}
                >
                  {artwork.title}
                </h3>
                <p
                  className={`font-mono text-xs text-white/60 mb-2 transition-all duration-500 delay-75 ${
                    hoveredId === artwork.id
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  {artwork.titleEn}
                </p>
                <p
                  className={`font-mono text-xs text-white/50 transition-all duration-500 delay-100 ${
                    hoveredId === artwork.id
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  {artwork.material}
                </p>
              </div>
            </div>

            {/* Glitch Border Effect on Hover */}
            <div
              className={`absolute inset-0 border-2 transition-all duration-300 pointer-events-none ${
                hoveredId === artwork.id ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                borderColor: artwork.color,
                boxShadow: `0 0 20px ${artwork.color}40`,
              }}
            />
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="max-w-7xl mx-auto mt-12 flex justify-end">
        <a
          href="#"
          className="group flex items-center gap-4 font-mono text-sm text-white/60 hover:text-acid-green transition-colors"
        >
          <span>查看全部作品</span>
          <span className="text-xl group-hover:translate-x-2 transition-transform">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
