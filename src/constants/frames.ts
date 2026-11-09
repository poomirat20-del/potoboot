import { FrameDefinition } from '../types';

// Helper to draw rounded rectangle
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Compute proportional layout bands so every frame scales 100% identically at any resolution
function getFrameMetrics(
  width: number,
  height: number,
  photoRects: { x: number; y: number; width: number; height: number }[]
) {
  const s = width / 650; // Base scale relative to 650px width
  const borderPad = 16 * s;
  const innerPad = 24 * s;

  const firstRect = photoRects[0] || { x: 40 * s, y: 100 * s, width: width - 80 * s, height: 200 * s };
  const lastRect = photoRects[photoRects.length - 1] || firstRect;

  // Single-border visible edges (inner edge of outer border ~18.5*s, outer edge of photo border ~4.75*s)
  const headerTop = 18.5 * s;
  const headerBottom = firstRect.y - 4.75 * s;
  const headerHeight = Math.max(36 * s, headerBottom - headerTop);
  const headerCenterY = (headerTop + headerBottom) / 2;

  const footerTop = lastRect.y + lastRect.height + 4.75 * s;
  const footerBottom = height - 18.5 * s;
  const footerHeight = Math.max(60 * s, footerBottom - footerTop);
  const footerCenterY = (footerTop + footerBottom) / 2;

  // Double-border visible edges (inner edge of inner border ~25*s)
  const innerHeaderTop = 25 * s;
  const innerHeaderHeight = Math.max(32 * s, headerBottom - innerHeaderTop);
  const innerHeaderCenterY = (innerHeaderTop + headerBottom) / 2;

  const innerFooterBottom = height - 25 * s;
  const innerFooterHeight = Math.max(56 * s, innerFooterBottom - footerTop);
  const innerFooterCenterY = (footerTop + innerFooterBottom) / 2;

  return {
    s,
    borderPad,
    innerPad,
    firstRect,
    lastRect,
    headerTop,
    headerBottom,
    headerHeight,
    headerCenterY,
    footerTop,
    footerBottom,
    footerHeight,
    footerCenterY,
    innerHeaderTop,
    innerHeaderHeight,
    innerHeaderCenterY,
    innerFooterBottom,
    innerFooterHeight,
    innerFooterCenterY,
  };
}

// Draw Thai Stupa Silhouette (Wat Phra Pathom Chedi) - visual vertical center at cy - 2.5 * scale
function drawStupa(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Spire top
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(3, -20);
  ctx.lineTo(6, -10);
  ctx.lineTo(-6, -10);
  ctx.lineTo(-3, -20);
  ctx.closePath();
  ctx.fill();

  // Bell dome
  ctx.beginPath();
  ctx.moveTo(-6, -10);
  ctx.quadraticCurveTo(-24, 8, -26, 25);
  ctx.lineTo(26, 25);
  ctx.quadraticCurveTo(24, 8, 6, -10);
  ctx.closePath();
  ctx.fill();

  // Tiered base
  ctx.fillRect(-30, 25, 60, 6);
  ctx.fillRect(-34, 32, 68, 6);
  ctx.fillRect(-38, 39, 76, 6);

  ctx.restore();
}

// Draw Thai Kranok corner pattern
function drawCornerKranok(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string,
  lineWidth: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.4, 0, size * 0.7, size * 0.3);
  ctx.quadraticCurveTo(size * 0.9, size * 0.6, size, size);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(size * 0.35, size * 0.35, size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(size * 0.3, 0);
  ctx.quadraticCurveTo(size * 0.5, size * 0.2, size * 0.6, size * 0.5);
  ctx.stroke();

  ctx.restore();
}

