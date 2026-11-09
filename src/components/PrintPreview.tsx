import React, { useState } from 'react';
import { Printer, X, Download, Share2, ExternalLink, Check } from 'lucide-react';

interface PrintPreviewProps {
  photoDataUrl: string;
  onClose: () => void;
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ photoDataUrl, onClose }) => {
  const [printSuccess, setPrintSuccess] = useState(false);

  // Method 1: Synchronous Native Print (Preserves iOS Safari & Chrome user gesture)
  const handlePrint = () => {
    setPrintSuccess(true);
    window.print();
  };

  // Method 2: Synchronous AirPrint / Share on iPad & iPhone (Zero async delay before navigator.share)
  const handleAirPrintShare = async () => {
    try {
      const file = dataUrlToFile(photoDataUrl, `loykrathong-photo-${Date.now()}.jpg`);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'พิมพ์รูปภาพวันลอยกระทง',
          files: [file],
        });
        setPrintSuccess(true);
      } else {
        handleOpenCleanTab();
      }
    } catch (err) {
      // If user cancelled share sheet, ignore; otherwise fallback to clean tab print
      if ((err as Error)?.name !== 'AbortError') {
        handleOpenCleanTab();
      }
    }
  };

  // Method 3: Standalone Top-Level Blob Page Print (Works even when iframe blocks window.print)
  const handleOpenCleanTab = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>พิมพ์รูปภาพวันลอยกระทง</title>
  <style>
    @page { size: auto; margin: 0mm; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    img {
      max-width: 100vw;
      max-height: 100vh;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
    }
  </style>
</head>
<body>
  <img src="${photoDataUrl}" onload="window.focus(); window.print();" />
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (win) {
      setPrintSuccess(true);
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `loykrathong-photo-${Date.now()}.jpg`;
    link.href = photoDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* 1. Print-Only Container: Hidden on screen, full-page centered photo in @media print */}
      <div className="hidden print:flex print-container">
        <img
          src={photoDataUrl}
          alt="พิมพ์รูปภาพโฟโต้บูท"
          className="print-target-image"
        />
      </div>

      {/* 2. On-Screen Preview Modal (Hidden in @media print) */}
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 no-print overflow-y-auto">
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full text-center relative shadow-2xl shadow-amber-500/20 my-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full mb-2 font-medium">
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์เฉพาะรูปภาพ 100%</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-100 font-kanit">
            สั่งพิมพ์รูปภาพโฟโต้บูท
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 mb-3">
            ระบบจัดหน้าสำหรับเครื่องพิมพ์ โดยตัดเมนูและปุ่มควบคุมทั้งหมดออกอัตโนมัติ
          </p>

          {/* Photo Preview Container */}
          <div className="w-full max-h-[46vh] overflow-hidden rounded-2xl bg-black/60 border border-slate-700/80 mb-4 flex items-center justify-center p-2">
            <img
              src={photoDataUrl}
              alt="ตัวอย่างก่อนพิมพ์"
              className="max-h-[42vh] w-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          {printSuccess && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 mb-3 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
              <Check className="w-4 h-4 shrink-0" />
              <span>เปิดหน้าต่างพิมพ์เรียบร้อยแล้ว</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Primary Print Button */}
            <button
              onClick={handlePrint}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/25 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>กดพิมพ์รูปภาพทันที (Print Now)</span>
            </button>

            {/* iPad / iPhone AirPrint */}
            <button
              onClick={handleAirPrintShare}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 border border-amber-500/30 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>พิมพ์ผ่าน AirPrint (iPad / iPhone)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleOpenCleanTab}
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                title="เปิดภาพเดี่ยวในแท็บใหม่เพื่อสั่งพิมพ์"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดหน้าพิมพ์แยก</span>
              </button>

              <button
                onClick={handleDownload}
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>บันทึกรูป</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-3">
            💡 สำหรับ iPad/iPhone สามารถแตะ "พิมพ์ผ่าน AirPrint" แล้วเลือก "Print" ในเมนูแชร์ หรือใช้ "เปิดหน้าพิมพ์แยก"
          </p>
        </div>
      </div>
    </>
  );
};
