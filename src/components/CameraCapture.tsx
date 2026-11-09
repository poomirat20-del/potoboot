import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Sparkles, Upload, RotateCcw, Check, Volume2, VolumeX, Eye } from 'lucide-react';
import { LayoutConfig } from '../types';
import { soundPlayer } from '../utils/audio';

interface CameraCaptureProps {
  layout: LayoutConfig;
  onPhotosCaptured: (photos: string[]) => void;
  onBack: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ layout, onPhotosCaptured, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mirror, setMirror] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Capture State
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturingSession, setIsCapturingSession] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [activeShotIndex, setActiveShotIndex] = useState(0);

  // Initialize Camera
  const startCamera = useCallback(async () => {
    setIsCameraReady(false);
    setCameraError(null);

    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง หรือเลือกอัปโหลดรูปภาพแทน');
      setIsCameraReady(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // Flip camera front / rear
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setMirror(nextMode === 'user');
  };

  // Capture single frame from video stream
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.save();
    if (mirror && facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.95);
  }, [mirror, facingMode]);

  // Trigger Flash effect & sound
  const triggerFlash = useCallback(() => {
    if (soundEnabled) {
      soundPlayer.playShutter();
    }
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
  }, [soundEnabled]);

  // Start Automated Multi-shot or Single-shot sequence
  const startCaptureSequence = () => {
    if (isCapturingSession) return;
    setIsCapturingSession(true);
    setCapturedPhotos([]);
    setActiveShotIndex(0);

    runSingleShotCycle(0, []);
  };

  const runSingleShotCycle = (shotIndex: number, accumulatedPhotos: string[]) => {
    setActiveShotIndex(shotIndex);
    let count = 3;
    setCountdown(count);
    if (soundEnabled) soundPlayer.playBeep(false);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        if (soundEnabled) soundPlayer.playBeep(false);
      } else if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        triggerFlash();

        const photoData = captureFrame();
        const updatedPhotos = photoData ? [...accumulatedPhotos, photoData] : accumulatedPhotos;
        setCapturedPhotos(updatedPhotos);

        if (updatedPhotos.length < layout.shotsCount) {
          // Pause 2 seconds before next shot so user can change poses!
          setTimeout(() => {
            runSingleShotCycle(shotIndex + 1, updatedPhotos);
          }, 1800);
        } else {
          // Finished all shots!
          setIsCapturingSession(false);
          if (soundEnabled) soundPlayer.playCelebration();
        }
      }
    }, 1000);
  };

  // Upload photo from device gallery fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push(event.target.result as string);
          if (newPhotos.length === Math.min(files.length, layout.shotsCount)) {
            // Fill or append
            setCapturedPhotos((prev) => {
              const combined = [...prev, ...newPhotos].slice(0, layout.shotsCount);
              return combined;
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Retake individual photo
  const retakeSingle = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const isComplete = capturedPhotos.length === layout.shotsCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-3 md:p-6 camera-screen">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Screen Flash Overlay */}
      {isFlashing && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-3 border-b border-amber-500/20">
        <button
          onClick={onBack}
          disabled={isCapturingSession}
          className="text-sm px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>เปลี่ยนรูปแบบ ({layout.name})</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all cursor-pointer"
            title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={toggleFacingMode}
            disabled={isCapturingSession}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 text-amber-400 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="สลับกล้องหน้า/หลัง"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{facingMode === 'user' ? 'กล้องหน้า' : 'กล้องหลัง'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewfinder Area */}
      <div className="max-w-3xl w-full mx-auto my-auto py-2 flex flex-col items-center">
        {/* Progress Bar of Shots */}
        <div className="w-full flex items-center justify-between mb-2 px-2 text-xs text-amber-200/90">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold">{layout.name}</span>
          </div>
          <div>
            ช็อตที่ {capturedPhotos.length} / {layout.shotsCount}
          </div>
        </div>

        {/* Viewfinder Container */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[62vh] rounded-2xl overflow-hidden bg-black border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 flex items-center justify-center">
          {/* Video Stream */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`w-full h-full object-cover transition-transform duration-300 ${
              mirror && facingMode === 'user' ? '-scale-x-100' : ''
            }`}
          />

          {/* Camera Loading or Error */}
          {!isCameraReady && !cameraError && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">กำลังเชื่อมต่อกล้อง...</p>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center">
              <Camera className="w-12 h-12 text-amber-400/60 mb-3" />
              <p className="text-amber-200 text-sm max-w-md mb-4">{cameraError}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Upload className="w-4 h-4" />
                เลือกรูปภาพจากมือถือ / คอมพิวเตอร์
              </button>
            </div>
          )}

          {/* Countdown Indicator Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs z-30">
              <div className="text-8xl md:text-9xl font-bold font-kanit text-amber-300 drop-shadow-[0_0_35px_rgba(251,191,36,0.9)] animate-ping">
                {countdown}
              </div>
              <p className="text-base text-amber-100 font-medium mt-4 bg-slate-900/80 px-4 py-1.5 rounded-full border border-amber-400/40">
                ยิ้มสวยๆ สำหรับช็อตที่ {activeShotIndex + 1}! ✨
              </p>
            </div>
          )}

          {/* Target Face Guides */}
          {isCameraReady && !isCapturingSession && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-60 md:w-56 md:h-72 border-2 border-dashed border-amber-400/25 rounded-[45%] flex items-center justify-center">
                <span className="text-[11px] text-amber-300/40 font-light tracking-wide bg-slate-950/40 px-2 py-0.5 rounded">
                  จัดตำแหน่งใบหน้าตรงนี้
                </span>
              </div>
            </div>
          )}

          {/* Mirror toggle pill */}
          {facingMode === 'user' && (
            <button
              onClick={() => setMirror(!mirror)}
              className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-amber-300 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 z-20 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{mirror ? 'กระจกเงา (เปิด)' : 'กระจกเงา (ปิด)'}</span>
            </button>
          )}
        </div>

        {/* Thumbnails of Captured Shots */}
        <div className="w-full mt-3 flex items-center justify-center gap-2 overflow-x-auto py-1">
          {Array.from({ length: layout.shotsCount }).map((_, index) => {
            const photo = capturedPhotos[index];
            const isCurrent = activeShotIndex === index && isCapturingSession;

            return (
              <div
                key={index}
                className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all ${
                  photo
                    ? 'border-amber-400 shadow-md shadow-amber-500/20 bg-slate-900'
                    : isCurrent
                    ? 'border-amber-400 animate-pulse bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                {photo ? (
                  <>
                    <img src={photo} alt={`ช็อตที่ ${index + 1}`} className="w-full h-full object-cover" />
                    {!isCapturingSession && (
                      <button
                        onClick={() => retakeSingle(index)}
                        className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-amber-200 transition-opacity cursor-pointer"
                        title="ถ่ายใหม่ช็อตนี้"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mb-0.5" />
                        <span>ถ่ายใหม่</span>
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">#{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="max-w-xl w-full mx-auto pt-2 pb-1 flex flex-col items-center gap-3">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={layout.shotsCount > 1}
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex items-center justify-center gap-4 w-full">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isCapturingSession}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer disabled:opacity-50 text-xs"
            title="อัปโหลดรูปจากเครื่อง"
          >
            <Upload className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline text-[11px]">อัปโหลดรูป</span>
          </button>

          {/* Shutter Capture Button */}
          <button
            onClick={startCaptureSequence}
            disabled={!isCameraReady || isCapturingSession}
            className={`relative group px-8 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              isCapturingSession
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/30 active:scale-95'
            }`}
          >
            <div className="w-6 h-6 rounded-full border-2 border-slate-950 flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-slate-950 rounded-full group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-base tracking-wide font-medium">
              {isCapturingSession
                ? `กำลังถ่ายช็อตที่ ${activeShotIndex + 1}...`
                : capturedPhotos.length > 0
                ? 'ถ่ายรูปใหม่ทั้งหมด'
                : `เริ่มถ่ายภาพ (${layout.shotsCount} ช็อต)`}
            </span>
          </button>

          {/* Ready & Proceed to Decorate Button */}
          {capturedPhotos.length > 0 && (
            <button
              onClick={() => onPhotosCaptured(capturedPhotos)}
              disabled={isCapturingSession}
              className="p-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all flex flex-col sm:flex-row items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30 text-xs"
            >
              <Check className="w-5 h-5" />
              <span>แต่งรูปต่อ {isComplete ? '' : `(${capturedPhotos.length}/${layout.shotsCount})`}</span>
            </button>
          )}
        </div>

        <p className="text-[12px] text-slate-400 text-center">
          💡 ระบบจะนับถอยหลัง 3 วินาทีอัตโนมัติก่อนลั่นชัตเตอร์ในแต่ละช็อต
        </p>
      </div>
    </div>
  );
};
