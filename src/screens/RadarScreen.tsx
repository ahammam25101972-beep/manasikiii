import React, { useState } from 'react';
import { COMPANIONS } from '../data/mockData';
import { Companion } from '../types';

interface RadarScreenProps {
  onShowToast: (msg: string) => void;
  onOpenQrScanner: () => void;
}

export const RadarScreen: React.FC<RadarScreenProps> = ({ onShowToast, onOpenQrScanner }) => {
  const [activeSegment, setActiveSegment] = useState<'radar' | 'crowd'>('radar');
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('fatima');
  const [companions] = useState<Companion[]>(COMPANIONS);
  const [focusPulse, setFocusPulse] = useState(false);

  const selectedCompanion =
    companions.find((c) => c.id === selectedCompanionId) || companions[0];

  const handleSelectCompanion = (id: string) => {
    setSelectedCompanionId(id);
    setFocusPulse(true);
    setTimeout(() => setFocusPulse(false), 1200);
    const target = companions.find((c) => c.id === id);
    if (target) {
      onShowToast(`تم تحديث التوجيه الراداري إلى ${target.name} (${target.distance})`);
    }
  };

  const handleTriggerMeetup = () => {
    onShowToast('تم تثبيت "بوابة الملك عبدالعزيز" كنقطة تجمع عاجلة ومشاركتها مع المجموعة!');
  };

  const handleSendHapticAlert = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([150, 100, 200, 100, 150]);
      } catch {
        // vibration not supported or allowed
      }
    }
    // Web Audio chime feedback
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable
    }
    onShowToast(`تم إرسال نداء اهتزازي وتنبيه صوتي إلى ${selectedCompanion.name} الآن!`);
  };

  return (
    <div className="flex flex-col w-full px-gutter max-w-2xl mx-auto space-y-4 pb-28 pt-2">
      {/* Status Context Pill Bar */}
      <div className="pt-1 pb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
          <span className="text-xs sm:text-sm text-primary font-semibold">مزامنة الرادار اللحظية: نشطة</span>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-xs">
          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">satellite_alt</span>
          <span className="text-[11px] text-on-surface-variant font-medium">شبكة المشاعر دون إنترنت (Mesh)</span>
        </div>
      </div>

      {/* Segmented View Controller Tabs */}
      <div className="bg-surface-container p-1 rounded-2xl flex items-center gap-1 shadow-sm border border-outline-variant/20">
        <button
          onClick={() => setActiveSegment('radar')}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            activeSegment === 'radar'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">radar</span>
          <span className="text-xs sm:text-sm">رادار الرفاق والمجموعة</span>
        </button>

        <button
          onClick={() => setActiveSegment('crowd')}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            activeSegment === 'crowd'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">groups_3</span>
          <span className="text-xs sm:text-sm">مؤشر الزحام اللحظي</span>
        </button>
      </div>

      {/* SECTION 1: PILGRIM COMPANION RADAR VIEW */}
      {activeSegment === 'radar' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Tactical Circular Radar Screen */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden flex flex-col items-center border border-outline-variant/20">
            {/* Watermark Islamic Geometric Star */}
            <svg
              className="absolute top-2 left-2 w-28 h-28 text-secondary/5 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <polygon points="50,0 62,28 92,20 78,48 100,68 70,78 68,100 44,82 20,95 28,66 2,52 28,34 22,5 48,18"></polygon>
            </svg>

            <div className="w-full flex items-center justify-between mb-2 z-10">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
                <span className="text-sm font-bold text-primary">المجال الراداري المحيط</span>
              </div>
              <span className="bg-surface-container px-2.5 py-0.5 rounded-full text-xs text-primary font-semibold">
                نطاق 500 متر
              </span>
            </div>

            {/* Tactical Radar Display */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
              {/* Concentric Distance Rings */}
              <div className="absolute inset-0 rounded-full border border-dashed border-outline-variant/40 animate-pulse-glow"></div>
              <div className="absolute inset-8 rounded-full bg-surface-container-low/40 border border-outline-variant/30"></div>
              <div className="absolute inset-16 rounded-full bg-surface-container/30 border border-outline-variant/20"></div>
              <div className="absolute inset-24 rounded-full bg-primary/5"></div>

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-outline-variant/30"></div>
              <div className="absolute inset-y-0 left-1/2 w-px bg-outline-variant/30"></div>

              {/* Radar Sweep Cone Animation */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div
                  className="w-full h-full origin-center animate-radar-sweep"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(19, 78, 53, 0.22) 360deg)',
                  }}
                ></div>
              </div>

              {/* Center Node (You / Pilgrim) */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-2 ring-surface">
                  <span className="material-symbols-outlined text-[20px]">person_pin</span>
                </div>
                <span className="mt-1 text-[10px] text-primary font-bold bg-surface-container-lowest/90 px-1.5 rounded shadow-sm">
                  موقعك
                </span>
              </div>

              {/* Node 1: Wife (Fatima) - 45m */}
              <div
                className={`absolute top-12 left-12 z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${
                  selectedCompanionId === 'fatima' ? 'scale-110' : ''
                }`}
                onClick={() => handleSelectCompanion('fatima')}
              >
                <div className="relative">
                  <img
                    className="w-9 h-9 rounded-full object-cover shadow-md ring-2 ring-secondary"
                    alt="فاطمة"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYJ9-7HG5hR3qoF5BlvltjoOhAv5823vqjzhT7dkPRLQDzjaGJ8qZTG1IpBPSdu8QrDs9eC4SEx6SNaNIUjdzp5h0ZgWne6OZBROsA2RqmOSzQomXeSqu04xRlf_kHCoKtClKj9W_PzWcqVtzqoOVXHCJJdJPtqnZfwkiAwrfqcBWWoHuD3GaFVaPjJIU2uOsAcNqvnvQv1yKIrGdJAVOGtmxCswEAYZP1MwEe4K3SQ8eod9dyFjen"
                  />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary rounded-full flex items-center justify-center text-surface shadow">
                    <span className="material-symbols-outlined text-[10px]">favorite</span>
                  </span>
                </div>
                <div className="bg-surface-container-lowest/95 px-1.5 py-0.5 rounded shadow-sm text-center mt-0.5">
                  <p className="text-[10px] font-bold text-on-surface">فاطمة</p>
                  <p className="text-[9px] text-secondary font-bold">45 م</p>
                </div>
              </div>

              {/* Node 2: Friend Ahmad - 180m */}
              <div
                className={`absolute bottom-8 right-10 z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${
                  selectedCompanionId === 'ahmad' ? 'scale-110' : ''
                }`}
                onClick={() => handleSelectCompanion('ahmad')}
              >
                <div className="relative">
                  <img
                    className="w-8 h-8 rounded-full object-cover shadow-md ring-2 ring-primary"
                    alt="أحمد"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3n7SZ1Qfdz3pUAXII_FF1m0lCszUwdexrdiDb26QOmPAeFvICUVOG37acveeoem69aMbQgvJyZQO9pasomyup3iaTPVRtj6qK_REW9KcwqwEnjV3_VuGRQ7fK2j9NnzA1ZAxmHzQyRtj2LR3Koagr6fs2cfEslvAtlugGb-tDEtFvtwZOJy0Knk3U4vIpq6k8Z6bKBa-M8_3pZS-wlOU7DmhTSdmX7RmVtRo6iqpymPT8FvH30sRD"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-1 ring-surface-container-lowest"></span>
                </div>
                <div className="bg-surface-container-lowest/95 px-1.5 py-0.5 rounded shadow-sm text-center mt-0.5">
                  <p className="text-[10px] font-semibold text-on-surface">أحمد</p>
                  <p className="text-[9px] text-on-surface-variant font-medium">180 م</p>
                </div>
              </div>

              {/* Node 3: Father (Camp Mina) */}
              <div
                className={`absolute top-5 right-8 z-20 flex flex-col items-center cursor-pointer opacity-90 transition-transform hover:scale-110 ${
                  selectedCompanionId === 'father' ? 'scale-110' : ''
                }`}
                onClick={() => handleSelectCompanion('father')}
              >
                <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-sm ring-1 ring-outline-variant/30">
                  <span className="material-symbols-outlined text-[16px]">elderly</span>
                </div>
                <span className="text-[9px] text-on-surface-variant font-medium mt-0.5 bg-surface-container-lowest/90 px-1 rounded">
                  الوالد (بالمخيم)
                </span>
              </div>
            </div>

            {/* Radar Legend */}
            <div className="w-full flex items-center justify-between text-on-surface-variant text-[11px] pt-2 border-t border-outline-variant/15">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span>رفيق قريب جداً (&lt;50م)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span>ضمن نطاق البلوتوث المباشر</span>
              </div>
            </div>
          </div>

          {/* Active Heading & Quick Compass Vector Card */}
          <div
            className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden border border-outline-variant/20 transition-all ${
              focusPulse ? 'ring-2 ring-secondary' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[28px] transform -rotate-45">navigation</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-secondary">توجيه حي ومباشر</span>
                  <span className="text-[11px] bg-secondary/15 text-secondary px-2 py-0.5 rounded-full font-bold">
                    المسافة: {selectedCompanion.distance}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-primary truncate mt-0.5">
                  {selectedCompanion.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {selectedCompanion.notes || selectedCompanion.location}
                </p>
              </div>
            </div>

            {/* Action Buttons for Meetup & Ping */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={handleTriggerMeetup}
                className="h-11 px-3 rounded-xl bg-primary-container hover:bg-primary text-on-primary flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm font-semibold text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                <span className="truncate">تحديد نقطة التقاء</span>
              </button>
              <button
                onClick={handleSendHapticAlert}
                className="h-11 px-3 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high flex items-center justify-center gap-1.5 transition-transform active:scale-95 font-semibold text-xs cursor-pointer border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">vibration</span>
                <span className="truncate">نداء تنبيه واهتزاز</span>
              </button>
            </div>
          </div>

          {/* Group Members & Companions List Section */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">family_restroom</span>
                <h2 className="text-base font-bold text-primary">أفراد العائلة والمجموعة</h2>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">3 متصلين الآن</span>
            </div>

            {/* Companion Cards */}
            {companions.map((comp) => (
              <div
                key={comp.id}
                onClick={() => handleSelectCompanion(comp.id)}
                className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-2.5 border cursor-pointer transition-all ${
                  selectedCompanionId === comp.id
                    ? 'border-secondary ring-1 ring-secondary'
                    : 'border-outline-variant/20 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        className="w-12 h-12 rounded-full object-cover"
                        alt={comp.name}
                        src={comp.avatar}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-surface-container-lowest ${
                          comp.isNear ? 'bg-secondary' : 'bg-primary'
                        }`}
                      ></span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-on-surface">{comp.name}</span>
                        {comp.isNear && (
                          <span className="bg-secondary/15 text-secondary text-[10px] px-1.5 py-0.5 rounded font-bold">
                            بجانبك
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-on-surface-variant mt-0.5">{comp.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">
                        {comp.battery > 80
                          ? 'battery_full'
                          : comp.battery > 50
                          ? 'battery_5_bar'
                          : 'battery_3_bar'}
                      </span>
                      <span>{comp.battery}%</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      {comp.connectionType}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">share_location</span>
                    <span className="text-primary font-medium">
                      {comp.isNear ? 'مشاركة الموقع المباشر تعمل بنجاح' : `المسافة الحالية: ${comp.distance}`}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">تحديث لحظي</span>
                </div>
              </div>
            ))}

            {/* Add Companion Banner */}
            <div className="p-4 rounded-2xl bg-surface-container-high/60 flex items-center justify-between gap-3 border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-primary">إضافة رفيق أو فرد جديد</span>
                  <span className="text-xs text-on-surface-variant">عبر مسح الباركود الشخصي أو رمز الحملة</span>
                </div>
              </div>
              <button
                onClick={onOpenQrScanner}
                className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-transform active:scale-95 shrink-0 cursor-pointer shadow-sm"
              >
                مسح QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LIVE CROWD & DENSITY INDEX VIEW */}
      {activeSegment === 'crowd' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Campaign Supervisor Alert */}
          <div className="bg-secondary-fixed/50 rounded-2xl p-4 sm:p-5 shadow-sm border border-secondary/30 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">campaign</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-on-secondary-fixed">
                  تنبيه عاجل من مشرف حملة مناسِكي
                </span>
                <span className="text-[11px] text-on-secondary-fixed-variant">
                  صادر الساعة 02:15 ظهراً • توجيه إلزامي
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-on-secondary-fixed leading-relaxed">
              تم تعليق الذهاب إلى منشأة الجمرات مؤقتاً حتى الساعة{' '}
              <span className="font-bold underline">04:00 عصراً</span> لتفادي الإجهاد الحراري وذروة الزحام.
              نرجو من جميع الحجاج الكرام الاسترخاء والبقاء في خيامهم بمشعر منى.
            </p>
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-on-secondary-fixed-variant font-medium">الوقت الموصى به: 4:30 عصراً</span>
              <span className="bg-secondary text-on-secondary text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                تم التعميم على المرشدين
              </span>
            </div>
          </div>

          {/* Quick Crowd Index Legend */}
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-sm border border-outline-variant/20 flex items-center justify-around text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="font-medium text-on-surface">انسيابي وسلس</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span className="font-medium text-on-surface">متوسط الكثافة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-error"></span>
              <span className="font-medium text-on-surface">شديد / تجنب الآن</span>
            </div>
          </div>

          {/* Mataf Area Breakdown */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">flare</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-primary">صحن المطاف - المسجد الحرام</h3>
                  <span className="text-xs text-on-surface-variant">تحديث لحظي عبر الحساسات الذكية</span>
                </div>
              </div>
              <span className="bg-error-container text-on-error-container text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                كثافة متفاوتة
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Ground level */}
              <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-error shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-on-surface">الصحن الأرضي (مستوى الكعبة)</span>
                    <span className="text-[11px] text-on-surface-variant">مخصص للإحرام فقط</span>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end">
                  <span className="text-xs font-bold text-error">زحام كثيف جداً (94%)</span>
                  <span className="text-[10px] text-on-surface-variant">متوسط الشوط: 25 دقيقة</span>
                </div>
              </div>

              {/* First floor */}
              <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-secondary shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-on-surface">الدور الأول للمطاف</span>
                    <span className="text-[11px] text-on-surface-variant">للمحرمين والمصلين</span>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end">
                  <span className="text-xs font-bold text-secondary">متوسط الحركة (58%)</span>
                  <span className="text-[10px] text-on-surface-variant">متوسط الشوط: 18 دقيقة</span>
                </div>
              </div>

              {/* Roof */}
              <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-primary shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-on-surface">السطح ومسار العربات الكهربائية</span>
                    <span className="text-[11px] text-on-surface-variant">موصى به لكبار السن</span>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end">
                  <span className="text-xs font-bold text-primary">انسيابي ومفتوح (22%)</span>
                  <span className="text-[10px] text-on-surface-variant">متوسط الشوط: 14 دقيقة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safa & Marwah Multi-Tier Density Breakdown */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">directions_walk</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-on-surface">مسار السعي (الصفا والمروة)</h4>
                  <span className="text-xs text-on-surface-variant">كافة أدوار المسعى الأربعة وعربات التردد</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-primary/15 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold">
                  انسيابي ومريح
                </span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">درجة التكييف 21° مئوية</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-on-surface">الدور الأرضي (الصفا)</span>
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                </div>
                <span className="text-[11px] text-secondary font-bold">متوسط (48%)</span>
                <span className="text-[10px] text-on-surface-variant">للمشاة المباشرين</span>
              </div>

              <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-on-surface">الدور الأول والميزانين</span>
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <span className="text-[11px] text-primary font-bold">خفيف (24%)</span>
                <span className="text-[10px] text-on-surface-variant">عربات كبار السن</span>
              </div>

              <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-on-surface">الدور الثاني</span>
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <span className="text-[11px] text-primary font-bold">انسيابي جداً (18%)</span>
                <span className="text-[10px] text-on-surface-variant">مناسب للعائلات</span>
              </div>

              <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-on-surface">سطح المسعى</span>
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <span className="text-[11px] text-primary font-bold">مفتوح (12%)</span>
                <span className="text-[10px] text-on-surface-variant">يفضل بعد الغروب</span>
              </div>
            </div>
          </div>

          {/* Jamarat Facility */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">hub</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-primary">منشأة جسر الجمرات</h3>
                  <span className="text-xs text-on-surface-variant">خطة التفويج المعتمدة ليوم النحر والتشريق</span>
                </div>
              </div>
              <span className="bg-surface-container px-2.5 py-1 rounded-full text-xs text-secondary font-bold">
                تحديث التفويج
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-surface-container-low p-3 rounded-xl flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">الدور الأرضي</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                </div>
                <span className="text-xs text-primary font-bold">متاح وانسيابي (30%)</span>
                <span className="text-[10px] text-on-surface-variant">مداخل المشاة من منى الغربية</span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">الدور الثالث (الأنفاق)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                </div>
                <span className="text-xs text-secondary font-bold">متوسط الكثافة (65%)</span>
                <span className="text-[10px] text-on-surface-variant">موصى به لحملتنا بعد العصر</span>
              </div>
            </div>

            <div className="bg-surface-container-high/50 p-3 rounded-xl flex items-center justify-between mt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">alarm_on</span>
                <span className="text-primary font-medium">الوقت المثالي لتفويج حملة مناسِكي:</span>
              </div>
              <span className="text-secondary font-bold">04:30 عصراً</span>
            </div>
          </div>

          {/* Train & Shuttle */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">train</span>
              </div>
              <div className="flex flex-col">
                <h4 className="text-xs sm:text-sm font-bold text-on-surface">قطار المشاعر والحافلات</h4>
                <span className="text-xs text-on-surface-variant">محطة منى (1) ومحطة مزدلفة</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-[13px]">timer</span>
                <span>12 دقيقة انتظار</span>
              </div>
              <span className="text-[10px] text-on-surface-variant mt-1">تواتر الرحلات منتظم</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
