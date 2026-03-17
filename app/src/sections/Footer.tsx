import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Instagram, ExternalLink, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'Behance', icon: ExternalLink, url: '#' },
  { name: 'ArtStation', icon: ExternalLink, url: '#' },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content fade in
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const marqueeText = '林夕遥 · LIN XIYAO · 视觉艺术家 · VISUAL ARTIST · ';

  return (
    <footer
      ref={footerRef}
      className="relative min-h-[50vh] bg-black border-t border-white/10 overflow-hidden"
    >
      {/* Background Marquee */}
      <div
        ref={marqueeRef}
        className="absolute inset-0 flex items-center overflow-hidden opacity-5 pointer-events-none"
      >
        <div className="marquee-content text-[20vw] font-black whitespace-nowrap text-white">
          {marqueeText}
          {marqueeText}
          {marqueeText}
          {marqueeText}
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs text-white/40 tracking-widest uppercase mb-6">
              Contact / 联系方式
            </h3>
            <a
              href="mailto:linxiyao@example.com"
              className="group flex items-center gap-4 text-2xl md:text-4xl font-black text-white hover:text-acid-green transition-colors"
            >
              <Mail className="w-8 h-8" />
              <span className="relative">
                linxiyao@example.com
                <span className="absolute bottom-0 left-0 w-0 h-px bg-acid-green group-hover:w-full transition-all duration-300" />
              </span>
            </a>
            <p className="mt-4 text-white/50 text-sm">
              欢迎合作咨询、展览邀约与艺术交流
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-mono text-xs text-white/40 tracking-widest uppercase mb-6">
              Follow / 社交媒体
            </h3>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="group flex items-center gap-3 text-white hover:text-acid-pink transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="relative">
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-acid-pink group-hover:w-full transition-all duration-300" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Download */}
          <div>
            <h3 className="font-mono text-xs text-white/40 tracking-widest uppercase mb-6">
              Download / 下载
            </h3>
            <a
              href="#"
              className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-acid-green hover:bg-acid-green/10 transition-all duration-300"
            >
              <Download className="w-5 h-5 text-white group-hover:text-acid-green transition-colors" />
              <span className="text-white group-hover:text-acid-green transition-colors">
                作品集 PDF
              </span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black text-white">
              林<span className="text-acid-green">夕</span>遥
            </span>
            <span className="text-white/30">|</span>
            <span className="font-mono text-xs text-white/40">
              VISUAL ARTIST
            </span>
          </div>

          <div className="flex items-center gap-8">
            <span className="font-mono text-xs text-white/40">
              © 2023 All Rights Reserved
            </span>
            <span className="font-mono text-xs text-white/40">
              Made with passion
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-white/5" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-acid-green/20" />
    </footer>
  );
}
