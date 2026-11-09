import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, ExternalLink, Download, Check, AlertCircle, Smartphone, Eye } from 'lucide-react';

interface QRCodeModalProps {
  photoDataUrl: string;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ photoDataUrl, onClose }) => {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function uploadAndGenerateQR() {
      setIsLoading(true);
      setError(null);
      setQrImageUrl(null);

      try {
        const res = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: photoDataUrl }),
        });

        if (!res.ok) {
          throw new Error('ไม่สามารถอัปโหลดรูปภาพได้');
        }

        const data = (await res.json()) as {
          id: string;
          viewUrl: string;
          localUrl?: string;
          publicUrl?: string | null;
        };
        if (!isMounted) return;

        let finalUrl = data.publicUrl || data.viewUrl;
        if (!finalUrl.startsWith('http')) {
          finalUrl = `${window.location.origin}${finalUrl}`;
        }

        const generatedQr = await QRCode.toDataURL(finalUrl, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });

        if (!isMounted) return;

        setViewUrl(finalUrl);
        setIsPublic(Boolean(data.publicUrl));
        setQrImageUrl(generatedQr);

        if (!data.publicUrl) {
          setError('ไม่สามารถเชื่อมต่อคลาวด์ภายนอกได้ชั่วคราว กรุณากดปุ่ม "บันทึกลงเครื่อง" ด้านล่างแทน');
        }
      } catch (err) {
        console.error('QR creation error:', err);
        if (!isMounted) return;
        setError('เกิดข้อผิดพลาดในการสร้าง QR Code กรุณากดปุ่ม "บันทึกลงเครื่อง" ด้านล่างแทน');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    uploadAndGenerateQR();

    return () => {
      isMounted = false;
    };
  }, [photoDataUrl]);

  const copyLink = () => {
    if (viewUrl) {
      navigator.clipboard.writeText(viewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectDownload = () => {
    const link = document.createElement('a');
    link.download = `loykrathong-photo-${Date.now()}.jpg`;
    link.href = photoDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 max-w-sm w-full text-center relative shadow-2xl shadow-amber-500/20 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full mb-2 font-medium">
          <Smartphone className="w-3.5 h-3.5" />
          <span>สแกนรับภาพบนมือถือ & iPad</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-100 font-kanit">
          สแกน QR เพื่อรับรูปภาพ
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 mb-3">
          {isPublic
            ? 'เปิดกล้องมือถือสแกน แล้วแตะค้างที่รูปเพื่อบันทึกลงเครื่องได้ทันที'
            : 'กำลังเตรียมลิงก์รูปภาพความละเอียดสูงสำหรับดาวน์โหลด'}
        </p>

        {/* QR Code Image Box */}
        <div className="bg-white p-3 rounded-2xl shadow-inner mx-auto mb-3 w-[250px] h-[250px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-700 font-medium">กำลังสร้าง QR Code...</span>
            </div>
          ) : qrImageUrl ? (
            <img
              src={qrImageUrl}
              alt="QR Code รับรูปภาพ"
              className="w-full h-full object-contain rounded-lg block"
            />
          ) : (
            <div className="text-xs text-slate-600 px-3">
              ไม่สามารถสร้าง QR Code ได้ กรุณากดบันทึกรูปด้านล่าง
            </div>
          )}
        </div>

        {isPublic && !isLoading && (
          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mb-2 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" />
            <span>พร้อมสแกนรับภาพโดยไม่ต้องล็อกอิน</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400/90 mb-3 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions under QR */}
        <div className="space-y-2">
          <button
            onClick={handleDirectDownload}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>บันทึกลง iPad / มือถือเครื่องนี้ทันที</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {viewUrl && (
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดดูรูป</span>
              </a>
            )}

            <button
              onClick={() => setShowFullPreview(true)}
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-700 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>ดูรูปขนาดเต็ม</span>
            </button>
          </div>

          {viewUrl && (
            <button
              onClick={copyLink}
              className="w-full py-1.5 px-2 text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? '✓ คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์รูปภาพ'}
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-500 mt-2">
          โรงเรียนเทศบาล ๕ วัดพระปฐมเจดีย์
        </p>
      </div>

      {/* Full Preview Modal for tap-and-hold saving on iPad/iPhone */}
      {showFullPreview && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-3">
          <button
            onClick={() => setShowFullPreview(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800 text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <p className="text-xs text-amber-300 mb-2">
            💡 กดค้างที่รูปภาพ เพื่อเลือก "บันทึกรูปภาพ" (Save to Photos)
          </p>
          <img
            src={photoDataUrl}
            alt="รูปภาพขนาดเต็ม"
            className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
