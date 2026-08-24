import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Camera, HelpCircle, Heart, ArrowRight, Star } from 'lucide-react';
import type { LayoutId } from '../types';
import { playCutePop, playChime } from '../utils/sound';
import { HelpModal } from './HelpModal';
import { PaymentModal } from './PaymentModal';

interface LayoutSelectScreenProps {
  onBackToHome: () => void;
  onProceedToCamera: (layout: LayoutId) => void;
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
  onProceedToCamera,
}) => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>('grid4'); // Default to 4 shots as in user mockup
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const heartBadgeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

    // Floating Next Button slide up
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        translateY: [40, 0],
        opacity: [0, 1],
        delay: 350,
        duration: 700,
        easing: 'easeOutBack(1.2)',
      });
    }
  }, []);

  const handleSelectLayout = (id: LayoutId, cardElement: HTMLElement) => {
    playCutePop(1.1);
    setSelectedLayout(id);

    // anime.js micro-bounce on clicked card
    anime({
      targets: cardElement,
      scale: [1, 0.96, 1.02, 1],
      duration: 380,
      easing: 'easeInOutSine',
    });
  };

  const handleNextPayment = () => {
    playChime();
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        scale: [1, 0.94, 1.04, 1],
        duration: 300,
        easing: 'easeInOutQuad',
        complete: () => {
          setIsPaymentOpen(true);
        },
      });
    } else {
      setIsPaymentOpen(true);
    }
  };

  // Render photo preview slots according to layout geometry
  const renderPhotoSlots = (id: LayoutId, isSelected: boolean) => {
    const slotColor = isSelected ? '#FFDEEB' : '#E8E7F5';
    const slotBorder = isSelected ? '1px solid #F8C3D8' : '1px solid #DFDCED';

    switch (id) {
      case 'single':
        return (
          <div
            style={{
              width: '68px',
              height: '92px',
              backgroundColor: slotColor,
              border: slotBorder,
              borderRadius: '6px',
              boxShadow: isSelected ? '0 2px 8px rgba(230, 90, 132, 0.15)' : 'none',
              transition: 'background-color 0.3s ease',
            }}
          />
        );

      case 'duo':
        return (
          <div
            style={{
              width: '42px',
              height: '92px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: slotColor,
                border: slotBorder,
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
              }}
            />
            <div
              style={{
                flex: 1,
                backgroundColor: slotColor,
                border: slotBorder,
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
              }}
            />
          </div>
        );

      case 'grid4':
        return (
          <div
            style={{
              width: '76px',
              height: '76px',
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
                  border: slotBorder,
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
              width: '42px',
              height: '96px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  backgroundColor: slotColor,
                  border: slotBorder,
                  borderRadius: '2px',
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
        background: 'radial-gradient(circle at 50% 15%, #FFF2F7 0%, #FFDFEB 55%, #FAD2E2 100%)',
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
          {/* Camera Icon Button */}
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
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#3E2A34',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Camera size={26} strokeWidth={1.8} />
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
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#3E2A34',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <HelpCircle size={26} strokeWidth={1.8} />
          </button>
        </div>

        {/* 3 Cute Hearts below Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
            marginBottom: '18px',
          }}
        >
          <Heart size={16} color="#6C4C59" fill="#6C4C59" strokeWidth={1.5} />
          <Heart size={16} color="#6C4C59" fill="#6C4C59" strokeWidth={1.5} />
          <Heart size={16} color="#6C4C59" fill="none" strokeWidth={1.8} />
        </div>
      </div>

      {/* Main 2x2 Grid of 4 Layout Cards */}
      <div
        ref={cardsContainerRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          margin: '0 auto',
          width: '100%',
          maxWidth: '460px',
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
                borderRadius: '18px',
                height: '198px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '12px 14px 14px 14px',
                cursor: 'pointer',
                position: 'relative',
                border: isSelected ? '3px solid #6C4C59' : '2px solid rgba(255, 255, 255, 0.8)',
                boxShadow: isSelected
                  ? '0 12px 28px rgba(108, 76, 89, 0.22), 0 2px 8px rgba(108, 76, 89, 0.1)'
                  : '0 8px 20px rgba(220, 140, 165, 0.16)',
                transition: 'border 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease',
              }}
            >
              {/* Selected Heart Checkmark Badge on Top-Right Corner */}
              {isSelected && (
                <div
                  ref={heartBadgeRef}
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #6C4C59',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(108, 76, 89, 0.25)',
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

      {/* Bottom Floating Action Bar / Next Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
          zIndex: 3,
        }}
      >
        <button
          ref={buttonRef}
          onClick={handleNextPayment}
          style={{
            padding: '16px 42px',
            backgroundColor: '#6C4C59',
            color: '#FFFFFF',
            borderRadius: '36px',
            border: 'none',
            fontFamily: 'var(--font-serif)',
            fontSize: '19px',
            fontWeight: 700,
            letterSpacing: '0.4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 12px 28px rgba(108, 76, 89, 0.38)',
            transition: 'background-color 0.2s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5D3F4C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6C4C59';
          }}
        >
          <span>Next: Payment</span>
          <ArrowRight size={22} strokeWidth={2.2} />
        </button>
      </div>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        selectedLayout={selectedLayout}
        onProceedToCamera={() => {
          setIsPaymentOpen(false);
          onProceedToCamera(selectedLayout);
        }}
      />
    </div>
  );
};
