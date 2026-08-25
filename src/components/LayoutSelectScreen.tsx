import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { ArrowLeft, HelpCircle, Heart, Star } from 'lucide-react';
import type { LayoutId } from '../types';
import { playCutePop, playChime } from '../utils/sound';
import { HelpModal } from './HelpModal';
import {
  HelloKittyIcon,
  CuteBowIcon,
  CuteStrawberryIcon,
  CuteFlowerIcon,
  CuteSparkle,
} from './KawaiiIcons';

interface LayoutSelectScreenProps {
  onBackToHome: () => void;
  onProceedToPayment: (layout: LayoutId) => void;
}

interface LayoutItem {
  id: LayoutId;
  title: string;
  badge: string;
  shotsCount: number;
}

const layouts: LayoutItem[] = [
  { id: 'single', title: 'Single Solo', badge: '1 Shot • ₱35', shotsCount: 1 },
  { id: 'duo', title: 'Duo Strip', badge: '2 Shots • ₱70', shotsCount: 2 },
  { id: 'grid4', title: 'Classic Grid', badge: '4 Shots • ₱140', shotsCount: 4 },
  { id: 'strip6', title: 'Mega Strip', badge: '6 Shots • ₱210', shotsCount: 6 },
];

export const LayoutSelectScreen: React.FC<LayoutSelectScreenProps> = ({
  onBackToHome,
  onProceedToPayment,
}) => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>('grid4');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const heartBadgeRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating Kawaii Stickers animation
    if (stickersRef.current) {
      anime({
        targets: stickersRef.current.querySelectorAll('.float-kawaii-layout'),
        translateY: () => anime.random(-14, 14),
        translateX: () => anime.random(-10, 10),
        rotate: () => anime.random(-10, 10),
        scale: [0.92, 1.1],
        delay: anime.stagger(160),
        duration: 3400,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad',
      });
    }

    // anime.js staggered entry animation for layout cards
    if (cardsContainerRef.current) {
      anime({
        targets: cardsContainerRef.current.querySelectorAll('.layout-card-item'),
        translateY: [35, 0],
        opacity: [0, 1],
        scale: [0.94, 1],
        delay: anime.stagger(90, { start: 100 }),
        duration: 700,
        easing: 'easeOutBack(1.3)',
      });
    }

    // Top elements fade down
    anime({
      targets: '.top-fade-in',
      translateY: [-15, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutCubic',
    });
  }, []);

  const handleSelectLayout = (id: LayoutId, cardElement: HTMLElement) => {
    playCutePop(1.1);
    setSelectedLayout(id);

    // anime.js micro-bounce on clicked card and direct transition to payment screen
    anime({
      targets: cardElement,
      scale: [1, 0.95, 1.03, 1],
      duration: 280,
      easing: 'easeInOutSine',
      complete: () => {
        playChime();
        onProceedToPayment(id);
      },
    });
  };

  // Render photo preview slots according to Polaroid layout geometry
  const renderPhotoSlots = (id: LayoutId, isSelected: boolean) => {
    const slotColor = isSelected ? '#FFDDE9' : '#ECEBF6';

    switch (id) {
      case 'single':
        return (
          <div
            style={{
              width: '82px',
              backgroundColor: '#FFFFFF',
              borderRadius: '0px',
              padding: '6px 6px 14px 6px',
              boxShadow: isSelected
                ? '0 6px 16px rgba(108, 76, 89, 0.22)'
                : '0 3px 10px rgba(108, 76, 89, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '74px',
                backgroundColor: slotColor,
                borderRadius: '0px',
                transition: 'background-color 0.3s ease',
              }}
            />
          </div>
        );

      case 'duo':
        return (
          <div
            style={{
              width: '56px',
              backgroundColor: '#FFFFFF',
              borderRadius: '0px',
              padding: '5px 5px 14px 5px',
              boxShadow: isSelected
                ? '0 6px 16px rgba(108, 76, 89, 0.22)'
                : '0 3px 10px rgba(108, 76, 89, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '38px',
                backgroundColor: slotColor,
                borderRadius: '0px',
                transition: 'background-color 0.3s ease',
              }}
            />
            <div
              style={{
                width: '46px',
                height: '38px',
                backgroundColor: slotColor,
                borderRadius: '0px',
                transition: 'background-color 0.3s ease',
              }}
            />
          </div>
        );

      case 'grid4':
        return (
          <div
            style={{
              width: '84px',
              backgroundColor: '#FFFFFF',
              borderRadius: '0px',
              padding: '6px 6px 14px 6px',
              boxShadow: isSelected
                ? '0 6px 16px rgba(108, 76, 89, 0.22)'
                : '0 3px 10px rgba(108, 76, 89, 0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '4px',
            }}
          >
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                style={{
                  width: '34px',
                  height: '34px',
                  backgroundColor: slotColor,
                  borderRadius: '0px',
                  transition: 'background-color 0.3s ease',
                }}
              />
            ))}
          </div>
        );

      case 'strip6':
        return (
          <div
            style={{
              width: '50px',
              backgroundColor: '#FFFFFF',
              borderRadius: '0px',
              padding: '4px 4px 12px 4px',
              boxShadow: isSelected
                ? '0 6px 16px rgba(108, 76, 89, 0.22)'
                : '0 3px 10px rgba(108, 76, 89, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                style={{
                  width: '42px',
                  height: '13px',
                  backgroundColor: slotColor,
                  borderRadius: '0px',
                  transition: 'background-color 0.3s ease',
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px 28px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Kawaii Stickers (Layout Screen unique arrangement) */}
      <div ref={stickersRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* Top Right: Hello Kitty Face */}
        <div className="float-kawaii-layout" style={{ position: 'absolute', top: '5%', right: '6%', filter: 'drop-shadow(0 4px 12px rgba(230, 90, 132, 0.25))' }}>
          <HelloKittyIcon size={48} />
        </div>

        {/* Top Left: Cute Ribbon Bow */}
        <div className="float-kawaii-layout" style={{ position: 'absolute', top: '7%', left: '7%', filter: 'drop-shadow(0 4px 10px rgba(255, 82, 123, 0.3))' }}>
          <CuteBowIcon size={38} color="#FF4B72" />
        </div>

        {/* Mid Left: Kawaii Blossom Flower */}
        <div className="float-kawaii-layout" style={{ position: 'absolute', top: '48%', left: '3%', filter: 'drop-shadow(0 4px 10px rgba(255, 179, 198, 0.28))' }}>
          <CuteFlowerIcon size={34} color="#FFAEC9" />
        </div>

        {/* Mid Right: Kawaii Strawberry */}
        <div className="float-kawaii-layout" style={{ position: 'absolute', top: '44%', right: '3%', filter: 'drop-shadow(0 4px 10px rgba(255, 77, 109, 0.25))' }}>
          <CuteStrawberryIcon size={32} />
        </div>

        {/* Bottom Left: Hello Kitty Face */}
        <div className="float-kawaii-layout" style={{ position: 'absolute', bottom: '6%', left: '6%', filter: 'drop-shadow(0 4px 12px rgba(230, 90, 132, 0.25))' }}>
          <HelloKittyIcon size={40} />
        </div>

        {/* Bottom Right: Cute Ribbon Bow */}
        <div className="float-kawaii-layout" style={{ position: 'absolute', bottom: '6%', right: '7%', filter: 'drop-shadow(0 4px 10px rgba(255, 82, 123, 0.3))' }}>
          <CuteBowIcon size={34} color="#FF7096" />
        </div>

        {/* Sparkles */}
        <CuteSparkle className="float-kawaii-layout" size={20} color="#FF8CA9" style={{ position: 'absolute', top: '25%', right: '14%' }} />
        <CuteSparkle className="float-kawaii-layout" size={22} color="#FFAEC9" style={{ position: 'absolute', bottom: '28%', left: '12%' }} />
      </div>

      {/* Top Header Bar */}
      <div className="top-fade-in">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 0',
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => {
              playCutePop(0.9);
              onBackToHome();
            }}
            title="Back to Home"
            style={{
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#6C4C59',
              boxShadow: '0 4px 14px rgba(108, 76, 89, 0.12)',
              transition: 'background-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFF0F5';
              e.currentTarget.style.transform = 'translateX(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </button>

          {/* Title: Choose Your Layout */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#4A323E',
              letterSpacing: '0.2px',
              textAlign: 'center',
            }}
          >
            Choose Your Layout
          </h1>

          {/* Help Button */}
          <button
            onClick={() => {
              playCutePop(1.1);
              setIsHelpOpen(true);
            }}
            title="Help / Instructions"
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #F5CAD7',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#6C4C59',
              boxShadow: '0 4px 10px rgba(220, 130, 160, 0.15)',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <HelpCircle size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Subtitle & Cute Hearts */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={14} color="#6C4C59" fill="#6C4C59" strokeWidth={1.5} />
            <span style={{ fontSize: '13px', color: '#7E6673', fontWeight: 600 }}>
              ₱35 per shot • Tap any layout to proceed to payment
            </span>
            <Heart size={14} color="#6C4C59" fill="#6C4C59" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Main 2x2 Grid of 4 Layout Cards */}
      <div
        ref={cardsContainerRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          margin: 'auto auto',
          width: '100%',
          maxWidth: '560px',
          zIndex: 2,
        }}
      >
        {layouts.map((layout) => {
          const isSelected = selectedLayout === layout.id;

          return (
            <div
              key={layout.id}
              className="layout-card-item"
              onClick={(e) => handleSelectLayout(layout.id, e.currentTarget)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                height: '215px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px 18px 18px 18px',
                cursor: 'pointer',
                position: 'relative',
                border: 'none',
                boxShadow: isSelected
                  ? '0 16px 36px rgba(108, 76, 89, 0.28), 0 2px 10px rgba(108, 76, 89, 0.12)'
                  : '0 10px 24px rgba(220, 140, 165, 0.16)',
                transition: 'box-shadow 0.25s ease, transform 0.2s ease',
              }}
            >
              {/* Selected Heart Checkmark Badge on Top-Right Corner */}
              {isSelected && (
                <div
                  ref={heartBadgeRef}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-8px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(108, 76, 89, 0.25)',
                    zIndex: 5,
                  }}
                >
                  <Heart size={16} color="#6C4C59" fill="#6C4C59" />
                </div>
              )}

              {/* Top Badge: e.g. "1 Shot", "2 Shots", "4 Shots", "6 Shots" */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#6C4C59' : '#FFE1EA',
                    color: isSelected ? '#FFFFFF' : '#824F64',
                    letterSpacing: '0.3px',
                    transition: 'background-color 0.25s ease, color 0.25s ease',
                  }}
                >
                  {layout.badge}
                </span>
              </div>

              {/* Center Graphic: Layout Preview Frame */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  margin: '4px 0',
                }}
              >
                {renderPhotoSlots(layout.id, isSelected)}
              </div>

              {/* Bottom Label: "Single Solo", "Duo Strip", etc. */}
              <div
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: isSelected ? '#4A323E' : '#4E3743',
                  letterSpacing: '0.2px',
                }}
              >
                {layout.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
