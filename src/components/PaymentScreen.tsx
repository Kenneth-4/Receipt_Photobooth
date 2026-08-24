import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import confetti from 'canvas-confetti';
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
  ChevronRight,
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

  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const ticketInputRef = useRef<HTMLDivElement>(null);

  const layoutDetails: Record<
    LayoutId,
    { title: string; badge: string; price: string; numPrice: string }
  > = {
    single: { title: 'Single Solo', badge: '1 Shot', price: '$2.00', numPrice: '2.00' },
    duo: { title: 'Duo Strip', badge: '2 Shots', price: '$3.50', numPrice: '3.50' },
    grid4: { title: 'Classic Grid', badge: '4 Shots', price: '$5.00', numPrice: '5.00' },
    strip6: { title: 'Mega Strip', badge: '6 Shots', price: '$6.00', numPrice: '6.00' },
  };

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
          {/* Back Button */}
          <button
            onClick={handleStepBack}
            title={step === 'select-method' ? 'Back to Layouts' : 'Back to Payment Options'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: 'none',
              borderRadius: '24px',
              padding: '10px 20px',
              cursor: 'pointer',
              color: '#6C4C59',
              fontSize: '14px',
              fontWeight: 700,
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
            <ArrowLeft size={18} strokeWidth={2.4} />
            <span>Back</span>
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
          /* Payment Approved Success State */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '32px',
              padding: '48px 36px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(108, 76, 89, 0.18)',
              border: 'none',
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
                width: '84px',
                height: '84px',
                borderRadius: '42px',
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.15)',
              }}
            >
              <CheckCircle2 size={54} />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '30px',
                fontWeight: 700,
                color: '#2E7D32',
                marginBottom: '8px',
              }}
            >
              Payment Approved! ♡
            </h2>
            <p style={{ fontSize: '16px', color: '#6C4C59', marginBottom: '18px' }}>
              Preparing your photo session... Get ready!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Heart size={22} color="#E65A84" fill="#E65A84" />
              <Heart size={22} color="#E65A84" fill="#E65A84" />
              <Heart size={22} color="#E65A84" fill="#E65A84" />
            </div>
          </div>
        ) : step === 'select-method' ? (
          /* ======================================================== */
          /* WINDOW 1: TWO COLUMNS OCCUPYING TOP-TO-BOTTOM SPACE      */
          /* ======================================================== */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              width: '100%',
              height: '100%',
              alignItems: 'stretch',
            }}
          >
            {/* COLUMN 1: QR CODE BUTTON (Occupies Top & Bottom, Borderless) */}
            <button
              onClick={() => handleSelectOption('qr-window')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '32px',
                border: 'none',
                padding: '32px 28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 16px 40px rgba(108, 76, 89, 0.12)',
                transition: 'all 0.25s ease',
                height: '100%',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 24px 50px rgba(108, 76, 89, 0.22)';
                e.currentTarget.style.backgroundColor = '#FFFDFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(108, 76, 89, 0.12)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              {/* Top Badge */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '6px 14px',
                    borderRadius: '16px',
                    backgroundColor: '#6C4C59',
                    color: '#FFFFFF',
                    letterSpacing: '0.4px',
                  }}
                >
                  OPTION 1 • INSTANT PAY
                </span>
              </div>

              {/* Center Big Icon & Title */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  margin: 'auto 0',
                }}
              >
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '32px',
                    backgroundColor: '#FFE4EE',
                    color: '#6C4C59',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 24px rgba(230, 90, 132, 0.22)',
                  }}
                >
                  <QrCode size={52} strokeWidth={2} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#4A323E',
                      marginBottom: '8px',
                    }}
                  >
                    QR Code
                  </h2>
                  <p style={{ fontSize: '15px', color: '#7E6673', margin: 0, lineHeight: 1.4, maxWidth: '260px' }}>
                    Scan with GCash, Maya, QRPh, or E-Wallets
                  </p>
                </div>
              </div>

              {/* Bottom Price Pill & Action */}
              <div
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '22px',
                  backgroundColor: '#FFF0F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#6C4C59',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                <span>Pay {currentLayout.price}</span>
                <ChevronRight size={20} strokeWidth={2.4} />
              </div>
            </button>

            {/* COLUMN 2: TICKET CODE BUTTON (Occupies Top & Bottom, Borderless) */}
            <button
              onClick={() => handleSelectOption('ticket-window')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '32px',
                border: 'none',
                padding: '32px 28px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 16px 40px rgba(108, 76, 89, 0.12)',
                transition: 'all 0.25s ease',
                height: '100%',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 24px 50px rgba(108, 76, 89, 0.22)';
                e.currentTarget.style.backgroundColor = '#FFFDFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(108, 76, 89, 0.12)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              {/* Top Badge */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '6px 14px',
                    borderRadius: '16px',
                    backgroundColor: '#FFE1EA',
                    color: '#824F64',
                    letterSpacing: '0.4px',
                  }}
                >
                  OPTION 2 • TOUCH KEYPAD
                </span>
              </div>

              {/* Center Big Icon & Title */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  margin: 'auto 0',
                }}
              >
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '32px',
                    backgroundColor: '#FFE4EE',
                    color: '#6C4C59',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 24px rgba(230, 90, 132, 0.22)',
                  }}
                >
                  <Ticket size={52} strokeWidth={2} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#4A323E',
                      marginBottom: '8px',
                    }}
                  >
                    Ticket Code
                  </h2>
                  <p style={{ fontSize: '15px', color: '#7E6673', margin: 0, lineHeight: 1.4, maxWidth: '260px' }}>
                    Enter prepaid ticket voucher with on-screen keypad
                  </p>
                </div>
              </div>

              {/* Bottom Price Pill & Action */}
              <div
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '22px',
                  backgroundColor: '#FFF0F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#6C4C59',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                <span>Enter Ticket Pass</span>
                <ChevronRight size={20} strokeWidth={2.4} />
              </div>
            </button>
          </div>
        ) : step === 'qr-window' ? (
          /* ======================================================== */
          /* WINDOW 2: SEPARATE QR WINDOW (Occupies Top & Bottom)     */
          /* ======================================================== */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '32px',
              border: 'none',
              padding: '24px 32px',
              boxShadow: '0 20px 48px rgba(108, 76, 89, 0.14)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Header info */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <Smartphone size={22} color="#6C4C59" />
                <span style={{ fontSize: '19px', fontWeight: 800, color: '#4A323E' }}>
                  Scan QR with Mobile App
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#8E7380', margin: 0 }}>
                Supports GCash, Maya, QRPh, Banking Apps & E-Wallets
              </p>
            </div>

            {/* Stylized QR Code Graphic (Borderless) */}
            <div
              style={{
                position: 'relative',
                padding: '16px',
                backgroundColor: '#FFF9FB',
                border: 'none',
                borderRadius: '24px',
                boxShadow: '0 6px 20px rgba(108, 76, 89, 0.08)',
                display: 'inline-block',
              }}
            >
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" rx="14" fill="#FFFFFF" />

                {/* Corner Finder 1 */}
                <rect x="15" y="15" width="50" height="50" rx="8" stroke="#4A323E" strokeWidth="6" />
                <rect x="27" y="27" width="26" height="26" rx="4" fill="#6C4C59" />

                {/* Corner Finder 2 */}
                <rect x="135" y="15" width="50" height="50" rx="8" stroke="#4A323E" strokeWidth="6" />
                <rect x="147" y="27" width="26" height="26" rx="4" fill="#6C4C59" />

                {/* Corner Finder 3 */}
                <rect x="15" y="135" width="50" height="50" rx="8" stroke="#4A323E" strokeWidth="6" />
                <rect x="27" y="147" width="26" height="26" rx="4" fill="#6C4C59" />

                {/* QR Grid Pattern */}
                <rect x="75" y="20" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="95" y="20" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="115" y="20" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="75" y="40" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="105" y="40" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="20" y="75" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="40" y="75" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="75" y="75" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="115" y="75" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="140" y="75" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="165" y="75" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="20" y="95" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="50" y="95" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="135" y="95" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="165" y="95" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="20" y="115" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="75" y="115" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="95" y="115" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="140" y="115" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="75" y="140" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="105" y="140" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="135" y="140" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="165" y="140" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="75" y="165" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="95" y="165" width="12" height="12" rx="2" fill="#6C4C59" />
                <rect x="145" y="165" width="12" height="12" rx="2" fill="#6C4C59" />

                {/* Center Heart Emblem */}
                <rect x="80" y="80" width="40" height="40" rx="8" fill="#FFF0F5" />
                <path d="M100 106s-10-6.5-10-13a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 6.5-10 13-10 13z" fill="#E65A84" />
              </svg>

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
                }}
              >
                <ShieldCheck size={14} color="#E65A84" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#6C4C59' }}>Secure Pay</span>
              </div>
            </div>

            {/* Total Due Amount (Borderless) */}
            <div
              style={{
                backgroundColor: '#FFF7FA',
                borderRadius: '20px',
                border: 'none',
                padding: '12px 24px',
                width: '100%',
                maxWidth: '440px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(108, 76, 89, 0.05)',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#7A5B69' }}>Total Amount Due:</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#6C4C59' }}>{currentLayout.price}</span>
            </div>

            {/* Tap to Simulate Scan & Pay (Borderless) */}
            <button
              onClick={handleSimulateQRPay}
              style={{
                width: '100%',
                maxWidth: '440px',
                padding: '16px 24px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '28px',
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 24px rgba(108, 76, 89, 0.35)',
                transition: 'background-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#583D48')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C4C59')}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Sparkles size={20} />
              <span>Simulate Scan & Confirm Pay</span>
            </button>
          </div>
        ) : (
          /* ======================================================== */
          /* WINDOW 3: SEPARATE TICKET KEYPAD (Occupies Top & Bottom) */
          /* ======================================================== */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '32px',
              border: 'none',
              padding: '24px 32px',
              boxShadow: '0 20px 48px rgba(108, 76, 89, 0.14)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Ticket Code Slots Display (Borderless) */}
            <div
              ref={ticketInputRef}
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#4A323E', marginBottom: '8px' }}>
                Enter Ticket Voucher Code
              </div>

              {/* 6-Digit PIN Boxes (Borderless) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '4px',
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const char = ticketCode[idx] || '';
                  const isActive = ticketCode.length === idx;

                  return (
                    <div
                      key={idx}
                      style={{
                        width: '48px',
                        height: '54px',
                        borderRadius: '14px',
                        backgroundColor: char ? '#FFF0F5' : '#FAF8FB',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 800,
                        color: '#4A323E',
                        fontFamily: 'var(--font-mono)',
                        boxShadow: isActive
                          ? '0 0 0 3px #6C4C59'
                          : char
                          ? '0 3px 10px rgba(108, 76, 89, 0.12)'
                          : 'inset 0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>

              {errorMsg ? (
                <div style={{ fontSize: '12px', color: '#D32F2F', fontWeight: 700, marginTop: '2px' }}>
                  {errorMsg}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#8E7380', marginTop: '2px' }}>
                  Type your 6-digit voucher code using keypad below
                </div>
              )}
            </div>

            {/* ON-SCREEN KEYPAD (3x4 Grid, Borderless) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                width: '100%',
                maxWidth: '360px',
                margin: 'auto 0',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  style={{
                    height: '52px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: '#FFF8FA',
                    color: '#4A323E',
                    fontSize: '22px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 8px rgba(108, 76, 89, 0.08)',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFEAF2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFF8FA')}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.92)';
                    e.currentTarget.style.backgroundColor = '#F5CAD7';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#FFEAF2';
                  }}
                >
                  {digit}
                </button>
              ))}

              {/* Clear Button */}
              <button
                onClick={handleClear}
                title="Clear All"
                style={{
                  height: '52px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: '#FFF0F5',
                  color: '#8E7380',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: '0 3px 8px rgba(108, 76, 89, 0.06)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFE1EB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F5')}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <RotateCcw size={15} />
                <span>Clear</span>
              </button>

              {/* Zero */}
              <button
                onClick={() => handleKeyPress('0')}
                style={{
                  height: '52px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: '#FFF8FA',
                  color: '#4A323E',
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 8px rgba(108, 76, 89, 0.08)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFEAF2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFF8FA')}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.92)';
                  e.currentTarget.style.backgroundColor = '#F5CAD7';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#FFEAF2';
                }}
              >
                0
              </button>

              {/* Delete / Backspace */}
              <button
                onClick={handleDelete}
                title="Backspace"
                style={{
                  height: '52px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: '#FFF0F5',
                  color: '#8E7380',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 8px rgba(108, 76, 89, 0.06)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFE1EB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F5')}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Delete size={22} />
              </button>
            </div>

            {/* Redeem Ticket Button (Borderless) */}
            <button
              onClick={handleRedeemTicket}
              style={{
                width: '100%',
                maxWidth: '360px',
                padding: '15px 24px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '28px',
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 24px rgba(108, 76, 89, 0.35)',
                transition: 'background-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#583D48')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C4C59')}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Ticket size={20} />
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
