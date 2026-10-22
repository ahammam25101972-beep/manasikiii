import React from 'react';
import { TabId } from '../types';

interface BottomNavProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    {
      id: 'al-raisiya' as TabId,
      label: 'الرئيسية',
      icon: 'home',
    },
    {
      id: 'al-manasik-wa-al-idad' as TabId,
      label: 'المناسك والعداد',
      icon: 'counter_7',
    },
    {
      id: 'al-istiadad-wa-al-haqiba' as TabId,
      label: 'الاستعداد والحقيبة',
      icon: 'backpack',
    },
    {
      id: 'al-mukhayyam-wa-al-khadamat' as TabId,
      label: 'المخيم والخدمات',
      icon: 'holiday_village',
    },
    {
      id: 'al-kharita-wa-al-radar' as TabId,
      label: 'الخريطة والرادار',
      icon: 'radar',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(19,78,53,0.06)]">
      <div className="max-w-lg mx-auto grid grid-cols-5 items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 h-14 transition-all duration-200 ${
                isActive
                  ? 'text-secondary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] leading-tight text-center truncate w-full px-0.5 font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-secondary -mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
