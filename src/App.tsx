import React, { useState } from 'react';
import { LAYOUTS } from './constants/layouts';
import { LayoutConfig } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CameraCapture } from './components/CameraCapture';
import { EditorView } from './components/EditorView';
import { QRCodeModal } from './components/QRCodeModal';
import { PrintPreview } from './components/PrintPreview';

type AppStep = 'welcome' | 'camera' | 'editor';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [selectedLayout, setSelectedLayout] = useState<LayoutConfig>(LAYOUTS[1]); // Default 3-shot strip
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // Modals
  const [qrPhotoDataUrl, setQrPhotoDataUrl] = useState<string | null>(null);
  const [printPhotoDataUrl, setPrintPhotoDataUrl] = useState<string | null>(null);

  // Transitions
  const handleStartCapture = () => {
    setCapturedPhotos([]);
    setCurrentStep('camera');
  };

  const handlePhotosCaptured = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentStep('editor');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
  };

  const handleBackToCamera = () => {
    setCurrentStep('camera');
  };

  return (
    <main className="w-full min-h-screen bg-slate-950 text-slate-100 font-kanit">
      {currentStep === 'welcome' && (
        <WelcomeScreen
          selectedLayout={selectedLayout}
          onSelectLayout={setSelectedLayout}
          onStartCapture={handleStartCapture}
        />
      )}

      {currentStep === 'camera' && (
        <CameraCapture
          layout={selectedLayout}
          onPhotosCaptured={handlePhotosCaptured}
          onBack={handleBackToWelcome}
        />
      )}

      {currentStep === 'editor' && (
        <EditorView
          layout={selectedLayout}
          photos={capturedPhotos}
          onBackToCamera={handleBackToCamera}
          onOpenQR={(dataUrl) => setQrPhotoDataUrl(dataUrl)}
          onPrintPhoto={(dataUrl) => setPrintPhotoDataUrl(dataUrl)}
        />
      )}

      {/* QR Code Modal for Scanning from Phone */}
      {qrPhotoDataUrl && (
        <QRCodeModal
          photoDataUrl={qrPhotoDataUrl}
          onClose={() => setQrPhotoDataUrl(null)}
        />
      )}

      {/* Print Preview Component (Guarantees ONLY photo is sent to printer) */}
      {printPhotoDataUrl && (
        <PrintPreview
          photoDataUrl={printPhotoDataUrl}
          onClose={() => setPrintPhotoDataUrl(null)}
        />
      )}
    </main>
  );
}
