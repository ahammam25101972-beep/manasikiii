import React, { useState } from 'react';
import { ChecklistCategory, ChecklistItem } from '../types';
import { INITIAL_CATEGORIES } from '../data/mockData';

interface PreparationScreenProps {
  onShowToast: (msg: string) => void;
}

export const PreparationScreen: React.FC<PreparationScreenProps> = ({ onShowToast }) => {
  const [categories, setCategories] = useState<ChecklistCategory[]>(INITIAL_CATEGORIES);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategoryForNew, setSelectedCategoryForNew] = useState('cat-3');

  // Compute statistics
  const allItems = categories.flatMap((cat) => cat.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter((item) => item.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remainingCount = totalCount - completedCount;

  // Toggle item completion
  const handleToggleItem = (itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      }))
    );
  };

  // Toggle accordion for category
  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Toggle all categories collapse
  const handleToggleAll = () => {
    const nextState = !allCollapsed;
    setAllCollapsed(nextState);
    const updated: Record<string, boolean> = {};
    categories.forEach((cat) => {
      updated[cat.id] = nextState;
    });
    setCollapsedCategories(updated);
  };

  // Add custom item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newItemText.trim(),
      description: 'مهمة مخصصة أضفتها بنفسك إلى حقيبتك',
      completed: false,
      category: selectedCategoryForNew,
      isCustom: true,
    };

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategoryForNew
          ? { ...cat, items: [...cat.items, newItem] }
          : cat
      )
    );

    setNewItemText('');
    onShowToast(`تمت إضافة "${newItem.title}" إلى حقيبتك بنجاح!`);
  };

  // Share via WhatsApp / Copy
  const handleShare = () => {
    const shareMessage = `السلام عليكم ورحمة الله وبركاته،\nأشارككم قائمة تجهيز حقيبة الحج واستعداداتي عبر تطبيق «مناسِكي»:\n- نسبة الجاهزية الحالية: ${percentage}%\n- تم إنجاز: ${completedCount} من أصل ${totalCount} مهمة.\n- متبقي: 6 أيام على المغادرة إلى مكة المكرمة.\nأسألكم الدعاء، وحفظكم الله جميعاً.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
      onShowToast('تم نسخ تقرير الحقيبة إلى الحافظة ومشاركته!');
    }

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Circular progress SVG calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.2
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col w-full px-gutter max-w-2xl mx-auto space-y-4 pb-28 pt-2">
      {/* Status & Motivational Header */}
      <section className="flex flex-col space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shadow-sm">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              flight_takeoff
            </span>
            رحلة الحج المباركة ١٤٤٦هـ
          </span>
          <span className="inline-flex items-center gap-1 text-secondary text-xs bg-surface-container-low px-2.5 py-1 rounded-full font-medium">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            متبقي 6 أيام على الإقلاع
          </span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl text-primary font-bold tracking-tight">
            حقيبة الاستعداد لرحلة العمر
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
            من عقد النية إلى صعود الطائرة.. خطواتك الموثقة لاستعداد روحي ولوجستي متكامل في رعاية الله.
          </p>
        </div>
      </section>

      {/* Visual Hero Readiness Card with Circular Progress & Stats */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary p-5 sm:p-6 shadow-xl">
        {/* Subtle Islamic Star Pattern Watermark in SVG */}
        <svg
          className="absolute -left-10 -bottom-10 w-44 h-44 text-on-primary-container opacity-10 pointer-events-none"
          fill="currentColor"
          viewBox="0 0 100 100"
        >
          <polygon points="50,0 63,35 98,35 70,57 81,91 50,70 19,91 30,57 2,35 37,35"></polygon>
          <circle cx="50" cy="50" fill="none" r="38" stroke="currentColor" strokeWidth="3"></circle>
        </svg>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Circular Progress Ring */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                <circle
                  className="text-tertiary-container opacity-40"
                  cx="48"
                  cy="48"
                  fill="none"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                />
                <circle
                  className="text-secondary-fixed transition-all duration-700 ease-out"
                  cx="48"
                  cy="48"
                  fill="none"
                  r={radius}
                  stroke="currentColor"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="7"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-on-primary">{percentage}%</span>
                <span className="text-[10px] text-primary-fixed-dim">المكتمل</span>
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-secondary-fixed">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-sm font-bold">
                  {percentage >= 80 ? 'جاهزية استثنائية' : 'جاهزية ممتازة'}
                </span>
              </div>
              <p className="text-xs text-surface-container-high opacity-95 mt-0.5">
                أنجزت <span className="font-bold text-on-primary">{completedCount}</span> من أصل {totalCount} مهمة تحضيرية
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-primary-fixed">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                <span>باقي خطوات يسيرة لبلوغ الطمأنينة الكاملة</span>
              </div>
            </div>
          </div>

          {/* Quick Action Pill Inside Card */}
          <button
            onClick={handleShare}
            className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim font-semibold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>مشاركة الحقيبة مع الرفقاء</span>
          </button>
        </div>

        {/* Micro Linear Progress Bar for Visual Weight */}
        <div className="mt-4 pt-3 border-t border-primary-fixed/20 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[12px] text-surface-container-highest">
            <span>مستوى الاستعداد العام</span>
            <span className="font-semibold text-secondary-fixed">{remainingCount} مهام متبقية</span>
          </div>
          <div className="w-full h-2 rounded-full bg-tertiary-container overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary-fixed to-secondary-container transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Interactive Smart Tip Card */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-start gap-3.5 border-r-4 border-secondary">
        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            lightbulb
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary">نصيحة مناسِكي لليوم</span>
            <span className="text-[11px] text-on-surface-variant">قبل المغادرة</span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface mt-1 leading-relaxed">
            احرص على وضع حقيبة أدوية الطوارئ والتقارير الطبية في حقيبة يدك المرافقة على متن الطائرة وليس في حقائب الشحن، تحسباً لأي تأخير لوجستي.
          </p>
        </div>
      </section>

      {/* Categories Container with Filter / Quick Jump Chips */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-on-surface font-bold">
            أقسام التجهيز والمهمات
          </h2>
          <button
            onClick={handleToggleAll}
            className="text-secondary text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">swap_vert</span>
            <span>{allCollapsed ? 'فتح الكل' : 'طي الكل'}</span>
          </button>
        </div>

        {/* Category Accordions */}
        {categories.map((cat) => {
          const catCompleted = cat.items.filter((i) => i.completed).length;
          const catTotal = cat.items.length;
          const isCollapsed = !!collapsedCategories[cat.id];
          const catPercentage = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

          return (
            <div
              key={cat.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm transition-all duration-200 border border-outline-variant/15"
            >
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-on-surface">{cat.title}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          catPercentage === 100
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {catPercentage === 100 ? 'مكتمل 100%' : `مكتمل ${catPercentage}%`}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{cat.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-secondary">
                    {catCompleted} / {catTotal}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-200">
                    {isCollapsed ? 'expand_more' : 'expand_less'}
                  </span>
                </div>
              </div>

              {/* Checklist Items */}
              {!isCollapsed && (
                <div className="mt-3 pt-2 space-y-2.5">
                  {cat.items.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer select-none border border-outline-variant/10 ${
                        item.completed
                          ? 'bg-surface hover:bg-surface-container-low'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleItem(item.id)}
                        className="mt-1 w-5 h-5 rounded accent-primary text-on-primary cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs sm:text-sm block transition-all ${
                            item.completed
                              ? 'line-through opacity-75 font-normal text-on-surface'
                              : 'font-semibold text-on-surface'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[11px] text-outline font-normal mt-0.5 block">
                          {item.description}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[20px] shrink-0 ${
                          item.completed ? 'text-primary' : 'text-outline-variant'
                        }`}
                        style={item.completed ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Interactive Add Custom Item Section */}
      <section className="bg-surface-container-low rounded-2xl p-4 shadow-sm border border-outline-variant/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-[22px]">add_task</span>
            <span>إضافة غرض أو مهمة خاصة إلى حقيبتي</span>
          </div>
          <span className="text-[11px] text-on-surface-variant font-medium">مخصصة لك</span>
        </div>

        <form onSubmit={handleAddItem} className="flex flex-col gap-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="مثال: نظارات قراءة إضافية، سجادة صلاة جيب..."
              className="flex-1 h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
            />
            <select
              value={selectedCategoryForNew}
              onChange={(e) => setSelectedCategoryForNew(e.target.value)}
              className="h-12 px-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs outline-none border border-outline-variant/20 font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>إضافة للحقيبة</span>
          </button>
        </form>
      </section>

      {/* Floating Sticky Action Button on Mobile */}
      <div className="sticky bottom-20 z-20 flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-2xl border border-outline-variant/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
            <span className="material-symbols-outlined text-[22px]">backpack</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-on-surface-variant font-medium">الحقيبة الرقمية</span>
            <span className="text-xs text-primary font-bold truncate">جاهز للإقلاع قريباً</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            aria-label="مشاركة عبر واتساب"
            title="مشاركة عبر واتساب"
            className="w-10 h-10 rounded-xl bg-surface-container-high hover:bg-surface-container text-primary flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
          <button
            onClick={scrollToTop}
            className="px-3.5 h-10 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">expand_less</span>
            <span>أعلى الشاشة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
