import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [selectedScreens, setSelectedScreens] = useState<string[]>(['luggage', 'camp']);

  if (!isOpen) return null;

  const screens = [
    { id: 'luggage', label: 'حقيبة الاستعداد لرحلة العمر (القوائم والتجهيزات)' },
    { id: 'radar', label: 'الخريطة والرادار ومؤشر الزحام اللحظي' },
    { id: 'camp', label: 'مخيم وفادة لضيوف الرحمن والخدمات الميدانية' },
    { id: 'counter', label: 'عداد الطواف والسعي ودليل المناسك' },
  ];

  const toggleScreen = (id: string) => {
    setSelectedScreens((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedScreens.length === screens.length) {
      setSelectedScreens([]);
    } else {
      setSelectedScreens(screens.map((s) => s.id));
    }
  };

  const handleExport = () => {
    if (selectedScreens.length === 0) {
      onShowToast('يرجى تحديد شاشة واحدة على الأقل للتصدير.');
      return;
    }

    const selectedDetails = screens.filter((s) => selectedScreens.includes(s.id));
    const reportHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير الشاشات المصدرة - تطبيق مناسكي</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Tajawal', sans-serif; padding: 30px; background: #f8fafc; color: #1e293b; direction: rtl; }
    .header { border-bottom: 2px solid #047857; padding-bottom: 12px; margin-bottom: 20px; }
    .card { background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .btn { background: #047857; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
    @media print { .no-print { display: none !important; } body { background: white; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; background: #064e3b; color: white; padding: 12px 20px; border-radius: 10px;">
    <h3 style="margin: 0;">ملف تقرير الشاشات المصدرة - مَنَاسِكِي</h3>
    <button class="btn" onclick="window.print()">🖨️ طباعة الآن (Ctrl+P)</button>
  </div>
  <div class="header">
    <h1 style="color: #047857; margin-bottom: 6px;">مَنَاسِكِي | MANASIKI - تقرير الشاشات المعتمدة</h1>
    <p style="color: #64748b; font-size: 13px;">تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  <div>
    ${selectedDetails
      .map(
        (s, idx) => `
      <div class="card">
        <h3 style="color: #047857; margin-bottom: 6px;">${idx + 1}. ${s.label}</h3>
        <p style="color: #475569; font-size: 13px;">• متوافقة مع العمل 100% دون إنترنت (Offline-First).</p>
        <p style="color: #475569; font-size: 13px;">• تدعم أنظمة شركات السياحة (B2B) والمعتمرين الأفراد (B2C).</p>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_شاشات_مناسكي_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);

    onShowToast(`تم تنزيل تقرير ${selectedScreens.length} شاشات للطباعة والحفظ كـ PDF بنجاح!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 text-left">
        {/* Top bar with Export title and close button */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          <span className="font-bold text-base text-primary">Export Screens / تصدير</span>
        </div>

        {/* Central Graphic Box */}
        <div className="flex flex-col items-center justify-center py-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-2 text-primary border border-outline-variant/20">
            <span className="material-symbols-outlined text-[32px]">crop_free</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">
            {selectedScreens.length > 0
              ? `${selectedScreens.length} Screens Selected`
              : 'No screens selected'}
          </h4>
          <p className="text-xs text-on-surface-variant mt-0.5 max-w-[240px]">
            حدد الشاشات المطلوب تصديرها كملف PDF أو ملخص للمرافقين
          </p>
        </div>

        {/* Screen Selection Checkboxes */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px] mb-1">
            <span>QUICK TIPS:</span>
            <button
              onClick={handleSelectAll}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              {selectedScreens.length === screens.length ? 'إلغاء التحديد' : 'Select All (تحديد الكل)'}
            </button>
          </div>

          {screens.map((sc) => {
            const isChecked = selectedScreens.includes(sc.id);
            return (
              <label
                key={sc.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  isChecked
                    ? 'border-primary bg-primary/5 text-primary font-bold'
                    : 'border-outline-variant/20 hover:bg-surface-container text-on-surface'
                }`}
              >
                <span className="truncate pr-2 text-right">{sc.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleScreen(sc.id)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
                />
              </label>
            );
          })}
        </div>

        {/* Export CTA Button */}
        <button
          onClick={handleExport}
          className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
            selectedScreens.length > 0
              ? 'bg-primary text-on-primary hover:bg-primary-container'
              : 'bg-surface-container text-on-surface-variant opacity-60'
          }`}
        >
          {selectedScreens.length > 0 ? `Export (${selectedScreens.length} Screens)` : 'Select a Screen to Export'}
        </button>
      </div>
    </div>
  );
};
