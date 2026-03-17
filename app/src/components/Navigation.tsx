import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: '作品', labelEn: 'Works', href: '#works' },
  { label: '理念', labelEn: 'Statement', href: '#statement' },
  { label: '关于', labelEn: 'About', href: '#about' },
  { label: '联系', labelEn: 'Contact', href: '#footer' },
];

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Open animation
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.fromTo(
        contentRef.current,
        { x: '100%' },
        {
          x: '0%',
          duration: 0.5,
          ease: 'expo.out',
        }
      );

      gsap.fromTo(
        itemRefs.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: 'expo.out',
        }
      );
    } else {
      // Close animation
      gsap.to(itemRefs.current, {
        opacity: 0,
        x: -30,
        duration: 0.3,
        stagger: 0.05,
        ease: 'expo.in',
      });

      gsap.to(contentRef.current, {
        x: '100%',
        duration: 0.4,
        delay: 0.2,
        ease: 'expo.in',
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.4,
        ease: 'power2.in',
      });
    }
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        ref={contentRef}
        className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-black z-50 border-l border-white/10"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center border border-white/20 hover:border-acid-green hover:bg-acid-green/10 transition-all duration-300 group"
        >
          <span className="text-white group-hover:text-acid-green transition-colors text-2xl">
            ×
          </span>
        </button>

        {/* Menu Content */}
        <div className="flex flex-col justify-center h-full px-12 md:px-16">
          <nav className="space-y-8">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                ref={(el) => { itemRefs.current[index] = el; }}
                href={item.href}
                onClick={(e) => handleItemClick(e, item.href)}
                className="group block"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl md:text-7xl font-black text-white group-hover:text-acid-green transition-colors duration-300">
                    {item.label}
                  </span>
                  <span className="font-mono text-sm text-white/40 group-hover:text-acid-green/60 transition-colors">
                    {item.labelEn}
                  </span>
                </div>
                <div className="mt-2 h-px bg-white/10 group-hover:bg-acid-green/50 transition-colors duration-300" />
              </a>
            ))}
          </nav>

          {/* Bottom Info */}
          <div className="absolute bottom-12 left-12 md:left-16">
            <p className="font-mono text-xs text-white/40 mb-2">
              BASED IN
            </p>
            <p className="text-white">Shanghai, China</p>
          </div>

          {/* Social Links */}
          <div className="absolute bottom-12 right-12 md:right-16 flex gap-4">
            {['IG', 'BE', 'AS'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-acid-pink hover:text-acid-pink transition-all duration-300 font-mono text-xs"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-px h-32 bg-gradient-to-b from-transparent via-acid-green/30 to-transparent" />
        <div className="absolute bottom-1/4 left-12 w-24 h-px bg-white/5" />
      </div>
    </>
  );
}
