import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import confetti from 'canvas-confetti';
import { Camera, RefreshCw, Printer, ArrowLeft } from 'lucide-react';
import type { LayoutId } from '../types';
import { playCutePop, playPaperSwoosh, playChime } from '../utils/sound';

interface CameraScreenProps {
  layout: LayoutId;
  onBack: () => void;
  onHome: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ layout, onBack, onHome }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<'thermal' | 'pink' | 'vintage' | 'natural'>('thermal');
  const [isPrinted, setIsPrinted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printedReceiptRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  const shotCounts: Record<LayoutId, number> = {
    single: 1,
    duo: 2,
    grid4: 4,
    strip6: 6,
  };

  const totalShots = shotCounts[layout];

  // Initialize webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } catch (err) {
        console.log('Webcam not accessible, using cute animated avatar mode', err);
        setCameraActive(false);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Countdown timer logic for capturing shots
  useEffect(() => {
    let timer: number;
    if (isCountingDown) {
      if (countdown > 0) {
        playCutePop(1 + (4 - countdown) * 0.2);
        timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        // Flash & capture
        captureShot();
      }
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const startCaptureSequence = () => {
    setPhotos([]);
    setCurrentShotIndex(0);
    setIsPrinted(false);
    setCountdown(3);
    setIsCountingDown(true);
  };

  const captureShot = () => {
    // Camera Flash effect
    if (flashOverlayRef.current) {
      anime({
        targets: flashOverlayRef.current,
        opacity: [0.9, 0],
        duration: 350,
        easing: 'easeOutQuad',
      });
    }

    let photoData = '';
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror video horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg', 0.85);
      }
    } else {
      // Fallback cute SVG avatar snapshot
      photoData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23FFEAF2"/><text x="150" y="140" font-size="60" text-anchor="middle">🌸</text><text x="150" y="200" font-family="sans-serif" font-weight="bold" font-size="20" fill="%236C4C59" text-anchor="middle">Shot %23${photos.length + 1}</text></svg>`;
    }

    const nextPhotos = [...photos, photoData];
    setPhotos(nextPhotos);

    if (nextPhotos.length < totalShots) {
      setCurrentShotIndex(nextPhotos.length);
      setCountdown(3);
      setIsCountingDown(true);
    } else {
      setIsCountingDown(false);
      playChime();
    }
  };

  const handlePrintReceipt = () => {
    playPaperSwoosh();
    setIsPrinted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FF94B8', '#6C4C59', '#FFE4EE', '#FFAEC9'],
      });
    } catch {
      // Fallback
    }

    if (printedReceiptRef.current) {
      anime({
        targets: printedReceiptRef.current,
        translateY: [-100, 0],
        opacity: [0, 1],
        duration: 900,
        easing: 'easeOutBounce',
      });
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        position: 'relative',
        background: 'radial-gradient(circle at 50% 15%, #FFF2F7 0%, #FFDFEB 55%, #FAD2E2 100%)',
        overflowY: 'auto',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* White Flash overlay on snapshot */}
      <div
        ref={flashOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFFFFF',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />

      {/* Top Header Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <button
          onClick={() => {
            playCutePop(0.9);
            onBack();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#FFFFFF',
            border: '1.5px solid #F5CAD7',
            padding: '8px 14px',
            borderRadius: '20px',
            color: '#6C4C59',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(220, 130, 160, 0.15)',
          }}
        >
          <ArrowLeft size={16} /> Layouts
        </button>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#4A323E',
          }}
        >
          Photo Session
        </h2>

        <div
          style={{
            backgroundColor: '#6C4C59',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '16px',
          }}
        >
          {photos.length}/{totalShots} Shots
        </div>
      </div>

      {/* Camera Live Viewfinder or Printed Receipt */}
      {photos.length < totalShots ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            position: 'relative',
          }}
        >
          {/* Viewfinder Frame */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '320px',
              backgroundColor: '#2E1E26',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(108, 76, 89, 0.25)',
              border: '4px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
                filter:
                  filterMode === 'thermal'
                    ? 'grayscale(100%) contrast(150%)'
                    : filterMode === 'pink'
                    ? 'sepia(30%) hue-rotate(300deg) saturate(140%)'
                    : filterMode === 'vintage'
                    ? 'sepia(60%) contrast(110%)'
                    : 'none',
              }}
            />

            {/* Countdown Overlay */}
            {isCountingDown && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '92px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textShadow: '0 4px 20px rgba(230, 90, 132, 0.8)',
                  }}
                  className="animate-pulse-cute"
                >
                  {countdown > 0 ? countdown : '📸'}
                </div>
              </div>
            )}

            {/* Shot Counter Pill in Viewfinder */}
            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 14px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#6C4C59',
              }}
            >
              Pose for Shot {currentShotIndex + 1} of {totalShots} ♡
            </div>
          </div>

          {/* Filter selection buttons */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            {(['thermal', 'pink', 'vintage', 'natural'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  playCutePop(1);
                  setFilterMode(filter);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '14px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  backgroundColor: filterMode === filter ? '#6C4C59' : '#FFFFFF',
                  color: filterMode === filter ? '#FFFFFF' : '#6C4C59',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Shutter Button */}
          <div style={{ marginTop: '18px' }}>
            <button
              disabled={isCountingDown}
              onClick={startCaptureSequence}
              style={{
                padding: '14px 32px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                borderRadius: '30px',
                border: 'none',
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 700,
                cursor: isCountingDown ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(108, 76, 89, 0.35)',
              }}
            >
              <Camera size={20} />
              <span>{isCountingDown ? 'Get Ready...' : 'Start 3s Timer'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Completed Photo Session -> Receipt Thermal Strip */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            ref={printedReceiptRef}
            className="receipt-zigzag-bottom"
            style={{
              width: '260px',
              backgroundColor: '#FFFFFF',
              borderRadius: '6px 6px 0 0',
              padding: '16px 14px 24px 14px',
              boxShadow: '0 16px 36px rgba(108, 76, 89, 0.25)',
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
              maxHeight: '440px',
              overflowY: 'auto',
            }}
          >
            <div style={{ borderBottom: '1.5px dashed #C8B6C0', paddingBottom: '8px', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#4A323E' }}>
                ♡ SWEET PHOTO RECEIPT ♡
              </div>
              <div style={{ fontSize: '9px', color: '#8E7380' }}>
                LAYOUT: {layout.toUpperCase()} ({totalShots} SHOTS)
              </div>
            </div>

            {/* Photos inside Thermal Strip */}
            <div
              style={{
                display: layout === 'grid4' ? 'grid' : 'flex',
                gridTemplateColumns: layout === 'grid4' ? '1fr 1fr' : undefined,
                flexDirection: 'column',
                gap: '6px',
                marginBottom: '12px',
              }}
            >
              {photos.map((imgSrc, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#F8EFF3',
                    border: '1px solid #E5D5DE',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    height: layout === 'single' ? '160px' : layout === 'strip6' ? '50px' : '90px',
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`Shot ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter:
                        filterMode === 'thermal'
                          ? 'grayscale(100%) contrast(140%)'
                          : filterMode === 'pink'
                          ? 'sepia(40%) hue-rotate(300deg)'
                          : 'none',
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '16px',
                color: '#6C4C59',
                marginBottom: '8px',
              }}
            >
              "Thanks for making sweet memories!"
            </div>

            {/* Barcode */}
            <div className="thermal-barcode" style={{ height: '24px' }}>
              {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 1, 4, 2, 1, 3].map((w, i) => (
                <div key={i} className="thermal-barcode-line" style={{ width: `${w}px` }} />
              ))}
            </div>
            <div style={{ fontSize: '8px', color: '#8E7380', marginTop: '2px' }}>
              ✦ KEEP THIS AS A KEEPSAKE ✦
            </div>
          </div>

          {/* Print & Retake Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={startCaptureSequence}
              style={{
                padding: '12px 18px',
                backgroundColor: '#FFFFFF',
                color: '#6C4C59',
                border: '2px solid #6C4C59',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw size={16} /> Retake
            </button>

            <button
              onClick={handlePrintReceipt}
              style={{
                padding: '12px 22px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 6px 16px rgba(108, 76, 89, 0.3)',
              }}
            >
              <Printer size={16} /> {isPrinted ? 'Printed! ♡' : 'Print Receipt'}
            </button>

            <button
              onClick={onHome}
              style={{
                padding: '12px 18px',
                backgroundColor: '#FFF0F5',
                color: '#6C4C59',
                border: '1px solid #F5CAD7',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
