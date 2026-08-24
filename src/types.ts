export type LayoutId = 'single' | 'duo' | 'grid4' | 'strip6';

export interface LayoutOption {
  id: LayoutId;
  title: string;
  badge: string;
  shotsCount: number;
  description: string;
  aspect: string;
}

export type ScreenState = 'home' | 'layout-select' | 'payment' | 'camera';
