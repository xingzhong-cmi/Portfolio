import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Marquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Speed-sensitive skew effect based on scroll
      let skewAmount = 0;
      let currentSkew1 = 0;
      let currentSkew2 = 0;

      const updateSkew = () => {
        currentSkew1 += (skewAmount - currentSkew1) * 0.1;
        currentSkew2 += (-skewAmount - currentSkew2) * 0.1;

        if (track1Ref.current) {
          track1Ref.current.style.transform = `skewX(${currentSkew1}deg)`;
        }
        if (track2Ref.current) {
          track2Ref.current.style.transform = `skewX(${currentSkew2}deg)`;
        }

        requestAnimationFrame(updateSkew);
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          skewAmount = self.getVelocity() / 300;
          skewAmount = gsap.utils.clamp(-20, 20, skewAmount);
        },
      });

      updateSkew();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const track1Content = (
    <>
      <span className="mx-8 text-acid-green">绘画</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-white">PAINTING</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-acid-pink">数字艺术</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-white">DIGITAL</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-acid-blue">装置</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-white">INSTALLATION</span>
      <span className="mx-8 text-white/30">—</span>
    </>
  );

  const track2Content = (
    <>
      <span className="mx-8 text-white">2023届</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-acid-yellow">GRADUATE</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-white">应届毕业生</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-acid-purple">PORTFOLIO</span>
      <span className="mx-8 text-white/30">—</span>
      <span className="mx-8 text-white">作品集</span>
      <span className="mx-8 text-white/30">—</span>
    </>
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-12 bg-black overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Track 1 - Moving Left */}
      <div
        ref={track1Ref}
        className="marquee-container py-4 mb-4"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="marquee-content text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter">
          {track1Content}
          {track1Content}
          {track1Content}
          {track1Content}
        </div>
      </div>

      {/* Track 2 - Moving Right */}
      <div
        ref={track2Ref}
        className="marquee-container py-4"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="marquee-content-reverse text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter">
          {track2Content}
          {track2Content}
          {track2Content}
          {track2Content}
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}
