import React, { useState, useEffect } from 'react';
import { UserProfile, FamilyMember } from '../types';

interface PilgrimDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onShowToast: (msg: string) => void;
  initialMode?: 'individual' | 'company';
}

export const PilgrimDataModal: React.FC<PilgrimDataModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSave,
  onShowToast,
  initialMode = 'individual',
}) => {
  const [activeEdition, setActiveEdition] = useState<'individual' | 'company'>(initialMode);
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  // New family member draft
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('الزوجة');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberPassport, setNewMemberPassport] = useState('');
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile, isOpen]);

  useEffect(() => {
    setActiveEdition(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      onShowToast('يرجى كتابة اسم فرد العائلة أو المرافق');
      return;
    }
    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newMemberName.trim(),
      relation: newMemberRelation,
      phone: newMemberPhone.trim() || undefined,
      passportOrId: newMemberPassport.trim() || undefined,
    };
    setFormData((prev) => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), newMember],
    }));
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberPassport('');
    setShowAddMemberForm(false);
    onShowToast(`تمت إضافة ${newMember.name} (${newMember.relation}) إلى قائمة العائلة بنجاح!`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: (prev.familyMembers || []).filter((m) => m.id !== id),
    }));
    onShowToast(`تم حذف ${name} من قائمة المرافقين`);
  };

  const handleLoadDemoIndividual = () => {
    setFormData((prev) => ({
      ...prev,
      name: 'أحمد عبد الله الشريف',
      badgeId: 'HK-1446-88219',
      phone: '+966551234567',
      passportOrId: 'A28914029',
      nationality: 'مصري',
      nusukType: 'tamattu',
      hotelName: 'فندق سويس أوتيل المقام - مكة المكرمة',
      hotelRoom: 'غرفة 1408 • الدور 14',
      makkahHotel: {
        hotelName: 'فندق سويس أوتيل المقام - مكة المكرمة',
        hotelAddress: 'أبراج البيت، ساحة الحرم المكي الشريف',
        hotelRoom: 'غرفة 1408 • الدور 14',
        hotelDistanceToHaram: '50 متراً من الحرم',
        hotelPhone: '+966125717777',
        city: 'makkah',
      },
      madinahHotel: {
        hotelName: 'فندق دار التقوى - المدينة المنورة',
        hotelAddress: 'المنطقة المركزية أمام ساحات المسجد النبوي',
        hotelRoom: 'جناح 520 • الدور 5',
        hotelDistanceToHaram: 'خطوات من المسجد النبوي',
        hotelPhone: '+966148295555',
        city: 'madinah',
      },
      campLocation: 'مخيم 42 منى • جناح (ج) سرير 18',
      flightInfo: 'رحلة SV-1034 - مطار الملك عبدالعزيز بجدة',
      familyMembers: [
        { id: 'f-1', name: 'فاطمة الزهراء الشريف', relation: 'الزوجة', phone: '+966559876543' },
        { id: 'f-2', name: 'الحاج عبد الله أحمد', relation: 'الوالد', phone: '+966558877665' },
        { id: 'f-3', name: 'عمر أحمد عبد الله', relation: 'الابن', phone: '+966554433221' },
      ],
    }));
    onShowToast('تم تحميل نموذج بيانات معتمر وعائلة جاهز للتجربة!');
  };

  const handleLoadDemoCompany = () => {
    setFormData((prev) => ({
      ...prev,
      campaignName: 'شركة وفادة العالمية لخدمات حجاج ومعتمري الخارج',
      tourismCompany: {
        name: 'شركة وفادة لخدمات الحج والعمرة والسياحة',
        licenseNumber: 'ترخيص وزارة الحج: 1042 / سياحة: 7421',
        hotline: '920012345',
        whatsapp: '+966501234567',
        emergencyPhone: '+966509998877',
        branchCity: 'مكة المكرمة - جدة - القاهرة',
        supervisorName: 'أ. عبد الرحمن الغامدي (المشرف العام للرحلة)',
      },
    }));
    onShowToast('تم تطبيق نموذج معتمد لشركة سياحة وحملة كبرى!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onShowToast('يرجى إدخال اسم الحاج أو المعتمر');
      return;
    }
    onSave(formData);
    onShowToast('تم حفظ وتحديث بيانات الحاج والعائلة بنجاح!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-surface-container-lowest p-5 sm:p-7 shadow-2xl border border-outline-variant/30 text-right flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-primary">إدخال وتعديل بيانات المعتمر أو الحاج</h2>
              <p className="text-xs text-on-surface-variant">
                سواء كنت مسافراً فردياً مع عائلتك أو منظماً لحملة شركة سياحية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Edition Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container p-1 rounded-2xl border border-outline-variant/20">
          <button
            type="button"
            onClick={() => setActiveEdition('individual')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeEdition === 'individual'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">family_restroom</span>
            <span>إصدار الأفراد والعائلات (B2C)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveEdition('company')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeEdition === 'company'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">business</span>
            <span>إصدار شركات السياحة والحملات (B2B)</span>
          </button>
        </div>

        {/* Quick Presets Banner */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs">
          <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">auto_fix_high</span>
            <span>اختصار للتجربة السريعة:</span>
          </span>
          <div className="flex gap-2">
            {activeEdition === 'individual' ? (
              <button
                type="button"
                onClick={handleLoadDemoIndividual}
                className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-colors cursor-pointer"
              >
                تعبئة نموذج عائلة تجريبي ⚡
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLoadDemoCompany}
                className="px-2.5 py-1 rounded-lg bg-secondary/15 hover:bg-secondary/25 text-secondary font-bold transition-colors cursor-pointer"
              >
                تعبئة بيانات شركة معتمدة 🏢
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* SECTION 1: Personal Data */}
          <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/15 pb-2">
              <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">person</span>
                البيانات الشخصية للحاج أو المعتمر
              </span>
              <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                أساسي
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  الاسم الرباعي الكامل: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: أحمد عبد الله الشريف"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  رقم الشارة الذكية / الكود:
                </label>
                <input
                  type="text"
                  value={formData.badgeId}
                  onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                  placeholder="مثال: HK-1446-88219"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  رقم الجوال (مع مفتاح الدولة):
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="مثال: +966551234567"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  رقم جواز السفر أو الهوية:
                </label>
                <input
                  type="text"
                  value={formData.passportOrId || ''}
                  onChange={(e) => setFormData({ ...formData, passportOrId: e.target.value })}
                  placeholder="مثال: A28914029"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  الجنسية:
                </label>
                <input
                  type="text"
                  value={formData.nationality || ''}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="مثال: مصري / سعودي / إماراتي"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  نوع النسك:
                </label>
                <select
                  value={formData.nusukType || 'tamattu'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nusukType: e.target.value as 'umrah' | 'tamattu' | 'qiran' | 'ifrad',
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                >
                  <option value="umrah">عمرة فقط</option>
                  <option value="tamattu">حج تمتع (عمرة ثم حج)</option>
                  <option value="qiran">حج قِران (حج وعمرة معاً)</option>
                  <option value="ifrad">حج إفراد (حج فقط)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Accommodation & Hotels */}
          <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/15 pb-2">
              <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">hotel</span>
                بيانات السكن والتسكين (مكة والمدينة والمشاعر)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  فندق مكة المكرمة:
                </label>
                <input
                  type="text"
                  value={formData.makkahHotel?.hotelName || formData.hotelName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hotelName: e.target.value,
                      makkahHotel: {
                        ...(formData.makkahHotel || {
                          hotelName: '',
                          hotelAddress: 'مكة المكرمة - أجياد',
                          hotelRoom: '',
                          hotelDistanceToHaram: 'مباشر على الحرم',
                          hotelPhone: '',
                          city: 'makkah',
                        }),
                        hotelName: e.target.value,
                      },
                    })
                  }
                  placeholder="مثال: فندق سويس أوتيل المقام"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  رقم الغرفة والدور بمكة:
                </label>
                <input
                  type="text"
                  value={formData.makkahHotel?.hotelRoom || formData.hotelRoom || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hotelRoom: e.target.value,
                      makkahHotel: {
                        ...(formData.makkahHotel || {
                          hotelName: formData.hotelName || '',
                          hotelAddress: '',
                          hotelRoom: '',
                          hotelDistanceToHaram: '',
                          hotelPhone: '',
                          city: 'makkah',
                        }),
                        hotelRoom: e.target.value,
                      },
                    })
                  }
                  placeholder="مثال: غرفة 1408 • الدور 14"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  فندق المدينة المنورة:
                </label>
                <input
                  type="text"
                  value={formData.madinahHotel?.hotelName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      madinahHotel: {
                        ...(formData.madinahHotel || {
                          hotelName: '',
                          hotelAddress: 'المنطقة المركزية',
                          hotelRoom: '',
                          hotelDistanceToHaram: 'خطوات من المسجد النبوي',
                          hotelPhone: '',
                          city: 'madinah',
                        }),
                        hotelName: e.target.value,
                      },
                    })
                  }
                  placeholder="مثال: فندق دار التقوى - المدينة"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  رقم الغرفة بالمدينة:
                </label>
                <input
                  type="text"
                  value={formData.madinahHotel?.hotelRoom || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      madinahHotel: {
                        ...(formData.madinahHotel || {
                          hotelName: '',
                          hotelAddress: '',
                          hotelRoom: '',
                          hotelDistanceToHaram: '',
                          hotelPhone: '',
                          city: 'madinah',
                        }),
                        hotelRoom: e.target.value,
                      },
                    })
                  }
                  placeholder="مثال: جناح 520 • الدور 5"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  مخيم المشاعر ورقم السرير (منى / عرفة):
                </label>
                <input
                  type="text"
                  value={formData.campLocation || ''}
                  onChange={(e) => setFormData({ ...formData, campLocation: e.target.value })}
                  placeholder="مثال: مخيم 42 منى • جناح (ج) سرير 18"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  رحلة القدوم والمطار:
                </label>
                <input
                  type="text"
                  value={formData.flightInfo || ''}
                  onChange={(e) => setFormData({ ...formData, flightInfo: e.target.value })}
                  placeholder="مثال: رحلة SV-1034 - مطار الملك عبدالعزيز بجدة"
                  className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface outline-none focus:ring-2 focus:ring-primary text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Family Members & Companions */}
          <div className="p-4 rounded-2xl bg-secondary-fixed/30 border border-secondary/30 space-y-3">
            <div className="flex items-center justify-between border-b border-secondary/20 pb-2">
              <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-secondary">family_restroom</span>
                بيانات أفراد العائلة والمرافقين ({(formData.familyMembers || []).length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs hover:bg-secondary-fixed-dim"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showAddMemberForm ? 'remove' : 'add'}
                </span>
                <span>{showAddMemberForm ? 'إلغاء' : 'إضافة مرافق جديد'}</span>
              </button>
            </div>

            {/* Quick Add Form */}
            {showAddMemberForm && (
              <div className="p-3 rounded-xl bg-surface border border-secondary/40 space-y-2 animate-in fade-in duration-200">
                <span className="font-bold text-xs text-primary block">إضافة فرد جديد من العائلة:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="اسم فرد العائلة (مثال: فاطمة)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface text-xs outline-none"
                  />
                  <select
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    className="h-9 px-2 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface text-xs outline-none"
                  >
                    <option value="الزوجة">الزوجة</option>
                    <option value="الزوج">الزوج</option>
                    <option value="الوالد">الوالد</option>
                    <option value="الوالدة">الوالدة</option>
                    <option value="الابن">الابن</option>
                    <option value="الابنة">الابنة</option>
                    <option value="الأخ">الأخ</option>
                    <option value="الأخت">الأخت</option>
                    <option value="مرافق">مرافق</option>
                    <option value="صديق">صديق</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="رقم الجوال (اختياري)"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface text-xs outline-none"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container cursor-pointer shadow-sm"
                  >
                    تأكيد وإضافة المرافق
                  </button>
                </div>
              </div>
            )}

            {/* Family Members List */}
            {(formData.familyMembers || []).length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-2">
                لا يوجد مرافقون مضافون حالياً. اضغط على زر &quot;إضافة مرافق جديد&quot; أعلاه لإضافة عائلتك.
              </p>
            ) : (
              <div className="space-y-2">
                {(formData.familyMembers || []).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-outline-variant/20 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-on-surface">{member.name}</span>
                          <span className="text-[10px] bg-secondary/20 text-secondary font-bold px-1.5 py-0.2 rounded">
                            {member.relation}
                          </span>
                        </div>
                        {member.phone && (
                          <span className="text-[11px] text-on-surface-variant block mt-0.5">
                            {member.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      className="text-rose-600 hover:text-rose-700 p-1 rounded hover:bg-rose-50 cursor-pointer"
                      title="حذف المرافق"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: Tourism Company (for B2B or Campaign) */}
          {activeEdition === 'company' && (
            <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-secondary">domain</span>
                  بيانات شركة السياحة والحملة المعتمدة (B2B)
                </span>
                <span className="text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">
                  إصدار الشركات
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    اسم شركة السياحة أو الحملة:
                  </label>
                  <input
                    type="text"
                    value={formData.tourismCompany?.name || formData.campaignName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        campaignName: e.target.value,
                        tourismCompany: {
                          ...(formData.tourismCompany || {
                            licenseNumber: '',
                            hotline: '',
                            whatsapp: '',
                            emergencyPhone: '',
                            branchCity: '',
                            supervisorName: '',
                          }),
                          name: e.target.value,
                        },
                      })
                    }
                    placeholder="مثال: شركة وفادة لخدمات الحج والعمرة والسياحة"
                    className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-bold text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    رقم الترخيص المعتمد:
                  </label>
                  <input
                    type="text"
                    value={formData.tourismCompany?.licenseNumber || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tourismCompany: {
                          ...(formData.tourismCompany || {
                            name: formData.campaignName,
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
                    placeholder="ترخيص وزارة الحج: 1042 / سياحة: 7421"
                    className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    اسم المشرف العام للرحلة:
                  </label>
                  <input
                    type="text"
                    value={formData.tourismCompany?.supervisorName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tourismCompany: {
                          ...(formData.tourismCompany || {
                            name: formData.campaignName,
                            licenseNumber: '',
                            hotline: '',
                            whatsapp: '',
                            emergencyPhone: '',
                            branchCity: '',
                          }),
                          supervisorName: e.target.value,
                        },
                      })
                    }
                    placeholder="أ. عبد الرحمن الغامدي"
                    className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    رقم واتساب المشرف المباشر:
                  </label>
                  <input
                    type="text"
                    value={formData.tourismCompany?.whatsapp || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tourismCompany: {
                          ...(formData.tourismCompany || {
                            name: formData.campaignName,
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
                    placeholder="+966501234567"
                    className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    الخط الساخن للطوارئ (Hotline):
                  </label>
                  <input
                    type="text"
                    value={formData.tourismCompany?.hotline || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tourismCompany: {
                          ...(formData.tourismCompany || {
                            name: formData.campaignName,
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
                    placeholder="920012345"
                    className="w-full h-10 px-3 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-bold text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>حفظ واعتماد بيانات الحاج والعائلة</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
