import React, { useState } from 'react';
import { MEALS_DATA, SUPERVISORS } from '../data/mockData';
import { CampSupervisor, UserProfile } from '../types';

interface CampScreenProps {
  onShowToast: (msg: string) => void;
  onOpenEmergencyModal: () => void;
  userProfile?: UserProfile;
  onOpenCompanySettings?: (tab?: 'company' | 'makkah' | 'madinah' | 'hotel') => void;
}

export const CampScreen: React.FC<CampScreenProps> = ({
  onShowToast,
  onOpenEmergencyModal,
  userProfile,
  onOpenCompanySettings,
}) => {
  const [selectedAccommodationTab, setSelectedAccommodationTab] = useState<'camp' | 'makkah' | 'madinah'>('camp');
  const [selectedDayKey, setSelectedDayKey] = useState<string>('arafah');
  const [currentWater, setCurrentWater] = useState<number>(2.2);
  const maxWater = 3.5;
  const [dietaryPref, setDietaryPref] = useState<string>('خالي من الجلوتين');
  const [showDietModal, setShowDietModal] = useState<boolean>(false);
  const [activeSupervisorChat, setActiveSupervisorChat] = useState<CampSupervisor | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');

  const makkahHotel = userProfile?.makkahHotel || {
    hotelName: userProfile?.hotelName || 'فندق سويس أوتيل المقام - مكة المكرمة',
    hotelAddress: userProfile?.hotelAddress || 'وقف الملك عبدالعزيز - أبراج البيت، ساحة الحرم، شارع أجياد',
    hotelRoom: userProfile?.hotelRoom || 'غرفة 1408 • الدور 14',
    hotelDistanceToHaram: userProfile?.hotelDistanceToHaram || '50 متراً (مباشر على صحن الحرم المكي)',
    hotelPhone: userProfile?.hotelPhone || '+966125717777',
  };

  const madinahHotel = userProfile?.madinahHotel || {
    hotelName: 'فندق دار التقوى - المدينة المنورة',
    hotelAddress: 'المنطقة المركزية الشمالية، أمام ساحات المسجد النبوي وباب النساء',
    hotelRoom: 'جناح 520 • الدور 5',
    hotelDistanceToHaram: 'خطوات معدودة (أمام ساحات المسجد النبوي وباب السلام)',
    hotelPhone: '+966148295555',
  };

  const currentMeal = MEALS_DATA[selectedDayKey] || MEALS_DATA.arafah;

  const handleAddWater = () => {
    if (currentWater < maxWater) {
      const next = Math.min(maxWater, parseFloat((currentWater + 0.25).toFixed(2)));
      setCurrentWater(next);
      if (next >= maxWater) {
        onShowToast('ما شاء الله! حققت هدف الترطيب اليومي (3.5 لتر) للوقاية من ضربات الشمس.');
      } else {
        onShowToast(`تم تسجيل كوب ماء (250 مل). الإجمالي الآن: ${next.toFixed(1)} لتر`);
      }
    } else {
      onShowToast('تم تحقيق الهدف اليومي بنجاح. استمر في شرب السوائل بانتظام!');
    }
  };

  const handleRequestPackedMeal = () => {
    onShowToast('تم تسجيل طلبك لوجبة مغلفة مسبقاً! ستكون جاهزة للاستلام من البوفيه في جناح (ج).');
  };

  const handleCallSupervisor = (sup: CampSupervisor) => {
    onShowToast(`جاري الاتصال بـ ${sup.name} (${sup.role})...`);
    window.location.href = `tel:${sup.phone}`;
  };

  const handleServiceClick = (serviceName: string) => {
    onShowToast(`تم إرسال طلب "${serviceName}". سيتواصل معك فريق الدعم خلال دقائق.`);
  };

  const waterPercent = Math.min(100, Math.round((currentWater / maxWater) * 100));

  return (
    <div className="flex flex-col w-full px-gutter max-w-2xl mx-auto space-y-4 pb-28 pt-2">
      {/* Accommodation Location Segmented Switcher (Camp vs Makkah Hotel vs Madinah Hotel) */}
      <div className="bg-surface-container p-1 rounded-2xl flex items-center gap-1 shadow-sm border border-outline-variant/20 text-xs sm:text-sm">
        <button
          onClick={() => setSelectedAccommodationTab('camp')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
            selectedAccommodationTab === 'camp'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">holiday_village</span>
          <span className="truncate">مخيم منى وعرفات</span>
        </button>

        <button
          onClick={() => setSelectedAccommodationTab('makkah')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
            selectedAccommodationTab === 'makkah'
              ? 'bg-secondary text-on-secondary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-secondary font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">apartment</span>
          <span className="truncate">فندق مكة</span>
        </button>

        <button
          onClick={() => setSelectedAccommodationTab('madinah')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
            selectedAccommodationTab === 'madinah'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-emerald-700 font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">mosque</span>
          <span className="truncate">فندق المدينة</span>
        </button>
      </div>

      {/* VIEW A: MAKKAH HOTEL VIEW */}
      {selectedAccommodationTab === 'makkah' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Makkah Hotel Identity Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary p-5 sm:p-6 shadow-md border border-primary/30">
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-secondary-fixed font-bold bg-secondary-fixed/20 px-2.5 py-0.5 rounded-full">
                      فندق مكة المكرمة
                    </span>
                    <span className="text-xs text-primary-fixed">مباشر على الحرم المكي</span>
                    {onOpenCompanySettings && (
                      <button
                        onClick={() => onOpenCompanySettings('makkah')}
                        className="px-2 py-0.5 rounded-md bg-surface-container-lowest/25 hover:bg-surface-container-lowest/40 text-on-primary text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">edit</span>
                        <span>تعديل فندق مكة</span>
                      </button>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-on-primary mt-1">
                    {makkahHotel.hotelName}
                  </h1>
                  <p className="text-xs sm:text-sm text-surface-container-high flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary-fixed">location_on</span>
                    {makkahHotel.hotelAddress}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-surface-container-lowest/15 backdrop-blur-md shrink-0">
                  <span className="material-symbols-outlined text-secondary-fixed text-[30px]">
                    apartment
                  </span>
                </div>
              </div>

              {/* Room details & Floor */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary-fixed/20 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-lowest/10 backdrop-blur-md flex flex-col">
                  <span className="text-primary-fixed text-[11px]">رقم الغرفة والجناح:</span>
                  <span className="text-sm font-bold text-on-primary">
                    {makkahHotel.hotelRoom}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-lowest/10 backdrop-blur-md flex flex-col">
                  <span className="text-primary-fixed text-[11px]">المسافة لصحن الحرم:</span>
                  <span className="text-sm font-bold text-secondary-fixed">
                    {makkahHotel.hotelDistanceToHaram}
                  </span>
                </div>
              </div>

              {/* Makkah Hotel Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onShowToast(`جاري فتح موقع ${makkahHotel.hotelName} في خرائط جوجل...`);
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(makkahHotel.hotelName + ' مكة المكرمة')}`, '_blank');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span>الموقع على الخريطة بمكة</span>
                </button>
                <button
                  onClick={() => {
                    onShowToast(`جاري الاتصال باستقبال فندق مكة (${makkahHotel.hotelPhone})...`);
                    window.location.href = `tel:${makkahHotel.hotelPhone}`;
                  }}
                  className="py-2.5 px-3 rounded-xl bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 border border-primary-fixed/30 cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>اتصال بالاستقبال 24/7</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hotel Services Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">بوفيه المطعم الفندقي بمكة</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">restaurant</span>
              </div>
              <span className="text-on-surface-variant">الإفطار: 06:00 ص - 10:30 ص</span>
              <span className="text-[11px] text-primary font-semibold">الدور (P3) - بوفيه مفتوح</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">خدمة النظافة والغرف</span>
                <span className="material-symbols-outlined text-primary text-[20px]">cleaning_services</span>
              </div>
              <span className="text-on-surface-variant">متاحة على مدار 24 ساعة</span>
              <button
                onClick={() => onShowToast(`تم إرسال طلب تجهيز وترتيب الغرفة في ${makkahHotel.hotelName}.`)}
                className="text-[11px] text-secondary font-bold hover:underline text-right"
              >
                طلب ترتيب الغرفة ➔
              </button>
            </div>
          </div>

          {/* Quick Walk Shortcut to Kaaba */}
          <div className="p-3.5 rounded-2xl bg-secondary-container/20 border border-secondary/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[20px]">directions_walk</span>
              </div>
              <div>
                <span className="font-bold text-on-surface block">الوصول لصحن الكعبة المشرفة</span>
                <span className="text-on-surface-variant text-[11px]">مباشرة عبر بوابات وقف الملك عبدالعزيز (باب الملك عبدالعزيز وباب الملك فهد)</span>
              </div>
            </div>
            <span className="text-secondary font-bold bg-surface-container-lowest px-2 py-1 rounded-lg shadow-sm shrink-0">
              دقيقة واحدة
            </span>
          </div>
        </div>
      )}

      {/* VIEW B: MADINAH HOTEL VIEW */}
      {selectedAccommodationTab === 'madinah' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Madinah Hotel Identity Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-5 sm:p-6 shadow-md border border-emerald-600/30">
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-amber-200 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                      فندق المدينة المنورة
                    </span>
                    <span className="text-xs text-emerald-100">أمام المسجد النبوي الشريف</span>
                    {onOpenCompanySettings && (
                      <button
                        onClick={() => onOpenCompanySettings('madinah')}
                        className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">edit</span>
                        <span>تعديل فندق المدينة</span>
                      </button>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {madinahHotel.hotelName}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">location_on</span>
                    {madinahHotel.hotelAddress}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md shrink-0">
                  <span className="material-symbols-outlined text-amber-300 text-[30px]">
                    mosque
                  </span>
                </div>
              </div>

              {/* Room details & Floor */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/30 text-xs">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md flex flex-col">
                  <span className="text-emerald-100 text-[11px]">رقم الغرفة والجناح بالمدينة:</span>
                  <span className="text-sm font-bold text-white">
                    {madinahHotel.hotelRoom}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md flex flex-col">
                  <span className="text-emerald-100 text-[11px]">المسافة للمسجد النبوي:</span>
                  <span className="text-sm font-bold text-amber-300">
                    {madinahHotel.hotelDistanceToHaram}
                  </span>
                </div>
              </div>

              {/* Madinah Hotel Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onShowToast(`جاري فتح موقع ${madinahHotel.hotelName} بالمدينة المنورة في خرائط جوجل...`);
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(madinahHotel.hotelName + ' المدينة المنورة')}`, '_blank');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-amber-400 text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span>الموقع على الخريطة بالمدينة</span>
                </button>
                <button
                  onClick={() => {
                    onShowToast(`جاري الاتصال باستقبال فندق المدينة (${madinahHotel.hotelPhone})...`);
                    window.location.href = `tel:${madinahHotel.hotelPhone}`;
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-400/30 cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>اتصال بالاستقبال 24/7</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hotel Services Grid in Madinah */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">بوفيه الإفطار بالمدينة</span>
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">restaurant</span>
              </div>
              <span className="text-on-surface-variant">الإفطار: 06:00 ص - 10:30 ص</span>
              <span className="text-[11px] text-emerald-700 font-semibold">بوفيه مفتوح - صالة النخيل</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">خدمة الغرف والإشراف</span>
                <span className="material-symbols-outlined text-primary text-[20px]">cleaning_services</span>
              </div>
              <span className="text-on-surface-variant">متاحة على مدار 24 ساعة</span>
              <button
                onClick={() => onShowToast(`تم إرسال طلب تجهيز الغرفة في ${madinahHotel.hotelName}.`)}
                className="text-[11px] text-emerald-700 font-bold hover:underline text-right"
              >
                طلب تنظيف الغرفة ➔
              </button>
            </div>
          </div>

          {/* Quick Walk to Prophet Mosque and Rawdah */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-600/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">directions_walk</span>
              </div>
              <div>
                <span className="font-bold text-on-surface block">الوصول لساحة المسجد النبوي والروضة الشريفة</span>
                <span className="text-on-surface-variant text-[11px]">أمام باب السلام، وباب الملك فهد، وباب النساء (الجهة الشمالية)</span>
              </div>
            </div>
            <span className="text-emerald-800 font-bold bg-white px-2 py-1 rounded-lg shadow-sm shrink-0">
              خطوات معدودة
            </span>
          </div>
        </div>
      )}

      {/* VIEW B: CAMP ACCOMMODATION VIEW */}
      {selectedAccommodationTab === 'camp' && (
        <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Camp Identity & Live Status Card */}
      <div className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-5 sm:p-6 shadow-md border border-primary/30">
        {/* Decorative Islamic Geometric Watermark */}
        <div className="absolute -left-10 -bottom-10 w-44 h-44 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-white fill-current" viewBox="0 0 100 100">
            <polygon points="50 0, 62 38, 100 50, 62 62, 50 100, 38 62, 0 50, 38 38"></polygon>
            <circle cx="50" cy="50" fill="none" r="28" stroke="currentColor" strokeWidth="2"></circle>
            <polygon fill="none" points="50 15, 75 50, 50 85, 25 50" stroke="currentColor" strokeWidth="1.5"></polygon>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-on-primary-container font-semibold tracking-wider">
                  مقر السكن والضيافة بمشعر منى
                </span>
                {onOpenCompanySettings && (
                  <button
                    onClick={() => onOpenCompanySettings('company')}
                    className="px-2 py-0.5 rounded-md bg-surface-container-lowest/25 hover:bg-surface-container-lowest/40 text-on-primary text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px]">edit</span>
                    <span>تعديل الحملة / الشركة</span>
                  </button>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-on-primary">
                {userProfile?.tourismCompany?.name || userProfile?.campaignName || 'حملة وفادة لضيوف الرحمن'}
              </h1>
              <p className="text-xs sm:text-sm text-surface-container-high font-medium">
                {userProfile?.campLocation || 'مخيم 42 منى • جناح (ج) سرير 18'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md shrink-0">
              <span className="material-symbols-outlined text-secondary-fixed text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                holiday_village
              </span>
            </div>
          </div>

          {/* Operational live status bar */}
          <div className="flex items-center gap-2 bg-surface-container-lowest/15 backdrop-blur-md px-3 py-2 rounded-xl text-xs">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary-fixed"></span>
            </span>
            <span className="text-on-primary truncate font-medium">
              البوفيه المركزي مفتوح • العيادة الميدانية متاحة 24/7
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Red Emergency SOS Button */}
      <button
        onClick={onOpenEmergencyModal}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-error text-on-error shadow-lg active:scale-[0.98] transition-all cursor-pointer hover:bg-error/95"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-on-error/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm sm:text-base font-bold">نداء طبيب المخيم / إسعاف طارئ</span>
            <span className="text-xs text-error-container">تحديد فوري لموقع سريرك (جناح ج - سرير 18)</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[24px]">arrow_back_ios</span>
      </button>

      {/* 2. Field Health & Weather Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              health_and_safety
            </span>
            <h2 className="text-base font-bold text-on-surface">الصحة الميدانية والطقس</h2>
          </div>
          <span className="text-xs text-secondary font-semibold bg-secondary-container/40 px-2.5 py-0.5 rounded-full">
            مباشر
          </span>
        </div>

        {/* Weather & Hydration Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
          {/* Temperature & Heat Stress */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  thermostat
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant font-medium">حرارة المشاعر</span>
                <span className="text-sm sm:text-base font-bold text-on-surface">41° مئوية</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container/30">
              <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container shrink-0">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant font-medium">الإجهاد الحراري</span>
                <span className="text-sm sm:text-base font-bold text-on-error-container">مستوى مرتفع</span>
              </div>
            </div>
          </div>

          {/* Hydration Tracker */}
          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  water_drop
                </span>
                <span className="font-bold text-on-surface">سجل ترطيب الحاج</span>
              </div>
              <span className="text-on-surface-variant font-medium">
                {currentWater.toFixed(1)} لتر من أصل {maxWater} لتر
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary-container h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${waterPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-on-surface-variant">الترطيب المستمر يقي من ضربات الشمس</span>
              <button
                onClick={handleAddWater}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-on-primary font-semibold active:scale-95 transition-transform shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>أضف كوب (250 مل)</span>
              </button>
            </div>
          </div>

          {/* Quick Checkup Shortcut */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">local_hospital</span>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">فحص السكر والضغط المجاني</span>
                <span className="text-on-surface-variant">الخيمة الطبية المركزية (على بعد 60 متراً)</span>
              </div>
            </div>
            <button
              onClick={() => onShowToast('تم عرض مسار الخيمة الطبية: توجه إلى الممر (أ) مباشرةً')}
              className="px-3 py-1.5 rounded-xl bg-surface-container-lowest text-primary font-bold shadow-sm cursor-pointer border border-outline-variant/20 hover:bg-surface-container"
            >
              المسار
            </button>
          </div>
        </div>
      </div>

      {/* 3. Catering & Daily Meals Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant_menu
            </span>
            <h2 className="text-base font-bold text-on-surface">الإعاشة والوجبات اليومية</h2>
          </div>
          <span className="text-xs text-primary font-semibold">بوفيه مفتوح ومغلف</span>
        </div>

        {/* Sacred Days Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { key: 'tarwiyah', label: 'يوم التروية (8)' },
            { key: 'arafah', label: 'يوم عرفة (9 ذو الحجة)' },
            { key: 'nahr', label: 'يوم النحر (10)' },
            { key: 'tashreeq', label: 'أيام التشريق (11-13)' },
          ].map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDayKey(d.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDayKey === d.key
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Featured Meal Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-xs text-secondary font-bold uppercase tracking-wider">
                  {currentMeal.mealType}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">{currentMeal.title}</h3>
              <span className="text-xs text-on-surface-variant">
                التقديم يبدأ: {currentMeal.timeRange}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary-container/40 text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
            </div>
          </div>

          {/* Rich Meal Photo with Gradient Scrim */}
          <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-inner">
            <img
              className="w-full h-full object-cover"
              alt={currentMeal.imageAlt}
              src={currentMeal.imageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-xs text-white font-medium">مطبخ وفادة المعتمد • رقابة صحية مستمرة</span>
            </div>
          </div>

          {/* Menu tags */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-low text-xs">
            <span className="text-on-surface-variant font-bold">قائمة طعام اليوم:</span>
            <div className="flex flex-wrap gap-1.5">
              {currentMeal.menuTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-medium shadow-sm border border-outline-variant/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Pilgrim Preferences */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">no_meals</span>
              <span className="text-on-surface-variant">
                الحمية المسجلة: <strong className="text-on-surface">{dietaryPref}</strong>
              </span>
            </div>
            <button
              onClick={() => setShowDietModal(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              تعديل الحمية
            </button>
          </div>

          <button
            onClick={handleRequestPackedMeal}
            className="w-full py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[20px]">takeout_dining</span>
            <span>طلب وجبة مغلفة مسبقاً (للتفويج الخارجي)</span>
          </button>
        </div>

        {/* Meal schedules and Saudi Hospitality */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface">الفطور الصباحي</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">free_breakfast</span>
            </div>
            <span className="text-on-surface-variant">06:00 ص - 09:30 ص</span>
            <span className="text-secondary font-medium">اكتمل اليوم</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface">العشاء الخفيف</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">dinner_dining</span>
            </div>
            <span className="text-on-surface-variant">08:30 م - 11:00 م</span>
            <span className="text-primary font-medium">مخبوزات وشوربات</span>
          </div>
        </div>

        {/* 24h Hospitality Coffee Corner */}
        <div className="p-3.5 rounded-2xl bg-secondary-container/20 border border-secondary/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                coffee
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface">ركن القهوة والضيافة السعودية</span>
              <span className="text-on-surface-variant">شاي، قهوة، تمور فاخرة، مياه مثلجة</span>
            </div>
          </div>
          <span className="text-secondary font-bold px-2 py-1 rounded-lg bg-surface-container-lowest shadow-sm">
            24 ساعة
          </span>
        </div>
      </div>

      {/* 4. Housing & Tent Services */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              room_service
            </span>
            <h2 className="text-base font-bold text-on-surface">خدمات الخيام والإسكان</h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">مساعدة فورية</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Safe locker */}
          <button
            onClick={() => handleServiceClick('الوصول إلى أمانات الوثائق والخزينة #420')}
            className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col items-start gap-2 text-right active:scale-98 transition-transform group cursor-pointer hover:border-primary/40"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary flex items-center justify-center text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface">أمانات الوثائق</span>
              <span className="text-on-surface-variant">رقم الخزينة: #420</span>
            </div>
          </button>

          {/* AC Maintenance */}
          <button
            onClick={() => handleServiceClick('طلب صيانة التكييف للجناح ج')}
            className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col items-start gap-2 text-right active:scale-98 transition-transform group cursor-pointer hover:border-primary/40"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary flex items-center justify-center text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">ac_unit</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface">صيانة التكييف</span>
              <span className="text-on-surface-variant">استجابة خلال 10 دقائق</span>
            </div>
          </button>

          {/* Laundry & Bedding */}
          <button
            onClick={() => handleServiceClick('طلب تبديل الفرش وملاءات السرير')}
            className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col items-start gap-2 text-right active:scale-98 transition-transform group cursor-pointer hover:border-primary/40"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary flex items-center justify-center text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">dry_cleaning</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface">تبديل الفرش والمغسلة</span>
              <span className="text-on-surface-variant">طلب ملاءات معقمة</span>
            </div>
          </button>

          {/* Lost and Found */}
          <button
            onClick={() => handleServiceClick('فتح بلاغ المفقودات والمعثورات')}
            className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col items-start gap-2 text-right active:scale-98 transition-transform group cursor-pointer hover:border-primary/40"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary flex items-center justify-center text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">find_in_page</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface">المفقودات والمعثورات</span>
              <span className="text-on-surface-variant">بلاغ أو استلام غرض</span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Field Supervisors Direct Contact */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              support_agent
            </span>
            <h2 className="text-base font-bold text-on-surface">مشرفو المخيم الميداني</h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">اتصال مباشر</span>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
          {SUPERVISORS.map((sup, index) => (
            <React.Fragment key={sup.id}>
              {index > 0 && <div className="h-px bg-surface-container-high w-full"></div>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${sup.colorBg}`}
                  >
                    {sup.initial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-on-surface truncate">{sup.name}</span>
                    <span className="text-xs text-on-surface-variant truncate">{sup.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCallSupervisor(sup)}
                    aria-label={`اتصال بـ ${sup.name}`}
                    title="اتصال هاتفي مباشر"
                    className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </button>
                  <button
                    onClick={() => setActiveSupervisorChat(sup)}
                    aria-label={`مراسلة ${sup.name}`}
                    title="مراسلة فورية"
                    className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      </div>
      )}

      {/* Diet Modification Modal */}
      {showDietModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-5 shadow-2xl border border-outline-variant/30 text-right">
            <h3 className="text-base font-bold text-primary mb-2">تعديل التفضيلات الغذائية</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              حدد نوع وجباتك الخاصة ليتم توفيرها لك في بوفيه مخيم منى وعرفات:
            </p>
            <div className="space-y-2 mb-4 text-xs">
              {[
                'خالي من الجلوتين',
                'حمية مرضى السكري (قليلة السكر والنشويات)',
                'حمية ضغط الدم (قليلة الصوديوم)',
                'نباتي كامل',
                'وجبات معتادة دون قيود',
              ].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                    dietaryPref === opt
                      ? 'border-primary bg-primary/5 text-primary font-bold'
                      : 'border-outline-variant/20 hover:bg-surface-container-low text-on-surface'
                  }`}
                  onClick={() => setDietaryPref(opt)}
                >
                  <span>{opt}</span>
                  <input
                    type="radio"
                    name="dietOpt"
                    checked={dietaryPref === opt}
                    onChange={() => setDietaryPref(opt)}
                    className="accent-primary"
                  />
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDietModal(false);
                  onShowToast(`تم تحديث حميتك إلى: ${dietaryPref}`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container"
              >
                حفظ التعديل
              </button>
              <button
                onClick={() => setShowDietModal(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supervisor Chat Modal */}
      {activeSupervisorChat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-5 shadow-2xl border border-outline-variant/30 text-right flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <div>
                <h3 className="text-sm font-bold text-primary">{activeSupervisorChat.name}</h3>
                <span className="text-xs text-on-surface-variant">{activeSupervisorChat.role}</span>
              </div>
              <button
                onClick={() => setActiveSupervisorChat(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 text-xs py-2">
              <div className="p-3 rounded-xl bg-surface-container-low max-w-[85%]">
                <p className="text-on-surface">
                  مرحباً بك يا حاج أحمد، كيف يمكنني مساعدتك في مخيم 42 منى؟
                </p>
                <span className="text-[10px] text-on-surface-variant block mt-1">الآن</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="اكتب رسالتك للمشرف..."
                className="flex-1 h-10 px-3 rounded-xl bg-surface-container-low text-xs outline-none border border-outline-variant/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    onShowToast(`تم إرسال رسالتك إلى ${activeSupervisorChat.name}`);
                    setChatMessage('');
                    setActiveSupervisorChat(null);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (chatMessage.trim()) {
                    onShowToast(`تم إرسال رسالتك إلى ${activeSupervisorChat.name}`);
                    setChatMessage('');
                    setActiveSupervisorChat(null);
                  }
                }}
                className="px-3.5 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold shrink-0 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
