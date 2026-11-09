export type LayoutMode = '1-shot' | '3-shot-strip' | '4-shot-strip' | '4-shot-grid';

export interface LayoutConfig {
  id: LayoutMode;
  name: string;
  nameEn: string;
  shotsCount: number;
  width: number;
  height: number;
  description: string;
  icon: string;
}

export interface PhotoShot {
  id: string;
  dataUrl: string;
  index: number;
}

export interface BackgroundTone {
  id: string;
  name: string;
  category: 'night' | 'gold' | 'festive' | 'pastel';
  type: 'solid' | 'gradient';
  colors: string[];
  description: string;
  textColor: string;
}

export interface FrameDefinition {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  themeColor: string;
  textColor: string;
  accentColor: string;
  drawFrame: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    layout: LayoutMode,
    photoRects: { x: number; y: number; width: number; height: number }[],
    accentColor: string
  ) => void;
}

export interface StickerDefinition {
  id: string;
  name: string;
  category: 'krathong' | 'lantern' | 'light' | 'thai' | 'text' | 'decor';
  svgString: string;
}

export interface PlacedSticker {
  instanceId: string;
  stickerId: string;
  x: number; // percentage of canvas width (0-100)
  y: number; // percentage of canvas height (0-100)
  scale: number; // scale multiplier, default 1
  rotation: number; // in degrees
}

export interface PlacedText {
  id: string;
  text: string;
  x: number; // percentage of canvas width (0-100)
  y: number; // percentage of canvas height (0-100)
  color: string;
  fontSize: number;
  fontFamily: 'Kanit' | 'Charm' | 'Sarabun';
  strokeColor: string;
  hasShadow: boolean;
  fontWeight: 'normal' | 'bold';
}
