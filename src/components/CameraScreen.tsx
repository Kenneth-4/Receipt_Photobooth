import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { Camera, Printer, ArrowLeft, ExternalLink } from 'lucide-react';
import type { LayoutId } from '../types';
import { playCutePop, playPaperSwoosh, playChime } from '../utils/sound';
import {
  HelloKittyIcon,
  CuteBowIcon,
  CuteStrawberryIcon,
  CuteFlowerIcon,
  CuteSparkle,
} from './KawaiiIcons';

interface CameraScreenProps {
  layout: LayoutId;
  onBack: () => void;
  onHome: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ layout, onBack, onHome }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<'thermal' | 'pink' | 'vintage' | 'natural'>('thermal');
  const [isPrinted, setIsPrinted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [softCopyUrl, setSoftCopyUrl] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printedReceiptRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating Kawaii Stickers animation for Camera screen
    if (stickersRef.current) {
      anime({
        targets: stickersRef.current.querySelectorAll('.float-kawaii-camera'),
        translateY: () => anime.random(-14, 14),
        translateX: () => anime.random(-10, 10),
        rotate: () => anime.random(-10, 10),
        scale: [0.92, 1.1],
        delay: anime.stagger(150),
        duration: 3300,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad',
      });
    }
  }, []);

  const shotCounts: Record<LayoutId, number> = {
    single: 1,
    duo: 2,
    grid4: 4,
    strip6: 6,
  };

  const totalShots = shotCounts[layout];

  // Helper to generate full-resolution composite Polaroid image
  const generatePolaroidDataUrl = (
    photosList: string[],
    targetLayout: LayoutId
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const scale = 2;
      let cardW = 520 * scale;
      let cardH = 640 * scale;

      if (targetLayout === 'strip6') {
        cardW = 340 * scale;
        cardH = 880 * scale;
      } else if (targetLayout === 'duo') {
        cardW = 420 * scale;
        cardH = 680 * scale;
      }

      canvas.width = cardW;
      canvas.height = cardH;

      // White Polaroid Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cardW, cardH);

      const padX = 24 * scale;
      const padTop = 24 * scale;
      const bottomChin = 110 * scale;
      const contentW = cardW - padX * 2;
      const contentH = cardH - padTop - bottomChin;

      let loaded = 0;
      const imgEls: HTMLImageElement[] = [];

      const renderCanvasContent = () => {
        if (targetLayout === 'single' && imgEls[0]) {
          ctx.drawImage(imgEls[0], padX, padTop, contentW, contentH);
        } else if (targetLayout === 'duo') {
          const gap = 10 * scale;
          const slotH = (contentH - gap) / 2;
          imgEls.forEach((img, i) => {
            ctx.drawImage(img, padX, padTop + i * (slotH + gap), contentW, slotH);
          });
        } else if (targetLayout === 'grid4') {
          const gap = 10 * scale;
          const slotW = (contentW - gap) / 2;
          const slotH = (contentH - gap) / 2;
          const coords = [
            { x: padX, y: padTop },
            { x: padX + slotW + gap, y: padTop },
            { x: padX, y: padTop + slotH + gap },
            { x: padX + slotW + gap, y: padTop + slotH + gap },
          ];
          imgEls.forEach((img, i) => {
            if (coords[i]) {
              ctx.drawImage(img, coords[i].x, coords[i].y, slotW, slotH);
            }
          });
        } else if (targetLayout === 'strip6') {
          const gap = 6 * scale;
          const slotH = (contentH - gap * 5) / 6;
          imgEls.forEach((img, i) => {
            ctx.drawImage(img, padX, padTop + i * (slotH + gap), contentW, slotH);
          });
        }

        // Handwritten Cursive Caption
        ctx.fillStyle = '#4A323E';
        ctx.textAlign = 'center';
        ctx.font = `bold ${34 * scale}px Caveat, cursive, Georgia, serif`;
        ctx.fillText('sweet memories ♡', cardW / 2, cardH - 52 * scale);

        // Date Stamp
        ctx.fillStyle = '#9C7E8D';
        ctx.font = `${13 * scale}px Space Mono, monospace, sans-serif`;
        const dateStr = `PHOTOBOOTH • ${new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase()}`;
        ctx.fillText(dateStr, cardW / 2, cardH - 24 * scale);

        resolve(canvas.toDataURL('image/png', 0.95));
      };

      if (photosList.length === 0) {
        renderCanvasContent();
        return;
      }

      photosList.forEach((src) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          loaded++;
          if (loaded === photosList.length) renderCanvasContent();
        };
        img.onerror = () => {
          loaded++;
          if (loaded === photosList.length) renderCanvasContent();
        };
        img.src = src;
        imgEls.push(img);
      });
    });
  };

  // Generate soft copy URL and actual scannable QR Code when photo sequence finishes
  useEffect(() => {
    if (photos.length === totalShots && totalShots > 0) {
      generatePolaroidDataUrl(photos, layout).then(async (dataUrl) => {
        setSoftCopyUrl(dataUrl);

        try {
          localStorage.setItem('photobooth_download_photo', dataUrl);
        } catch {
          // localStorage fallback
        }

        const downloadUrl = `${window.location.origin}${window.location.pathname}?download=true`;

        try {
          const qr = await QRCode.toDataURL(downloadUrl, {
            width: 260,
            margin: 1,
            color: {
              dark: '#4A323E',
              light: '#FFFFFF',
            },
          });
          setQrCodeDataUrl(qr);
        } catch (err) {
          console.error('Failed to generate actual QR code', err);
        }
      });
    }
  }, [photos, totalShots, layout]);

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

  // Countdown timer logic for capturing shots (5-second countdown)
  useEffect(() => {
    let timer: number;
    if (isCountingDown) {
      if (countdown > 0) {
        playCutePop(1 + (6 - countdown) * 0.15);
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
    setCountdown(5);
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
      setCountdown(5);
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
        translateY: [-60, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutBounce',
      });
    }
  };

  // Open soft copy in a new tab ready for download
  const handleOpenSoftCopyTab = async () => {
    playCutePop(1.1);
    const dataUrl = softCopyUrl || (await generatePolaroidDataUrl(photos, layout));

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>♡ Your Photobooth Polaroid Soft Copy ♡</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: radial-gradient(circle at 50% 20%, #FFF5F8 0%, #FFDEE9 55%, #F8CADC 100%);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 16px;
    }
    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      text-align: center;
    }
    img {
      max-width: 92vw;
      max-height: 72vh;
      box-shadow: 0 24px 60px rgba(108, 76, 89, 0.28), 0 4px 16px rgba(0,0,0,0.08);
      background: #FFFFFF;
    }
    h1 {
      color: #4A323E;
      font-size: 24px;
      font-weight: 800;
    }
    p {
      color: #7E6673;
      font-size: 14px;
      margin-top: -16px;
    }
    .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 36px;
      background-color: #6C4C59;
      color: #FFFFFF;
      text-decoration: none;
      font-size: 17px;
      font-weight: 700;
      border-radius: 30px;
      box-shadow: 0 10px 24px rgba(108, 76, 89, 0.35);
      transition: transform 0.15s, background-color 0.2s;
    }
    .btn-download:hover {
      background-color: #583D48;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>♡ Your Polaroid Soft Copy is Ready! ♡</h1>
    <p>Right-click or tap download button below to save your high-res copy</p>
    <img src="${dataUrl}" alt="Photobooth Polaroid" />
    <a href="${dataUrl}" download="sweet-memories-polaroid.png" class="btn-download">
      📥 Download Polaroid Soft Copy
    </a>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Floating Kawaii Stickers (Camera Screen unique arrangement) */}
      <div ref={stickersRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* Top Left: Cute Strawberry */}
        <div className="float-kawaii-camera" style={{ position: 'absolute', top: '4%', left: '7%', filter: 'drop-shadow(0 4px 10px rgba(255, 77, 109, 0.28))' }}>
          <CuteStrawberryIcon size={34} />
        </div>

        {/* Top Right: Cute Blossom Flower */}
        <div className="float-kawaii-camera" style={{ position: 'absolute', top: '4%', right: '7%', filter: 'drop-shadow(0 4px 10px rgba(255, 179, 198, 0.3))' }}>
          <CuteFlowerIcon size={36} color="#FFAEC9" />
        </div>

        {/* Mid Left: Cute Ribbon Bow */}
        <div className="float-kawaii-camera" style={{ position: 'absolute', top: '50%', left: '2%', filter: 'drop-shadow(0 4px 10px rgba(255, 82, 123, 0.3))' }}>
          <CuteBowIcon size={38} color="#FF4081" />
        </div>

        {/* Mid Right: Hello Kitty Face */}
        <div className="float-kawaii-camera" style={{ position: 'absolute', top: '48%', right: '2%', filter: 'drop-shadow(0 4px 12px rgba(230, 90, 132, 0.25))' }}>
          <HelloKittyIcon size={46} />
        </div>

        {/* Bottom Left: Hello Kitty Face */}
        <div className="float-kawaii-camera" style={{ position: 'absolute', bottom: '4%', left: '5%', filter: 'drop-shadow(0 4px 12px rgba(230, 90, 132, 0.25))' }}>
          <HelloKittyIcon size={40} />
        </div>

        {/* Bottom Right: Cute Strawberry */}
        <div className="float-kawaii-camera" style={{ position: 'absolute', bottom: '5%', right: '5%', filter: 'drop-shadow(0 4px 10px rgba(255, 77, 109, 0.28))' }}>
          <CuteStrawberryIcon size={30} />
        </div>

        {/* Sparkles */}
        <CuteSparkle className="float-kawaii-camera" size={20} color="#FFA8C5" style={{ position: 'absolute', top: '18%', right: '15%' }} />
        <CuteSparkle className="float-kawaii-camera" size={22} color="#FF7096" style={{ position: 'absolute', bottom: '20%', left: '12%' }} />
      </div>

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
          marginBottom: '8px',
          zIndex: 2,
        }}
      >
        <button
          onClick={() => {
            playCutePop(0.9);
            onBack();
          }}
          title="Back to Payment"
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            color: '#6C4C59',
            cursor: 'pointer',
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
          <ArrowLeft size={20} strokeWidth={2.2} />
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
            padding: '6px 14px',
            borderRadius: '16px',
          }}
        >
          {photos.length}/{totalShots} Shots
        </div>
      </div>

      {/* Camera Live Viewfinder or Polaroid Picture */}
      {photos.length < totalShots ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Viewfinder Frame (Enlarged, Zero Border Radius, Polaroid-style Frame) */}
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '420px',
              backgroundColor: '#2E1E26',
              borderRadius: '0px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(108, 76, 89, 0.28)',
              border: '10px solid #FFFFFF',
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
                borderRadius: '0px',
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
                  borderRadius: '0px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '110px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textShadow: '0 6px 24px rgba(230, 90, 132, 0.9)',
                  }}
                  className="animate-pulse-cute"
                >
                  {countdown > 0 ? countdown : '📸'}
                </div>
              </div>
            )}

            {/* Shot Counter in Viewfinder */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '6px 18px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#6C4C59',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              Pose for Shot {currentShotIndex + 1} of {totalShots} ♡
            </div>
          </div>

          {/* Filter selection buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
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
                  padding: '7px 16px',
                  borderRadius: '18px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  backgroundColor: filterMode === filter ? '#6C4C59' : '#FFFFFF',
                  color: filterMode === filter ? '#FFFFFF' : '#6C4C59',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.15s ease',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Shutter Button (Camera Icon Only, Cute Rounded Button) */}
          <div style={{ marginTop: '16px' }}>
            <button
              disabled={isCountingDown}
              onClick={startCaptureSequence}
              title="Take Photo (5s Timer)"
              style={{
                width: '74px',
                height: '74px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                borderRadius: '50%',
                border: 'none',
                cursor: isCountingDown ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px rgba(108, 76, 89, 0.35)',
                transition: 'background-color 0.2s, transform 0.15s',
                opacity: isCountingDown ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isCountingDown) e.currentTarget.style.backgroundColor = '#583D48';
              }}
              onMouseLeave={(e) => {
                if (!isCountingDown) e.currentTarget.style.backgroundColor = '#6C4C59';
              }}
              onMouseDown={(e) => {
                if (!isCountingDown) e.currentTarget.style.transform = 'scale(0.92)';
              }}
              onMouseUp={(e) => {
                if (!isCountingDown) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Camera size={34} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      ) : (
        /* Completed Photo Session -> Enlarged Polaroid + Soft Copy QR Window */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {/* Main Showcase Container (Side by Side or Centered) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              maxWidth: '860px',
              width: '100%',
            }}
          >
            {/* 1. ENLARGED POLAROID PICTURE FRAME */}
            <div
              ref={printedReceiptRef}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '0px',
                boxShadow: '0 24px 60px rgba(108, 76, 89, 0.25), 0 4px 16px rgba(0,0,0,0.08)',
                padding: layout === 'strip6' ? '16px 16px 36px 16px' : '20px 20px 48px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width:
                  layout === 'single'
                    ? '380px'
                    : layout === 'duo'
                    ? '320px'
                    : layout === 'grid4'
                    ? '420px'
                    : '260px',
                maxHeight: '520px',
                overflowY: 'auto',
              }}
            >
              {/* Photos inside Polaroid Frame */}
              <div
                style={{
                  display: layout === 'grid4' ? 'grid' : 'flex',
                  gridTemplateColumns: layout === 'grid4' ? '1fr 1fr' : undefined,
                  flexDirection: 'column',
                  gap: layout === 'grid4' ? '8px' : '6px',
                  width: '100%',
                }}
              >
                {photos.map((imgSrc, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#F8EFF3',
                      borderRadius: '0px',
                      overflow: 'hidden',
                      height:
                        layout === 'single'
                          ? '340px'
                          : layout === 'duo'
                          ? '160px'
                          : layout === 'grid4'
                          ? '180px'
                          : '72px',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Shot ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '0px',
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

              {/* Polaroid Bottom Chin (Handwritten Note & Date) */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: '26px',
                    fontWeight: 700,
                    color: '#4A323E',
                    letterSpacing: '0.5px',
                    lineHeight: 1.1,
                  }}
                >
                  sweet memories ♡
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#9C7E8D',
                    letterSpacing: '1px',
                    marginTop: '4px',
                  }}
                >
                  PHOTOBOOTH • {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* 2. DIGITAL SOFT COPY QR CODE CARD */}
            <div
              onClick={handleOpenSoftCopyTab}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '22px 20px',
                boxShadow: '0 16px 40px rgba(108, 76, 89, 0.14)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '230px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(108, 76, 89, 0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(108, 76, 89, 0.14)';
              }}
            >
              {/* Badge */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  backgroundColor: '#FFE4EE',
                  color: '#6C4C59',
                  letterSpacing: '0.4px',
                  marginBottom: '10px',
                }}
              >
                SOFT COPY
              </span>

              {/* Actual Generated QR Code Graphic */}
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#FFF9FB',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(108, 76, 89, 0.08)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '136px',
                  height: '136px',
                }}
              >
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Soft Copy Scannable QR Code"
                    style={{
                      width: '136px',
                      height: '136px',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '11px', color: '#8E7380' }}>Generating QR...</div>
                )}
              </div>

              <div style={{ fontSize: '13px', fontWeight: 800, color: '#4A323E', marginBottom: '2px' }}>
                Scan for Soft Copy
              </div>
              <p style={{ fontSize: '11px', color: '#8E7380', margin: 0, lineHeight: 1.3 }}>
                Scan with phone camera or tap to open in new tab
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#FFF0F5',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#6C4C59',
                }}
              >
                <ExternalLink size={13} />
                <span>Open in New Tab</span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Print Polaroid & Finish) */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '18px' }}>
            <button
              onClick={handlePrintReceipt}
              style={{
                padding: '14px 28px',
                backgroundColor: '#6C4C59',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '28px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 22px rgba(108, 76, 89, 0.35)',
                transition: 'background-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#583D48')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6C4C59')}
            >
              <Printer size={18} />
              <span>{isPrinted ? 'Printed! ♡' : 'Print Polaroid'}</span>
            </button>

            <button
              onClick={onHome}
              style={{
                padding: '14px 28px',
                backgroundColor: '#FFF0F5',
                color: '#6C4C59',
                border: 'none',
                borderRadius: '28px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(108, 76, 89, 0.1)',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFE1EB')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFF0F5')}
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
