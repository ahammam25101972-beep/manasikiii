import React, { useState } from 'react';
import { USER_PROFILE } from '../data/mockData';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  deviceFrame: boolean;
  setDeviceFrame: (val: boolean) => void;
  onOpenExport?: () => void;
  onOpenInstallModal?: () => void;
  onOpenDocumentation?: () => void;
  userProfile?: UserProfile;
  onOpenCompanySettings?: (tab?: 'company' | 'makkah' | 'madinah' | 'hotel') => void;
  onUpdateUserProfile?: (profile: UserProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  deviceFrame,
  setDeviceFrame,
  onOpenExport,
  onOpenInstallModal,
  onOpenDocumentation,
  userProfile,
  onOpenCompanySettings,
  onUpdateUserProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile>(userProfile || USER_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const currentProfile = userProfile || localProfile;
  const updateProfile = (updated: UserProfile) => {
    setLocalProfile(updated);
    if (onUpdateUserProfile) {
      onUpdateUserProfile(updated);
    }
  };

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe border-b border-outline-variant/20">
        <div className="h-20 px-gutter max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & Location Lockup */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-primary">مَنَاسِكِي</span>
                <span className="text-outline-variant font-light text-sm">|</span>
                <span className="text-xs text-on-surface-variant font-semibold tracking-wide">Manasiki</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full w-fit max-w-[210px] mt-0.5">
                <span className="material-symbols-outlined text-secondary text-[14px]">near_me</span>
                <span className="text-[11px] text-secondary truncate font-medium">مكة المكرمة - الحرم المكي</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Company Edit, Screen Mode, Install Free App, Export, Notifications, Profile) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Quick Tourism Company Badge & Edit Shortcut */}
            {onOpenCompanySettings && (
              <button
                onClick={() => onOpenCompanySettings('company')}
                title="تعديل بيانات شركة السياحة والحملة"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-xs font-bold transition-all border border-outline-variant/20 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px] text-secondary">business</span>
                <span className="hidden lg:inline max-w-[130px] truncate">
                  {currentProfile.tourismCompany?.name || currentProfile.campaignName}
                </span>
                <span className="text-[10px] bg-secondary-fixed/50 text-on-secondary-fixed px-1.5 py-0.5 rounded font-bold">
                  تعديل الشركة
                </span>
              </button>
            )}

            {/* Free App Install trigger */}
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                title="تثبيت التطبيق على الجوال مجاناً"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold hover:bg-secondary-fixed-dim transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                <span className="hidden sm:inline">تثبيت التطبيق مجاناً</span>
                <span className="sm:hidden">تثبيت</span>
              </button>
            )}

            {/* Documentation & Presentation Dossier (Printable PDF) */}
            {onOpenDocumentation && (
              <button
                onClick={onOpenDocumentation}
                title="عرض وطباعة ملف توثيق التطبيق لشركات السياحة والحجاج"
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px] text-secondary-fixed">description</span>
                <span className="hidden sm:inline">كتيب العرض والطباعة (PDF)</span>
                <span className="sm:hidden">الكتيب</span>
              </button>
            )}

            {/* Viewport switch: Mobile frame toggle */}
            <button
              onClick={() => setDeviceFrame(!deviceFrame)}
              title={deviceFrame ? 'تبديل للعرض الموسع' : 'تبديل لعرض شاشة الهاتف'}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {deviceFrame ? 'fullscreen' : 'smartphone'}
              </span>
              <span>{deviceFrame ? 'عرض كامل' : 'إطار هاتف'}</span>
            </button>

            {/* Export Screen Canvas button matching image 19 */}
            {onOpenExport && (
              <button
                onClick={onOpenExport}
                title="تصدير ومشاركة الشاشات"
                className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">ios_share</span>
              </button>
            )}

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="التنبيهات"
                className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
                    <span className="font-bold text-sm text-primary">تنبيهات الحملة والمشاعر</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-on-surface-variant hover:text-primary"
                    >
                      إغلاق
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-secondary-fixed/30 border border-secondary/20">
                      <div className="font-bold text-on-secondary-fixed flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">campaign</span>
                        توجيه طوارئ الزحام
                      </div>
                      <p className="text-on-secondary-fixed mt-1 leading-relaxed">
                        تأجيل مسار الجمرات حتى الساعة 04:00 عصراً لتفادي الإجهاد الحراري.
                      </p>
                      <span className="text-[10px] text-secondary mt-1 block">منذ 25 دقيقة</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-container-low">
                      <div className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">water_drop</span>
                        تذكير الترطيب الميداني
                      </div>
                      <p className="text-on-surface-variant mt-1">
                        درجة الحرارة الآن 41°م. احرص على تناول كوب ماء إضافي.
                      </p>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">منذ ساعة</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-container-low">
                      <div className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">flight_takeoff</span>
                        تحديث رحلة الطيران
                      </div>
                      <p className="text-on-surface-variant mt-1">
                        رحلة SV-1034 مجدولة في موعدها. تم تثبيت الحجز بالكامل.
                      </p>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">أمس</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="relative p-0.5 rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all focus:outline-none"
            >
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
                src={USER_PROFILE.avatar}
              />
            </button>
          </div>
        </div>
      </header>

      {/* User Profile Micro Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/30 text-right">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={currentProfile.avatar}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary"
              />
              <div>
                <h3 className="font-bold text-lg text-primary">{currentProfile.name}</h3>
                <span className="text-xs text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  رقم الحاج: {currentProfile.badgeId}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs bg-surface-container-low p-3.5 rounded-xl mb-4">
              {/* Tourism Company info */}
              <div className="flex flex-col gap-1.5 pb-2.5 border-b border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">business</span>
                    شركة السياحة المعتمدة:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-on-surface truncate max-w-[150px]">
                      {currentProfile.tourismCompany?.name || currentProfile.campaignName}
                    </span>
                    {onOpenCompanySettings && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileModal(false);
                          onOpenCompanySettings('company');
                        }}
                        className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold hover:bg-secondary-fixed-dim cursor-pointer flex items-center gap-0.5 shadow-xs"
                        title="تعديل اسم الشركة وبياناتها"
                      >
                        <span className="material-symbols-outlined text-[12px]">edit</span>
                        <span>تعديل</span>
                      </button>
                    )}
                  </div>
                </div>

                {currentProfile.tourismCompany?.licenseNumber && (
                  <span className="text-[10px] text-secondary font-medium">
                    {currentProfile.tourismCompany.licenseNumber}
                  </span>
                )}

                {currentProfile.tourismCompany?.hotline && (
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] text-on-surface-variant">الخط الساخن: {currentProfile.tourismCompany.hotline}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          window.location.href = `tel:${currentProfile.tourismCompany?.hotline}`;
                        }}
                        className="px-2 py-0.5 rounded bg-primary text-on-primary text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">call</span>
                        اتصال
                      </button>
                      <button
                        onClick={() => {
                          window.open(`https://wa.me/${currentProfile.tourismCompany?.whatsapp?.replace(/[^0-9]/g, '')}`, '_blank');
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">chat</span>
                        واتساب
                      </button>
                    </div>
                  </div>
                )}

                {/* Direct Company edit shortcut button */}
                {onOpenCompanySettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(false);
                      onOpenCompanySettings('company');
                    }}
                    className="w-full mt-1 py-1.5 px-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-primary/20"
                  >
                    <span className="material-symbols-outlined text-[15px]">tune</span>
                    <span>تعديل اسم شركة السياحة أو اختيار نموذج جاهز ✏️</span>
                  </button>
                )}
              </div>

              {/* Hotel Accommodation info (Makkah & Madinah) */}
              {(currentProfile.accommodationType === 'hotel' || currentProfile.accommodationType === 'both') && (
                <div className="pt-2 border-t border-outline-variant/15 flex flex-col gap-2">
                  {/* Makkah Hotel Card */}
                  <div className="p-2.5 rounded-xl bg-surface-container/60 border border-secondary/20 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary font-bold flex items-center gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-[15px]">apartment</span>
                        فندق مكة المكرمة:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-on-surface truncate max-w-[140px] text-xs">
                          {currentProfile.makkahHotel?.hotelName || currentProfile.hotelName || 'فندق سويس أوتيل المقام'}
                        </span>
                        {onOpenCompanySettings && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowProfileModal(false);
                              onOpenCompanySettings('makkah');
                            }}
                            className="px-2 py-0.5 rounded-md bg-secondary/20 text-secondary text-[10px] font-bold hover:bg-secondary/30 cursor-pointer flex items-center gap-0.5"
                            title="تعديل فندق مكة"
                          >
                            <span className="material-symbols-outlined text-[12px]">edit</span>
                            <span>تعديل</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {(currentProfile.makkahHotel?.hotelAddress || currentProfile.hotelAddress) && (
                      <div className="flex items-start justify-between text-[10px] text-on-surface-variant">
                        <span>العنوان:</span>
                        <span className="font-medium text-left max-w-[190px] truncate">
                          {currentProfile.makkahHotel?.hotelAddress || currentProfile.hotelAddress}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] pt-0.5">
                      <span className="text-on-surface-variant">
                        الغرفة: <strong className="text-primary">{currentProfile.makkahHotel?.hotelRoom || currentProfile.hotelRoom || 'غرفة 1408 • الدور 14'}</strong>
                      </span>
                      <span className="text-secondary font-semibold">
                        {currentProfile.makkahHotel?.hotelDistanceToHaram || currentProfile.hotelDistanceToHaram || '50 متراً من الحرم'}
                      </span>
                    </div>
                  </div>

                  {/* Madinah Hotel Card */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-600/25 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-[15px]">mosque</span>
                        فندق المدينة المنورة:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-on-surface truncate max-w-[140px] text-xs">
                          {currentProfile.madinahHotel?.hotelName || 'فندق دار التقوى - المدينة'}
                        </span>
                        {onOpenCompanySettings && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowProfileModal(false);
                              onOpenCompanySettings('madinah');
                            }}
                            className="px-2 py-0.5 rounded-md bg-emerald-700/20 text-emerald-800 text-[10px] font-bold hover:bg-emerald-700/30 cursor-pointer flex items-center gap-0.5"
                            title="تعديل فندق المدينة"
                          >
                            <span className="material-symbols-outlined text-[12px]">edit</span>
                            <span>تعديل</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {currentProfile.madinahHotel?.hotelAddress && (
                      <div className="flex items-start justify-between text-[10px] text-on-surface-variant">
                        <span>العنوان:</span>
                        <span className="font-medium text-left max-w-[190px] truncate">
                          {currentProfile.madinahHotel.hotelAddress}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] pt-0.5">
                      <span className="text-on-surface-variant">
                        الغرفة: <strong className="text-primary">{currentProfile.madinahHotel?.hotelRoom || 'جناح 520 • الدور 5'}</strong>
                      </span>
                      <span className="text-emerald-700 font-semibold">
                        {currentProfile.madinahHotel?.hotelDistanceToHaram || 'خطوات من المسجد النبوي'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Camp location info */}
              {(currentProfile.accommodationType === 'camp' || currentProfile.accommodationType === 'both') && currentProfile.campLocation && (
                <div className="pt-2 border-t border-outline-variant/15 flex justify-between">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">holiday_village</span>
                    مخيم المشاعر:
                  </span>
                  <span className="font-semibold text-on-surface">{currentProfile.campLocation}</span>
                </div>
              )}

              <div className="flex justify-between pt-1 border-t border-outline-variant/15">
                <span className="text-on-surface-variant">رحلة القدوم:</span>
                <span className="font-semibold text-on-surface">{currentProfile.flightInfo}</span>
              </div>
            </div>

            {/* Quick Demo Import or Manual Edit Trigger */}
            <div className="flex flex-col gap-2 pt-1 border-t border-outline-variant/20">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="w-full py-2 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>{isEditingProfile ? 'إخفاء التعديل' : 'تعديل الفندق والسكن أو استيراد الحجز'}</span>
              </button>

              {isEditingProfile && (
                <div className="p-3 rounded-xl bg-surface-container-low space-y-2 text-xs border border-outline-variant/20 mt-1 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between pb-1 text-[11px] font-bold text-secondary">
                    <span>نماذج سريعة جاهزة:</span>
                    <button
                      onClick={() => {
                        updateProfile({
                          name: 'أحمد عبد الله',
                          badgeId: 'HK-1446-88219',
                          avatar: currentProfile.avatar,
                          campaignName: 'حملة وفادة لضيوف الرحمن',
                          accommodationType: 'both',
                          hotelName: 'فندق فيرمونت برج الساعة - مكة',
                          hotelAddress: 'مجمع أبراج البيت - وقف الملك عبدالعزيز، أجياد، مكة',
                          hotelRoom: 'جناح 2204 • الدور 22',
                          hotelDistanceToHaram: 'مباشر على صحن الحرم المكي الشريف',
                          hotelPhone: '+966125717777',
                          campLocation: 'مخيم 42 منى • جناح (ج) سرير 18',
                          flightInfo: 'رحلة SV-1034 - مطار الملك عبدالعزيز بجدة',
                        });
                        setIsEditingProfile(false);
                      }}
                      className="text-primary hover:underline font-bold cursor-pointer"
                    >
                      تجربة فندق برج الساعة
                    </button>
                  </div>

                  {/* Accommodation type selector */}
                  <div className="flex gap-1 bg-surface p-1 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => updateProfile({ ...currentProfile, accommodationType: 'hotel' })}
                      className={`flex-1 py-1 rounded cursor-pointer ${currentProfile.accommodationType === 'hotel' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                    >
                      فندق فقط
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProfile({ ...currentProfile, accommodationType: 'both' })}
                      className={`flex-1 py-1 rounded cursor-pointer ${currentProfile.accommodationType === 'both' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                    >
                      فندق + مخيم
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProfile({ ...currentProfile, accommodationType: 'camp' })}
                      className={`flex-1 py-1 rounded cursor-pointer ${currentProfile.accommodationType === 'camp' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                    >
                      مخيم فقط
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant block mb-0.5">اسم الحاج / المعتمر:</label>
                    <input
                      type="text"
                      value={currentProfile.name}
                      onChange={(e) => updateProfile({ ...currentProfile, name: e.target.value })}
                      placeholder="اسم الحاج"
                      className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none"
                    />
                  </div>

                  {/* Tourism Company inputs */}
                  <div className="p-2.5 rounded-xl bg-primary/10 border-2 border-primary/40 space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-primary/20">
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">edit_note</span>
                        تعديل شركة السياحة والحملة المعتمدة:
                      </span>
                      <span className="text-[10px] bg-primary text-on-primary font-bold px-2 py-0.5 rounded-md">
                        اكتب هنا للتعديل
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-on-surface block mb-0.5">
                        اسم شركة السياحة أو الحملة:
                      </label>
                      <input
                        type="text"
                        value={currentProfile.tourismCompany?.name || currentProfile.campaignName}
                        onChange={(e) =>
                          updateProfile({
                            ...currentProfile,
                            campaignName: e.target.value,
                            tourismCompany: {
                              ...(currentProfile.tourismCompany || {
                                licenseNumber: 'ترخيص معتمد',
                                hotline: '920012345',
                                whatsapp: '',
                                emergencyPhone: '',
                                branchCity: '',
                                supervisorName: '',
                              }),
                              name: e.target.value,
                            },
                          })
                        }
                        placeholder="اكتب اسم شركة السياحة هنا"
                        className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/30 text-on-surface font-bold text-xs outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-on-surface block mb-0.5">
                        رقم ترخيص وزارة الحج / السياحة:
                      </label>
                      <input
                        type="text"
                        value={currentProfile.tourismCompany?.licenseNumber || ''}
                        onChange={(e) =>
                          updateProfile({
                            ...currentProfile,
                            tourismCompany: {
                              ...(currentProfile.tourismCompany || {
                                name: currentProfile.campaignName,
                                hotline: '',
                                whatsapp: '',
                                emergencyPhone: '',
                                branchCity: '',
                                supervisorName: '',
                              }),
                              licenseNumber: e.target.value,
                            },
                          })
                        }
                        placeholder="مثال: ترخيص وزارة الحج: 1042 / سياحة: 7421"
                        className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/30 text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-[10px] font-bold text-on-surface block mb-0.5">
                          الخط الساخن:
                        </label>
                        <input
                          type="text"
                          value={currentProfile.tourismCompany?.hotline || ''}
                          onChange={(e) =>
                            updateProfile({
                              ...currentProfile,
                              tourismCompany: {
                                ...(currentProfile.tourismCompany || {
                                  name: currentProfile.campaignName,
                                  licenseNumber: '',
                                  whatsapp: '',
                                  emergencyPhone: '',
                                  branchCity: '',
                                  supervisorName: '',
                                }),
                                hotline: e.target.value,
                              },
                            })
                          }
                          placeholder="الخط الساخن للشركة"
                          className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/30 text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-on-surface block mb-0.5">
                          رقم الواتساب:
                        </label>
                        <input
                          type="text"
                          value={currentProfile.tourismCompany?.whatsapp || ''}
                          onChange={(e) =>
                            updateProfile({
                              ...currentProfile,
                              tourismCompany: {
                                ...(currentProfile.tourismCompany || {
                                  name: currentProfile.campaignName,
                                  licenseNumber: '',
                                  hotline: '',
                                  emergencyPhone: '',
                                  branchCity: '',
                                  supervisorName: '',
                                }),
                                whatsapp: e.target.value,
                              },
                            })
                          }
                          placeholder="رقم الواتساب الرسمي"
                          className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/30 text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    {onOpenCompanySettings && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileModal(false);
                          onOpenCompanySettings('company');
                        }}
                        className="w-full py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary-container transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                        <span>فتح نماذج الشركات الجاهزة والإعدادات المتقدمة</span>
                      </button>
                    )}
                  </div>

                  {/* Hotel inputs (Makkah & Madinah) */}
                  {(currentProfile.accommodationType === 'hotel' || currentProfile.accommodationType === 'both') && (
                    <div className="space-y-3">
                      {/* Makkah Hotel inputs */}
                      <div className="space-y-1.5 p-2.5 rounded-xl bg-secondary/10 border border-secondary/30">
                        <div className="flex items-center justify-between pb-1 border-b border-secondary/20">
                          <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">apartment</span>
                            فندق التسكين في مكة المكرمة:
                          </span>
                          {onOpenCompanySettings && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowProfileModal(false);
                                onOpenCompanySettings('makkah');
                              }}
                              className="text-[10px] text-secondary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[12px]">tune</span>
                              نماذج مكة الجاهزة
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={currentProfile.makkahHotel?.hotelName || currentProfile.hotelName || ''}
                          onChange={(e) =>
                            updateProfile({
                              ...currentProfile,
                              hotelName: e.target.value,
                              makkahHotel: {
                                ...(currentProfile.makkahHotel || {
                                  hotelName: '',
                                  hotelAddress: '',
                                  hotelRoom: '',
                                  hotelDistanceToHaram: '',
                                  hotelPhone: '',
                                }),
                                hotelName: e.target.value,
                              },
                            })
                          }
                          placeholder="اسم فندق مكة (مثال: فندق سويس أوتيل المقام)"
                          className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                        />
                        <input
                          type="text"
                          value={currentProfile.makkahHotel?.hotelAddress || currentProfile.hotelAddress || ''}
                          onChange={(e) =>
                            updateProfile({
                              ...currentProfile,
                              hotelAddress: e.target.value,
                              makkahHotel: {
                                ...(currentProfile.makkahHotel || {
                                  hotelName: currentProfile.hotelName || '',
                                  hotelAddress: '',
                                  hotelRoom: '',
                                  hotelDistanceToHaram: '',
                                  hotelPhone: '',
                                }),
                                hotelAddress: e.target.value,
                              },
                            })
                          }
                          placeholder="عنوان فندق مكة (أبراج البيت - شارع أجياد)"
                          className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={currentProfile.makkahHotel?.hotelRoom || currentProfile.hotelRoom || ''}
                            onChange={(e) =>
                              updateProfile({
                                ...currentProfile,
                                hotelRoom: e.target.value,
                                makkahHotel: {
                                  ...(currentProfile.makkahHotel || {
                                    hotelName: currentProfile.hotelName || '',
                                    hotelAddress: '',
                                    hotelRoom: '',
                                    hotelDistanceToHaram: '',
                                    hotelPhone: '',
                                  }),
                                  hotelRoom: e.target.value,
                                },
                              })
                            }
                            placeholder="غرفة ودور مكة"
                            className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={currentProfile.makkahHotel?.hotelDistanceToHaram || currentProfile.hotelDistanceToHaram || ''}
                            onChange={(e) =>
                              updateProfile({
                                ...currentProfile,
                                hotelDistanceToHaram: e.target.value,
                                makkahHotel: {
                                  ...(currentProfile.makkahHotel || {
                                    hotelName: currentProfile.hotelName || '',
                                    hotelAddress: '',
                                    hotelRoom: '',
                                    hotelDistanceToHaram: '',
                                    hotelPhone: '',
                                  }),
                                  hotelDistanceToHaram: e.target.value,
                                },
                              })
                            }
                            placeholder="المسافة للحرم المكي"
                            className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                          />
                        </div>
                      </div>

                      {/* Madinah Hotel inputs */}
                      <div className="space-y-1.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-600/30">
                        <div className="flex items-center justify-between pb-1 border-b border-emerald-600/20">
                          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">mosque</span>
                            فندق التسكين في المدينة المنورة:
                          </span>
                          {onOpenCompanySettings && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowProfileModal(false);
                                onOpenCompanySettings('madinah');
                              }}
                              className="text-[10px] text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[12px]">tune</span>
                              نماذج المدينة الجاهزة
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={currentProfile.madinahHotel?.hotelName || ''}
                          onChange={(e) =>
                            updateProfile({
                              ...currentProfile,
                              madinahHotel: {
                                ...(currentProfile.madinahHotel || {
                                  hotelName: '',
                                  hotelAddress: '',
                                  hotelRoom: '',
                                  hotelDistanceToHaram: '',
                                  hotelPhone: '',
                                }),
                                hotelName: e.target.value,
                              },
                            })
                          }
                          placeholder="اسم فندق المدينة (مثال: فندق دار التقوى)"
                          className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                        />
                        <input
                          type="text"
                          value={currentProfile.madinahHotel?.hotelAddress || ''}
                          onChange={(e) =>
                            updateProfile({
                              ...currentProfile,
                              madinahHotel: {
                                ...(currentProfile.madinahHotel || {
                                  hotelName: '',
                                  hotelAddress: '',
                                  hotelRoom: '',
                                  hotelDistanceToHaram: '',
                                  hotelPhone: '',
                                }),
                                hotelAddress: e.target.value,
                              },
                            })
                          }
                          placeholder="عنوان فندق المدينة (المركزية الشمالية)"
                          className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={currentProfile.madinahHotel?.hotelRoom || ''}
                            onChange={(e) =>
                              updateProfile({
                                ...currentProfile,
                                madinahHotel: {
                                  ...(currentProfile.madinahHotel || {
                                    hotelName: '',
                                    hotelAddress: '',
                                    hotelRoom: '',
                                    hotelDistanceToHaram: '',
                                    hotelPhone: '',
                                  }),
                                  hotelRoom: e.target.value,
                                },
                              })
                            }
                            placeholder="غرفة ودور المدينة"
                            className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={currentProfile.madinahHotel?.hotelDistanceToHaram || ''}
                            onChange={(e) =>
                              updateProfile({
                                ...currentProfile,
                                madinahHotel: {
                                  ...(currentProfile.madinahHotel || {
                                    hotelName: '',
                                    hotelAddress: '',
                                    hotelRoom: '',
                                    hotelDistanceToHaram: '',
                                    hotelPhone: '',
                                  }),
                                  hotelDistanceToHaram: e.target.value,
                                },
                              })
                            }
                            placeholder="المسافة للمسجد النبوي"
                            className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Camp inputs */}
                  {(currentProfile.accommodationType === 'camp' || currentProfile.accommodationType === 'both') && (
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant block mb-0.5">موقع مخيم المشاعر بمنى:</label>
                      <input
                        type="text"
                        value={currentProfile.campLocation || ''}
                        onChange={(e) => updateProfile({ ...currentProfile, campLocation: e.target.value })}
                        placeholder="موقع المخيم ورقم السرير"
                        className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant block mb-0.5">رحلة الطيران / وسيلة القدوم:</label>
                    <input
                      type="text"
                      value={currentProfile.flightInfo || ''}
                      onChange={(e) => updateProfile({ ...currentProfile, flightInfo: e.target.value })}
                      placeholder="بيانات رحلة الطيران والتفويج"
                      className="w-full h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/20 text-on-surface outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowProfileModal(false);
                setIsEditingProfile(false);
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors cursor-pointer mt-2"
            >
              تم وحفظ بيانات التسكين
            </button>
          </div>
        </div>
      )}
    </>
  );
};
