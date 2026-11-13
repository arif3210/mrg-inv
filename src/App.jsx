import React, { useState, useRef, Suspense, lazy } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Gamepad2,
  Share2,
  Navigation,
  CheckCircle,
  CalendarPlus
} from 'lucide-react';
import SparklePhysicsCanvas from './components/SparklePhysicsCanvas';
import MusicPlayer from './components/MusicPlayer';
import CountdownTimer from './components/CountdownTimer';
import SparkleCollectorGame from './components/SparkleCollectorGame';
import SudokuGame from './components/SudokuGame';
import FindJahanaGame from './components/FindJahanaGame';
import PhysicsCard from './components/PhysicsCard';

// Lazy load Limbo Easter Egg at the very end to ensure zero impact on initial site performance
const LimboEasterEgg = lazy(() => import('./components/LimboEasterEgg'));

export default function App() {
  const [chaosMode, setChaosMode] = useState(false);
  const [activeGameTab, setActiveGameTab] = useState('sparkles'); // 'sparkles' | 'sudoku'
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  // Secret circle gesture detection around the couple's names
  const namesRef = useRef(null);
  const strokeRef = useRef({
    isDrawing: false,
    cx: 0,
    cy: 0,
    accumulatedAngle: 0,
    lastAngle: 0,
    maxDist: 0,
  });
  const tapCountRef = useRef(0);

  const handlePointerDown = (e) => {
    if (!namesRef.current) return;
    const rect = namesRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX;
    const y = e.clientY;
    const angle = Math.atan2(y - cy, x - cx);

    strokeRef.current = {
      isDrawing: true,
      cx,
      cy,
      accumulatedAngle: 0,
      lastAngle: angle,
      maxDist: Math.hypot(x - cx, y - cy),
    };
  };

  const handlePointerMove = (e) => {
    const stroke = strokeRef.current;
    if (!stroke.isDrawing) return;

    const x = e.clientX;
    const y = e.clientY;
    const dx = x - stroke.cx;
    const dy = y - stroke.cy;
    const dist = Math.hypot(dx, dy);

    stroke.maxDist = Math.max(stroke.maxDist, dist);

    const currentAngle = Math.atan2(dy, dx);
    let delta = currentAngle - stroke.lastAngle;

    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    stroke.accumulatedAngle += delta;
    stroke.lastAngle = currentAngle;

    // A circle completed around names (>= 300 degrees and stroke dist > 25px)
    if (Math.abs(stroke.accumulatedAngle) >= Math.PI * 1.65 && stroke.maxDist > 25) {
      stroke.isDrawing = false;
      setIsEasterEggOpen(true);
    }
  };

  const handlePointerUp = () => {
    strokeRef.current.isDrawing = false;
  };

  const handleAmpersandClick = () => {
    tapCountRef.current++;
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      setIsEasterEggOpen(true);
    }
    setTimeout(() => {
      tapCountRef.current = 0;
    }, 1200);
  };

  const venueGoogleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Al+Fitra+Auditorium+East+Kizhakkoth+Calicut';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Arif & Jahana Wedding',
          text: 'Join us in celebrating the wedding of Arif & Jahana on December 24, 2026 at Al Fitra Auditorium, East Kizhakkoth.',
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Invitation link copied to clipboard!');
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent('Arif & Jahana Wedding');
    const details = encodeURIComponent(
      'Nikah & Wedding Reception of Arif & Jahana at Al Fitra Auditorium, East Kizhakkoth, Kozhikode'
    );
    const location = encodeURIComponent('Al Fitra Auditorium, East Kizhakkoth, Kerala');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261224T050000Z/20261224T110000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] relative selection:bg-[#1d1d1f] selection:text-white font-sans pb-24 overflow-x-hidden">
      {/* Sinking Sand Crystals in Water Particle Canvas */}
      <SparklePhysicsCanvas chaosMode={chaosMode} setChaosMode={setChaosMode} />

      {/* Floating Dynamic Music Player */}
      <MusicPlayer audioSrc="/music.mp3" />

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 pt-12 sm:pt-16 space-y-8 relative z-20">
        
        {/* HERO SECTION */}
        <PhysicsCard chaosMode={chaosMode} id="hero">
          <section className="apple-card rounded-[32px] p-7 sm:p-12 text-center relative group">
            
            {/* Header Tag & Bismillah */}
            <div className="space-y-4 mb-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[11px] font-semibold text-[#86868b] tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-[#b89562]" />
                <span>The Wedding Celebration</span>
              </div>
              
              <div className="font-arabic text-2xl sm:text-3xl text-[#1d1d1f] font-normal pt-1 tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <p className="font-cormorant italic text-sm sm:text-base text-[#6e6e73] max-w-sm mx-auto leading-relaxed">
                "And He has put between you affection and mercy"
                <span className="block text-xs font-sans not-italic text-[#86868b] mt-0.5 tracking-wide">
                  Surah Ar-Rum 30:21
                </span>
              </p>
            </div>

            {/* Couple Names in Refined Luxury Italian Typography (Draw circle outside to trigger easter egg) */}
            <div
              ref={namesRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="my-10 space-y-2 select-none touch-none cursor-pointer"
            >
              <h1 className="font-luxury text-5xl sm:text-7xl font-normal text-[#1d1d1f] tracking-wide pointer-events-none">
                Arif
              </h1>
              
              <div className="flex items-center justify-center gap-3 my-2 text-[#b89562]">
                <span className="h-[1px] w-12 bg-black/[0.08]" />
                <span
                  onClick={handleAmpersandClick}
                  className="font-cormorant italic text-xl sm:text-2xl text-[#b89562] select-none hover:scale-110 active:scale-95 transition-transform"
                >
                  &
                </span>
                <span className="h-[1px] w-12 bg-black/[0.08]" />
              </div>

              <h1 className="font-luxury text-5xl sm:text-7xl font-normal text-[#1d1d1f] tracking-wide pointer-events-none">
                Jahana
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#86868b] tracking-wider uppercase font-medium">
              Together with their families, request the honour of your presence & prayers
            </p>

            {/* Wedding Date Pill */}
            <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-[#f5f5f7] border border-black/[0.04]">
              <Calendar className="w-4 h-4 text-[#b89562]" />
              <span className="font-serif text-sm sm:text-base font-semibold text-[#1d1d1f] tracking-tight">
                December 24, 2026
              </span>
            </div>

            {/* Live Countdown */}
            <CountdownTimer targetDate="2026-12-24T10:00:00" />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleAddToCalendar}
                className="apple-pill-btn px-6 py-3 text-xs tracking-wider flex items-center gap-2 shadow-apple-pill"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Save Date</span>
              </button>

              <button
                onClick={handleShare}
                className="apple-secondary-btn px-5 py-3 text-xs tracking-wider flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-[#6e6e73]" />
                <span>Share Invite</span>
              </button>
            </div>
          </section>
        </PhysicsCard>

        {/* VENUE & SCHEDULE */}
        <PhysicsCard chaosMode={chaosMode} id="venue">
          <section className="apple-card rounded-[32px] p-7 sm:p-9 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                Location & Schedule
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight">
                Where & When
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Venue Card */}
              <div className="bg-[#f5f5f7]/70 rounded-2xl p-5 border border-black/[0.04] space-y-3 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/[0.04]">
                  <MapPin className="w-4 h-4 text-[#b89562]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1d1d1f]">
                    Al Fitra Auditorium
                  </h3>
                  <p className="text-xs text-[#6e6e73] mt-1 leading-relaxed">
                    East Kizhakkoth, Kozhikode, Kerala
                  </p>
                </div>
                <a
                  href={venueGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f] hover:text-[#b89562] pt-1 group"
                >
                  <Navigation className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Timing Card */}
              <div className="bg-[#f5f5f7]/70 rounded-2xl p-5 border border-black/[0.04] space-y-3 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/[0.04]">
                  <Clock className="w-4 h-4 text-[#b89562]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1d1d1f]">
                    Thursday, Dec 24
                  </h3>
                  <div className="text-xs text-[#6e6e73] mt-1.5 space-y-1">
                    <p className="flex justify-between">
                      <span>Nikah & Reception:</span>
                      <strong className="text-[#1d1d1f]">10:30 AM</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Traditional Lunch:</span>
                      <strong className="text-[#1d1d1f]">12:30 PM</strong>
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-[#86868b] pt-1 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#b89562]" />
                  <span>Reception Ceremony</span>
                </div>
              </div>
            </div>

            {/* Direct Map Callout */}
            <div className="text-center pt-1">
              <a
                href={venueGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block py-3 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-semibold tracking-wide transition-colors border border-black/[0.04]"
              >
                Open Al Fitra Auditorium in Google Maps
              </a>
            </div>
          </section>
        </PhysicsCard>

        {/* INTERACTIVE GAMES SECTION */}
        <PhysicsCard chaosMode={chaosMode} id="games">
          <section className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.06] text-[11px] font-semibold text-[#86868b] uppercase tracking-wider shadow-sm">
                <Gamepad2 className="w-3 h-3 text-[#b89562]" />
                <span>Celebration Mini-Games</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight">
                Guest Activities
              </h2>
              <p className="text-xs text-[#6e6e73]">
                Play interactive mini-games to send blessings to Arif & Jahana
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-1.5 p-1 bg-[#f5f5f7] rounded-2xl max-w-sm mx-auto border border-black/[0.04]">
              <button
                onClick={() => setActiveGameTab('sparkles')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeGameTab === 'sparkles'
                    ? 'bg-white text-[#1d1d1f] shadow-sm font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Crystal Catcher
              </button>
              <button
                onClick={() => setActiveGameTab('sudoku')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeGameTab === 'sudoku'
                    ? 'bg-white text-[#1d1d1f] shadow-sm font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Wedding Sudoku
              </button>
              <button
                onClick={() => setActiveGameTab('findJahana')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                  activeGameTab === 'findJahana'
                    ? 'bg-white text-[#1d1d1f] shadow-sm font-bold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Find Jahana
              </button>
            </div>

            {/* Active Game */}
            {activeGameTab === 'sparkles' && <SparkleCollectorGame />}
            {activeGameTab === 'sudoku' && <SudokuGame />}
            {activeGameTab === 'findJahana' && <FindJahanaGame />}
          </section>
        </PhysicsCard>

        {/* MINIMAL FOOTER */}
        <footer className="text-center space-y-2 pt-8 pb-10 text-[#86868b] text-xs">
          <div className="flex items-center justify-center gap-2 text-[#b89562]">
            <span className="h-[1px] w-6 bg-black/[0.08]" />
            <Sparkles className="w-3 h-3" />
            <span className="h-[1px] w-6 bg-black/[0.08]" />
          </div>
          <p className="font-luxury text-xl text-[#1d1d1f] font-normal tracking-wide">
            Arif & Jahana
          </p>
          <p className="text-[11px] text-[#86868b]">
            December 24, 2026 • Al Fitra Auditorium, East Kizhakkoth
          </p>
          <p className="text-[10px] text-[#86868b]/70">
            A celebration of love, barakah, and togetherness
          </p>
        </footer>
      </main>

      {/* Secret Limbo Easter Egg Overlay (Lazy-loaded, 0kb impact on initial page load) */}
      <Suspense fallback={null}>
        {isEasterEggOpen && (
          <LimboEasterEgg
            isOpen={isEasterEggOpen}
            onClose={() => setIsEasterEggOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}
