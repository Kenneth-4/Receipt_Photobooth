import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { ArrowLeft, HelpCircle, Heart, Star } from 'lucide-react';
import type { LayoutId } from '../types';
import { playCutePop, playChime } from '../utils/sound';
import { HelpModal } from './HelpModal';

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
  { id: 'single', title: 'Single Solo', badge: '1 Shot', shotsCount: 1 },
  { id: 'duo', title: 'Duo Strip', badge: '2 Shots', shotsCount: 2 },
  { id: 'grid4', title: 'Classic Grid', badge: '4 Shots', shotsCount: 4 },
  { id: 'strip6', title: 'Mega Strip', badge: '6 Shots', shotsCount: 6 },
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

  useEffect(() => {
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

  // Render photo preview slots according to layout geometry
  const renderPhotoSlots = (id: LayoutId, isSelected: boolean) => {
    const slotColor = isSelected ? '#FFDDE9' : '#ECEBF6';

    switch (id) {
      case 'single':
        return (
          <div
            style={{
              width: '74px',
              height: '98px',
              backgroundColor: slotColor,
              borderRadius: '8px',
              boxShadow: isSelected ? '0 2px 8px rgba(230, 90, 132, 0.15)' : 'none',
              transition: 'background-color 0.3s ease',
            }}
          />
        );

      case 'duo':
        return (
          <div
            style={{
              width: '46px',
              height: '98px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: slotColor,
                borderRadius: '6px',
                transition: 'background-color 0.3s ease',
              }}
            />
            <div
              style={{
                flex: 1,
                backgroundColor: slotColor,
                borderRadius: '6px',
                transition: 'background-color 0.3s ease',
              }}
            />
          </div>
        );

      case 'grid4':
        return (
          <div
            style={{
              width: '78px',
              height: '78px',
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
                  backgroundColor: slotColor,
                  borderRadius: '4px',
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
              width: '46px',
              height: '100px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  backgroundColor: slotColor,
                  borderRadius: '3px',
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
      }}
    >
      {/* Decorative background star matching mockup */}
      <div
        style={{
          position: 'absolute',
          bottom: '105px',
          right: '18px',
          pointerEvents: 'none',
          color: '#FFFFFF',
          opacity: 0.9,
          filter: 'drop-shadow(0 2px 6px rgba(240, 140, 170, 0.4))',
        }}
      >
        <Star size={26} strokeWidth={1.8} />
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
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #F5CAD7',
              borderRadius: '24px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#6C4C59',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 4px 10px rgba(220, 130, 160, 0.15)',
              transition: 'background-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFF0F5';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Back</span>
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
              Tap any shot option to proceed to payment
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