// Draw Thai Lotus Blossom Emblem
function drawLotusBlossom(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  petalColor: string,
  accentColor: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Side petals
  ctx.fillStyle = accentColor;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.quadraticCurveTo(dir * 24, 6, dir * 20, -10);
    ctx.quadraticCurveTo(dir * 10, -4, 0, 12);
    ctx.fill();
  }

  // Inner left & right petals
  ctx.fillStyle = petalColor;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.quadraticCurveTo(dir * 15, 0, dir * 11, -15);
    ctx.quadraticCurveTo(dir * 4, -8, 0, 12);
    ctx.fill();
  }

  // Center petal
  ctx.beginPath();
  ctx.moveTo(0, 13);
  ctx.quadraticCurveTo(-9, -4, 0, -20);
  ctx.quadraticCurveTo(9, -4, 0, 13);
  ctx.fill();

  // Base calyx
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.ellipse(0, 14, 14, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw 4-point Golden Sparkle Star
function drawSparkleStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? r : r * 0.28;
    const ang = (i * Math.PI) / 4;
    if (i === 0) ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
    else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw Floating Krathong
function drawKrathong(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.ellipse(0, 10, 36, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.ellipse(i * 10, 4, 8, 14, (i * 15 * Math.PI) / 180, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#f472b6';
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(i * 9, -2, 7, 12, (i * 12 * Math.PI) / 180, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-2, -22, 4, 18);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, -25, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Floating Lantern (Yi Peng)
function drawSkyLantern(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const grad = ctx.createLinearGradient(0, -20, 0, 15);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.7, '#f59e0b');
  grad.addColorStop(1, '#d97706');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-12, -20);
  ctx.quadraticCurveTo(-18, 0, -14, 15);
  ctx.lineTo(14, 15);
  ctx.quadraticCurveTo(18, 0, 12, -20);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-13, 14, 26, 2);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 12, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 12 Text-Free Loy Krathong Frames with Proportional Vector Ornaments
export const FRAMES: FrameDefinition[] = [
  // 1. พระปฐมเจดีย์เรืองรอง
  {
    id: 'frame-phra-pathom-chedi',
    name: 'พระปฐมเจดีย์เรืองรอง',
    nameEn: 'Golden Phra Pathom Chedi',
    description: 'เอกลักษณ์องค์พระปฐมเจดีย์สีทองอร่าม ลายกนก และดอกบัวมงคล',
    themeColor: '#1e3a8a',
    accentColor: '#fbbf24',
    textColor: '#fef08a',
    drawFrame: (ctx, width, height, _layout, photoRects, accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1.5 * m.s;
      roundRect(ctx, m.innerPad, m.innerPad, width - m.innerPad * 2, height - m.innerPad * 2, 15 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      // Symmetrical top lotus & stars centered in header band
      const topLotusScale = Math.min(0.85 * m.s, (m.innerHeaderHeight * 0.62) / 34);
      drawLotusBlossom(ctx, width / 2, m.innerHeaderCenterY + 2 * topLotusScale, topLotusScale, '#fef08a', '#fbbf24');
      drawSparkleStar(ctx, width / 2 - 44 * m.s, m.innerHeaderCenterY, 7 * m.s, '#fde68a');
      drawSparkleStar(ctx, width / 2 + 44 * m.s, m.innerHeaderCenterY, 7 * m.s, '#fde68a');

      // Iconic Golden Phra Pathom Chedi stupa centered symmetrically in footer band
      const stupaScale = Math.min(0.82 * m.s, (m.innerFooterHeight * 0.68) / 95);
      drawStupa(ctx, width / 2, m.innerFooterCenterY + 2.5 * stupaScale, stupaScale, '#fbbf24');
      drawSparkleStar(ctx, width / 2 - 64 * m.s, m.innerFooterCenterY, 8 * m.s, '#fef08a');
      drawSparkleStar(ctx, width / 2 + 64 * m.s, m.innerFooterCenterY, 8 * m.s, '#fef08a');

      // 4 Thai corner kranok ornaments
      const kSize = 32 * m.s;
      const kPad = 34 * m.s;
      drawCornerKranok(ctx, kPad, kPad, kSize, 0, '#fbbf24', 2.2 * m.s);
      drawCornerKranok(ctx, width - kPad, kPad, kSize, 90, '#fbbf24', 2.2 * m.s);
      drawCornerKranok(ctx, width - kPad, height - kPad, kSize, 180, '#fbbf24', 2.2 * m.s);
      drawCornerKranok(ctx, kPad, height - kPad, kSize, 270, '#fbbf24', 2.2 * m.s);
    },
  },

  // 2. กระทงวิจิตร & ใบตอง
  {
    id: 'frame-krathong-lotus',
    name: 'กระทงวิจิตร & ใบตอง',
    nameEn: 'Traditional Krathong & Lotus',
    description: 'ขอบทองประณีต ดอกบัวสีหวาน และขบวนกระทงลอยน้ำ',
    themeColor: '#064e3b',
    accentColor: '#34d399',
    textColor: '#ecfdf5',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      // Top centered lotus blossom
      const lotusScale = Math.min(0.88 * m.s, (m.headerHeight * 0.6) / 34);
      drawLotusBlossom(ctx, width / 2, m.headerCenterY + 2 * lotusScale, lotusScale, '#f472b6', '#fbbf24');

      // Gentle river ripples & 3 floating krathongs across the bottom band
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
      ctx.lineWidth = 2 * m.s;
      ctx.beginPath();
      ctx.moveTo(60 * m.s, m.footerCenterY + 18 * m.s);
      ctx.quadraticCurveTo(width / 2, m.footerCenterY + 26 * m.s, width - 60 * m.s, m.footerCenterY + 18 * m.s);
      ctx.stroke();

      const krathongScale = Math.min(0.88 * m.s, (m.footerHeight * 0.56) / 50);
      drawKrathong(ctx, width * 0.24, m.footerCenterY + 2 * m.s, krathongScale * 0.85);
      drawKrathong(ctx, width * 0.5, m.footerCenterY, krathongScale * 1.05);
      drawKrathong(ctx, width * 0.76, m.footerCenterY + 2 * m.s, krathongScale * 0.85);
    },
  },

  // 3. แสงจันทร์ & โคมลอย
  {
    id: 'frame-full-moon-lanterns',
    name: 'แสงจันทร์ & โคมลอย',
    nameEn: 'Full Moon & Sky Lanterns',
    description: 'บรรยากาศโคมลอยยี่เป็งลอยเต็มฟากฟ้าใต้เงาพระจันทร์วันเพ็ญ',
    themeColor: '#3b0764',
    accentColor: '#f59e0b',
    textColor: '#fef08a',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      // Glowing full moon in top right
      const moonR = Math.min(26 * m.s, m.headerHeight * 0.36);
      const moonX = width - 64 * m.s;
      const moonY = m.headerCenterY;
      const moonGrad = ctx.createRadialGradient(moonX, moonY, 3 * m.s, moonX, moonY, moonR);
      moonGrad.addColorStop(0, '#ffffff');
      moonGrad.addColorStop(0.55, '#fef08a');
      moonGrad.addColorStop(1, 'rgba(245, 158, 11, 0.15)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Floating sky lanterns across the night sky header
      const lanternScale = Math.min(0.75 * m.s, (m.headerHeight * 0.62) / 40);
      drawSkyLantern(ctx, 58 * m.s, m.headerCenterY, lanternScale);
      drawSkyLantern(ctx, 108 * m.s, m.headerCenterY + 5 * m.s, lanternScale * 0.72);
      drawSkyLantern(ctx, width * 0.5, m.headerCenterY - 2 * m.s, lanternScale * 0.88);
      drawSparkleStar(ctx, width * 0.32, m.headerCenterY - 4 * m.s, 6 * m.s, '#fef08a');
      drawSparkleStar(ctx, width * 0.68, m.headerCenterY + 4 * m.s, 6 * m.s, '#fde68a');

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4.5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      // Symmetrical floating lanterns & stars in bottom band
      const bottomLanternScale = Math.min(0.85 * m.s, (m.footerHeight * 0.55) / 40);
      drawSkyLantern(ctx, width * 0.32, m.footerCenterY, bottomLanternScale * 0.88);
      drawSkyLantern(ctx, width * 0.5, m.footerCenterY - 3 * m.s, bottomLanternScale);
      drawSkyLantern(ctx, width * 0.68, m.footerCenterY, bottomLanternScale * 0.88);
    },
  },

  // 4. พลุประกายไฟเฉลิมฉลอง
  {
    id: 'frame-fireworks-celebration',
    name: 'พลุประกายไฟเฉลิมฉลอง',
    nameEn: 'Fireworks & Water Lamps',
    description: 'ประกายพลุดอกไม้ไฟระยิบระยับสวยงามเหนือสายน้ำ',
    themeColor: '#0f172a',
    accentColor: '#38bdf8',
    textColor: '#ffffff',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      const drawSpark = (cx: number, cy: number, r: number, color: string) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * m.s;
        for (let a = 0; a < 12; a++) {
          const angle = (a * 30 * Math.PI) / 180;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
          ctx.stroke();
        }
        ctx.restore();
      };

      const sparkR = Math.min(18 * m.s, m.headerHeight * 0.34);
      drawSpark(58 * m.s, m.headerCenterY, sparkR, '#fbbf24');
      drawSpark(width / 2, m.headerCenterY, sparkR * 1.15, '#38bdf8');
      drawSpark(width - 58 * m.s, m.headerCenterY, sparkR, '#fbbf24');

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4.5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      const bottomSparkR = Math.min(22 * m.s, m.footerHeight * 0.28);
      drawSpark(width * 0.3, m.footerCenterY, bottomSparkR * 0.85, '#38bdf8');
      drawSpark(width * 0.5, m.footerCenterY, bottomSparkR * 1.1, '#fbbf24');
      drawSpark(width * 0.7, m.footerCenterY, bottomSparkR * 0.85, '#38bdf8');
    },
  },

  // 5. กนกทองคำโมเดิร์น
  {
    id: 'frame-royal-thai-gold',
    name: 'กนกทองคำโมเดิร์น',
    nameEn: 'Modern Royal Thai Gold',
    description: 'ลวดลายไทยกนกสีทองหรูหรา วิจิตรศิลป์ระดับพรีเมียม',
    themeColor: '#451a03',
    accentColor: '#d97706',
    textColor: '#fef3c7',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1.8 * m.s;
      roundRect(ctx, m.innerPad, m.innerPad, width - m.innerPad * 2, height - m.innerPad * 2, 14 * m.s);
      ctx.stroke();

      const kSize = 34 * m.s;
      const kPad = 34 * m.s;
      drawCornerKranok(ctx, kPad, kPad, kSize, 0, '#fbbf24', 2.2 * m.s);
      drawCornerKranok(ctx, width - kPad, kPad, kSize, 90, '#fbbf24', 2.2 * m.s);
      drawCornerKranok(ctx, width - kPad, height - kPad, kSize, 180, '#fbbf24', 2.2 * m.s);
      drawCornerKranok(ctx, kPad, height - kPad, kSize, 270, '#fbbf24', 2.2 * m.s);

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      // Symmetrical golden lotus & star crests top and bottom
      const topScale = Math.min(0.8 * m.s, (m.innerHeaderHeight * 0.58) / 34);
      drawLotusBlossom(ctx, width / 2, m.innerHeaderCenterY + 2 * topScale, topScale, '#fef08a', '#d97706');

      const botScale = Math.min(1.0 * m.s, (m.innerFooterHeight * 0.52) / 34);
      drawLotusBlossom(ctx, width / 2, m.innerFooterCenterY + 2 * botScale, botScale, '#fef08a', '#d97706');
      drawSparkleStar(ctx, width / 2 - 48 * m.s, m.innerFooterCenterY, 7.5 * m.s, '#fde68a');
      drawSparkleStar(ctx, width / 2 + 48 * m.s, m.innerFooterCenterY, 7.5 * m.s, '#fde68a');
    },
  },

  // 6. โฟโต้สตริปเรโทร
  {
    id: 'frame-retro-photostrip',
    name: 'โฟโต้สตริปเรโทร ฟิล์มคลาสสิก',
    nameEn: 'Retro Filmstrip Stamp',
    description: 'สไตล์ฟิล์มสตรีปย้อนยุค พร้อมรูหนามเตยฟิล์มและบาร์โค้ดสุดคลาสสิก',
    themeColor: '#18181b',
    accentColor: '#e4e4e7',
    textColor: '#ffffff',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      const holeW = 9 * m.s;
      const holeH = 13 * m.s;
      for (let y = 28 * m.s; y < height - 28 * m.s; y += 34 * m.s) {
        roundRect(ctx, 6 * m.s, y, holeW, holeH, 2 * m.s);
        ctx.fill();
        roundRect(ctx, width - 15 * m.s, y, holeW, holeH, 2 * m.s);
        ctx.fill();
      }

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 4 * m.s);
        ctx.stroke();
      });

      // Simulated film barcode centered cleanly in footer band (no text)
      const barH = Math.min(26 * m.s, m.footerHeight * 0.34);
      const barY = m.footerCenterY - barH / 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const totalBars = 32;
      const startX = width / 2 - (totalBars * 4.2 * m.s) / 2;
      for (let i = 0; i < totalBars; i++) {
        const bw = (i % 3 === 0 ? 3 : i % 2 === 0 ? 1.8 : 1.1) * m.s;
        ctx.fillRect(startX + i * 4.2 * m.s, barY, bw, barH);
      }
    },
  },

  // 7. สายธารกระทงสาย
  {
    id: 'frame-river-of-lights',
    name: 'สายธารกระทงสายเรืองแสง',
    nameEn: 'River of Golden Lights',
    description: 'ระลอกคลื่นน้ำสะท้อนแสงประทีปและกระทงสายนับร้อย',
    themeColor: '#022c22',
    accentColor: '#2dd4bf',
    textColor: '#99f6e4',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 4.5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      // Glowing river waves & golden floating candle lights in footer band
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
      ctx.lineWidth = 2.2 * m.s;
      for (const offsetY of [-8 * m.s, 10 * m.s]) {
        ctx.beginPath();
        ctx.moveTo(48 * m.s, m.footerCenterY + offsetY);
        ctx.bezierCurveTo(
          width * 0.35,
          m.footerCenterY + offsetY - 12 * m.s,
          width * 0.65,
          m.footerCenterY + offsetY + 12 * m.s,
          width - 48 * m.s,
          m.footerCenterY + offsetY
        );
        ctx.stroke();
      }

      // Floating candle lights along the river
      const lights = [0.22, 0.36, 0.5, 0.64, 0.78];
      lights.forEach((lx, idx) => {
        const cx = width * lx;
        const cy = m.footerCenterY + (idx % 2 === 0 ? -4 : 5) * m.s;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5 * m.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(cx, cy - 2 * m.s, 2.2 * m.s, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  },

  // 8. พวงมาลัยดอกมะลิ & ดาวเรือง
  {
    id: 'frame-thai-garland',
    name: 'มาลัยดอกมะลิ & ดาวเรือง',
    nameEn: 'Thai Floral Garland',
    description: 'ขอบดอกมะลิขาวบริสุทธิ์สลับดาวเรืองมงคล ประณีตแบบไทยเดิม',
    themeColor: '#78350f',
    accentColor: '#facc15',
    textColor: '#fef08a',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
      ctx.lineWidth = 2 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 18 * m.s);
      ctx.stroke();

      // Alternating white jasmine & golden marigold garland beads along top & bottom
      for (let x = 32 * m.s; x < width - 32 * m.s; x += 24 * m.s) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, m.borderPad, 4 * m.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, height - m.borderPad, 4 * m.s, 0, Math.PI * 2);
        ctx.fill();

        if (x + 12 * m.s < width - 32 * m.s) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(x + 12 * m.s, m.borderPad, 3 * m.s, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + 12 * m.s, height - m.borderPad, 3 * m.s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      const lotusScale = Math.min(0.95 * m.s, (m.footerHeight * 0.48) / 34);
      drawLotusBlossom(ctx, width / 2, m.footerCenterY + 2 * lotusScale, lotusScale, '#ffffff', '#facc15');
    },
  },

  // 9. โพลารอยด์มินิมอล แสงเทียนอบอุ่น
  {
    id: 'frame-minimal-polaroid',
    name: 'โพลารอยด์มินิมอล แสงเทียน',
    nameEn: 'Warm Candle Polaroid',
    description: 'เรียบง่าย มินิมอล สไตล์โพลาลอยด์เกาหลีร่วมสมัยไร้ตัวอักษร',
    themeColor: '#1c1917',
    accentColor: '#f59e0b',
    textColor: '#1c1917',
    drawFrame: (ctx, _width, _height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(_width, _height, photoRects);

      const pMargin = 9 * m.s;
      photoRects.forEach((rect) => {
        ctx.fillStyle = '#ffffff';
        roundRect(
          ctx,
          rect.x - pMargin,
          rect.y - pMargin,
          rect.width + pMargin * 2,
          rect.height + pMargin * 2 + 6 * m.s,
          8 * m.s
        );
        ctx.fill();

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1 * m.s;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    },
  },

  // 10. มนต์เสน่ห์นางนพมาศ
  {
    id: 'frame-nang-noppamas',
    name: 'มนต์เสน่ห์นางนพมาศ',
    nameEn: 'Nang Noppamas Royal Festival',
    description: 'โทนหวานประกายชมพูกุหลาบ ตัดสีทองหรูหรา ประดับบัวคู่',
    themeColor: '#701a75',
    accentColor: '#f472b6',
    textColor: '#fdf4ff',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2 * m.s;
      roundRect(ctx, m.innerPad, m.innerPad, width - m.innerPad * 2, height - m.innerPad * 2, 15 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#fdf4ff';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      const topLotus = Math.min(0.8 * m.s, (m.innerHeaderHeight * 0.56) / 34);
      drawLotusBlossom(ctx, width / 2, m.innerHeaderCenterY + 2 * topLotus, topLotus, '#f472b6', '#fbbf24');

      const botLotus = Math.min(1.0 * m.s, (m.innerFooterHeight * 0.52) / 34);
      drawLotusBlossom(ctx, width / 2, m.innerFooterCenterY + 2 * botLotus, botLotus, '#f472b6', '#fbbf24');
      drawSparkleStar(ctx, width / 2 - 46 * m.s, m.innerFooterCenterY, 7 * m.s, '#fef08a');
      drawSparkleStar(ctx, width / 2 + 46 * m.s, m.innerFooterCenterY, 7 * m.s, '#fef08a');
    },
  },

  // 11. ซุ้มโคมประทีปวัดวาอาราม
  {
    id: 'frame-temple-lantern-arch',
    name: 'ซุ้มโคมประทีปวัดไทย',
    nameEn: 'Temple Lantern Arch',
    description: 'โคมแขวนประดับประทีปยามค่ำคืนงานวัดไทย รื่นเริงอบอุ่น',
    themeColor: '#831843',
    accentColor: '#fb7185',
    textColor: '#fff1f2',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2 * m.s;
      ctx.beginPath();
      ctx.moveTo(m.borderPad, m.borderPad + 8 * m.s);
      ctx.quadraticCurveTo(width / 2, m.headerCenterY + 12 * m.s, width - m.borderPad, m.borderPad + 8 * m.s);
      ctx.stroke();

      const lanternScale = Math.min(0.54 * m.s, (m.headerHeight * 0.52) / 35);
      for (let i = 0; i < 5; i++) {
        const lx = 64 * m.s + i * ((width - 128 * m.s) / 4);
        const ly = m.headerCenterY + (i === 2 ? 6 * m.s : i === 1 || i === 3 ? 2 * m.s : -2 * m.s);
        drawSkyLantern(ctx, lx, ly, lanternScale);
      }

      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 4.5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 20 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      // Symmetrical bottom lantern pair
      const botLanternScale = Math.min(0.8 * m.s, (m.footerHeight * 0.5) / 40);
      drawSkyLantern(ctx, width * 0.36, m.footerCenterY, botLanternScale);
      drawSkyLantern(ctx, width * 0.64, m.footerCenterY, botLanternScale);
    },
  },

  // 12. ทองอร่ามพัสตราภรณ์
  {
    id: 'frame-grand-royal',
    name: 'ทองอร่ามพัสตราภรณ์',
    nameEn: 'Grand Royal Gold',
    description: 'กรอบทองคำคู่ ประดับองค์เจดีย์ ดวงดาว และประทีปมงคล',
    themeColor: '#713f12',
    accentColor: '#facc15',
    textColor: '#fef08a',
    drawFrame: (ctx, width, height, _layout, photoRects, _accentColor) => {
      const m = getFrameMetrics(width, height, photoRects);

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 5.5 * m.s;
      roundRect(ctx, m.borderPad, m.borderPad, width - m.borderPad * 2, height - m.borderPad * 2, 22 * m.s);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
      ctx.lineWidth = 2 * m.s;
      roundRect(ctx, m.innerPad, m.innerPad, width - m.innerPad * 2, height - m.innerPad * 2, 16 * m.s);
      ctx.stroke();

      photoRects.forEach((rect) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5 * m.s;
        roundRect(ctx, rect.x - 3 * m.s, rect.y - 3 * m.s, rect.width + 6 * m.s, rect.height + 6 * m.s, 12 * m.s);
        ctx.stroke();
      });

      const stupaScale = Math.min(0.48 * m.s, (m.innerHeaderHeight * 0.58) / 95);
      drawStupa(ctx, width / 2, m.innerHeaderCenterY + 2.5 * stupaScale, stupaScale, '#facc15');

      const botLotus = Math.min(1.0 * m.s, (m.innerFooterHeight * 0.52) / 34);
      drawLotusBlossom(ctx, width / 2, m.innerFooterCenterY + 2 * botLotus, botLotus, '#fef08a', '#facc15');
      drawSparkleStar(ctx, width / 2 - 48 * m.s, m.innerFooterCenterY, 7.5 * m.s, '#fef08a');
      drawSparkleStar(ctx, width / 2 + 48 * m.s, m.innerFooterCenterY, 7.5 * m.s, '#fef08a');
    },
  },
];
