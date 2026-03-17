import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const zineCards = [
  {
    id: 1,
    type: 'text',
    content: '创作是一场与未知的对话。在我的作品中，光与影不仅是视觉元素，更是情感与记忆的载体。',
    contentEn:
      'Creation is a dialogue with the unknown. In my work, light and shadow are not merely visual elements, but carriers of emotion and memory.',
    highlight: '光与影',
  },
  {
    id: 2,
    type: 'image',
    image: '/sketch-1.jpg',
    caption: '创作手稿 / Sketch',
  },
  {
    id: 3,
    type: 'text',
    content:
      '我相信艺术的本质在于打破边界。传统与数字、具象与抽象、秩序与混乱——这些看似对立的概念在我的创作中相互交融。',
    contentEn:
      'I believe the essence of art lies in breaking boundaries. Traditional and digital, figurative and abstract, order and chaos—these seemingly opposing concepts merge in my creative process.',
    highlight: '打破边界',
  },
  {
    id: 4,
    type: 'image',
    image: '/sketch-2.jpg',
    caption: '工作室 / Studio',
  },
  {
    id: 5,
    type: 'text',
    content:
      '每一件作品都是一次自我探索的旅程。通过色彩、材质与形式的实验，我试图捕捉那些难以言说的内心波动。',
    contentEn:
      'Each piece is a journey of self-exploration. Through experiments with color, material, and form, I attempt to capture those ineffable inner fluctuations.',
    highlight: '自我探索',
  },
  {
    id: 6,
    type: 'quote',
    content: '艺术不是再现可见之物，而是使不可见变得可见。',
    author: '保罗·克利',
    authorEn: 'Paul Klee',
  },
];

export default function Statement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Horizontal scroll animation
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const scrollWidth = scrollContainer.scrollWidth - window.innerWidth;

        gsap.to(scrollContainer, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="statement"
      className="relative min-h-screen bg-neutral-light overflow-hidden"
    >
      {/* Section Header */}
      <div
        ref={titleRef}
        className="absolute top-8 left-8 z-20 mix-blend-difference"
      >
        <h2 className="text-6xl md:text-8xl font-black text-white mb-2">
          <span className="text-stroke">理念</span>
          <span className="text-acid-pink">.</span>
        </h2>
        <p className="font-mono text-white/70 text-sm tracking-widest uppercase">
          ARTISTIC STATEMENT
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center h-screen gap-8 px-8 pt-32"
        style={{ width: 'fit-content' }}
      >
        {/* Intro Card */}
        <div className="zine-card !bg-black !text-white !transform-none min-w-[500px]">
          <h3 className="text-3xl font-black mb-6 text-acid-green">
            创作理念
          </h3>
          <p className="font-mono text-sm text-white/60 leading-relaxed mb-4">
            CREATIVE PHILOSOPHY
          </p>
          <div className="w-full h-px bg-white/20 my-6" />
          <p className="text-lg leading-relaxed text-white/80">
            滑动探索我的创作思考与灵感来源
          </p>
          <p className="font-mono text-sm text-white/50 mt-4">
            Scroll to explore my creative thinking
          </p>
        </div>

        {/* Zine Cards */}
        {zineCards.map((card, index) => (
          <div key={card.id}>
            {card.type === 'text' && (
              <div className="zine-card">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-px bg-black/30" />
                  <span className="font-mono text-xs text-black/50">
                    0{index + 1}
                  </span>
                </div>
                <p className="text-xl md:text-2xl leading-relaxed mb-4 font-medium">
                  {card.content?.split(card.highlight || '').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="text-acid-green font-black">
                          {card.highlight}
                        </span>
                      )}
                    </span>
                  ))}
                </p>
                <p className="font-mono text-sm text-black/50 leading-relaxed">
                  {card.contentEn}
                </p>
              </div>
            )}

            {card.type === 'image' && (
              <div className="zine-card !p-0 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.caption}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <p className="font-mono text-xs text-black/50">
                    {card.caption}
                  </p>
                </div>
              </div>
            )}

            {card.type === 'quote' && (
              <div className="zine-card !bg-acid-yellow">
                <div className="text-6xl text-black/20 font-serif mb-4">"</div>
                <p className="text-2xl md:text-3xl font-black leading-tight mb-6 text-black">
                  {card.content}
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-px bg-black/30" />
                  <span className="font-mono text-sm text-black/60">
                    {card.author} / {card.authorEn}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* End Card */}
        <div className="zine-card !bg-acid-pink !text-white min-w-[400px]">
          <h3 className="text-3xl font-black mb-4">继续探索</h3>
          <p className="text-lg mb-6 text-white/80">
            每一件作品背后都有更多故事等待发现
          </p>
          <a
            href="#about"
            className="inline-flex items-center gap-2 font-mono text-sm bg-white text-acid-pink px-6 py-3 hover:bg-black hover:text-white transition-colors"
          >
            <span>关于我</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <span className="font-mono text-xs text-black/50">SCROLL</span>
        <div className="w-32 h-px bg-black/20 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-acid-green animate-marquee" />
        </div>
        <span className="font-mono text-xs text-black/50">→</span>
      </div>
    </section>
  );
}
