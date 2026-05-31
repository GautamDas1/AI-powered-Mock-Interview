import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, User } from 'lucide-react';

/* ──────────────────────── Design System (from Stitch MCP) ──────────────────────── */
/*
  ToonHub Immersive Design System
  - Primary (Coral): #F4845F / container: #f4845f
  - Secondary (Green): #6BBF7A / #85CC92
  - Tertiary (Pink): #E882B4 / #ED9DC4
  - Quaternary (Blue): #6EB5FF / #8DC4FF
  - Surface: #131313
  - Fonts: Anton (display/ghost), Inter (body/labels)
  - Roundness: ROUND_EIGHT (8px containers, full circles for nav)
  - Spacing: 8px base unit, 40px container margin, 24px gutters
  - Typography tokens:
    display-xl: Anton 120px/-0.02em
    display-lg: Anton 80px/0em
    headline-lg: Anton 48px/0.02em
    ghost-text: Anton 160px
    body-lg: Inter 18px
    body-md: Inter 16px
    label-bold: Inter 14px/700
    label-sm: Inter 12px/500
*/

/* ──────────────────────── Data ──────────────────────── */
const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F', name: 'Blaze' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92', name: 'Sprout' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4', name: 'Rosie' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF', name: 'Drift' },
];

const NAV_LINKS = ['Shop', 'Collectibles', 'Drops', 'Studio'];

const TRANSITION_MS = 650;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

/* ──────────────── Grain overlay SVG data URI ────────────── */
const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;

/* ──────────────────────── Types ──────────────────────── */
type Role = 'center' | 'left' | 'right' | 'back';

/* ──────────────────────── Component ──────────────────────── */
export default function ToonHubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Preload images ── */
  useEffect(() => {
    IMAGES.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  /* ── Responsive check ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Navigation ── */
  const navigate = useCallback(
    (dir: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) =>
        dir === 'next' ? (prev + 1) % IMAGES.length : (prev + IMAGES.length - 1) % IMAGES.length,
      );
      lockRef.current = setTimeout(() => setIsAnimating(false), TRANSITION_MS);
    },
    [isAnimating],
  );

  /* Cleanup timeout on unmount */
  useEffect(
    () => () => {
      if (lockRef.current) clearTimeout(lockRef.current);
    },
    [],
  );

  /* ── Roles ── */
  const len = IMAGES.length;
  const roles: Record<number, Role> = {
    [activeIndex]: 'center',
    [(activeIndex + len - 1) % len]: 'left',
    [(activeIndex + 1) % len]: 'right',
    [(activeIndex + 2) % len]: 'back',
  };

  /* ── Per-role styles ── */
  const getRoleStyle = (role: Role): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transition: [
        `transform ${TRANSITION_MS}ms ${EASING}`,
        `filter ${TRANSITION_MS}ms ${EASING}`,
        `opacity ${TRANSITION_MS}ms ${EASING}`,
        `left ${TRANSITION_MS}ms ${EASING}`,
        `bottom ${TRANSITION_MS}ms ${EASING}`,
        `height ${TRANSITION_MS}ms ${EASING}`,
      ].join(', '),
      willChange: 'transform, filter, opacity',
    };

    switch (role) {
      case 'center':
        return {
          ...base,
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : '0',
        };
      case 'left':
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
        return {
          ...base,
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  /* ──────────────────────── Render ──────────────────────── */
  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color ${TRANSITION_MS}ms ${EASING}`,
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative w-full overflow-hidden"
    >
      <div
        className="relative w-full"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        {/* ── 1. Grain overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("${GRAIN_SVG}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* ── 2. Giant ghost text "3D SHAPE" ── */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: '18%' }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            3D SHAPE
          </span>
        </div>

        {/* ── 3. Top navigation bar (from Stitch design) ── */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 sm:px-10 py-5"
          style={{ zIndex: 60 }}
        >
          {/* Brand */}
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              fontWeight: 400,
              color: 'white',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            TOONHUB
          </span>

          {/* Nav links (desktop) */}
          <nav className="hidden sm:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="relative"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'white',
                  opacity: 0.85,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'opacity 200ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85';
                }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button
              className="cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                opacity: 0.85,
                transition: 'opacity 200ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
              }}
              aria-label="Cart"
            >
              <ShoppingCart size={20} strokeWidth={2} />
            </button>
            <button
              className="cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                opacity: 0.85,
                transition: 'opacity 200ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
              }}
              aria-label="Account"
            >
              <User size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Sub-header tagline (from Stitch design) ── */}
        <div
          className="absolute top-14 sm:top-16 right-6 sm:right-10 hidden sm:block"
          style={{ zIndex: 60 }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              color: 'white',
              opacity: 0.7,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            TOONHUB © 2024. UNAPOLOGETICALLY BOLD.
          </span>
        </div>

        {/* ── 4. Carousel items ── */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, i) => (
            <div key={i} style={getRoleStyle(roles[i])}>
              <img
                src={item.src}
                alt={`${item.name} figurine`}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── 5. Bottom-left text + nav ── */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 360 }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{ color: 'white', opacity: 0.95, letterSpacing: '0.02em' }}
          >
            TOONHUB FIGURINES
          </p>
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{ color: 'white', opacity: 0.85, lineHeight: 1.6 }}
          >
            Dive into a world of vibrant 3D collectibles. Crafted for the bold,
            the playful, and the unapologetic creators.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('prev')}
              className="flex items-center justify-center rounded-full cursor-pointer"
              style={{
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'scale(1.08)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'transparent';
              }}
              aria-label="Previous figurine"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="flex items-center justify-center rounded-full cursor-pointer"
              style={{
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'scale(1.08)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'transparent';
              }}
              aria-label="Next figurine"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* ── 6. Bottom-right "DISCOVER IT" ── */}
        <a
          href="#"
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 flex items-center gap-2 no-underline"
          style={{
            zIndex: 60,
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            color: 'white',
            opacity: 0.95,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'opacity 200ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = '0.95';
          }}
        >
          DISCOVER IT
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: isMobile ? 32 : 48,
              height: isMobile ? 32 : 48,
              border: '2px solid white',
              flexShrink: 0,
            }}
          >
            <ArrowRight
              className="w-4 h-4 sm:w-6 sm:h-6"
              strokeWidth={2.25}
            />
          </span>
        </a>
      </div>
    </div>
  );
}
