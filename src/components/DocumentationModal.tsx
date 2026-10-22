import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  downloadBrochureHtml,
  downloadWordDoc,
  openBrochureInNewTab,
  executePrintOrExport,
  copyBrochureSummaryToClipboard,
} from '../utils/printDocGenerator';
import { PREP_SCREEN_IMAGE_BASE64 } from '../utils/prepScreenImageBase64';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  onShowToast?: (msg: string) => void;
}

// Visual Phone Mockup Component to show real screen previews inside documentation
const ScreenPhoneMockup: React.FC<{
  type: 'home' | 'prep' | 'radar' | 'camp' | 'counter' | 'company';
  companyName: string;
}> = ({ type, companyName }) => {
  return (
    <div className="w-full max-w-[210px] mx-auto bg-slate-900 p-2 rounded-[22px] border-2 border-slate-700 shadow-xl shrink-0 select-none">
      {/* Outer Phone Shell */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-[16px] overflow-hidden border border-slate-200 dark:border-slate-800 text-[10px] flex flex-col h-[280px]">
        {/* Status Bar */}
        <div className="bg-emerald-800 text-white px-2.5 py-1 flex items-center justify-between text-[8px] font-bold shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>100% دون إنترنت</span>
          </div>
        </div>

        {/* Screen Specific Content */}
        {type === 'home' && (
          <div className="p-2 space-y-1.5 overflow-hidden flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="bg-emerald-700 text-white p-2 rounded-lg text-center shadow-xs">
              <div className="text-[7.5px] opacity-90 truncate">{companyName}</div>
              <div className="font-bold text-[10px] mt-0.5">الحاج / أحمد محمود</div>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[7.5px] font-bold">
                شارة حاج #8412
              </span>
            </div>

            <div className="bg-amber-50 border-r-2 border-amber-600 p-1.5 rounded text-[8px] space-y-0.5">
              <div className="font-bold text-amber-900">منسك اليوم: طواف الإفاضة</div>
              <div className="text-slate-500 text-[7.5px]">متبقي للتفويج: 01:45:00</div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[8px]">
              <div className="bg-white p-1 rounded border border-slate-200 text-center shadow-2xs">
                <span className="block text-[12px]">🕋</span>
                <span className="font-bold">عداد الطواف</span>
              </div>
              <div className="bg-white p-1 rounded border border-slate-200 text-center shadow-2xs">
                <span className="block text-[12px]">📡</span>
                <span className="font-bold">رادار الرفاق</span>
              </div>
            </div>

            <div className="bg-slate-100 p-1.5 rounded text-[8px] border border-slate-200">
              <div className="font-bold text-slate-900 truncate">فندق برج الصفوة - مكة</div>
              <div className="text-slate-600 text-[7.5px]">غرفة 1408 • 320م للحرم</div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 p-1 rounded text-center text-[7.5px] font-bold border border-emerald-200">
              📞 مشرف الفوج: أ. إبراهيم (متاح)
            </div>
          </div>
        )}

        {type === 'prep' && (
          <div className="p-2 space-y-1.5 overflow-hidden flex flex-col justify-between h-full bg-slate-900 text-slate-100">
            {/* Top Subtitle */}
            <div className="flex items-center justify-between text-[7px] text-emerald-400">
              <span className="truncate">رحلة الحج 1446هـ</span>
              <span className="bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800 text-amber-300">متبقي 6 أيام</span>
            </div>

            {/* Title */}
            <div className="text-[9px] font-black text-white leading-tight">
              حقيبة الاستعداد لرحلة العمر
            </div>

            {/* Circular Gauge Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-1.5 rounded-lg border border-emerald-600/50 flex items-center gap-2 shadow-xs">
              <div className="w-11 h-11 rounded-full border-2 border-emerald-400 flex flex-col items-center justify-center shrink-0 bg-emerald-900/70">
                <span className="font-black text-[9px] text-amber-300">82%</span>
                <span className="text-[5.5px] text-emerald-200">المكتمل</span>
              </div>
              <div className="text-[7.5px] leading-tight space-y-0.5 min-w-0">
                <div className="font-bold text-amber-200 truncate">جاهزية استثنائية</div>
                <div className="text-[6.5px] text-emerald-200">14 من 17 مهمة أنجزت</div>
                <div className="w-full bg-emerald-950 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-400 h-full w-[82%]"></div>
                </div>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-amber-950/60 border-r-2 border-amber-500 p-1 rounded text-[7px] text-amber-200 leading-tight">
              <span className="font-bold text-amber-400">💡 نصيحة مناسكي:</span> أدوية الطوارئ والتقارير بحقيبة يدك بالطائرة.
            </div>

            {/* Categories */}
            <div className="space-y-0.5 bg-slate-800/80 p-1 rounded border border-slate-700 text-[7px]">
              <div className="flex items-center justify-between text-emerald-300">
                <span className="truncate">✓ الإجراءات والتصاريح</span>
                <span className="font-bold text-[6.5px] text-emerald-400 shrink-0">100%</span>
              </div>
              <div className="flex items-center justify-between text-amber-300">
                <span className="truncate">✓ المستلزمات الشرعية</span>
                <span className="font-bold text-[6.5px] text-amber-400 shrink-0">85%</span>
              </div>
            </div>

            <button className="w-full bg-emerald-700 text-white py-1 rounded text-[7.5px] font-bold shadow-xs">
              مشاركة الحقيبة مع الرفقاء
            </button>
          </div>
        )}

        {type === 'radar' && (
          <div className="p-2 space-y-1.5 overflow-hidden flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            {/* Circular Radar Graphic */}
            <div className="w-24 h-24 rounded-full bg-radial from-emerald-900 to-emerald-950 mx-auto border-2 border-emerald-500 relative flex items-center justify-center text-emerald-300 font-bold shadow-inner">
              <span className="text-[7px] absolute top-1 text-emerald-400">شمال N</span>
              <div className="w-6 h-6 rounded-full bg-emerald-800/80 border border-emerald-400 flex items-center justify-center text-[8px]">
                🕋
              </div>
              {/* Radar Dots */}
              <div className="w-2 h-2 rounded-full bg-emerald-400 absolute top-4 left-4 animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 absolute top-4 left-4"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400 absolute bottom-3 right-5"></div>
            </div>

            <div className="bg-white p-1.5 rounded border border-slate-200 text-[8px] space-y-1">
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>🟢 فاطمة (الزوجة)</span>
                <span>18م شمالاً</span>
              </div>
              <div className="flex justify-between text-amber-800 font-bold">
                <span>🚩 تجمع الفوج</span>
                <span>45م كدي</span>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 text-[7.5px] p-1 rounded text-center font-bold">
              كثافة صحن المطاف: 42% معتدل
            </div>

            <button className="w-full bg-emerald-700 text-white py-1 rounded text-[8px] font-bold">
              مسح كود QR لإضافة رفيق
            </button>
          </div>
        )}

        {type === 'camp' && (
          <div className="p-2 space-y-1.5 overflow-hidden flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="flex bg-slate-200 p-0.5 rounded text-[7.5px]">
              <div className="flex-1 bg-emerald-700 text-white text-center py-0.5 rounded font-bold">منى وعرفة</div>
              <div className="flex-1 text-slate-600 text-center py-0.5">فندق مكة</div>
            </div>

            <div className="bg-white border-r-2 border-emerald-600 p-1.5 rounded text-[8px] space-y-0.5">
              <div className="font-bold text-emerald-900">مخيم منى - مربع 42</div>
              <div className="text-slate-700 text-[7.5px]">خيمة: ب-14 • سرير رقم: 18</div>
            </div>

            <div className="bg-white p-1.5 rounded border border-slate-200 text-[8px] space-y-0.5">
              <div className="font-bold text-amber-900">🍽️ بوفيه الإعاشة:</div>
              <div className="text-slate-600 text-[7.5px]">غداء: كبسة لحم + فواكه + تمر</div>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-1 rounded flex justify-between items-center text-[7.5px]">
              <span className="font-bold text-sky-900">💧 ترطيب اليوم:</span>
              <span className="bg-sky-200 text-sky-900 px-1 py-0.2 rounded font-bold">2.8 / 3.5 لتر</span>
            </div>

            <button className="w-full bg-red-600 text-white py-1 rounded text-[8px] font-bold shadow-xs">
              🚨 استدعاء طبيب المخيم (SOS)
            </button>
          </div>
        )}

        {type === 'counter' && (
          <div className="p-2 space-y-1.5 overflow-hidden flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-600 bg-emerald-50 mx-auto flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-[7.5px] font-bold text-emerald-700">الشوط</span>
              <span className="text-[26px] font-black text-emerald-900 leading-none">4</span>
              <span className="text-[7px] text-slate-500">من 7 أشواط</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded text-center text-[7.5px] text-emerald-900 italic">
              "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً"
            </div>

            <div className="flex justify-between text-[7.5px] text-slate-600 px-1">
              <span>📳 اهتزاز مفعل</span>
              <span>🔊 قراءة صوتية</span>
            </div>

            <button className="w-full bg-emerald-700 text-white py-1.5 rounded text-[8.5px] font-bold shadow-xs">
              + تسجيل اكتمال الشوط
            </button>
          </div>
        )}

        {type === 'company' && (
          <div className="p-2 space-y-1.5 overflow-hidden flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="bg-amber-800 text-white p-1 rounded text-center text-[8px] font-bold">
              لوحة تحكم الشركة B2B
            </div>

            <div className="bg-white p-1.5 rounded border border-slate-200 text-[8px] space-y-0.5">
              <div className="font-bold text-amber-900">بيانات وترخيص الشركة:</div>
              <div className="text-slate-800 font-medium text-[7.5px] truncate">{companyName}</div>
            </div>

            <div className="bg-white p-1.5 rounded border border-slate-200 text-[8px] space-y-0.5">
              <div className="font-bold text-emerald-800">إدارة تسكين الفنادق:</div>
              <div className="text-slate-600 text-[7.5px]">فندق مكة (غرف 1201-1250)</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-1 rounded text-[7.5px] text-amber-900">
              <span className="font-bold block">📢 بث توجيه فوري:</span>
              <span>تحرك باصات عرفة 4:00 عصراً</span>
            </div>

            <button className="w-full bg-emerald-700 text-white py-1 rounded text-[8px] font-bold">
              حفظ ونشر التعديلات فوراً
            </button>
          </div>
        )}
      </div>
      <div className="text-center text-[8.5px] text-slate-400 mt-1 font-medium">
        [معاينة شاشة الجوال الحقيقية]
      </div>
    </div>
  );
};

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onShowToast,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'matrix' | 'screens' | 'tech' | 'commercial'>('all');
  const [selectedScreenTab, setSelectedScreenTab] = useState<'home' | 'prep' | 'radar' | 'camp' | 'counter' | 'company'>('home');
  const [localToast, setLocalToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setLocalToast(msg);
    if (onShowToast) onShowToast(msg);
    setTimeout(() => {
      setLocalToast((curr) => (curr === msg ? null : curr));
    }, 5000);
  };

  const companyName = userProfile?.tourismCompany?.name || 'شركة السياحة والحج المصرية المعتمدة';
  const licenseNo = userProfile?.tourismCompany?.licenseNumber || 'ترخيص سياحي رقم 1842 - فئة (أ)';

  const docOptions = {
    companyName,
    licenseNumber: licenseNo,
    activeSection,
    selectedScreenTab,
  };

  const handlePrint = () => {
    executePrintOrExport(docOptions, showNotification);
  };

  const handleDownloadWord = () => {
    downloadWordDoc(docOptions);
    showNotification('تم تنزيل ملف الوورد (.doc) بنجاح! يمكنك فتحه الآن في Microsoft Word والتعديل عليه بحرية.');
  };

  const handleDownloadFile = () => {
    downloadBrochureHtml(docOptions);
    showNotification('تم تنزيل ملف الكتيب للطباعة بنجاح! افتح الملف واضغط Ctrl+P للطباعة أو حفظه كـ PDF.');
  };

  const handleOpenInNewWindow = () => {
    const success = openBrochureInNewTab(docOptions);
    if (success) {
      showNotification('تم فتح الكتيب في تبويب مستقل! يمكنك طباعته أو حفظه كـ PDF بحرية تامة.');
    }
  };

  const handleCopy = () => {
    copyBrochureSummaryToClipboard(docOptions, showNotification);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-0 sm:p-4 print:p-0 print:bg-white print:overflow-visible">
      {/* Container */}
      <div className="bg-surface w-full max-w-5xl rounded-none sm:rounded-3xl shadow-2xl flex flex-col border border-outline-variant/30 print:border-none print:shadow-none print:rounded-none min-h-screen sm:min-h-0 sm:max-h-[92vh]">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="shrink-0 bg-primary text-on-primary px-4 sm:px-6 py-3.5 rounded-none sm:rounded-t-3xl flex flex-wrap items-center justify-between border-b border-white/10 gap-2 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed/20 flex items-center justify-center text-secondary-fixed border border-secondary-fixed/30 shrink-0">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">ملف التوثيق والعرض التعريفي لتطبيق "مَنَاسِكِي"</h2>
              <p className="text-[11px] sm:text-xs text-primary-fixed-dim">
                جاهز للطباعة والتعديل بملف Word - أسعار في متناول الجميع وصور ومعاينة للشاشات
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Word Export Button */}
            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer active:scale-95"
              title="تنزيل الملف بصيغة Word (.doc) للتعديل عليه في برامج الأوفيس"
            >
              <span className="material-symbols-outlined text-[18px]">article</span>
              <span>تحميل Word للتعديل (.doc)</span>
            </button>

            {/* Primary Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs hover:bg-secondary-fixed-dim transition-all shadow-md cursor-pointer active:scale-95"
              title="طباعة الكتيب مباشرة أو الحفظ كملف PDF"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>طباعة (PDF)</span>
            </button>

            {/* Direct Download Standalone HTML Button */}
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer"
              title="تنزيل كصفحة مستقلة جاهزة للطباعة على جهازك"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span className="hidden sm:inline">ملف HTML للطباعة</span>
            </button>

            {/* Open in Dedicated Window */}
            <button
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
              title="فتح في تبويب مستقل للمتصفح بدون قيود المعاينة"
            >
              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
              <span className="hidden md:inline">تبويب جديد</span>
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
              title="نسخ ملخص الكتيب والأسعار لمشاركته في واتساب"
            >
              <span className="material-symbols-outlined text-[17px]">content_copy</span>
              <span className="hidden lg:inline">نسخ النص</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer mr-1"
              title="إغلاق النافذة"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar (Hidden in Print) */}
        <div className="shrink-0 bg-surface-container px-6 py-2.5 border-b border-outline-variant/20 flex items-center justify-between overflow-x-auto gap-2 text-xs print:hidden no-scrollbar">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSection === 'all'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
              }`}
            >
              عرض الكتيب الكامل (نمط الطباعة والوورد)
            </button>
            <button
              onClick={() => setActiveSection('matrix')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSection === 'matrix'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
              }`}
            >
              مصفوفة المقارنة (الشركات vs الأفراد)
            </button>
            <button
              onClick={() => setActiveSection('screens')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSection === 'screens'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
              }`}
            >
              شاشات التطبيق والمعاينة المصورة
            </button>
            <button
              onClick={() => setActiveSection('commercial')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSection === 'commercial'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
              }`}
            >
              الأسعار والباقات الميسرة (ج.م)
            </button>
            <button
              onClick={() => setActiveSection('tech')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSection === 'tech'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
              }`}
            >
              المواصفات التقنية وPWA
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>جاهز للتعديل الفوري عبر Word والطباعة</span>
          </div>
        </div>

        {/* Toast Notification inside modal */}
        {localToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs text-center font-bold flex items-center justify-center gap-2 shadow-inner print:hidden">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{localToast}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-surface text-on-surface print:overflow-visible print:p-0">
          
          {/* Document Cover Header */}
          <div className="text-center pb-6 border-b-2 border-dashed border-outline-variant/40 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed text-xs font-bold border border-secondary-fixed/60">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>الوثيقة التشغيلية والعرض التعريفي المعتمد - إصدار 2026/2027</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              مَنَاسِكِي | MANASIKI
            </h1>
            
            <p className="text-sm sm:text-base font-bold text-secondary max-w-2xl mx-auto">
              المنصة الرقمية المتكاملة لإدارة وتيسير رحلة الحج والعمرة دون الحاجة لإنترنت
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-on-surface-variant pt-2">
              <span className="px-3 py-1 rounded-md bg-surface-container font-semibold">
                🏢 مخصص لـ: <strong className="text-primary">{companyName}</strong>
              </span>
              <span className="px-3 py-1 rounded-md bg-surface-container font-semibold">
                📜 ترخيص وزارة السياحة: <strong>{licenseNo}</strong>
              </span>
              <span className="px-3 py-1 rounded-md bg-surface-container font-semibold">
                ⚡ وضع العمل: 100% دون إنترنت (Offline-First)
              </span>
              <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                📝 متاح بصيغة Word قابلة للتعديل الحر
              </span>
            </div>
          </div>

          {/* SECTION: Comparison Matrix */}
          {(activeSection === 'all' || activeSection === 'matrix') && (
            <div className="space-y-4 print:break-inside-avoid">
              <div className="border-r-4 border-primary pr-3">
                <h2 className="text-xl font-extrabold text-primary">
                  أولاً: مصفوفة الفروق الجوهرية بين نسخة الشركات ونسخة الأفراد
                </h2>
                <p className="text-xs text-on-surface-variant">
                  مقارنة دقيقة توضح القيمة المضافة لشركات السياحة والحملات مقابل المعتمر المستقل
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/30">
                      <th className="p-3 bg-surface-container-high font-bold text-on-surface w-1/4">وجه المقارنة</th>
                      <th className="p-3 bg-primary-fixed/30 font-extrabold text-primary w-2/5">
                        🏢 نسخة شركات السياحة والحملات (B2B)
                      </th>
                      <th className="p-3 bg-secondary-fixed/30 font-extrabold text-secondary w-1/3">
                        👤 نسخة الأفراد والمستقلين (B2C)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">الهوية والعلامة التجارية</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • هوية مخصصة بالكامل (White Label) باسم وشعار وترخيص الشركة على كل هواتف الحجاج.<br />
                        • تعزيز ولاء المعتمر وبرستيج الشركة أمام العملاء والمنافسين.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • هوية قياسية عامة تحت اسم تطبيق "مَنَاسِكِي".<br />
                        • إمكانية حفظ بيانات الحاج الشخصية محلياً.
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">إدارة الفنادق والتسكين</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • توزيع آلي لغرف الفنادق في مكة والمدينة على الحجاج مسبقاً بنقرة زر.<br />
                        • كارت فندق مباشر يحوي رقم الغرفة، الدور، المسافة للحرم، ورقم هاتف الفندق.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • إدخال يدوي حر للفندق الذي حجزه المعتمر بنفسه، مع حفظ موقعه على الخريطة للرجوع إليه دون ضياع.
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">مخيم المشاعر (منى وعرفة)</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • توجيه الحجاج تلقائياً إلى رقم الخيمة، الجناح، ورقم السرير الخاص بهم.<br />
                        • إرشادات قطار المشاعر ومواعيد التفويج المحددة من الشركة.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • دليل عام لمخيمات المشاعر وسنن المبيت بمنى والوقوف بعرفة، مع إمكانية تثبيت دبوس GPS لمكان خيمته.
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">بوفيه الإعاشة والوجبات</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • عرض قائمة وجبات البوفيه اليومية للحملة (فطور، غداء، عشاء).<br />
                        • إمكانية طلب وجبات مسبقة التغليف أو تحديد التفضيلات الغذائية لمصابي السكري.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • متتبع شرب المياه والترطيب اليومي للوقاية من الإجهاد الحراري، مع تنبيهات بمواعيد الأكل الصحية.
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">المشرفون والتواصل</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • بطاقات اتصال سريعة بمشرف الفوج، المرشد الديني المعتمد، ومسعف الحملة (اتصال مباشر وواتساب).<br />
                        • تنبيهات وتوجيهات جماعية عاجلة ترسلها الشركة لكافة معتمريها.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • أرقام الطوارئ العامة الرسمية بالمملكة (الهلال الأحمر 997، أمن الحرم، الدفاع المدني 998).
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">نداء الاستغاثة الطبي (SOS)</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • استدعاء فوري لطبيب ومسعف الحملة مع إرسال رقم الجناح ورقم السرير تلقائياً للمساعدة خلال دقائق.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • إرسال رسالة نجدة بالـ SMS أو الواتساب لأرقام العائلة المسجلة مع إحداثيات GPS الدقيقة للموقع.
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">رادار الرفاق والزحام</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • تحديد نقطة تجمع رسمية للفوج (مثل: بوابة الملك عبدالعزيز أو محطة كدي) تظهر لجميع الحجاج.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • شبكة اقتران عائلية بالـ QR Code دون إنترنت لربط الزوجين أو الوالدين والأبناء ومتابعة المسافات.
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-3 font-bold text-on-surface bg-surface-container-low">حقيبة الاستعداد والسفر</td>
                      <td className="p-3 bg-primary-fixed/10 font-semibold text-primary leading-relaxed">
                        • قائمة مجهزة بالمتطلبات الخاصة بشركة السياحة وتنبيهات أوزان حقائب الطيران المتفق عليها.
                      </td>
                      <td className="p-3 text-on-surface-variant leading-relaxed">
                        • حاسبة وزن تفاعلية وقائمة أمتعة كاملة مقسمة لخمس فئات تتيح إضافة وحذف المهام الشخصية بحرية.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: Screen-by-Screen Detailed Documentation WITH PHONE MOCKUPS */}
          {(activeSection === 'all' || activeSection === 'screens') && (
            <div className="space-y-6 print:break-before-page">
              <div className="border-r-4 border-primary pr-3">
                <h2 className="text-xl font-extrabold text-primary">
                  ثانياً: التوثيق التفصيلي الشامل لشاشات التطبيق مدعماً بالصور والمعاينة الحية
                </h2>
                <p className="text-xs text-on-surface-variant">
                  معاينة بصرية لكل شاشة هاتف على حدة مع المكونات والفارق الميداني بين نسختي الشركات والأفراد
                </p>
              </div>

              {/* Screen Tab Selectors in modal view (hidden in print) */}
              <div className="flex flex-wrap gap-1.5 p-1.5 bg-surface-container rounded-xl text-xs font-semibold print:hidden">
                <button
                  onClick={() => setSelectedScreenTab('home')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScreenTab === 'home' ? 'bg-primary text-on-primary' : 'hover:bg-surface'
                  }`}
                >
                  1. الشاشة الرئيسية
                </button>
                <button
                  onClick={() => setSelectedScreenTab('prep')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScreenTab === 'prep' ? 'bg-primary text-on-primary' : 'hover:bg-surface'
                  }`}
                >
                  2. حقيبة الاستعداد لرحلة العمر
                </button>
                <button
                  onClick={() => setSelectedScreenTab('radar')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScreenTab === 'radar' ? 'bg-primary text-on-primary' : 'hover:bg-surface'
                  }`}
                >
                  3. الرادار وخريطة الزحام
                </button>
                <button
                  onClick={() => setSelectedScreenTab('camp')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScreenTab === 'camp' ? 'bg-primary text-on-primary' : 'hover:bg-surface'
                  }`}
                >
                  4. المخيم والإعاشة
                </button>
                <button
                  onClick={() => setSelectedScreenTab('counter')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScreenTab === 'counter' ? 'bg-primary text-on-primary' : 'hover:bg-surface'
                  }`}
                >
                  5. عداد المناسك
                </button>
                <button
                  onClick={() => setSelectedScreenTab('company')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedScreenTab === 'company' ? 'bg-primary text-on-primary' : 'hover:bg-surface'
                  }`}
                >
                  6. لوحة إدارة الشركة
                </button>
              </div>

              {/* SCREEN 1: HOME */}
              {(activeSection === 'all' || selectedScreenTab === 'home') && (
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 space-y-4 print:break-inside-avoid shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                        1
                      </span>
                      <div>
                        <h3 className="font-extrabold text-base text-primary">الشاشة الرئيسية (لوحة القيادة والمتابعة اللحظية)</h3>
                        <p className="text-[11px] text-on-surface-variant">الواجهة المركزية الأولى التي تفتح أمام الحاج فور تشغيل التطبيق</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed text-[11px] font-bold">
                      شاشة أساسية
                    </span>
                  </div>

                  {/* 3-Part Layout: Phone Mockup, Features, Difference */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
                    <div className="lg:col-span-3 flex justify-center">
                      <ScreenPhoneMockup type="home" companyName={companyName} />
                    </div>

                    <div className="lg:col-span-5 space-y-2">
                      <h4 className="font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">widgets</span>
                        مكونات الشاشة الرئيسية:
                      </h4>
                      <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
                        <li><strong>بانر الترحيب ورقم الشارة (Badge ID):</strong> يعرض اسم الحاج، كود التعرفة الموحد، وصورته.</li>
                        <li><strong>بطاقة منسك اليوم وعداد العد التنازلي:</strong> منبه زمني حي بالدقائق والثواني لحركة التفويج أو الصلاة القادمة.</li>
                        <li><strong>شريط مواقيت الصلاة بمكة المكرمة:</strong> أوقات الصلوات الخمس مع تحديد الصلاة التالية المتبقية.</li>
                        <li><strong>كروت الوصول السريع (Quick Actions):</strong> فتح شاشات الطواف، الرادار، المخيم، والحقيبة بلمسة واحدة.</li>
                        <li><strong>بطاقة الفندق ومسافة الحرم:</strong> إرشاد سريع للغرفة والفندق ورقم الهاتف المباشر.</li>
                        <li><strong>بطاقة المشرف وطبيب الحملة:</strong> الاتصال المباشر والمحادثة الفورية عبر الواتساب.</li>
                      </ul>
                    </div>

                    <div className="lg:col-span-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2">
                      <h4 className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                        الفروق بين النسختين في هذه الشاشة:
                      </h4>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-primary font-bold">في نسخة شركات السياحة:</strong> تظهر أعلى الشاشة العلامة التجارية وشعار الشركة، واسم ورقم المشرف المسؤول عن الفوج مع رقم رحلة الطيران وموعد تحرك حافلات التجمع، ولا يمكن للحاج تعديل الفندق بطريق الخطأ لأن بياناته مدققة مركزياً.
                      </p>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-secondary font-bold">في نسخة الأفراد:</strong> يظهر اسم الحاج مع خيار "تخصيص رحلتي"، حيث يستطيع المعتمر إدخال فندقه في مكة والمدينة بنفسه، وتحديد تنبيهات مخصصة لأسرته فقط دون التقيد بجداول أفواج خارجية.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 2: PREPARATION & LUGGAGE */}
              {(activeSection === 'all' || selectedScreenTab === 'prep') && (
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border-2 border-emerald-600/30 space-y-4 print:break-inside-avoid shadow-sm">
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        2
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-base text-primary">
                            شاشة «حقيبة الاستعداد لرحلة العمر» وتتبع الأمتعة والأوزان
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700">
                            ✓ صورة الواجهة الحقيقية المعتمدة
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          من عقد النية إلى صعود الطائرة.. خطواتك الموثقة لاستعداد روحي ولوجستي متكامل (بنسبة جاهزية 82% ونصيحة مناسكي اليومية)
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed text-[11px] font-bold">
                      شاشة تفاعلية أساسية
                    </span>
                  </div>

                  {/* Clarification banner matching the user request */}
                  <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-3 sm:p-4 rounded-xl border border-emerald-600/40 flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                        <span className="material-symbols-outlined text-[22px]">verified</span>
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-amber-300">
                          هذه هي الشاشة الموثقة بكتيب العرض: «حقيبة الاستعداد لرحلة العمر»
                        </div>
                        <p className="text-slate-300 text-[11px] mt-0.5">
                          تتضمن مؤشر الجاهزية الدائري (82% مكتمل)، عداد الأيام التنازلي للإقلاع، بطاقة نصيحة مناسكي لليوم، وقوائم الأمتعة والمهمات المقسمة لـ 5 فئات.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-lg border border-emerald-600/50 font-bold shrink-0">
                      100% تعمل دون إنترنت
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
                    {/* Visual Mockups Column: Real Screenshot + Phone Shell */}
                    <div className="lg:col-span-4 flex flex-col items-center gap-3">
                      {/* Real Screen Image Card */}
                      <div className="w-full max-w-[240px] bg-slate-900 p-2 rounded-2xl border-2 border-emerald-500 shadow-xl overflow-hidden group">
                        <div className="relative rounded-xl overflow-hidden border border-emerald-800/60 bg-slate-950">
                          <img
                            src="/assets/aistudio/image_6630d03e.png"
                            onError={(e) => {
                              // Fallback to embedded base64 if network asset is delayed
                              (e.target as HTMLImageElement).src = PREP_SCREEN_IMAGE_BASE64;
                            }}
                            alt="شاشة حقيبة الاستعداد لرحلة العمر الحقيقية"
                            className="w-full h-auto object-cover rounded-lg group-hover:scale-102 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 text-[8.5px] font-bold px-2 py-0.5 rounded-full border border-emerald-600/60 shadow-md">
                            لقطة الواجهة الحقيقية
                          </div>
                        </div>
                        <div className="text-center text-[8.5px] text-emerald-300 font-bold mt-1.5 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>صورة طبق الأصل من تطبيق مناسكي</span>
                        </div>
                      </div>

                      {/* Side by side mini device mockup */}
                      <div className="w-full flex justify-center">
                        <ScreenPhoneMockup type="prep" companyName={companyName} />
                      </div>
                    </div>

                    {/* Components Column */}
                    <div className="lg:col-span-4 space-y-2.5">
                      <h4 className="font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">luggage</span>
                        مكونات شاشة حقيبة الاستعداد لرحلة العمر:
                      </h4>
                      <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
                        <li>
                          <strong>شارة الرحلة ومؤشر أيام الإقلاع:</strong> شريط علوي يوضح موسم الحج (١٤٤٦هـ) وعدد الأيام المتبقية على الرحلة (متبقي 6 أيام على الإقلاع).
                        </li>
                        <li>
                          <strong>مؤشر الجاهزية الدائري الذكي (82%):</strong> حلقة دائرية فخمة تحسب فورياً نسبة الإنجاز مع عبارة (جاهزية استثنائية - أنجزت 14 من أصل 17 مهمة تحضيرية).
                        </li>
                        <li>
                          <strong>شريط مستوى الاستعداد العام:</strong> يوضح عدد المهام المتبقية بدقة (3 مهام متبقية) مع زر مباشر لمشاركة الحقيبة مع الرفقاء والعائلة.
                        </li>
                        <li>
                          <strong>بطاقة «نصيحة مناسكي لليوم»:</strong> إرشاد لوجستي وطبي ذكي يتغير يومياً (مثل: وضع أدوية الطوارئ والتقارير الطبية في حقيبة اليد بالطائرة وليس الشحن).
                        </li>
                        <li>
                          <strong>أقسام التجهيز والمهمات (مع زر طي الكل):</strong>
                          <span className="block mr-3 text-primary font-medium">1. الإجراءات الرسمية والتصاريح (100% مكتمل: جواز السفر، نسك، بطاقة الحاج).</span>
                          <span className="block mr-3 text-primary font-medium">2. المستلزمات الشرعية وملابس الإحرام والحزام غير المخيط.</span>
                          <span className="block mr-3 text-primary font-medium">3. الصيدلية والأدوية الشخصية لمرضى السكري والضغط.</span>
                          <span className="block mr-3 text-primary font-medium">4. الأجهزة والإلكترونيات (الشواحن والباور بانك).</span>
                          <span className="block mr-3 text-primary font-medium">5. النظافة والعناية الشخصية غير المعطرة للمحرم.</span>
                        </li>
                        <li>
                          <strong>حاسبة أوزان الأمتعة ومشاركة الحقيبة:</strong> لتفادي دفع غرامات الوزن الزائد بالمطار مع مشاركة القائمة بلمسة زر عبر الواتساب.
                        </li>
                      </ul>
                    </div>

                    {/* Diff & Value Column */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2">
                        <h4 className="font-bold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                          الفروق بين النسختين في هذه الشاشة:
                        </h4>
                        <p className="text-on-surface-variant leading-relaxed">
                          <strong className="text-primary font-bold">في نسخة شركات السياحة:</strong> تشمل القائمة المجهزة آلياً مستندات وعلامات الشركة الموحدة (حقيبة اليد الرسمية للشركة، باج التعارف الموسوم بشعار وترخيص الشركة، ملصقات الحقائب برقم الحافلة، وإرشادات صالة الحجاج بمطار القاهرة أو جدة).
                        </p>
                        <p className="text-on-surface-variant leading-relaxed">
                          <strong className="text-secondary font-bold">في نسخة الأفراد:</strong> مرونة تامة لتخصيص القائمة وإضافة مهام شخصية مخصصة وحساب أوزان حقائب الأسرة مجتمعة حسب تذاكر الطيران الاقتصادية.
                        </p>
                      </div>

                      <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-emerald-900 dark:text-emerald-200">
                        <span className="font-bold block mb-1">🎯 القيمة المضافة لشركات السياحة والحجاج:</span>
                        <span>تحول هذه الشاشة قلق الاستعداد والسفر إلى تجربة إيمانية مبهجة ومنظمة تضمن عدم نسيان أي دواء طارئ أو مستند رسمي قبل الوصول إلى المطار.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 3: RADAR & HEATMAP */}
              {(activeSection === 'all' || selectedScreenTab === 'radar') && (
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 space-y-4 print:break-inside-avoid shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                        3
                      </span>
                      <div>
                        <h3 className="font-extrabold text-base text-primary">شاشة رادار المشاعر والزحام (Radar & Live Companion Locator)</h3>
                        <p className="text-[11px] text-on-surface-variant">الابتكار التكنولوجي الأول لمنع ضياع المعتمرين ومراقبة كثافة الحرم</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed text-[11px] font-bold">
                      براءة اختراع تشغيلية
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
                    <div className="lg:col-span-3 flex justify-center">
                      <ScreenPhoneMockup type="radar" companyName={companyName} />
                    </div>

                    <div className="lg:col-span-5 space-y-2">
                      <h4 className="font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">track_changes</span>
                        مكونات شاشة الرادار والزحام:
                      </h4>
                      <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
                        <li><strong>واجهة الرادار الدائري (Circular Radar):</strong> تعرض نقاط الرفاق حول الكعبة بمؤشرات مسافية دقيقة وبوصلة توجيه.</li>
                        <li><strong>بوصلة التوجيه المتري:</strong> حساب المسافة بالأمتار (مثلاً: فاطمة تبعد 18 متراً باتجاه باب العمرة).</li>
                        <li><strong>خريطة الزحام اللحظية:</strong>
                          <span className="block mr-3 text-primary font-medium">• صحن المطاف (كثافة متوسطة 42% - وقت مناسب).</span>
                          <span className="block mr-3 text-primary font-medium">• المسعى (انسيابي 24%).</span>
                          <span className="block mr-3 text-primary font-medium">• منشأة الجمرات (مزدحم 88%).</span>
                        </li>
                        <li><strong>اقتران الـ QR دون إنترنت:</strong> ربط الأجهزة في ثانيتين بمسح الكود دون وسيط وسحابي.</li>
                        <li><strong>زر التجمع العاجل وتنبيه الاهتزاز:</strong> إطلاق تنبيه اهتزازي مباشر لهواتف الرفقاء للالتفات الفوري.</li>
                      </ul>
                    </div>

                    <div className="lg:col-span-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2">
                      <h4 className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                        الفروق بين النسختين في هذه الشاشة:
                      </h4>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-primary font-bold">في نسخة شركات السياحة:</strong> يستطيع مشرف الحملة تثبيت "نقطة تجمع الفوج" (Meeting Point) على خريطة الرادار لجميع الحجاج دفعة واحدة، وتتبع الحجاج المتأخرين عن الباصات لحمايتهم من التخلف عن التفويج.
                      </p>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-secondary font-bold">في نسخة الأفراد:</strong> صممت لتوفير أقصى درجات الخصوصية؛ لا يتم تخزين إحداثيات الحاج على خوادم سحابية، بل يتصل الحاج فقط مع عائلته وأصدقائه المصرح لهم عبر مسح الـ QR المباشر.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 4: CAMP & CATERING & HOTELS */}
              {(activeSection === 'all' || selectedScreenTab === 'camp') && (
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 space-y-4 print:break-inside-avoid shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                        4
                      </span>
                      <div>
                        <h3 className="font-extrabold text-base text-primary">شاشة مخيم المشاعر والإعاشة والفنادق (Camp & Accommodation)</h3>
                        <p className="text-[11px] text-on-surface-variant">المرجع الكامل لتسكين منى وعرفة وفنادق الحرمين الشريفين وخدمات الإعاشة</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed text-[11px] font-bold">
                      الراحة والأمان
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
                    <div className="lg:col-span-3 flex justify-center">
                      <ScreenPhoneMockup type="camp" companyName={companyName} />
                    </div>

                    <div className="lg:col-span-5 space-y-2">
                      <h4 className="font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">holiday_village</span>
                        مكونات شاشة المخيم والإقامة:
                      </h4>
                      <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
                        <li><strong>محدد الإقامة الثلاثي:</strong> تنقل سلس بين مخيم منى وعرفة / فندق مكة / فندق المدينة.</li>
                        <li><strong>بطاقة خيمة وسرير المشاعر:</strong> رقم المربع (مربع 42)، رقم الخيمة (خيمة ب-14)، ورقم السرير (سرير 18).</li>
                        <li><strong>بطاقات فنادق مكة والمدينة:</strong> اسم الفندق، العنوان التفصيلي، رقم الغرفة والدور، ورقم استقبال الفندق.</li>
                        <li><strong>جدول بوفيه الإعاشة:</strong> قائمة الطعام اليومية، مواعيد التوزيع، وخيار طلب وجبة مغلفة مسبقاً.</li>
                        <li><strong>متتبع شرب المياه والترطيب:</strong> مراقبة استهلاك المياه اليومي (هدف 3.5 لتر) للوقاية من ضربات الشمس.</li>
                        <li><strong>زر الاستدعاء الطبي الفوري (SOS):</strong> استدعاء طبيب المخيم إلى رقم السرير فوراً بنقرة واحدة.</li>
                      </ul>
                    </div>

                    <div className="lg:col-span-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2">
                      <h4 className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                        الفروق بين النسختين في هذه الشاشة:
                      </h4>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-primary font-bold">في نسخة شركات السياحة:</strong> تمثل هذه الشاشة قلب عمليات الشركة، حيث يستلم الحاج كل تفاصيل سريره بالاسم دون الحاجة لكشوفات ورقية في حرارة الصيف، وتستقبل عيادة الشركة نداءات الـ SOS مربوطة برقم سرير المصاب لسرعة النجدة.
                      </p>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-secondary font-bold">في نسخة الأفراد:</strong> يركز التبويب على فنادق مكة والمدينة وحفظ موقع سكن المعتمر المستقل، ويوفر نصائح التغذية ومراكز الهلال الأحمر وسيارات الإسعاف العامة المحيطة بالحرم.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 5: RITUALS COUNTER */}
              {(activeSection === 'all' || selectedScreenTab === 'counter') && (
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 space-y-4 print:break-inside-avoid shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                        5
                      </span>
                      <div>
                        <h3 className="font-extrabold text-base text-primary">شاشة عداد المناسك الذكي (Tawaf & Sa'i Smart Counter)</h3>
                        <p className="text-[11px] text-on-surface-variant">العداد الرقمي المتطور للأشواط مع التنبيه بالاهتزاز والأدعية الشرعية المعتمدة</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed text-[11px] font-bold">
                      حماية من السهو والشك
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
                    <div className="lg:col-span-3 flex justify-center">
                      <ScreenPhoneMockup type="counter" companyName={companyName} />
                    </div>

                    <div className="lg:col-span-5 space-y-2">
                      <h4 className="font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">counter_7</span>
                        مكونات شاشة عداد المناسك:
                      </h4>
                      <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
                        <li><strong>مفتاح التبديل الفوري:</strong> بين طواف الكعبة (7 أشواط) والسعي بين الصفا والمروة (7 أشواط).</li>
                        <li><strong>دائرة العداد العملاقة المضيئة:</strong> رقم الشوط بحجم واضح جداً لكبار السن مع مؤشر مسار.</li>
                        <li><strong>رد الفعل بالاهتزاز (Haptic Feedback):</strong> يهتز الجوال بنمط مميز عند اكتمال كل شوط لتأكيد العد دون النظر للشاشة.</li>
                        <li><strong>دعاء الشوط المأثور:</strong> عرض الدعاء الشرعي المستحب لكل شوط مع نص الدعاء بين الركن اليماني والحجر الأسود.</li>
                        <li><strong>القراءة الصوتية التلقائية:</strong> زر تشغيل صوتي للأدعية لمن لا يجيدون القراءة في الزحام.</li>
                      </ul>
                    </div>

                    <div className="lg:col-span-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2">
                      <h4 className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                        الفروق بين النسختين في هذه الشاشة:
                      </h4>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-primary font-bold">في نسخة شركات السياحة:</strong> يمكن للشركة تضمين تسجيل صوتي حصري للمرشد الديني الخاص بالحملة يقرأ الأدعية مع الحجاج، إضافة إلى فتاوى ميسرة معتمدة تجيب على أسئلة الحجاج الشائعة.
                      </p>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong className="text-secondary font-bold">في نسخة الأفراد:</strong> عداد مستقل بنسبة 100% يعمل بدون إنترنت مع محرك نطق النصوص المدمج في الهاتف (Text-to-Speech) لاستهلاك أقل قدر ممكن من بطارية الهاتف.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 6: COMPANY MANAGEMENT PANEL */}
              {(activeSection === 'all' || selectedScreenTab === 'company') && (
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 space-y-4 print:break-inside-avoid shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">
                        6
                      </span>
                      <div>
                        <h3 className="font-extrabold text-base text-primary">لوحة تحكم وإعدادات شركة السياحة (Company B2B Admin Panel)</h3>
                        <p className="text-[11px] text-on-surface-variant">اللوحة الحصرية لمديري الحملات لتحديث بيانات الحجاج والفنادق والتفويج</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed text-[11px] font-bold">
                      خاص بالشركات B2B
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
                    <div className="lg:col-span-3 flex justify-center">
                      <ScreenPhoneMockup type="company" companyName={companyName} />
                    </div>

                    <div className="lg:col-span-5 space-y-2">
                      <h4 className="font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                        خصائص لوحة التحكم للشركة:
                      </h4>
                      <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
                        <li><strong>تعديل بيانات الشركة وترخيص وزارة السياحة:</strong> يظهر التعديل فوراً لكافة حجاج الحملة دون الحاجة لتحديث التطبيق.</li>
                        <li><strong>إدارة فندق مكة المكرمة والمدينة المنورة:</strong> الأسماء، العناوين، أرقام الغرف، والمسافة للحرم.</li>
                        <li><strong>أرقام الطوارئ والخط الساخن:</strong> أرقام المشرف الميداني، المرشد الديني، والمكتب الرئيسي.</li>
                        <li><strong>مركز الإشعارات والتفويج الجماعي:</strong> بث التوجيهات العاجلة مثل تحرك الباصات بنقرة زر.</li>
                      </ul>
                    </div>

                    <div className="lg:col-span-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 space-y-2">
                      <h4 className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        أهمية هذه اللوحة لشركة السياحة:
                      </h4>
                      <p className="text-on-surface-variant leading-relaxed">
                        تمنح شركة السياحة التحكم الكامل والاستقلالية البرمجية؛ فلا تحتاج لتوظيف مبرمجين أو دفع تكاليف سيرفرات باهظة. كل شيء يتم من خلال لوحة تحكم سريعة وعصرية يمكن تشغيلها من الهاتف أو اللابتوب الخاص بمدير الرحلة.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION: Commercial Packages & Accessible Pricing in Egyptian Pounds */}
          {(activeSection === 'all' || activeSection === 'commercial') && (
            <div className="space-y-8 print:break-before-page">
              <div className="border-r-4 border-secondary pr-3">
                <h2 className="text-xl font-extrabold text-primary">
                  ثالثاً: باقات الاشتراك ونموذج التسعير في متناول الجميع (بالجنيه المصري)
                </h2>
                <p className="text-xs text-on-surface-variant">
                  أسعار رمزية وميسرة لتناسب كل مواطن معتمر وكل شركة سياحة مصرية صغيرة أو كبرى
                </p>
              </div>

              {/* Part A: Tourism Companies (B2B) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold">
                    القسم الأول
                  </span>
                  <h3 className="text-base font-extrabold text-primary">
                    باقات شركات السياحة والحملات المنظمة (B2B)
                  </h3>
                  <span className="text-xs text-on-surface-variant">(أسعار ميسرة جداً تحسب بقروش وجنيهات معدودة لكل معتمر)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* B2B 1 */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between space-y-3 shadow-2xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold">
                        باقة الانطلاق (الأفواج الصغيرة)
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">الفوج الاقتصادي (حتى 50 معتمر)</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        390 <span className="text-xs font-normal text-on-surface-variant">ج.م / للرحلة بالكامل</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          شعار واسم الشركة والترخيص.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          إعداد فنادق مكة والمدينة.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          عداد المناسك ورادار الزحام دون نت.
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-primary bg-primary-fixed/20 p-1.5 rounded-lg font-bold">
                      فقط <strong>7.8 جنيه</strong> لكل معتمر!
                    </div>
                  </div>

                  {/* B2B 2 (Featured) */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border-2 border-primary relative flex flex-col justify-between space-y-3 shadow-md bg-emerald-50/20">
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[9px] font-bold">
                      الأكثر طلباً للرحلات
                    </span>
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-primary-fixed/40 text-on-primary-fixed text-[10px] font-bold">
                        الحملات المتوسطة (رحلات العمرة)
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">فوج كامل (حتى 200 معتمر)</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        890 <span className="text-xs font-normal text-on-surface-variant">ج.م / للرحلة كاملة</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                          كل مميزات باقة الانطلاق.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                          توزيع غرف مكة والمدينة تلقائياً.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                          تثبيت نقطة تجمع الفوج على الرادار.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                          زر نداء الطوارئ لمشرف الحملة.
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-primary bg-primary-fixed/30 p-1.5 rounded-lg font-bold">
                      فقط <strong>4.45 جنيه</strong> لكل معتمر!
                    </div>
                  </div>

                  {/* B2B 3 */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between space-y-3 shadow-2xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                        الشركات الكبرى (موسم الحج)
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">حملة كبرى (حتى 500 معتمر/حاج)</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        1,650 <span className="text-xs font-normal text-on-surface-variant">ج.م / للموسم كاملاً</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          إدارة مخيم منى وعرفة وأرقام الأسرة.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          بوفيه الإعاشة وحصر وجبات السكري.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          نظام استدعاء طبيب المخيم (SOS).
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-amber-900 bg-amber-100 p-1.5 rounded-lg font-bold">
                      فقط <strong>3.3 جنيه</strong> لكل حاج!
                    </div>
                  </div>

                  {/* B2B 4 */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between space-y-3 shadow-2xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold">
                        الترخيص السنوي الشامل
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">الباقة المفتوحة طوال العام</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        3,400 <span className="text-xs font-normal text-on-surface-variant">ج.م / سنوياً</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          عدد معتمرين وأفواج غير محدود سنة كاملة.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          دومين فرعي خاص (hajj.company.com).
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          شهادات إتمام الحج والعمرة بهوية الشركة.
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-on-surface-variant bg-surface-container p-1.5 rounded-lg font-semibold">
                      الحل الاقتصادي الأوفر لكبرى الشركات
                    </div>
                  </div>
                </div>
              </div>

              {/* Part B: Individuals & Families (B2C) */}
              <div className="space-y-3 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold">
                    القسم الثاني
                  </span>
                  <h3 className="text-base font-extrabold text-secondary">
                    باقات الأفراد والمعتمرين المستقلين والعائلات (B2C)
                  </h3>
                  <span className="text-xs text-on-surface-variant">(تبدأ من المجان التام وأسعار رمزية أقل من ثمن كوب شاي)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* B2C 1: Free */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between space-y-3 shadow-2xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        مجاناً لوجه الله تعالى
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">الباقة الأساسية الإيمانية</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        0 <span className="text-xs font-normal text-on-surface-variant">ج.م (مجاناً تماماً)</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-emerald-600 text-[15px]">check_circle</span>
                          عداد الطواف والسعي مع الاهتزاز.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-emerald-600 text-[15px]">check_circle</span>
                          الأدعية المأثورة الصحيحة والقراءة الصوتية.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-emerald-600 text-[15px]">check_circle</span>
                          مواقيت الصلاة وبوصلة القبلة دون إنترنت.
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-emerald-900 bg-emerald-100 p-1.5 rounded-lg font-bold">
                      مجاناً مدى الحياة لكل مسلم
                    </div>
                  </div>

                  {/* B2C 2: Smart Solo */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between space-y-3 shadow-2xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold">
                        للمعتمر الفردي
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">باقة المعتمر الذكي</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        35 <span className="text-xs font-normal text-on-surface-variant">ج.م فقط (رمزية جداً)</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          كل مميزات الباقة المجانية.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          رادار الرفاق ومنع الضياع دون إنترنت.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          حاسبة وزن الحقائب وقوائم التجهيز الذكية.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          حفظ موقع الفندق الدقيق للرجوع إليه دون نت.
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-slate-800 bg-slate-100 p-1.5 rounded-lg font-bold">
                      أقل من ثمن فنجان قهوة!
                    </div>
                  </div>

                  {/* B2C 3: Family */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border-2 border-secondary relative flex flex-col justify-between space-y-3 shadow-md bg-amber-50/20">
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[9px] font-bold">
                      الأفضل للأسرة
                    </span>
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-secondary-fixed/40 text-on-secondary-fixed text-[10px] font-bold">
                        العائلة والأقارب
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">باقة العائلة (حتى 5 أفراد)</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        85 <span className="text-xs font-normal text-on-surface-variant">ج.م للأسرة كاملة</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          ربط 5 أجهزة معاً (الزوجين والأبناء والوالدين).
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          رادار متري عائلي متزامن وتنبيه الاهتزاز.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          مشاركة وتوزيع مهام حقائب السفر بين العائلة.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[15px]">check_circle</span>
                          تنبيهات الطوارئ العائلية السريعة.
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-amber-900 bg-amber-100 p-1.5 rounded-lg font-bold">
                      فقط <strong>17 جنيه</strong> للفرد الواحد!
                    </div>
                  </div>

                  {/* B2C 4: Lifetime */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between space-y-3 shadow-2xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        مدى الحياة (LifeTime)
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-1.5">باقة المعتمر الدائم</h4>
                      <div className="mt-1 text-xl font-extrabold text-primary">
                        150 <span className="text-xs font-normal text-on-surface-variant">ج.م تدفع مرة واحدة</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                          ترخيص مدى الحياة لجميع رحلات العمرة والحج.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                          ربط حتى 8 أجهزة عائلية في كل رحلة.
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                          كافة المزايا الحالية والتحديثات المستقبلية مجاناً.
                        </li>
                      </ul>
                    </div>
                    <div className="text-[11px] text-center text-emerald-900 bg-emerald-100 p-1.5 rounded-lg font-bold">
                      استثمار إيماني دائم لك ولأسرتك
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: Technical Architecture & Why Companies Choose Manasiki */}
          {(activeSection === 'all' || activeSection === 'tech') && (
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 space-y-4 print:break-before-page">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">memory</span>
                رابعاً: المواصفات الهندسية والتقنية (لماذا ينجح التطبيق ميدانياً؟)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-on-surface-variant">
                <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/15 space-y-1">
                  <h4 className="font-bold text-on-surface">1. تقنية Progressive Web App (PWA)</h4>
                  <p>لا يحتاج المعتمر للبحث في متجر Google Play أو Apple App Store ولا يواجه مشاكل نفاد مساحة الذاكرة؛ يثبت التطبيق فوراً بنقرة واحدة عبر الرابط أو كود الـ QR بحجم لا يتجاوز 3 ميجابايت.</p>
                </div>

                <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/15 space-y-1">
                  <h4 className="font-bold text-on-surface">2. العمل بنسبة 100% دون إنترنت (Offline-First)</h4>
                  <p>تخزين كافة الأدعية، بيانات الفندق، أرقام الخيام، والعداد داخل ذاكرة المتصفح المحلية (IndexedDB & LocalStorage) لضمان العمل حتى في ظل تشويش الأبراج في يوم عرفة وأيام التشريق.</p>
                </div>

                <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/15 space-y-1">
                  <h4 className="font-bold text-on-surface">3. شبكة الاقتران والبوصلة المدمجة (Sensors & Mesh)</h4>
                  <p>استغلال مستشعرات الهاتف الذكي (البوصلة الجيروسكوبية وحساب الإزاحة) لتحديد اتجاه الرفاق والمسافة المتوقعة دون استهلاك طاقة البطارية.</p>
                </div>

                <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/15 space-y-1">
                  <h4 className="font-bold text-on-surface">4. سهولة إدارة الحملة دون تعقيد تقني</h4>
                  <p>لوحة التحكم لا تتطلب أي مهارات تقنية؛ يستطيع مسؤول التسويق أو مشرف الرحلة إدخال البيانات في 5 دقائق لتبدأ المنظومة بالعمل فوراً أمام الحجاج والمعتمرين.</p>
                </div>
              </div>
            </div>
          )}

          {/* Document Footer with Signature / Corporate Stamp representation */}
          <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
            <div className="space-y-1 text-center sm:text-right">
              <p className="font-bold text-primary">منصة مَنَاسِكِي الرقمية - لتيسير المناسك وإدارة حملات الحج والعمرة</p>
              <p className="text-[11px]">جميع الحقوق محفوظة © 2026 | وثيقة معتمدة للعرض التجاري والتعاقد</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="block text-[10px] text-outline">توقيع ممثل شركة السياحة</span>
                <span className="block font-bold text-on-surface mt-1">........................................</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-outline">خاتم الحملة والاعتماد</span>
                <div className="w-16 h-12 border-2 border-dashed border-secondary/50 rounded-lg flex items-center justify-center text-[10px] text-secondary font-bold">
                  ختم معتمد
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Bar (Hidden in Print) */}
        <div className="shrink-0 bg-surface-container px-4 sm:px-6 py-3.5 rounded-none sm:rounded-b-3xl border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            <span>💡 <strong>مستند كامل قابل للتعديل والطباعة:</strong> يمكنك تحميل ملف Word (.doc) للتعديل عليه، أو طباعته كـ PDF بجودة فائقة.</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Word Export Button */}
            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">article</span>
              <span>تحميل Word للتعديل (.doc)</span>
            </button>

            {/* Primary Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>طباعة / حفظ PDF</span>
            </button>

            {/* Download HTML File */}
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs hover:bg-secondary-fixed-dim transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span>تحميل ملف الطباعة</span>
            </button>

            {/* Open Tab */}
            <button
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-surface-container-highest text-on-surface font-semibold text-xs hover:bg-outline-variant/30 transition-colors cursor-pointer"
              title="فتح بتبويب مستقل"
            >
              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
              <span className="hidden sm:inline">تبويب جديد</span>
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-surface-container-highest text-on-surface font-semibold text-xs hover:bg-outline-variant/30 transition-colors cursor-pointer"
              title="نسخ ملخص التقرير والأسعار"
            >
              <span className="material-symbols-outlined text-[17px]">content_copy</span>
              <span className="hidden sm:inline">نسخ النص</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface-variant font-semibold text-xs hover:bg-outline-variant/40 transition-colors cursor-pointer mr-1"
            >
              إغلاق العرض
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
