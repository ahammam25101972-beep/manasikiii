import { useState } from 'react';
import { TabId, TourismCompany, UserProfile } from './types';
import { USER_PROFILE } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { EmergencyModal } from './components/EmergencyModal';
import { QrScannerModal } from './components/QrScannerModal';
import { ExportModal } from './components/ExportModal';
import { InstallAppModal } from './components/InstallAppModal';
import { CompanySettingsModal } from './components/CompanySettingsModal';
import { DocumentationModal } from './components/DocumentationModal';
import { PilgrimDataModal } from './components/PilgrimDataModal';

import { HomeScreen } from './screens/HomeScreen';
import { RitualsCounterScreen } from './screens/RitualsCounterScreen';
import { PreparationScreen } from './screens/PreparationScreen';
import { CampScreen } from './screens/CampScreen';
import { RadarScreen } from './screens/RadarScreen';
export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('al-raisiya');
  const [deviceFrame, setDeviceFrame] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);
  const [docModalOpen, setDocModalOpen] = useState<boolean>(false);
  const [pilgrimModalOpen, setPilgrimModalOpen] = useState<boolean>(false);
  const [pilgrimModalMode, setPilgrimModalMode] = useState<'individual' | 'company'>('individual');

  // Synchronized Profile, Company and Hotel state across all screens
  const [userProfile, setUserProfile] = useState<UserProfile>(USER_PROFILE);
  const [companyModalOpen, setCompanyModalOpen] = useState<boolean>(false);
  const [companyModalTab, setCompanyModalTab] = useState<'company' | 'makkah' | 'madinah' | 'hotel'>('company');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const handleOpenCompanySettings = (tab: 'company' | 'makkah' | 'madinah' | 'hotel' = 'company') => {
    setCompanyModalTab(tab);
    setCompanyModalOpen(true);
  };

  const handleSaveCompanyAndHotel = (
    updatedCompany: TourismCompany,
    updatedMakkahHotel: {
      hotelName: string;
      hotelAddress: string;
      hotelRoom: string;
      hotelDistanceToHaram: string;
      hotelPhone: string;
    },
    updatedMadinahHotel: {
      hotelName: string;
      hotelAddress: string;
      hotelRoom: string;
      hotelDistanceToHaram: string;
      hotelPhone: string;
    }
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      campaignName: updatedCompany.name,
      tourismCompany: updatedCompany,
      hotelName: updatedMakkahHotel.hotelName,
      hotelAddress: updatedMakkahHotel.hotelAddress,
      hotelRoom: updatedMakkahHotel.hotelRoom,
      hotelDistanceToHaram: updatedMakkahHotel.hotelDistanceToHaram,
      hotelPhone: updatedMakkahHotel.hotelPhone,
      makkahHotel: { ...updatedMakkahHotel, city: 'makkah' },
      madinahHotel: { ...updatedMadinahHotel, city: 'madinah' },
    }));
  };

  const handleOpenPilgrimDataModal = (mode: 'individual' | 'company' = 'individual') => {
    setPilgrimModalMode(mode);
    setPilgrimModalOpen(true);
  };

  const handleConfirmEmergency = () => {
    showToast('تم إرسال النداء العاجل! المسعف وطبيب المخيم في طريقهما إلى سريرك (جناح ج سرير 18) خلال دقيقتين.');
  };

  const handleAddCompanionFromQr = (name: string, relation: string) => {
    showToast(`تمت إضافة ${name} (${relation}) إلى شبكة رادار المشاعر بنجاح!`);
  };

  const [activePackage, setActivePackage] = useState<string>(() => {
    try {
      return localStorage.getItem('manasiki_active_package') || 'free';
    } catch {
      return 'free';
    }
  });
  const [packageModalOpen, setPackageModalOpen] = useState<boolean>(false);
  const [activationCodeInput, setActivationCodeInput] = useState<string>('');
  const [fbPageUrl, setFbPageUrl] = useState<string>(() => {
    const defaultUrl = 'https://www.facebook.com/profile.php?id=61582844093225';
    try {
      const saved = localStorage.getItem('manasiki_fekra_fb_url');
      if (!saved || saved.includes('100002672004155')) {
        localStorage.setItem('manasiki_fekra_fb_url', defaultUrl);
        return defaultUrl;
      }
      return saved;
    } catch {
      return defaultUrl;
    }
  });
  const [editingFbUrl, setEditingFbUrl] = useState<boolean>(false);
  const [genPackage, setGenPackage] = useState<string>('smart59');
  const [genClientName, setGenClientName] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [showAdminGenerator, setShowAdminGenerator] = useState<boolean>(false);

  const packageLabels: Record<string, { name: string; badge: string }> = {
    free: { name: 'الباقة الأساسية الإيمانية (مجانية)', badge: 'النسخة المجانية 0 ج.م' },
    smart59: { name: 'باقة المعتمر الذكي الفردية', badge: 'مفعّلة • 59 ج.م' },
    family100: { name: 'باقة العائلة والأقارب (5 أفراد)', badge: 'مفعّلة • 100 ج.م' },
    lifetime150: { name: 'باقة مدى الحياة الشاملة', badge: 'مفعّلة مدى الحياة • 150 ج.م' },
    b2b400: { name: 'باقة الانطلاق للأفواج الصغيرة (50 معتمر)', badge: 'شركات • 400 ج.م' },
    b2b900: { name: 'باقة الحملات المتوسطة (200 معتمر)', badge: 'شركات • 900 ج.م' },
    b2b1800: { name: 'باقة الشركات الكبرى وموسم الحج (500 حاج)', badge: 'شركات • 1,800 ج.م' },
    b2b3500: { name: 'الباقة السنوية المفتوحة للشركات', badge: 'شركات سنوي • 3,500 ج.م' },
  };

  const handleActivatePackage = (pkgKey: string, label: string) => {
    setActivePackage(pkgKey);
    try {
      localStorage.setItem('manasiki_active_package', pkgKey);
    } catch {
      // ignore
    }
    setPackageModalOpen(false);
    showToast(`تم تفعيل «${label}» بنجاح على هذا الجهاز!`);
  };

  const handleVerifyActivationCode = () => {
    const raw = activationCodeInput.trim().toUpperCase();
    if (!raw) return;

    // Secret admin unlock exclusively for Ahmed Hammam
    if (
      raw === 'HAMMAM' ||
      raw === '01205132328' ||
      raw === 'FEKRA' ||
      raw === 'ADMIN' ||
      raw === '+201205132328'
    ) {
      setPackageModalOpen(false);
      setActivationCodeInput('');
      setShowAdminGenerator(true);
      showToast('مرحباً بك يا أ. أحمد همام! تم فتح لوحة توليد الأكواد السرية.');
      return;
    }

    let targetKey: string | null = null;

    const codeMap: Record<string, string> = {
      FREE: 'free',
      SMART59: 'smart59',
      FAMILY100: 'family100',
      VIP150: 'lifetime150',
      COMP400: 'b2b400',
      COMP900: 'b2b900',
      COMP1800: 'b2b1800',
      COMP3500: 'b2b3500',
    };

    if (codeMap[raw]) {
      targetKey = codeMap[raw];
    } else if (raw.startsWith('SMART') || raw.startsWith('MK59')) {
      targetKey = 'smart59';
    } else if (raw.startsWith('FAM') || raw.startsWith('MK100')) {
      targetKey = 'family100';
    } else if (raw.startsWith('VIP') || raw.startsWith('LIFE') || raw.startsWith('MK150')) {
      targetKey = 'lifetime150';
    } else if (raw.startsWith('COMP400') || raw.startsWith('B2B400') || raw.startsWith('C400')) {
      targetKey = 'b2b400';
    } else if (raw.startsWith('COMP900') || raw.startsWith('B2B900') || raw.startsWith('C900')) {
      targetKey = 'b2b900';
    } else if (raw.startsWith('COMP1800') || raw.startsWith('B2B1800') || raw.startsWith('C1800')) {
      targetKey = 'b2b1800';
    } else if (raw.startsWith('COMP3500') || raw.startsWith('B2B3500') || raw.startsWith('C3500')) {
      targetKey = 'b2b3500';
    }

    if (targetKey && packageLabels[targetKey]) {
      handleActivatePackage(targetKey, packageLabels[targetKey].name);
      setActivationCodeInput('');
    } else {
      showToast('كود التفعيل غير صحيح. للحصول على كود مخصص تواصل مع أ. أحمد همام: +20 1205132328');
    }
  };

  const handleGenerateClientCode = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000);
    const prefixes: Record<string, string> = {
      smart59: 'SMART',
      family100: 'FAM',
      lifetime150: 'VIP',
      b2b400: 'COMP400',
      b2b900: 'COMP900',
      b2b1800: 'COMP1800',
      b2b3500: 'COMP3500',
    };
    const pfx = prefixes[genPackage] || 'SMART';
    const cleanClient = genClientName.trim().replace(/\s+/g, '-').slice(0, 10);
    const code = cleanClient ? `${pfx}-${cleanClient}-${randomPin}` : `${pfx}-${randomPin}`;
    setGeneratedCode(code);

    const clientGreeting = genClientName.trim()
      ? `أهلاً بك يا فندم (${genClientName.trim()})`
      : 'أهلاً بك يا فندم';
    const message = `${clientGreeting}،
تم استلام قيمة الاشتراك بنجاح. كود التفعيل المخصص لحسابك في تطبيق «مَنَاسِكِي | Manasiki» هو:
🔑 كود التفعيل: ${code}
📦 الباقة: ${packageLabels[genPackage]?.name || genPackage}

خطوات التفعيل:
1. افتح رابط التطبيق: https://manasiki.4digital.net
2. اضغط على زر الباقة أعلى الشاشة.
3. اكتب كود التفعيل (${code}) واضغط «تفعيل الكود».

شكراً لاختيارك «فكرة للتطبيقات»
أ. أحمد همام (+20 1205132328)`;

    navigator.clipboard
      .writeText(message)
      .then(() => {
        showToast(`تم توليد الكود (${code}) ونسخ رسالة التفعيل للعميل لواتساب!`);
      })
      .catch(() => {
        showToast(`تم توليد الكود (${code}) بنجاح!`);
      });
  };

  return (
    <div className={`min-h-screen bg-surface font-sans text-on-surface flex flex-col items-center justify-start ${deviceFrame ? 'py-4 sm:py-8 bg-surface-dim/40' : ''}`}>
      {/* Outer wrapper: When deviceFrame is active, wraps in a smartphone frame mockup */}
      <div
        className={`w-full flex flex-col relative transition-all duration-300 ${
          deviceFrame
            ? 'max-w-[430px] min-h-[900px] rounded-[44px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] border-[8px] border-slate-800 bg-surface overflow-hidden my-auto'
            : 'min-h-screen'
        }`}
      >
        {/* Header Bar */}
        <Header
          deviceFrame={deviceFrame}
          setDeviceFrame={setDeviceFrame}
          onOpenExport={() => setExportModalOpen(true)}
          onOpenInstallModal={() => setInstallModalOpen(true)}
          onOpenDocumentation={() => setDocModalOpen(true)}
          userProfile={userProfile}
          onOpenCompanySettings={handleOpenCompanySettings}
          onOpenPilgrimDataModal={handleOpenPilgrimDataModal}
          onUpdateUserProfile={setUserProfile}
        />

        {/* Screen Switcher Banner for quick testing across all screens */}
        <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant/15 flex items-center justify-between overflow-x-auto text-xs no-scrollbar gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-primary shrink-0 ml-1">الشاشات:</span>
            <button
              onClick={() => setCurrentTab('al-istiadad-wa-al-haqiba')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'al-istiadad-wa-al-haqiba'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              1. الحقيبة
            </button>
            <button
              onClick={() => setCurrentTab('al-kharita-wa-al-radar')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'al-kharita-wa-al-radar'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              2. الرادار والزحام
            </button>
            <button
              onClick={() => setCurrentTab('al-mukhayyam-wa-al-khadamat')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'al-mukhayyam-wa-al-khadamat'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              3. المخيم والإعاشة
            </button>
            <button
              onClick={() => setCurrentTab('al-manasik-wa-al-idad')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'al-manasik-wa-al-idad'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              4. عداد المناسك
            </button>
            <button
              onClick={() => setCurrentTab('al-raisiya')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'al-raisiya'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              الرئيسية
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Active Package Status & Activation Trigger */}
            <button
              onClick={() => setPackageModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold shadow-xs hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1 shrink-0 text-[11px]"
              title="حالة الباقة الحالية وتفعيل باقات العائلة أو الشركات"
            >
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>{packageLabels[activePackage]?.badge || 'النسخة المجانية'}</span>
            </button>

            {/* Direct trigger for the Presentation & Documentation Dossier */}
            <button
              onClick={() => setDocModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-bold shadow-xs hover:bg-secondary-fixed-dim transition-all cursor-pointer flex items-center gap-1 shrink-0 text-xs"
              title="عرض ملف التوثيق الشامل للطباعة وتقديمه للشركات"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>ملف التوثيق والطباعة (PDF)</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {currentTab === 'al-raisiya' && (
            <HomeScreen
              onNavigateTab={setCurrentTab}
              onShowToast={showToast}
              company={userProfile.tourismCompany}
              userProfile={userProfile}
              onOpenCompanySettings={handleOpenCompanySettings}
              onOpenPilgrimDataModal={handleOpenPilgrimDataModal}
              onOpenDocumentation={() => setDocModalOpen(true)}
            />
          )}

          {currentTab === 'al-manasik-wa-al-idad' && (
            <RitualsCounterScreen onShowToast={showToast} />
          )}

          {currentTab === 'al-istiadad-wa-al-haqiba' && (
            <PreparationScreen onShowToast={showToast} />
          )}

          {currentTab === 'al-mukhayyam-wa-al-khadamat' && (
            <CampScreen
              onShowToast={showToast}
              onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
              userProfile={userProfile}
              onOpenCompanySettings={handleOpenCompanySettings}
            />
          )}

          {currentTab === 'al-kharita-wa-al-radar' && (
            <RadarScreen
              onShowToast={showToast}
              onOpenQrScanner={() => setQrModalOpen(true)}
            />
          )}

          {/* Developer Credit Footer (Ahmed Hammam - Fekra for Apps) */}
          <footer className="w-full max-w-2xl mx-auto px-gutter pb-24 pt-2 mt-auto">
            <div className="rounded-2xl bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary px-4 py-3 shadow-md border border-secondary/30 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-secondary-fixed">
                  تصميم التطبيق بواسطة أحمد همام :
                </span>
                <a
                  href="tel:+201205132328"
                  className="font-extrabold text-white underline hover:text-secondary-fixed transition-colors"
                  dir="ltr"
                >
                  +20 1205132328
                </a>
                <a
                  href="https://wa.me/201205132328"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-colors"
                  title="تواصل عبر واتساب"
                >
                  <span>واتساب</span>
                </a>
                <span className="text-secondary-fixed font-black">|</span>
                <span className="font-medium text-primary-fixed">
                  إذا كان لديك فكرة أو تصميم موقع أو متجر تواصل معنا
                </span>
                <span className="text-secondary-fixed font-black">|</span>
                <a
                  href={fbPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-secondary-fixed hover:text-white underline transition-colors"
                >
                  فكرة للتطبيقات
                </a>
                <button
                  type="button"
                  onClick={() => setEditingFbUrl((prev) => !prev)}
                  className="text-[10px] text-primary-fixed/80 hover:text-white cursor-pointer px-1"
                  title="تعديل رابط صفحة فيسبوك فكرة للتطبيقات"
                >
                  ⚙️
                </button>
              </div>

              {editingFbUrl && (
                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                  <input
                    type="url"
                    dir="ltr"
                    value={fbPageUrl}
                    onChange={(e) => {
                      setFbPageUrl(e.target.value);
                      try {
                        localStorage.setItem('manasiki_fekra_fb_url', e.target.value);
                      } catch {
                        // ignore
                      }
                    }}
                    placeholder="https://www.facebook.com/..."
                    className="flex-1 h-8 px-2.5 rounded-lg bg-white text-slate-900 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFbUrl(false);
                      showToast('تم حفظ رابط صفحة فيسبوك «فكرة للتطبيقات» بنجاح!');
                    }}
                    className="px-3 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-bold text-xs cursor-pointer"
                  >
                    حفظ الرابط
                  </button>
                </div>
              )}
            </div>
          </footer>
        </main>

        {/* Persistent Bottom Navigation Bar */}
        <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Interactive Global Toast */}
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

        {/* Package & Activation System Modal */}
        {packageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-5 sm:p-6 shadow-2xl border border-outline-variant/30 text-right max-h-[88vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-primary">
                    نظام الباقات والتفعيل في التطبيق
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    آلية عمل النسخة المجانية وترقية باقات الأفراد والعائلات وشركات السياحة
                  </p>
                </div>
                <button
                  onClick={() => setPackageModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Current Active Package */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    الباقة المفعّلة حالياً على جهازك:
                  </span>
                  <strong className="text-sm font-black text-emerald-950">
                    {packageLabels[activePackage]?.name}
                  </strong>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold">
                  {packageLabels[activePackage]?.badge}
                </span>
              </div>

              {/* Enter Activation Code */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
                <label className="text-xs font-bold text-primary block">
                  إدخال كود تفعيل الباقة (للمعتمرين والعائلات والشركات):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={activationCodeInput}
                    onChange={(e) => setActivationCodeInput(e.target.value)}
                    placeholder="أدخل كود التفعيل (مثال: FAMILY100 أو SMART59)"
                    className="flex-1 h-10 px-3 rounded-xl bg-surface border border-outline-variant/40 text-xs font-bold outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyActivationCode}
                    className="h-10 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer hover:bg-primary-container shrink-0"
                  >
                    تفعيل الكود
                  </button>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  أدخل كود التفعيل المخصص الذي استلمته عبر واتساب بعد الاشتراك لتفعيل باقتك فوراً على هذا الجهاز.
                </p>
              </div>

              {/* Package Details & Pricing List (User-Facing only, no activation shortcuts) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-on-surface block">
                  تفاصيل وأسعار الباقات المتاحة:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl border border-outline-variant/30 bg-surface">
                    <div className="flex items-center justify-between">
                      <strong className="text-primary font-bold">باقة المعتمر الذكي</strong>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">59 ج.م</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">تتبع الرادار، العداد بالأدعية بالصوت المصري، وحقيبة السفر.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-outline-variant/30 bg-surface">
                    <div className="flex items-center justify-between">
                      <strong className="text-primary font-bold">باقة العائلة والأقارب</strong>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">100 ج.م</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">ربط 5 أجهزة عائلية برادار المشاعر دون إنترنت وتنبيه الاهتزاز.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-outline-variant/30 bg-surface">
                    <div className="flex items-center justify-between">
                      <strong className="text-primary font-bold">باقة مدى الحياة (LifeTime)</strong>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">150 ج.م</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">تدفع مرة واحدة لجميع رحلات العمرة والحج القادمة لـ 8 أفراد.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-outline-variant/30 bg-surface">
                    <div className="flex items-center justify-between">
                      <strong className="text-primary font-bold">باقات شركات السياحة (B2B)</strong>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">تبدأ من 400 ج</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">إدارة الأفواج والفنادق والمخيم مع إمكانية دومين خاص باسم الشركة.</p>
                  </div>
                </div>
              </div>

              {/* Contact Developer to Subscribe */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-amber-950">
                  <strong>للاشتراك والحصول على كود التفعيل أو دومين باسم شركتك:</strong>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    تواصل مع مصمم التطبيق أ. أحمد همام : <strong dir="ltr">+20 1205132328</strong>
                  </p>
                </div>
                <a
                  href="https://wa.me/201205132328?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D9%81%D8%B9%D9%8A%D9%84%20%D8%A8%D8%A7%D9%82%D8%A9%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D9%85%D9%86%D8%A7%D8%B3%D9%83%D9%8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
                >
                  طلب تفعيل عبر واتساب
                </a>
              </div>
            </div>
          </div>
        )}

        {/* SECRET ADMIN MODAL (Exclusively for Ahmed Hammam - completely invisible to regular users) */}
        {showAdminGenerator && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl bg-slate-900 text-slate-100 p-5 sm:p-6 shadow-2xl border-2 border-amber-500/50 text-right max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-[20px]">admin_panel_settings</span>
                    <h3 className="text-base sm:text-lg font-bold text-amber-300">
                      لوحة تحكم الأكواد السرية (أ. أحمد همام)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    خاصة بك فقط لتوليد كود فريد لكل عميل بعد استلام التحويل • لا تظهر لأي مستخدم
                  </p>
                </div>
                <button
                  onClick={() => setShowAdminGenerator(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Code Generator Tool */}
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">
                      1. اختر الباقة المطلوبة:
                    </label>
                    <select
                      value={genPackage}
                      onChange={(e) => setGenPackage(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white font-bold text-xs outline-none"
                    >
                      <option value="smart59">باقة المعتمر الذكي (59 ج.م)</option>
                      <option value="family100">باقة العائلة والأقارب (100 ج.م)</option>
                      <option value="lifetime150">باقة مدى الحياة (150 ج.م)</option>
                      <option value="b2b400">باقة شركات 50 معتمر (400 ج.م)</option>
                      <option value="b2b900">باقة شركات 200 معتمر (900 ج.م)</option>
                      <option value="b2b1800">باقة شركات 500 حاج (1,800 ج.م)</option>
                      <option value="b2b3500">الباقة السنوية المفتوحة (3,500 ج.م)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">
                      2. اسم العميل أو هاتفه:
                    </label>
                    <input
                      type="text"
                      value={genClientName}
                      onChange={(e) => setGenClientName(e.target.value)}
                      placeholder="مثال: الحاج محمد الشريف"
                      className="w-full h-9 px-3 rounded-xl bg-slate-900 border border-slate-600 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateClientCode}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                    <span>توليد كود فريد ونسخ رسالة الواتساب للعميل</span>
                  </button>

                  {generatedCode && (
                    <span className="font-mono font-black text-sm px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 shadow-sm">
                      {generatedCode}
                    </span>
                  )}
                </div>
              </div>

              {/* Developer Testing Section (Quick Package Switcher for Ahmed Hammam only) */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">
                  تجربة وتغيير الباقة الحالية على جهازك كـ Admin:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {Object.entries(packageLabels).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        handleActivatePackage(key, info.name);
                        setShowAdminGenerator(false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold text-center truncate cursor-pointer"
                    >
                      {info.badge.split('•')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                <span>لفتح هذه اللوحة مجدداً: اكتب <strong>HAMMAM</strong> في خانة كود التفعيل.</span>
                <button
                  type="button"
                  onClick={() => setShowAdminGenerator(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Company & Hotel Settings Modal */}
        {userProfile.tourismCompany && (
          <CompanySettingsModal
            isOpen={companyModalOpen}
            onClose={() => setCompanyModalOpen(false)}
            company={userProfile.tourismCompany}
            makkahHotelData={
              userProfile.makkahHotel || {
                hotelName: userProfile.hotelName,
                hotelAddress: userProfile.hotelAddress,
                hotelRoom: userProfile.hotelRoom,
                hotelDistanceToHaram: userProfile.hotelDistanceToHaram,
                hotelPhone: userProfile.hotelPhone,
              }
            }
            madinahHotelData={userProfile.madinahHotel}
            onSave={handleSaveCompanyAndHotel}
            onShowToast={showToast}
            initialTab={companyModalTab}
          />
        )}

        {/* Emergency Medical Modal */}
        <EmergencyModal
          isOpen={emergencyModalOpen}
          onClose={() => setEmergencyModalOpen(false)}
          onConfirm={handleConfirmEmergency}
        />

        {/* QR Scanner Companion Modal */}
        <QrScannerModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          onAddCompanion={handleAddCompanionFromQr}
        />

        {/* Export Modal matching screenshot 4 */}
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onShowToast={showToast}
        />

        {/* Free Install App Modal (PWA & Mobile Install) */}
        <InstallAppModal
          isOpen={installModalOpen}
          onClose={() => setInstallModalOpen(false)}
          onShowToast={showToast}
        />

        {/* Documentation Dossier & Presentation Print Modal */}
        <DocumentationModal
          isOpen={docModalOpen}
          onClose={() => setDocModalOpen(false)}
          userProfile={userProfile}
          onShowToast={showToast}
        />

        {/* Pilgrim & Family Data Entry Modal (B2C & B2B) */}
        <PilgrimDataModal
          isOpen={pilgrimModalOpen}
          onClose={() => setPilgrimModalOpen(false)}
          userProfile={userProfile}
          onSave={(updated) => setUserProfile(updated)}
          onShowToast={showToast}
          initialMode={pilgrimModalMode}
        />
      </div>
    </div>
  );
}
