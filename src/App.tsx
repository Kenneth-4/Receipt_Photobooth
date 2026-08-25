import React, { useState } from 'react';
import { KioskContainer } from './components/KioskContainer';
import { HomeScreen } from './components/HomeScreen';
import { LayoutSelectScreen } from './components/LayoutSelectScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { CameraScreen } from './components/CameraScreen';
import { DownloadScreen } from './components/DownloadScreen';
import type { LayoutId, ScreenState } from './types';

export const App: React.FC = () => {
  const isDownloadRoute = typeof window !== 'undefined' && window.location.search.includes('download=true');
  const [screen, setScreen] = useState<ScreenState>('home');
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>('grid4');

  if (isDownloadRoute) {
    return <DownloadScreen />;
  }

  const handleStartFromReceipt = () => {
    setScreen('layout-select');
  };

  const handleBackToHome = () => {
    setScreen('home');
  };

  const handleProceedToPayment = (layout: LayoutId) => {
    setSelectedLayout(layout);
    setScreen('payment');
  };

  const handleBackToLayouts = () => {
    setScreen('layout-select');
  };

  const handlePaymentSuccess = () => {
    setScreen('camera');
  };

  const handleBackToPayment = () => {
    setScreen('payment');
  };

  return (
    <KioskContainer>
      {screen === 'home' && <HomeScreen onStart={handleStartFromReceipt} />}

      {screen === 'layout-select' && (
        <LayoutSelectScreen
          onBackToHome={handleBackToHome}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {screen === 'payment' && (
        <PaymentScreen
          selectedLayout={selectedLayout}
          onBack={handleBackToLayouts}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {screen === 'camera' && (
        <CameraScreen
          layout={selectedLayout}
          onBack={handleBackToPayment}
          onHome={handleBackToHome}
        />
      )}
    </KioskContainer>
  );
};

export default App;
