import { useState, useEffect } from 'react';
import './App.css';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import Works from './sections/Works';
import Statement from './sections/Statement';
import About from './sections/About';
import Footer from './sections/Footer';
import Navigation from './components/Navigation';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div className="relative bg-black min-h-screen">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-black text-white mb-4 animate-pulse">
              林<span className="text-acid-green">夕</span>遥
            </div>
            <div className="font-mono text-xs text-white/40 tracking-widest">
              LOADING PORTFOLIO...
            </div>
          </div>
        </div>
      )}

      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Navigation */}
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content */}
      <main className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Hero onMenuClick={() => setIsMenuOpen(true)} />
        <Marquee />
        <Works />
        <Statement />
        <About />
        <Footer />
      </main>

      {/* Fixed Elements */}
      {!isLoading && (
        <>
          {/* Corner Logo */}
          <div className="fixed bottom-8 left-8 z-30 mix-blend-difference hidden md:block">
            <span className="font-mono text-xs text-white/60 tracking-widest">
              林夕遥 / 2023
            </span>
          </div>

          {/* Scroll Progress */}
          <div className="fixed top-0 left-0 w-full h-1 z-50">
            <div
              className="h-full bg-acid-green origin-left"
              style={{
                transform: 'scaleX(var(--scroll-progress, 0))',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
