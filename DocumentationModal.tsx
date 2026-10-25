import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  downloadDirectPdfFile,
  downloadWordDoc,
  executePrintOrExport,
  copyBrochureSummaryToClipboard,
} from '../utils/printDocGenerator';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  onShowToast?: (msg: string) => void;
}

// Visual Phone Mockup Component to show clear screen previews inside the brochure
const ScreenPhonePreview: React.FC<{
  type: 'home' | 'data' | 'prep' | 'radar' | 'camp' | 'counter';
  companyName: string;
}> = ({ type, companyName }) => {
  return (
    <div className="w-full max-w-[190px] mx-auto bg-slate-900 p-2 rounded-[22px] border-2 border-slate-700 shadow-md shrink-0 select-none">
      <div className="bg-slate-50 rounded-[16px] overflow-hidden border border-slate-200 text-[10px] flex flex-col h-[235px]">
        {/* Status Bar */}
        <div className="bg-emerald-900 text-white px-2.5 py-1 flex items-center justify-between text-[8px] font-bold shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>دون إنترنت</span>
          </div>
        </div>

        {type === 'home' && (
          <div className="p-2 space-y-1.5 flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="bg-emerald-800 text-white p-2 rounded-lg text-center">
              <div className="text-[7px] text-amber-200 truncate">{companyName}</div>
              <div className="font-bold text-[10px] mt-0.5">الحاج / أحمد عبد الله</div>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-300 text-amber-950 rounded-full text-[7px] font-bold">
                3 مرافقين • شارة #88219
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded text-[8px]">
              <div className="font-bold text-emerald-900">🕌 صلاة العصر بالحرم (03:42 م)</div>
              <div className="text-slate-600 text-[7px]">متبقي للأذان: 01:42:15</div>
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200 text-[7.5px]">
              <div className="font-bold text-slate-900 truncate">🏨 سويس أوتيل المقام - مكة</div>
              <div className="text-emerald-700 font-bold">غرفة 1408 • 50م للحرم</div>
            </div>
            <div className="bg-amber-100 text-amber-950 p-1 rounded text-center text-[7.5px] font-bold">
              ✍️ تعديل بيانات الحاج والعائلة
            </div>
          </div>
        )}

        {type === 'data' && (
          <div className="p-2 space-y-1.5 flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="bg-amber-700 text-white p-1.5 rounded-lg text-center font-bold text-[8.5px]">
              بطاقة بيانات الحاج والعائلة
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200 text-[7.5px] space-y-1">
              <div><strong>الاسم:</strong> أحمد عبد الله الشريف</div>
              <div><strong>الجواز:</strong> A28914029 • مصري</div>
              <div><strong>النسك:</strong> حج تمتع / عمرة</div>
            </div>
            <div className="bg-emerald-50 p-1.5 rounded border border-emerald-200 text-[7.5px] space-y-0.5">
              <div className="font-bold text-emerald-900">👨‍👩‍👦 أفراد العائلة المضافون:</div>
              <div>• فاطمة الزهراء (الزوجة)</div>
              <div>• الحاج عبد الله (الوالد)</div>
            </div>
            <div className="bg-emerald-800 text-white py-1 rounded text-center text-[7.5px] font-bold">
              ✓ حفظ واعتماد البيانات
            </div>
          </div>
        )}

        {type === 'prep' && (
          <div className="p-2 space-y-1.5 flex flex-col justify-between h-full bg-slate-900 text-white">
            <div className="text-[8.5px] font-bold text-amber-300">🎒 حقيبة الاستعداد لرحلة العمر</div>
            <div className="bg-emerald-900/90 p-2 rounded-lg border border-emerald-600 flex items-center gap-2">
              <div className="w-9 h-9 rounded-full border-2 border-amber-400 flex items-center justify-center font-bold text-[8px] text-amber-300 shrink-0">
                82%
              </div>
              <div className="text-[7px]">
                <div className="font-bold text-white">جاهزية ممتازة</div>
                <div className="text-emerald-200">14 من 17 مهمة مكتملة</div>
              </div>
            </div>
            <div className="space-y-1 text-[7px] bg-slate-800 p-1.5 rounded">
              <div className="text-emerald-300">✓ التصاريح وجواز السفر (100%)</div>
              <div className="text-amber-300">✓ ملابس الإحرام والأدوية (85%)</div>
              <div className="text-slate-300">✓ الإلكترونيات والنظافة</div>
            </div>
            <div className="bg-emerald-700 text-white py-1 rounded text-center text-[7.5px] font-bold">
              مشاركة الحقيبة عبر واتساب
            </div>
          </div>
        )}

        {type === 'radar' && (
          <div className="p-2 space-y-1.5 flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="w-20 h-20 rounded-full bg-emerald-950 mx-auto border-2 border-emerald-500 relative flex items-center justify-center text-white">
              <span className="text-[7px] absolute top-1 text-emerald-300">N</span>
              <span className="text-[10px]">📍</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-4 left-4"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute bottom-4 right-4"></span>
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200 text-[7.5px] space-y-0.5">
              <div className="flex justify-between font-bold text-emerald-800">
                <span>🟢 الزوجة فاطمة</span>
                <span>45 متر</span>
              </div>
              <div className="flex justify-between font-bold text-amber-800">
                <span>🟢 الوالد (بالمخيم)</span>
                <span>180 متر</span>
              </div>
            </div>
            <div className="bg-emerald-800 text-white py-1 rounded text-center text-[7.5px] font-bold">
              📷 مسح QR لإضافة رفيق
            </div>
          </div>
        )}

        {type === 'camp' && (
          <div className="p-2 space-y-1.5 flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="bg-emerald-800 text-white p-1.5 rounded text-center text-[8px] font-bold">
              ⛺ مخيم منى وعرفة والإعاشة
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200 text-[7.5px]">
              <div className="font-bold text-emerald-900">مخيم منى - مربع 42</div>
              <div className="text-slate-600">جناح (ج) • سرير رقم: 18</div>
            </div>
            <div className="bg-amber-50 p-1.5 rounded border border-amber-200 text-[7.5px]">
              <div className="font-bold text-amber-900">🍽️ وجبة الغداء (1:30 م):</div>
              <div className="text-slate-600">أرز باللحم + فواكه + مياه مبردة</div>
            </div>
            <div className="bg-rose-600 text-white py-1 rounded text-center text-[7.5px] font-bold">
              🚨 استدعاء طبيب الحملة (SOS)
            </div>
          </div>
        )}

        {type === 'counter' && (
          <div className="p-2 space-y-1.5 flex flex-col justify-between h-full bg-slate-50 text-slate-800">
            <div className="w-18 h-18 rounded-full border-4 border-emerald-700 bg-emerald-50 mx-auto flex flex-col items-center justify-center">
              <span className="text-[7px] font-bold text-emerald-700">الشوط</span>
              <span className="text-[20px] font-black text-emerald-950 leading-none">5</span>
              <span className="text-[6.5px] text-slate-500">من 7 أشواط</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-1 rounded text-center text-[7px] text-amber-950 font-medium">
              &quot;رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...&quot;
            </div>
            <div className="bg-emerald-800 text-white py-1.5 rounded text-center text-[8px] font-bold">
              + تسجيل اكتمال الشوط (مع اهتزاز)
            </div>
          </div>
        )}
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
  const [activeTab, setActiveTab] = useState<'all' | 'steps' | 'screens' | 'contents' | 'pricing'>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const notify = (msg: string) => {
    setStatusMessage(msg);
    if (onShowToast) onShowToast(msg);
    setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev));
    }, 5000);
  };

  const companyName =
    userProfile?.tourismCompany?.name ||
    userProfile?.campaignName ||
    'شركة وفادة لخدمات الحج والعمرة والسياحة';
  const licenseNumber =
    userProfile?.tourismCompany?.licenseNumber || 'ترخيص وزارة الحج: 1042 / سياحة: 7421';

  const docOptions = {
    companyName,
    licenseNumber,
    activeSection: activeTab,
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    await downloadDirectPdfFile(docOptions, notify);
    setIsGeneratingPdf(false);
  };

  const handlePrintPdf = () => {
    executePrintOrExport(docOptions, notify);
  };

  const handleDownloadWord = () => {
    downloadWordDoc(docOptions);
    notify('تم تنزيل ملف الكتيب بصيغة Word (.doc) بنجاح!');
  };

  const handleCopySummary = () => {
    copyBrochureSummaryToClipboard(docOptions, notify);
  };

  const appScreens = [
    {
      id: 'home' as const,
      number: 'الصفحة 1',
      title: 'الشاشة الرئيسية وبطاقة الحاج الرقمية',
      subtitle: 'لوحة القيادة اللحظية للحاج والمعتمر فور فتح التطبيق',
      points: [
        'عرض بطاقة الحاج الذكية (الاسم، رقم الشارة، نوع النسك، وعدد المرافقين).',
        'عد تنازلي للصلاة القادمة في الحرم المكي الشريف مع جدول المواقيت.',
        'بطاقات تسكين فندق مكة المكرمة وفندق المدينة المنورة مع رقم الغرفة والمسافة للحرم.',
        'أزرار الاتصال السريع والواتساب المباشر بمشرف الرحلة والخط الساخن للشركة.',
      ],
    },
    {
      id: 'data' as const,
      number: 'الصفحة 2',
      title: 'نافذة إدخال بيانات الحاج والعائلة والشركة',
      subtitle: 'نظام مرن يدعم إصدار الأفراد (B2C) وإصدار شركات السياحة (B2B)',
      points: [
        'إدخال الاسم الرباعي، رقم جواز السفر/الهوية، الجنسية، ورقم الجوال.',
        'تحديد فندق مكة وفندق المدينة ورقم الغرفة وموقع مخيم منى وعرفة.',
        'إضافة أفراد العائلة (الزوجة، الوالد، الوالدة، الأبناء) بأسمائهم وأرقام هواتفهم.',
        'لوحة مخصصة لشركات السياحة لإدخال اسم الحملة والترخيص وتعميم التسكين على الفوج.',
      ],
    },
    {
      id: 'prep' as const,
      number: 'الصفحة 3',
      title: 'حقيبة الاستعداد لرحلة العمر',
      subtitle: 'قوائم تفقدية ذكية من عقد النية حتى صعود الطائرة',
      points: [
        'مؤشر دائري تفاعلي يحسب نسبة جاهزية السفر وعدد المهام المنجزة.',
        '5 أقسام مرتبة: التصاريح الرسمية، ملابس الإحرام، الأدوية الطبية، الإلكترونيات، والنظافة.',
        'إمكانية إضافة أغراض أو أدوية شخصية جديدة وحفظها على الهاتف.',
        'مشاركة قائمة الحقيبة بضغطة زر مع العائلة أو أفراد الفوج عبر واتساب.',
      ],
    },
    {
      id: 'radar' as const,
      number: 'الصفحة 4',
      title: 'رادار الرفاق ومؤشر الزحام اللحظي',
      subtitle: 'حماية العائلة وكبار السن من الضياع في الزحام بدون إنترنت',
      points: [
        'رادار دائري يحدد موقع كل فرد من العائلة والمسافة إليه بالمتر والاتجاه.',
        'اقتران فوري بين الجوالات عبر مسح كود QR بالكاميرا أو الإدخال اليدوي.',
        'إرسال نداء تنبيه واهتزاز صوتي للرفيق وتثبيت نقطة تجمع طارئة (Meeting Point).',
        'مؤشر حي لكثافة الزحام في صحن المطاف، المسعى، وجسر الجمرات لاختيار أفضل وقت.',
      ],
    },
    {
      id: 'camp' as const,
      number: 'الصفحة 5',
      title: 'مخيم المشاعر والإعاشة والطوارئ (SOS)',
      subtitle: 'دليل الإقامة والخدمات اللوجستية والطبية في منى وعرفة',
      points: [
        'توثيق رقم المربع، رقم الخيمة، ورقم السرير في مشعري منى وعرفات.',
        'جدول وجبات بوفيه الإعاشة اليومي (الإفطار، الغداء، العشاء) والتنبيهات الصحية.',
        'متتبع شرب الماء اليومي لحماية الحجاج من الإجهاد الحراري وضربات الشمس.',
        'زر الاستغاثة الطبية العاجلة (SOS) لاستدعاء طبيب ومسعف الحملة لسرير الحاج فوراً.',
      ],
    },
    {
      id: 'counter' as const,
      number: 'الصفحة 6',
      title: 'عداد المناسك الذكي والأدعية الصوتية',
      subtitle: 'عداد رقمي للطواف والسعي ورمي الجمرات لكبار السن وجميع الحجاج',
      points: [
        'عداد واضح للأشواط الـ 7 في الطواف حول الكعبة والسعي بين الصفا والمروة.',
        'اهتزاز وتنبيه صوتي عند إتمام كل شوط دون الحاجة للنظر المستمر للشاشة.',
        'عداد مخصص لرمي الجمرات (7 حصيات لكل جمرة: الصغرى، الوسطى، العقبة).',
        'عرض الأدعية المأثورة الصحيحة لكل شوط بخط واضح مع ميزة القراءة الصوتية.',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-0 sm:p-4">
      <div className="bg-surface w-full max-w-5xl rounded-none sm:rounded-3xl shadow-2xl flex flex-col border border-outline-variant/30 min-h-screen sm:min-h-0 sm:max-h-[94vh] overflow-hidden">
        {/* Top Action Header */}
        <div className="shrink-0 bg-primary text-on-primary px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[26px]">picture_as_pdf</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                كتيب تطبيق «مَنَاسِكِي» الشامل (PDF)
              </h2>
              <p className="text-[11px] sm:text-xs text-primary-fixed">
                يحتوي على خطوات الاستخدام، صفحات ومحتويات التطبيق الـ 6، وأسعار الباقات بالتفصيل
              </p>
            </div>
          </div>

          {/* Export & Download Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-xs transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isGeneratingPdf ? 'hourglass_top' : 'download'}
              </span>
              <span>
                {isGeneratingPdf ? 'جاري تجهيز ملف الـ PDF...' : 'تحميل ملف PDF مباشر (.pdf)'}
              </span>
            </button>

            {/* Print / Save as PDF */}
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>طباعة / عرض PDF</span>
            </button>

            {/* Download Editable Word */}
            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">article</span>
              <span className="hidden sm:inline">ملف Word</span>
            </button>

            {/* Copy WhatsApp Summary */}
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">content_copy</span>
              <span className="hidden md:inline">نسخ للواتساب</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs underline cursor-pointer">
              إغلاق
            </button>
          </div>
        )}

        {/* Easy Navigation Filter Bar */}
        <div className="shrink-0 bg-surface-container px-4 sm:px-6 py-2.5 border-b border-outline-variant/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-on-surface-variant font-bold ml-1 shrink-0">تصفح سريع:</span>
          {[
            { id: 'all', label: '📖 الكتيب الكامل (شامل كل شيء)' },
            { id: 'steps', label: '1️⃣ خطوات الاستخدام وإدخال البيانات' },
            { id: 'screens', label: '2️⃣ صفحات التطبيق الـ 6 (بالصور)' },
            { id: 'contents', label: '3️⃣ محتويات التطبيق ومقارنة الإصدارين' },
            { id: 'pricing', label: '4️⃣ أسعار الباقات (للأفراد والشركات)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Scrollable Booklet Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-surface-container-low/50">
          {/* COVER BANNER */}
          <div className="bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary rounded-3xl p-6 shadow-md border-2 border-secondary-fixed/40 text-center space-y-3">
            <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3.5 py-1 rounded-full">
              الدليل التعريفي والتشغيلي الشامل • يعمل 100% دون إنترنت
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              كتيب تطبيق « مَنَاسِكِي | MANASIKI »
            </h1>
            <p className="text-xs sm:text-sm text-primary-fixed max-w-2xl mx-auto">
              رفيق الحاج والمعتمر الذكي من تجهيز حقيبة السفر، وتوثيق بيانات الفنادق والعائلة، ورادار منع الضياع، وحتى إتمام الطواف والسعي والعودة بسلام
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
              <span className="bg-white/15 px-3 py-1 rounded-lg font-semibold">
                🏢 الجهة: {companyName}
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-lg font-semibold">
                📜 {licenseNumber}
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-lg font-semibold">
                🌐 الرابط: manasiki.4digital.net
              </span>
            </div>
          </div>

          {/* SECTION 1: STEP-BY-STEP GUIDE */}
          {(activeTab === 'all' || activeTab === 'steps') && (
            <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-outline-variant/25 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-primary">
                      أولاً: خطوات استخدام التطبيق وإدخال البيانات (خطوة بخطوة)
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      طريقة سهلة ومباشرة سواء للمعتمر الفرد وعائلته أو لشركات السياحة والحملات
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Individual Steps */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm border-b border-emerald-200 pb-2">
                    <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                    <span>أ) خطوات المعتمر الفرد والعائلة (إصدار الأفراد B2C)</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <strong className="text-emerald-950 block">فتح الرابط وتثبيت التطبيق مجاناً:</strong>
                        <span className="text-slate-600">
                          افتح الرابط على جوالك واضغط زر «تثبيت التطبيق مجاناً» في الشريط العلوي ليظهر على شاشة هاتفك فوراً بدون متجر.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <div>
                        <strong className="text-emerald-950 block">إدخال بيانات الحاج والفنادق:</strong>
                        <span className="text-slate-600">
                          اضغط زر «إدخال وتعديل بيانات الحاج والعائلة ✍️» في الشاشة الرئيسية، وسجّل اسمك، رقم الجواز، وفندقي مكة والمدينة ورقم الغرفة.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <div>
                        <strong className="text-emerald-950 block">إضافة وربط أفراد العائلة:</strong>
                        <span className="text-slate-600">
                          أضف الزوجة، الوالدين، والأبناء داخل البطاقة، وامسح كود الـ QR من شاشة «رادار الرفاق» لتتبع المسافة بينهم بالمتر في الزحام دون إنترنت.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                        4
                      </span>
                      <div>
                        <strong className="text-emerald-950 block">إتمام المناسك والطواف بسهولة:</strong>
                        <span className="text-slate-600">
                          استخدم «حقيبة الاستعداد» قبل السفر، و«عداد المناسك الذكي» لحساب أشواط الطواف والسعي بالاهتزاز والأدعية الصوتية.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Steps */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm border-b border-amber-200 pb-2">
                    <span className="material-symbols-outlined text-[20px]">business</span>
                    <span>ب) خطوات شركات السياحة والحملات (إصدار الشركات B2B)</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <strong className="text-amber-950 block">إعداد بيانات الشركة والترخيص:</strong>
                        <span className="text-slate-600">
                          اضغط زر «تعديل الشركة» في أعلى التطبيق، وأدخل اسم شركة السياحة، رقم الترخيص، الخط الساخن، ورقم واتساب المشرف.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <div>
                        <strong className="text-amber-950 block">تسكين فنادق مكة والمدينة والمخيم:</strong>
                        <span className="text-slate-600">
                          أدخل اسم فندق مكة وفندق المدينة، المسافة للحرم، أرقام الغرف المخصصة للفوج، ورقم مخيم منى وعرفة.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <div>
                        <strong className="text-amber-950 block">اعتماد وتوزيع البطاقات على الفوج:</strong>
                        <span className="text-slate-600">
                          بمجرد الحفظ، تظهر هوية الشركة والفنادق وأرقام المشرفين في بطاقات جميع حجاج الفوج، مع إمكانية طباعة الكشوف.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center shrink-0">
                        4
                      </span>
                      <div>
                        <strong className="text-amber-950 block">متابعة الفوج والنداء الطبي العاجل:</strong>
                        <span className="text-slate-600">
                          حدد نقطة التجمع الرسمية للفوج على الرادار لمنع التخلف عن الباصات، وتلقَّ طلبات استدعاء الطبيب (SOS) برقم السرير.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: ALL 6 APPLICATION PAGES / SCREENS */}
          {(activeTab === 'all' || activeTab === 'screens') && (
            <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-outline-variant/25 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-primary">
                      ثانياً: صفحات وشاشات التطبيق الـ 6 بالتفصيل (مع معاينة حية لكل صفحة)
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      كل شاشة مصممة بخط واضح وأزرار كبيرة تناسب كبار السن وتعمل بالكامل دون إنترنت
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appScreens.map((scr) => (
                  <div
                    key={scr.id}
                    className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/25 flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <ScreenPhonePreview type={scr.id} companyName={companyName} />
                    <div className="flex-1 space-y-2 text-right">
                      <span className="inline-block bg-primary text-on-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {scr.number}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-primary">{scr.title}</h3>
                      <p className="text-[11px] text-secondary font-semibold">{scr.subtitle}</p>
                      <ul className="space-y-1.5 text-xs text-on-surface pt-1">
                        {scr.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-primary font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 3: CONTENTS & COMPARISON TABLE */}
          {(activeTab === 'all' || activeTab === 'contents') && (
            <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-outline-variant/25 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-primary">
                      ثالثاً: ملخص محتويات التطبيق والفرق بين إصدار الشركات وإصدار الأفراد
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      مقارنة شاملة توضح كيف يخدم التطبيق كلاً من المعتمر المستقل وشركة السياحة
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                  <h3 className="font-bold text-sm text-emerald-900 border-b border-emerald-200 pb-2">
                    🏢 أولاً: محتويات ومميزات إصدار شركات السياحة والحملات (B2B)
                  </h3>
                  <p className="text-slate-700">
                    <strong>• الهوية التجارية والترخيص:</strong> يحمل التطبيق اسم شركة السياحة، وشعارها، ورقم ترخيص وزارة السياحة والحج، مع أزرار اتصال وواتساب مباشر بمشرف الرحلة.
                  </p>
                  <p className="text-slate-700">
                    <strong>• إدخال البيانات وتسكين الفوج مركزياً:</strong> يقوم مشرف الشركة بإدخال اسم فندق مكة وفندق المدينة وأرقام الغرف ورقم مخيم منى وعرفة والسرير لتظهر تلقائياً لجميع حجاج الحملة.
                  </p>
                  <p className="text-slate-700">
                    <strong>• الرادار الميداني والإعاشة والطوارئ:</strong> يتيح للشركة تثبيت نقطة تجمع رسمية للفوج على الرادار لمنع التيه، ونشر جدول وجبات البوفيه اليومي، واستقبال نداءات الاستغاثة الطبية (SOS) لرقم سرير الحاج.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                  <h3 className="font-bold text-sm text-amber-900 border-b border-amber-200 pb-2">
                    👤 ثانياً: محتويات ومميزات إصدار الأفراد والعائلات (B2C)
                  </h3>
                  <p className="text-slate-700">
                    <strong>• النسخة المجانية الإيمانية (صدقة جارية):</strong> تتيح لكل معتمر وحاج استخدام عداد الطواف والسعي والجمرات بالاهتزاز الصوتي، وقراءة واستماع الأدعية المأثورة، ومواقيت الصلاة، وحقيبة الاستعداد للسفر مجاناً.
                  </p>
                  <p className="text-slate-700">
                    <strong>• إدخال ذاتي سهل للحاج وعائلته:</strong> يسجل المعتمر بياناته الشخصية وفندقه ورقم غرفته وأسماء المرافقين معه (الزوجة، الوالدين، الأبناء) مباشرة من الشاشة الرئيسية.
                  </p>
                  <p className="text-slate-700">
                    <strong>• رادار العائلة دون إنترنت:</strong> يربط رب الأسرة هواتف عائلته معاً بمسح كود QR ليتابع المسافة بينهم بالمتر والاتجاه داخل الحرم والمشاعر دون الحاجة لشبكة إنترنت.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: PRICING PACKAGES */}
          {(activeTab === 'all' || activeTab === 'pricing') && (
            <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-outline-variant/25 space-y-5">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                    4
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-primary">
                      رابعاً: أسعار الباقات والاشتراكات (أسعار رمزية في متناول الجميع)
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      باقات مرنة وميسرة لشركات السياحة والحملات، وباقات للأفراد والعائلات تبدأ مجاناً
                    </p>
                  </div>
                </div>
              </div>

              {/* B2B Pricing Cards */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px]">domain</span>
                  <span>1. أسعار باقات شركات السياحة والحملات (B2B):</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        حتى 50 معتمر
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-2">باقة الانطلاق للأفواج الصغيرة</h4>
                      <div className="text-2xl font-black text-emerald-800 my-1">400 ج.م</div>
                      <p className="text-[11px] text-secondary font-bold">8 ج.م فقط للمعتمر الواحد (للرحلة)</p>
                      <p className="text-xs text-on-surface-variant mt-2">
                        اسم وترخيص الشركة، تسكين فنادق مكة والمدينة، عداد المناسك والرادار.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-600 flex flex-col justify-between relative shadow-sm">
                    <span className="absolute -top-2.5 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      الأكثر طلباً ⭐
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
                        حتى 200 معتمر
                      </span>
                      <h4 className="text-sm font-bold text-emerald-950 mt-2">باقة الحملات المتوسطة</h4>
                      <div className="text-2xl font-black text-emerald-800 my-1">900 ج.م</div>
                      <p className="text-[11px] text-amber-800 font-bold">4.5 ج.م فقط للمعتمر الواحد (للرحلة)</p>
                      <p className="text-xs text-slate-700 mt-2">
                        توزيع الغرف، تثبيت نقطة تجمع الفوج على الرادار، والاتصال المباشر بالمشرف.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        حتى 500 حاج/معتمر
                      </span>
                      <h4 className="text-sm font-bold text-primary mt-2">باقة الشركات الكبرى وموسم الحج</h4>
                      <div className="text-2xl font-black text-emerald-800 my-1">1,800 ج.م</div>
                      <p className="text-[11px] text-secondary font-bold">3.6 ج.م فقط للحاج الواحد (للموسم)</p>
                      <p className="text-xs text-on-surface-variant mt-2">
                        إدارة مخيم منى وعرفة، بوفيه الإعاشة، واستدعاء طبيب الحملة (SOS) للسرير.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                        غير محدود طوال العام
                      </span>
                      <h4 className="text-sm font-bold text-amber-950 mt-2">الباقة السنوية المفتوحة للشركات</h4>
                      <div className="text-2xl font-black text-amber-800 my-1">3,500 ج.م</div>
                      <p className="text-[11px] text-amber-900 font-bold">اشتراك سنوي لجميع الأفواج</p>
                      <p className="text-xs text-slate-700 mt-2">
                        أفواج غير محدودة طوال السنة (عمرة + حج) مع تخصيص كامل باسم وشعار الشركة.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom Domain Special Note */}
                <div className="p-3.5 rounded-2xl bg-emerald-900/5 border border-emerald-700/30 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-700 text-[20px] shrink-0 mt-0.5">
                    language
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-emerald-900">تنويه هام لشركات السياحة والحملات:</strong> من الممكن تخصيص وحجز{' '}
                    <strong className="text-emerald-800">دومين (رابط إلكتروني) خاص ومستقل بالكامل باسم الشركة</strong>{' '}
                    (مثلاً: <span dir="ltr" className="font-mono font-bold text-emerald-900">app.yourcompany.com</span>) بأسعار خاصة حسب طلب الشركة، ليعمل التطبيق كواجهة رسمية حصرية للشركة أمام معتمريها وحجاجها.
                  </p>
                </div>
              </div>

              {/* B2C Pricing Cards */}
              <div className="space-y-3 pt-2 border-t border-outline-variant/20">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                  <span>2. أسعار باقات الأفراد والعائلات المستقلين (B2C):</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      مجاناً لوجه الله
                    </span>
                    <h4 className="text-sm font-bold text-primary mt-2">الباقة الأساسية الإيمانية</h4>
                    <div className="text-2xl font-black text-emerald-700 my-1">0 ج.م</div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      عداد الطواف والسعي بالاهتزاز، الأدعية المأثورة، مواقيت الصلاة، وحقيبة السفر.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      للمعتمر المنفرد
                    </span>
                    <h4 className="text-sm font-bold text-primary mt-2">باقة المعتمر الذكي</h4>
                    <div className="text-2xl font-black text-amber-800 my-1">59 ج.م</div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      رادار الرفاق دون إنترنت، حفظ موقع الفندق والخيمة، ومؤشر كثافة الزحام طوال الرحلة.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 relative shadow-sm">
                    <span className="absolute -top-2.5 left-3 bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      الأفضل للأسرة ⭐
                    </span>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                      حتى 5 أفراد (20 ج.م للفرد)
                    </span>
                    <h4 className="text-sm font-bold text-amber-950 mt-2">باقة العائلة والأقارب</h4>
                    <div className="text-2xl font-black text-amber-800 my-1">100 ج.م</div>
                    <p className="text-xs text-slate-700 mt-2">
                      ربط 5 هواتف عائلية على الرادار المتري دون إنترنت، نداء الاهتزاز، ومشاركة الحقيبة.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      مدى الحياة (LifeTime)
                    </span>
                    <h4 className="text-sm font-bold text-primary mt-2">باقة مدى الحياة الشاملة</h4>
                    <div className="text-2xl font-black text-primary my-1">150 ج.م</div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      تدفع مرة واحدة لجميع رحلات العمرة والحج القادمة مع ربط حتى 8 أجهزة عائلية.
                    </p>
                  </div>
                </div>

                {/* Explanation of Family Package Mechanism */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300/70 space-y-2 mt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-700 text-[18px]">qr_code_scanner</span>
                    <span>شرح آلية العمل في باقة العائلة والأقارب (100 ج.م):</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>1. إعداد بيانات العائلة من هاتف رب الأسرة:</strong> يقوم رب الأسرة بفتح التطبيق والدخول إلى نافذة «بيانات الحاج والعائلة»، ثم يسجل اسم فندق مكة وفندق المدينة ورقم الغرفة، ويضيف أسماء أفراد عائلته أو أقاربه المرافقين له (حتى 5 أفراد كالأم، الزوجة، الأبناء، أو كبار السن) مع صلة القرابة ورقم الهاتف.
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>2. الربط المباشر بين الهواتف بكود QR دون إنترنت:</strong> يفتح رب الأسرة صفحة «رادار الرفاق» فيظهر له كود استجابة سريعة (QR Code) خاص بعائلته، فيقوم باقي أفراد الأسرة بمسح هذا الكود بكاميرا هواتفهم مرة واحدة فقط قبل النزول للحرم، لتقترن الهواتف الخمسة ببعضها محلياً دون الحاجة لاتصال بالإنترنت أثناء الزحام.
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>3. التتبع المتري ونداء الاهتزاز في الزحام:</strong> أثناء الطواف أو السعي أو رمي الجمرات، يظهر لكل فرد من العائلة على شاشة الرادار اتجاه ومسافة باقي أفراد أسرته بالمتر والسهم الموجه، مع إمكانية الضغط على زر «نداء اهتزازي» ليهتز هاتف أحد أفراد العائلة فوراً إذا ابتعد عن المجموعة، بالإضافة إلى تثبيت موقع بوابة الحرم أو الفندق كنقطة التقاء عائلية موحدة.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Bottom Direct PDF Call-To-Action */}
          <div className="bg-primary text-on-primary rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                هل ترغب في الاحتفاظ بهذا الكتيب كملف PDF جاهز على هاتفك أو كمبيوترك؟
              </h3>
              <p className="text-xs text-primary-fixed mt-0.5">
                اضغط الزر لتحميل ملف PDF منسق في 3 صفحات A4 يحتوي على الخطوات والصفحات والأسعار كاملة.
              </p>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-5 py-3 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-md cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>
                {isGeneratingPdf ? 'جاري التحويل لملف PDF...' : 'تحميل الكتيب كملف PDF الآن (.pdf)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
