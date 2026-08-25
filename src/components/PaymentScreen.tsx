import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  QrCode,
  Ticket,
  Sparkles,
  CheckCircle2,
  Delete,
  RotateCcw,
  HelpCircle,
  Heart,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import type { LayoutId } from '../types';
import { playCutePop, playChime } from '../utils/sound';
import { HelpModal } from './HelpModal';

interface PaymentScreenProps {
  selectedLayout: LayoutId;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

type PaymentStep = 'select-method' | 'qr-window' | 'ticket-window';

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  selectedLayout,
  onBack,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<PaymentStep>('select-method');
  const [ticketCode, setTicketCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [paymentQrDataUrl, setPaymentQrDataUrl] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const ticketInputRef = useRef<HTMLDivElement>(null);

  const layoutDetails: Record<
    LayoutId,
    { title: string; badge: string; price: string; numPrice: string }
  > = {
    single: { title: 'Single Solo', badge: '1 Shot', price: '₱35.00', numPrice: '35.00' },
    duo: { title: 'Duo Strip', badge: '2 Shots', price: '₱70.00', numPrice: '70.00' },
    grid4: { title: 'Classic Grid', badge: '4 Shots', price: '₱140.00', numPrice: '140.00' },
    strip6: { title: 'Mega Strip', badge: '6 Shots', price: '₱210.00', numPrice: '210.00' },
  };

  // Generate actual Payment QR code
  useEffect(() => {
    const paymentPayload = `https://photobooth.pay/checkout?amount=${layoutDetails[selectedLayout]?.numPrice || '140.00'}&currency=PHP&layout=${selectedLayout}&ref=PHOTO-${Date.now().toString().slice(-6)}`;
    QRCode.toDataURL(paymentPayload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#4A323E',
        light: '#FFFFFF',
      },
    })
      .then((qr) => setPaymentQrDataUrl(qr))
      .catch((err) => console.error('Failed to generate payment QR code', err));
  }, [selectedLayout]);

  const currentLayout = layoutDetails[selectedLayout] || layoutDetails.grid4;

  useEffect(() => {
    // Animation whenever step changes
    if (mainContentRef.current) {
      anime({
        targets: mainContentRef.current,
        translateY: [16, 0],
        opacity: [0, 1],
        duration: 380,
        easing: 'easeOutQuad',
      });
    }

    anime({
      targets: '.payment-header-anim',
      translateY: [-10, 0],
      opacity: [0, 1],
      duration: 320,
      easing: 'easeOutCubic',
    });
  }, [step]);

  const handleSelectOption = (newStep: 'qr-window' | 'ticket-window') => {
    playCutePop(1.1);
    setStep(newStep);
    setErrorMsg('');
  };

  const handleStepBack = () => {
    playCutePop(0.9);
    if (step === 'select-method') {
      onBack();
    } else {
      setStep('select-method');
      setErrorMsg('');
    }
  };

  // On-screen Keypad logic for Ticket Code
  const handleKeyPress = (num: string) => {
    playCutePop(1.2);
    setErrorMsg('');
    if (ticketCode.length < 6) {
      setTicketCode((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    playCutePop(0.85);
    setErrorMsg('');
    setTicketCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    playCutePop(0.75);
    setErrorMsg('');
    setTicketCode('');
  };

  const triggerSuccessFlow = (label: string) => {
    playChime();
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#FF94B8', '#6C4C59', '#FFE4EE', '#FFAEC9', '#FFFFFF'],
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      onPaymentSuccess();
    }, 1400);
  };

  // Submit Ticket Code Validation
  const handleRedeemTicket = () => {
    if (ticketCode.length < 4) {
      setErrorMsg('Please enter a valid 4 to 6-digit ticket code');
      if (ticketInputRef.current) {
        anime({
          targets: ticketInputRef.current,
          translateX: [-10, 10, -6, 6, 0],
          duration: 380,
          easing: 'easeInOutSine',
        });
      }
      return;
    }

    triggerSuccessFlow('Ticket Voucher');
  };

  // Simulate Instant QR Payment
  const handleSimulateQRPay = () => {
    triggerSuccessFlow('QR Code');
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
        padding: '18px 24px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header Navigation (Completely Borderless) */}
      <div className="payment-header-anim" style={{ width: '100%', marginBottom: '12px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          {/* Back Button (Icon Only) */}
          <button
            onClick={handleStepBack}
            title={step === 'select-method' ? 'Back to Layouts' : 'Back to Payment Options'}
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

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#4A323E',
              letterSpacing: '0.2px',
              textAlign: 'center',
            }}
          >
            {step === 'select-method'
              ? 'Select Payment Method'
              : step === 'qr-window'
              ? 'Scan QR Code'
              : 'Enter Ticket Voucher'}
          </h1>

          {/* Help Button */}
          <button
            onClick={() => {
              playCutePop(1.1);
              setIsHelpOpen(true);
            }}
            title="Help & Instructions"
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <HelpCircle size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Selected Package Summary Pill (Borderless) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              border: 'none',
              borderRadius: '24px',
              padding: '6px 20px',
              boxShadow: '0 4px 14px rgba(108, 76, 89, 0.08)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#7A5B69' }}>
              Package: <strong style={{ color: '#4A323E' }}>{currentLayout.title}</strong> ({currentLayout.badge})
            </span>
            <span style={{ color: '#E297B3' }}>•</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#6C4C59' }}>
              {currentLayout.price}
            </span>
          </div>
        </div>
      </div>

      {/* Main Center Area (Occupy Full Top-to-Bottom Space, No White Border Framing) */}
      <div
        ref={mainContentRef}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'stretch',
          alignItems: 'stretch',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {isSuccess ? (
          /* Payment Approved Success State (Seamless / Borderless) */
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '46px',
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.18)',
              }}
            >
              <CheckCircle2 size={58} />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '32px',
                fontWeight: 700,
                color: '#2E7D32',
                marginBottom: '10px',
              }}
            >
              Payment Approved! ♡
            </h2>
            <p style={{ fontSize: '17px', color: '#6C4C59', marginBottom: '20px', fontWeight: 600 }}>
              Preparing your photo session... Get ready!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Heart size={24} color="#E65A84" fill="#E65A84" />
              <Heart size={24} color="#E65A84" fill="#E65A84" />
              <Heart size={24} color="#E65A84" fill="#E65A84" />
            </div>
          </div>
        ) : step === 'select-method' ? (
          /* ======================================================== */
          /* WINDOW 1: COMPACT PAYMENT SELECTION BUTTONS             */
          /* ======================================================== */
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '28px',
              width: '100%',
              height: '100%',
            }}
          >
            {/* BUTTON 1: QR CODE */}
            <button
              onClick={() => handleSelectOption('qr-window')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                border: 'none',
                padding: '36px 32px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                boxShadow: '0 12px 32px rgba(108, 76, 89, 0.12)',
                transition: 'all 0.22s ease',
                width: '260px',
                height: '240px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 44px rgba(108, 76, 89, 0.2)';
                e.currentTarget.style.backgroundColor = '#FFFDFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(108, 76, 89, 0.12)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.96)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
            >
              {/* QR Code Icon */}
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '26px',
                  backgroundColor: '#FFE4EE',
                  color: '#6C4C59',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(230, 90, 132, 0.2)',
                }}
              >
                <QrCode size={46} strokeWidth={2} />
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#4A323E',
                  margin: 0,
                }}
              >
                QR Code
              </h2>
            </button>

            {/* BUTTON 2: TICKET CODE */}
            <button
              onClick={() => handleSelectOption('ticket-window')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                border: 'none',
                padding: '36px 32px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                boxShadow: '0 12px 32px rgba(108, 76, 89, 0.12)',
                transition: 'all 0.22s ease',
                width: '260px',
                height: '240px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 44px rgba(108, 76, 89, 0.2)';
                e.currentTarget.style.backgroundColor = '#FFFDFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(108, 76, 89, 0.12)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.96)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
            >
              {/* Ticket Icon */}
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '26px',
                  backgroundColor: '#FFE4EE',
                  color: '#6C4C59',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(230, 90, 132, 0.2)',
                }}
              >
                <Ticket size={46} strokeWidth={2} />
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#4A323E',
                  margin: 0,
                }}
              >
                Ticket Code
              </h2>
            </button>
          </div>
        ) : step === 'qr-window' ? (
          /* ======================================================== */
          /* WINDOW 2: SEPARATE QR WINDOW                            */
          /* ======================================================== */
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
              padding: '8px 0',
            }}
          >
            {/* Header info */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <Smartphone size={24} color="#6C4C59" />
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#4A323E' }}>
                  Scan QR with Mobile App
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#7E6673', margin: 0, fontWeight: 500 }}>
                Supports GCash, Maya, QRPh, Banking Apps & E-Wallets
              </p>
            </div>

            {/* Actual Generated Payment QR Code Graphic (Card) */}
            <div
              style={{
                position: 'relative',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                border: 'none',
                borderRadius: '26px',
                boxShadow: '0 12px 36px rgba(108, 76, 89, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '236px',
                height: '236px',
              }}
            >
              {paymentQrDataUrl ? (
                <img
                  src={paymentQrDataUrl}
                  alt="Payment QR Code"
                  style={{
                    width: '204px',
                    height: '204px',
                    borderRadius: '12px',
                    display: 'block',
                  }}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#7E6673' }}>Generating QR...</div>
              )}

              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '4px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 10px rgba(108, 76, 89, 0.15)',
                  whiteSpace: 'nowrap',
                }}
              >
                <ShieldCheck size={14} color="#E65A84" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#6C4C59' }}>Secure QR Pay</span>
              </div>
            </div>

            {/* Total Due Amount */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: 'none',
                padding: '16px 32px',
                width: '100%',
                maxWidth: '480px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 8px 24px rgba(108, 76, 89, 0.08)',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#7A5B69' }}>Total Amount Due:</span>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#6C4C59' }}>{currentLayout.price}</span>
            </div>

            {/* Tap to Simulate Scan & Pay Button (Bigger) */}
            <button
              onClick={handleSimulateQRPay}
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '20px 32px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '32px',
                fontFamily: 'var(--font-serif)',
                fontSize: '19px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 12px 28px rgba(108, 76, 89, 0.35)',
                transition: 'background-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#583D48';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6C4C59';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            >
              <Sparkles size={22} />
              <span>Simulate Scan & Confirm Pay</span>
            </button>
          </div>
        ) : (
          /* ======================================================== */
          /* WINDOW 3: SEPARATE TICKET KEYPAD                        */
          /* ======================================================== */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
              padding: '6px 0',
            }}
          >
            {/* Ticket Code Slots Display (Extra Large Input) */}
            <div
              ref={ticketInputRef}
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#4A323E', marginBottom: '10px' }}>
                Enter Ticket Voucher Code
              </div>

              {/* 6-Digit PIN Boxes (Extra Large Size & Font) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '14px',
                  marginBottom: '8px',
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const char = ticketCode[idx] || '';
                  const isActive = ticketCode.length === idx;

                  return (
                    <div
                      key={idx}
                      style={{
                        width: '78px',
                        height: '88px',
                        borderRadius: '22px',
                        backgroundColor: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '42px',
                        fontWeight: 800,
                        color: '#4A323E',
                        fontFamily: 'var(--font-mono)',
                        boxShadow: isActive
                          ? '0 0 0 4px #6C4C59, 0 10px 28px rgba(108, 76, 89, 0.22)'
                          : char
                          ? '0 8px 22px rgba(108, 76, 89, 0.15)'
                          : '0 4px 16px rgba(108, 76, 89, 0.08)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>

              {errorMsg ? (
                <div style={{ fontSize: '14px', color: '#D32F2F', fontWeight: 700, marginTop: '4px' }}>
                  {errorMsg}
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: '#8E7380', marginTop: '4px' }}>
                  Type your 6-digit voucher code using keypad below
                </div>
              )}
            </div>

            {/* ON-SCREEN KEYPAD (3x4 Grid, Bigger Buttons) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                width: '100%',
                maxWidth: '460px',
                margin: 'auto 0',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  style={{
                    height: '62px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#4A323E',
                    fontSize: '26px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 5px 14px rgba(108, 76, 89, 0.09)',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF0F5';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(108, 76, 89, 0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 14px rgba(108, 76, 89, 0.09)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.93)';
                    e.currentTarget.style.backgroundColor = '#F8D2E1';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#FFF0F5';
                  }}
                >
                  {digit}
                </button>
              ))}

              {/* Clear Button (Bigger) */}
              <button
                onClick={handleClear}
                title="Clear All"
                style={{
                  height: '62px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: '#FFF0F5',
                  color: '#8E7380',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 5px 14px rgba(108, 76, 89, 0.06)',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFE4EE';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF0F5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.93)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <RotateCcw size={18} />
                <span>Clear</span>
              </button>

              {/* Zero */}
              <button
                onClick={() => handleKeyPress('0')}
                style={{
                  height: '62px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#4A323E',
                  fontSize: '26px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 5px 14px rgba(108, 76, 89, 0.09)',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF0F5';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(108, 76, 89, 0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 14px rgba(108, 76, 89, 0.09)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.93)';
                  e.currentTarget.style.backgroundColor = '#F8D2E1';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#FFF0F5';
                }}
              >
                0
              </button>

              {/* Delete / Backspace (Bigger) */}
              <button
                onClick={handleDelete}
                title="Backspace"
                style={{
                  height: '62px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: '#FFF0F5',
                  color: '#8E7380',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 5px 14px rgba(108, 76, 89, 0.06)',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFE4EE';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF0F5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.93)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Delete size={24} />
              </button>
            </div>

            {/* Redeem Ticket Button (Bigger) */}
            <button
              onClick={handleRedeemTicket}
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '18px 32px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '32px',
                fontFamily: 'var(--font-serif)',
                fontSize: '19px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 12px 28px rgba(108, 76, 89, 0.35)',
                transition: 'background-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#583D48';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6C4C59';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            >
              <Ticket size={22} />
              <span>Redeem Ticket & Shoot</span>
            </button>
          </div>
        )}
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
