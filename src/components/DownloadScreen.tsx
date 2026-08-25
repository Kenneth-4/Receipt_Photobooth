import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import { Download, Heart, ArrowLeft } from 'lucide-react';
import {
  HelloKittyIcon,
  CuteBowIcon,
  CuteStrawberryIcon,
  CuteFlowerIcon,
  CuteSparkle,
} from './KawaiiIcons';

export const DownloadScreen: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const stickersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const remote = params.get('photo');
    if (remote) {
      setPhotoUrl(decodeURIComponent(remote));
    } else {
      const saved = localStorage.getItem('photobooth_download_photo') || '';
      setPhotoUrl(saved);
    }

    if (stickersRef.current) {
      anime({
        targets: stickersRef.current.querySelectorAll('.float-kawaii-dl'),
        translateY: () => anime.random(-14, 14),
        translateX: () => anime.random(-10, 10),
        rotate: () => anime.random(-12, 12),
        scale: [0.92, 1.1],
        delay: anime.stagger(150),
        duration: 3300,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad',
      });
    }
  }, []);

  const handleDownload = async () => {
    if (!photoUrl) return;
    try {
      if (photoUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = photoUrl;
        a.download = `sweet-memories-polaroid-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const res = await fetch(photoUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `sweet-memories-polaroid-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
    } catch {
      window.open(photoUrl, '_blank');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at 50% 20%, #FFF5F8 0%, #FFDEE9 55%, #F8CADC 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Floating Kawaii Stickers (Download Screen unique arrangement) */}
      <div ref={stickersRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* Top Left: Hello Kitty Face */}
        <div className="float-kawaii-dl" style={{ position: 'absolute', top: '6%', left: '7%', filter: 'drop-shadow(0 4px 12px rgba(230, 90, 132, 0.25))' }}>
          <HelloKittyIcon size={46} />
        </div>

        {/* Top Right: Cute Ribbon Bow */}
        <div className="float-kawaii-dl" style={{ position: 'absolute', top: '7%', right: '8%', filter: 'drop-shadow(0 4px 10px rgba(255, 82, 123, 0.3))' }}>
          <CuteBowIcon size={38} color="#FF4B72" />
        </div>

        {/* Bottom Left: Kawaii Strawberry */}
        <div className="float-kawaii-dl" style={{ position: 'absolute', bottom: '6%', left: '7%', filter: 'drop-shadow(0 4px 10px rgba(255, 77, 109, 0.28))' }}>
          <CuteStrawberryIcon size={34} />
        </div>

        {/* Bottom Right: Cute Blossom Flower */}
        <div className="float-kawaii-dl" style={{ position: 'absolute', bottom: '6%', right: '7%', filter: 'drop-shadow(0 4px 10px rgba(255, 179, 198, 0.3))' }}>
          <CuteFlowerIcon size={36} color="#FFAEC9" />
        </div>

        {/* Sparkles */}
        <CuteSparkle className="float-kawaii-dl" size={22} color="#FF94B8" style={{ position: 'absolute', top: '35%', left: '6%' }} />
        <CuteSparkle className="float-kawaii-dl" size={20} color="#FFA8C5" style={{ position: 'absolute', top: '40%', right: '6%' }} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={20} color="#E65A84" fill="#E65A84" />
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: 700,
              color: '#4A323E',
              margin: 0,
            }}
          >
            Your Soft Copy is Ready!
          </h1>
          <Heart size={20} color="#E65A84" fill="#E65A84" />
        </div>

        <p style={{ fontSize: '14px', color: '#7E6673', margin: 0 }}>
          Tap the download button below or long-press the image to save your Polaroid copy.
        </p>

        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Photobooth Polaroid"
            style={{
              maxWidth: '92vw',
              maxHeight: '65vh',
              borderRadius: '0px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(108, 76, 89, 0.28), 0 4px 16px rgba(0,0,0,0.08)',
            }}
          />
        ) : (
          <div
            style={{
              padding: '40px 24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              color: '#7E6673',
              boxShadow: '0 8px 24px rgba(108, 76, 89, 0.12)',
            }}
          >
            No active photo found. Please complete a photobooth session to view your photo.
          </div>
        )}

        {photoUrl && (
          <button
            onClick={handleDownload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              backgroundColor: '#6C4C59',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '30px',
              fontSize: '17px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 24px rgba(108, 76, 89, 0.35)',
              transition: 'transform 0.15s, background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#583D48';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6C4C59';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Download size={20} />
            <span>Download High-Res Polaroid</span>
          </button>
        )}

        <button
          onClick={() => {
            window.location.href = window.location.origin + window.location.pathname;
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: '#6C4C59',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Photobooth</span>
        </button>
      </div>
    </div>
  );
};
