import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { X, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { playCutePop } from '../utils/sound';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      anime({
        targets: backdropRef.current,
        opacity: [0, 1],
        duration: 300,
        easing: 'linear',
      });

      anime({
        targets: modalRef.current,
        scale: [0.85, 1],
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutBack(1.4)',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    playCutePop(0.9);
    if (modalRef.current && backdropRef.current) {
      anime({
        targets: modalRef.current,
        scale: [1, 0.9],
        opacity: [1, 0],
        duration: 250,
        easing: 'easeInQuad',
      });
      anime({
        targets: backdropRef.current,
        opacity: [1, 0],
        duration: 250,
        easing: 'linear',
        complete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(74, 50, 62, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(108, 76, 89, 0.3)',
          border: 'none',
          position: 'relative',
        }}
      >
        {/* Back Button on Top-Left */}
        <button
          onClick={handleClose}
          title="Back to Layout Selection"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '16px',
            padding: '6px 12px',
            backgroundColor: '#FFF0F5',
            border: 'none',
            cursor: 'pointer',
            color: '#6C4C59',
            fontSize: '12px',
            fontWeight: 700,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFE0EB')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F5')}
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          <span>Back</span>
        </button>

        {/* Close Button on Top-Right */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FFF0F5',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#6C4C59',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              backgroundColor: '#FFE4EE',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              color: '#6C4C59',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#4A323E',
            }}
          >
            How it Works
          </h3>
          <p style={{ fontSize: '12px', color: '#8E7380', marginTop: '2px' }}>
            Follow these sweet steps to print your receipt!
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          {[
            { step: '1', title: 'Pick Your Layout', desc: 'Choose between 1, 2, 4, or 6 photo shots.' },
            { step: '2', title: 'Pose & Snap', desc: 'Look at the camera and follow the cute timer.' },
            { step: '3', title: 'Instant Thermal Print', desc: 'Your vintage receipt print will dispense below!' },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px 12px',
                backgroundColor: '#FFF7FA',
                borderRadius: '14px',
                border: '1px solid #FCE4EC',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#6C4C59',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#4A323E' }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: '#7E6B75' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleClose}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#6C4C59',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 6px 16px rgba(108, 76, 89, 0.25)',
          }}
        >
          <CheckCircle2 size={16} /> Got it, let's shoot!
        </button>
      </div>
    </div>
  );
};
