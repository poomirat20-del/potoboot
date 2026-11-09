import React from 'react';
import { Camera, Sparkles, Image as ImageIcon, QrCode, Printer, ChevronRight } from 'lucide-react';
import { LAYOUTS } from '../constants/layouts';
import { LayoutConfig, LayoutMode } from '../types';

interface WelcomeScreenProps {
  selectedLayout: LayoutConfig;
  onSelectLayout: (layout: LayoutConfig) => void;
  onStartCapture: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedLayout,
  onSelectLayout,
  onStartCapture,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden welcome-screen">
      {/* Ambient Night Sky & Glowing Stupa Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial glowing full moon */}
        <div className="absolute -top-24 right-10 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />

        {/* Floating sky lanterns in background */}
        <div className="absolute top-12 left-16 w-3 h-5 bg-amber-400/40 rounded-t-full blur-xs animate-float-slow" />
        <div className="absolute top-28 right-24 w-4 h-6 bg-amber-300/50 rounded-t-full blur-xs animate-float-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-44 left-1/3 w-3 h-4 bg-amber-400/30 rounded-t-full blur-xs animate-float-slow" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Header Badge & Title */}
      <div className="relative z-10 max-w-2xl w-full mx-auto text-center pt-4 md:pt-8">
        <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs md:text-sm px-4 py-1.5 rounded-full mb-4 font-medium backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>ประเพณีลอยกระทง ๒๕๖๗</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold font-kanit tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_2px_18px_rgba(245,158,11,0.4)]">
          ลอยกระทงโฟโต้บูท
        </h1>
        <p className="text-base md:text-lg text-amber-200/90 font-medium font-kanit mt-1">
          By เทศบาล ๕ วัดพระปฐมเจดีย์
        </p>
        <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          บันทึกภาพความทรงจำค่ำคืนวันเพ็ญเดือนสิบสอง เลือกกรอบลายไทย สติกเกอร์กระทง และสแกน QR โหลดรูปลงโทรศัพท์ทันที
        </p>
      </div>

      {/* Main Card: Layout Selection */}
      <div className="relative z-10 max-w-2xl w-full mx-auto my-6 bg-slate-900/80 border border-amber-500/20 backdrop-blur-xl rounded-3xl p-5 md:p-8 shadow-2xl shadow-amber-500/10">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-slate-100 font-kanit">
              เลือกรูปแบบโฟโต้บูท (Layout)
            </h2>
            <p className="text-xs text-slate-400">เลือกจำนวนช็อตและสไตล์ที่ต้องการถ่าย</p>
          </div>
          <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg">
            {LAYOUTS.length} รูปแบบ
          </span>
        </div>

        {/* Layout Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LAYOUTS.map((layout) => {
            const isSelected = selectedLayout.id === layout.id;
            return (
              <button
                key={layout.id}
                onClick={() => onSelectLayout(layout)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/15 scale-[1.02]'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                {/* Visual miniature representation */}
                <div
                  className={`w-14 h-20 rounded-lg border-2 mb-2.5 flex flex-col justify-evenly p-1 transition-colors ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/40'
                      : 'border-slate-700 bg-slate-950/40 group-hover:border-slate-600'
                  }`}
                >
                  {layout.id === '1-shot' && (
                    <div className="w-full h-full bg-amber-400/40 rounded-sm" />
                  )}
                  {layout.id === '3-shot-strip' && (
                    <>
                      <div className="w-full h-4 bg-amber-400/40 rounded-xs" />
                      <div className="w-full h-4 bg-amber-400/40 rounded-xs" />
                      <div className="w-full h-4 bg-amber-400/40 rounded-xs" />
                    </>
                  )}
                  {layout.id === '4-shot-strip' && (
                    <>
                      <div className="w-full h-3 bg-amber-400/40 rounded-xs" />
                      <div className="w-full h-3 bg-amber-400/40 rounded-xs" />
                      <div className="w-full h-3 bg-amber-400/40 rounded-xs" />
                      <div className="w-full h-3 bg-amber-400/40 rounded-xs" />
                    </>
                  )}
                  {layout.id === '4-shot-grid' && (
                    <div className="grid grid-cols-2 gap-1 w-full h-full">
                      <div className="bg-amber-400/40 rounded-xs" />
                      <div className="bg-amber-400/40 rounded-xs" />
                      <div className="bg-amber-400/40 rounded-xs" />
                      <div className="bg-amber-400/40 rounded-xs" />
                    </div>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-amber-300' : 'text-slate-200'
                  }`}
                >
                  {layout.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">{layout.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Features highlight pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-800 text-center">
          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-950/40">
            <Camera className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] text-slate-200 font-medium">กล้องหน้า / หลัง</span>
            <span className="text-[9px] text-slate-400">นับถอยหลัง 3 วินาที</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-950/40">
            <ImageIcon className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] text-slate-200 font-medium">12 กรอบรูป</span>
            <span className="text-[9px] text-slate-400">ลายไทย & พระปฐมเจดีย์</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-950/40">
            <QrCode className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] text-slate-200 font-medium">สแกน QR โหลดรูป</span>
            <span className="text-[9px] text-slate-400">เปิดเฉพาะรูปบนมือถือ</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-950/40">
            <Printer className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] text-slate-200 font-medium">สั่งพิมพ์รูปภาพ</span>
            <span className="text-[9px] text-slate-400">พิมพ์เฉพาะภาพไร้เมนู</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartCapture}
          className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer font-kanit"
        >
          <Camera className="w-5 h-5 text-slate-950" />
          <span>เริ่มถ่ายภาพ ({selectedLayout.name})</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer credits */}
      <div className="relative z-10 text-center pb-2 text-xs text-slate-500">
        <p>โรงเรียนเทศบาล ๕ วัดพระปฐมเจดีย์ สังกัดเทศบาลนครนครปฐม</p>
        <p className="text-[11px] text-amber-500/70 mt-0.5">ร่วมสืบสานคุณค่ามรดกวัฒนธรรมประเพณีลอยกระทงไทย</p>
      </div>
    </div>
  );
};
