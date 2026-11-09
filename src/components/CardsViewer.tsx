import { useRef } from 'react';
import { Maximize2, ChevronDown } from 'lucide-react';
import { WeddingCard } from '../types';
import { getGuestNameInlineStyle } from '../utils/guestFont';

interface CardsViewerProps {
  cards: WeddingCard[];
  activeCardIndex: number;
  guestName?: string;
  guestScale?: number;
  onSelectCardForZoom: (index: number) => void;
  onScrollToCard: (index: number) => void;
  onOpenCalendar: () => void;
  onOpenVenues: () => void;
  onOpenGuestbook: () => void;
  onOpenGenerator: () => void;
  onReopenEnvelope: () => void;
}

export default function CardsViewer({
  cards,
  activeCardIndex,
  guestName,
  guestScale = 1.0,
  onSelectCardForZoom,
  onScrollToCard,
  onOpenCalendar,
  onOpenVenues,
  onOpenGuestbook,
  onOpenGenerator,
  onReopenEnvelope,
}: CardsViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[100dvh] bg-[#160207] text-[#faedd0] ios-scroll-container overflow-y-auto"
    >
      {/* Background Islamic Geometric / Floral Motifs */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px), radial-gradient(circle at 0% 0%, #d4af37 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Intro Welcome Banner */}
      <div className="relative z-10 pt-6 pb-4 px-4 text-center max-w-lg mx-auto">
        <p className="font-serif italic text-sm text-[#e6ca85] tracking-widest uppercase">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#ffd700] mt-1 tracking-wide">
          Royal Wedding Invitation
        </h2>

        {guestName ? (
          <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3a0614] border border-[#d4af37]/50 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-[#d4af37]">Personalised for:</span>
            <span className="text-xs font-bold font-serif text-[#ffd700]">{guestName}</span>
          </div>
        ) : (
          <p className="text-xs text-[#faedd0]/80 mt-1 max-w-xs mx-auto">
            Scroll down to explore the invitation cards
          </p>
        )}
        <div className="flex justify-center mt-2 text-[#d4af37]/70 animate-bounce">
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Main Cards Stack (Vertical Scroll through all 4 cards) */}
      <main className="relative z-10 max-w-xl mx-auto px-3 sm:px-6 space-y-10 pb-12">
        {cards.map((card, index) => (
          <section
            key={card.id}
            id={`card-${index}`}
            className="group relative scroll-mt-20 flex flex-col items-center"
          >
            {/* Card Editorial Header */}
            <div className="w-full flex items-center justify-between px-2 mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] font-bold text-[#ffd700] text-sm tracking-wider">
                  0{index + 1}. {card.title}
                </span>
              </div>
              <span className="text-[11px] text-[#e6ca85]/80 font-serif italic">
                {card.subtitle}
              </span>
            </div>

            {/* The Unmodified Original Card Image Container */}
            <div className="relative w-full rounded-lg overflow-hidden bg-[#24030c] border border-[#d4af37]/40 shadow-2xl transition-all duration-300 group-hover:border-[#d4af37]/80">
              
              {/* Outer gold border accent */}
              <div className="absolute inset-1 rounded-md border border-[#d4af37]/20 pointer-events-none z-10" />

              {/* Exact Unmodified Card Image (or clean version when personalized with guest name) */}
              <img
                src={index === 0 && guestName ? '/assets/aistudio/card1_clean.png' : card.src}
                alt={card.alt}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = '1';
                    // Fallback to original card image if clean fails
                    target.src = card.src;
                  }
                }}
                className="w-full h-auto block object-contain crisp-card-img select-none"
              />

              {/* Personalised Guest Name Overlay on Card 1 below To, (Centered, custom size & layout) */}
              {index === 0 && guestName && (() => {
                const style = getGuestNameInlineStyle(guestName, guestScale);
                return (
                  <div 
                    className="absolute z-20 pointer-events-none flex flex-col items-center justify-center text-center px-2"
                    style={{
                      left: '20%',
                      right: '20%',
                      top: '55.6%',
                      height: '9.9%',
                    }}
                  >
                    <span 
                      className="font-bold italic text-[#580517] tracking-tight whitespace-pre-line drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                      style={{ 
                        fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                        fontSize: style.fontSize,
                        lineHeight: style.lineHeight,
                      }}
                    >
                      {guestName}
                    </span>
                  </div>
                );
              })()}


            </div>

            {/* Subtle card bottom caption */}
            <div className="mt-2 text-center">
              <span className="text-[11px] text-[#faedd0]/60 font-serif italic">
                Card {index + 1} of {cards.length} · Original Invitation Card
              </span>
            </div>
          </section>
        ))}


      </main>
    </div>
  );
}
