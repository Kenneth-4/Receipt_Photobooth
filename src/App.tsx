import React, { useState } from 'react';
import { KioskContainer } from './components/KioskContainer';
import { HomeScreen } from './components/HomeScreen';
import { LayoutSelectScreen } from './components/LayoutSelectScreen';
import { CameraScreen } from './components/CameraScreen';
import type { LayoutId, ScreenState } from './types';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>('grid4');

  const handleStartFromReceipt = () => {
    setScreen('layout-select');
  };

  const handleBackToHome = () => {
    setScreen('home');
  };

  const handleProceedToCamera = (layout: LayoutId) => {
    setSelectedLayout(layout);
    setScreen('camera');
  };

  const handleBackToLayouts = () => {
    setScreen('layout-select');
  };

  return (
    <KioskContainer>
      {screen === 'home' && <HomeScreen onStart={handleStartFromReceipt} />}

      {screen === 'layout-select' && (
        <LayoutSelectScreen
          onBackToHome={handleBackToHome}
          onProceedToCamera={handleProceedToCamera}
        />
      )}

      {screen === 'camera' && (
        <CameraScreen
          layout={selectedLayout}
          onBack={handleBackToLayouts}
          onHome={handleBackToHome}
        />
      )}
    </KioskContainer>
  );
};

export default App;
