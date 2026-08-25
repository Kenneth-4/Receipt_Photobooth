import React from 'react';

// Signature Hello Kitty Head with Bow & Whiskers
export const HelloKittyIcon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 48,
  className,
  style,
}) => (
  <svg
    width={size}
    height={(size * 42) / 48}
    viewBox="0 0 48 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Cat Face Base */}
    <ellipse cx="24" cy="24" rx="20" ry="15" fill="#FFFFFF" stroke="#4A323E" strokeWidth="2.5" />

    {/* Left Ear */}
    <path
      d="M8 17 L12 6 C13 4 16 5 17 8 L18 13"
      fill="#FFFFFF"
      stroke="#4A323E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Right Ear */}
    <path
      d="M31 13 L32 8 C33 5 36 4 37 6 L41 17"
      fill="#FFFFFF"
      stroke="#4A323E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Left Whiskers */}
    <path d="M4 22 L11 23" stroke="#4A323E" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 26 L12 26" stroke="#4A323E" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 30 L11 29" stroke="#4A323E" strokeWidth="2" strokeLinecap="round" />

    {/* Right Whiskers */}
    <path d="M37 23 L44 22" stroke="#4A323E" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 26 L45 26" stroke="#4A323E" strokeWidth="2" strokeLinecap="round" />
    <path d="M37 29 L44 30" stroke="#4A323E" strokeWidth="2" strokeLinecap="round" />

    {/* Eyes */}
    <ellipse cx="17" cy="24" rx="1.8" ry="2.6" fill="#4A323E" />
    <ellipse cx="31" cy="24" rx="1.8" ry="2.6" fill="#4A323E" />

    {/* Yellow Button Nose */}
    <ellipse cx="24" cy="27.5" rx="2.4" ry="1.8" fill="#FFDC48" stroke="#4A323E" strokeWidth="1.2" />

    {/* Iconic Red/Pink Bow on Left Ear */}
    <g transform="translate(4, 3) scale(0.65)">
      {/* Bow Left Loop */}
      <path
        d="M12 14 C6 8, 4 18, 12 18 Z"
        fill="#FF4B72"
        stroke="#4A323E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Bow Right Loop */}
      <path
        d="M20 14 C26 8, 28 18, 20 18 Z"
        fill="#FF4B72"
        stroke="#4A323E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Bow Center Knot */}
      <circle cx="16" cy="15" r="4.2" fill="#FF7096" stroke="#4A323E" strokeWidth="2.5" />
      <circle cx="15" cy="14" r="1.2" fill="#FFFFFF" opacity="0.8" />
    </g>
  </svg>
);

// Cute Ribbon Bow Icon
export const CuteBowIcon: React.FC<{ size?: number; color?: string; className?: string; style?: React.CSSProperties }> = ({
  size = 32,
  color = '#FF527B',
  className,
  style,
}) => (
  <svg
    width={size}
    height={(size * 26) / 32}
    viewBox="0 0 32 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Left loop */}
    <path
      d="M14 11 C6 3, 2 17, 13 16 Z"
      fill={color}
      stroke="#4A323E"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M7 9 C5 12, 7 14, 11 13" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

    {/* Right loop */}
    <path
      d="M18 11 C26 3, 30 17, 19 16 Z"
      fill={color}
      stroke="#4A323E"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M25 9 C27 12, 25 14, 21 13" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

    {/* Left ribbon tail */}
    <path
      d="M12 16 L8 24 L13 22 L15 17"
      fill={color}
      stroke="#4A323E"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Right ribbon tail */}
    <path
      d="M20 16 L24 24 L19 22 L17 17"
      fill={color}
      stroke="#4A323E"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Center knot */}
    <ellipse cx="16" cy="13" rx="3.6" ry="3.2" fill="#FF8CA9" stroke="#4A323E" strokeWidth="2" />
    <circle cx="15.2" cy="12.2" r="0.9" fill="#FFFFFF" />
  </svg>
);

// Cute Strawberry Icon
export const CuteStrawberryIcon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 28,
  className,
  style,
}) => (
  <svg
    width={size}
    height={(size * 32) / 28}
    viewBox="0 0 28 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Strawberry Body */}
    <path
      d="M14 30 C7 25, 3 18, 4 11 C5 7, 9 6, 14 7 C19 6, 23 7, 24 11 C25 18, 21 25, 14 30 Z"
      fill="#FF4D6D"
      stroke="#4A323E"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Seeds */}
    <circle cx="10" cy="14" r="0.9" fill="#FFF3B0" />
    <circle cx="18" cy="14" r="0.9" fill="#FFF3B0" />
    <circle cx="14" cy="18" r="0.9" fill="#FFF3B0" />
    <circle cx="9" cy="21" r="0.9" fill="#FFF3B0" />
    <circle cx="19" cy="21" r="0.9" fill="#FFF3B0" />
    <circle cx="14" cy="25" r="0.9" fill="#FFF3B0" />

    {/* Leaves */}
    <path
      d="M14 7 C12 3, 7 3, 6 6 C9 8, 12 7, 14 7 Z"
      fill="#68D391"
      stroke="#4A323E"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 7 C16 3, 21 3, 22 6 C19 8, 16 7, 14 7 Z"
      fill="#68D391"
      stroke="#4A323E"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 7 C14 2, 16 1, 14 0"
      stroke="#4A323E"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Cute Japanese Anime Sparkle
export const CuteSparkle: React.FC<{ size?: number; color?: string; className?: string; style?: React.CSSProperties }> = ({
  size = 24,
  color = '#FFA8C5',
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M12 0 C12 7, 17 12, 24 12 C17 12, 12 17, 12 24 C12 17, 7 12, 0 12 C7 12, 12 7, 12 0 Z"
      fill={color}
    />
    <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
  </svg>
);

// Cute Flower Blossom
export const CuteFlowerIcon: React.FC<{ size?: number; color?: string; className?: string; style?: React.CSSProperties }> = ({
  size = 26,
  color = '#FFB3C6',
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* 5 Petals */}
    <circle cx="13" cy="6" r="4.5" fill={color} stroke="#4A323E" strokeWidth="1.5" />
    <circle cx="19.5" cy="10.5" r="4.5" fill={color} stroke="#4A323E" strokeWidth="1.5" />
    <circle cx="17" cy="18" r="4.5" fill={color} stroke="#4A323E" strokeWidth="1.5" />
    <circle cx="9" cy="18" r="4.5" fill={color} stroke="#4A323E" strokeWidth="1.5" />
    <circle cx="6.5" cy="10.5" r="4.5" fill={color} stroke="#4A323E" strokeWidth="1.5" />

    {/* Center */}
    <circle cx="13" cy="13" r="3.8" fill="#FFF085" stroke="#4A323E" strokeWidth="1.5" />
  </svg>
);
