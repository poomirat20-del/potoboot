import { roundRect } from '../constants/frames';
import { getPhotoRects } from '../constants/layouts';
import { STICKERS } from '../constants/stickers';
import { BackgroundTone, FrameDefinition, LayoutConfig, PlacedSticker, PlacedText } from '../types';

// Cache for loaded images
const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Convert SVG string to data URL
function svgToDataUrl(svgStr: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;
}

// Draw image covering a target rectangle (object-fit: cover)
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number = 8
) {
  ctx.save();
  roundRect(ctx, x, y, width, height, radius);
  ctx.clip();

  const imgRatio = img.width / img.height;
  const targetRatio = width / height;

  let renderW = width;
  let renderH = height;
  let renderX = x;
  let renderY = y;

  if (imgRatio > targetRatio) {
    renderW = height * imgRatio;
    renderX = x - (renderW - width) / 2;
  } else {
    renderH = width / imgRatio;
    renderY = y - (renderH - height) / 2;
  }

  ctx.drawImage(img, renderX, renderY, renderW, renderH);
  ctx.restore();
}

export interface RenderCanvasOptions {
  layout: LayoutConfig;
  photos: string[];
  frame: FrameDefinition;
  tone: BackgroundTone;
  stickers: PlacedSticker[];
  texts: PlacedText[];
  scaleFactor?: number;
}

export async function renderFullCompositionToCanvas(
  targetCanvas: HTMLCanvasElement,
  options: RenderCanvasOptions
): Promise<void> {
  const { layout, photos, frame, tone, stickers, texts, scaleFactor = 1 } = options;

  // Ensure Thai web fonts are ready before drawing
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font wait failure
    }
  }

  const width = Math.round(layout.width * scaleFactor);
  const height = Math.round(layout.height * scaleFactor);
  const layoutScale = width / 650; // Normalized scale relative to 650px width

  targetCanvas.width = width;
  targetCanvas.height = height;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.clearRect(0, 0, width, height);

  // 1. Draw Background Tone
  if (tone.type === 'gradient' && tone.colors.length > 1) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    tone.colors.forEach((c, idx) => {
      grad.addColorStop(idx / (tone.colors.length - 1), c);
    });
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = tone.colors[0] || '#0f172a';
  }
  ctx.fillRect(0, 0, width, height);

  // Resolution-independent starry glitter texture on background
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  const starCount = 36;
  for (let i = 0; i < starCount; i++) {
    const nx = ((i * 0.211538) % 1);
    const ny = ((i * 0.171717) % 1);
    const sx = nx * width;
    const sy = ny * height;
    const sr = (i % 3 === 0 ? 1.6 : 0.9) * layoutScale;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 2. Draw Photo Shots
  const baseRects = getPhotoRects(layout.id, layout.width, layout.height);
  const scaledRects = baseRects.map((r) => ({
    x: r.x * scaleFactor,
    y: r.y * scaleFactor,
    width: r.width * scaleFactor,
    height: r.height * scaleFactor,
  }));

  const loadedPhotoImages = await Promise.all(
    photos.map(async (p) => {
      try {
        return await loadImage(p);
      } catch {
        return null;
      }
    })
  );

  scaledRects.forEach((rect, idx) => {
    const photoImg = loadedPhotoImages[idx];
    if (photoImg) {
      drawImageCover(ctx, photoImg, rect.x, rect.y, rect.width, rect.height, 10 * layoutScale);
    } else {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 10 * layoutScale);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2 * layoutScale;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = `${18 * layoutScale}px 'Kanit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`ช็อตที่ ${idx + 1}`, rect.x + rect.width / 2, rect.y + rect.height / 2);
      ctx.restore();
    }
  });

  // 3. Draw Frame Borders & Themes (scales proportionally with width & height)
  ctx.save();
  frame.drawFrame(ctx, width, height, layout.id, scaledRects, frame.accentColor);
  ctx.restore();

  // 4. Draw Placed Stickers (scaled proportionally with width)
  for (const placed of stickers) {
    const stickerDef = STICKERS.find((s) => s.id === placed.stickerId);
    if (!stickerDef) continue;

    try {
      const dataUrl = svgToDataUrl(stickerDef.svgString);
      const stickerImg = await loadImage(dataUrl);

      ctx.save();
      const px = (placed.x / 100) * width;
      const py = (placed.y / 100) * height;
      const baseSize = 84 * layoutScale * (placed.scale || 1);

      ctx.translate(px, py);
      ctx.rotate(((placed.rotation || 0) * Math.PI) / 180);
      ctx.drawImage(stickerImg, -baseSize / 2, -baseSize / 2, baseSize, baseSize);
      ctx.restore();
    } catch (e) {
      console.warn('Failed to render sticker:', placed.stickerId, e);
    }
  }

  // 5. Draw Placed Texts (scaled proportionally with width & auto-fitted)
  texts.forEach((textItem) => {
    ctx.save();
    const tx = (textItem.x / 100) * width;
    const ty = (textItem.y / 100) * height;
    let fontSize = textItem.fontSize * layoutScale;

    ctx.font = `${textItem.fontWeight === 'bold' ? 'bold' : 'normal'} ${fontSize}px '${textItem.fontFamily}', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Auto-fit to prevent text from overflowing frame
    const maxWidth = width * 0.86;
    while (ctx.measureText(textItem.text).width > maxWidth && fontSize > 10 * layoutScale) {
      fontSize -= 0.5 * layoutScale;
      ctx.font = `${textItem.fontWeight === 'bold' ? 'bold' : 'normal'} ${fontSize}px '${textItem.fontFamily}', sans-serif`;
    }

    const metrics = ctx.measureText(textItem.text);
    let drawY = ty;

    if (
      typeof metrics.actualBoundingBoxAscent === 'number' &&
      typeof metrics.actualBoundingBoxDescent === 'number' &&
      metrics.actualBoundingBoxAscent > 0 &&
      Math.abs(metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) < fontSize
    ) {
      drawY = ty + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    } else {
      ctx.textBaseline = 'middle';
    }

    if (textItem.hasShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = fontSize * 0.28;
      ctx.shadowOffsetX = fontSize * 0.06;
      ctx.shadowOffsetY = fontSize * 0.06;
    }

    if (textItem.strokeColor && textItem.strokeColor !== 'transparent') {
      ctx.strokeStyle = textItem.strokeColor;
      ctx.lineWidth = Math.max(2, fontSize * 0.14);
      ctx.lineJoin = 'round';
      ctx.strokeText(textItem.text, tx, drawY);
    }

    ctx.fillStyle = textItem.color;
    ctx.fillText(textItem.text, tx, drawY);
    ctx.restore();
  });
}
