import React, { useState } from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isCalling, setIsCalling] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      onConfirm();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-6 flex flex-col gap-4 shadow-2xl text-center border border-error/30">
        <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container mx-auto flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[36px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            ambulance
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-on-surface">استدعاء المسعف الميداني</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            سيتم إرسال إشعار فوري لطبيب المخيم مع إحداثيات سريرك بدقة:
            <br />
            <strong className="text-primary mt-1 inline-block">جناح (ج) - سرير 18 • مخيم 42 منى</strong>
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleConfirm}
            disabled={isCalling}
            className="w-full py-3.5 rounded-xl bg-error text-on-error font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer hover:bg-error/90"
          >
            {isCalling ? 'جاري توجيه الفريق الطبي إليك...' : 'تأكيد إرسال النداء الطبي فوراً'}
          </button>
          <button
            onClick={onClose}
            disabled={isCalling}
            className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-medium text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
