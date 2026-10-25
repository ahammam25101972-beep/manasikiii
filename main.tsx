import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      })
      .catch(() => {});
  }
  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => {
        for (const key of keys) {
          caches.delete(key);
        }
      })
      .catch(() => {});
  }
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9ff] text-[#003622] p-6 text-center font-sans"
        >
          <h1 className="text-xl font-bold mb-2">مَنَاسِكِي | Manasiki</h1>
          <p className="text-sm text-slate-600 mb-4">
            تم تحديث بيانات التطبيق، يرجى الضغط لإعادة التحميل الفوري.
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.clear();
              } catch {
                // ignore
              }
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#003622] text-white font-bold text-sm cursor-pointer shadow-md"
          >
            إعادة تشغيل التطبيق الآن
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

