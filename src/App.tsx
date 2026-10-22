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

import { HomeScreen } from './screens/HomeScreen';
import { RitualsCounterScreen } from './screens/RitualsCounterScreen';
import { PreparationScreen } from './screens/PreparationScreen';
import { CampScreen } from './screens/CampScreen';
import { RadarScreen } from './screens/RadarScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('al-istiadad-wa-al-haqiba');
  const [deviceFrame, setDeviceFrame] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);
  const [docModalOpen, setDocModalOpen] = useState<boolean>(false);

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

  const handleConfirmEmergency = () => {
    showToast('تم إرسال النداء العاجل! المسعف وطبيب المخيم في طريقهما إلى سريرك (جناح ج سرير 18) خلال دقيقتين.');
  };

  const handleAddCompanionFromQr = (name: string, relation: string) => {
    showToast(`تمت إضافة ${name} (${relation}) إلى شبكة رادار المشاعر بنجاح!`);
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

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {currentTab === 'al-raisiya' && (
            <HomeScreen
              onNavigateTab={setCurrentTab}
              onShowToast={showToast}
              company={userProfile.tourismCompany}
              userProfile={userProfile}
              onOpenCompanySettings={handleOpenCompanySettings}
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
        </main>

        {/* Persistent Bottom Navigation Bar */}
        <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Interactive Global Toast */}
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

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
      </div>
    </div>
  );
}
