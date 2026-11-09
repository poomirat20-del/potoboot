import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  QrCode,
  Printer,
  Type,
  Smile,
  Palette,
  Layers,
  RotateCw,
  Trash2,
  Check,
  ChevronLeft,
  X,
  Plus,
  AlignCenter,
} from 'lucide-react';
import { FRAMES } from '../constants/frames';
import { STICKERS } from '../constants/stickers';
import { BACKGROUND_TONES } from '../constants/tones';
import { BackgroundTone, FrameDefinition, LayoutConfig, PlacedSticker, PlacedText } from '../types';
import { renderFullCompositionToCanvas } from '../utils/canvasRenderer';
import { soundPlayer } from '../utils/audio';

interface EditorViewProps {
  layout: LayoutConfig;
  photos: string[];
  onBackToCamera: () => void;
  onOpenQR: (photoDataUrl: string) => void;
  onPrintPhoto: (photoDataUrl: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  layout,
  photos,
  onBackToCamera,
  onOpenQR,
  onPrintPhoto,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Design State
  const [selectedFrame, setSelectedFrame] = useState<FrameDefinition>(FRAMES[0]);
  const [selectedTone, setSelectedTone] = useState<BackgroundTone>(BACKGROUND_TONES[0]);
  const [customSolidColor, setCustomSolidColor] = useState<string>('#0f172a');

  // Interactive Stickers (positioned in corners so faces stay unobstructed)
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([
    { instanceId: 'init-krathong', stickerId: 'krathong-classic', x: 18, y: 85, scale: 0.9, rotation: -4 },
    { instanceId: 'init-lantern', stickerId: 'lantern-single', x: 82, y: 14, scale: 0.85, rotation: 6 },
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  // Custom placed texts
  const [placedTexts, setPlacedTexts] = useState<PlacedText[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // UI Tabs
  const [activeTab, setActiveTab] = useState<'frames' | 'tones' | 'stickers' | 'text'>('frames');
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Dragging state
  const [draggingItem, setDraggingItem] = useState<{
    type: 'sticker' | 'text';
    id: string;
    startX: number;
    startY: number;
    initialItemX: number;
    initialItemY: number;
  } | null>(null);
  const [isSnappedCenter, setIsSnappedCenter] = useState<boolean>(false);

  // WYSIWYG Single Source of Truth: Render directly to preview canvas
  const updateCanvasPreview = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      await renderFullCompositionToCanvas(canvasRef.current, {
        layout,
        photos,
        frame: selectedFrame,
        tone: selectedTone,
        stickers: placedStickers,
        texts: placedTexts,
        scaleFactor: 1.2,
      });
    } catch (e) {
      console.error('Canvas render error:', e);
    }
  }, [layout, photos, selectedFrame, selectedTone, placedStickers, placedTexts]);

  useEffect(() => {
    updateCanvasPreview();
  }, [updateCanvasPreview]);

  // Export high-resolution composition (100% identical proportions to preview)
  const generateExportDataUrl = async (): Promise<string> => {
    const exportCanvas = document.createElement('canvas');
    await renderFullCompositionToCanvas(exportCanvas, {
      layout,
      photos,
      frame: selectedFrame,
      tone: selectedTone,
      stickers: placedStickers,
      texts: placedTexts,
      scaleFactor: 2.0,
    });
    return exportCanvas.toDataURL('image/jpeg', 0.94);
  };

  // Add Sticker to canvas
  const handleAddSticker = (stickerId: string) => {
    const newSticker: PlacedSticker = {
      instanceId: `sticker-${Date.now()}`,
      stickerId,
      x: 50,
      y: 50,
      scale: 0.95,
      rotation: 0,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.instanceId);
    setSelectedTextId(null);
  };

  // Add Text to canvas (proportional 650px-base units)
  const handleAddText = (customText?: string) => {
    const newText: PlacedText = {
      id: `text-${Date.now()}`,
      text: customText || 'สุขสันต์วันลอยกระทง',
      x: 50,
      y: 50,
      color: '#fef08a',
      fontSize: 24,
      fontFamily: 'Kanit',
      strokeColor: '#000000',
      hasShadow: true,
      fontWeight: 'bold',
    };
    setPlacedTexts((prev) => [...prev, newText]);
    setSelectedTextId(newText.id);
    setSelectedStickerId(null);
  };

  // Download directly to device/mobile
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await generateExportDataUrl();

      // Mobile share sheet on iOS/Android
      if (navigator.share && navigator.canShare) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], `loykrathong-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'ลอยกระทงโฟโต้บูท By เทศบาล ๕ วัดพระปฐมเจดีย์',
              files: [file],
            });
            setIsExporting(false);
            return;
          }
        } catch {
          // fallback to regular download link
        }
      }

      const link = document.createElement('a');
      link.download = `loykrathong-photo-${Date.now()}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportNotice('บันทึกรูปภาพลงเครื่องเรียบร้อยแล้ว! 🎉');
      setTimeout(() => setExportNotice(null), 3000);
      soundPlayer.playCelebration();
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  // Open QR Code Modal
  const handleOpenQR = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generateExportDataUrl();
      onOpenQR(dataUrl);
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Print
  const handlePrint = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generateExportDataUrl();
      onPrintPhoto(dataUrl);
    } finally {
      setIsExporting(false);
    }
  };

  // Pointer Down on item
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    type: 'sticker' | 'text',
    id: string,
    curX: number,
    curY: number
  ) => {
    e.stopPropagation();
    if (type === 'sticker') {
      setSelectedStickerId(id);
      setSelectedTextId(null);
    } else {
      setSelectedTextId(id);
      setSelectedStickerId(null);
    }

    setDraggingItem({
      type,
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialItemX: curX,
      initialItemY: curY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingItem || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - draggingItem.startX) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - draggingItem.startY) / rect.height) * 100;

    let newX = Math.max(5, Math.min(95, draggingItem.initialItemX + deltaXPercent));
    const newY = Math.max(5, Math.min(95, draggingItem.initialItemY + deltaYPercent));

    // Gentle magnetic snap to exact 50% horizontal center
    if (Math.abs(newX - 50) < 2.2) {
      newX = 50;
      setIsSnappedCenter(true);
    } else {
      setIsSnappedCenter(false);
    }

    if (draggingItem.type === 'sticker') {
      setPlacedStickers((prev) =>
        prev.map((s) => (s.instanceId === draggingItem.id ? { ...s, x: newX, y: newY } : s))
      );
    } else {
      setPlacedTexts((prev) =>
        prev.map((t) => (t.id === draggingItem.id ? { ...t, x: newX, y: newY } : t))
      );
    }
  };

  const handlePointerUp = () => {
    setDraggingItem(null);
    setIsSnappedCenter(false);
  };

  const activeText = placedTexts.find((t) => t.id === selectedTextId);
  const activeSticker = placedStickers.find((s) => s.instanceId === selectedStickerId);

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row editor-controls select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* LEFT: WYSIWYG Photobooth Canvas Area */}
      <div
        className="flex-1 flex flex-col items-center justify-between p-2 sm:p-4 md:p-5 bg-radial from-slate-900 to-slate-950 overflow-y-auto"
        onClick={() => {
          setSelectedStickerId(null);
          setSelectedTextId(null);
        }}
      >
        {/* Top Header */}
        <div className="w-full max-w-3xl flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-2 mb-1.5">
          <button
            onClick={onBackToCamera}
            className="self-start sm:justify-self-start text-xs px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-amber-400 text-slate-300 flex items-center gap-1 cursor-pointer transition-all shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>กลับไปถ่ายรูป</span>
          </button>

          <div className="justify-self-center max-w-full text-[11px] sm:text-xs text-amber-300 font-medium bg-amber-950/40 border border-amber-500/20 px-3 py-1 rounded-full text-center truncate">
            ลอยกระทงโฟโต้บูท By เทศบาล ๕ วัดพระปฐมเจดีย์
          </div>

          <div className="hidden sm:block" aria-hidden="true" />
        </div>

        {/* Live Interactive Canvas Container */}
        <div className="relative my-auto w-full flex items-center justify-center p-1 sm:p-2">
          <div
            ref={containerRef}
            className="relative inline-flex items-center justify-center shadow-2xl shadow-amber-500/10 rounded-xl overflow-hidden border border-amber-500/20"
          >
            {/* Single Source of Truth Canvas */}
            <canvas
              ref={canvasRef}
              className="block w-auto h-auto max-w-full max-h-[44vh] md:max-h-[76vh]"
            />

            {/* Vertical Center Snap Guide Line */}
            {isSnappedCenter && (
              <div
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.9)] pointer-events-none z-20"
                aria-hidden="true"
              />
            )}

            {/* Proportional Touch Hitboxes for Stickers */}
            {placedStickers.map((sticker) => {
              const isSelected = selectedStickerId === sticker.instanceId;
              const widthPercent = Math.max(8, 12.9 * (sticker.scale || 1));

              return (
                <div
                  key={sticker.instanceId}
                  onPointerDown={(e) =>
                    handlePointerDown(e, 'sticker', sticker.instanceId, sticker.x, sticker.y)
                  }
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-move ${
                    isSelected
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent bg-amber-400/10 rounded-lg'
                      : ''
                  }`}
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    width: `${widthPercent}%`,
                    aspectRatio: '1 / 1',
                    touchAction: 'none',
                  }}
                >
                  {isSelected && (
                    <div className="absolute -top-7 -right-7 flex items-center gap-1 bg-slate-900/95 border border-amber-400 rounded-lg p-1 shadow-lg pointer-events-auto z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedStickers((prev) =>
                            prev.map((s) =>
                              s.instanceId === sticker.instanceId
                                ? { ...s, rotation: (s.rotation + 15) % 360 }
                                : s
                            )
                          );
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-amber-400 cursor-pointer"
                        title="หมุนสติกเกอร์"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedStickers((prev) =>
                            prev.filter((s) => s.instanceId !== sticker.instanceId)
                          );
                          setSelectedStickerId(null);
                        }}
                        className="p-1 hover:bg-red-950 rounded text-red-400 cursor-pointer"
                        title="ลบสติกเกอร์"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Touch Hitboxes for Custom Placed Texts */}
            {placedTexts.map((txt) => {
              const isSelected = selectedTextId === txt.id;
              return (
                <div
                  key={txt.id}
                  onPointerDown={(e) =>
                    handlePointerDown(e, 'text', txt.id, txt.x, txt.y)
                  }
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-move px-3 py-1.5 rounded-lg flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-amber-400 bg-amber-400/15' : ''
                  }`}
                  style={{
                    left: `${txt.x}%`,
                    top: `${txt.y}%`,
                    minWidth: '80px',
                    minHeight: '28px',
                    touchAction: 'none',
                  }}
                >
                  <span
                    className="invisible whitespace-nowrap pointer-events-none select-none font-bold leading-none"
                    style={{
                      fontFamily: txt.fontFamily,
                      fontSize: `${Math.max(12, txt.fontSize * 0.52)}px`,
                    }}
                  >
                    {txt.text || 'ข้อความ'}
                  </span>

                  {isSelected && (
                    <div className="absolute -top-7 right-0 flex items-center gap-1 bg-slate-900/95 border border-amber-400 rounded-lg p-1 shadow-lg pointer-events-auto z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedTexts((prev) =>
                            prev.map((t) => (t.id === txt.id ? { ...t, x: 50 } : t))
                          );
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-amber-400 cursor-pointer"
                        title="จัดข้อความอยู่ตรงกลาง"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedTexts((prev) => prev.filter((t) => t.id !== txt.id));
                          setSelectedTextId(null);
                        }}
                        className="p-1 hover:bg-red-950 rounded text-red-400 cursor-pointer"
                        title="ลบข้อความ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback notice */}
        {exportNotice && (
          <div className="bg-emerald-600/90 text-white text-xs px-4 py-2 rounded-xl border border-emerald-400 shadow-lg animate-bounce mt-1">
            {exportNotice}
          </div>
        )}

        <div className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-1">
          💡 ภาพที่บันทึกและสั่งพิมพ์จะตรงตามแบบบนหน้าจอ 100%
        </div>
      </div>

      {/* RIGHT: Tools & Controls Panel (Optimized for iPad & Mobile) */}
      <div className="w-full md:w-[340px] lg:w-[420px] bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between max-h-[50vh] md:max-h-screen">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-800 text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('frames')}
            className={`py-2.5 sm:py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'frames'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>กรอบรูป (12)</span>
          </button>

          <button
            onClick={() => setActiveTab('tones')}
            className={`py-2.5 sm:py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'tones'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>โทนสีพื้นหลัง</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`py-2.5 sm:py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'stickers'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>สติกเกอร์ (24)</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`py-2.5 sm:py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>ข้อความ</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {/* TAB 1: FRAMES */}
          {activeTab === 'frames' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-amber-300">เลือกกรอบรูปวันลอยกระทง</h3>
                <span className="text-[11px] text-slate-400">{FRAMES.length} แบบ</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {FRAMES.map((f) => {
                  const isSelected = selectedFrame.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFrame(f)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-amber-300 line-clamp-1">
                          {f.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>

                      <div className="flex items-center gap-1.5 my-1">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: f.themeColor }}
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: f.accentColor }}
                        />
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-1">{f.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BACKGROUND TONES */}
          {activeTab === 'tones' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-amber-300">เลือกโทนสีพื้นหลัง</h3>
                <p className="text-[10px] text-slate-400">เลือกโทนสีแม่น้ำ ค่ำคืน หรือแสงเทียน</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_TONES.map((t) => {
                  const isSelected = selectedTone.id === t.id;
                  const bgStyle =
                    t.type === 'gradient'
                      ? `linear-gradient(135deg, ${t.colors.join(', ')})`
                      : t.colors[0];

                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTone(t)}
                      className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-800'
                          : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded-lg shadow-inner flex items-center justify-center border border-white/10"
                        style={{ background: bgStyle }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                      </div>
                      <span className="text-[10px] font-medium text-slate-200 line-clamp-1">
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">กำหนดสีเอง:</span>
                <input
                  type="color"
                  value={customSolidColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setCustomSolidColor(color);
                    setSelectedTone({
                      id: `custom-${color}`,
                      name: 'สีกำหนดเอง',
                      category: 'night',
                      type: 'solid',
                      colors: [color],
                      description: 'สีพื้นหลังกำหนดเอง',
                      textColor: '#ffffff',
                    });
                  }}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-700 bg-transparent"
                />
              </div>
            </div>
          )}

          {/* TAB 3: STICKERS */}
          {activeTab === 'stickers' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'krathong', label: 'กระทง' },
                  { id: 'lantern', label: 'โคมลอย' },
                  { id: 'light', label: 'เทียน/ธูป' },
                  { id: 'thai', label: 'ศิลป์ไทย' },
                  { id: 'text', label: 'ป้ายคำ' },
                  { id: 'decor', label: 'พลุ/ดาว' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setStickerCategory(c.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors text-[11px] ${
                      stickerCategory === c.id
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {STICKERS.filter(
                  (s) => stickerCategory === 'all' || s.category === stickerCategory
                ).map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => handleAddSticker(sticker.id)}
                    className="p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-amber-400 hover:bg-slate-800 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-90"
                    title={sticker.name}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: sticker.svgString }}
                    />
                    <span className="text-[9px] text-slate-300 text-center line-clamp-1">
                      {sticker.name}
                    </span>
                  </button>
                ))}
              </div>

              {activeSticker && (
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/30 space-y-2 mt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                    <span>ปรับแต่งสติกเกอร์ที่เลือก</span>
                    <button
                      onClick={() => {
                        setPlacedStickers((prev) =>
                          prev.filter((s) => s.instanceId !== activeSticker.instanceId)
                        );
                        setSelectedStickerId(null);
                      }}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบ</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[11px]">ขนาด:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={activeSticker.scale}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setPlacedStickers((prev) =>
                          prev.map((s) =>
                            s.instanceId === activeSticker.instanceId ? { ...s, scale: val } : s
                          )
                        );
                      }}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                    <span className="w-8 text-right font-mono text-amber-300 text-[11px]">
                      {Math.round(activeSticker.scale * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[11px]">หมุน:</span>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={activeSticker.rotation}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setPlacedStickers((prev) =>
                          prev.map((s) =>
                            s.instanceId === activeSticker.instanceId ? { ...s, rotation: val } : s
                          )
                        );
                      }}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                    <span className="w-8 text-right font-mono text-amber-300 text-[11px]">
                      {activeSticker.rotation}°
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TEXT CUSTOMIZATION */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-amber-300">ใส่ข้อความเพิ่มเติม</h3>
                <button
                  onClick={() => handleAddText()}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มข้อความ</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1 text-[10px]">
                {[
                  'สุขสันต์วันลอยกระทง ๒๕๖๗',
                  'เทศบาล ๕ วัดพระปฐมเจดีย์',
                  'Loy Krathong Festival',
                  'ขอขมาพระแม่คงคา',
                ].map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddText(phrase)}
                    className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-300 cursor-pointer transition-colors"
                  >
                    + {phrase}
                  </button>
                ))}
              </div>

              {activeText ? (
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/30 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                    <span>แก้ไขข้อความ</span>
                    <button
                      onClick={() => {
                        setPlacedTexts((prev) => prev.filter((t) => t.id !== activeText.id));
                        setSelectedTextId(null);
                      }}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบ</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">ข้อความ:</label>
                    <input
                      type="text"
                      value={activeText.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPlacedTexts((prev) =>
                          prev.map((t) => (t.id === activeText.id ? { ...t, text: val } : t))
                        );
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">สีข้อความ:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeText.color}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPlacedTexts((prev) =>
                            prev.map((t) => (t.id === activeText.id ? { ...t, color: val } : t))
                          );
                        }}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-700 bg-transparent"
                      />
                      <div className="flex items-center gap-1 flex-wrap">
                        {['#fef08a', '#ffffff', '#fbbf24', '#f43f5e', '#38bdf8', '#4ade80'].map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setPlacedTexts((prev) =>
                                prev.map((t) => (t.id === activeText.id ? { ...t, color: c } : t))
                              );
                            }}
                            className="w-5 h-5 rounded-full border border-slate-700 cursor-pointer transition-transform hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    {(['Kanit', 'Charm', 'Sarabun'] as const).map((font) => (
                      <button
                        key={font}
                        onClick={() => {
                          setPlacedTexts((prev) =>
                            prev.map((t) => (t.id === activeText.id ? { ...t, fontFamily: font } : t))
                          );
                        }}
                        className={`py-1 rounded-lg border cursor-pointer text-center ${
                          activeText.fontFamily === font
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-semibold'
                            : 'border-slate-700 bg-slate-900 text-slate-300'
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {font === 'Charm' ? 'ลายไทย' : font}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[11px]">ขนาด:</span>
                    <input
                      type="range"
                      min="14"
                      max="42"
                      value={activeText.fontSize}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setPlacedTexts((prev) =>
                          prev.map((t) => (t.id === activeText.id ? { ...t, fontSize: val } : t))
                        );
                      }}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                    <span className="w-8 text-right font-mono text-amber-300 text-[11px]">
                      {activeText.fontSize}
                    </span>
                  </div>

                  {/* Quick Center Alignment Controls */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPlacedTexts((prev) =>
                          prev.map((t) => (t.id === activeText.id ? { ...t, x: 50 } : t))
                        );
                      }}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        Math.round(activeText.x) === 50
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-400/60'
                      }`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                      <span>จัดกึ่งกลางแนวนอน</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPlacedTexts((prev) =>
                          prev.map((t) => (t.id === activeText.id ? { ...t, x: 50, y: 50 } : t))
                        );
                      }}
                      className="py-1.5 px-2 rounded-lg border border-slate-700 bg-slate-900 hover:border-amber-400/60 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>กึ่งกลางภาพ</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-dashed border-slate-800 text-center text-[11px] text-slate-400">
                  กดปุ่ม "+ เพิ่มข้อความ" หากต้องการพิมพ์ชื่อหรือข้อความอวยพรลงบนภาพ
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM EXPORT ACTIONS */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 space-y-2 shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>บันทึกรูป</span>
            </button>

            <button
              onClick={handleOpenQR}
              disabled={isExporting}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <QrCode className="w-4 h-4" />
              <span>สแกน QR</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isExporting}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์รูป</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 text-center">
            โรงเรียนเทศบาล ๕ วัดพระปฐมเจดีย์ • สืบสานประเพณีลอยกระทง
          </div>
        </div>
      </div>
    </div>
  );
};
