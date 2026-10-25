import React, { useState } from 'react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompanion: (name: string, relation: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onAddCompanion,
}) => {
  const [manualName, setManualName] = useState('');
  const [manualRelation, setManualRelation] = useState('مرافق');
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(false);
    setTimeout(() => {
      onAddCompanion('عبد الله الهاشمي', 'شقيق');
      onClose();
    }, 800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    onAddCompanion(manualName.trim(), manualRelation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/30 text-right flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">qr_code_scanner</span>
            <h3 className="font-bold text-base text-primary">إضافة رفيق إلى الرادار</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Camera simulation viewport */}
        <div className="relative w-full h-48 rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-primary/40">
          {/* Laser scanline */}
          <div className="absolute inset-x-4 h-0.5 bg-secondary shadow-[0_0_8px_#ffdea5] animate-bounce"></div>

          {/* QR target box */}
          <div className="w-32 h-32 border-2 border-dashed border-secondary/80 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white/50 text-[36px]">qr_code_2</span>
          </div>

          <div className="absolute bottom-2 inset-x-0 text-center">
            <span className="text-[11px] text-white/90 bg-black/60 px-3 py-1 rounded-full font-medium">
              وجّه الكاميرا نحو باركود بطاقة الحاج
            </span>
          </div>
        </div>

        {/* Demo Fast Scan Button */}
        <button
          onClick={handleSimulateScan}
          className="w-full py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs hover:bg-secondary-fixed-dim transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          <span>مسح تجريبي لبطاقة مرافق</span>
        </button>

        {/* Or manual entry */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-outline-variant/20"></div>
          <span className="flex-shrink mx-2 text-[10px] text-on-surface-variant">أو الإدخال اليدوي</span>
          <div className="flex-grow border-t border-outline-variant/20"></div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-2 text-xs">
          <input
            type="text"
            placeholder="اسم الرفيق أو الحاج"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none"
          />
          <div className="flex gap-2">
            <select
              value={manualRelation}
              onChange={(e) => setManualRelation(e.target.value)}
              className="flex-1 h-10 px-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none"
            >
              <option value="مرافق">مرافق</option>
              <option value="شقيق">شقيق</option>
              <option value="والدة">والدة</option>
              <option value="ابن">ابن</option>
              <option value="صديق">صديق</option>
            </select>
            <button
              type="submit"
              className="px-4 h-10 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container cursor-pointer"
            >
              إضافة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
