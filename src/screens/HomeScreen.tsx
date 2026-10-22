import React, { useState, useEffect } from 'react';
import { TabId, TourismCompany, UserProfile } from '../types';
import { USER_PROFILE } from '../data/mockData';

interface HomeScreenProps {
  onNavigateTab: (tab: TabId) => void;
  onShowToast: (msg: string) => void;
  company?: TourismCompany;
  userProfile?: UserProfile;
  onOpenCompanySettings?: (tab?: 'company' | 'makkah' | 'madinah' | 'hotel') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onShowToast,
  company,
  userProfile,
  onOpenCompanySettings,
}) => {
  const activeCompany = company || userProfile?.tourismCompany || USER_PROFILE.tourismCompany;
  const makkahHotel = userProfile?.makkahHotel || {
    hotelName: userProfile?.hotelName || 'فندق سويس أوتيل المقام - مكة المكرمة',
    hotelAddress: userProfile?.hotelAddress || 'وقف الملك عبدالعزيز - أبراج البيت',
    hotelRoom: userProfile?.hotelRoom || 'غرفة 1408 • الدور 14',
    hotelDistanceToHaram: userProfile?.hotelDistanceToHaram || '50 متراً من الحرم',
    hotelPhone: userProfile?.hotelPhone || '+966125717777',
  };
  const madinahHotel = userProfile?.madinahHotel || {
    hotelName: 'فندق دار التقوى - المدينة المنورة',
    hotelAddress: 'المنطقة المركزية الشمالية، أمام ساحة المسجد النبوي',
    hotelRoom: 'جناح 520 • الدور 5',
    hotelDistanceToHaram: 'خطوات من المسجد النبوي',
    hotelPhone: '+966148295555',
  };
  const [countdown, setCountdown] = useState({ hours: 1, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerTimes = [
    { name: 'الفجر', time: '04:52 ص', passed: true },
    { name: 'الشروق', time: '06:11 ص', passed: true },
    { name: 'الظهر', time: '12:21 م', passed: true },
    { name: 'العصر', time: '03:42 م', isNext: true },
    { name: 'المغرب', time: '06:28 م', passed: false },
    { name: 'العشاء', time: '07:58 م', passed: false },
  ];

  return (
    <div className="flex flex-col w-full px-gutter max-w-2xl mx-auto space-y-4 pb-28 pt-2">
      {/* Welcome & Pilgrim Badge */}
      <section className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-secondary font-semibold">أهلاً بك يا ضيف الرحمن</span>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">{USER_PROFILE.name}</h1>
          <span className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px] text-secondary">hotel</span>
            {USER_PROFILE.hotelName || USER_PROFILE.campLocation}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[14px]">flight_takeoff</span>
            رحلة الحج ١٤٤٦هـ
          </span>
          <span className="text-[10px] text-on-surface-variant mt-1">باقي 6 أيام على الإقلاع</span>
        </div>
      </section>

      {/* Next Prayer & Mecca Time Widget */}
      <section className="bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <svg
          className="absolute -left-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none fill-current"
          viewBox="0 0 100 100"
        >
          <polygon points="50,0 63,35 98,35 70,57 81,91 50,70 19,91 30,57 2,35 37,35"></polygon>
        </svg>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-[24px]">mosque</span>
              <div>
                <span className="text-xs text-primary-fixed block font-medium">الصلاة القادمة بالحرم المكي</span>
                <span className="text-lg font-bold text-on-primary">صلاة العصر (03:42 م)</span>
              </div>
            </div>
            <div className="text-left bg-surface-container-lowest/15 px-3 py-1.5 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-primary-fixed block">متبقي للأذان</span>
              <span className="text-base font-bold font-mono text-secondary-fixed">
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:
                {String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Prayer Time Strip */}
          <div className="grid grid-cols-6 gap-1 pt-2 border-t border-primary-fixed/20 text-center">
            {prayerTimes.map((p, idx) => (
              <div
                key={idx}
                className={`py-1.5 px-1 rounded-lg text-[10px] sm:text-xs transition-colors ${
                  p.isNext
                    ? 'bg-secondary-fixed text-on-secondary-fixed font-bold shadow-sm'
                    : p.passed
                    ? 'text-primary-fixed/60 font-medium'
                    : 'text-primary-fixed font-medium'
                }`}
              >
                <div className="truncate">{p.name}</div>
                <div className="text-[9px] mt-0.5 truncate">{p.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Feature Hub Grid (Direct Access to App Screens) */}
      <section className="flex flex-col space-y-2.5">
        <h2 className="text-base font-bold text-on-surface">خدمات رحلتك السريعة</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Preparation Bag */}
          <div
            onClick={() => onNavigateTab('al-istiadad-wa-al-haqiba')}
            className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-3 cursor-pointer hover:border-primary transition-all active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">backpack</span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                75% مكتمل
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">حقيبة الاستعداد</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                18 من أصل 24 مهمة تحضيرية منجزة
              </p>
            </div>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <span>عرض القائمة</span>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </span>
          </div>

          {/* Card 2: Companion Radar */}
          <div
            onClick={() => onNavigateTab('al-kharita-wa-al-radar')}
            className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-3 cursor-pointer hover:border-primary transition-all active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">radar</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                نشط الآن
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">رادار الرفاق والزحام</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                توجيه حي للزوجة (45م) والوالد
              </p>
            </div>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <span>فتح الرادار</span>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </span>
          </div>

          {/* Card 3: Camp & Food */}
          <div
            onClick={() => onNavigateTab('al-mukhayyam-wa-al-khadamat')}
            className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-3 cursor-pointer hover:border-primary transition-all active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">holiday_village</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                مخيم 42 منى
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">المخيم والخدمات</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                البوفيه المفتوح، الطبيب والترطيب
              </p>
            </div>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <span>تفاصيل المخيم</span>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </span>
          </div>

          {/* Card 4: Rituals Counter */}
          <div
            onClick={() => onNavigateTab('al-manasik-wa-al-idad')}
            className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-3 cursor-pointer hover:border-primary transition-all active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">counter_7</span>
              </div>
              <span className="text-[10px] font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full">
                7 أشواط
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">المناسك والعداد</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                عداد الطواف والسعي بالأدعية
              </p>
            </div>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <span>بدء الشوط</span>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </span>
          </div>
        </div>
      </section>

      {/* Spiritual Aya & Wisdom Quote */}
      <section className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 text-center space-y-2">
        <span className="text-xs font-bold text-secondary">من نفحات القرآن الكريم</span>
        <blockquote className="text-base sm:text-lg font-bold text-primary font-sans leading-relaxed">
          ﴿ وَأَذِّن فِي النَّاسِ بِالْحَجِّ يَأْتُوكَ رِجَالًا وَعَلَىٰ كُلِّ ضَامِرٍ يَأْتِينَ مِن كُلِّ فَجٍّ عَمِيقٍ ﴾
        </blockquote>
        <span className="text-[11px] text-on-surface-variant block">[سورة الحج: الآية 27]</span>
      </section>

      {/* Official Tourism Company Card */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                شركة السياحة وخدمات الحج المعتمدة
              </span>
              <h3 className="text-sm font-bold text-on-surface">
                {activeCompany?.name || USER_PROFILE.campaignName}
              </h3>
            </div>
          </div>
          {onOpenCompanySettings && (
            <button
              onClick={() => onOpenCompanySettings('company')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-secondary bg-secondary-fixed/40 hover:bg-secondary-fixed flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              <span>تعديل</span>
            </button>
          )}
        </div>

        {activeCompany?.licenseNumber && (
          <div className="text-[11px] text-primary font-medium bg-primary/5 px-2.5 py-1 rounded-lg">
            {activeCompany.licenseNumber}
          </div>
        )}

        <p className="text-xs text-on-surface-variant leading-relaxed">
          فريق المشرفين والدعم الميداني من قِبل {activeCompany?.name} يرافقكم على مدار الساعة.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              onShowToast(`جاري الاتصال بالخط الساخن لـ ${activeCompany?.name}...`);
              window.location.href = `tel:${activeCompany?.hotline || '920012345'}`;
            }}
            className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>الخط الساخن 24/7</span>
          </button>
          <button
            onClick={() => {
              onShowToast('جاري فتح محادثة الدعم المباشر لواتساب الشركة...');
              window.open(`https://wa.me/${activeCompany?.whatsapp?.replace(/[^0-9]/g, '') || '966501234567'}`, '_blank');
            }}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>محادثة واتساب</span>
          </button>
        </div>
      </section>

      {/* Hotels of Makkah & Madinah Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">hotel</span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-on-surface">
                فنادق التسكين المعتمدة (مكة والمدينة)
              </h3>
              <span className="text-[10px] text-on-surface-variant block">
                متابعة الغرفة والمسافة عن الحرمين الشريفين
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('al-mukhayyam-wa-al-khadamat')}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>التفاصيل</span>
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Makkah Hotel Card */}
          <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/25 flex flex-col justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-secondary bg-secondary/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">apartment</span>
                  مكة المكرمة
                </span>
                {onOpenCompanySettings && (
                  <button
                    onClick={() => onOpenCompanySettings('makkah')}
                    className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                  >
                    تعديل ✏️
                  </button>
                )}
              </div>
              <h4 className="font-bold text-on-surface text-xs truncate">
                {makkahHotel.hotelName}
              </h4>
              <p className="text-[11px] text-on-surface-variant truncate">
                {makkahHotel.hotelRoom} • {makkahHotel.hotelDistanceToHaram}
              </p>
            </div>
            <button
              onClick={() => {
                onShowToast(`جاري الاتصال باستقبال فندق مكة (${makkahHotel.hotelPhone})...`);
                window.location.href = `tel:${makkahHotel.hotelPhone}`;
              }}
              className="py-1.5 px-2 rounded-lg bg-surface text-secondary hover:bg-secondary/15 text-[11px] font-bold border border-secondary/30 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>اتصال بالاستقبال</span>
            </button>
          </div>

          {/* Madinah Hotel Card */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-600/25 flex flex-col justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-700/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">mosque</span>
                  المدينة المنورة
                </span>
                {onOpenCompanySettings && (
                  <button
                    onClick={() => onOpenCompanySettings('madinah')}
                    className="text-[10px] font-bold text-emerald-800 hover:underline cursor-pointer"
                  >
                    تعديل ✏️
                  </button>
                )}
              </div>
              <h4 className="font-bold text-on-surface text-xs truncate">
                {madinahHotel.hotelName}
              </h4>
              <p className="text-[11px] text-on-surface-variant truncate">
                {madinahHotel.hotelRoom} • {madinahHotel.hotelDistanceToHaram}
              </p>
            </div>
            <button
              onClick={() => {
                onShowToast(`جاري الاتصال باستقبال فندق المدينة (${madinahHotel.hotelPhone})...`);
                window.location.href = `tel:${madinahHotel.hotelPhone}`;
              }}
              className="py-1.5 px-2 rounded-lg bg-surface text-emerald-800 hover:bg-emerald-50 text-[11px] font-bold border border-emerald-600/30 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>اتصال بالاستقبال</span>
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Quick Shortcut Card */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 border border-error/20 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">medical_services</span>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-on-surface">أرقام الطوارئ الميدانية</h4>
            <span className="text-xs text-on-surface-variant">طبيب الحملة، الهلال الأحمر (997)، الدفاع المدني (998)</span>
          </div>
        </div>
        <button
          onClick={() => onShowToast('أرقام الطوارئ: الإسعاف 997 • الأمن العام 911 • طبيب المخيم متوفر في شاشة المخيم.')}
          className="px-3 py-1.5 rounded-xl bg-surface-container text-primary text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          عرض
        </button>
      </section>
    </div>
  );
};
