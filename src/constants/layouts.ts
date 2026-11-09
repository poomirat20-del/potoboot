import { LayoutConfig, LayoutMode } from '../types';

export const LAYOUTS: LayoutConfig[] = [
  {
    id: '1-shot',
    name: 'ภาพเดี่ยว (1 ช็อต)',
    nameEn: 'Single Portrait',
    shotsCount: 1,
    width: 900,
    height: 1200,
    description: 'ภาพเดี่ยวขนาดใหญ่ สไตล์โปสการ์ดวันลอยกระทง',
    icon: 'square',
  },
  {
    id: '3-shot-strip',
    name: 'โฟโต้สตริป 3 ช็อต',
    nameEn: '3-Shot Strip',
    shotsCount: 3,
    width: 650,
    height: 1650,
    description: 'แถบยาว 3 ช็อตสุดฮิต สไตล์ตู้สติกเกอร์เกาหลี',
    icon: 'columns',
  },
  {
    id: '4-shot-strip',
    name: 'โฟโต้สตริป 4 ช็อต',
    nameEn: '4-Cut Strip',
    shotsCount: 4,
    width: 650,
    height: 1950,
    description: 'สตรีปยาว 4 ช็อตแนวตั้ง ยอดนิยมตลอดกาล',
    icon: 'rows',
  },
  {
    id: '4-shot-grid',
    name: 'กริด 4 ช็อต (2x2)',
    nameEn: '2x2 Grid',
    shotsCount: 4,
    width: 1000,
    height: 1250,
    description: 'ตาราง 4 ช่อง 2x2 สไตล์โพลารอยด์ครอบครัว',
    icon: 'grid',
  },
];

export function getPhotoRects(
  layout: LayoutMode,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; width: number; height: number }[] {
  switch (layout) {
    case '1-shot': {
      const marginX = canvasWidth * 0.08;
      const marginTop = canvasHeight * 0.07;
      const marginBottom = canvasHeight * 0.13;
      return [
        {
          x: marginX,
          y: marginTop,
          width: canvasWidth - marginX * 2,
          height: canvasHeight - marginTop - marginBottom,
        },
      ];
    }
    case '3-shot-strip': {
      const marginX = canvasWidth * 0.09;
      const marginTop = canvasHeight * 0.07;
      const marginBottom = canvasHeight * 0.12;
      const gap = canvasHeight * 0.02;
      const usableHeight = canvasHeight - marginTop - marginBottom - gap * 2;
      const photoHeight = usableHeight / 3;
      const photoWidth = canvasWidth - marginX * 2;

      return [0, 1, 2].map((i) => ({
        x: marginX,
        y: marginTop + i * (photoHeight + gap),
        width: photoWidth,
        height: photoHeight,
      }));
    }
    case '4-shot-strip': {
      const marginX = canvasWidth * 0.09;
      const marginTop = canvasHeight * 0.065;
      const marginBottom = canvasHeight * 0.12;
      const gap = canvasHeight * 0.018;
      const usableHeight = canvasHeight - marginTop - marginBottom - gap * 3;
      const photoHeight = usableHeight / 4;
      const photoWidth = canvasWidth - marginX * 2;

      return [0, 1, 2, 3].map((i) => ({
        x: marginX,
        y: marginTop + i * (photoHeight + gap),
        width: photoWidth,
        height: photoHeight,
      }));
    }
    case '4-shot-grid': {
      const marginX = canvasWidth * 0.07;
      const marginTop = canvasHeight * 0.075;
      const marginBottom = canvasHeight * 0.13;
      const gapX = canvasWidth * 0.04;
      const gapY = canvasHeight * 0.025;

      const photoWidth = (canvasWidth - marginX * 2 - gapX) / 2;
      const photoHeight = (canvasHeight - marginTop - marginBottom - gapY) / 2;

      return [
        { x: marginX, y: marginTop, width: photoWidth, height: photoHeight },
        { x: marginX + photoWidth + gapX, y: marginTop, width: photoWidth, height: photoHeight },
        { x: marginX, y: marginTop + photoHeight + gapY, width: photoWidth, height: photoHeight },
        { x: marginX + photoWidth + gapX, y: marginTop + photoHeight + gapY, width: photoWidth, height: photoHeight },
      ];
    }
  }
}
