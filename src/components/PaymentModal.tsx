import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import confetti from 'canvas-confetti';
import { X, ArrowLeft, CreditCard, Sparkles, Check, Heart } from 'lucide-react';
import type { LayoutId } from '../types';
import { playCutePop, playChime } from '../utils/sound';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLayout: LayoutId;
  onProceedToCamera: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedLayout,
  onProceedToCamera,
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentSuccess(false);
      if (modalRef.current && backdropRef.current) {
        anime({
          targets: backdropRef.current,
          opacity: [0, 1],
          duration: 300,
          easing: 'linear',
        });
        anime({
          targets: modalRef.current,
          scale: [0.88, 1],
          opacity: [0, 1],
          translateY: [25, 0],
          duration: 400,
          easing: 'easeOutBack(1.3)',
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const layoutNames: Record<LayoutId, { title: string; shots: string; price: string }> = {
    single: { title: 'Single Solo', shots: '1 Shot', price: '$2.00' },
    duo: { title: 'Duo Strip', shots: '2 Shots', price: '$3.50' },
    grid4: { title: 'Classic Grid', shots: '4 Shots', price: '$5.00' },
    strip6: { title: 'Mega Strip', shots: '6 Shots', price: '$6.00' },
  };

  const currentLayout = layoutNames[selectedLayout];

  const handleSimulatePayment = () => {
    playChime();
    setPaymentSuccess(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF94B8', '#6C4C59', '#FFE4EE', '#FFAEC9'],
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      onProceedToCamera();
    }, 1200);
  };

  const handleClose = () => {
    playCutePop(0.9);
    onClose();
  };

  return (
    <div
      ref={backdropRef}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(74, 50, 62, 0.5)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '400px',
          backgroundColor: '#FFFFFF',
          borderRadius: '30px',
          padding: '28px 24px',
          boxShadow: '0 24px 50px rgba(108, 76, 89, 0.35)',
          border: 'none',
          position: 'relative',
          textAlign: 'center',
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

        {!paymentSuccess ? (
          <>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '28px',
                backgroundColor: '#FFE4EE',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: '#6C4C59',
              }}
            >
              <CreditCard size={28} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontStyle: 'italic',
                fontWeight: 700,
                color: '#4A323E',
                marginBottom: '4px',
              }}
            >
              Payment Checkout
            </h3>
            <p style={{ fontSize: '13px', color: '#8E7380', marginBottom: '16px' }}>
              Selected: <strong style={{ color: '#6C4C59' }}>{currentLayout.title}</strong> ({currentLayout.shots})
            </p>

            <div
              style={{
                backgroundColor: '#FFF7FA',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#7E6B75' }}>Layout Option:</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#4A323E' }}>{currentLayout.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#7E6B75' }}>Thermal Receipt Print:</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#4A323E' }}>Included (1 Strip)</span>
              </div>
              <div style={{ borderTop: '1px solid #F8D3E1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#4A323E' }}>Total Amount:</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#6C4C59' }}>{currentLayout.price}</span>
              </div>
            </div>

            {/* Tap to Pay Simulation Button */}
            <button
              onClick={handleSimulatePayment}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(108, 76, 89, 0.3)',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Sparkles size={18} /> Tap Card / Insert Coin ({currentLayout.price})
            </button>
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '32px',
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Check size={36} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontWeight: 700,
                color: '#2E7D32',
                marginBottom: '6px',
              }}
            >
              Payment Approved! ♡
            </h3>
            <p style={{ fontSize: '13px', color: '#6C4C59', marginBottom: '8px' }}>
              Preparing photobooth camera session...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '12px' }}>
              <Heart size={16} color="#E65A84" fill="#E65A84" />
              <Heart size={16} color="#E65A84" fill="#E65A84" />
              <Heart size={16} color="#E65A84" fill="#E65A84" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
