import React, { useState } from 'react';
import { TAWAF_DUAS, SAI_DATA, SAFA_STAND_SUNNAH } from '../data/mockData';

interface RitualsCounterScreenProps {
  onShowToast: (msg: string) => void;
}

export const RitualsCounterScreen: React.FC<RitualsCounterScreenProps> = ({ onShowToast }) => {
  const [ritualMode, setRitualMode] = useState<'tawaf' | 'sai'>('sai'); // default to Sa'i or Tawaf
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [selectedGuideStep, setSelectedGuideStep] = useState<number>(1);
  const [showSafaSunnahModal, setShowSafaSunnahModal] = useState<boolean>(false);

  // Active data based on mode
  const activeTawafDua = TAWAF_DUAS[currentLap - 1] || TAWAF_DUAS[0];
  const activeSaiLap = SAI_DATA[currentLap - 1] || SAI_DATA[0];

  const handleNextLap = () => {
    // Vibrate haptic
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {
        // ignore
      }
    }

    if (currentLap < 7) {
      const next = currentLap + 1;
      setCurrentLap(next);
      if (ritualMode === 'sai') {
        const nextSai = SAI_DATA[next - 1];
        onShowToast(`تم إتمام الشوط ${currentLap}! الآن: الشوط ${next} (من ${nextSai.from} إلى ${nextSai.to})`);
      } else {
        onShowToast(`تم إتمام الشوط ${currentLap}! الانتقال للشوط ${next}`);
      }
    } else {
      setCompletedRounds((prev) => prev + 1);
      setCurrentLap(1);
      if (ritualMode === 'sai') {
        onShowToast('هنيئاً لك! أتممت السعي بين الصفا والمروة ٧ أشواط كاملة وانتهيت عند المروة. الآن يحين وقت الحلق أو التقصير.');
      } else {
        onShowToast('تقبل الله! أتممت أشواط الطواف السبعة بنجاح 🕋 صَلِّ ركعتين خلف مقام إبراهيم ثم اشرب من زمزم.');
      }
    }
  };

  const handleReset = () => {
    setCurrentLap(1);
    onShowToast('تمت إعادة ضبط العداد للبدء من الشوط الأول.');
  };

  const handlePlayDuaAudio = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      let textToRead = '';
      if (ritualMode === 'sai') {
        textToRead = `${activeSaiLap.title}. ${activeSaiLap.dua}. وعند العلمين الأخضرين: ${activeSaiLap.greenLightDua}`;
      } else {
        textToRead = `${activeTawafDua.title}. ${activeTawafDua.dua}. وبين الركن اليماني والحجر الأسود: ${activeTawafDua.ruknYamaniToBlackStone}`;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // serene pace
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      onShowToast('ميزة القراءة الصوتية غير مدعومة في هذا المتصفح.');
    }
  };

  const masaGuideInfo = [
    {
      title: 'أدوار المسعى الأربعة',
      desc: 'المسعى مكيف بالكامل ويتكون من الدور الأرضي، الدور الأول، الدور الثاني، والسطح؛ وجميعها متصلة بالمصاعد والسلالم الكهربائية.',
      icon: 'layers',
    },
    {
      title: 'مسار العربات الكهربائية',
      desc: 'مسار مخصص في الميزانين والدور الأول لكبار السن وذوي الإعاقة مع عربات مجانية وأخرى كهربائية مسبقة الحجز عبر منصة نسك.',
      icon: 'accessible',
    },
    {
      title: 'نقاط ماء زمزم البارد',
      desc: 'تنتشر حافظات ماء زمزم المبردة على جانبي المسعى عند الصفا والمروة وبينهما للشرب والترطيب المستمر.',
      icon: 'water_drop',
    },
    {
      title: 'أحكام فقهية ميسرة',
      desc: 'الطهارة في السعي مستحبة وليست شرطاً، ويجوز أخذ قسط من الراحة أو الجلوس أثناء السعي بين الأشواط دون إعادة.',
      icon: 'verified',
    },
  ];

  return (
    <div className="flex flex-col w-full px-gutter max-w-2xl mx-auto space-y-4 pb-28 pt-2">
      {/* Top Title & Subtitle */}
      <section className="flex flex-col space-y-1 pt-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shadow-sm">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              directions_walk
            </span>
            دليل الصفا والمروة والمناسك
          </span>
          <span className="text-xs text-secondary bg-surface-container-low px-2.5 py-1 rounded-full font-medium">
            مكتمل: {completedRounds} سباعيات
          </span>
        </div>
        <h1 className="text-2xl text-primary font-bold tracking-tight">
          {ritualMode === 'sai' ? 'السعي بين الصفا والمروة' : 'طواف الكعبة المشرفة'}
        </h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {ritualMode === 'sai'
            ? 'تتبع أشواط السعي السبعة بالتوجيه المكاني، سُنن الصفا والمروة، ودعاء الهرولة بين العلمين الأخضرين.'
            : 'تتبع أشواطك السبعة بيسر وسكينة مع أدعية كل شوط وسماع التلاوة المأثورة.'}
        </p>
      </section>

      {/* Mode Selector (Tawaf vs Sa'i) */}
      <div className="bg-surface-container p-1 rounded-2xl flex items-center gap-1 shadow-sm border border-outline-variant/20">
        <button
          onClick={() => {
            setRitualMode('sai');
            setCurrentLap(1);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            ritualMode === 'sai'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">directions_walk</span>
          <span className="text-xs sm:text-sm">السعي بين الصفا والمروة</span>
        </button>

        <button
          onClick={() => {
            setRitualMode('tawaf');
            setCurrentLap(1);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            ritualMode === 'tawaf'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-primary font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">flare</span>
          <span className="text-xs sm:text-sm">طواف الكعبة المشرفة</span>
        </button>
      </div>

      {/* SPECIAL FOR SA'I: Visual Safa & Marwah Path Vector Tracker */}
      {ritualMode === 'sai' && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">route</span>
              مسار الشوط {currentLap}: من <strong className="text-secondary">{activeSaiLap.from}</strong> إلى <strong className="text-secondary">{activeSaiLap.to}</strong>
            </span>
            <button
              onClick={() => setShowSafaSunnahModal(true)}
              className="text-xs text-secondary font-bold hover:underline flex items-center gap-1 cursor-pointer bg-secondary/10 px-2.5 py-1 rounded-full"
            >
              <span className="material-symbols-outlined text-[15px]">auto_stories</span>
              <span>سُنّة الوقوف والدعاء</span>
            </button>
          </div>

          {/* Graphical Path Visualizer */}
          <div className="relative p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/15 flex items-center justify-between">
            {/* Start Node */}
            <div className={`flex flex-col items-center ${activeSaiLap.from === 'الصفا' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${activeSaiLap.from === 'الصفا' ? 'bg-primary text-on-primary ring-2 ring-secondary' : 'bg-surface-container text-on-surface-variant'}`}>
                الصفا
              </div>
              <span className="text-[10px] mt-1 font-semibold">{activeSaiLap.from === 'الصفا' ? 'نقطة الانطلاق' : 'نقطة الوصول'}</span>
            </div>

            {/* Path line with Direction Arrow and Green Zone */}
            <div className="flex-1 flex flex-col items-center px-2">
              {/* Green lights neon indicator */}
              <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>العَلَمان الأخضران (هرولة للرجال)</span>
              </div>

              {/* Progress Line */}
              <div className="relative w-full h-2 rounded-full bg-surface-container overflow-hidden flex items-center">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-300"
                  style={{ width: `${(currentLap / 7) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mt-1 font-medium">
                <span>{activeSaiLap.from}</span>
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  {activeSaiLap.from === 'الصفا' ? 'arrow_back' : 'arrow_forward'}
                </span>
                <span>{activeSaiLap.to}</span>
              </div>
            </div>

            {/* End Node */}
            <div className={`flex flex-col items-center ${activeSaiLap.to === 'المروة' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${activeSaiLap.to === 'المروة' ? 'bg-secondary text-on-secondary ring-2 ring-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                المروة
              </div>
              <span className="text-[10px] mt-1 font-semibold">{activeSaiLap.to === 'المروة' ? 'نقطة الوصول' : 'نقطة الانطلاق'}</span>
            </div>
          </div>

          {/* Quick Green Zone Sunnah Notification */}
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">
              light_mode
            </span>
            <div>
              <span className="font-bold block text-emerald-900">دعاء ما بين العلمين الأخضرين (الهرولة):</span>
              <p className="mt-0.5 font-medium leading-relaxed">
                «{activeSaiLap.greenLightDua}»
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Lap Counter Circle Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col items-center relative overflow-hidden">
        {/* Laps indicator dots */}
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentLap(num)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                num === currentLap
                  ? 'bg-primary text-on-primary ring-2 ring-secondary scale-110'
                  : num < currentLap
                  ? 'bg-primary/20 text-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Lap Description Badge */}
        {ritualMode === 'sai' && (
          <div className="mb-2 text-center">
            <span className="text-xs font-bold text-secondary bg-secondary/15 px-3 py-1 rounded-full">
              الشوط {currentLap}: {activeSaiLap.from} ➔ {activeSaiLap.to}
            </span>
          </div>
        )}

        {/* Big Tap Target Button */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Circular progress SVG */}
          <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-surface-container"
              cx="50"
              cy="50"
              fill="none"
              r="44"
              stroke="currentColor"
              strokeWidth="6"
            />
            <circle
              className="text-secondary transition-all duration-500 ease-out"
              cx="50"
              cy="50"
              fill="none"
              r="44"
              stroke="currentColor"
              strokeDasharray={276.4}
              strokeDashoffset={276.4 - (currentLap / 7) * 276.4}
              strokeLinecap="round"
              strokeWidth="6"
            />
          </svg>

          {/* Central Touch Target */}
          <button
            onClick={handleNextLap}
            className="absolute inset-4 rounded-full bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer border-4 border-surface"
          >
            <span className="text-[11px] text-primary-fixed uppercase tracking-wider font-semibold">
              {ritualMode === 'sai' ? `من ${activeSaiLap.from} إلى ${activeSaiLap.to}` : 'الشوط الحالي'}
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold my-0.5 tracking-tight">
              {currentLap} <span className="text-xl sm:text-2xl font-light text-primary-fixed">/ 7</span>
            </span>
            <span className="text-[11px] bg-secondary-fixed text-on-secondary-fixed px-3 py-0.5 rounded-full font-bold shadow-sm mt-1">
              {currentLap === 7
                ? (ritualMode === 'sai' ? 'ختم السعي عند المروة ✓' : 'إتمام السبعة ✓')
                : 'اضغط عند الوصول'}
            </span>
          </button>
        </div>

        {/* Lap Control Reset */}
        <div className="flex items-center gap-3 mt-4 text-xs">
          <button
            onClick={handleReset}
            className="text-on-surface-variant hover:text-error flex items-center gap-1 cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>إعادة ضبط العداد</span>
          </button>
        </div>
      </div>

      {/* Recommended Athkar & Dua for Current Lap */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
            <h3 className="text-sm sm:text-base font-bold text-primary">
              {ritualMode === 'sai' ? activeSaiLap.title : activeTawafDua.title}
            </h3>
          </div>
          <button
            onClick={handlePlayDuaAudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-error text-on-error animate-pulse'
                : 'bg-primary-container text-on-primary hover:bg-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPlayingAudio ? 'stop' : 'volume_up'}
            </span>
            <span>{isPlayingAudio ? 'إيقاف الصوت' : 'استماع للدعاء'}</span>
          </button>
        </div>

        {/* Sacred Dua Text Box */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/15 text-right">
          <p className="text-sm sm:text-base text-on-surface leading-loose font-medium font-sans">
            «{ritualMode === 'sai' ? activeSaiLap.dua : activeTawafDua.dua}»
          </p>
        </div>
      </div>

      {/* Guide to Al-Masa'a Services & Fiqh */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]">hub</span>
            <h2 className="text-base font-bold text-on-surface">إرشادات وأحكام المسعى</h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">خدمات وتيسير</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {masaGuideInfo.map((info, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">{info.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-on-surface">{info.title}</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{info.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safa & Marwah Standing Sunnah Modal */}
      {showSafaSunnahModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/30 text-right flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <button
                onClick={() => setShowSafaSunnahModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <h3 className="font-bold text-base text-primary">سُنّة الوقوف على الصفا والمروة</h3>
            </div>

            {/* Quran Verse */}
            <div className="p-3.5 rounded-xl bg-secondary-container/20 border border-secondary/30">
              <span className="text-xs font-bold text-secondary block mb-1">الآية الكريمة عند الدنو من الصفا أول مرة:</span>
              <p className="text-sm font-bold text-primary font-sans leading-relaxed">
                ﴿ {SAFA_STAND_SUNNAH.quranVerse} ﴾
              </p>
              <span className="text-[11px] text-on-surface-variant block mt-1.5 font-semibold">
                ثم يقول: «{SAFA_STAND_SUNNAH.startSaying}»
              </span>
            </div>

            {/* Standing Takbeer and Dua */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="text-xs font-bold text-primary block mb-1">الذكر المأثور عند صعود الصفا أو المروة:</span>
              <p className="text-sm text-on-surface font-medium leading-loose">
                «{SAFA_STAND_SUNNAH.takbeerAndDua}»
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface block mb-0.5">ملاحظة سُنية هامة:</strong>
              {SAFA_STAND_SUNNAH.sunnahNote}
            </div>

            <button
              onClick={() => setShowSafaSunnahModal(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors cursor-pointer"
            >
              فهمت، بارك الله فيكم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
