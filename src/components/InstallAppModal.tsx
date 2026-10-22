import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const { isInstallable, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'iphone' | 'android' | 'qr'>('iphone');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        onShowToast('تم تثبيت تطبيق مناسِكي بنجاح على هاتفك!');
        onClose();
      }
    } else {
      onShowToast('اتبع الخطوات الموضحة لتثبيت التطبيق على جهازك مجاناً');
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/30 text-right flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">تثبيت التطبيق مجاناً</span>
            <span className="material-symbols-outlined text-secondary text-[22px]">download_for_offline</span>
          </div>
        </div>

        {/* Brand App Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/15">
          <img src="/icon.svg" alt="Manasiki" className="w-12 h-12 rounded-xl shadow-md" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-primary">مَنَاسِكِي | Manasiki</span>
            <span className="text-xs text-secondary font-medium">تطبيق كامل بدون شريط متصفح وبلا إنترنت</span>
          </div>
        </div>

        {/* Tabs: iPhone vs Android vs QR */}
        <div className="bg-surface-container p-1 rounded-xl flex items-center text-xs font-bold">
          <button
            onClick={() => setActiveTab('iphone')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'iphone'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            هواتف آيفون (iOS)
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'android'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            أندرويد (Android)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            باركود للحجاج
          </button>
        </div>

        {/* Content Tab 1: iPhone (iOS) */}
        {activeTab === 'iphone' && (
          <div className="space-y-3 text-xs">
            <p className="text-on-surface-variant leading-relaxed">
              تتيح شركة آبل تثبيت التطبيق مباشرةً على الآيفون والآيباد <strong>مجاناً ودون الحاجة لمتجر App Store</strong> عبر الخطوات التالية في متصفح سفاري (Safari):
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0 text-xs">1</span>
                <div>
                  <span className="font-bold text-on-surface block">اضغط زر المشاركة (Share):</span>
                  <span className="text-on-surface-variant text-[11px]">الأيقونة المربعة مع سهم للأعلى في أسفل شاشة سفاري.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0 text-xs">2</span>
                <div>
                  <span className="font-bold text-on-surface block">اختر «إضافة إلى الشاشة الرئيسية»:</span>
                  <span className="text-on-surface-variant text-[11px]">(Add to Home Screen) بجانب علامة الزائد [+].</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0 text-xs">3</span>
                <div>
                  <span className="font-bold text-on-surface block">اضغط «إضافة» (Add):</span>
                  <span className="text-on-surface-variant text-[11px]">سيظهر التطبيق فوراً على شاشة الآيفون كأيقونة مستقلة تفتح بملء الشاشة بدون متصفح.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 2: Android */}
        {activeTab === 'android' && (
          <div className="space-y-3 text-xs">
            <p className="text-on-surface-variant leading-relaxed">
              على أجهزة سامسونج وشاومي وهواوي وباقي أجهزة أندرويد، يمكنك التثبيت بضغطة زر واحدة:
            </p>

            {isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-[18px]">install_mobile</span>
                <span>تثبيت التطبيق الآن على الهاتف</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0 text-xs">1</span>
                  <div>
                    <span className="font-bold text-on-surface block">اضغط على زر الخيارات (⋮) أعلى متصفح كروم.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0 text-xs">2</span>
                  <div>
                    <span className="font-bold text-on-surface block">اختر «تثبيت التطبيق» أو «الإضافة إلى الشاشة الرئيسية».</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-secondary-container/20 text-secondary text-[11px] font-medium">
              💡 كما يمكنك أيضاً تصدير ملف APK مجاناً وتوزيعه بالواتساب أو رفعه على متاجر مجانية مثل متجر هواوي الرسمي أو Uptodown.
            </div>
          </div>
        )}

        {/* Content Tab 3: QR Code sharing for pilgrims */}
        {activeTab === 'qr' && (
          <div className="space-y-3 text-xs text-center">
            <p className="text-on-surface-variant">
              يمكنك طباعة هذا الباركود في مخيم الحملة أو كروت الحجاج، ليمسحه أي حاج بكاميرا هاتفه ويتثبت التطبيق فوراً:
            </p>

            {/* QR code container */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-inner border border-outline-variant/30 flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  currentUrl
                )}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(currentUrl);
                  onShowToast('تم نسخ رابط التطبيق المباشر للحافظة!');
                }
              }}
              className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>نسخ رابط التطبيق المباشر</span>
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors cursor-pointer"
        >
          تم، شكراً
        </button>
      </div>
    </div>
  );
};
