import React, { useEffect, useState } from 'react';
import { Download, Heart, ArrowLeft } from 'lucide-react';

export const DownloadScreen: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('photobooth_download_photo') || '';
    setPhotoUrl(saved);
  }, []);

  const handleDownload = () => {
    if (!photoUrl) return;
    const a = document.createElement('a');
    a.href = photoUrl;
    a.download = `photobooth-polaroid-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
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
