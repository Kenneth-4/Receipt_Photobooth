import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Camera, Sparkles, Heart, Star, Disc, ArrowDown } from 'lucide-react';
import { playPaperSwoosh, playCutePop } from '../utils/sound';

interface HomeScreenProps {
  onStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

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
        rotate: [-0.5, 0.5, -0.5],
        duration: 4000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
      });
    }

    // Sparkles floating animation
    if (sparklesRef.current) {
      anime({
        targets: sparklesRef.current.querySelectorAll('.float-star'),
        translateY: () => anime.random(-15, 15),
        translateX: () => anime.random(-10, 10),
        scale: [0.8, 1.2],
        opacity: [0.4, 0.9],
        delay: anime.stagger(200),
        duration: 3000,
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
        padding: '24px 20px 20px 20px',
        position: 'relative',
      }}
    >
      {/* Floating Background Stars & Doodles */}
      <div ref={sparklesRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Star className="float-star" size={24} style={{ position: 'absolute', top: '12%', left: '8%', color: '#FFAEC9', fill: '#FFAEC9' }} />
        <Heart className="float-star" size={20} style={{ position: 'absolute', top: '22%', right: '10%', color: '#FF94B8', fill: '#FF94B8' }} />
        <Star className="float-star" size={18} style={{ position: 'absolute', bottom: '18%', left: '10%', color: '#FFB8D1', fill: '#FFB8D1' }} />
        <Sparkles className="float-star" size={26} style={{ position: 'absolute', bottom: '15%', right: '8%', color: '#FFAEC9' }} />
        <Heart className="float-star" size={16} style={{ position: 'absolute', top: '45%', left: '4%', color: '#FFCADB', fill: '#FFCADB' }} />
      </div>

      {/* Kiosk Header */}
      <div style={{ textAlign: 'center', zIndex: 2, marginTop: '8px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            padding: '6px 18px',
            borderRadius: '24px',
            boxShadow: '0 4px 14px rgba(220, 130, 160, 0.2)',
            marginBottom: '10px',
          }}
        >
          <Camera size={18} color="#6C4C59" />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '2px', color: '#6C4C59', textTransform: 'uppercase' }}>
            Kiosk Photobooth
          </span>
          <Sparkles size={16} color="#E65A84" />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#4A323E',
            letterSpacing: '0.5px',
            lineHeight: 1.15,
            textShadow: '0 2px 8px rgba(255, 255, 255, 0.8)',
          }}
        >
          Receipt Photobooth
        </h1>
        <p style={{ fontSize: '13px', color: '#8E7380', marginTop: '4px', fontWeight: 500 }}>
          Tap the receipt below to begin your session ♡
        </p>
      </div>

      {/* Printer Slot & Realistic Animated Receipt */}
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
        {/* Cute Metallic Dispenser Slot */}
        <div
          style={{
            width: '280px',
            height: '14px',
            backgroundColor: '#6C4C59',
            borderRadius: '8px',
            boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.4), 0 4px 10px rgba(108, 76, 89, 0.25)',
            position: 'relative',
            zIndex: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '220px', height: '4px', backgroundColor: '#2E1E26', borderRadius: '4px' }} />
        </div>

        {/* The Clickable Receipt Card */}
        <div
          ref={receiptRef}
          onClick={handleReceiptClick}
          role="button"
          tabIndex={0}
          style={{
            width: '270px',
            backgroundColor: '#FFFFFF',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 16px 36px rgba(108, 76, 89, 0.22), 0 4px 12px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer',
            padding: '20px 18px 26px 18px',
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
          {/* Top receipt punch holes / perforation line */}
          <div
            style={{
              borderBottom: '2px dashed #E0D4DC',
              paddingBottom: '12px',
              marginBottom: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Heart size={14} color="#6C4C59" fill="#6C4C59" />
              <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1px', color: '#4A323E' }}>
                SWEET PHOTO STUDIO
              </span>
              <Heart size={14} color="#6C4C59" fill="#6C4C59" />
            </div>
            <div style={{ fontSize: '9px', color: '#8E7380', letterSpacing: '1px' }}>
              ✦ SPECIAL EDITION PHOTO STRIP ✦
            </div>
          </div>

          {/* Ticket Body Details */}
          <div style={{ fontSize: '10px', color: '#5A4650', lineHeight: 1.6, marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DATE: {currentDate}</span>
              <span>TIME: 13:30</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>KIOSK: #PINK-01</span>
              <span>ORDER: #8824</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '2px' }}>
              <span>STATUS: READY</span>
              <span style={{ color: '#C84B72' }}>♡ 4 LAYOUTS ♡</span>
            </div>
          </div>

          {/* Mini Cute Photo Preview Box on Receipt */}
          <div
            style={{
              backgroundColor: '#FFF0F5',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '18px',
                color: '#6C4C59',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              "Touch here to capture your cutest moments!"
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '14px' }}>📸</span>
              <span style={{ fontSize: '14px' }}>🌸</span>
              <span style={{ fontSize: '14px' }}>✨</span>
              <span style={{ fontSize: '14px' }}>🎀</span>
            </div>
          </div>

          {/* Barcode Graphic */}
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
            <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#7E6B75', marginTop: '4px' }}>
              * 2026 0824 PHOTO *
            </div>
          </div>

          {/* Pulsing "TAP TO START" interactive banner */}
          <div
            style={{
              backgroundColor: '#6C4C59',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '8px 12px',
              marginTop: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(108, 76, 89, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            className="animate-pulse-cute"
          >
            <Disc size={14} className="animate-spin" />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>
              TAP RECEIPT TO START
            </span>
            <ArrowDown size={14} />
          </div>
        </div>
      </div>

      {/* Bottom Footer Hint */}
      <div style={{ textAlign: 'center', zIndex: 2, paddingBottom: '8px' }}>
        <p style={{ fontSize: '12px', color: '#9B7B8B', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>✿</span> Self-Service Kiosk Mode <span>✿</span>
        </p>
      </div>
    </div>
  );
};
