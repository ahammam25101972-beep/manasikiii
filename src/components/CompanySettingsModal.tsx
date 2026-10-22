import React, { useState, useEffect } from 'react';
import { TourismCompany } from '../types';

export interface HotelInfo {
  hotelName: string;
  hotelAddress: string;
  hotelRoom: string;
  hotelDistanceToHaram: string;
  hotelPhone: string;
}

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: TourismCompany;
  makkahHotelData?: Partial<HotelInfo>;
  madinahHotelData?: Partial<HotelInfo>;
  hotelData?: Partial<HotelInfo>; // legacy fallback
  onSave: (
    updatedCompany: TourismCompany,
    updatedMakkahHotel: HotelInfo,
    updatedMadinahHotel: HotelInfo
  ) => void;
  onShowToast: (msg: string) => void;
  initialTab?: 'company' | 'makkah' | 'madinah' | 'hotel';
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  isOpen,
  onClose,
  company,
  makkahHotelData,
  madinahHotelData,
  hotelData,
  onSave,
  onShowToast,
  initialTab = 'company',
}) => {
  const normalizedTab = initialTab === 'hotel' ? 'makkah' : initialTab;
  const [activeTab, setActiveTab] = useState<'company' | 'makkah' | 'madinah'>(normalizedTab);
  const [companyForm, setCompanyForm] = useState<TourismCompany>(company);

  const [makkahForm, setMakkahForm] = useState<HotelInfo>({
    hotelName: makkahHotelData?.hotelName || hotelData?.hotelName || 'فندق سويس أوتيل المقام - مكة المكرمة',
    hotelAddress: makkahHotelData?.hotelAddress || hotelData?.hotelAddress || 'وقف الملك عبدالعزيز - أبراج البيت، ساحة الحرم المكي، شارع أجياد',
    hotelRoom: makkahHotelData?.hotelRoom || hotelData?.hotelRoom || 'غرفة 1408 • الدور 14',
    hotelDistanceToHaram: makkahHotelData?.hotelDistanceToHaram || hotelData?.hotelDistanceToHaram || '50 متراً (مباشر على صحن الحرم المكي)',
    hotelPhone: makkahHotelData?.hotelPhone || hotelData?.hotelPhone || '+966125717777',
  });

  const [madinahForm, setMadinahForm] = useState<HotelInfo>({
    hotelName: madinahHotelData?.hotelName || 'فندق دار التقوى - المدينة المنورة',
    hotelAddress: madinahHotelData?.hotelAddress || 'المنطقة المركزية الشمالية، أمام ساحات المسجد النبوي وباب النساء',
    hotelRoom: madinahHotelData?.hotelRoom || 'جناح 520 • الدور 5',
    hotelDistanceToHaram: madinahHotelData?.hotelDistanceToHaram || 'خطوات معدودة (أمام ساحات المسجد النبوي وباب السلام)',
    hotelPhone: madinahHotelData?.hotelPhone || '+966148295555',
  });

  useEffect(() => {
    setActiveTab(initialTab === 'hotel' ? 'makkah' : initialTab);
  }, [initialTab]);

  useEffect(() => {
    setCompanyForm(company);
    if (makkahHotelData || hotelData) {
      setMakkahForm({
        hotelName: makkahHotelData?.hotelName || hotelData?.hotelName || '',
        hotelAddress: makkahHotelData?.hotelAddress || hotelData?.hotelAddress || '',
        hotelRoom: makkahHotelData?.hotelRoom || hotelData?.hotelRoom || '',
        hotelDistanceToHaram: makkahHotelData?.hotelDistanceToHaram || hotelData?.hotelDistanceToHaram || '',
        hotelPhone: makkahHotelData?.hotelPhone || hotelData?.hotelPhone || '',
      });
    }
    if (madinahHotelData) {
      setMadinahForm({
        hotelName: madinahHotelData.hotelName || '',
        hotelAddress: madinahHotelData.hotelAddress || '',
        hotelRoom: madinahHotelData.hotelRoom || '',
        hotelDistanceToHaram: madinahHotelData.hotelDistanceToHaram || '',
        hotelPhone: madinahHotelData.hotelPhone || '',
      });
    }
  }, [company, makkahHotelData, madinahHotelData, hotelData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(companyForm, makkahForm, madinahForm);
    onShowToast(`تم حفظ وتحديث بيانات الشركة وفندقي مكة والمدينة بنجاح!`);
    onClose();
  };

  const handleApplyCompanyPreset = (
    presetName: string,
    license: string,
    hotline: string,
    whatsapp: string,
    supervisor: string
  ) => {
    setCompanyForm((prev) => ({
      ...prev,
      name: presetName,
      licenseNumber: license,
      hotline,
      whatsapp,
      supervisorName: supervisor,
    }));
    onShowToast(`تم تطبيق نموذج: ${presetName}`);
  };

  const handleApplyMakkahPreset = (
    name: string,
    address: string,
    room: string,
    distance: string,
    phone: string
  ) => {
    setMakkahForm({
      hotelName: name,
      hotelAddress: address,
      hotelRoom: room,
      hotelDistanceToHaram: distance,
      hotelPhone: phone,
    });
    onShowToast(`تم اختيار فندق مكة: ${name}`);
  };

  const handleApplyMadinahPreset = (
    name: string,
    address: string,
    room: string,
    distance: string,
    phone: string
  ) => {
    setMadinahForm({
      hotelName: name,
      hotelAddress: address,
      hotelRoom: room,
      hotelDistanceToHaram: distance,
      hotelPhone: phone,
    });
    onShowToast(`تم اختيار فندق المدينة: ${name}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-5 sm:p-6 shadow-2xl border border-outline-variant/30 text-right flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-primary">
              إدارة شركة السياحة وفنادق التسكين
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
          </div>
        </div>

        {/* 3-Tab Switchers: Company / Makkah Hotel / Madinah Hotel */}
        <div className="bg-surface-container-low p-1 rounded-2xl flex items-center gap-1 border border-outline-variant/15 text-[11px] sm:text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'company'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-primary font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">business</span>
            <span className="truncate">شركة السياحة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('makkah')}
            className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'makkah'
                ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-secondary font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">apartment</span>
            <span className="truncate">فندق مكة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('madinah')}
            className={`flex-1 py-2 px-1.5 sm:px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'madinah'
                ? 'bg-emerald-700 text-white font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-emerald-700 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">mosque</span>
            <span className="truncate">فندق المدينة</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* TAB 1: COMPANY SETTINGS */}
          {activeTab === 'company' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-surface-container-low p-3 rounded-xl space-y-2 border border-outline-variant/15 text-xs">
                <span className="text-[11px] font-bold text-secondary block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  اختر نموذج شركة جاهز للتجربة السريعة:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyCompanyPreset(
                        'شركة وفادة لخدمات الحج والعمرة والسياحة',
                        'ترخيص وزارة الحج: 1042 / سياحة: 7421',
                        '920012345',
                        '+966501234567',
                        'أ. عبد الرحمن الغامدي (المشرف العام)'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-primary text-primary font-bold text-[11px]"
                  >
                    شركة وفادة المعتمدة
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyCompanyPreset(
                        'شركة النور والضيافة لخدمات الحج والعمرة',
                        'ترخيص وزارة الحج: 1088 / سياحة: 3341',
                        '920088990',
                        '+966551122334',
                        'م. عادل الشريف (مشرف الحملة)'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-primary text-primary font-bold text-[11px]"
                  >
                    شركة النور والضيافة
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyCompanyPreset(
                        'وكالة رواف المشاعر للسياحة والرحلات',
                        'ترخيص سياحي معتمد: 9021',
                        '920044556',
                        '+966509988776',
                        'أ. سلطان المطيري (المشرف الميداني)'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-primary text-primary font-bold text-[11px]"
                  >
                    وكالة رواف المشاعر
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  اسم شركة السياحة أو الحملة:
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="مثال: شركة الهدى للسياحة وخدمات الحج والعمرة"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  رقم الترخيص الرسمي (وزارة الحج والعمرة / وزارة السياحة):
                </label>
                <input
                  type="text"
                  value={companyForm.licenseNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, licenseNumber: e.target.value })}
                  placeholder="مثال: ترخيص وزارة الحج 1042 / ترخيص سياحي 7780"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    الخط الساخن للمكالمات (24 ساعة):
                  </label>
                  <input
                    type="text"
                    value={companyForm.hotline}
                    onChange={(e) => setCompanyForm({ ...companyForm, hotline: e.target.value })}
                    placeholder="مثال: 920012345"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    رقم الواتساب الرسمي المعتمد:
                  </label>
                  <input
                    type="text"
                    value={companyForm.whatsapp}
                    onChange={(e) => setCompanyForm({ ...companyForm, whatsapp: e.target.value })}
                    placeholder="مثال: +966501234567"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    اسم المشرف العام للرحلة:
                  </label>
                  <input
                    type="text"
                    value={companyForm.supervisorName || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, supervisorName: e.target.value })}
                    placeholder="مثال: أ. عبد الرحمن الغامدي"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    هاتف طوارئ المشرف الميداني:
                  </label>
                  <input
                    type="text"
                    value={companyForm.emergencyPhone || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, emergencyPhone: e.target.value })}
                    placeholder="مثال: +966509998877"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MAKKAH HOTEL SETTINGS */}
          {activeTab === 'makkah' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-secondary/10 p-3 rounded-xl space-y-2 border border-secondary/30 text-xs">
                <span className="text-[11px] font-bold text-secondary block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">apartment</span>
                  نماذج سريعة لفنادق مكة المكرمة (الحرم المكي):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMakkahPreset(
                        'فندق سويس أوتيل المقام - أبراج البيت',
                        'وقف الملك عبدالعزيز - ساحة الحرم المكي، شارع أجياد، مكة',
                        'غرفة 1408 • الدور 14',
                        '50 متراً (مباشر على ساحة الحرم)',
                        '+966125717777'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-secondary text-secondary font-bold text-[11px]"
                  >
                    سويس أوتيل المقام
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMakkahPreset(
                        'فندق فيرمونت برج الساعة الملكي',
                        'مجمع أبراج البيت، مدخل برج الساعة، ساحة الحرم المكي',
                        'جناح 2204 • الدور 22',
                        'مباشر على صحن الحرم المكي الشريف',
                        '+966125717333'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-secondary text-secondary font-bold text-[11px]"
                  >
                    فيرمونت برج الساعة
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMakkahPreset(
                        'فندق دار التوحيد إنتركونتيننتال',
                        'شارع إبراهيم الخليل، أمام باب الملك فهد، مكة المكرمة',
                        'غرفة 512 • الدور 5',
                        '20 متراً من باب الملك فهد',
                        '+966125414000'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-secondary text-secondary font-bold text-[11px]"
                  >
                    دار التوحيد إنتركونتيننتال
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMakkahPreset(
                        'فندق جبل عمر كونراد مكة',
                        'مشروع جبل عمر، شارع إبراهيم الخليل، مكة المكرمة',
                        'غرفة 915 • الدور 9',
                        '150 متراً مشياً لصحن الحرم',
                        '+966125308777'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-secondary text-secondary font-bold text-[11px]"
                  >
                    جبل عمر كونراد
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  اسم فندق التسكين في مكة المكرمة:
                </label>
                <input
                  type="text"
                  required
                  value={makkahForm.hotelName}
                  onChange={(e) => setMakkahForm({ ...makkahForm, hotelName: e.target.value })}
                  placeholder="مثال: فندق سويس أوتيل المقام"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-secondary text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  العنوان التفصيلي وموقع فندق مكة:
                </label>
                <input
                  type="text"
                  required
                  value={makkahForm.hotelAddress}
                  onChange={(e) => setMakkahForm({ ...makkahForm, hotelAddress: e.target.value })}
                  placeholder="مثال: وقف الملك عبدالعزيز - مجمع أبراج البيت، شارع أجياد"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-secondary text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    رقم الغرفة والدور في مكة:
                  </label>
                  <input
                    type="text"
                    value={makkahForm.hotelRoom}
                    onChange={(e) => setMakkahForm({ ...makkahForm, hotelRoom: e.target.value })}
                    placeholder="مثال: غرفة 1408 • الدور 14"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-secondary text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    المسافة لصحن الحرم المكي الشريف:
                  </label>
                  <input
                    type="text"
                    value={makkahForm.hotelDistanceToHaram}
                    onChange={(e) =>
                      setMakkahForm({ ...makkahForm, hotelDistanceToHaram: e.target.value })
                    }
                    placeholder="مثال: 50 متراً (مباشر على الحرم)"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-secondary text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  هاتف استقبال فندق مكة المكرمة:
                </label>
                <input
                  type="text"
                  value={makkahForm.hotelPhone}
                  onChange={(e) => setMakkahForm({ ...makkahForm, hotelPhone: e.target.value })}
                  placeholder="مثال: +966125717777"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-secondary text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MADINAH HOTEL SETTINGS */}
          {activeTab === 'madinah' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-emerald-500/10 p-3 rounded-xl space-y-2 border border-emerald-600/30 text-xs">
                <span className="text-[11px] font-bold text-emerald-800 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">mosque</span>
                  نماذج سريعة لفنادق المدينة المنورة (المسجد النبوي):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMadinahPreset(
                        'فندق دار التقوى - المدينة المنورة',
                        'المنطقة المركزية الشمالية، أمام ساحات المسجد النبوي وباب النساء',
                        'جناح 520 • الدور 5',
                        'خطوات معدودة (أمام ساحة الحرم النبوي مباشرة)',
                        '+966148295555'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-emerald-600 text-emerald-800 font-bold text-[11px]"
                  >
                    دار التقوى المدينة
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMadinahPreset(
                        'فندق أوبروي المدينة The Oberoi',
                        'المنطقة المركزية الشمالية، أمام باب السلام والروضة الشريفة',
                        'غرفة 714 • الدور 7',
                        '50 متراً من باب السلام والروضة الشريفة',
                        '+966148282222'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-emerald-600 text-emerald-800 font-bold text-[11px]"
                  >
                    أوبروي المدينة
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMadinahPreset(
                        'فندق أنوار المدينة موفنبيك',
                        'المنطقة المركزية الغربية، ساحات المسجد النبوي الشريف',
                        'غرفة 1102 • الدور 11',
                        '100 متراً من ساحات الحرم النبوي',
                        '+966148181000'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-emerald-600 text-emerald-800 font-bold text-[11px]"
                  >
                    أنوار المدينة موفنبيك
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMadinahPreset(
                        'فندق شذا المدينة',
                        'شارع الملك فهد، المنطقة المركزية الشمالية، المدينة المنورة',
                        'غرفة 806 • الدور 8',
                        '180 متراً من المسجد النبوي الشريف',
                        '+966148290001'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/20 hover:border-emerald-600 text-emerald-800 font-bold text-[11px]"
                  >
                    شذا المدينة
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  اسم فندق التسكين في المدينة المنورة:
                </label>
                <input
                  type="text"
                  required
                  value={madinahForm.hotelName}
                  onChange={(e) => setMadinahForm({ ...madinahForm, hotelName: e.target.value })}
                  placeholder="مثال: فندق دار التقوى - المدينة المنورة"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  العنوان التفصيلي وموقع فندق المدينة:
                </label>
                <input
                  type="text"
                  required
                  value={madinahForm.hotelAddress}
                  onChange={(e) => setMadinahForm({ ...madinahForm, hotelAddress: e.target.value })}
                  placeholder="مثال: المنطقة المركزية الشمالية، أمام ساحة المسجد النبوي"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    رقم الغرفة والدور في المدينة:
                  </label>
                  <input
                    type="text"
                    value={madinahForm.hotelRoom}
                    onChange={(e) => setMadinahForm({ ...madinahForm, hotelRoom: e.target.value })}
                    placeholder="مثال: جناح 520 • الدور 5"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface block mb-1">
                    المسافة للمسجد النبوي الشريف والروضة:
                  </label>
                  <input
                    type="text"
                    value={madinahForm.hotelDistanceToHaram}
                    onChange={(e) =>
                      setMadinahForm({ ...madinahForm, hotelDistanceToHaram: e.target.value })
                    }
                    placeholder="مثال: خطوات معدودة (أمام ساحة الحرم النبوي)"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  هاتف استقبال فندق المدينة المنورة:
                </label>
                <input
                  type="text"
                  value={madinahForm.hotelPhone}
                  onChange={(e) => setMadinahForm({ ...madinahForm, hotelPhone: e.target.value })}
                  placeholder="مثال: +966148295555"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>حفظ وتطبيق التعديلات في التطبيق فوراً</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-surface-container text-on-surface font-medium text-xs hover:bg-surface-container-high cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
