import React from 'react';

interface KioskContainerProps {
  children: React.ReactNode;
}

export const KioskContainer: React.FC<KioskContainerProps> = ({ children }) => {
  return (
    <>
      <div className="kiosk-ambient-bg" />
      <main className="kiosk-viewport" role="main">
        {children}
      </main>
    </>
  );
};
