import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 mx-auto max-w-sm bg-primary text-on-primary py-3 px-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-primary-fixed/20">
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="material-symbols-outlined text-secondary-fixed text-[22px] shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <span className="text-xs sm:text-sm font-medium leading-snug line-clamp-2">
          {message}
        </span>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white shrink-0"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
