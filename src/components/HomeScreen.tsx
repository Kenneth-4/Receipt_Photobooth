import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Camera, Sparkles, Heart, Star, ArrowDown } from 'lucide-react';
import { playPaperSwoosh, playCutePop } from '../utils/sound';
import {
  HelloKittyIcon,
  CuteBowIcon,
  CuteStrawberryIcon,
  CuteFlowerIcon,
  CuteSparkle,
} from './KawaiiIcons';

interface HomeScreenProps {
  onStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entrance animation with anime.js
    if (receiptRef.current) {
      anime({
        targets: receiptRef.current,
        translateY: [-60, 0],
        opacity: [0, 1],
        scale: [0.92, 1],
        easing: 'easeOutElastic(1, .75)',
        duration: 1200,
      });

      // Subtle breathing / floating animation
      anime({
        targets: receiptRef.current,
        translateY: [0, -8, 0],
        rotate: [-0.6, 0.6, -0.6],
        duration: 4000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
      });
    }

    // Floating Kawaii Stickers animation
    if (stickersRef.current) {
      anime({
        targets: stickersRef.current.querySelectorAll('.float-kawaii'),
        translateY: () => anime.random(-16, 16),
        translateX: () => anime.random(-12, 12),
        rotate: () => anime.random(-12, 12),
        scale: [0.9, 1.12],
        delay: anime.stagger(180),
        duration: 3200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad',
      });
    }
  }, []);

  const handleReceiptClick = () => {
    playPaperSwoosh();
    playCutePop(1.2);

    if (receiptRef.current) {
      // Tear / unfurl animation before changing screen
      anime({
        targets: receiptRef.current,
        translateY: [0, 20, -180],
        rotate: [0, 4, -8],
        scale: [1, 1.05, 0.9],
        opacity: [1, 1, 0],
        duration: 650,
        easing: 'easeInOutCubic',
        complete: () => {
          onStart();
        },
      });
    } else {
      onStart();
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Kawaii Stickers & Mascots Background */}
      <div ref={stickersRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* Top Left: Hello Kitty Mascot */}
        <div className="float-kawaii" style={{ position: 'absolute', top: '7%', left: '7%', filter: 'drop-shadow(0 6px 14px rgba(230, 90, 132, 0.25))' }}>
          <HelloKittyIcon size={52} />
        </div>

        {/* Top Right: Cute Ribbon Bow */}
        <div className="float-kawaii" style={{ position: 'absolute', top: '10%', right: '8%', filter: 'drop-shadow(0 4px 10px rgba(255, 82, 123, 0.3))' }}>
          <CuteBowIcon size={40} color="#FF4B72" />
        </div>

        {/* Mid Left: Kawaii Strawberry */}
        <div className="float-kawaii" style={{ position: 'absolute', top: '44%', left: '4%', filter: 'drop-shadow(0 4px 10px rgba(255, 77, 109, 0.25))' }}>
          <CuteStrawberryIcon size={34} />
        </div>

        {/* Mid Right: Hello Kitty Face */}
        <div className="float-kawaii" style={{ position: 'absolute', top: '48%', right: '5%', filter: 'drop-shadow(0 6px 14px rgba(230, 90, 132, 0.25))' }}>
          <HelloKittyIcon size={46} />
        </div>

        {/* Bottom Left: Cute Blossom Flower */}
        <div className="float-kawaii" style={{ position: 'absolute', bottom: '12%', left: '9%', filter: 'drop-shadow(0 4px 10px rgba(255, 179, 198, 0.3))' }}>
          <CuteFlowerIcon size={36} color="#FFAEC9" />
        </div>

        {/* Bottom Right: Cute Ribbon Bow */}
        <div className="float-kawaii" style={{ position: 'absolute', bottom: '14%', right: '9%', filter: 'drop-shadow(0 4px 10px rgba(255, 82, 123, 0.3))' }}>
          <CuteBowIcon size={36} color="#FF6584" />
        </div>

        {/* Additional Cute Sparkles */}
        <CuteSparkle className="float-kawaii" size={24} color="#FF94B8" style={{ position: 'absolute', top: '26%', left: '16%' }} />
        <CuteSparkle className="float-kawaii" size={20} color="#FFA8C5" style={{ position: 'absolute', top: '22%', right: '22%' }} />
        <Star className="float-kawaii" size={20} style={{ position: 'absolute', bottom: '28%', right: '14%', color: '#FFD166', fill: '#FFD166' }} />
        <Heart className="float-kawaii" size={22} style={{ position: 'absolute', bottom: '26%', left: '15%', color: '#FF70A6', fill: '#FF70A6' }} />
      </div>

      {/* Kawaii Kiosk Header */}
      <div style={{ textAlign: 'center', zIndex: 3, marginTop: '4px' }}>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '34px',
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#4A323E',
            letterSpacing: '0.5px',
            lineHeight: 1.15,
            textShadow: '0 2px 10px rgba(255, 255, 255, 0.9)',
            margin: '2px 0',
          }}
        >
          Sweet Memories Studio
        </h1>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#E65A84' }}>₱35 PER SHOT</span>
          <span style={{ color: '#C8A2B5' }}>•</span>
          <span style={{ fontSize: '13px', color: '#7E6673', fontWeight: 600 }}>
            Touch the ticket to capture sweet moments ♡
          </span>
        </div>
      </div>

      {/* Printer Slot & Kawaii Clickable Receipt */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 3,
          margin: 'auto 0',
        }}
      >
        {/* Cute Metallic Dispenser Slot with Bow */}
        <div
          style={{
            width: '290px',
            height: '16px',
            backgroundColor: '#6C4C59',
            borderRadius: '10px',
            boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.35), 0 6px 14px rgba(108, 76, 89, 0.25)',
            position: 'relative',
            zIndex: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '230px', height: '4px', backgroundColor: '#26171F', borderRadius: '4px' }} />

          {/* Mini Center Bow Badge on Slot */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              backgroundColor: '#FFFFFF',
              borderRadius: '50%',
              padding: '3px',
              boxShadow: '0 2px 8px rgba(108, 76, 89, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CuteBowIcon size={20} color="#FF4B72" />
          </div>
        </div>

        {/* The Clickable Kawaii Receipt Card */}
        <div
          ref={receiptRef}
          onClick={handleReceiptClick}
          role="button"
          tabIndex={0}
          style={{
            width: '280px',
            backgroundColor: '#FFFFFF',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 20px 48px rgba(108, 76, 89, 0.22), 0 4px 14px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer',
            padding: '18px 18px 24px 18px',
            marginTop: '-4px',
            position: 'relative',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            fontFamily: 'var(--font-mono)',
          }}
          className="receipt-zigzag-bottom"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          }}
        >
          {/* Top receipt mascot & perforation line */}
          <div
            style={{
              borderBottom: '2px dashed #F0DCE5',
              paddingBottom: '10px',
              marginBottom: '12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <HelloKittyIcon size={28} />
              <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.8px', color: '#4A323E' }}>
                HELLO KITTY & FRIENDS
              </span>
              <CuteBowIcon size={20} color="#FF4B72" />
            </div>
            <div style={{ fontSize: '9px', color: '#E65A84', letterSpacing: '1px', fontWeight: 700 }}>
              ✦ OFFICIAL PHOTO PASS • ₱35 / SHOT ✦
            </div>
          </div>

          {/* Ticket Metadata */}
          <div style={{ fontSize: '10px', color: '#6A4D5C', lineHeight: 1.6, marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DATE: {currentDate}</span>
              <span>TIME: 14:00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>STUDIO: #KAWAII-01</span>
              <span>ORDER: #KITTY-77</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '2px' }}>
              <span>STATUS: READY</span>
              <span style={{ color: '#E65A84' }}>♡ 4 SWEET LAYOUTS ♡</span>
            </div>
          </div>

          {/* Mini Cute Greeting Box on Receipt */}
          <div
            style={{
              backgroundColor: '#FFF0F5',
              border: '1.5px solid #FFDDE8',
              borderRadius: '12px',
              padding: '10px 8px',
              textAlign: 'center',
              marginBottom: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '20px',
                color: '#6C4C59',
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              "Touch here to snap your cutest poses! ♡"
            </div>

            {/* Cute Kawaii Emojis & Icons Row */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <CuteStrawberryIcon size={18} />
              <CuteFlowerIcon size={18} color="#FFB3C6" />
              <HelloKittyIcon size={20} />
              <CuteBowIcon size={16} color="#FF527B" />
              <CuteSparkle size={16} color="#FFAEC9" />
            </div>
          </div>

          {/* Barcode Graphic with Heart */}
          <div style={{ marginBottom: '8px', textAlign: 'center' }}>
            <div className="thermal-barcode">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2].map((width, i) => (
                <div
                  key={i}
                  className="thermal-barcode-line"
                  style={{ width: `${width}px` }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#8E7380', marginTop: '4px', fontWeight: 600 }}>
              * 2026 • HELLO KITTY PHOTO • *
            </div>
          </div>

          {/* Pulsing "TOUCH TO START" Kawaii Banner */}
          <div
            style={{
              backgroundColor: '#6C4C59',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '10px 14px',
              marginTop: '10px',
              textAlign: 'center',
              boxShadow: '0 6px 16px rgba(108, 76, 89, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            className="animate-pulse-cute"
          >
            <CuteBowIcon size={18} color="#FFAEC9" />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>
              TOUCH RECEIPT TO START
            </span>
            <ArrowDown size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Bottom Footer Hint */}
    </div>
  );
};
