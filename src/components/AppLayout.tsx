import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';

const routeToTranslationKey: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/symptoms': 'nav.symptomChecker',
  '/medicines': 'nav.medicineLookup',
  '/interactions': 'nav.drugInteractions',
  '/prescriptions': 'nav.prescriptions',
  '/reminders': 'nav.reminders',
  '/telemedicine': 'nav.telemedicine',
  '/nearby': 'nav.nearby',
  '/consultation': 'nav.consultation',
  '/analytics': 'nav.analytics',
  '/reports': 'nav.reports',
  '/emergency': 'nav.emergency',
  '/inventory': 'nav.inventory',
  '/image-diagnosis': 'nav.imageDiagnosis',
  '/mental-health': 'nav.mentalHealth',
  '/family-health': 'nav.familyHealth',
  '/voice-assistant': 'nav.voiceAssistant',
  '/genetic-profiling': 'nav.geneticProfiling',
  '/wearables': 'nav.wearables',
  '/lab-booking': 'nav.labBooking',
  '/blockchain-records': 'nav.blockchain',
  '/drone-delivery': 'nav.droneDelivery',
  '/hospital-queue': 'nav.hospitalQueue',
  '/auto-refill': 'nav.autoRefill',
  '/global-telemedicine': 'nav.globalTelemedicine',
  '/coming-soon': 'nav.comingSoon',
  '/radiology': 'nav.radiology',
  '/vaccination': 'nav.vaccination',
  '/nutrition': 'nav.nutrition',
  
  '/cardiac-risk': 'nav.cardiacRisk',
  '/insurance': 'nav.insurance',
  '/blood-donation': 'nav.bloodDonation',
  '/yoga': 'nav.yoga',
  '/epigenetics': 'nav.epigenetics',
  '/health-wallet': 'nav.healthWallet',
  '/hearing-health': 'nav.hearingHealth',
};

const AppLayout = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const key = routeToTranslationKey[location.pathname];
  const title = key ? t(key) : 'S47 Health';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title={title} />
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
